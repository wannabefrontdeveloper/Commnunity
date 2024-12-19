import axios from 'axios';
import CreateGalleryButton from './CreateGalleryButton';
import Link from 'next/link';

export default async function GalleryPage({ params }) {
  const { regionId } = params;
  let galleryData = null;
  let regionName = '';

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/regions/galleryList`, {
      params: { region_id: regionId },
    });
    galleryData = response.data;

    const region = galleryData.find((item) => item.id === Number(regionId));
    if (region) {
      regionName = region.name;
    }
  } catch (error) {
    galleryData = { error: '갤러리가 존재하지 않습니다.' };
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
      {'갤러리 목록'}
      </h1>
      <p style={{ textAlign: 'center' }}>
        관심있는 캠핑 지역 갤러리를 선택해주세요!
      </p>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <CreateGalleryButton regionId={regionId} regionName={regionName} />
      </div>
      <div className="gallery-grid">
  {galleryData?.error ? (
    <p style={{ color: 'red', textAlign: 'center' }}>{galleryData.error}</p>
  ) : (
    galleryData?.map((gallery) => (
      <Link key={gallery.id} href={`/gallery/${gallery.id}`}>
        <div className="gallery-card">
          <h3>{gallery.name}</h3>
        </div>
      </Link>
    ))
  )}
</div>
    </div>
  );
}
