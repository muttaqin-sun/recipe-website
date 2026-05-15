'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Clock, ChefHat, Star, ChevronRight, Heart, Bookmark, Share2, Plus, Minus, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { recipes } from '@/data/recipes';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [portions, setPortions] = useState(4);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`http://127.0.0.1:5000/api/recipes/${id}`);
        const data = await res.json();
        if (data.success) {
          setRecipe(data.data);
        }
      } catch (err) {
        console.error('Gagal mengambil detail resep:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="app-container">
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div className="loader">Memuat resep...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="not-found">
          <h2>Resep tidak ditemukan</h2>
          <button onClick={() => navigate('/')} className="btn btn-primary">Kembali ke Beranda</button>
        </div>
        <Footer />
      </div>
    );
  }

  // Dummy data for visual fidelity
  const preparationTime = "30 menit";
  const origin = "Nusantara, Indonesia";
  const dishType = "Hidangan Utama";
  const tags = [recipe.category.toLowerCase(), recipe.name.toLowerCase().split(' ')[0], "masakan rumahan"];
  const suitableFor = "Makan siang, Makan malam, Acara spesial";

  // Mocking 2 columns of ingredients from the existing single array
  const halfLength = Math.ceil(recipe.ingredients.length / 2);
  const mainIngredients = recipe.ingredients.slice(0, halfLength);
  const spiceIngredients = recipe.ingredients.slice(halfLength);

  return (
    <div className="app-container recipe-detail-page">
      <Navbar />
      
      <main className="detail-container">
        {/* BREADCRUMB */}
        <nav className="breadcrumb">
          <Link to="/">Beranda</Link>
          <ChevronRight size={14} />
          <Link to="/">Resep</Link>
          <ChevronRight size={14} />
          <span>{recipe.category}</span>
          <ChevronRight size={14} />
          <span className="current">{recipe.name}</span>
        </nav>

        {/* TOP SECTION */}
        <div className="detail-top-section">
          <div className="detail-header-info">
            <span className="category-tag">{recipe.category.toUpperCase()}</span>
            <h1 className="detail-title">{recipe.name}</h1>
            <p className="detail-short-desc">{recipe.description}</p>
            
            <div className="author-and-actions">
              <div className="author-inline">
                {/* Dummy author since we removed the sidebar one */}
                <div className="author-avatar">D</div>
                <div className="author-text">
                  <span className="author-name">Dewi Lestari</span>
                  <span className="author-date">• 12 Mei 2024</span>
                </div>
              </div>
              <div className="recipe-actions">
                <button 
                  className={`action-btn ${isSaved ? 'active' : ''}`}
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Heart size={18} fill={isSaved ? "currentColor" : "none"} /> Simpan
                </button>
                <button className="action-btn icon-only">
                  <Bookmark size={18} />
                </button>
                <button className="action-btn">
                  <Share2 size={18} /> Bagikan
                </button>
              </div>
            </div>
          </div>

          <div className="detail-main-image-wrapper">
            <img src={recipe.image} alt={recipe.name} className="detail-main-image" />
          </div>

          <div className="recipe-info-bar">
            <div className="info-bar-item">
              <ChefHat className="info-icon" size={24} />
              <div>
                <span className="info-label">Porsi</span>
                <span className="info-value">{portions}-{portions+2} porsi</span>
              </div>
            </div>
            <div className="info-bar-item">
              <Clock className="info-icon" size={24} />
              <div>
                <span className="info-label">Waktu Persiapan</span>
                <span className="info-value">{preparationTime}</span>
              </div>
            </div>
            <div className="info-bar-item">
              <Clock className="info-icon" size={24} />
              <div>
                <span className="info-label">Waktu Memasak</span>
                <span className="info-value">{recipe.cookingTime}</span>
              </div>
            </div>
            <div className="info-bar-item">
              <Star className="info-icon" size={24} />
              <div>
                <span className="info-label">Tingkat Kesulitan</span>
                <span className="info-value">{recipe.difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT: LEFT CONTENT & RIGHT SIDEBAR */}
        <div className="detail-main-layout">
          
          <div className="detail-content-left">
            <section className="detail-section">
              <h2>Deskripsi</h2>
              <p className="long-description">{recipe.description} Ini adalah hidangan tradisional Nusantara yang dimasak perlahan dengan santan dan berbagai bumbu rempah hingga meresap sempurna. Hasilnya adalah masakan yang gurih, empuk, dan kaya rasa, sangat cocok untuk disajikan bersama keluarga.</p>
            </section>

            <section className="detail-section">
              <h2>Bahan-bahan</h2>
              <div className="ingredients-columns">
                <div className="ingredients-col">
                  {mainIngredients.map((item, index) => (
                    <div key={index} className="ingredient-item">
                      <span className="bullet">•</span> {item}
                    </div>
                  ))}
                </div>
                <div className="ingredients-col">
                  <h3 className="sub-heading">Bumbu Halus:</h3>
                  {spiceIngredients.map((item, index) => (
                    <div key={index} className="ingredient-item">
                      <span className="bullet">•</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="detail-section steps-section-new">
              <h2>Langkah-langkah</h2>
              <div className="steps-list">
                {recipe.steps.map((step, index) => (
                  <div key={index} className="step-item">
                    <div className="step-number">{index + 1}</div>
                    <img src={recipe.image} alt={`Langkah ${index + 1}`} className="step-thumb" />
                    <div className="step-content">
                      <h3>Langkah {index + 1}</h3>
                      <p>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="detail-sidebar">
            <div className="sidebar-card">
              <h3>Informasi Resep</h3>
              <div className="sidebar-info-row">
                <span className="label">Asal</span>
                <span className="value">{origin}</span>
              </div>
              <div className="sidebar-info-row">
                <span className="label">Jenis Masakan</span>
                <span className="value">{dishType}</span>
              </div>
              <div className="sidebar-info-row">
                <span className="label">Kata Kunci</span>
                <div className="tags-container">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="tag-chip">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="sidebar-info-row">
                <span className="label">Cocok Untuk</span>
                <span className="value">{suitableFor}</span>
              </div>
            </div>

            <div className="sidebar-card ingredients-widget">
              <div className="widget-header">
                <h3>Bahan-bahan</h3>
                <div className="portion-control">
                  <button onClick={() => portions > 1 && setPortions(portions - 1)}><Minus size={14}/></button>
                  <span>{portions} porsi</span>
                  <button onClick={() => setPortions(portions + 1)}><Plus size={14}/></button>
                </div>
              </div>
              
              <div className="widget-group">
                <div className="widget-group-header">
                  <h4>Bahan Utama</h4>
                  <ChevronRight size={16} className="rotate-90" />
                </div>
                <div className="widget-group-list">
                  {mainIngredients.map((item, index) => (
                    <div key={index} className="widget-ingredient-item">
                      <span className="bullet">•</span> {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="widget-group">
                <div className="widget-group-header">
                  <h4>Bumbu & Rempah</h4>
                  <ChevronRight size={16} className="rotate-90" />
                </div>
                <div className="widget-group-list">
                  {spiceIngredients.map((item, index) => (
                    <div key={index} className="widget-ingredient-item">
                      <span className="bullet">•</span> {item}
                    </div>
                  ))}
                </div>
              </div>
              
              <button className="btn-block-outline">Lihat semua bahan</button>
            </div>

            <div className="sidebar-card related-recipes">
              <h3>Resep Terkait</h3>
              <div className="related-list">
                {recipes.filter(r => r.id !== recipe.id).slice(0, 3).map((related) => (
                  <Link to={`/recipe/${related.id}`} key={related.id} className="related-item">
                    <img src={related.image} alt={related.name} />
                    <div className="related-info">
                      <h4>{related.name}</h4>
                      <span><Clock size={12} /> {related.cookingTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <button onClick={() => navigate('/')} className="btn-block-outline">Lihat semua resep</button>
            </div>
          </aside>
          
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RecipeDetail;
