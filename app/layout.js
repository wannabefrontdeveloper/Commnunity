import '../styles/globals.css';
import '../styles/default.css';
import RootLayoutClient from './RootLayoutClient';

export const metadata = {
  title: '캠핑은 온캠퍼에서!',
  description: '전국 캠핑 커뮤니티',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
