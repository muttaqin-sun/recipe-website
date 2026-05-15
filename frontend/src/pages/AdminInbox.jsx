import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Inbox, Mail, MailOpen } from "lucide-react";
import AdminLayout from '@/components/AdminLayout';

const AdminInbox = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user || user.role !== "admin") navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const dummyMessages = [
    { id: 1, sender: "Budi Santoso", subject: "Pertanyaan tentang Resep Rendang", excerpt: "Halo admin, saya ingin bertanya apakah daging bisa diganti ayam?", date: "Hari ini, 10:30", isRead: false },
    { id: 2, sender: "Siti Nurhaliza", subject: "Laporan Pengguna Spam", excerpt: "Ada pengguna yang terus mengirim komentar spam di resep saya.", date: "Kemarin, 15:45", isRead: false },
    { id: 3, sender: "Andi Pratama", subject: "Kerjasama Sponsorship", excerpt: "Kami dari PT Rasa Mandiri ingin menawarkan kerjasama...", date: "20 Mei 2024", isRead: true },
    { id: 4, sender: "Rina Handayani", subject: "Error saat upload foto", excerpt: "Saya tidak bisa mengunggah foto profil baru. Mohon bantuannya.", date: "18 Mei 2024", isRead: true },
  ];

  return (
    <AdminLayout title="Pesan Masuk" subtitle="Kotak masuk pesan dari pengguna dan notifikasi sistem.">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-dark)'}}>Daftar Pesan</h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dummyMessages.map(msg => (
            <div key={msg.id} style={{ 
              display: 'flex', gap: '16px', padding: '16px', 
              borderRadius: '12px', 
              border: '1px solid var(--border-color)',
              backgroundColor: msg.isRead ? 'transparent' : '#F7F4EF',
              cursor: 'pointer'
            }}>
              <div style={{ color: msg.isRead ? 'var(--text-light)' : 'var(--primary)' }}>
                {msg.isRead ? <MailOpen size={24} /> : <Mail size={24} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, color: 'var(--text-dark)', fontWeight: msg.isRead ? 600 : 800 }}>{msg.sender}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{msg.date}</span>
                </div>
                <h5 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: 'var(--text-dark)', fontWeight: msg.isRead ? 500 : 700 }}>{msg.subject}</h5>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>{msg.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInbox;
