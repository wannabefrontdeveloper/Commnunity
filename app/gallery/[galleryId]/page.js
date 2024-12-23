'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import styles from './gallery.module.css';
import Link from 'next/link';

export default function GalleryDetailPage({ params }) {
  const [galleryId, setGalleryId] = useState(null);
  const [galleryName, setGalleryName] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const getGalleryDetails = async () => {
      const resolvedParams = await params;
      const resolvedGalleryId = parseInt(resolvedParams.galleryId, 10);
      const resolvedGalleryName = searchParams.get('galleryName');
      setGalleryId(resolvedGalleryId);
      setGalleryName(resolvedGalleryName || '');
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
        } catch (err) {
          setError('게시글을 불러오는 중 문제가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [galleryId]);

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
                <h3>{post.title}</h3>
                <p>
                  작성자: {post.user_name} | 작성일: {post.created_at}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.linkContainer}>
        <Link href="/" className={styles.link}>
          메인으로 돌아가기
        </Link>
        <Link href={`/gallery/${galleryId}/create`} className={styles.button}>
          글쓰기
        </Link>
      </div>
    </div>
  );
}
