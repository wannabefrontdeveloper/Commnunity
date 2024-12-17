"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <>
      <header>
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <Link href="/">홈</Link>
            </li>
          </ul>
          <div className="search-bar">
            <input type="text" placeholder="검색어를 입력하세요..." />
            <button type="button">검색</button>
          </div>
          <div className="auth-buttons">
            {isLoggedIn ? (
              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            ) : (
              <Link href="/login">
                <button type="button" className="login-button">
                  로그인
                </button>
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="content">{children}</main>
      <footer>
        <p>&copy; 2024 온캠퍼 커뮤니티</p>
      </footer>
    </>
  );
}
