export default function CreateGalleryPage({ params }) {
    const { regionId } = params;
  
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>지역 ID: {regionId} - 갤러리 생성</h1>
        <p>이 지역에 새로운 갤러리를 추가하세요.</p>
        <form style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>
              갤러리 이름:
              <input
                type="text"
                name="galleryName"
                placeholder="갤러리 이름을 입력하세요"
                style={{
                  marginLeft: '10px',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
            </label>
          </div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            생성하기
          </button>
        </form>
      </div>
    );
  }
  