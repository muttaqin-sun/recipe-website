'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Bookmark } from 'lucide-react';
import { getImageUrl } from '@/utils/imageUrl';
import { useAuth } from '@/context/AuthContext';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      if (user) {
        try {
          const res = await fetch(`http://127.0.0.1:5000/api/recipes/user/saved`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          const data = await res.json();
          if (data.success) {
            const isRecipeSaved = data.data.some(r => r.id === recipe.id);
            setIsSaved(isRecipeSaved);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        const savedIds = JSON.parse(localStorage.getItem('saved_recipes') || '[]');
        setIsSaved(savedIds.includes(recipe.id));
      }
    };
    checkSaved();
  }, [recipe.id, user]);

  const handleSaveRecipe = async (e) => {
    e.stopPropagation(); // Mencegah klik menyebar ke card (navigate)
    if (!user) {
      alert('Silakan login terlebih dahulu untuk menyimpan resep.');
      navigate('/login');
      return;
    }
    
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/interactions/recipes/${recipe.id}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(!isSaved);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
          src={getImageUrl(recipe.image)} 
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
          <button 
            onClick={handleSaveRecipe}
            title={isSaved ? "Hapus dari Favorit" : "Simpan Resep"}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: isSaved ? 'var(--primary)' : 'var(--text-light)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              transition: 'color 0.2s'
            }}
          >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
