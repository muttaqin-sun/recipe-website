import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Activity } from "lucide-react";
import AdminLayout from '@/components/AdminLayout';

const AdminActivities = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user || user.role !== "admin") navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  return (
    <AdminLayout title="Aktivitas" subtitle="Pantau seluruh aktivitas di platform.">
      <div className="admin-card" style={{minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center', color: 'var(--text-light)'}}>
          <Activity size={48} style={{opacity: 0.2, marginBottom: '16px'}} />
          <h2>Halaman Aktivitas</h2>
          <p>Halaman ini sedang dalam pengembangan.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminActivities;
