'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill 스타일 적용
import styles from './edit.module.css';

export default function EditPostPage({ params }) {
  const { galleryId, postId } = React.use(params);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/regions/gallery/post', {
          params: { gallery_id: galleryId, post_id: postId },
        });
        const post = response.data[0];
        setTitle(post.title);
        setContent(post.content);
      } catch (err) {
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      }
    };
    fetchPost();
  }, [galleryId, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://127.0.0.1:8000/api/regions/gallery/post',
        { gallery_id: galleryId, post_id: postId, title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('게시글이 수정되었습니다.');
      window.location.href = `/gallery/${galleryId}/post/${postId}`;
    } catch (err) {
      setError('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        className={styles.titleInput}
      />
      <ReactQuill
        value={content}
        onChange={setContent}
        placeholder="내용을 입력하세요"
        className={styles.contentInput}
        theme="snow"
      />
      <button type="submit" className={styles.submitButton}>
        수정 완료
      </button>
    </form>
  );
}
