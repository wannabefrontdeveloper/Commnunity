// app/page.js
import Link from 'next/link';

export default function HomePage() {
  const galleries = [
    { id: 'gyeonggi', name: '경기도' },   // id: 1
    { id: 'seoul', name: '서울' },       // id: 2
    { id: 'incheon', name: '인천' },     // id: 3
    { id: 'gangwon', name: '강원도' },   // id: 4
    { id: 'chungnam', name: '충청남도' }, // id: 5 (충남)
    { id: 'chungbook', name: '충청북도' }, // id: 6 (충북)
    { id: 'gyeongsangbook', name: '경상북도' },  // id: 7 (경북)
    { id: 'daejeon', name: '대전' },     // id: 8
    { id: 'jeollabook', name: '전라북도' },    // id: 9 (전북)
    { id: 'jeollanam', name: '전라남도' },    // id: 10 (전남)
    { id: 'gwangju', name: '광주' },     // id: 11
    { id: 'daegu', name: '대구' },       // id: 12
    { id: 'ulsan', name: '울산' },       // id: 13
    { id: 'busan', name: '부산' },       // id: 14
    { id: 'gyeongsangnam', name: '경상남도' },  // id: 15 (경남)
    { id: 'jeju', name: '제주도' },      // id: 16
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        온캠퍼 캠핑 커뮤니티에 오신 걸 환영합니다!
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '40px' }}>
        관심 있는 캠핑 지역을 선택해주세요!
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
