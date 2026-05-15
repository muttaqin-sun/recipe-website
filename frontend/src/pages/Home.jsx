
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
  const [dataRecipes, setDataRecipes] = useState([]);
  const [dataArticles, setDataArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Recipes
        const recipeRes = await fetch('http://127.0.0.1:5000/api/recipes');
        const recipeData = await recipeRes.json();
        if (recipeData.success) setDataRecipes(recipeData.data);

        // Fetch Articles
        const articleRes = await fetch('http://127.0.0.1:5000/api/articles');
        const articleData = await articleRes.json();
        if (articleData.success) setDataArticles(articleData.data);
      } catch (err) {
        console.error('Gagal mengambil data dari API, pastikan backend berjalan:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="app-container">
        <Navbar />
        <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div className="loader">Menyiapkan hidangan lezat...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        <RecipeList recipes={dataRecipes} />
        <ArticleSection articles={dataArticles} />
      </main>
      <Footer />
    </div>
  );
}
