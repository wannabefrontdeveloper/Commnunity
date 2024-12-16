// app/gallery/[galleryId]/page.js
import { notFound } from 'next/navigation';

const galleryData = {
  nature: ['Forest', 'Mountain', 'River'],
  art: ['Painting', 'Sculpture', 'Drawing'],
  technology: ['AI', 'Blockchain', 'Robotics'],
};

export default function GalleryPage({ params }) {
  const { galleryId } = params;

  if (!galleryData[galleryId]) {
    notFound();
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{galleryId.charAt(0).toUpperCase() + galleryId.slice(1)} Gallery</h1>
      <ul>
        {galleryData[galleryId].map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
