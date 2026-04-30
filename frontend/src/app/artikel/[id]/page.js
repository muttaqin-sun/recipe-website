'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { articles } from '@/data/articles';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useRouter();
  
  const article = articles.find(a => a.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="not-found">
          <h2>Artikel tidak ditemukan</h2>
          <button onClick={() => navigate.push('/')} className="btn btn-primary">Kembali ke Beranda</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container article-detail-page">
      <Navbar />
      
      <main className="article-detail-container">
        <button onClick={() => navigate.push('/')} className="back-button">
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
            {article.content.map((paragraph, index) => (
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
