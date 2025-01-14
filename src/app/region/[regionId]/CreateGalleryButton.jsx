'use client';

import { useRouter } from 'next/navigation';

export default function CreateGalleryButton({ regionId, regionName }) {
  const router = useRouter();

  const handleCreateGallery = () => {
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
       갤러리 생성하기
    </button>
  );
}
