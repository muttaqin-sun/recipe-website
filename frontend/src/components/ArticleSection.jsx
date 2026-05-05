'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles';

const ArticleSection = () => {
  const [showAllArticles, setShowAllArticles] = useState(false);
  const displayedArticles = showAllArticles ? articles : articles.slice(0, 3);
  const hasMore = articles.length > 3;

  return (
    <section className="article-section" id="artikel">
      <div className="section-header">
        <h2>Artikel Kuliner Terkini</h2>
        <p>Tingkatkan wawasan dan keahlian memasak Anda dengan membaca tips dan cerita seru dari dapur kami.</p>
      </div>
      <div className="article-grid">
        {displayedArticles.map(article => (
          <article key={article.id} className="article-card">
            <img src={article.image} alt={article.title} className="article-image" />
            <div className="article-content">
              <span className="article-date">{article.date}</span>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <Link to={`/artikel/${article.id}`} className="read-more">Baca Selengkapnya</Link>
            </div>
          </article>
        ))}
      </div>
      
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowAllArticles(!showAllArticles)}
          >
            {showAllArticles ? "Sembunyikan Sebagian" : "Lihat Selengkapnya"}
          </button>
        </div>
      )}
    </section>
  );
};

export default ArticleSection;
