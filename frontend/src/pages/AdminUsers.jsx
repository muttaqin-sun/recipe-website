import React, { useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Users, FileText, Activity, LogOut, Edit, Trash2 } from "lucide-react";

const AdminUsers = () => {
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
          <Link to="/dashboard/admin/recipes" className="admin-nav-item">
            <FileText size={20} /> Kelola Resep
          </Link>
          <Link to="/dashboard/admin/users" className="admin-nav-item active">
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
          <h1>Kelola Pengguna</h1>
          <p>Daftar seluruh akun pengguna yang terdaftar di platform Rasa Nusantara.</p>
        </header>

        <div className="admin-table-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Daftar Pengguna</h2>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID Pengguna</th>
                  <th>Nama Lengkap</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#U-001</td>
                  <td>Administrator</td>
                  <td>admin@rasanusantara.id</td>
                  <td><span className="badge badge-success">Admin</span></td>
                  <td>
                    <button className="icon-btn" title="Edit"><Edit size={16} /></button>
                  </td>
                </tr>
                <tr>
                  <td>#U-002</td>
                  <td>User Biasa</td>
                  <td>user@email.com</td>
                  <td><span className="badge badge-secondary">User</span></td>
                  <td>
                    <button className="icon-btn" title="Edit"><Edit size={16} /></button>
                    <button className="icon-btn" title="Hapus"><Trash2 size={16} color="red" /></button>
                  </td>
                </tr>
                <tr>
                  <td>#U-003</td>
                  <td>Budi Santoso</td>
                  <td>budi@email.com</td>
                  <td><span className="badge badge-secondary">User</span></td>
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

export default AdminUsers;
