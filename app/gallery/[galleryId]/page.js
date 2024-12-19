import React from 'react';
import Link from 'next/link';

export default function GalleryDetailPage({ params }) {
  const { galleryId } = params;

  // 임의의 게시판 데이터
  const dummyPosts = [
    {
      id: 1,
      title: '첫 번째 게시글',
      content: '이것은 첫 번째 게시글의 내용입니다.',
      author: '관리자',
      date: '2024-12-19',
    },
    {
      id: 2,
      title: '두 번째 게시글',
      content: '이것은 두 번째 게시글의 내용입니다.',
      author: '사용자1',
      date: '2024-12-18',
    },
    {
      id: 3,
      title: '세 번째 게시글',
      content: '이것은 세 번째 게시글의 내용입니다.',
      author: '사용자2',
      date: '2024-12-17',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>갤러리 {galleryId} 게시판</h1>
      <p style={{ textAlign: 'center' }}>갤러리 게시판의 게시글을 확인하세요!</p>
      <div className="post-list" style={{ marginTop: '20px' }}>
        {dummyPosts.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'red' }}>게시글이 없습니다.</p>
        ) : (
          <ul>
            {dummyPosts.map((post) => (
              <li key={post.id} className="post-item" style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                <h3>{post.title}</h3>
                <p>작성자: {post.author} | 작성일: {post.date}</p>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#0070f3' }}>
            메인으로 돌아가기
        </Link>
        </div>
    </div>
  );
}
