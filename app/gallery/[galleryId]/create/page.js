'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import styles from './create.module.css';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function CreatePostPage({ params }) {
  const [galleryId, setGalleryId] = useState(null);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem('user_name');
    const storedUserId = localStorage.getItem('user_id'); // 로컬스토리지에서 user_id 가져오기

    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      setUserName('알 수 없음');
    }

    if (storedUserId) {
      setUserId(Number(storedUserId)); // user_id를 숫자로 변환
    } else {
      setUserId(0); // 기본값 설정
    }

    const fetchParams = async () => {
      const resolvedParams = await params;
      setGalleryId(resolvedParams.galleryId);
    };

    fetchParams();
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const postData = {
        gallery_id: galleryId,
        user_id: userId,
        user_name: userName,
        title: title,
        content: content,
      };

      await axios.post('http://127.0.0.1:8000/api/regions/gallery/post', postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('서버로 보내는 데이터:', postData)

      alert('게시글이 성공적으로 작성되었습니다.');
      router.push(`/gallery/${galleryId}`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('게시글 작성 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>갤러리 {galleryId} 글쓰기</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="userName" className={styles.label}>작성자</label>
          <input
            type="text"
            id="userName"
            value={userName}
            readOnly
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="title" className={styles.label}>제목</label>
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
          <label htmlFor="content" className={styles.label}>내용</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            placeholder="내용을 입력하세요"
          />
        </div>
        <div>
          <label htmlFor="file" className={styles.label}>첨부파일</label>
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
          className={styles.button}
          disabled={loading}
        >
          {loading ? '작성 중...' : '글쓰기'}
        </button>
      </form>
    </div>
  );
}
