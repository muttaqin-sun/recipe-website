'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { User, ChevronDown, Moon, Sun, Search, X, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
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
        <Link to="/" className="navbar-logo" style={{ display: 'flex', flexDirection: 'column', lineHeight: '0.9', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span className="serif-font" style={{ color: 'var(--primary)', fontSize: '36px', fontWeight: '700' }}>rasa</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--secondary)" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '-2px', marginTop: '4px', transform: 'rotate(45deg)' }}>
              <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" />
            </svg>
          </div>
          <span className="serif-font" style={{ color: 'var(--secondary)', fontSize: '26px', fontWeight: '600', marginLeft: '2px' }}>Nusantara</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="active">Beranda</Link>
          <a href="/#resep">Resep</a>
          <a href="/#kategori" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Kategori <ChevronDown size={14} /></a>
          <a href="/#bahan" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Bahan <ChevronDown size={14} /></a>
          <a href="/#koleksi">Koleksi</a>
          <a href="/#tips">Tips & Trik</a>
          <a href="/#tentang">Tentang Kami</a>
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
            className="search-toggle-btn"
            onClick={handleSearchToggle}
            aria-label="Toggle pencarian"
            style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--gray-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', cursor: 'pointer', transition: 'all 0.3s' }}
          >
            {isSearchOpen ? <X size={18} color="var(--text-dark)" /> : <Search size={18} color="var(--text-dark)" />}
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

          {/* User Account or Dashboard Action */}
          {!user ? (
            <Link to="/login" className="login-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', border: '1px solid var(--text-dark)', borderRadius: '100px', fontWeight: '600', color: 'var(--text-dark)', textDecoration: 'none', transition: 'all 0.3s' }}>
              <User size={18} /> Login
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link to={user.role === 'admin' ? "/dashboard/admin" : "/dashboard/user"} className="user-icon" style={{ textDecoration: 'none', background: 'var(--text-dark)' }}>
                <User size={18} /> {user.role === 'admin' ? "Dasbor Admin" : "Dasbor"}
              </Link>
              <button 
                onClick={() => {
                  logout();
                  navigate('/');
                }} 
                className="icon-btn" 
                title="Keluar"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
