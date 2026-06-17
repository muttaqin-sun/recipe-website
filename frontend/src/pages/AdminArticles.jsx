import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Edit, Trash2 } from "lucide-react";
import AdminLayout from '@/components/AdminLayout';
import { getImageUrl } from '@/utils/imageUrl';

const AdminArticles = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);

  const fetchArticles = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const res = await fetch('http://127.0.0.1:5000/api/articles/admin/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setArticles(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user || user.role !== "admin") navigate("/login");
    else fetchArticles();
  }, [user, navigate]);

  const handleApprove = async (id) => {
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const res = await fetch(`http://127.0.0.1:5000/api/articles/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchArticles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus artikel ini?")) return;
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const res = await fetch(`http://127.0.0.1:5000/api/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchArticles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const payload = {
        title: e.target.title.value,
        summary: e.target.summary.value,
        content: e.target.content.value,
        status: e.target.status.value,
      };
      const res = await fetch(`http://127.0.0.1:5000/api/articles/${editingArticle.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setEditingArticle(null);
        fetchArticles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <AdminLayout title="Kelola Artikel" subtitle="Daftar seluruh artikel yang terdaftar di platform Rasa Nusantara.">
      {editingArticle && (
        <div style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex: 1000}}>
          <div style={{background: 'white', padding: '24px', borderRadius: '12px', width: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'}}>
            <h3 style={{marginBottom: '16px'}}>Edit Artikel</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group" style={{marginBottom: '12px'}}>
                <label style={{display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 600}}>Judul Artikel</label>
                <input name="title" defaultValue={editingArticle.title} required style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc'}} />
              </div>
              <div className="form-group" style={{marginBottom: '12px'}}>
                <label style={{display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 600}}>Ringkasan (Summary)</label>
                <textarea name="summary" defaultValue={editingArticle.summary} required style={{width: '100%', height: '80px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical'}} />
              </div>
              <div className="form-group" style={{marginBottom: '12px'}}>
                <label style={{display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 600}}>Konten Lengkap</label>
                <textarea name="content" defaultValue={editingArticle.content} required style={{width: '100%', height: '150px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical'}} />
              </div>
              <div className="form-group" style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 600}}>Status</label>
                <select name="status" defaultValue={editingArticle.status} style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc'}}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>Simpan Perubahan</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingArticle(null)} style={{background: '#f1f1f1', color: '#333', border: 'none', padding: '8px 16px', borderRadius: '8px'}}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-dark)'}}>Semua Artikel</h2>
        </div>
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Gambar</th>
                <th>Judul Artikel</th>
                <th>Penulis (ID)</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id}>
                  <td>#A-{article.id}</td>
                  <td>
                    <img src={getImageUrl(article.image)} alt={article.title} style={{width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} />
                  </td>
                  <td className="stat-cell" style={{maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{article.title}</td>
                  <td>{article.author_id}</td>
                  <td>
                    {article.status === 'approved' ? (
                      <span style={{padding: '4px 8px', borderRadius: '4px', background: '#E8F5E9', color: '#2E7D32', fontSize: '0.8rem', fontWeight: 600}}>Publik</span>
                    ) : (
                      <span style={{padding: '4px 8px', borderRadius: '4px', background: '#FFF3E0', color: '#E65100', fontSize: '0.8rem', fontWeight: 600}}>Menunggu</span>
                    )}
                  </td>
                  <td>
                    {article.status === 'pending' ? (
                      <button className="icon-btn" onClick={() => handleApprove(article.id)} style={{width: '32px', height: '32px', marginRight: '8px'}} title="Setujui Artikel (Approve)"><Edit size={14} /></button>
                    ) : (
                      <button className="icon-btn" onClick={() => setEditingArticle(article)} style={{width: '32px', height: '32px'}} title="Edit"><Edit size={14} /></button>
                    )}
                    <button className="icon-btn" onClick={() => handleDelete(article.id)} style={{width: '32px', height: '32px', marginLeft: '8px'}} title="Hapus"><Trash2 size={14} color="red" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminArticles;
