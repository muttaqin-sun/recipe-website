'use client';

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Users, LayoutGrid, ShoppingBag, BarChart2,
  ImageIcon, UserPlus, FilePlus, MessageCircle,
  Check, X, ChevronDown
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import AdminLayout from '@/components/AdminLayout';

// Import CSS khusus Admin
import '../admin.css';

// Import local data as fallback removed
// data pada statistik resep 

const chartData = [
  { name: '19 Mei', resepBaru: 23, resepDisetujui: 52 },
  { name: '20 Mei', resepBaru: 21, resepDisetujui: 41 },
  { name: '21 Mei', resepBaru: 39, resepDisetujui: 74 },
  { name: '22 Mei', resepBaru: 28, resepDisetujui: 65 },
  { name: '23 Mei', resepBaru: 58, resepDisetujui: 95 },
  { name: '24 Mei', resepBaru: 41, resepDisetujui: 77 },
  { name: '25 Mei', resepBaru: 22, resepDisetujui: 52 },
  { name: '26 Mei', resepBaru: 38, resepDisetujui: 81 },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dataRecipes, setDataRecipes] = useState([]);
  const [stats, setStats] = useState(null);

  const fetchRecipesAndStats = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';

      // Fetch recipes
      const resRecipes = await fetch('http://127.0.0.1:5000/api/recipes/admin/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataRecipesJson = await resRecipes.json();
      if (dataRecipesJson.success) {
        setDataRecipes(dataRecipesJson.data);
      }

      // Fetch stats
      const resStats = await fetch('http://127.0.0.1:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataStatsJson = await resStats.json();
      if (dataStatsJson.success) {
        setStats(dataStatsJson.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user || user.role !== "admin") {
      navigate("/login");
    } else {
      fetchRecipesAndStats();
    }
  }, [user, navigate]);

  const handleApprove = async (id) => {
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const res = await fetch(`http://127.0.0.1:5000/api/recipes/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchRecipesAndStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Yakin ingin menolak/menghapus resep ini?")) return;
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const res = await fetch(`http://127.0.0.1:5000/api/recipes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchRecipesAndStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  // Ambil 5 resep teratas untuk "Resep Terpopuler"
  const topRecipes = dataRecipes.slice(0, 5).map((r, i) => ({
    id: r.id,
    title: r.name || r.title,
    author: r.author_name || "Admin",
    image: r.image_url || r.image,
    views: [128.4, 98.7, 76.2, 64.1, 58.3][i] + "K",
    likes: [2.4, 1.8, 1.2, 980, 870][i] + (i < 3 ? "K" : ""),
    comments: [320, 210, 178, 142, 121][i]
  }));

  // Ambil beberapa resep untuk "Menunggu Persetujuan"
  const pendingRecipes = dataRecipes.filter(r => r.status === 'pending').slice(0, 4).map((r, i) => ({
    id: r.id,
    title: r.name || r.title,
    author: r.author_name || "User",
    image: r.image_url || r.image,
    time: ["5 menit yang lalu", "15 menit yang lalu", "28 menit yang lalu", "40 menit yang lalu"][i]
  }));

  return (
    <AdminLayout title="Dashboard" subtitle="Selamat datang kembali, Admin!">
      <div className="admin-content-area">
        {/* METRIC CARDS */}
        <div className="admin-metrics-grid">
          <div className="admin-metric-card-new">
            <div className="metric-icon-box green"><ImageIcon size={24} /></div>
            <div className="metric-details">
              <h3>Total Resep</h3>
              <h2>{stats?.totalRecipes ?? 0}</h2>
              <div className="metric-trend up">Aktif di DB</div>
            </div>
          </div>
          <div className="admin-metric-card-new">
            <div className="metric-icon-box orange"><Users size={24} /></div>
            <div className="metric-details">
              <h3>Total Pengguna</h3>
              <h2>{stats?.totalUsers ?? 0}</h2>
              <div className="metric-trend up">Terdaftar di DB</div>
            </div>
          </div>
          <div className="admin-metric-card-new">
            <div className="metric-icon-box purple"><FilePlus size={24} /></div>
            <div className="metric-details">
              <h3>Resep Baru</h3>
              <h2>{stats?.pendingRecipes ?? 0}</h2>
              <div className="metric-trend up">Menunggu ACC</div>
            </div>
          </div>
          <div className="admin-metric-card-new">
            <div className="metric-icon-box red"><MessageCircle size={24} /></div>
            <div className="metric-details">
              <h3>Total Komentar</h3>
              <h2>{stats?.totalComments ?? 0}</h2>
              <div className="metric-trend up">Terbaca di DB</div>
            </div>
          </div>
        </div>

        {/* ROW 1: CHART & PENDING APPROVALS */}
        <div className="admin-two-cols">
          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Statistik Resep</h2>
              <div className="admin-date-picker" style={{ padding: '4px 12px' }}>
                7 Hari Terakhir <ChevronDown size={14} />
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.chartData || chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorResepBaru" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5E34" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#8B5E34" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorResepDisetujui" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1F3E2B" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#1F3E2B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6C6B69', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6C6B69', fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="resepBaru" name="Resep Baru" stroke="#8B5E34" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorResepBaru)" />
                  <Area type="monotone" dataKey="resepDisetujui" name="Resep Disetujui" stroke="#1F3E2B" strokeWidth={2} fillOpacity={1} fill="url(#colorResepDisetujui)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Resep Menunggu Persetujuan</h2>
              <Link to="/dashboard/admin/recipes" className="admin-card-action">Lihat Semua</Link>
            </div>
            <div className="approval-list">
              {pendingRecipes.length > 0 ? (
                pendingRecipes.map((resep, idx) => (
                  <div className="approval-item" key={idx}>
                    <img src={resep.image} alt={resep.title} />
                    <div className="approval-info">
                      <h4>{resep.title}</h4>
                      <p>oleh {resep.author}</p>
                    </div>
                    <div className="approval-actions">
                      <div className="approval-btn approve" onClick={() => handleApprove(resep.id)} style={{ cursor: 'pointer' }} title="Setujui"><Check size={16} /></div>
                      <div className="approval-btn reject" onClick={() => handleReject(resep.id)} style={{ cursor: 'pointer' }} title="Tolak / Hapus"><X size={16} /></div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-light)' }}>Tidak ada resep menunggu persetujuan.</div>
              )}
            </div>
          </div>
        </div>

        {/* ROW 2: POPULAR RECIPES & RECENT ACTIVITIES */}
        <div className="admin-two-cols">
          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Resep Terpopuler</h2>
              <Link to="#" className="admin-card-action">Lihat Semua</Link>
            </div>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Resep</th>
                  <th>Dilihat</th>
                  <th>Disukai</th>
                  <th>Komentar</th>
                </tr>
              </thead>
              <tbody>
                {topRecipes.map((resep, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <div className="recipe-cell">
                        <img src={resep.image} alt={resep.title} />
                        <div className="recipe-cell-info">
                          <h4>{resep.title}</h4>
                          <p>{resep.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="stat-cell">{resep.views}</td>
                    <td className="stat-cell">{resep.likes}</td>
                    <td className="stat-cell">{resep.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Aktivitas Terbaru</h2>
              <Link to="#" className="admin-card-action">Lihat Semua</Link>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon"><FilePlus size={16} /></div>
                <div className="activity-info">
                  <p>Resep "Ayam Betutu Khas Bali" diajukan oleh <b>Siti Nurhaliza</b></p>
                  <span>5 menit yang lalu</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}><MessageCircle size={16} /></div>
                <div className="activity-info">
                  <p>Komentar baru pada resep "Rendang Daging Sapi Asli Minang" oleh <b>Budi Santoso</b></p>
                  <span>15 menit yang lalu</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon"><Check size={16} /></div>
                <div className="activity-info">
                  <p>Resep "Es Pisang Ijo Makassar" disetujui oleh <b>Admin</b></p>
                  <span>28 menit yang lalu</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon"><UserPlus size={16} /></div>
                <div className="activity-info">
                  <p>Pengguna baru bergabung: <b>Dinda Ayu Lestari</b></p>
                  <span>40 menit yang lalu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SUMMARY CARDS */}
        <div className="admin-summary-grid">
          <div className="summary-card">
            <div className="summary-info">
              <h3>Kategori</h3>
              <p>Total {stats?.totalCategories ?? 0} Kategori</p>
              <Link to="/dashboard/admin/categories" className="summary-link">Kelola Kategori</Link>
            </div>
            <div className="summary-icon"><LayoutGrid size={24} /></div>
          </div>
          <div className="summary-card">
            <div className="summary-info">
              <h3>Bahan</h3>
              <p>Total {stats?.totalIngredients ?? 0} Bahan</p>
              <Link to="/dashboard/admin/ingredients" className="summary-link">Kelola Bahan</Link>
            </div>
            <div className="summary-icon" style={{ backgroundColor: '#FFF3E0', color: '#E65100' }}><ShoppingBag size={24} /></div>
          </div>
          <div className="summary-card">
            <div className="summary-info">
              <h3>Pengguna</h3>
              <p>{stats?.totalUsers ?? 0} Pengguna</p>
              <Link to="/dashboard/admin/users" className="summary-link">Lihat Detail</Link>
            </div>
            <div className="summary-icon" style={{ backgroundColor: '#F3E5F5', color: '#6A1B9A' }}><Users size={24} /></div>
          </div>
          <div className="summary-card">
            <div className="summary-info">
              <h3>Artikel</h3>
              <p>{stats?.totalArticles ?? 0} Artikel</p>
              <Link to="/dashboard/admin/articles" className="summary-link">Kelola Artikel</Link>
            </div>
            <div className="summary-icon pink"><BarChart2 size={24} /></div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
