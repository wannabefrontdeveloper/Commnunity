// app/layout.js
import '../styles/globals.css';
import Link from 'next/link';

export const metadata = {
  title: '캠핑은 온캠퍼에서!',
  description: '전국 캠핑 커뮤니티',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
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
              <Link href="/login">
                <button type="button" className="login-button">로그인</button>
              </Link>
            </div>
          </nav>
        </header>
        <main className="content">{children}</main>
        <footer>
          <p>&copy; 2024 온캠퍼 커뮤니티</p>
        </footer>
      </body>
    </html>
  );
}
