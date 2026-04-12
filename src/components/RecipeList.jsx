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

      {/* Inline Search Bar */}
      <div className="recipe-search-bar">
        <form onSubmit={handleSearchSubmit} className="recipe-search-form">
          <div className="recipe-search-input-wrap">
            <Search size={20} className="recipe-search-icon" />
            <input
              type="text"
              className="recipe-search-input"
              placeholder="Cari nama makanan, misalnya: Rendang, Bakso..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            {localSearch && (
              <button
                type="button"
                className="recipe-search-clear"
                onClick={clearSearch}
                aria-label="Hapus pencarian"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary recipe-search-submit">
            Cari
          </button>
        </form>
        {searchQuery && (
          <p className="search-result-info">
            Menampilkan hasil untuk: <strong>"{searchQuery}"</strong>
            &nbsp;—&nbsp;{filteredRecipes.length} resep ditemukan
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
