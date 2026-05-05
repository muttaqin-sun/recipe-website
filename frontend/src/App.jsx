import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import RootLayout from './components/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import RecipeDetail from './pages/RecipeDetail';
import ArticleDetail from './pages/ArticleDetail';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminRecipes from './pages/AdminRecipes';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resep/:id" element={<RecipeDetail />} />
        <Route path="/artikel/:id" element={<ArticleDetail />} />
        <Route path="/dashboard/user" element={<UserDashboard />} />
        <Route path="/dashboard/user/profile" element={<UserProfile />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/admin/recipes" element={<AdminRecipes />} />
        <Route path="/dashboard/admin/users" element={<AdminUsers />} />
      </Routes>
    </RootLayout>
  );
}

export default App;
