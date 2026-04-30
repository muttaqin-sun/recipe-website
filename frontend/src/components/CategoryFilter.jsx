'use client';

import React from 'react';

const categories = ['Semua', 'Makanan Berat', 'Camilan', 'Minuman', 'Tradisional'];

const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="category-filter" id="kategori">
      <h2>Kategori Pilihan</h2>
      <div className="filter-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
