'use client';

import { useRouter } from 'next/navigation';

export default function CreateGalleryButton({ regionId, regionName }) {
  const router = useRouter();

  const handleCreateGallery = () => {
    console.log(`갤러리 생성 버튼 클릭됨 - 지역 ID: ${regionId}, 지역 이름: ${regionName}`);
    router.push(`/region/${regionId}/create`);
  };

  return (
    <button
      onClick={handleCreateGallery}
      style={{
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      {regionName} 갤러리 생성하기
    </button>
  );
}
