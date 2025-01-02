"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import styles from "./create.module.css";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreatePostPage({ params }) {
  const router = useRouter();
  const { galleryId } = React.use(params);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedUserName = localStorage.getItem("user_name");
      const storedUserId = localStorage.getItem("user_id");

      setToken(storedToken || "");
      setUserName(storedUserName || "");
      setUserId(Number(storedUserId) || 0);
    }
  }, []);

  const handleImageUpload = useCallback(async () => {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        const file = input.files[0];
        const formData = new FormData();
        formData.append("image", file);

        console.log("서버로 보내는 데이터:");
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });

        try {
          const res = await axios.post(
            "http://127.0.0.1:8000/api/regions/gallery/postImage",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("서버에서 반환된 데이터:", res.data);

          const imageUrl = res.data.url;
          resolve(imageUrl);
        } catch (err) {
          console.error("이미지 업로드 실패:", err);
          console.error("에러 응답 데이터:", err.response?.data);
          reject(err);
        }
      };
    });
  }, [token]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
        ],
        handlers: {
          image: async function () {
            const quill = this.quill;
            let range = quill.getSelection();

            if (!range) {
              quill.setSelection(quill.getLength());
              range = quill.getSelection();
            }

            try {
              const imageUrl = await handleImageUpload();
              console.log("삽입된 이미지 URL:", imageUrl);

              quill.insertEmbed(range.index, "image", imageUrl);
            } catch (error) {
              console.error("이미지 삽입 실패:", error);
            }
          },
        },
      },
      clipboard: {
        matchers: [
          [
            "img",
            async (node, delta) => {
              const imageSrc = node.getAttribute("src");
              if (imageSrc.startsWith("data:image")) {
                try {
                  const res = await fetch(imageSrc);
                  const blob = await res.blob();
                  const formData = new FormData();
                  formData.append("image", blob);

                  const response = await axios.post(
                    "http://127.0.0.1:8000/api/regions/gallery/postImage",
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  const uploadedUrl = response.data.url;
                  console.log("드래그 앤 드롭 이미지 업로드 URL:", uploadedUrl);

                  return {
                    ops: [
                      {
                        insert: { image: uploadedUrl },
                      },
                    ],
                  };
                } catch (err) {
                  console.error("드래그 앤 드롭 이미지 업로드 실패:", err);
                  return delta;
                }
              }
              return delta;
            },
          ],
        ],
      },
    }),
    [token, handleImageUpload]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = {
        gallery_id: galleryId,
        user_id: userId,
        user_name: userName,
        title: title,
        content: content,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/regions/gallery/post",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message || "게시글이 성공적으로 작성되었습니다.");
      router.push(`/gallery/${galleryId}`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "게시글 작성 중 문제가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>갤러리 {galleryId} 글쓰기</h1>
        <div>
          <label htmlFor="userName" className={styles.label}>
            작성자
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            readOnly
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="title" className={styles.label}>
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            placeholder="제목을 입력하세요"
          />
        </div>
        <div className={styles.quillContainer}>
          <label htmlFor="content" className={styles.label}>
            내용
          </label>
          {mounted && (
            <ReactQuill
              value={content}
              onChange={setContent}
              placeholder="내용을 입력하세요"
              modules={modules}
            />
          )}
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button
          type="submit"
          className={`${styles.button} ${loading ? styles.loading : ""}`}
          disabled={loading}
        >
          {loading ? "작성 중..." : "글쓰기"}
        </button>
      </form>
    </section>
  );
}
