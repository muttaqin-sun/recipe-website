import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChefHat, Star } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  return (
    <div className="recipe-card" onClick={() => navigate(`/resep/${recipe.id}`)}>
      <img src={recipe.image} alt={recipe.name} className="card-image-full" />
      
      <div className="card-content-full">
        <h3 className="card-title">{recipe.name}</h3>
        <p className="card-desc-short">{recipe.description}</p>
        
        <div className="card-rating-stars">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} fill={i < Math.floor(recipe.rating) ? "currentColor" : "none"} />
          ))}
          <span style={{marginLeft: '8px', color: 'var(--text-light)', fontWeight: 'bold'}}>{recipe.rating}</span>
        </div>
        
        <div className="card-meta">
          <span className="meta-item">
            <Clock size={16} /> {recipe.cookingTime}
          </span>
          <span className="meta-item">
            <span style={{fontSize: '0.85rem', color: 'var(--primary)'}}>Lihat Detail &rarr;</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
