'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className="footer-wrap">
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C63.92,43.37,143.95,81.42,216.7,86.29,252.17,88.66,287.67,74.96,321.39,56.44Z" fill="var(--footer-bg)"></path>
        </svg>
      </div>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h2>Rasa Nusantara</h2>
            <p>Membawa cita rasa autentik masakan Nusantara dari dapur kami ke meja makan Anda.</p>
          </div>
          <div className="footer-links">
            <h3>Tautan Cepat</h3>
            <ul>
              <li><Link href="/">Beranda</Link></li>
              <li><a href="/#resep">Resep</a></li>
              <li><a href="/#kategori">Kategori</a></li>
              <li><a href="/#artikel">Artikel</a></li>
            </ul>
          </div>
          <div className="footer-legal">
            <h3>Kebijakan</h3>
            <ul>
              <li><a href="/#privacy">Syarat &amp; Ketentuan</a></li>
              <li><a href="/#terms">Kebijakan Privasi</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3>Hubungi Kami</h3>
            <p>Email: halo@rasanusantara.id</p>
            <p>Telepon: 0811-2233-4455</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Rasa Nusantara. Semua Hak Cipta Dilindungi.</p>
          <div className="social-icons" style={{ display: 'flex', gap: '16px', color: 'var(--gray-300)' }}>
            <span className="social-icon-btn" aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </span>
            <span className="social-icon-btn" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </span>
            <span className="social-icon-btn" aria-label="Twitter / X">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
