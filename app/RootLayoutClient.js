"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // axios 추가

export default function RootLayoutClient({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoginStatus();

    const handleRouteChange = () => checkLoginStatus();

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (response.status === 200) {
        console.log(response.data.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
  
        setIsLoggedIn(false);
        router.push("/");
      }
    } catch (error) {
      console.error("로그아웃 실패:", error.response?.data || error.message);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <header>
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <Link href="/">온캠퍼 커뮤니티</Link>
            </li>
          </ul>
          <div className="auth-buttons">
            {isLoggedIn ? (
              <button
                type="button"
                className="register-button"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            ) : (
              <Link href="/login">
                <button type="button" className="register-button">
                  로그인
                </button>
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="container">{children}</main>
      <footer>
        <p>&copy; 2024 온캠퍼 커뮤니티</p>
      </footer>
    </>
  );
}
