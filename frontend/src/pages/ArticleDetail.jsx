'use client';

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`http://127.0.0.1:5000/api/articles/${id}`);
        const data = await res.json();
        if (data.success) {
          setArticle(data.data);
        }
      } catch (err) {
        console.error('Gagal mengambil detail artikel:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo(0, 0);
  }, [id]);

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
          
          <img src={article.image} alt={article.title} className="article-hero-image" />
          
          <div className="article-body">
            {typeof article.content === 'string' ? article.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            )) : article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetail;
