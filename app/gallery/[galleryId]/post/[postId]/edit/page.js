"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import styles from "./edit.module.css";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function EditPostPage({ params }) {
    const router = useRouter();
    const unwrappedParams = React.use(params);
    const { galleryId, postId } = unwrappedParams;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState(0);
    const [mounted, setMounted] = useState(false);
    const quillRef = useRef(null);
  

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

  // 기존 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/regions/gallery/post",
          {
            params: { gallery_id: galleryId, post_id: postId },
          }
        );
        const post = response.data[0];
        setTitle(post.title);
        setContent(post.content);
      } catch (err) {
        setError("게시글을 불러오는데 실패했습니다.");
      }
    };

    if (galleryId && postId) {
      fetchPost();
    }
  }, [galleryId, postId]);

  const handleImageUpload = useCallback(async () => {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        const file = input.files[0];
        
        if (file.size > 2 * 1024 * 1024) {
          alert('파일 크기는 2MB 이하여야 합니다.');
          reject(new Error('File too large'));
          return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
          const res = await axios.post(
            "http://127.0.0.1:8000/api/regions/gallery/postImage",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
              timeout: 30000,
            }
          );

          if (!res.data?.url) {
            throw new Error('이미지 URL을 받지 못했습니다.');
          }

          resolve(res.data.url);
        } catch (err) {
          console.error("이미지 업로드 실패:", err);
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
              quill.insertEmbed(range.index, "image", imageUrl);
            } catch (error) {
              console.error("이미지 삽입 실패:", error);
            }
          },
        },
      },
    }),
    [handleImageUpload]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = {
        gallery_id: galleryId,
        post_id: postId,
        user_id: userId,
        title: title,
        content: content,
      };

      const response = await axios.put(
        "http://127.0.0.1:8000/api/regions/gallery/post",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message || "게시글이 성공적으로 수정되었습니다.");
      router.push(`/gallery/${galleryId}/post/${postId}`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "게시글 수정 중 문제가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>글 수정하기</h1>
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
              ref={quillRef}
              value={content}
              onChange={setContent}
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
          {loading ? "수정 중..." : "수정하기"}
        </button>
      </form>
    </section>
  );
}