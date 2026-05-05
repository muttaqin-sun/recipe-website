'use client';

import React, { useState, useEffect } from "react";
import { Compass } from "lucide-react";
import { Link } from 'react-router-dom';

const heroSlides = [
  {
    id: 1,
    title: "rasa Nusantara",
    subtitle: "Temukan resep autentik dari berbagai daerah di Indonesia. Masak mudah, rasa istimewa.",
    image: "https://images.unsplash.com/photo-1562607635-4608ff48a859?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "rasa Autentik",
    subtitle: "Warisan kuliner leluhur yang kaya akan rempah. Hadirkan kehangatan di meja makan Anda.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "rasa Istimewa",
    subtitle: "Kumpulan resep jajanan pasar dan hidangan penutup manis khas Nusantara yang menggugah selera.",
    image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&auto=format&fit=crop&q=80",
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = currentSlideState();
  const [isAnimating, setIsAnimating] = useState(false);

  // Helper for hook state
  function currentSlideState() {
    return useState(0);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      handleNextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleNextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const slide = heroSlides[currentSlide];

  return (
    <section className="hero-container" style={{ padding: '0 20px', marginTop: '20px' }}>
      <div 
        className="hero-card" 
        style={{ 
          backgroundColor: 'var(--bg-hero)', 
          borderRadius: '40px', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '480px'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', width: '100%', minHeight: '480px' }}>
          
          {/* Left Content */}
          <div className="hero-text-content" style={{ flex: '1', minWidth: '300px', padding: '60px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2 }}>
            <h1 style={{ lineHeight: '1', marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
              <span className="serif-font" style={{ color: 'var(--primary)', fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: '700' }}>
                {slide.title.split(' ')[0]}
                {slide.id === 1 && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--secondary)" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '-4px', transform: 'rotate(45deg) translateY(-10px)' }}>
                    <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" />
                  </svg>
                )}
              </span>
              <span className="serif-font" style={{ color: 'var(--secondary)', fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: '400', marginTop: '-10px' }}>
                {slide.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', maxWidth: '400px', marginBottom: '30px', lineHeight: '1.6' }}>
              {slide.subtitle}
            </p>
            <div>
              <a href="#resep" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px' }}>
                <Compass size={20} /> Jelajahi Resep
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="hero-image-content" style={{ flex: '1', minWidth: '300px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={slide.image} 
              alt={slide.title} 
              style={{ 
                width: '100%', 
                height: '100%', 
                maxHeight: '440px',
                objectFit: 'cover', 
                borderRadius: '32px',
                boxShadow: 'var(--shadow-md)',
                transition: 'opacity 0.5s ease-in-out',
                opacity: isAnimating ? 0.5 : 1
              }} 
            />
          </div>

        </div>

        {/* Slider Dots */}
        <div style={{ position: 'absolute', bottom: '24px', left: '0', width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 10 }}>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: currentSlide === index ? 'var(--primary)' : 'var(--gray-300)',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
