'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi Konfirmasi Sandi
    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    // Validasi lokal (minimal 8 karakter, kombinasi huruf dan angka)
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setError('Kata sandi harus minimal 8 karakter dan merupakan kombinasi huruf dan angka (contoh: halo1234).');
      return;
    }

    setIsLoading(true);

    const result = await register(name, email, password);
    setIsLoading(false);

    if (result && result.success) {
      navigate('/');
    } else {
      setError(result?.message || 'Gagal membuat akun. Silakan coba lagi.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-hero)' }}>
      {/* Left Side - Form */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '40px 20px', position: 'relative', overflowY: 'auto' }}>

        <button onClick={() => navigate('/login')} style={{ position: 'absolute', top: '24px', left: '24px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: '500' }}>
          <ArrowLeft size={18} /> Kembali ke Login
        </button>

        <div style={{ maxWidth: '440px', width: '100%', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--secondary)" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '16px', transform: 'rotate(45deg)' }}>
              <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" />
            </svg>
            <h1 className="serif-font" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '12px' }}>Buat Akun Baru</h1>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Bergabunglah dengan Rasa Nusantara untuk mulai menyimpan dan membagikan resep favorit Anda.
            </p>
          </div>

          <div style={{ background: 'var(--card-bg)', padding: '40px', borderRadius: '24px', width: '100%', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {error && <div style={{ padding: '12px', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center' }}>{error}</div>}

              <div>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-dark)' }}>Nama Lengkap</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--text-light)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    id="name"
                    placeholder="Masukkan nama lengkap Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.95rem', background: 'var(--bg-light)' }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-dark)' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-light)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    id="email"
                    placeholder="Masukkan alamat email Anda"
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
                    placeholder="Buat kata sandi Anda"
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
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '6px' }}>Min. 8 karakter, kombinasi huruf & angka.</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-dark)' }}>Konfirmasi Kata Sandi</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--text-light)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Ulangi kata sandi Anda"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 44px 12px 44px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.95rem', background: 'var(--bg-light)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} color="var(--text-light)" /> : <Eye size={18} color="var(--text-light)" />}
                  </button>
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
                  marginTop: '16px',
                  opacity: isLoading ? 0.8 : 1,
                  transition: 'background-color 0.3s'
                }}
              >
                {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                Sudah punya akun? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Masuk di sini</Link>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div style={{ flex: '1' }} className="register-image-section">
        <img
          src="https://images.unsplash.com/photo-1562607635-4608ff48a859?w=800&auto=format&fit=crop&q=80"
          alt="Indonesian Spices"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Media query style for hiding the image on small screens */}
      <style>{`
        @media (max-width: 768px) {
          .register-image-section {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
