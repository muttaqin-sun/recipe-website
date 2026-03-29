import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Utensils, Moon, Sun, Search, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(prev => !prev);
    if (isSearchOpen) setSearchQuery('');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <Utensils size={20} />
          </div>
          Rasa Nusantara
        </Link>

        <div className="navbar-links">
          <Link to="/">Beranda</Link>
          <a href="#resep">Resep</a>
          <a href="#kategori">Kategori</a>
          <a href="#populer">Populer</a>
          <a href="#artikel">Artikel</a>
        </div>

        <div className="navbar-actions">
          {/* Search Bar */}
          <div className={`navbar-search-wrap ${isSearchOpen ? 'open' : ''}`}>
            <form onSubmit={handleSearch} className="navbar-search-form">
              <input
                type="text"
                className="navbar-search-input"
                placeholder="Cari resep..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={isSearchOpen}
              />
              <button type="submit" className="navbar-search-btn" aria-label="Cari">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Search Toggle */}
          <button
            className="icon-btn"
            onClick={handleSearchToggle}
            aria-label="Toggle pencarian"
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle tema"
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Account */}
          <Link to="/login" className="user-icon" style={{ textDecoration: 'none' }}>
            <User size={18} /> Akun
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
