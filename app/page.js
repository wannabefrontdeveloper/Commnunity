// app/page.js
import Link from 'next/link';

export default function HomePage() {
  const galleries = [
    { id: 'jeju', name: '제주도 캠핑' },
    { id: 'gangwon', name: '강원도 캠핑' },
    { id: 'gyeonggi', name: '경기도 캠핑' },
    { id: 'gyeongsang', name: '경상도 캠핑' },
    { id: 'jeolla', name: '전라도 캠핑' },
    { id: 'chungcheong', name: '충청도 캠핑' },
    { id: 'incheon', name: '인천 캠핑' },
    { id: 'seoul', name: '서울 캠핑' },
    { id: 'busan', name: '부산 캠핑' },
    { id: 'ulsan', name: '울산 캠핑' },
    { id: 'daegu', name: '대구 캠핑' },
    { id: 'daejeon', name: '대전 캠핑' },
    { id: 'gwangju', name: '광주 캠핑' },
    { id: 'sejong', name: '세종 캠핑' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        온캠퍼 캠핑 커뮤니티에 오신 걸 환영합니다!
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '40px' }}>
        관심 있는 갤러리를 선택해주세요!
      </p>
      <div className="gallery-grid">
        {galleries.map((gallery) => (
          <Link key={gallery.id} href={`/gallery/${gallery.id}`}>
            <div className="gallery-card">
              <h3>{gallery.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
