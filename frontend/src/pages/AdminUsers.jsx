import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Edit, Trash2 } from "lucide-react";
import AdminLayout from '@/components/AdminLayout';

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const res = await fetch('http://127.0.0.1:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Gagal memuat daftar pengguna:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user || user.role !== "admin") {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [user, navigate]);

  const handleDelete = async (id, targetName) => {
    if (user.id === id) {
      alert("Anda tidak dapat menghapus akun admin Anda sendiri!");
      return;
    }
    
    if (!window.confirm(`Yakin ingin menghapus pengguna "${targetName}"? Semua postingan resep, artikel, dan komentar milik pengguna ini juga akan dihapus secara permanen.`)) {
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const res = await fetch(`http://127.0.0.1:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message || 'Pengguna berhasil dihapus');
        fetchUsers();
      } else {
        alert(data.message || 'Gagal menghapus pengguna');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghapus pengguna');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const payload = {
        name: e.target.name.value,
        email: e.target.email.value,
        role: e.target.role.value,
      };
      const res = await fetch(`http://127.0.0.1:5000/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message || 'Pengguna berhasil diperbarui');
        setEditingUser(null);
        fetchUsers();
      } else {
        alert(data.message || 'Gagal memperbarui pengguna');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat memperbarui pengguna');
    }
  };

  if (!user) return null;

  return (
    <AdminLayout title="Kelola Pengguna" subtitle="Daftar seluruh akun pengguna yang terdaftar di platform Rasa Nusantara.">
      {editingUser && (
        <div style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex: 1000}}>
          <div style={{background: 'white', padding: '24px', borderRadius: '12px', width: '450px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'}}>
            <h3 style={{marginBottom: '16px', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-dark)'}}>Edit Pengguna</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group" style={{marginBottom: '12px'}}>
                <label style={{display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)'}}>Nama Lengkap</label>
                <input name="name" defaultValue={editingUser.name} required style={{width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none'}} />
              </div>
              <div className="form-group" style={{marginBottom: '12px'}}>
                <label style={{display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)'}}>Email</label>
                <input type="email" name="email" defaultValue={editingUser.email} required style={{width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none'}} />
              </div>
              <div className="form-group" style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)'}}>Role</label>
                <select name="role" defaultValue={editingUser.role} style={{width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none'}}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button type="submit" className="btn btn-primary" style={{flex: 1, background: 'var(--primary)', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600}}>Simpan Perubahan</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingUser(null)} style={{background: '#f1f1f1', color: '#333', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600}}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-dark)'}}>Daftar Pengguna</h2>
        </div>
        <div className="table-responsive">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Memuat data pengguna...</div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Tidak ada pengguna terdaftar.</div>
          ) : (
            <table className="admin-data-table">
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
                {users.map(userItem => (
                  <tr key={userItem.id}>
                    <td>#U-{userItem.id}</td>
                    <td className="stat-cell">{userItem.name}</td>
                    <td>{userItem.email}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        background: userItem.role === 'admin' ? '#E8F5E9' : '#F5F5F5', 
                        color: userItem.role === 'admin' ? '#2E7D32' : '#616161', 
                        fontSize: '0.8rem', 
                        fontWeight: 600
                      }}>
                        {userItem.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="icon-btn" 
                        style={{width: '32px', height: '32px'}} 
                        title="Edit"
                        onClick={() => setEditingUser(userItem)}
                      >
                        <Edit size={14} />
                      </button>
                      {userItem.id !== user.id && (
                        <button 
                          className="icon-btn" 
                          style={{width: '32px', height: '32px', marginLeft: '8px'}} 
                          title="Hapus"
                          onClick={() => handleDelete(userItem.id, userItem.name)}
                        >
                          <Trash2 size={14} color="red" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
