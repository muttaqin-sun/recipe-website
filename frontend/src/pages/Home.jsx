
'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import RecipeList from '@/components/RecipeList';
import ArticleSection from '@/components/ArticleSection';
import Footer from '@/components/Footer';
import { recipes } from '@/data/recipes';

// Integration mockup fallback (use the local data for now, while building API link)
// To fully fetch from API, we would replace recipes with fetched state here.
// Tahap 8 Integration requires substituting this with axios fetches:

export default function Home() {
  const [dataRecipes, setDataRecipes] = useState(recipes);

  useEffect(() => {
    fetch('http://localhost:5000/api/recipes')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data.length > 0) {
          setDataRecipes(res.data);
        }
      })
      .catch(err => console.log('API not ready yet, using fallback dummy data', err));
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        <RecipeList recipes={dataRecipes} />
        <ArticleSection />
      </main>
      <Footer />
    </div>
  );
}
