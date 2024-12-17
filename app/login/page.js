'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // useRouter 가져오기
import styles from './login.module.css'; // styles 객체로 가져오기

export default function LoginPage() {
  const router = useRouter(); // useRouter 인스턴스 생성

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('로그인 정보:', formData);
    alert(`아이디: ${formData.username}\n비밀번호: ${formData.password}`);
  };

  const handleSignUp = () => {
    router.push('/signup'); // 회원가입 페이지로 이동
  };

  return (
    <div className={styles.loginBox}>
      <h1 className={styles.loginHeading}>로그인</h1>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <label className={styles.formLabel}>
          아이디:
          <input
            type="text"
            name="username"
            value={formData.username}
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
