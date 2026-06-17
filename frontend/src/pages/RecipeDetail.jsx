'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Clock, ChefHat, Star, ChevronRight, Heart, Bookmark, Share2, Plus, Minus, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getImageUrl } from '@/utils/imageUrl';
import { useAuth } from '@/context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [portions, setPortions] = useState(4);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const [relatedRecipes, setRelatedRecipes] = useState([]);

  const handleLike = async () => {
    if (!user) {
      alert('Silakan login terlebih dahulu untuk menyukai resep.');
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/interactions/recipes/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (err) {
      console.error('Gagal menyukai resep:', err);
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert('Silakan login terlebih dahulu untuk menyimpan resep.');
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/interactions/recipes/${id}/save`, {
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
      console.error('Gagal menyimpan resep:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Silakan login terlebih dahulu untuk berkomentar.');
      navigate('/login');
      return;
    }
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/interactions/recipes/${id}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: commentText })
      });
      const data = await res.json();
      if (data.success) {
        setCommentText('');
        // Re-fetch comments
        const resComments = await fetch(`http://127.0.0.1:5000/api/recipes/${id}`, {
          headers: user ? { 'Authorization': `Bearer ${user.token}` } : {}
        });
        const dataComments = await resComments.json();
        if (dataComments.success) {
          setComments(dataComments.data.comments || []);
        }
      }
    } catch (err) {
      console.error('Gagal mengirim komentar:', err);
    }
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const userStr = localStorage.getItem('user');
        const token = userStr ? JSON.parse(userStr).token : '';
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`http://127.0.0.1:5000/api/recipes/${id}`, {
          headers
        });
        const data = await res.json();
        if (data.success) {
          setRecipe(data.data);
          setIsLiked(data.data.isLiked || false);
          setIsSaved(data.data.isSaved || false);
          setLikesCount(data.data.likesCount || 0);
          setComments(data.data.comments || []);
        }
        
        // Ambil semua resep untuk sidebar related recipes
        const resAll = await fetch('http://127.0.0.1:5000/api/recipes');
        const dataAll = await resAll.json();
        if (dataAll.success) {
          setRelatedRecipes(dataAll.data);
        }
      } catch (err) {
        console.error('Gagal mengambil detail resep:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
    window.scrollTo(0, 0);
  }, [id, user]);

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

  // Data dynamic for visual fidelity
  const preparationTime = recipe.prep_time ? `${recipe.prep_time} menit` : "15 menit";
  const origin = recipe.origin || "Nusantara, Indonesia";
  const dishType = recipe.dish_type || "Hidangan Utama";
  const tags = [recipe.category.toLowerCase(), recipe.name.toLowerCase().split(' ')[0], "masakan rumahan"];
  const suitableFor = recipe.suitable_for || "Makan siang, Makan malam";
  const defaultPortions = recipe.portions || 4;

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
                <div className="author-avatar">
                  {recipe.authorAvatar ? (
                    <img src={recipe.authorAvatar} alt={recipe.authorName || 'Author'} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    (recipe.authorName || 'P')[0].toUpperCase()
                  )}
                </div>
                <div className="author-text">
                  <span className="author-name">{recipe.authorName || 'Penulis Kuliner'}</span>
                  <span className="author-date">
                    • {recipe.created_at ? new Date(recipe.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '12 Mei 2024'}
                  </span>
                </div>
              </div>
              <div className="recipe-actions">
                <button 
                  className={`action-btn ${isLiked ? 'active' : ''}`}
                  onClick={handleLike}
                  style={{ color: isLiked ? 'red' : 'inherit' }}
                >
                  <Heart size={18} fill={isLiked ? "red" : "none"} /> {likesCount} Suka
                </button>
                <button 
                  className={`action-btn ${isSaved ? 'active' : ''}`}
                  onClick={handleSave}
                  style={{ color: isSaved ? 'var(--primary)' : 'inherit' }}
                >
                  <Bookmark size={18} fill={isSaved ? "var(--primary)" : "none"} /> Simpan
                </button>
                <button className="action-btn">
                  <Share2 size={18} /> Bagikan
                </button>
              </div>
            </div>
          </div>

          <div className="detail-main-image-wrapper">
            <img src={getImageUrl(recipe.image)} alt={recipe.name} className="detail-main-image" />
          </div>

          <div className="recipe-info-bar">
            <div className="info-bar-item">
              <ChefHat className="info-icon" size={24} />
              <div>
                <span className="info-label">Porsi Default</span>
                <span className="info-value">{defaultPortions} porsi</span>
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
                    <img src={getImageUrl(recipe.image)} alt={`Langkah ${index + 1}`} className="step-thumb" />
                    <div className="step-content">
                      <h3>Langkah {index + 1}</h3>
                      <p>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* COMMENTS SECTION */}
            <section className="detail-section comments-section" style={{ marginTop: '40px', borderTop: '1px solid var(--border-color)', paddingTop: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--text-dark)' }}>Komentar ({comments.length})</h2>
              
              {/* Comment Input Form */}
              {user ? (
                <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                  <textarea
                    placeholder="Tulis komentar Anda di sini..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      outline: 'none',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      background: 'var(--bg-light)',
                      color: 'var(--text-dark)'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      alignSelf: 'flex-end',
                      padding: '10px 24px',
                      borderRadius: '100px',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}
                  >
                    Kirim Komentar
                  </button>
                </form>
              ) : (
                <div style={{ padding: '20px', background: 'var(--bg-light)', borderRadius: '12px', textAlign: 'center', marginBottom: '30px', border: '1px solid var(--border-color)' }}>
                  <p style={{ color: 'var(--text-light)', marginBottom: '12px' }}>Silakan login untuk memberikan komentar pada resep ini.</p>
                  <Link to="/login" className="btn btn-primary" style={{ display: 'inline-block', padding: '8px 20px', borderRadius: '100px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
                    Login Sekarang
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        flexShrink: 0
                      }}>
                        {comment.user_name ? comment.user_name[0].toUpperCase() : 'U'}
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '0.95rem' }}>{comment.user_name}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                            {new Date(comment.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '20px 0' }}>Belum ada komentar. Jadilah yang pertama memberikan pendapat!</p>
                )}
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
                {relatedRecipes.filter(r => r.id !== recipe.id).slice(0, 3).map((related) => (
                  <Link to={`/resep/${related.id}`} key={related.id} className="related-item">
                    <img src={getImageUrl(related.image)} alt={related.name} />
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
