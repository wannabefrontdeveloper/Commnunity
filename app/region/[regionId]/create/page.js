'use client';
import { useEffect, useState, useRef, use } from 'react';
import axios from 'axios';
import styles from './create.module.css';

export default function CreateGalleryPage({ params }) {
  // params를 언래핑
  const unwrappedParams = use(params);
  const { regionId } = unwrappedParams;

  const [regionName, setRegionName] = useState('');
  const [galleryName, setGalleryName] = useState('');
  const [description, setDescription] = useState('');
  const [managerId, setManagerId] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const alertShown = useRef(false); // alert 실행 여부를 추적

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (!alertShown.current) {
        alert('로그인이 필요한 페이지입니다.');
        alertShown.current = true; // alert 실행 기록
        window.location.href = '/login';
      }
    } else {
      setIsAuthenticated(true);
    }

    async function fetchRegionName() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/regions`);
        const galleryData = response.data;

        const region = galleryData.find((item) => item.id === Number(regionId));
        if (region) {
          setRegionName(region.name);
        }
      } catch (error) {
        setRegionName('알 수 없는 지역');
      }
    }

    if (token) fetchRegionName();
  }, [regionId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const payload = {
      region_id: Number(regionId),
      name: galleryName,
      description: description,
      manager_id: managerId,
    };
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://127.0.0.1:8000/api/regions/gallery`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Gallery created successfully:', response.data);
      alert('갤러리가 성공적으로 생성되었습니다!');
      window.location.href = `/region/${regionId}`;
    } catch (error) {
      alert('갤러리 생성에 실패했습니다.');
    }
  };

  return (
    isAuthenticated && (
      <div className={styles.container}>
        <h1 className={styles.header}>{regionName} 갤러리 생성</h1>
        <p className={styles.description}>이 지역에 새로운 갤러리를 추가하세요.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              갤러리 이름:
              <input
                type="text"
                name="galleryName"
                placeholder="갤러리 이름을 입력하세요"
                value={galleryName}
                onChange={(e) => setGalleryName(e.target.value)}
                className={styles.input}
                required
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              설명:
              <textarea
                name="description"
                placeholder="갤러리 설명을 입력하세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
                required
              />
            </label>
          </div>
          <button type="submit" className={styles.submitButton}>
            생성하기
          </button>
        </form>
      </div>
    )
  );
}
