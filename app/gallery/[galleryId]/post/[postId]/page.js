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
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setGalleryId(resolvedParams.galleryId);
      setPostId(resolvedParams.postId);
    };

    resolveParams();
    setUserName(localStorage.getItem('user_name'));
  }, [params]);

  useEffect(() => {
    if (galleryId && postId) {
      const fetchPostDetail = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/regions/gallery/post', {
            params: { gallery_id: galleryId, post_id: postId },
          });
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
      const fetchComments = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/regions/gallery/post/comments', {
            params: { post_id: postId },
          });
      
          console.log('댓글 데이터:', response.data);
      
          if (response.data.comment_status === "0") {
            setComments([]);
          } else {
            setComments(response.data.comments);
          }
        } catch (err) {
          console.error('댓글 불러오기 오류:', err);
          setComments([]);
        }
      };

      fetchPostDetail();
      fetchComments();
    }
  }, [galleryId, postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    if (!comment.trim()) {
      alert('댓글을 입력해주세요.');
      return;
    }
  
    if (!password.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
  
    try {
      const userId = localStorage.getItem('user_id');
      const userName = localStorage.getItem('user_name');
      const token = localStorage.getItem('token'); 
  
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }
  
      const requestData = {
        gallery_id: galleryId,
        post_id: postId,
        user_id: parseInt(userId, 10),
        user_name: userName,
        content: comment,
        password: password,
        parent_comment_id: 0,
      };
  
      console.log('서버로 보내는 데이터:', requestData);
  
      const response = await axios.post(
        'http://127.0.0.1:8000/api/regions/gallery/post/comments',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('서버 응답 데이터:', response.data);
  
      setComments((prev) => [...prev, response.data]);
      setComment('');
      setPassword('');
    } catch (err) {
      console.error('댓글 작성 오류:', err);
  
      if (err.response?.status === 500) {
        console.error('서버 오류:', err.response?.data);
        alert('서버에서 문제가 발생했습니다. 관리자에게 문의하세요.');
      } else {
        alert('댓글 작성 중 오류가 발생했습니다.');
      }
    }
  };
  
  
  

  const handleDelete = async () => {
    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          alert('로그인이 필요합니다.');
          return;
        }

        const requestBody = {
          gallery_id: galleryId,
          user_id: parseInt(userId, 10),
        };
        const token = localStorage.getItem('token');

        const response = await axios.delete('http://127.0.0.1:8000/api/regions/gallery/post', {
          data: requestBody,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          alert('게시글이 삭제되었습니다.');
          window.location.href = `/gallery/${galleryId}`;
        }
      } catch (err) {
        if (err.response?.status === 403) {
          alert('글을 삭제할 권한이 없습니다.');
        } else if (err.response?.status === 404) {
          alert('글을 쓴 본인만 삭제할 수 있습니다.');
        } else {
          alert('게시글 삭제 중 오류가 발생했습니다.');
        }
      }
    }
  };

  const handleEdit = () => {
    window.location.href = `/gallery/${galleryId}/post/${postId}/edit`;
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
      <div className={styles.commentsSection}>
  <h2>댓글</h2>
  <ul className={styles.commentsList}>
    {comments.length === 0 ? (
      <p className={styles.noComments}>댓글이 없습니다.</p>
    ) : (
      comments.map((comment, index) => (
        <li key={index} className={styles.comment}>
          <p>
            <strong>{comment.user_name}</strong>: {comment.content}
          </p>
        </li>
      ))
    )}
  </ul>
  <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
  <input
    type="text"
    value={userName || ''}
    readOnly
    placeholder={userName || '작성자 이름'}
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
</div>
    </div>
  );
}
