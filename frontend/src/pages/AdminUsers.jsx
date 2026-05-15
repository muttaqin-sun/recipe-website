import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Edit, Trash2 } from "lucide-react";
import AdminLayout from '@/components/AdminLayout';

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user || user.role !== "admin") navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  return (
    <AdminLayout title="Kelola Pengguna" subtitle="Daftar seluruh akun pengguna yang terdaftar di platform Rasa Nusantara.">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-dark)'}}>Daftar Pengguna</h2>
        </div>
        <div className="table-responsive">
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
              <tr>
                <td>#U-001</td>
                <td className="stat-cell">Administrator</td>
                <td>admin@rasanusantara.id</td>
                <td><span style={{padding: '4px 8px', borderRadius: '4px', background: '#E8F5E9', color: '#2E7D32', fontSize: '0.8rem', fontWeight: 600}}>Admin</span></td>
                <td>
                  <button className="icon-btn" style={{width: '32px', height: '32px'}} title="Edit"><Edit size={14} /></button>
                </td>
              </tr>
              <tr>
                <td>#U-002</td>
                <td className="stat-cell">User Biasa</td>
                <td>user@email.com</td>
                <td><span style={{padding: '4px 8px', borderRadius: '4px', background: '#F5F5F5', color: '#616161', fontSize: '0.8rem', fontWeight: 600}}>User</span></td>
                <td>
                  <button className="icon-btn" style={{width: '32px', height: '32px'}} title="Edit"><Edit size={14} /></button>
                  <button className="icon-btn" style={{width: '32px', height: '32px', marginLeft: '8px'}} title="Hapus"><Trash2 size={14} color="red" /></button>
                </td>
              </tr>
              <tr>
                <td>#U-003</td>
                <td className="stat-cell">Budi Santoso</td>
                <td>budi@email.com</td>
                <td><span style={{padding: '4px 8px', borderRadius: '4px', background: '#F5F5F5', color: '#616161', fontSize: '0.8rem', fontWeight: 600}}>User</span></td>
                <td>
                  <button className="icon-btn" style={{width: '32px', height: '32px'}} title="Edit"><Edit size={14} /></button>
                  <button className="icon-btn" style={{width: '32px', height: '32px', marginLeft: '8px'}} title="Hapus"><Trash2 size={14} color="red" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminUsers;
