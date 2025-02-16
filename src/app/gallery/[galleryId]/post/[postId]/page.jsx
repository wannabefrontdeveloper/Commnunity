"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styles from "./page.module.css";
import DOMPurify from "dompurify";

export default function PostDetailPage({ params }) {
  const [galleryId, setGalleryId] = useState(null);
  const [postId, setPostId] = useState(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [editingPassword, setEditingPassword] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const fetchPostDetail = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/regions/gallery/post",
        {
          params: { gallery_id: galleryId, post_id: postId },
        }
      );
      setPost(response.data[0]);
    } catch (err) {
      if (err.response?.status === 422) {
        setError(
          "부적절한 접근입니다. gallery_id 또는 post_id가 누락되었습니다."
        );
      } else if (err.response?.status === 500) {
        setError("게시글이 존재하지 않습니다.");
      } else {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [galleryId, postId]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/regions/gallery/post/comments",
        {
          params: { post_id: postId },
        }
      );

      console.log("댓글 목록 조회:", response.data);
      if (Array.isArray(response.data)) {
        setComments(response.data);
      } else {
        console.warn("Unexpected comments format:", response.data);
        setComments([]);
      }
    } catch (err) {
      console.error("댓글 불러오기 오류:", err);
      setComments([]);
    }
  }, [postId]);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setGalleryId(resolvedParams.galleryId);
      setPostId(resolvedParams.postId);
    };

    resolveParams();
    setUserName(localStorage.getItem("user_name"));
  }, [params]);

  useEffect(() => {
    if (galleryId && postId) {
      fetchPostDetail();
      fetchComments();
    }
  }, [galleryId, postId, fetchPostDetail, fetchComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    try {
      const userId = localStorage.getItem("user_id");
      const userName = localStorage.getItem("user_name");
      const token = localStorage.getItem("token");

      const requestData = {
        gallery_id: galleryId,
        post_id: postId,
        user_id: parseInt(userId, 10),
        user_name: userName,
        content: comment,
        password: password,
      };

      await axios.post(
        "http://127.0.0.1:8000/api/regions/gallery/post/comments",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchComments();

      setComment("");
      setPassword("");
    } catch (err) {
      console.error("댓글 작성 오류:", err);

      if (err.response?.status === 500) {
        alert("서버에서 문제가 발생했습니다. 관리자에게 문의하세요.");
      } else {
        alert("댓글 작성 중 오류가 발생했습니다.");
      }
    }
  };

  const handleDelete = async () => {
    const currentUserName = localStorage.getItem("user_name");

    if (!currentUserName) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (currentUserName !== post.user_name) {
      alert("본인이 작성한 게시글만 삭제할 수 있습니다.");
      return;
    }

    if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        const userId = localStorage.getItem("user_id");
        const requestBody = {
          gallery_id: galleryId,
          user_id: parseInt(userId, 10),
        };
        const token = localStorage.getItem("token");

        const response = await axios.delete(
          "http://127.0.0.1:8000/api/regions/gallery/post",
          {
            data: requestBody,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          alert("게시글이 삭제되었습니다.");
          window.location.href = `/gallery/${galleryId}`;
        }
      } catch (err) {
        if (err.response?.status === 403) {
          alert("글을 삭제할 권한이 없습니다.");
        } else {
          alert("게시글 삭제 중 오류가 발생했습니다.");
        }
      }
    }
  };

  const handleEdit = () => {
    window.location.href = `/gallery/${galleryId}/post/${postId}/edit`;
  };

  const handleDeleteComment = async (commentId, commentUsername) => {
    console.log("Delete button clicked:", { commentId, commentUsername });
    const currentUserName = localStorage.getItem("user_name");

    if (!currentUserName) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (currentUserName !== commentUsername) {
      alert("본인이 작성한 댓글만 삭제할 수 있습니다.");
      return;
    }

    const password = prompt("댓글 작성 시 입력한 비밀번호를 입력하세요.");
    if (!password) return;

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");

      await axios.delete(
        "http://127.0.0.1:8000/api/regions/gallery/post/comments",
        {
          data: {
            post_id: parseInt(postId, 10),
            comment_id: commentId,
            user_id: parseInt(userId, 10),
            password: password,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("댓글이 삭제되었습니다.");
      fetchComments();
    } catch (err) {
      console.error("Delete error:", err.response?.data);
      if (err.response?.status === 402) {
        alert("비밀번호가 올바르지 않습니다.");
      } else if (err.response?.status === 403) {
        alert("댓글을 삭제할 권한이 없습니다.");
      } else if (err.response?.status === 404) {
        alert("해당 댓글을 찾을 수 없습니다.");
      } else if (err.response?.status === 422) {
        alert("필수 정보가 누락되었습니다.");
      } else {
        alert("댓글 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleEditComment = async (
    commentId,
    currentContent,
    commentUsername
  ) => {
    const currentUserName = localStorage.getItem("user_name");

    if (!currentUserName) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (currentUserName !== commentUsername) {
      alert("본인이 작성한 댓글만 수정할 수 있습니다.");
      return;
    }

    // HTML 태그 제거하고 순수 텍스트만 추출
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = currentContent;
    const plainText = tempDiv.textContent || tempDiv.innerText;

    setEditingCommentId(commentId);
    setEditingCommentContent(plainText);
  };

  const handleSubmitCommentEdit = async (commentId) => {
    try {
      if (!editingPassword.trim()) {
        alert("댓글을 작성했을 때의 비밀번호를 입력해주세요.");
        return;
      }

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");

      await axios.put(
        "http://127.0.0.1:8000/api/regions/gallery/post/comments",
        {
          post_id: parseInt(postId, 10),
          comment_id: commentId,
          user_id: parseInt(userId, 10),
          password: editingPassword,
          content: editingCommentContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingCommentId(null);
      setEditingCommentContent("");
      setEditingPassword("");
      fetchComments();
    } catch (err) {
      console.error("댓글 수정 오류:", err);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      alert("답글을 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    try {
      const userId = localStorage.getItem("user_id");
      const userName = localStorage.getItem("user_name");
      const token = localStorage.getItem("token");

      const requestData = {
        gallery_id: galleryId,
        post_id: postId,
        user_id: parseInt(userId, 10),
        user_name: userName,
        content: replyContent,
        password: password,
        parent_comment_id: replyingTo,
      };

      await axios.post(
        "http://127.0.0.1:8000/api/regions/gallery/post/comments",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchComments();
      setReplyingTo(null);
      setReplyContent("");
      setPassword("");
    } catch (err) {
      console.error("답글 작성 오류:", err);
      alert("답글 작성 중 오류가 발생했습니다.");
    }
  };

  const renderComments = (comments) => {
    const parentComments = comments.filter(
      (comment) => !comment.parent_comment_id
    );

    return parentComments.map((comment) => {
      const replies = comments.filter(
        (reply) => reply.parent_comment_id === comment.id
      );

      return (
        <li key={comment.id} className={styles.comment}>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>{comment.username}</span>
            <div className={styles.commentActions}>
              {localStorage.getItem("user_name") === comment.username && (
                <>
                  <button
                    onClick={() =>
                      handleEditComment(
                        comment.id,
                        comment.content,
                        comment.username
                      )
                    }
                    className={styles.commentEditButton}
                  >
                    수정
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteComment(comment.id, comment.username)
                    }
                    className={styles.commentDeleteButton}
                  >
                    삭제
                  </button>
                </>
              )}
              <button
                onClick={() => setReplyingTo(comment.id)}
                className={styles.replyButton}
              >
                답글
              </button>
            </div>
          </div>
          <p
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(comment.content),
            }}
          />

          {replies.length > 0 && (
            <ul className={styles.replies}>
              {replies.map((reply) => (
                <li key={reply.id} className={styles.reply}>
                  <div className={styles.replyHeader}>
                    <span className={styles.replyAuthor}>
                      ↳ {reply.username}
                    </span>
                    {localStorage.getItem("user_name") === reply.username && (
                      <div className={styles.replyActions}>
                        <button
                          onClick={() =>
                            handleEditComment(
                              reply.id,
                              reply.content,
                              reply.username
                            )
                          }
                          className={styles.commentEditButton}
                        >
                          수정
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteComment(reply.id, reply.username)
                          }
                          className={styles.commentDeleteButton}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                  <p
                    className={styles.replyContent}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(reply.content),
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    });
  };

  if (loading) {
    return <p className={styles.loading}>로딩 중...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!post) {
    return <p className={styles.noPost}>게시글을 찾을 수 없습니다.</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{post.title}</h1>
      <p className={styles.author}>
        작성자: {post.user_name} | 작성일:{" "}
        {new Date(post.created_at).toLocaleString()}
      </p>
      <p className={styles.views}>조회수: {post.views}</p>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
      <div className={styles.actions}>
        <button className={styles.editButton} onClick={handleEdit}>
          수정
        </button>
        <button className={styles.deleteButton} onClick={handleDelete}>
          삭제
        </button>
      </div>
      <div className={styles.commentsSection}>
        <h2>댓글</h2>
        <ul className={styles.commentsList}>
          {comments.length === 0 ? (
            <p className={styles.noComments}>댓글이 없습니다.</p>
          ) : (
            renderComments(comments)
          )}
        </ul>
        {replyingTo ? (
          <form onSubmit={handleReplySubmit} className={styles.commentForm}>
            <div className={styles.replyingToHeader}>
              {comments.find((c) => c.id === replyingTo)?.username}님에게 답글
              작성 중...
              <button
                onClick={() => setReplyingTo(null)}
                className={styles.cancelReplyButton}
              >
                취소
              </button>
            </div>
            <input
              type="text"
              value={userName || ""}
              readOnly
              placeholder={userName || "작성자 이름"}
              className={styles.commentAuthor}
            />
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="답글을 입력하세요"
              className={styles.commentInput}
            ></textarea>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className={styles.commentPassword}
            />
            <button type="submit" className={styles.commentButton}>
              답글 작성
            </button>
          </form>
        ) : (
          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <input
              type="text"
              value={userName || ""}
              readOnly
              placeholder={userName || "작성자 이름"}
              className={styles.commentAuthor}
            />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력하세요"
              className={styles.commentInput}
            ></textarea>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className={styles.commentPassword}
            />
            <button type="submit" className={styles.commentButton}>
              댓글 작성
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
