import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils, ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login and redirect to home
    navigate('/');
  };

  return (
    <div className="app-container login-page">
      <main className="login-container">
        <div className="login-card">
          <div className="login-header">
            <Link to="/" className="navbar-logo login-logo">
              <div className="navbar-logo-icon">
                <Utensils size={24} />
              </div>
              Rasa Nusantara
            </Link>
            <h2>Selamat Datang Kembali</h2>
            <p>Silakan masuk ke akun Anda untuk menyimpan resep favorit.</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="contoh@email.com" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Kata Sandi</label>
              <input type="password" id="password" placeholder="Masukkan kata sandi" required />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Ingat saya
              </label>
              <a href="#forgot" className="forgot-password">Lupa sandi?</a>
            </div>

            <button type="submit" className="btn btn-primary btn-block">Masuk</button>
          </form>

          <div className="login-footer">
            <p>Belum punya akun? <Link to="/daftar" className="forgot-password">Daftar sekarang</Link></p>
          </div>
          
          <button onClick={() => navigate('/')} className="back-button login-back">
            <ArrowLeft size={20} /> Kembali ke Beranda
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
