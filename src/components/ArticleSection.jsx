import React from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles';

const ArticleSection = () => {
  return (
    <section className="article-section" id="artikel">
      <div className="section-header">
        <h2>Artikel Kuliner Terkini</h2>
        <p>Tingkatkan wawasan dan keahlian memasak Anda dengan membaca tips dan cerita seru dari dapur kami.</p>
      </div>
      <div className="article-grid">
        {articles.map(article => (
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
    </section>
  );
};

export default ArticleSection;
