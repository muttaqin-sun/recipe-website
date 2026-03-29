import React from 'react';
import RecipeCard from './RecipeCard';

const PopularSection = ({ recipes }) => {
  // Get top 4 highest rated recipes that are not beverages
  const popularRecipes = [...recipes]
    .filter(recipe => recipe.category !== 'Minuman')
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <section className="popular-section" id="populer">
      <div className="section-header">
        <h2>Paling Populer</h2>
        <p>Resep-resep favorit yang paling sering dicoba oleh keluarga Indonesia.</p>
      </div>
      <div className="recipe-grid">
        {popularRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
};

export default PopularSection;
