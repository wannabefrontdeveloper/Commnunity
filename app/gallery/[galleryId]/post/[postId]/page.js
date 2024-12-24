'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

export default function PostDetailPage({ params }) {
  const [galleryId, setGalleryId] = useState(null);
  const [postId, setPostId] = useState(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setGalleryId(resolvedParams.galleryId);
      setPostId(resolvedParams.postId);
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (galleryId && postId) {
      const fetchPostDetail = async () => {
        try {
          const requestParams = {
            gallery_id: galleryId,
            post_id: postId,
          };
          console.log('서버로 보내는 데이터:', requestParams);
          const response = await axios.get('http://127.0.0.1:8000/api/regions/gallery/post', {
            params: requestParams,
          });
          console.log('서버에서 받은 데이터:', response.data);

          setPost(response.data[0]);
        } catch (err) {
          if (err.response?.status === 422) {
            setError('부적절한 접근입니다. gallery_id 또는 post_id가 누락되었습니다.');
          } else if (err.response?.status === 500) {
            setError('게시글이 존재하지 않습니다.');
          } else {
            setError('게시글을 불러오는 중 오류가 발생했습니다.');
          }
        } finally {
          setLoading(false);
        }
      };

      fetchPostDetail();
    }
  }, [galleryId, postId]);

  const handleDelete = async () => {
    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        const userId = localStorage.getItem('user_id'); // localStorage에서 user_id 가져오기
        if (!userId) {
          alert('로그인이 필요합니다.');
          return;
        }
  
        const requestBody = {
          gallery_id: galleryId,
          user_id: parseInt(userId, 10), // user_id를 정수로 변환
        };
        const token = localStorage.getItem('token');
        console.log('삭제 요청 데이터:', requestBody);
  
        const response = await axios.delete('http://127.0.0.1:8000/api/regions/gallery/post', {
            data: requestBody, // 요청 본문
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // 인증 토큰 추가
            },
          });
  
        console.log('서버 응답:', response.data);
  
        if (response.status === 200) {
          alert( '게시글이 삭제되었습니다.');
          window.location.href = `/gallery/${galleryId}/post/${post.id}`; 
        }
      } catch (err) {
        if (err.response?.status === 403) {
          alert('글을 삭제할 권한이 없습니다.');
        } else if (err.response?.status === 404) {
          alert('해당 게시글을 찾을 수 없습니다.');
        } else if (err.response?.status === 422) {
          alert('부적절한 접근입니다.');
        } else {
          alert('게시글 삭제 중 오류가 발생했습니다.');
        }
  
        console.error('삭제 요청 오류:', err.response || err.message);
      }
    }
  };
  

  const handleEdit = () => {
    window.location.href = `/gallery/${galleryId}/post/${postId}/edit`; // 수정 페이지로 이동
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
        작성자: {post.user_name} | 작성일: {new Date(post.created_at).toLocaleString()}
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
    </div>
  );
}
