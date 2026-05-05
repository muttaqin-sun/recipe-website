'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Bookmark } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  // Simulating a regional tag if not available (since original didn't have region, we use category or mock)
  const regionTag = recipe.category === 'Tradisional' ? 'Jawa' : 
                   recipe.category === 'Makanan Berat' ? 'Sumatera Barat' : 
                   'Nusantara';

  return (
    <div className="recipe-card" onClick={() => navigate(`/resep/${recipe.id}`)} style={{
      background: 'var(--card-bg)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid var(--border-color)'
    }}>
      <div style={{ position: 'relative' }}>
        <img 
          src={recipe.image} 
          alt={recipe.name} 
          style={{ 
            width: '100%', 
            height: '200px', 
            objectFit: 'cover',
            display: 'block'
          }} 
        />
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          backgroundColor: 'var(--white)',
          padding: '4px 10px',
          borderRadius: '100px',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: 'var(--text-dark)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {regionTag}
        </div>
      </div>
      
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-dark)', fontWeight: '700' }}>
          {recipe.name}
        </h3>
        
        <div style={{ 
          marginTop: 'auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: 'var(--text-light)',
          fontSize: '0.85rem'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} /> {recipe.cookingTime || '30 menit'}
          </span>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            color: 'var(--text-light)',
            display: 'flex',
            alignItems: 'center',
            padding: '4px'
          }}>
            <Bookmark size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
