'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Chrome, Facebook, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const loggedUser = await login(email, password);
    setIsLoading(false);
    
    if (loggedUser) {
      if (loggedUser.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/user');
      }
    } else {
      setError('Kredensial tidak cocok. Gunakan admin@rasanusantara.id (admin) atau user@email.com (user).');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-hero)' }}>
      {/* Left Side - Image */}
      <div style={{ flex: '1' }} className="login-image-section">
        <img 
          src="https://images.unsplash.com/photo-1562607635-4608ff48a859?w=800&auto=format&fit=crop&q=80" 
          alt="Indonesian Food" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Right Side - Form */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '40px 20px', position: 'relative', overflowY: 'auto' }}>
        
        <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '24px', left: '24px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: '500' }}>
          <ArrowLeft size={18} /> Kembali
        </button>

        <div style={{ maxWidth: '440px', width: '100%', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--secondary)" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '16px', transform: 'rotate(45deg)' }}>
              <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" />
            </svg>
            <h1 className="serif-font" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '12px' }}>Selamat datang kembali!</h1>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Masuk untuk menyimpan resep favorit dan menjelajahi lebih banyak cita rasa Nusantara.
            </p>
          </div>

          <div style={{ background: 'var(--card-bg)', padding: '40px', borderRadius: '24px', width: '100%', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {error && <div style={{ padding: '12px', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center' }}>{error}</div>}

              <div>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-dark)' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-light)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="Masukkan email Anda" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.95rem', background: 'var(--bg-light)' }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-dark)' }}>Kata Sandi</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--text-light)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    placeholder="Masukkan kata sandi Anda" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    style={{ width: '100%', padding: '12px 44px 12px 44px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.95rem', background: 'var(--bg-light)' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={18} color="var(--text-light)" /> : <Eye size={18} color="var(--text-light)" />}
                  </button>
                </div>
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                  <a href="#forgot" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Lupa kata sandi?</a>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                style={{ 
                  background: 'var(--primary)', 
                  color: 'white', 
                  padding: '14px', 
                  borderRadius: '100px', 
                  border: 'none', 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  cursor: isLoading ? 'not-allowed' : 'pointer', 
                  marginTop: '8px',
                  opacity: isLoading ? 0.8 : 1,
                  transition: 'background-color 0.3s'
                }}
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '16px 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>atau masuk dengan</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-dark)', transition: 'background-color 0.3s' }}>
                  <Chrome size={18} color="#DB4437" /> Google
                </button>
                <button type="button" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-dark)', transition: 'background-color 0.3s' }}>
                  <Facebook size={18} color="#4267B2" /> Facebook
                </button>
              </div>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                Belum punya akun? <Link to="/daftar" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Daftar di sini</Link>
              </div>

            </form>
          </div>
        </div>
      </div>
      
      {/* Media query style for hiding the image on small screens */}
      <style>{`
        @media (max-width: 768px) {
          .login-image-section {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
