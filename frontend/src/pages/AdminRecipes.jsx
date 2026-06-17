import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Edit, Trash2 } from "lucide-react";
import AdminLayout from '@/components/AdminLayout';
import { getImageUrl } from '@/utils/imageUrl';

const AdminRecipes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);

  const fetchRecipes = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const res = await fetch('http://127.0.0.1:5000/api/recipes/admin/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRecipes(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user || user.role !== "admin") navigate("/login");
    else fetchRecipes();
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
        fetchRecipes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus resep ini?")) return;
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const res = await fetch(`http://127.0.0.1:5000/api/recipes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchRecipes();
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
        name: e.target.name.value,
        category: e.target.category.value,
        status: e.target.status.value,
      };
      const res = await fetch(`http://127.0.0.1:5000/api/recipes/${editingRecipe.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setEditingRecipe(null);
        fetchRecipes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <AdminLayout title="Kelola Resep" subtitle="Daftar seluruh resep yang terdaftar di platform Rasa Nusantara.">
      {editingRecipe && (
        <div style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex: 1000}}>
          <div style={{background: 'white', padding: '24px', borderRadius: '12px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'}}>
            <h3 style={{marginBottom: '16px'}}>Edit Resep</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group" style={{marginBottom: '12px'}}>
                <label style={{display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 600}}>Nama Resep</label>
                <input name="name" defaultValue={editingRecipe.name} required style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc'}} />
              </div>
              <div className="form-group" style={{marginBottom: '12px'}}>
                <label style={{display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 600}}>Kategori</label>
                <input name="category" defaultValue={editingRecipe.category} required style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc'}} />
              </div>
              <div className="form-group" style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 600}}>Status</label>
                <select name="status" defaultValue={editingRecipe.status} style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc'}}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>Simpan Perubahan</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingRecipe(null)} style={{background: '#f1f1f1', color: '#333', border: 'none', padding: '8px 16px', borderRadius: '8px'}}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-dark)'}}>Semua Resep</h2>
          <button className="btn btn-primary" style={{padding: '8px 20px', fontSize: '0.9rem'}}>Tambah Resep Baru</button>
        </div>
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Resep</th>
                <th>Kategori</th>
                <th>Penulis (ID)</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map(recipe => (
                <tr key={recipe.id}>
                  <td>#R-{recipe.id}</td>
                  <td className="stat-cell">{recipe.name}</td>
                  <td>{recipe.category}</td>
                  <td>{recipe.author_id}</td>
                  <td>
                    {recipe.status === 'approved' ? (
                      <span style={{padding: '4px 8px', borderRadius: '4px', background: '#E8F5E9', color: '#2E7D32', fontSize: '0.8rem', fontWeight: 600}}>Publik</span>
                    ) : (
                      <span style={{padding: '4px 8px', borderRadius: '4px', background: '#FFF3E0', color: '#E65100', fontSize: '0.8rem', fontWeight: 600}}>Menunggu</span>
                    )}
                  </td>
                  <td>
                    {recipe.status === 'pending' ? (
                      <button className="icon-btn" onClick={() => handleApprove(recipe.id)} style={{width: '32px', height: '32px', marginRight: '8px'}} title="Setujui Resep (Approve)"><Edit size={14} /></button>
                    ) : (
                      <button className="icon-btn" onClick={() => setEditingRecipe(recipe)} style={{width: '32px', height: '32px'}} title="Edit"><Edit size={14} /></button>
                    )}
                    <button className="icon-btn" onClick={() => handleDelete(recipe.id)} style={{width: '32px', height: '32px', marginLeft: '8px'}} title="Hapus"><Trash2 size={14} color="red" /></button>
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
export default AdminRecipes;
