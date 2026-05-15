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

// Import local data as fallback
import { recipes } from '@/data/recipes';

const chartData = [
  { name: '19 Mei', resepBaru: 23, resepDisetujui: 52 },
  { name: '20 Mei', resepBaru: 21, resepDisetujui: 41 },
  { name: '21 Mei', resepBaru: 39, resepDisetujui: 74 },
  { name: '22 Mei', resepBaru: 28, resepDisetujui: 65 },
  { name: '23 Mei', resepBaru: 58, resepDisetujui: 98 },
  { name: '24 Mei', resepBaru: 41, resepDisetujui: 77 },
  { name: '25 Mei', resepBaru: 22, resepDisetujui: 52 },
  { name: '26 Mei', resepBaru: 38, resepDisetujui: 81 },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dataRecipes, setDataRecipes] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user || user.role !== "admin") {
      navigate("/login");
    }

    // Ambil data resep (fallback ke mock data jika API belum siap)
    fetch('http://localhost:5000/api/recipes')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data.length > 0) {
          setDataRecipes(res.data);
        } else {
          setDataRecipes(recipes);
        }
      })
      .catch(() => {
        setDataRecipes(recipes);
      });
  }, [user, navigate]);

  if (!user) return null;

  // Ambil 5 resep teratas untuk "Resep Terpopuler"
  const topRecipes = dataRecipes.slice(0, 5).map((r, i) => ({
    id: r.id,
    title: r.title,
    author: r.author_name || "Admin",
    image: r.image_url || r.image,
    views: [128.4, 98.7, 76.2, 64.1, 58.3][i] + "K",
    likes: [2.4, 1.8, 1.2, 980, 870][i] + (i < 3 ? "K" : ""),
    comments: [320, 210, 178, 142, 121][i]
  }));

  // Ambil beberapa resep untuk "Menunggu Persetujuan"
  const pendingRecipes = dataRecipes.slice(5, 9).map((r, i) => ({
    id: r.id,
    title: r.title,
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
                <h2>1.248</h2>
                <div className="metric-trend up">↑ 12.5% <span className="text">dari minggu lalu</span></div>
              </div>
            </div>
            <div className="admin-metric-card-new">
              <div className="metric-icon-box orange"><Users size={24} /></div>
              <div className="metric-details">
                <h3>Total Pengguna</h3>
                <h2>12.842</h2>
                <div className="metric-trend up">↑ 18.7% <span className="text">dari minggu lalu</span></div>
              </div>
            </div>
            <div className="admin-metric-card-new">
              <div className="metric-icon-box purple"><FilePlus size={24} /></div>
              <div className="metric-details">
                <h3>Resep Baru</h3>
                <h2>89</h2>
                <div className="metric-trend up">↑ 15.1% <span className="text">dari minggu lalu</span></div>
              </div>
            </div>
            <div className="admin-metric-card-new">
              <div className="metric-icon-box red"><MessageCircle size={24} /></div>
              <div className="metric-details">
                <h3>Total Komentar</h3>
                <h2>2.156</h2>
                <div className="metric-trend up">↑ 9.3% <span className="text">dari minggu lalu</span></div>
              </div>
            </div>
          </div>

          {/* ROW 1: CHART & PENDING APPROVALS */}
          <div className="admin-two-cols">
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Statistik Resep</h2>
                <div className="admin-date-picker" style={{padding: '4px 12px'}}>
                  7 Hari Terakhir <ChevronDown size={14} />
                </div>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorResepBaru" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5E34" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#8B5E34" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorResepDisetujui" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1F3E2B" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#1F3E2B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6C6B69', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6C6B69', fontSize: 12}} />
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
                <Link to="#" className="admin-card-action">Lihat Semua</Link>
              </div>
              <div className="approval-list">
                {pendingRecipes.map((resep, idx) => (
                  <div className="approval-item" key={idx}>
                    <img src={resep.image} alt={resep.title} />
                    <div className="approval-info">
                      <h4>{resep.title}</h4>
                      <p>oleh {resep.author}</p>
                      <span>{resep.time}</span>
                    </div>
                    <div className="approval-actions">
                      <div className="approval-btn approve"><Check size={16} /></div>
                      <div className="approval-btn reject"><X size={16} /></div>
                    </div>
                  </div>
                ))}
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
                  <div className="activity-icon" style={{backgroundColor: '#E8F5E9', color: '#2E7D32'}}><MessageCircle size={16} /></div>
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
                <p>Total 24 Kategori</p>
                <Link to="/dashboard/admin/categories" className="summary-link">Kelola Kategori</Link>
              </div>
              <div className="summary-icon"><LayoutGrid size={24} /></div>
            </div>
            <div className="summary-card">
              <div className="summary-info">
                <h3>Bahan</h3>
                <p>Total 152 Bahan</p>
                <Link to="/dashboard/admin/ingredients" className="summary-link">Kelola Bahan</Link>
              </div>
              <div className="summary-icon" style={{backgroundColor: '#FFF3E0', color: '#E65100'}}><ShoppingBag size={24} /></div>
            </div>
            <div className="summary-card">
              <div className="summary-info">
                <h3>Pengguna Aktif</h3>
                <p>2.341 pengguna</p>
                <Link to="/dashboard/admin/users" className="summary-link">Lihat Detail</Link>
              </div>
              <div className="summary-icon" style={{backgroundColor: '#F3E5F5', color: '#6A1B9A'}}><Users size={24} /></div>
            </div>
            <div className="summary-card">
              <div className="summary-info">
                <h3>Laporan</h3>
                <p>Lihat laporan bulanan</p>
                <Link to="/dashboard/admin/reports" className="summary-link">Buka Laporan</Link>
              </div>
              <div className="summary-icon pink"><BarChart2 size={24} /></div>
            </div>
          </div>

        </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
