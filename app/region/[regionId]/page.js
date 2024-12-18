import axios from 'axios';
import CreateGalleryButton from './CreateGalleryButton';

export default async function GalleryPage({ params }) {
  const { regionId } = params;
  let galleryData = null;
  let regionName = '';

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/regions/gallery`, {
      params: { region_id: regionId },
    });
    galleryData = response.data;

    const region = galleryData.find((item) => item.id === Number(regionId));
    if (region) {
      regionName = region.name;
    }
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
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
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {galleryData?.error ? (
          <p style={{ color: 'red' }}>{galleryData.error}</p>
        ) : (
            <pre>{JSON.stringify(galleryData, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
