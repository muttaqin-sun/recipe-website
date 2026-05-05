'use client';

import React, { useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Users, FileText, CheckSquare, Activity, LogOut } from "lucide-react";

const AdminDashboard = () => {
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
          <Link to="/dashboard/admin" className="admin-nav-item active">
            <Activity size={20} /> Ringkasan
          </Link>
          <Link to="/dashboard/admin/recipes" className="admin-nav-item">
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
          <h1>Ringkasan Dasbor</h1>
          <p>Memantau aktivitas Rasa Nusantara per hari ini.</p>
        </header>

        {/* Metrik Grid */}
        <div className="admin-metrics">
          <div className="metric-card">
            <div className="metric-icon">
              <FileText size={24} />
            </div>
            <div className="metric-info">
              <h3>Total Resep Aktif</h3>
              <h2>124</h2>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">
              <Users size={24} />
            </div>
            <div className="metric-info">
              <h3>Total Pengguna</h3>
              <h2>1,043</h2>
            </div>
          </div>
          <div className="metric-card alert">
            <div className="metric-icon">
              <CheckSquare size={24} />
            </div>
            <div className="metric-info">
              <h3>Menunggu Persetujuan</h3>
              <h2>15</h2>
            </div>
          </div>
        </div>

        {/* Tabel Data Dummy */}
        <div className="admin-table-section">
          <h2>Kiriman Terbaru</h2>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Penulis (Email)</th>
                  <th>Judul Kiriman</th>
                  <th>Tipe</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#RN-092</td>
                  <td>budi@email.com</td>
                  <td>Resep Soto Banjar Asli</td>
                  <td>Resep</td>
                  <td>
                    <span className="badge badge-pending">Menunggu</span>
                  </td>
                  <td>
                    <button className="btn-sm btn-primary">Tinjau</button>
                  </td>
                </tr>
                <tr>
                  <td>#RN-091</td>
                  <td>siti@email.com</td>
                  <td>Tips Memilih Cabai Segar</td>
                  <td>Artikel</td>
                  <td>
                    <span className="badge badge-pending">Menunggu</span>
                  </td>
                  <td>
                    <button className="btn-sm btn-primary">Tinjau</button>
                  </td>
                </tr>
                <tr>
                  <td>#RN-090</td>
                  <td>user@email.com</td>
                  <td>Sate Maranggi Purwakarta</td>
                  <td>Resep</td>
                  <td>
                    <span className="badge badge-success">Disetujui</span>
                  </td>
                  <td>
                    <button className="btn-sm btn-secondary">Arsip</button>
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

export default AdminDashboard;
