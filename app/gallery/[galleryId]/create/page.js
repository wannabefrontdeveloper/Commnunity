'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // React-Quill 스타일 임포트

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function CreatePostPage({ params }) {
  const [galleryId, setGalleryId] = useState(null); // galleryId 상태 관리
  const router = useRouter(); // 페이지 이동을 위한 useRouter 훅
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // React-Quill에서 가져올 내용
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(''); // user_id 입력 필드 추가
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // params를 비동기적으로 처리
  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setGalleryId(resolvedParams.galleryId);
    };

    fetchParams();
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !userName || !userId) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // API 호출로 게시글 생성
      await axios.post('http://127.0.0.1:8000/api/regions/gallery/post', {
        gallery_id: galleryId,
        user_id: parseInt(userId, 10), // user_id를 숫자로 변환
        user_name: userName,
        title,
        content, // React-Quill에서 가져온 HTML 내용
      });

      alert('게시글이 성공적으로 작성되었습니다.');
      router.push(`/gallery/${galleryId}`); // 작성 후 상세 페이지로 이동
    } catch (err) {
      console.error('Error creating post:', err);
      setError('게시글 작성 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!galleryId) {
    return <p style={{ textAlign: 'center' }}>갤러리 정보를 불러오는 중...</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        갤러리 {galleryId} 글쓰기
      </h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            placeholder="제목을 입력하세요"
          />
        </div>
        <div>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '5px' }}>내용</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            style={{
              minHeight: '200px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              backgroundColor: '#fff',
            }}
            placeholder="내용을 입력하세요"
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          disabled={loading}
        >
          {loading ? '작성 중...' : '글쓰기'}
        </button>
      </form>
    </div>
  );
}
