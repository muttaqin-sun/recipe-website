import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { MessageSquare, Trash2 } from "lucide-react";
import AdminLayout from '@/components/AdminLayout';

const AdminComments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const res = await fetch('http://127.0.0.1:5000/api/admin/comments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (err) {
      console.error('Gagal memuat komentar:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user || user.role !== "admin") {
      navigate("/login");
    } else {
      fetchComments();
    }
  }, [user, navigate]);

  const handleDelete = async (id, type) => {
    if (!window.confirm("Yakin ingin menghapus komentar ini?")) return;
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const url = `http://127.0.0.1:5000/api/admin/comments/${type}/${id}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchComments();
      } else {
        alert('Gagal menghapus komentar');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <AdminLayout title="Komentar" subtitle="Kelola semua komentar yang diposting oleh pengguna pada resep dan artikel.">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-dark)' }}>Daftar Komentar ({comments.length})</h2>
        </div>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>Memuat data komentar...</div>
        ) : comments.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Pengguna</th>
                  <th>Komentar</th>
                  <th>Tipe Konten</th>
                  <th>Judul Konten</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, idx) => (
                  <tr key={`${comment.type}-${comment.id}-${idx}`}>
                    <td style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{comment.user_name}</td>
                    <td style={{ maxWidth: '300px', wordWrap: 'break-word', whiteSpace: 'normal', color: 'var(--text-dark)' }}>{comment.content}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '100px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        background: comment.type === 'recipe' ? '#E3F2FD' : '#F3E5F5',
                        color: comment.type === 'recipe' ? '#1E88E5' : '#8E24AA'
                      }}>
                        {comment.type === 'recipe' ? 'Resep' : 'Artikel'}
                      </span>
                    </td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Link 
                        to={comment.type === 'recipe' ? `/resep/${comment.target_id}` : `/artikel/${comment.target_id}`}
                        style={{ color: 'var(--primary)', fontWeight: '500', textDecoration: 'none' }}
                        target="_blank"
                      >
                        {comment.target_name}
                      </Link>
                    </td>
                    <td style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                      {new Date(comment.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td>
                      <button 
                        className="icon-btn" 
                        onClick={() => handleDelete(comment.id, comment.type)} 
                        style={{ width: '32px', height: '32px' }} 
                        title="Hapus Komentar"
                      >
                        <Trash2 size={14} color="red" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p>Belum ada komentar di database.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminComments;
