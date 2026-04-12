import React from "react";
import { ShieldCheck, Utensils, Award } from "lucide-react";

const Hero = () => {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>
            Menu Makan
            <br />
            Bergizi
            <br />
            Gratis
          </h1>
          <div className="hero-buttons">
            <a href="#resep" className="btn btn-primary">
              Book Menu
            </a>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1562607635-4608ff48a859?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFrYW5hbiUyMGluZG9uZXNpYXxlbnwwfHwwfHx8MA%3D%3Dl"
            alt="Delicious Indonesian Food"
            className="hero-img-circular"
          />
        </div>
      </section>

      <div className="info-strip">
        <div className="info-item">
          <ShieldCheck className="info-icon" size={24} /> 100% Halal
        </div>
        <div className="info-item">
          <Utensils className="info-icon" size={24} /> Resep Autentik
        </div>
        <div className="info-item">
          <Award className="info-icon" size={24} /> Kualitas Terbaik
        </div>
      </div>
    </>
  );
};

export default Hero;
