import axios from 'axios';
import CreateGalleryButton from './CreateGalleryButton';
import Link from 'next/link';
import SearchBox from '@/components/SearchBox';

export default async function GalleryPage({ params }) {
  const { regionId } = params;
  let galleryData = null;
  let regionName = '';

  try {
    const galleryResponse = await axios.get(`http://127.0.0.1:8000/api/regions/galleryList`, {
      params: { region_id: regionId },
    });
    galleryData = galleryResponse.data;
     console.log('갤러리 목록 조회: ', galleryResponse.data);
  } catch (error) {
    galleryData = { error: '갤러리가 존재하지 않습니다.' };
  }
  
  let regions = [];
  try {
    const regionsResponse = await axios.get('http://127.0.0.1:8000/api/regions');
    regions = regionsResponse.data;
    // console.log('지역 목록 조회:', regionsResponse.data);
  
    const selectedRegion = regions.find((region) => region.id === Number(regionId));
    if (selectedRegion) {
      regionName = selectedRegion.name;
    }
  } catch (error) {
    console.error('Failed to fetch regions:', error);
  }
  return (
    <section className='default-section gallery-section'>
        <header className="gallery-title-wrap" >
            <div className='gallery-title'>
                <h1>
                    {regionName} {'갤러리 목록'}
                </h1>
                <p style={{ textAlign: 'center' }}>
                    관심있는 갤러리를 선택해주세요!
                </p>
            </div>
            <SearchBox/>
        </header>
        <div style={{ textAlign: 'right', margin: '20px 0' }}>
                <CreateGalleryButton regionId={regionId} regionName={regionName} />
        </div>
        <div className="gallery-list">
            {galleryData?.error ? (
            <p style={{ color: 'red', textAlign: 'center' }}>{galleryData.error}</p>
            ) : (
                <ul>
                    {galleryData?.map((gallery) => (
                    <Link
                        href={`/gallery/${gallery.id}?galleryName=${encodeURIComponent(gallery.name)}&regionId=${regionId}`}
                        style={{ textDecoration: "none" }}
                        key={gallery.id}
                    >
                        <li className="gallery-item">
                        <div>
                            <h3>{gallery.name}</h3>
                            <p>{gallery.description}</p>
                        </div>
                        </li>
                    </Link>
                    ))}
                </ul>
            )}
        </div>
    </section>
  );
}
