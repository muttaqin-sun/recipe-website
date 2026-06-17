
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import RecipeList from '@/components/RecipeList';
import ArticleSection from '@/components/ArticleSection';
import Footer from '@/components/Footer';

// Integration mockup fallback (use the local data for now, while building API link)
// To fully fetch from API, we would replace recipes with fetched state here.
// Tahap 8 Integration requires substituting this with axios fetches:

export default function Home() {
  const [dataRecipes, setDataRecipes] = useState([]);
  const [dataArticles, setDataArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const query = searchParams.get('search') || '';

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

  const filteredRecipes = query 
    ? dataRecipes.filter(r => 
        r.name.toLowerCase().includes(query.toLowerCase()) || 
        (r.category && r.category.toLowerCase().includes(query.toLowerCase())) ||
        (r.description && r.description.toLowerCase().includes(query.toLowerCase()))
      )
    : dataRecipes;

  const filteredArticles = query
    ? dataArticles.filter(a => 
        a.title.toLowerCase().includes(query.toLowerCase()) || 
        (a.content && a.content.toLowerCase().includes(query.toLowerCase()))
      )
    : dataArticles;

  // Cek jika ada pencarian dan kita perlu mengarahkan otomatis
  if (query) {
    const exactRecipeMatch = dataRecipes.find(r => r.name.toLowerCase() === query.toLowerCase());
    if (exactRecipeMatch) {
      navigate(`/resep/${exactRecipeMatch.id}`, { replace: true });
      return null;
    } else if (filteredRecipes.length === 1 && filteredArticles.length === 0) {
      navigate(`/resep/${filteredRecipes[0].id}`, { replace: true });
      return null;
    }
  }

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        {query && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Hasil Pencarian untuk: "{query}"</h2>
          </div>
        )}
        <RecipeList recipes={filteredRecipes} />
        <ArticleSection articles={filteredArticles} />
      </main>
      <Footer />
    </div>
  );
}
