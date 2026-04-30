'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Utensils, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const navigate = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    const loggedUser = login(email, password);
    
    if (loggedUser) {
      if (loggedUser.role === 'admin') {
        navigate.push('/dashboard/admin');
      } else {
        navigate.push('/dashboard/user');
      }
    } else {
      setError('Kredensial tidak cocok. Gunakan admin@rasanusantara.id (admin) atau user@email.com (user).');
    }
  };

  return (
    <div className="app-container login-page">
      <main className="login-container">
        <div className="login-card">
          <div className="login-header">
            <Link href="/" className="navbar-logo login-logo">
              <div className="navbar-logo-icon">
                <Utensils size={24} />
              </div>
              Rasa Nusantara
            </Link>
            <h2>Selamat Datang Kembali</h2>
            <p>Silakan masuk ke akun Anda untuk manajemen resep.</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            {error && <div className="error-message" style={{color: 'red', marginBottom: '16px', fontSize: '0.9rem'}}>{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="contoh@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Kata Sandi</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Masukkan kata sandi" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Ingat saya
              </label>
              <a href="/#forgot" className="forgot-password">Lupa sandi?</a>
            </div>

            <button type="submit" className="btn btn-primary btn-block">Masuk</button>
          </form>

          <div className="login-footer">
            <p>Belum punya akun? <Link href="/daftar" className="forgot-password">Daftar sekarang</Link></p>
          </div>
          
          <button onClick={() => navigate.push('/')} className="back-button login-back">
            <ArrowLeft size={20} /> Kembali ke Beranda
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
