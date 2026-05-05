import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User, Clock, Bookmark, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Jika tidak login, kembalikan ke login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="app-container">
      <Navbar />
      <main className="profile-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', minHeight: '80vh' }}>
        <button onClick={() => navigate(-1)} className="back-button" style={{ marginBottom: '20px' }}>
          <ArrowLeft size={20} /> Kembali
        </button>

        <div className="profile-header" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div className="profile-avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1 style={{ margin: '0 0 5px 0', color: 'var(--text-dark)' }}>{user.name}</h1>
            <p style={{ margin: '0 0 10px 0', color: 'var(--text-light)' }}>{user.email}</p>
            <span className={`badge ${user.role === 'admin' ? 'badge-success' : 'badge-secondary'}`}>
              {user.role === 'admin' ? 'Administrator' : 'Pengguna Biasa'}
            </span>
          </div>
        </div>

        <div className="profile-sections" style={{ display: 'grid', gap: '30px' }}>
          
          <section className="profile-section">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
              <Clock size={24} /> Riwayat Unggahan
            </h2>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Judul Tulisan</th>
                    <th>Tipe</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Resep Nasi Liwet</td>
                    <td>Resep</td>
                    <td>10 Mei 2026</td>
                    <td><span className="badge badge-success">Disetujui</span></td>
                  </tr>
                  <tr>
                    <td>Rahasia Bumbu Sate</td>
                    <td>Artikel</td>
                    <td>12 Mei 2026</td>
                    <td><span className="badge badge-pending">Menunggu</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="profile-section">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
              <Bookmark size={24} /> Resep Tersimpan
            </h2>
            <div className="saved-recipes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              <div className="saved-recipe-card" style={{ background: 'var(--bg-card)', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                <img src="/images/rendang.jpg" alt="Rendang" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                <div style={{ padding: '10px' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>Rendang Asli Minang</h4>
                  <Link to="/resep/1" style={{ fontSize: '0.9rem', color: 'var(--primary)', textDecoration: 'none' }}>Lihat Resep →</Link>
                </div>
              </div>
              <div className="saved-recipe-card" style={{ background: 'var(--bg-card)', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                <img src="/images/sate.jpg" alt="Sate" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                <div style={{ padding: '10px' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>Sate Lilit Bali</h4>
                  <Link to="/resep/2" style={{ fontSize: '0.9rem', color: 'var(--primary)', textDecoration: 'none' }}>Lihat Resep →</Link>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
