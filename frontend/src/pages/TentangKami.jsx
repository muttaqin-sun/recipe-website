import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChefHat, Heart, Users } from 'lucide-react';

const TentangKami = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '120px 20px 60px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ color: 'var(--text-dark)', fontSize: '2.5rem', marginBottom: '16px' }}>Tentang Rasa Nusantara</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>Platform komunitas resep terbaik yang mendedikasikan diri untuk merayakan, melestarikan, dan membagikan kekayaan kuliner dari seluruh penjuru Indonesia.</p>
        </div>

        <div style={{ background: 'var(--bg-white)', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
          <h2 style={{ color: 'var(--text-dark)', fontSize: '1.75rem', marginBottom: '20px', textAlign: 'center' }}>Visi & Misi Kami</h2>
          <p style={{ color: 'var(--text-dark)', lineHeight: '1.8', marginBottom: '20px', textAlign: 'justify' }}>
            Kami percaya bahwa makanan bukan sekadar pengisi perut, melainkan pembawa cerita, identitas, dan warisan budaya yang tak ternilai. Rasa Nusantara lahir dari keinginan kuat untuk menyatukan para pecinta masak, dari ibu rumah tangga hingga koki profesional, dalam satu wadah interaktif yang saling menginspirasi.
          </p>
          <p style={{ color: 'var(--text-dark)', lineHeight: '1.8', textAlign: 'justify' }}>
            Melalui fitur berbagi resep, menulis artikel, dan saling berinteraksi, kami ingin memudahkan setiap orang untuk menemukan kembali cita rasa masakan ibu, meracik hidangan tradisional yang nyaris terlupakan, dan terus mengeksplorasi potensi rempah lokal kita.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' }}>
          <div style={{ background: 'var(--bg-white)', padding: '32px 20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
            <ChefHat size={40} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: 'var(--text-dark)', marginBottom: '8px', fontSize: '1.25rem' }}>Resep Autentik</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Beragam koleksi masakan tradisional yang telah teruji.</p>
          </div>
          
          <div style={{ background: 'var(--bg-white)', padding: '32px 20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
            <Users size={40} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: 'var(--text-dark)', marginBottom: '8px', fontSize: '1.25rem' }}>Komunitas Aktif</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Bergabunglah dengan ribuan pencinta kuliner di seluruh Indonesia.</p>
          </div>
          
          <div style={{ background: 'var(--bg-white)', padding: '32px 20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
            <Heart size={40} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: 'var(--text-dark)', marginBottom: '8px', fontSize: '1.25rem' }}>Dibuat dengan Cinta</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Setiap resep dan artikel dibagikan dengan penuh antusiasme.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TentangKami;
