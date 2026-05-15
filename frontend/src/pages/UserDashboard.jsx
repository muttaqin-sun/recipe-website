'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { PenTool, ImagePlus, CheckCircle, FileText, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resep'); // 'resep' atau 'artikel'
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Jika tidak login, kembalikan ke login
    if (!user || user.role !== 'user') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : '';
    
    if (activeTab === 'resep') {
      const payload = {
        name: e.target.name.value,
        category: e.target.category.value,
        cooking_time: e.target.cookingTime.value,
        difficulty: e.target.difficulty.value,
        description: e.target.description.value,
        ingredients: e.target.ingredients.value.split('\n').filter(i => i.trim() !== ''),
        steps: e.target.steps.value.split('\n').filter(s => s.trim() !== '')
      };

      try {
        const res = await fetch('http://127.0.0.1:5000/api/recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setIsSubmitted(true);
          e.target.reset();
          setTimeout(() => setIsSubmitted(false), 3000);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const payload = {
        title: e.target.title.value,
        excerpt: e.target.excerpt.value,
        content: e.target.content.value
      };

      try {
        const res = await fetch('http://127.0.0.1:5000/api/articles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setIsSubmitted(true);
          e.target.reset();
          setTimeout(() => setIsSubmitted(false), 3000);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="app-container">
      <Navbar />
      <main className="dashboard-container">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1>Dasbor Pengguna</h1>
            <p>Selamat datang, {user.name}! Menginspirasi Nusantara melalui masakan Anda.</p>
          </div>
          <Link to="/dashboard/user/profile" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} /> Profil Saya
          </Link>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'resep' ? 'active' : ''}`}
            onClick={() => setActiveTab('resep')}
          >
            <PenTool size={20} /> Input Resep Baru
          </button>
          <button 
            className={`tab-btn ${activeTab === 'artikel' ? 'active' : ''}`}
            onClick={() => setActiveTab('artikel')}
          >
            <FileText size={20} /> Input Artikel Baru
          </button>
        </div>

        <div className="dashboard-content">
          {isSubmitted && (
            <div className="success-banner">
              <CheckCircle size={24} />
              Tulisan berhasil di-submit dan sedang menunggu persetujuan Admin!
            </div>
          )}

          {activeTab === 'resep' && (
            <div className="form-card fade-in">
              <h2>Formulir Pengajuan Resep</h2>
              <form onSubmit={handleSubmit}>
                <div className="image-upload-area">
                  <ImagePlus size={40} className="upload-icon" />
                  <p>Klik untuk unggah foto hasil masakan</p>
                  <span>Maksimal 2MB (JPG/PNG)</span>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Nama Menu</label>
                    <input name="name" type="text" placeholder="Contoh: Nasi Goreng Spesial" required />
                  </div>
                  <div className="form-group">
                    <label>Kategori</label>
                    <select name="category" required>
                      <option value="">Pilih Kategori...</option>
                      <option value="Makanan Berat">Makanan Berat</option>
                      <option value="Camilan">Camilan</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Tradisional">Tradisional</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Lama Memasak (angka menit)</label>
                    <input name="cookingTime" type="number" placeholder="Contoh: 45" required />
                  </div>
                  <div className="form-group">
                    <label>Tingkat Kesulitan</label>
                    <select name="difficulty" required>
                      <option value="Mudah">Mudah</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Sulit">Sulit</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Deskripsi Singkat</label>
                  <textarea name="description" rows="3" placeholder="Ceritakan sedikit tentang resep ini..." required></textarea>
                </div>

                <div className="form-group">
                  <label>Bahan-bahan (pisahkan dengan baris baru)</label>
                  <textarea name="ingredients" rows="5" placeholder="1 siung Bawang Merah&#10;2 sdm Minyak Goreng..." required></textarea>
                </div>

                <div className="form-group">
                  <label>Langkah-langkah (pisahkan dengan baris baru)</label>
                  <textarea name="steps" rows="5" placeholder="Tumis bumbu dasar hingga harum.&#10;Masukkan air..." required></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Kirim Resep</button>
              </form>
            </div>
          )}

          {activeTab === 'artikel' && (
            <div className="form-card fade-in">
              <h2>Formulir Pengajuan Artikel</h2>
              <form onSubmit={handleSubmit}>
                <div className="image-upload-area article-upload">
                  <ImagePlus size={40} className="upload-icon" />
                  <p>Unggah cover sampul artikel</p>
                </div>

                <div className="form-group">
                  <label>Judul Artikel</label>
                  <input name="title" type="text" placeholder="Contoh: 5 Rahasia Sambal Awet Tanpa Pengawet" required />
                </div>

                <div className="form-group">
                  <label>Kutipan Singkat (Excerpt)</label>
                  <textarea name="excerpt" rows="2" placeholder="Ringkasan singkat artikel yang akan muncul di card awal..." required></textarea>
                </div>

                <div className="form-group">
                  <label>Isi Artikel Sepenuhnya</label>
                  <textarea name="content" rows="10" placeholder="Tuliskan pengalaman masakan kuliner Anda di sini bebas puitis..." required></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Kirim Artikel</button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
