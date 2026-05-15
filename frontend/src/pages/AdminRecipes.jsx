import React, { useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Edit, Trash2 } from "lucide-react";
import AdminLayout from '@/components/AdminLayout';

const AdminRecipes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);

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

  if (!user) return null;

  return (
    <AdminLayout title="Kelola Resep" subtitle="Daftar seluruh resep yang terdaftar di platform Rasa Nusantara.">
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
                    {recipe.status === 'pending' && (
                      <button onClick={() => handleApprove(recipe.id)} className="btn btn-primary" style={{fontSize: '0.7rem', padding: '4px 8px', marginRight: '8px'}}>Approve</button>
                    )}
                    <button className="icon-btn" style={{width: '32px', height: '32px'}} title="Edit"><Edit size={14} /></button>
                    <button className="icon-btn" style={{width: '32px', height: '32px', marginLeft: '8px'}} title="Hapus"><Trash2 size={14} color="red" /></button>
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
