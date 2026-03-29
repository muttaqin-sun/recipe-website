import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import RecipeList from '../components/RecipeList';
import PopularSection from '../components/PopularSection';
import ArticleSection from '../components/ArticleSection';
import Footer from '../components/Footer';
import { recipes } from '../data/recipes';

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        <RecipeList recipes={recipes} searchQuery={searchQuery} />
        <PopularSection recipes={recipes} />
        <ArticleSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
