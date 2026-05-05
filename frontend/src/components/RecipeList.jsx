'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import RecipeCard from './RecipeCard';
import CategoryFilter from './CategoryFilter';

const RecipeList = ({ recipes, searchQuery = '' }) => {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const navigate = useNavigate();

  // Sync local search with URL param
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(localSearch.trim())}`);
    } else {
      navigate('/');
    }
  };

  const clearSearch = () => {
    setLocalSearch('');
    navigate('/');
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = activeCategory === 'Semua' || recipe.category === activeCategory;
    const matchesSearch = localSearch.trim() === '' ||
      recipe.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      recipe.description.toLowerCase().includes(localSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedRecipes = showAllRecipes ? filteredRecipes : filteredRecipes.slice(0, 6);
  const hasMore = filteredRecipes.length > 6;

  return (
    <section className="recipe-section" id="resep">
      <CategoryFilter
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Header and Results info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        {searchQuery && (
          <p className="search-result-info" style={{ margin: 0, padding: '12px 20px', background: 'var(--bg-light)', borderRadius: '100px', border: '1px solid var(--border-color)', width: '100%' }}>
            Menampilkan hasil untuk: <strong>"{searchQuery}"</strong>
            &nbsp;—&nbsp;{filteredRecipes.length} resep ditemukan
            <button onClick={clearSearch} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginLeft: '12px', fontWeight: 'bold' }}>✕ Hapus Pencarian</button>
          </p>
        )}
      </div>

      <div className="recipe-grid">
        {displayedRecipes.length > 0 ? (
          displayedRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        ) : (
          <div className="no-recipes-found">
            <p>🍽️ Tidak ada resep yang cocok dengan pencarian <strong>"{localSearch}"</strong>.</p>
            <button onClick={clearSearch} className="btn btn-primary" style={{ marginTop: '16px' }}>
              Tampilkan Semua Resep
            </button>
          </div>
        )}
      </div>
      
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAllRecipes(!showAllRecipes)}
          >
            {showAllRecipes ? "Sembunyikan Sebagian" : "Lihat Selengkapnya"}
          </button>
        </div>
      )}
    </section>
  );
};

export default RecipeList;
