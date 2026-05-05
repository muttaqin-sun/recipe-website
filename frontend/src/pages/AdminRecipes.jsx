import React, { useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Users, FileText, Activity, LogOut, Edit, Trash2 } from "lucide-react";

const AdminRecipes = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Protect route for admin only
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="admin-layout">
      {/* Sidebar Admin */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>Rasa Admin</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/dashboard/admin" className="admin-nav-item">
            <Activity size={20} /> Ringkasan
          </Link>
          <Link to="/dashboard/admin/recipes" className="admin-nav-item active">
            <FileText size={20} /> Kelola Resep
          </Link>
          <Link to="/dashboard/admin/users" className="admin-nav-item">
            <Users size={20} /> Pengguna
          </Link>
          <button onClick={handleLogout} className="admin-nav-item logout-btn">
            <LogOut size={20} /> Keluar
          </button>
        </nav>
      </aside>

      {/* Konten Utama Admin */}
      <main className="admin-content">
        <header className="admin-header">
          <h1>Kelola Resep</h1>
          <p>Daftar seluruh resep yang terdaftar di platform Rasa Nusantara.</p>
        </header>

        <div className="admin-table-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Semua Resep</h2>
            <button className="btn btn-primary">Tambah Resep Baru</button>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Resep</th>
                  <th>Kategori</th>
                  <th>Penulis</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#R-102</td>
                  <td>Rendang Daging Padang</td>
                  <td>Makanan Berat</td>
                  <td>admin@rasanusantara.id</td>
                  <td><span className="badge badge-success">Publik</span></td>
                  <td>
                    <button className="icon-btn" title="Edit"><Edit size={16} /></button>
                    <button className="icon-btn" title="Hapus"><Trash2 size={16} color="red" /></button>
                  </td>
                </tr>
                <tr>
                  <td>#R-101</td>
                  <td>Sate Lilit Bali</td>
                  <td>Tradisional</td>
                  <td>user@email.com</td>
                  <td><span className="badge badge-success">Publik</span></td>
                  <td>
                    <button className="icon-btn" title="Edit"><Edit size={16} /></button>
                    <button className="icon-btn" title="Hapus"><Trash2 size={16} color="red" /></button>
                  </td>
                </tr>
                <tr>
                  <td>#R-100</td>
                  <td>Es Dawet Ayu</td>
                  <td>Minuman</td>
                  <td>user@email.com</td>
                  <td><span className="badge badge-pending">Menunggu</span></td>
                  <td>
                    <button className="icon-btn" title="Edit"><Edit size={16} /></button>
                    <button className="icon-btn" title="Hapus"><Trash2 size={16} color="red" /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminRecipes;
