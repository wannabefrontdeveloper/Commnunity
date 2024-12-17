'use client';

import { useState } from 'react';
import axios from 'axios'; // axios 가져오기
import { useRouter } from 'next/navigation';
import styles from './signup.module.css';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [error, setError] = useState(''); // 에러 상태 추가

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    const requestData = {
      user_name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    };

    console.log('서버에 전송할 데이터:', requestData); // 서버로 전송할 데이터 출력

    try {
      // 서버로 POST 요청 보내기
      const response = await axios.post('http://127.0.0.1:8000/api/register', requestData);

      console.log('회원가입 성공:', response.data);
      alert('회원가입이 완료되었습니다!');
      router.push('/login'); // 로그인 페이지로 이동
    } catch (err) {
      console.error('회원가입 실패:', err.response?.data || err.message);
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
    }
  };

  return (
    <div className={styles.signupBox}>
      <h1 className={styles.signupHeading}>회원가입</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <label className={styles.formLabel}>
          이름:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </label>
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
        <label className={styles.formLabel}>
          비밀번호 확인:
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </label>
        <button type="submit" className={styles.submitButton}>
          회원가입
        </button>
      </form>
    </div>
  );
}
