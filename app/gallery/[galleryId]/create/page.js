'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import styles from './create.module.css';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function CreatePostPage({ params }) {
  const router = useRouter();
  const { galleryId } = React.use(params);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [token, setToken] = useState('');
  const [userName, setUserName] = useState('알 수 없음');
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUserName = localStorage.getItem('user_name');
      const storedUserId = localStorage.getItem('user_id');

      setToken(storedToken || '');
      setUserName(storedUserName || '알 수 없음');
      setUserId(Number(storedUserId) || 0);
    }
  }, []);

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
  
      console.log('Request Data:', data);
      const response = await axios.post(
        'http://127.0.0.1:8000/api/regions/gallery/post',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert(response.data.message || '게시글이 성공적으로 작성되었습니다.');
      router.push(`/gallery/${galleryId}`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || '게시글 작성 중 문제가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>갤러리 {galleryId} 글쓰기</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
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
          <ReactQuill
            value={content}
            onChange={setContent}
            placeholder="내용을 입력하세요"
          />
        </div>
        <div>
          <label htmlFor="file" className={styles.label}>
            첨부파일
          </label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
            className={styles.fileInput}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button
          type="submit"
          className={`${styles.button} ${loading ? styles.loading : ''}`}
          disabled={loading}
        >
          {loading ? '작성 중...' : '글쓰기'}
        </button>
      </form>
    </div>
  );
}
