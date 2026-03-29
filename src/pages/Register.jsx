import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid.';
    }
    if (!formData.password) {
      newErrors.password = 'Kata sandi wajib diisi.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Kata sandi minimal 8 karakter.';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi kata sandi wajib diisi.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Kata sandi tidak cocok.';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Anda harus menyetujui syarat & ketentuan.';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strengthLabel = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
  const strengthColor = ['', '#e05252', '#f0a500', '#4caf50', '#2e7d32'];
  const strength = passwordStrength();

  return (
    <div className="app-container register-page">
      <main className="register-container">
        {success ? (
          <div className="register-card register-success-card">
            <div className="success-icon-wrap">
              <CheckCircle2 size={64} color="var(--primary)" />
            </div>
            <h2>Pendaftaran Berhasil! 🎉</h2>
            <p>Akun Anda telah dibuat. Mengalihkan ke halaman masuk...</p>
          </div>
        ) : (
          <div className="register-card">
            {/* Header */}
            <div className="login-header">
              <Link to="/" className="navbar-logo login-logo">
                <div className="navbar-logo-icon">
                  <Utensils size={24} />
                </div>
                Rasa Nusantara
              </Link>
              <h2>Buat Akun Baru</h2>
              <p>Bergabunglah dan simpan resep favorit Anda dengan mudah.</p>
            </div>

            {/* Form */}
            <form className="login-form" onSubmit={handleRegister} noValidate>
              {/* Nama Lengkap */}
              <div className={`form-group ${errors.name ? 'form-group-error' : ''}`}>
                <label htmlFor="name">Nama Lengkap</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <span className="form-error-msg">{errors.name}</span>}
              </div>

              {/* Email */}
              <div className={`form-group ${errors.email ? 'form-group-error' : ''}`}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="contoh@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <span className="form-error-msg">{errors.email}</span>}
              </div>

              {/* Kata Sandi */}
              <div className={`form-group ${errors.password ? 'form-group-error' : ''}`}>
                <label htmlFor="password">Kata Sandi</label>
                <div className="input-password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Min. 8 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bars">
                      {[1, 2, 3, 4].map((i) => (
                        <span
                          key={i}
                          className="strength-bar"
                          style={{
                            backgroundColor: i <= strength ? strengthColor[strength] : 'var(--gray-300)',
                          }}
                        />
                      ))}
                    </div>
                    <span className="strength-label" style={{ color: strengthColor[strength] }}>
                      {strengthLabel[strength]}
                    </span>
                  </div>
                )}
                {errors.password && <span className="form-error-msg">{errors.password}</span>}
              </div>

              {/* Konfirmasi Kata Sandi */}
              <div className={`form-group ${errors.confirmPassword ? 'form-group-error' : ''}`}>
                <label htmlFor="confirmPassword">Konfirmasi Kata Sandi</label>
                <div className="input-password-wrap">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Ulangi kata sandi"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="form-error-msg">{errors.confirmPassword}</span>
                )}
              </div>

              {/* Syarat & Ketentuan */}
              <div className={`form-group form-group-checkbox ${errors.agreeTerms ? 'form-group-error' : ''}`}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                  <span>
                    Saya menyetujui{' '}
                    <a href="#terms" className="forgot-password">
                      Syarat & Ketentuan
                    </a>{' '}
                    dan{' '}
                    <a href="#privacy" className="forgot-password">
                      Kebijakan Privasi
                    </a>
                  </span>
                </label>
                {errors.agreeTerms && <span className="form-error-msg">{errors.agreeTerms}</span>}
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Daftar Sekarang
              </button>
            </form>

            {/* Footer Link */}
            <div className="login-footer">
              <p>
                Sudah punya akun?{' '}
                <Link to="/login" className="forgot-password">
                  Masuk di sini
                </Link>
              </p>
            </div>

            {/* Back Button */}
            <button onClick={() => navigate('/')} className="back-button login-back">
              <ArrowLeft size={20} /> Kembali ke Beranda
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Register;
