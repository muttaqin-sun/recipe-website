'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ChefHat, Star, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { recipes } from '@/data/recipes';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useRouter();
  
  const recipe = recipes.find(r => r.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!recipe) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="not-found">
          <h2>Resep tidak ditemukan</h2>
          <button onClick={() => navigate.push('/')} className="btn btn-primary">Kembali ke Beranda</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container recipe-detail-page">
      <Navbar />
      
      <main className="detail-container">
        <button onClick={() => navigate.push('/')} className="back-button">
          <ArrowLeft size={20} /> Kembali
        </button>

        <div className="detail-header">
          <img src={recipe.image} alt={recipe.name} className="detail-image" />
          <div className="detail-info">
            <span className="detail-category">{recipe.category}</span>
            <h1 className="detail-title">{recipe.name}</h1>
            
            <div className="detail-meta">
              <span className="meta-item">
                <Clock size={20} /> {recipe.cookingTime}
              </span>
              <span className="meta-item">
                <ChefHat size={20} /> {recipe.difficulty}
              </span>
              <span className="meta-item rating">
                <Star size={20} className="star-icon" /> {recipe.rating}
              </span>
            </div>

            <div className="detail-description">
              <p>{recipe.description}</p>
            </div>
          </div>
        </div>

        <div className="detail-content">
          <section className="ingredients-section">
            <h2>Bahan-bahan</h2>
            <ul>
              {recipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="steps-section">
            <h2>Langkah Memasak</h2>
            <ol>
              {recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RecipeDetail;
