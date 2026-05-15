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
import AdminCategories from './pages/AdminCategories';
import AdminIngredients from './pages/AdminIngredients';
import AdminReports from './pages/AdminReports';
import AdminComments from './pages/AdminComments';
import AdminSettings from './pages/AdminSettings';
import AdminInbox from './pages/AdminInbox';
import AdminActivities from './pages/AdminActivities';
import AdminSystemLogs from './pages/AdminSystemLogs';

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
        <Route path="/dashboard/admin/categories" element={<AdminCategories />} />
        <Route path="/dashboard/admin/ingredients" element={<AdminIngredients />} />
        <Route path="/dashboard/admin/reports" element={<AdminReports />} />
        <Route path="/dashboard/admin/comments" element={<AdminComments />} />
        <Route path="/dashboard/admin/settings" element={<AdminSettings />} />
        <Route path="/dashboard/admin/inbox" element={<AdminInbox />} />
        <Route path="/dashboard/admin/activities" element={<AdminActivities />} />
        <Route path="/dashboard/admin/system-logs" element={<AdminSystemLogs />} />
      </Routes>
    </RootLayout>
  );
}

export default App;
