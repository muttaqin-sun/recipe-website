'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Utensils, Moon, Sun, Search, X, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
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
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <Utensils size={20} />
          </div>
          Rasa Nusantara
        </Link>

        <div className="navbar-links">
          <Link href="/">Beranda</Link>
          <a href="/#resep">Resep</a>
          <a href="/#kategori">Kategori</a>
          <a href="/#populer">Populer</a>
          <a href="/#artikel">Artikel</a>
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

          {/* User Account or Dashboard Action */}
          {!user ? (
            <Link href="/login" className="user-icon" style={{ textDecoration: 'none' }}>
              <User size={18} /> Akun
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link href={user.role === 'admin' ? "/dashboard/admin" : "/dashboard/user"} className="user-icon" style={{ textDecoration: 'none', background: 'var(--text-dark)' }}>
                <User size={18} /> {user.role === 'admin' ? "Dasbor Admin" : "Dasbor"}
              </Link>
              <button 
                onClick={() => {
                  logout();
                  navigate.push('/');
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
