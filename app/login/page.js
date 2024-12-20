'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('전송하는 데이터:', formData);
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', formData);
  
      console.log('전체 서버 응답 데이터:', response.data);
  
      if (response.status === 200) {
        const token = response.data.access_token;
  
        localStorage.setItem('token', token);
        alert(`로그인 성공! 환영합니다`);
  
        
        window.location.href = `/`;
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      } else {
        alert(`로그인 실패: ${response.data.message || '서버 오류'}`);
      }
    } catch (error) {
      if (error.response) {
        alert(`로그인 실패: ${error.response.data.message || '오류 발생'}`);
      } else {
        alert('서버 연결에 실패했습니다.');
      }
    }
  };
  
  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <div className={styles.loginBox}>
      <h1 className={styles.loginHeading}>로그인</h1>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <label className={styles.formLabel}>
          이메일:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </label>
        <label className={styles.formLabel}>
          비밀번호:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </label>
        <button type="submit" className={styles.submitButton}>
          로그인
        </button>
        <button
          type="button"
          onClick={handleSignUp}
          className={`${styles.submitButton} ${styles.signUpButton}`}
        >
          회원가입
        </button>
      </form>
    </div>
  );
}
