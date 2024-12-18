import axios from 'axios';
import CreateGalleryButton from './CreateGalleryButton';

export default async function GalleryPage({ params }) {
  const { regionId } = params; // URL 파라미터에서 regionId 가져오기
  let galleryData = {};

  console.log('전달된 regionId:', regionId); // regionId 값 확인

  try {
    // 서버에 API 요청
    const response = await axios.get(`http://127.0.0.1:8000/api/regions/gallery`, {
      params: { id: regionId },
    });
    galleryData = response.data;
  } catch (error) {
    console.error('Failed to fetch gallery data:', error.response?.data || error.message);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {galleryData.name || '갤러리 목록'}
      </h1>
      <p style={{ textAlign: 'center' }}>
        관심있는 캠핑 지역 갤러리를 선택해주세요!
      </p>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        {/* 갤러리 생성하기 버튼 */}
        <CreateGalleryButton />
      </div>
      <div style={{ marginTop: '20px' }}>
        <pre>{JSON.stringify(galleryData, null, 2)}</pre>
      </div>
    </div>
  );
}
