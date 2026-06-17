'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Heart, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getImageUrl } from '@/utils/imageUrl';
import { useAuth } from '@/context/AuthContext';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const handleLike = async () => {
    if (!user) {
      alert('Silakan login terlebih dahulu untuk menyukai artikel.');
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/interactions/articles/${id}/like`, {
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
      console.error('Gagal menyukai artikel:', err);
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
      const res = await fetch(`http://127.0.0.1:5000/api/interactions/articles/${id}/comment`, {
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
        const resComments = await fetch(`http://127.0.0.1:5000/api/articles/${id}`, {
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
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const userStr = localStorage.getItem('user');
        const token = userStr ? JSON.parse(userStr).token : '';
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(`http://127.0.0.1:5000/api/articles/${id}`, {
          headers
        });
        const data = await res.json();
        if (data.success) {
          setArticle(data.data);
          setIsLiked(data.data.isLiked || false);
          setLikesCount(data.data.likesCount || 0);
          setComments(data.data.comments || []);
        }
      } catch (err) {
        console.error('Gagal mengambil detail artikel:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo(0, 0);
  }, [id, user]);

  if (isLoading) {
    return (
      <div className="app-container">
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div className="loader">Memuat artikel...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="not-found">
          <h2>Artikel tidak ditemukan</h2>
          <button onClick={() => navigate('/')} className="btn btn-primary">Kembali ke Beranda</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container article-detail-page">
      <Navbar />
      
      <main className="article-detail-container">
        <button onClick={() => navigate('/')} className="back-button">
          <ArrowLeft size={20} /> Kembali
        </button>

        <article className="article-full">
          <header className="article-header">
            <span className="article-meta"><Calendar size={16} /> {article.date}</span>
            <h1 className="article-title">{article.title}</h1>
            <p className="article-excerpt">{article.excerpt}</p>
          </header>
          
          <img src={getImageUrl(article.image)} alt={article.title} className="article-hero-image" />
          
          <div className="article-body">
            {typeof article.content === 'string' ? article.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            )) : article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* ARTICLE ACTIONS */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '40px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '20px 0' }}>
            <button 
              onClick={handleLike}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                color: isLiked ? 'red' : 'var(--text-light)',
                fontWeight: '600',
                transition: 'color 0.2s, transform 0.1s'
              }}
            >
              <Heart size={20} fill={isLiked ? "red" : "none"} /> {likesCount} Suka
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '1rem', fontWeight: '500' }}>
              <MessageSquare size={20} /> {comments.length} Komentar
            </div>
          </div>

          {/* COMMENTS SECTION */}
          <section className="comments-section" style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--text-dark)' }}>Diskusi ({comments.length})</h2>
            
            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                <textarea
                  placeholder="Bagikan pemikiran Anda tentang artikel ini..."
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
                <p style={{ color: 'var(--text-light)', marginBottom: '12px' }}>Silakan login untuk memberikan komentar.</p>
                <Link to="/login" className="btn btn-primary" style={{ display: 'inline-block', padding: '8px 20px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none' }}>
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
                <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '20px 0' }}>Belum ada komentar. Jadilah yang pertama berkomentar!</p>
              )}
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetail;
