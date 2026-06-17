'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Home, Book, Bookmark, Heart, PlusCircle, FileText,
  MessageSquare, User, Settings, LogOut, ArrowLeft,
  CloudUpload, X, Plus, Clock, Send, Trash2,
  MapPin, Instagram, Mail, Eye, Camera, Pencil, ChevronDown
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getImageUrl } from '@/utils/imageUrl';
import '../user-dashboard.css';

const UserDashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Sidebar states
  const [activeMenu, setActiveMenu] = useState('Buat Postingan');

  // Form states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Dynamic form fields
  const [ingredients, setIngredients] = useState([{ name: '', qty: '' }]);
  const [steps, setSteps] = useState(['']);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [difficulty, setDifficulty] = useState('Sedang');

  // Publish states
  const [isDraft, setIsDraft] = useState(false);
  const [isPublishNow, setIsPublishNow] = useState(true);

  // Profile states
  const [userRecipes, setUserRecipes] = useState([]);
  const [userArticles, setUserArticles] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [likedArticles, setLikedArticles] = useState([]);
  const [commentedRecipes, setCommentedRecipes] = useState([]);
  const [commentedArticles, setCommentedArticles] = useState([]);
  const [favoritTab, setFavoritTab] = useState('Resep');
  const [komentarTab, setKomentarTab] = useState('Resep');
  const [profileTab, setProfileTab] = useState('Postingan Saya');
  const [editingId, setEditingId] = useState(null);
  const [isPostinganOpen, setIsPostinganOpen] = useState(false);

  // Edit Profile Modal states
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editProfileName, setEditProfileName] = useState('');
  const [editProfileBio, setEditProfileBio] = useState('');
  const [editProfileLocation, setEditProfileLocation] = useState('');
  const [editProfileInstagram, setEditProfileInstagram] = useState('');
  const [editProfileLoading, setEditProfileLoading] = useState(false);
  const [editProfileError, setEditProfileError] = useState('');
  const [editProfileSuccess, setEditProfileSuccess] = useState('');

  const handleMenuClick = (menu) => {
    if (menu === 'Buat Postingan') {
      setEditingId(null);
      setImageFile(null);
      setImagePreview(null);
      setIngredients([{ name: '', qty: '' }]);
      setSteps(['']);
      setTags([]);
      setDifficulty('Sedang');
      setTimeout(() => {
        const form = document.querySelector('.form-card form');
        if (form) form.reset();
      }, 0);
    } else if (menu === 'Buat Artikel') {
      setEditingId(null);
      setImageFile(null);
      setImagePreview(null);
      setTimeout(() => {
        const form = document.querySelector('.form-card form');
        if (form) form.reset();
      }, 0);
    }
    setActiveMenu(menu);
  };

  const openEditProfileModal = () => {
    setEditProfileName(user?.name || '');
    setEditProfileBio(user?.bio || '');
    setEditProfileLocation(user?.location || '');
    setEditProfileInstagram(user?.instagram || '');
    setEditProfileError('');
    setEditProfileSuccess('');
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editProfileName.trim()) {
      setEditProfileError('Nama tidak boleh kosong.');
      return;
    }
    setEditProfileLoading(true);
    setEditProfileError('');
    const result = await updateProfile({
      name: editProfileName.trim(),
      bio: editProfileBio,
      location: editProfileLocation,
      instagram: editProfileInstagram
    });
    setEditProfileLoading(false);
    if (result.success) {
      setEditProfileSuccess('Profil berhasil diperbarui!');
      setTimeout(() => setShowEditProfileModal(false), 1200);
    } else {
      setEditProfileError(result.message || 'Gagal memperbarui profil.');
    }
  };

  const handleEditClick = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/recipes/${id}`);
      const data = await res.json();
      if (data.success) {
        const recipe = data.data;
        setEditingId(id);
        setActiveMenu('Buat Postingan');
        
        setTimeout(() => {
          const form = document.querySelector('.form-card form');
          if (form) {
            if (form.name) form.name.value = recipe.name || '';
            if (form.description) form.description.value = recipe.description || '';
            if (form.category) form.category.value = recipe.category || 'Utama';
            if (form.origin) form.origin.value = recipe.origin || '';
            if (form.dishType) form.dishType.value = recipe.dish_type || '';
            if (form.suitableFor) form.suitableFor.value = recipe.suitable_for || '';
            if (form.portions) form.portions.value = recipe.portions || '';
            if (form.prepTime) form.prepTime.value = recipe.prep_time || '';
            if (form.cookingTime) form.cookingTime.value = recipe.cooking_time || '';
          }
        }, 100);

        setDifficulty(recipe.difficulty || 'Sedang');
        
        if (recipe.ingredients && recipe.ingredients.length > 0) {
          const parsedIngs = recipe.ingredients.map(ing => ({ name: ing, qty: '' }));
          setIngredients(parsedIngs);
        } else {
          setIngredients([{ name: '', qty: '' }]);
        }

        if (recipe.steps && recipe.steps.length > 0) {
          setSteps(recipe.steps);
        } else {
          setSteps(['']);
        }
        
        if (recipe.tags) {
          setTags(recipe.tags.split(',').map(t => t.trim()).filter(Boolean));
        } else {
          setTags([]);
        }
        
        if (recipe.image) {
          setImagePreview(getImageUrl(recipe.image));
        }
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error("Error fetching recipe for edit", err);
    }
  };

  const handleArticleEditClick = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/articles/${id}`);
      const data = await res.json();
      if (data.success) {
        const article = data.data;
        setEditingId(id);
        setActiveMenu('Buat Artikel');
        
        setTimeout(() => {
          const form = document.querySelector('.form-card form');
          if (form) {
            if (form.title) form.title.value = article.title || '';
            if (form.summary) form.summary.value = article.summary || '';
            if (form.content) form.content.value = article.content || '';
          }
        }, 100);

        if (article.image) {
          setImagePreview(getImageUrl(article.image));
        } else {
          setImagePreview(null);
        }
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error("Error fetching article for edit", err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user || user.role !== 'user') {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchOwnRecipes = async (token) => {
    try {
      const userRes = await fetch('http://127.0.0.1:5000/api/recipes/user/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = await userRes.json();
      if (userData.success) {
        setUserRecipes(userData.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOwnArticles = async (token) => {
    try {
      const articleRes = await fetch('http://127.0.0.1:5000/api/articles/user/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const articleData = await articleRes.json();
      if (articleData.success) {
        setUserArticles(articleData.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSavedRecipes = async (token) => {
    try {
      const savedRes = await fetch('http://127.0.0.1:5000/api/recipes/user/saved', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const savedData = await savedRes.json();
      if (savedData.success) {
        setSavedRecipes(savedData.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLikedRecipes = async (token) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/recipes/user/liked', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLikedRecipes(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLikedArticles = async (token) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/articles/user/liked', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLikedArticles(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCommentedRecipes = async (token) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/recipes/user/commented', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCommentedRecipes(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCommentedArticles = async (token) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/articles/user/commented', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCommentedArticles(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : '';
    if (!token) return;

    if (activeMenu === 'Profil Saya') {
      if (profileTab === 'Postingan Saya') {
        fetchOwnRecipes(token);
      } else if (profileTab === 'Artikel Saya') {
        fetchOwnArticles(token);
      } else if (profileTab === 'Resep Disimpan') {
        fetchSavedRecipes(token);
      } else if (profileTab === 'Disukai') {
        fetchLikedRecipes(token);
        fetchLikedArticles(token);
      } else if (profileTab === 'Komentar') {
        fetchCommentedRecipes(token);
        fetchCommentedArticles(token);
      }
    } else if (activeMenu === 'Koleksi Saya') {
      fetchSavedRecipes(token);
    } else if (activeMenu === 'Favorit') {
      fetchLikedRecipes(token);
      fetchLikedArticles(token);
    } else if (activeMenu === 'Komentar') {
      fetchCommentedRecipes(token);
      fetchCommentedArticles(token);
    } else if (activeMenu === 'Resep Saya') {
      fetchOwnRecipes(token);
    }
  }, [activeMenu, profileTab, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    document.getElementById('recipeImageInput').value = '';
  };

  // Handlers for dynamic ingredients
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => setIngredients([...ingredients, { name: '', qty: '' }]);
  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // Handlers for dynamic steps
  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addStep = () => setSteps([...steps, '']);
  const removeStep = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  // Handlers for tags
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };
  const removeTag = (tagToRemove) => setTags(tags.filter(tag => tag !== tagToRemove));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : '';

    const formData = new FormData();
    formData.append('name', e.target.name.value);
    formData.append('description', e.target.description.value);
    formData.append('category', e.target.category.value);

    // New fields
    formData.append('origin', e.target.origin.value);
    formData.append('dish_type', e.target.dishType.value);
    formData.append('suitable_for', e.target.suitableFor.value);
    formData.append('portions', e.target.portions.value);
    formData.append('prep_time', e.target.prepTime.value);

    formData.append('cooking_time', e.target.cookingTime.value);
    formData.append('difficulty', difficulty);

    // Process ingredients: combine name and qty
    ingredients.forEach(i => {
      if (i.name.trim()) {
        const fullIng = i.qty.trim() ? `${i.qty} ${i.name}` : i.name;
        formData.append('ingredients[]', fullIng);
      }
    });

    // Process steps
    steps.forEach(s => {
      if (s.trim()) formData.append('steps[]', s);
    });

    if (imageFile) {
      formData.append('image', imageFile);
    }

    if (tags.length > 0) {
      formData.append('tags', tags.join(','));
    }

    try {
      const url = editingId ? `http://127.0.0.1:5000/api/recipes/${editingId}` : 'http://127.0.0.1:5000/api/recipes';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        if (editingId) {
          setEditingId(null);
          handleMenuClick('Profil Saya');
        }
        e.target.reset();
        setImageFile(null);
        setImagePreview(null);
        setIngredients([{ name: '', qty: '' }]);
        setSteps(['']);
        setTags([]);
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : '';

    const formData = new FormData();
    formData.append('title', e.target.title.value);
    formData.append('summary', e.target.summary.value);
    formData.append('content', e.target.content.value);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const url = editingId ? `http://127.0.0.1:5000/api/articles/${editingId}` : 'http://127.0.0.1:5000/api/articles';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        if (editingId) {
          setEditingId(null);
          setProfileTab('Artikel Saya');
          handleMenuClick('Profil Saya');
        }
        e.target.reset();
        setImageFile(null);
        setImagePreview(null);
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="ud-navbar-wrapper">
        <Navbar />
      </div>

      <div className="user-dashboard-layout">
        {/* Sidebar */}
        <aside className="ud-sidebar">
          <Link to="/" className="ud-nav-item">
            <Home size={20} /> Beranda
          </Link>
          <button className={`ud-nav-item ${activeMenu === 'Resep Saya' ? 'active' : ''}`} onClick={() => handleMenuClick('Resep Saya')}>
            <Book size={20} /> Resep Saya
          </button>
          <button className={`ud-nav-item ${activeMenu === 'Koleksi Saya' ? 'active' : ''}`} onClick={() => handleMenuClick('Koleksi Saya')}>
            <Bookmark size={20} /> Koleksi Saya
          </button>
          <button className={`ud-nav-item ${activeMenu === 'Favorit' ? 'active' : ''}`} onClick={() => handleMenuClick('Favorit')}>
            <Heart size={20} /> Favorit
          </button>
          
          <div 
            className={`ud-nav-item ${(activeMenu === 'Buat Postingan' || activeMenu === 'Buat Artikel') ? 'active' : ''}`} 
            onClick={() => setIsPostinganOpen(!isPostinganOpen)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <PlusCircle size={20} /> Buat Postingan
            <ChevronDown 
              size={16} 
              style={{
                marginLeft: 'auto', 
                transform: isPostinganOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }} 
            />
          </div>
          
          {isPostinganOpen && (
            <ul style={{ listStyle: 'none', padding: '0 0 0 35px', margin: '4px 0 12px 0' }}>
              <li>
                <div 
                  className={`ud-nav-item ${activeMenu === 'Buat Postingan' ? 'active' : ''}`} 
                  onClick={() => handleMenuClick('Buat Postingan')}
                  style={{ padding: '8px 16px', fontSize: '0.9rem', marginBottom: '4px', cursor: 'pointer' }}
                >
                  <Book size={16} style={{ marginRight: '8px' }}/> Resep
                </div>
              </li>
              <li>
                <div 
                  className={`ud-nav-item ${activeMenu === 'Buat Artikel' ? 'active' : ''}`} 
                  onClick={() => handleMenuClick('Buat Artikel')}
                  style={{ padding: '8px 16px', fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  <FileText size={16} style={{ marginRight: '8px' }}/> Artikel
                </div>
              </li>
            </ul>
          )}

          <button className={`ud-nav-item ${activeMenu === 'Draft Saya' ? 'active' : ''}`} onClick={() => handleMenuClick('Draft Saya')}>
            <FileText size={20} /> Draft Saya
          </button>
          <button className={`ud-nav-item ${activeMenu === 'Komentar' ? 'active' : ''}`} onClick={() => handleMenuClick('Komentar')}>
            <MessageSquare size={20} /> Komentar
          </button>
          <button className={`ud-nav-item ${activeMenu === 'Profil Saya' ? 'active' : ''}`} onClick={() => handleMenuClick('Profil Saya')}>
            <User size={20} /> Profil Saya
          </button>
          <button className={`ud-nav-item ${activeMenu === 'Pengaturan Akun' ? 'active' : ''}`} onClick={() => handleMenuClick('Pengaturan Akun')}>
            <Settings size={20} /> Pengaturan Akun
          </button>

          <button className="ud-nav-item ud-logout-btn" onClick={handleLogout}>
            <LogOut size={20} /> Keluar
          </button>

          <div className="ud-promo-banner">
            <h4>Bagikan resep terbaikmu</h4>
            <p>Menginspirasi lebih banyak orang dengan cita rasa Nusantara.</p>
            <img src="https://cdn-icons-png.flaticon.com/512/3444/3444393.png" alt="Bowl" style={{ width: '60px', opacity: 0.8 }} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="ud-main-content">
          {activeMenu === 'Buat Postingan' ? (
            <>
              {isSubmitted && (
                <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 'bold' }}>
                  Resep berhasil dipublikasikan dan menunggu persetujuan Admin!
                </div>
              )}

              <div className="ud-header">
                <div className="ud-header-top">
                  <ArrowLeft className="ud-back-icon" size={24} onClick={() => navigate(-1)} />
                  <h1>Buat Postingan Resep</h1>
                </div>
                <p>Bagikan resep andalanmu ke komunitas rasa Nusantara.</p>
              </div>

              <form onSubmit={handleSubmit} className="ud-form-grid">
                {/* Left Column */}
                <div className="ud-column">
                  <div className="ud-form-group">
                    <label className="ud-label">Judul Resep <span>*</span></label>
                    <input name="name" className="ud-input" placeholder="Contoh: Rendang Daging Sapi Asli Minang" required />
                  </div>

                  <div className="ud-form-group">
                    <label className="ud-label">Deskripsi Singkat <span>*</span></label>
                    <textarea
                      name="description"
                      className="ud-textarea"
                      placeholder="Contoh: Rendang dengan bumbu rempah khas Minang yang kaya rasa dan empuk sempurna."
                      maxLength={200}
                      required
                    />
                    <div className="char-count">0/200</div>
                  </div>

                  <div className="ud-row-2">
                    <div className="ud-form-group">
                      <label className="ud-label">Kategori <span>*</span></label>
                      <select name="category" className="ud-select" required>
                        <option value="">Pilih kategori</option>
                        <option value="Makanan Berat">Makanan Berat</option>
                        <option value="Camilan">Camilan</option>
                        <option value="Minuman">Minuman</option>
                        <option value="Tradisional">Tradisional</option>
                      </select>
                    </div>
                    <div className="ud-form-group">
                      <label className="ud-label">Asal Daerah <span>*</span></label>
                      <input name="origin" className="ud-input" placeholder="Contoh: Padang, Minang" required />
                    </div>
                  </div>

                  <div className="ud-row-2">
                    <div className="ud-form-group">
                      <label className="ud-label">Jenis Masakan <span>*</span></label>
                      <input name="dishType" className="ud-input" placeholder="Contoh: Hidangan Utama" required />
                    </div>
                    <div className="ud-form-group">
                      <label className="ud-label">Cocok Untuk <span>*</span></label>
                      <input name="suitableFor" className="ud-input" placeholder="Contoh: Makan Malam" required />
                    </div>
                  </div>

                  <div className="ud-row-2">
                    <div className="ud-form-group">
                      <label className="ud-label">Porsi <span>*</span></label>
                      <div className="ud-input-icon-wrapper">
                        <User size={18} />
                        <input name="portions" type="number" className="ud-input" placeholder="Contoh: 4 porsi" required />
                      </div>
                    </div>
                    <div className="ud-form-group">
                      <label className="ud-label">Waktu Memasak (menit) <span>*</span></label>
                      <div className="ud-input-icon-wrapper">
                        <Clock size={18} />
                        <input name="cookingTime" type="number" className="ud-input" placeholder="Contoh: 60 menit" required />
                      </div>
                    </div>
                  </div>

                  <div className="ud-row-2">
                    <div className="ud-form-group">
                      <label className="ud-label">Waktu Persiapan (menit) <span>*</span></label>
                      <div className="ud-input-icon-wrapper">
                        <Clock size={18} />
                        <input name="prepTime" type="number" className="ud-input" placeholder="Contoh: 15 menit" required />
                      </div>
                    </div>
                  </div>

                  <div className="ud-form-group">
                    <label className="ud-label">Tingkat Kesulitan <span>*</span></label>
                    <div className="ud-difficulty-group">
                      <div className={`ud-diff-card ${difficulty === 'Mudah' ? 'active' : ''}`} onClick={() => setDifficulty('Mudah')}>
                        <span className="dot green"></span> Mudah
                      </div>
                      <div className={`ud-diff-card ${difficulty === 'Sedang' ? 'active' : ''}`} onClick={() => setDifficulty('Sedang')}>
                        <span className="dot yellow"></span> Sedang
                      </div>
                      <div className={`ud-diff-card ${difficulty === 'Sulit' ? 'active' : ''}`} onClick={() => setDifficulty('Sulit')}>
                        <span className="dot red"></span> Sulit
                      </div>
                    </div>
                  </div>

                  <div className="ud-form-group">
                    <label className="ud-label">Tags (Opsional)</label>
                    <input
                      type="text"
                      className="ud-input"
                      placeholder="Tambah tag, tekan Enter setelah tiap tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                    />
                    {tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                        {tags.map((tag, idx) => (
                          <span key={idx} style={{ background: '#E8F5E9', color: '#2E7D32', padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {tag} <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag(tag)} />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="ud-form-group" style={{ marginTop: '12px' }}>
                    <label className="ud-label">Langkah-langkah <span>*</span></label>
                    <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '8px' }}>Jelaskan langkah demi langkah agar resep mudah diikuti.</p>

                    {steps.map((step, index) => (
                      <div className="ud-list-item" key={index}>
                        <div className="ud-step-number">{index + 1}</div>
                        <div className="ud-step-upload" title="Upload foto langkah (Segera hadir)">
                          <CloudUpload size={20} />
                        </div>
                        <textarea
                          className="ud-textarea"
                          style={{ minHeight: '60px', flex: 1 }}
                          placeholder="Contoh: Tumis bumbu halus bersama daun jeruk, daun salam, dan serai hingga harum."
                          value={step}
                          onChange={(e) => handleStepChange(index, e.target.value)}
                          required
                        />
                        <button type="button" className="ud-del-btn" onClick={() => removeStep(index)}><Trash2 size={20} /></button>
                      </div>
                    ))}

                    <button type="button" className="ud-add-btn" onClick={addStep}>
                      <Plus size={18} /> Tambah Langkah
                    </button>
                  </div>
                </div>

                {/* Right Column */}
                <div className="ud-column">
                  <div className="ud-card">
                    <h3 className="ud-card-title">Foto Resep <span>*</span></h3>
                    <p className="ud-card-desc">Foto yang menarik akan membuat resepmu lebih dilirik!</p>

                    {!imagePreview ? (
                      <div className="ud-photo-upload" onClick={() => document.getElementById('recipeImageInput').click()}>
                        <CloudUpload size={32} color="#9CA3AF" style={{ margin: '0 auto 12px' }} />
                        <p style={{ color: '#4B5563', fontWeight: 600, fontSize: '0.95rem' }}>Drag & drop foto di sini<br />atau klik untuk memilih file</p>
                        <p style={{ color: '#9CA3AF', fontSize: '0.8rem', marginTop: '8px' }}>Format: JPG, PNG (Maks. 5MB)</p>
                      </div>
                    ) : (
                      <div className="ud-photo-gallery">
                        <div className="ud-photo-item">
                          <img src={imagePreview} alt="Preview" />
                          <div className="ud-photo-del" onClick={handleRemoveImage}><X size={12} /></div>
                        </div>
                        <div className="ud-photo-add-more" onClick={() => document.getElementById('recipeImageInput').click()}>
                          <Plus size={24} />
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      id="recipeImageInput"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>

                  <div className="ud-card">
                    <h3 className="ud-card-title">Bahan-bahan <span>*</span></h3>
                    <p className="ud-card-desc">Masukkan semua bahan yang digunakan dalam resepmu.</p>

                    {ingredients.map((item, index) => (
                      <div className="ud-list-item" key={index} style={{ gap: '8px', marginBottom: '8px' }}>
                        <input
                          className="ud-input"
                          placeholder="Contoh: Daging sapi"
                          value={item.name}
                          onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                          required
                          style={{ flex: 2 }}
                        />
                        <input
                          className="ud-input"
                          placeholder="Contoh: 500 gram"
                          value={item.qty}
                          onChange={(e) => handleIngredientChange(index, 'qty', e.target.value)}
                          required
                          style={{ flex: 1 }}
                        />
                        <button type="button" className="ud-del-btn" style={{ marginTop: '0' }} onClick={() => removeIngredient(index)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}

                    <button type="button" className="ud-add-btn" onClick={addIngredient}>
                      <Plus size={18} /> Tambah Bahan
                    </button>
                  </div>

                  <div className="ud-card ud-publish-box">
                    <h3 className="ud-card-title">Publikasikan</h3>
                    <p className="ud-card-desc">Periksa kembali detail resepmu sebelum dipublikasikan.</p>

                    <div className="ud-toggle-row" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', marginBottom: '16px' }}>
                      <div className="ud-toggle-info">
                        <h4>Simpan sebagai draft</h4>
                        <p>Resep hanya kamu yang bisa lihat.</p>
                      </div>
                      <label className="switch">
                        <input type="checkbox" checked={isDraft} onChange={() => setIsDraft(!isDraft)} />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="ud-toggle-row">
                      <div className="ud-toggle-info">
                        <h4>Publikasikan sekarang</h4>
                        <p>Resep akan tampil di beranda dan bisa dilihat semua pengguna.</p>
                      </div>
                      <label className="switch">
                        <input type="checkbox" checked={isPublishNow} onChange={() => setIsPublishNow(!isPublishNow)} />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <button type="submit" className="ud-publish-btn">
                      <Send size={18} /> Publikasikan Resep
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : activeMenu === 'Buat Artikel' ? (
            <div className="form-card">
              {isSubmitted && (
                <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 'bold' }}>
                  {editingId ? 'Artikel berhasil diperbarui!' : 'Artikel berhasil dikirim dan menunggu persetujuan admin!'}
                </div>
              )}
              <div className="ud-form-header">
                <h2>{editingId ? 'Edit Artikel' : 'Buat Artikel Baru'}</h2>
                <p>Bagikan cerita, tips, dan wawasan kuliner Anda dengan komunitas.</p>
              </div>
              <form onSubmit={handleArticleSubmit} className="ud-form-grid">
                <div className="ud-column">
                  <div className="ud-form-group">
                    <label className="ud-label">Judul Artikel <span>*</span></label>
                    <input name="title" className="ud-input" placeholder="Contoh: 5 Rahasia Membuat Rendang Empuk" required />
                  </div>
                  
                  <div className="ud-form-group">
                    <label className="ud-label">Penjelasan Singkat <span>*</span></label>
                    <textarea
                      name="summary"
                      className="ud-textarea"
                      placeholder="Ringkasan singkat tentang artikel Anda"
                      maxLength={200}
                      required
                    />
                  </div>
                  
                  <div className="ud-form-group">
                    <label className="ud-label">Artikel Lengkap <span>*</span></label>
                    <textarea
                      name="content"
                      className="ud-textarea"
                      placeholder="Tulis artikel lengkap di sini..."
                      style={{ minHeight: '300px' }}
                      required
                    />
                  </div>
                </div>

                <div className="ud-column">
                  <div className="ud-form-group">
                    <label className="ud-label">Gambar Header <span>*</span></label>
                    <div className="ud-image-upload-box" onClick={() => document.getElementById('articleImageInput').click()}>
                      {imagePreview ? (
                        <div className="ud-preview-container">
                          <img src={imagePreview} alt="Preview" className="ud-image-preview" />
                          <button type="button" className="ud-remove-image-btn" onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}>
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="ud-upload-placeholder">
                          <CloudUpload size={40} className="ud-upload-icon" />
                          <p>Klik untuk mengunggah foto</p>
                          <span>PNG, JPG max 5MB</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        id="articleImageInput" 
                        style={{ display: 'none' }} 
                        accept="image/*"
                        onChange={handleImageChange}
                        {...(!editingId && !imageFile && { required: true })}
                      />
                    </div>
                  </div>

                  <div className="ud-publish-section">
                    <button type="submit" className="ud-publish-btn">
                      <Send size={18} /> Publikasikan Artikel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : activeMenu === 'Profil Saya' ? (
            <div className="ud-profile-container">
              <div className="ud-profile-header">
                <div className="ud-profile-top">
                  <div className="ud-profile-avatar-wrap">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" alt="Avatar" className="ud-profile-avatar" />
                    <div className="ud-profile-cam-btn">
                      <Camera size={14} />
                    </div>
                  </div>
                  <div className="ud-profile-info">
                    <div className="ud-profile-name-row">
                      <h2 className="ud-profile-name">{user.name || 'Ilham Muttaqin'}</h2>
                      <span className="ud-profile-badge">Food Content Creator</span>
                    </div>
                    <div className="ud-profile-handle">
                      @{user.name ? user.name.toLowerCase().replace(/\s+/g, '') : 'ilhammuttaqin'} &nbsp;&middot;&nbsp; Bergabung sejak Mei 2024
                    </div>
                    <p className="ud-profile-bio">
                      {user.bio || 'Pecinta kuliner nusantara dan penulis resep masakan rumahan sehari-hari.'}
                    </p>
                    <div className="ud-profile-links">
                      {(user.location || user.location === '') && (
                        <span className="ud-profile-link-item"><MapPin size={14} /> {user.location || 'Indonesia'}</span>
                      )}
                      <span className="ud-profile-link-item"><Instagram size={14} /> instagram.com/{user.instagram || (user.name ? user.name.toLowerCase().replace(/\s+/g, '') : 'username')}</span>
                      <span className="ud-profile-link-item"><Mail size={14} /> {user.email}</span>
                    </div>
                  </div>
                  <button className="ud-profile-edit-btn" onClick={openEditProfileModal}>Edit Profil</button>
                </div>
                
                <div className="ud-profile-stats">
                  <div className="ud-stat-item">
                    <div className="ud-stat-num">{userRecipes.length}</div>
                    <div className="ud-stat-label">Postingan</div>
                  </div>
                  <div className="ud-stat-item">
                    <div className="ud-stat-num">1.2K</div>
                    <div className="ud-stat-label">Pengikut</div>
                  </div>
                  <div className="ud-stat-item">
                    <div className="ud-stat-num">152</div>
                    <div className="ud-stat-label">Mengikuti</div>
                  </div>
                  <div className="ud-stat-item">
                    <div className="ud-stat-num">{savedRecipes.length}</div>
                    <div className="ud-stat-label">Resep Disimpan</div>
                  </div>
                  <div className="ud-stat-item">
                    <div className="ud-stat-num">312</div>
                    <div className="ud-stat-label">Disukai</div>
                  </div>
                </div>
              </div>

              <div className="ud-profile-tabs">
                {['Postingan Saya', 'Artikel Saya', 'Resep Disimpan', 'Disukai', 'Komentar', 'Tentang Saya'].map(tab => (
                  <div 
                    key={tab} 
                    className={`ud-profile-tab ${profileTab === tab ? 'active' : ''}`}
                    onClick={() => setProfileTab(tab)}
                  >
                    {tab}
                  </div>
                ))}
              </div>

              {profileTab === 'Postingan Saya' && (
                <div>
                  <h3 style={{fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-dark)'}}>Postingan Saya</h3>
                  <p style={{color: '#6B7280', fontSize: '0.9rem', marginBottom: '24px'}}>Kumpulan resep yang telah kamu bagikan.</p>
                  
                  {userRecipes.length > 0 ? (
                    <div className="ud-profile-grid">
                      {userRecipes.map(recipe => (
                        <div key={recipe.id} className="ud-profile-card" style={{cursor: 'default'}}>
                          <Link to={`/resep/${recipe.id}`} className="ud-profile-card-img" style={{display:'block'}}>
                            <img src={getImageUrl(recipe.image)} alt={recipe.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                          </Link>
                          <div className="ud-profile-card-content">
                            <Link to={`/resep/${recipe.id}`} style={{textDecoration:'none', color:'inherit'}}>
                              <h4 className="ud-profile-card-title">
                                {recipe.name}
                                {recipe.status === 'pending' && <span style={{marginLeft:'8px', fontSize:'0.7rem', background:'#FFF3E0', color:'#E65100', padding:'2px 6px', borderRadius:'10px', verticalAlign:'middle', fontWeight:'normal'}}>Pending</span>}
                              </h4>
                            </Link>
                            <div className="ud-profile-card-meta">
                              <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Clock size={12} /> {recipe.cooking_time || recipe.cookingTime} menit</span>
                              <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Eye size={12} /> {Math.floor(Math.random() * 500) + 100}</span>
                            </div>
                            <div className="ud-profile-card-actions">
                              <button onClick={(e) => handleEditClick(e, recipe.id)} style={{background:'none',border:'none',cursor:'pointer',color:'inherit',padding:'4px'}} title="Edit Resep">
                                <Pencil size={16} />
                              </button>
                              <Bookmark size={16} title="Simpan" />
                              <MessageSquare size={16} title="Komentar" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>Belum ada resep yang diposting.</div>
                  )}
                </div>
              )}

              {profileTab === 'Artikel Saya' && (
                <div>
                  <h3 style={{fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-dark)'}}>Artikel Saya</h3>
                  <p style={{color: '#6B7280', fontSize: '0.9rem', marginBottom: '24px'}}>Kumpulan artikel yang telah kamu bagikan.</p>
                  
                  {userArticles.length > 0 ? (
                    <div className="ud-profile-grid">
                      {userArticles.map(article => (
                        <Link to={`/artikel/${article.id}`} key={article.id} className="ud-profile-card">
                          <div className="ud-profile-card-img">
                            <img src={getImageUrl(article.image)} alt={article.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                          </div>
                          <div className="ud-profile-card-content">
                            <h4 className="ud-profile-card-title">
                              {article.title}
                              {article.status === 'pending' && <span style={{marginLeft:'8px', fontSize:'0.7rem', background:'#FFF3E0', color:'#E65100', padding:'2px 6px', borderRadius:'10px', verticalAlign:'middle', fontWeight:'normal'}}>Pending</span>}
                            </h4>
                            <div className="ud-profile-card-meta">
                              <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><FileText size={12} /> Artikel</span>
                            </div>
                            <div className="ud-profile-card-actions">
                              <button onClick={(e) => handleArticleEditClick(e, article.id)} style={{background:'none',border:'none',cursor:'pointer',color:'inherit',padding:'4px'}}>
                                <Pencil size={16} title="Edit" />
                              </button>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>Belum ada artikel yang ditulis.</div>
                  )}
                </div>
              )}

              {profileTab === 'Resep Disimpan' && (
                <div>
                  <h3 style={{fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-dark)'}}>Resep Disimpan</h3>
                  <p style={{color: '#6B7280', fontSize: '0.9rem', marginBottom: '24px'}}>Resep yang kamu simpan untuk dicoba nanti.</p>
                  
                  {savedRecipes.length > 0 ? (
                    <div className="ud-profile-grid">
                      {savedRecipes.map(recipe => (
                        <Link to={`/resep/${recipe.id}`} key={recipe.id} className="ud-profile-card">
                          <div className="ud-profile-card-img">
                            <img src={getImageUrl(recipe.image)} alt={recipe.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                          </div>
                          <div className="ud-profile-card-content">
                            <h4 className="ud-profile-card-title">{recipe.name}</h4>
                            <div className="ud-profile-card-meta">
                              <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Clock size={12} /> {recipe.cooking_time || recipe.cookingTime} menit</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>Belum ada resep yang disimpan.</div>
                  )}
                </div>
              )}

              {profileTab === 'Disukai' && (
                <div>
                  <h3 style={{fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-dark)'}}>Postingan Disukai</h3>
                  <p style={{color: '#6B7280', fontSize: '0.9rem', marginBottom: '24px'}}>Kumpulan resep dan artikel yang kamu sukai.</p>
                  
                  <div className="ud-profile-tabs" style={{ marginBottom: '24px' }}>
                    <div className={`ud-profile-tab ${favoritTab === 'Resep' ? 'active' : ''}`} onClick={() => setFavoritTab('Resep')}>
                      Resep ({likedRecipes.length})
                    </div>
                    <div className={`ud-profile-tab ${favoritTab === 'Artikel' ? 'active' : ''}`} onClick={() => setFavoritTab('Artikel')}>
                      Artikel ({likedArticles.length})
                    </div>
                  </div>

                  {favoritTab === 'Resep' ? (
                    likedRecipes.length > 0 ? (
                      <div className="ud-profile-grid">
                        {likedRecipes.map(recipe => (
                          <Link to={`/resep/${recipe.id}`} key={recipe.id} className="ud-profile-card">
                            <div className="ud-profile-card-img">
                              <img src={getImageUrl(recipe.image)} alt={recipe.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                            </div>
                            <div className="ud-profile-card-content">
                              <h4 className="ud-profile-card-title">{recipe.name}</h4>
                              <div className="ud-profile-card-meta">
                                <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Clock size={12} /> {recipe.cooking_time || recipe.cookingTime}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>Belum ada resep yang disukai.</div>
                    )
                  ) : (
                    likedArticles.length > 0 ? (
                      <div className="ud-profile-grid">
                        {likedArticles.map(article => (
                          <Link to={`/artikel/${article.id}`} key={article.id} className="ud-profile-card">
                            <div className="ud-profile-card-img">
                              <img src={getImageUrl(article.image)} alt={article.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                            </div>
                            <div className="ud-profile-card-content">
                              <h4 className="ud-profile-card-title">{article.title}</h4>
                              <div className="ud-profile-card-meta">
                                <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><FileText size={12} /> Artikel</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>Belum ada artikel yang disukai.</div>
                    )
                  )}
                </div>
              )}

              {profileTab === 'Komentar' && (
                <div>
                  <h3 style={{fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-dark)'}}>Komentar Saya</h3>
                  <p style={{color: '#6B7280', fontSize: '0.9rem', marginBottom: '24px'}}>Kumpulan komentar yang telah kamu kirimkan.</p>
                  
                  <div className="ud-profile-tabs" style={{ marginBottom: '24px' }}>
                    <div className={`ud-profile-tab ${komentarTab === 'Resep' ? 'active' : ''}`} onClick={() => setKomentarTab('Resep')}>
                      Resep ({commentedRecipes.length})
                    </div>
                    <div className={`ud-profile-tab ${komentarTab === 'Artikel' ? 'active' : ''}`} onClick={() => setKomentarTab('Artikel')}>
                      Artikel ({commentedArticles.length})
                    </div>
                  </div>

                  {komentarTab === 'Resep' ? (
                    commentedRecipes.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {commentedRecipes.map(comment => (
                          <div key={comment.comment_id} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                                {new Date(comment.comment_created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p style={{ fontStyle: 'italic', color: '#374151', fontSize: '0.95rem', background: '#F9FAFB', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                              "{comment.content}"
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                              <span style={{ fontSize: '0.85rem', color: '#4B5563', fontWeight: 'bold' }}>Pada Resep:</span>
                              <Link to={`/resep/${comment.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', background: '#E8F5E9', color: '#2E7D32', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                                <img src={getImageUrl(comment.image)} alt={comment.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                                {comment.name}
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>Belum ada komentar pada resep.</div>
                    )
                  ) : (
                    commentedArticles.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {commentedArticles.map(comment => (
                          <div key={comment.comment_id} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                                {new Date(comment.comment_created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p style={{ fontStyle: 'italic', color: '#374151', fontSize: '0.95rem', background: '#F9FAFB', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                              "{comment.content}"
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                              <span style={{ fontSize: '0.85rem', color: '#4B5563', fontWeight: 'bold' }}>Pada Artikel:</span>
                              <Link to={`/artikel/${comment.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', background: '#FFF3E0', color: '#E65100', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                                <img src={getImageUrl(comment.image)} alt={comment.title} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                                {comment.title}
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>Belum ada komentar pada artikel.</div>
                    )
                  )}
                </div>
              )}

              {profileTab === 'Tentang Saya' && (
                <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>
                  <p>Halaman ini belum tersedia. Menunggu pengembangan berikutnya !.</p>
                </div>
              )}
            </div>
          ) : activeMenu === 'Resep Saya' ? (
            <div>
              <div className="ud-header">
                <div className="ud-header-top">
                  <ArrowLeft className="ud-back-icon" size={24} onClick={() => navigate(-1)} />
                  <h1>Resep Saya</h1>
                </div>
                <p>Kelola resep-resep yang telah kamu publikasikan.</p>
              </div>

              {userRecipes.length > 0 ? (
                <div className="ud-profile-grid">
                  {userRecipes.map(recipe => (
                    <Link to={`/resep/${recipe.id}`} key={recipe.id} className="ud-profile-card">
                      <div className="ud-profile-card-img">
                        <img src={getImageUrl(recipe.image)} alt={recipe.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                      </div>
                      <div className="ud-profile-card-content">
                        <h4 className="ud-profile-card-title">
                          {recipe.name}
                          {recipe.status === 'pending' && <span style={{marginLeft:'8px', fontSize:'0.7rem', background:'#FFF3E0', color:'#E65100', padding:'2px 6px', borderRadius:'10px', verticalAlign:'middle', fontWeight:'normal'}}>Pending</span>}
                        </h4>
                        <div className="ud-profile-card-meta">
                          <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Clock size={12} /> {recipe.cooking_time || recipe.cookingTime}</span>
                          <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Eye size={12} /> {Math.floor(Math.random() * 500) + 100}</span>
                        </div>
                        <div className="ud-profile-card-actions">
                          <button onClick={(e) => handleEditClick(e, recipe.id)} style={{background:'none',border:'none',cursor:'pointer',color:'inherit',padding:'4px'}}>
                            <Pencil size={16} title="Edit" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>Belum ada resep yang diposting.</div>
              )}
            </div>
          ) : activeMenu === 'Koleksi Saya' ? (
            <div>
              <div className="ud-header">
                <div className="ud-header-top">
                  <ArrowLeft className="ud-back-icon" size={24} onClick={() => navigate(-1)} />
                  <h1>Koleksi Resep Saya</h1>
                </div>
                <p>Resep kuliner Nusantara yang telah kamu simpan.</p>
              </div>

              {savedRecipes.length > 0 ? (
                <div className="ud-profile-grid">
                  {savedRecipes.map(recipe => (
                    <Link to={`/resep/${recipe.id}`} key={recipe.id} className="ud-profile-card">
                      <div className="ud-profile-card-img">
                        <img src={getImageUrl(recipe.image)} alt={recipe.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                      </div>
                      <div className="ud-profile-card-content">
                        <h4 className="ud-profile-card-title">{recipe.name}</h4>
                        <div className="ud-profile-card-meta">
                          <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Clock size={12} /> {recipe.cooking_time || recipe.cookingTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>Belum ada resep yang disimpan.</div>
              )}
            </div>
          ) : activeMenu === 'Favorit' ? (
            <div>
              <div className="ud-header">
                <div className="ud-header-top">
                  <ArrowLeft className="ud-back-icon" size={24} onClick={() => navigate(-1)} />
                  <h1>Postingan Favorit</h1>
                </div>
                <p>Resep dan artikel kuliner yang paling kamu sukai.</p>
              </div>

              <div className="ud-profile-tabs" style={{ marginBottom: '24px' }}>
                <div className={`ud-profile-tab ${favoritTab === 'Resep' ? 'active' : ''}`} onClick={() => setFavoritTab('Resep')}>
                  Resep Favorit ({likedRecipes.length})
                </div>
                <div className={`ud-profile-tab ${favoritTab === 'Artikel' ? 'active' : ''}`} onClick={() => setFavoritTab('Artikel')}>
                  Artikel Favorit ({likedArticles.length})
                </div>
              </div>

              {favoritTab === 'Resep' ? (
                likedRecipes.length > 0 ? (
                  <div className="ud-profile-grid">
                    {likedRecipes.map(recipe => (
                      <Link to={`/resep/${recipe.id}`} key={recipe.id} className="ud-profile-card">
                        <div className="ud-profile-card-img">
                          <img src={getImageUrl(recipe.image)} alt={recipe.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        </div>
                        <div className="ud-profile-card-content">
                          <h4 className="ud-profile-card-title">{recipe.name}</h4>
                          <div className="ud-profile-card-meta">
                            <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Clock size={12} /> {recipe.cooking_time || recipe.cookingTime}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>Belum ada resep yang disukai.</div>
                )
              ) : (
                likedArticles.length > 0 ? (
                  <div className="ud-profile-grid">
                    {likedArticles.map(article => (
                      <Link to={`/artikel/${article.id}`} key={article.id} className="ud-profile-card">
                        <div className="ud-profile-card-img">
                          <img src={getImageUrl(article.image)} alt={article.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        </div>
                        <div className="ud-profile-card-content">
                          <h4 className="ud-profile-card-title">{article.title}</h4>
                          <div className="ud-profile-card-meta">
                            <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><FileText size={12} /> Artikel</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>Belum ada artikel yang disukai.</div>
                )
              )}
            </div>
          ) : activeMenu === 'Komentar' ? (
            <div>
              <div className="ud-header">
                <div className="ud-header-top">
                  <ArrowLeft className="ud-back-icon" size={24} onClick={() => navigate(-1)} />
                  <h1>Komentar Saya</h1>
                </div>
                <p>Riwayat tanggapan dan masukan yang telah kamu berikan.</p>
              </div>

              <div className="ud-profile-tabs" style={{ marginBottom: '24px' }}>
                <div className={`ud-profile-tab ${komentarTab === 'Resep' ? 'active' : ''}`} onClick={() => setKomentarTab('Resep')}>
                  Komentar Resep ({commentedRecipes.length})
                </div>
                <div className={`ud-profile-tab ${komentarTab === 'Artikel' ? 'active' : ''}`} onClick={() => setKomentarTab('Artikel')}>
                  Komentar Artikel ({commentedArticles.length})
                </div>
              </div>

              {komentarTab === 'Resep' ? (
                commentedRecipes.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {commentedRecipes.map(comment => (
                      <div key={comment.comment_id} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                            {new Date(comment.comment_created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ fontStyle: 'italic', color: '#374151', fontSize: '0.95rem', background: '#F9FAFB', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                          "{comment.content}"
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.85rem', color: '#4B5563', fontWeight: 'bold' }}>Pada Resep:</span>
                          <Link to={`/resep/${comment.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', background: '#E8F5E9', color: '#2E7D32', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                            <img src={getImageUrl(comment.image)} alt={comment.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                            {comment.name}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>Belum ada komentar pada resep.</div>
                )
              ) : (
                commentedArticles.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {commentedArticles.map(comment => (
                      <div key={comment.comment_id} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                            {new Date(comment.comment_created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ fontStyle: 'italic', color: '#374151', fontSize: '0.95rem', background: '#F9FAFB', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                          "{comment.content}"
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.85rem', color: '#4B5563', fontWeight: 'bold' }}>Pada Artikel:</span>
                          <Link to={`/artikel/${comment.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', background: '#FFF3E0', color: '#E65100', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                            <img src={getImageUrl(comment.image)} alt={comment.title} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                            {comment.title}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>Belum ada komentar pada artikel.</div>
                )
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', color: '#6B7280' }}>
              <h2 style={{ fontSize: '1.5rem', color: '#111827', marginBottom: '8px' }}>{activeMenu}</h2>
              <p>Halaman ini belum tersedia. Menunggu pengembangan berikutnya !.</p>
            </div>
          )}
        </main>
      </div>

      {/* ===== EDIT PROFILE MODAL ===== */}
      {showEditProfileModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.55)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={() => setShowEditProfileModal(false)}>
          <div style={{
            background: 'var(--card-bg)', borderRadius: '20px',
            padding: '36px', width: '100%', maxWidth: '480px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            border: '1px solid var(--border-color)',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>

            {/* Close button */}
            <button onClick={() => setShowEditProfileModal(false)} style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-light)', padding: '4px'
            }}>
              <X size={22} />
            </button>

            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', color: 'var(--text-dark)' }}>Edit Profil</h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '0.9rem', color: 'var(--text-light)' }}>Perbarui informasi profil akun Anda.</p>

            {editProfileError && (
              <div style={{ padding: '10px 14px', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                {editProfileError}
              </div>
            )}
            {editProfileSuccess && (
              <div style={{ padding: '10px 14px', background: '#D1FAE5', color: '#065F46', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                {editProfileSuccess}
              </div>
            )}

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-dark)' }}>Nama Lengkap *</label>
                <input
                  type="text"
                  value={editProfileName}
                  onChange={e => setEditProfileName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  required
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    border: '1px solid var(--border-color)', outline: 'none',
                    fontSize: '0.95rem', background: 'var(--bg-light)',
                    color: 'var(--text-dark)', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-dark)' }}>Bio</label>
                <textarea
                  value={editProfileBio}
                  onChange={e => setEditProfileBio(e.target.value)}
                  placeholder="Ceritakan sedikit tentang diri Anda..."
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    border: '1px solid var(--border-color)', outline: 'none',
                    fontSize: '0.95rem', background: 'var(--bg-light)',
                    color: 'var(--text-dark)', resize: 'vertical', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                  <MapPin size={14} style={{display:'inline', marginRight:'4px'}} />Lokasi
                </label>
                <input
                  type="text"
                  value={editProfileLocation}
                  onChange={e => setEditProfileLocation(e.target.value)}
                  placeholder="Kota, Provinsi"
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    border: '1px solid var(--border-color)', outline: 'none',
                    fontSize: '0.95rem', background: 'var(--bg-light)',
                    color: 'var(--text-dark)', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                  <Instagram size={14} style={{display:'inline', marginRight:'4px'}} />Instagram
                </label>
                <input
                  type="text"
                  value={editProfileInstagram}
                  onChange={e => setEditProfileInstagram(e.target.value)}
                  placeholder="username (tanpa @)"
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    border: '1px solid var(--border-color)', outline: 'none',
                    fontSize: '0.95rem', background: 'var(--bg-light)',
                    color: 'var(--text-dark)', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '100px',
                    border: '1px solid var(--border-color)', background: 'transparent',
                    color: 'var(--text-dark)', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editProfileLoading}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '100px',
                    border: 'none', background: 'var(--primary)',
                    color: 'white', fontWeight: '600', cursor: editProfileLoading ? 'not-allowed' : 'pointer',
                    fontSize: '0.95rem', opacity: editProfileLoading ? 0.8 : 1
                  }}
                >
                  {editProfileLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
