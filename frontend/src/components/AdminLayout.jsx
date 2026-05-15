import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, BookOpen, LayoutGrid, ShoppingBag, 
  Users, MessageSquare, BarChart2, Settings, 
  Inbox, Activity, Terminal, Search, Bell, ChevronDown,
  Calendar, LogOut
} from "lucide-react";
import '../admin.css';

const AdminLayout = ({ children, title, subtitle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const path = location.pathname;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Dropdown state for Resep
  const [isResepOpen, setIsResepOpen] = useState(
    path.includes('/dashboard/admin/recipes')
  );

  const isActive = (route) => path === route ? 'active' : '';

  return (
    <div className="admin-wrapper">
      {/* SIDEBAR */}
      <aside className="admin-sidebar-new">
        <div className="admin-brand-new">
          <div className="logo-icon"><LayoutDashboard size={20} /></div>
          <h2>rasa<span>Nusantara</span></h2>
        </div>
        
        <div className="admin-menu-section">
          <div className="admin-menu-label">Menu Utama</div>
          <ul className="admin-menu-list">
            <li>
              <Link to="/dashboard/admin" className={`admin-menu-item ${path === '/dashboard/admin' ? 'active' : ''}`}>
                <LayoutDashboard size={20} /> Dashboard
              </Link>
            </li>
            
            {/* RESEP DROPDOWN */}
            <li>
              <div 
                className={`admin-menu-item ${path.includes('/dashboard/admin/recipes') ? 'active' : ''}`} 
                onClick={() => setIsResepOpen(!isResepOpen)}
                style={{ cursor: 'pointer' }}
              >
                <BookOpen size={20} /> Resep 
                <ChevronDown 
                  size={16} 
                  style={{
                    marginLeft: 'auto', 
                    transform: isResepOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s'
                  }} 
                />
              </div>
              
              {/* DROPDOWN ITEMS */}
              {isResepOpen && (
                <ul className="admin-dropdown-list" style={{ listStyle: 'none', padding: '0 0 0 40px', margin: '8px 0' }}>
                  <li>
                    <Link to="/dashboard/admin/recipes" className="admin-menu-item" style={{ padding: '8px 12px', fontSize: '0.9rem', color: path === '/dashboard/admin/recipes' ? 'var(--primary)' : 'var(--text-light)' }}>
                      Semua Resep
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="admin-menu-item" style={{ padding: '8px 12px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                      Tambah Resep
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li><Link to="/dashboard/admin/categories" className={`admin-menu-item ${isActive('/dashboard/admin/categories')}`}><LayoutGrid size={20} /> Kategori</Link></li>
            <li><Link to="/dashboard/admin/ingredients" className={`admin-menu-item ${isActive('/dashboard/admin/ingredients')}`}><ShoppingBag size={20} /> Bahan</Link></li>
            <li><Link to="/dashboard/admin/users" className={`admin-menu-item ${isActive('/dashboard/admin/users')}`}><Users size={20} /> Pengguna</Link></li>
            <li><Link to="/dashboard/admin/comments" className={`admin-menu-item ${isActive('/dashboard/admin/comments')}`}><MessageSquare size={20} /> Komentar</Link></li>
            <li><Link to="/dashboard/admin/reports" className={`admin-menu-item ${isActive('/dashboard/admin/reports')}`}><BarChart2 size={20} /> Laporan</Link></li>
            <li><Link to="/dashboard/admin/settings" className={`admin-menu-item ${isActive('/dashboard/admin/settings')}`}><Settings size={20} /> Pengaturan</Link></li>
          </ul>
        </div>

        <div className="admin-menu-section">
          <div className="admin-menu-label">Lainnya</div>
          <ul className="admin-menu-list">
            <li><Link to="/dashboard/admin/inbox" className={`admin-menu-item ${isActive('/dashboard/admin/inbox')}`}><Inbox size={20} /> Pesan Masuk <span className="admin-menu-badge">12</span></Link></li>
            <li><Link to="/dashboard/admin/activities" className={`admin-menu-item ${isActive('/dashboard/admin/activities')}`}><Activity size={20} /> Aktivitas</Link></li>
            <li><Link to="/dashboard/admin/system-logs" className={`admin-menu-item ${isActive('/dashboard/admin/system-logs')}`}><Terminal size={20} /> Log Sistem</Link></li>
            <li style={{ marginTop: '10px' }}>
              <button 
                onClick={handleLogout} 
                className="admin-menu-item" 
                style={{ width: '100%', background: 'transparent', border: 'none', color: '#d32f2f', fontWeight: '500', cursor: 'pointer' }}
              >
                <LogOut size={20} /> Keluar
              </button>
            </li>
          </ul>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-promo-card">
            <div className="promo-icon"><BookOpen size={24} /></div>
            <h4>Kelola konten rasa Nusantara dengan mudah</h4>
            <p>Pastikan setiap resep yang ditampilkan berkualitas dan menginspirasi.</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main-new">
        {/* TOPBAR */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="admin-topbar-title">
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            {title === "Dashboard" && (
              <div className="admin-search-box">
                <Search size={18} color="#6C6B69" />
                <input type="text" placeholder="Cari resep, pengguna, dll..." />
              </div>
            )}
          </div>
          
          <div className="admin-topbar-right">
            {title === "Dashboard" && (
              <div className="admin-notification">
                <Bell size={24} />
                <div className="badge">5</div>
              </div>
            )}
            <div className="admin-user-profile">
              <img src="https://ui-avatars.com/api/?name=Admin+Rasa&background=1F3E2B&color=fff" alt="Admin" />
              <div className="admin-user-info">
                <span className="name">Admin Rasa</span>
                <span className="role">Administrator</span>
              </div>
              <ChevronDown size={16} color="#6C6B69" />
            </div>
            {title === "Dashboard" && (
              <div className="admin-date-picker">
                <Calendar size={18} />
                19 Mei - 25 Mei 2024
                <ChevronDown size={16} />
              </div>
            )}
          </div>
        </header>

        <div className="admin-content-area">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
