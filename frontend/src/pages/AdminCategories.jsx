import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LayoutGrid } from "lucide-react";
import AdminLayout from '@/components/AdminLayout';

const AdminCategories = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user || user.role !== "admin") navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  return (
    <AdminLayout title="Kategori" subtitle="Kelola kategori resep masakan Anda.">
      <div className="admin-card" style={{minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center', color: 'var(--text-light)'}}>
          <LayoutGrid size={48} style={{opacity: 0.2, marginBottom: '16px'}} />
          <h2>Halaman Kategori</h2>
          <p>Halaman ini sedang dalam pengembangan.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
