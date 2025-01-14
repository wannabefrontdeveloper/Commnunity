import axios from 'axios';
import Link from 'next/link';
import SearchBox from '@/src/SearchBox';

export default async function HomePage() {
  let regions = [];
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/regions');
    regions = response.data;
    //  console.log('서버에서 받은 정보:', response.data);
  } catch (error) {
    console.error('Failed to fetch regions:', error);
  }

  return (
    <section className='default-section gallery-section'>
        <header className="gallery-title-wrap">
            <div className='gallery-title'>
                <h1>
                    온캠퍼 캠핑 커뮤니티에 오신 걸 환영합니다.
                </h1>
                <p>
                    관심 있는 캠핑 지역을 선택해주세요!
                </p>
            </div>
            <SearchBox/>
        </header>
        <article className="region-grid">
            {regions.map((region) => (
            <Link key={region.id} href={`/region/${region.id}`} style={{ textDecoration: "none" }}>
                <div className="region-card">
                    <h3>{region.name}</h3>
                </div>
            </Link>
            ))}
        </article>
    </section>
  );
}
