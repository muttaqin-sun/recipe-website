import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TipsTrik = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '120px 20px 60px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: 'var(--text-dark)', fontSize: '2.5rem', marginBottom: '16px' }}>Tips & Trik Kuliner</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', lineHeight: '1.6' }}>Kumpulan rahasia dapur dan panduan praktis untuk menyempurnakan hidangan Nusantara Anda.</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'var(--bg-white)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '1.25rem' }}>1. Rahasia Daging Rendang Empuk</h3>
            <p style={{ color: 'var(--text-dark)', lineHeight: '1.6' }}>Gunakan daun pepaya atau nanas parut untuk melunakkan daging sebelum dimasak. Bungkus daging dengan daun pepaya yang sudah diremas selama 30 menit. Jika menggunakan nanas parut, balurkan tipis saja dan diamkan 15 menit agar daging tidak hancur saat direbus lama.</p>
          </div>
          
          <div style={{ background: 'var(--bg-white)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '1.25rem' }}>2. Menjaga Kesegaran Sayuran</h3>
            <p style={{ color: 'var(--text-dark)', lineHeight: '1.6' }}>Sayuran hijau akan lebih awet jika disimpan dalam wadah tertutup yang dilapisi tisu dapur di dalam kulkas. Pastikan sayuran dalam keadaan kering sebelum disimpan. Tisu akan menyerap kelembapan ekstra sehingga sayuran tidak cepat membusuk.</p>
          </div>
          
          <div style={{ background: 'var(--bg-white)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '1.25rem' }}>3. Menggoreng Ikan Tanpa Lengket</h3>
            <p style={{ color: 'var(--text-dark)', lineHeight: '1.6' }}>Pastikan wajan dan minyak sudah benar-benar panas sebelum memasukkan ikan. Anda juga bisa menaburkan sedikit tepung terigu atau garam halus ke dalam minyak panas sebelum menggoreng untuk mengurangi cipratan dan mencegah kulit ikan menempel di wajan.</p>
          </div>

          <div style={{ background: 'var(--bg-white)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '1.25rem' }}>4. Sambal Tahan Lama</h3>
            <p style={{ color: 'var(--text-dark)', lineHeight: '1.6' }}>Untuk membuat sambal rumahan awet berhari-hari tanpa pengawet, pastikan semua bahan ditumis hingga benar-benar matang. Gunakan minyak yang agak banyak sehingga seluruh bagian sambal terendam, dan selalu gunakan sendok bersih saat mengambil sambal dari toples.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TipsTrik;
