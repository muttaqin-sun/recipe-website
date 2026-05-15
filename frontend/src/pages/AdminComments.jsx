import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { MessageSquare } from "lucide-react";
import AdminLayout from '@/components/AdminLayout';

const AdminComments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user || user.role !== "admin") navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  return (
    <AdminLayout title="Komentar" subtitle="Kelola komentar pengguna.">
      <div className="admin-card" style={{minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center', color: 'var(--text-light)'}}>
          <MessageSquare size={48} style={{opacity: 0.2, marginBottom: '16px'}} />
          <h2>Halaman Komentar</h2>
          <p>Halaman ini sedang dalam pengembangan.</p>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminComments;
