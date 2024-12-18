import axios from 'axios';
import Link from 'next/link';

export default async function HomePage() {
  let galleries = [];
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/regions');
    galleries = response.data;
    // console.log('서버에서 받은 정보:', response.data);
  } catch (error) {
    console.error('Failed to fetch galleries:', error);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        온캠퍼 캠핑 커뮤니티에 오신 걸 환영합니다!
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '40px' }}>
        관심 있는 캠핑 지역을 선택해주세요!
      </p>
      <div className="region-grid">
        {galleries.map((region) => (
          <Link key={region.id} href={`/region/${region.id}`}>
            <div className="region-card">
              <h3>{region.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
