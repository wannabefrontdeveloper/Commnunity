'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './gallery.module.css';
import Link from 'next/link';

export default function GalleryDetailPage({ params }) {
  const [galleryId, setGalleryId] = useState(null);
  const [galleryName, setGalleryName] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [regionId, setRegionId] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const getGalleryDetails = async () => {
      const resolvedParams = await params;
      const resolvedGalleryId = parseInt(resolvedParams.galleryId, 10);
      const resolvedGalleryName = searchParams.get('galleryName');
      const resolvedRegionId = searchParams.get('regionId');
      setGalleryId(resolvedGalleryId);
      setGalleryName(resolvedGalleryName || '');
      setRegionId(resolvedRegionId || null);
    };

    getGalleryDetails();
  }, [params, searchParams]);

  useEffect(() => {
    if (galleryId) {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const response = await axios.get('http://127.0.0.1:8000/api/regions/gallery/postList', {
            params: { gallery_id: galleryId, page: 1 },
          });
          setPosts(response.data.data);
          console.log('서버에서 받는 데이터: ', response.data.data);
        } catch (err) {
          setError('게시글이 존재하지 않습니다.');
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [galleryId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleDeleteGallery = async () => {
    if (confirm(`${galleryName} 갤러리를 삭제하시겠습니까?`)) {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        
        if (!token || !userId || !regionId) {
          alert('로그인 후 다시 시도해주세요.');
          return;
        }
  
        const requestData = {
          gallery_id: galleryId,
          manager_id: userId,
          region_id: regionId,
        };
  
        console.log('보내는 데이터:', requestData);
  
        await axios.delete('http://127.0.0.1:8000/api/regions/gallery', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: requestData,
        });
  
        alert('갤러리가 삭제되었습니다.');
        router.push('/');
      } catch (err) {
        alert('갤러리를 생성한 회원만 삭제할 수 있습니다.');
      }
    }
  };

  const handleWritePost = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용해 주세요.');
      return;
    }
    router.push(`/gallery/${galleryId}/create`);
  };

  if (!galleryId) {
    return <p className={styles.loading}>갤러리 정보를 불러오는 중...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{galleryName} 게시판</h1>

      {loading ? (
        <p className={styles.loading}>로딩 중...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : posts.length === 0 ? (
        <p className={styles.noPosts}>게시글이 없습니다.</p>
      ) : (
      <div className={styles.postList}>
        <ul>
          {posts.map((post) => (
            <li key={post.id} className={styles.postItem}>
              <Link href={`/gallery/${galleryId}/post/${post.id}`} className={styles.postLink}>
                <h3>{post.title}</h3>
                <p>
                  작성자: {post.user_name} | 작성일: {post.created_at}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      )}

      <div className={styles.linkContainer}>
        <Link href="/" className={styles.link}>
          메인으로 돌아가기
        </Link>
        <button onClick={handleWritePost} className={styles.button}>
          글쓰기
        </button>
        {isLoggedIn && (
          <button onClick={handleDeleteGallery} className={styles.deleteButton}>
            갤러리 삭제하기
          </button>
        )}
      </div>
    </div>
  );
}
