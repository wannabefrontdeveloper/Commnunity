'use client';

export default function SearchBox({  }) {

  return (
    <div className="search-bar">
        <input type="text" placeholder="검색어를 입력하세요..." />
        <button type="button">검색</button>
    </div>
  );
}
