'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function GalleryDetailPage({ params }) {
  const [galleryId, setGalleryId] = useState(null); // galleryId 상태 관리
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // params를 비동기로 처리
    const getGalleryId = async () => {
      const resolvedParams = await params;
      setGalleryId(resolvedParams.galleryId);
    };

    getGalleryId();
  }, [params]);

  useEffect(() => {
    if (galleryId) {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const response = await axios.get('http://127.0.0.1:8000/api/regions/gallery/postList');
          setPosts(response.data);
        } catch (err) {
          setError('게시글이 존재하지 않습니다.');
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [galleryId]);

  if (!galleryId) {
    return <p style={{ textAlign: 'center' }}>갤러리 정보를 불러오는 중...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>갤러리 {galleryId} 게시판</h1>

      {loading ? (
        <p style={{ textAlign: 'center' }}>로딩 중...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
      ) : posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'red' }}>게시글이 없습니다.</p>
      ) : (
        <div className="post-list" style={{ marginTop: '20px' }}>
          <ul>
            {posts.map((post) => (
              <li
                key={post.id}
                className="post-item"
                style={{
                  marginBottom: '20px',
                  borderBottom: '1px solid #ccc',
                  paddingBottom: '10px',
                }}
              >
                <h3>{post.title}</h3>
                <p>
                  작성자: {post.author} | 작성일: {post.date}
                </p>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#0070f3', marginRight: '10px' }}>
          메인으로 돌아가기
        </Link>
        <Link
          href={`/gallery/${galleryId}/create`}
          style={{
            textDecoration: 'none',
            color: '#fff',
            backgroundColor: '#0070f3',
            padding: '10px 20px',
            borderRadius: '5px',
          }}
        >
          글쓰기
        </Link>
      </div>
    </div>
  );
}
