const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const destDir = path.join(__dirname, 'frontend', 'src');
const appDir = path.join(destDir, 'app');

function ensureDirSync(dirpath) {
  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath, { recursive: true });
  }
}

function processComponentCode(content) {
  // Add use client
  let newContent = "'use client';\n\n" + content;

  // Replace react-router-dom with next
  newContent = newContent.replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-router-dom['"];/g, (match, imports) => {
    let newImports = [];
    let hasLink = false;
    let hasRouter = false;

    if (imports.includes('Link')) hasLink = true;
    if (imports.includes('useNavigate')) {
      imports = imports.replace('useNavigate', 'useRouter');
      hasRouter = true;
    }
    
    let res = [];
    if (hasLink) res.push("import Link from 'next/link';");
    if (hasRouter) res.push("import { useRouter } from 'next/navigation';");
    return res.join('\n');
  });

  newContent = newContent.replace(/useNavigate\(\)/g, 'useRouter()');
  newContent = newContent.replace(/href="#([a-zA-Z0-9_-]+)"/g, 'href="/#$1"');

  return newContent;
}

// 1. Copy CSS
fs.copyFileSync(path.join(srcDir, 'index.css'), path.join(appDir, 'globals.css'));
console.log('Migrated CSS');

// 2. Components
ensureDirSync(path.join(destDir, 'components'));
const components = fs.readdirSync(path.join(srcDir, 'components'));
components.forEach(file => {
  const code = fs.readFileSync(path.join(srcDir, 'components', file), 'utf8');
  fs.writeFileSync(path.join(destDir, 'components', file), processComponentCode(code));
});
console.log('Migrated Components');

// 3. Context
ensureDirSync(path.join(destDir, 'context'));
const contexts = fs.readdirSync(path.join(srcDir, 'context'));
contexts.forEach(file => {
  const code = fs.readFileSync(path.join(srcDir, 'context', file), 'utf8');
  fs.writeFileSync(path.join(destDir, 'context', file), processComponentCode(code));
});
console.log('Migrated Context');

// 4. Data
ensureDirSync(path.join(destDir, 'data'));
const dataFiles = fs.readdirSync(path.join(srcDir, 'data'));
dataFiles.forEach(file => {
  fs.copyFileSync(path.join(srcDir, 'data', file), path.join(destDir, 'data', file));
});
console.log('Migrated Data');

// 5. Pages
ensureDirSync(path.join(appDir, 'login'));
ensureDirSync(path.join(appDir, 'dashboard', 'user'));
ensureDirSync(path.join(appDir, 'dashboard', 'admin'));
ensureDirSync(path.join(appDir, 'resep', '[id]'));
ensureDirSync(path.join(appDir, 'artikel', '[id]'));

// Home -> app/page.jsx (will use js)
function createPage(oldFile, routeDir) {
  if (fs.existsSync(oldFile)) {
    let code = fs.readFileSync(oldFile, 'utf8');
    code = processComponentCode(code);
    fs.writeFileSync(path.join(routeDir, 'page.js'), code);
    console.log(`Migrated ${path.basename(oldFile)} to ${routeDir}/page.js`);
  }
}

createPage(path.join(srcDir, 'pages', 'Login.jsx'), path.join(appDir, 'login'));
createPage(path.join(srcDir, 'pages', 'UserDashboard.jsx'), path.join(appDir, 'dashboard', 'user'));
createPage(path.join(srcDir, 'pages', 'AdminDashboard.jsx'), path.join(appDir, 'dashboard', 'admin'));
createPage(path.join(srcDir, 'pages', 'RecipeDetail.jsx'), path.join(appDir, 'resep', '[id]'));
createPage(path.join(srcDir, 'pages', 'ArticleDetail.jsx'), path.join(appDir, 'artikel', '[id]'));

// Layout creation
const layoutCode = `
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Rasa Nusantara',
  description: 'Membawa cita rasa autentik masakan Nusantara',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
`;
fs.writeFileSync(path.join(appDir, 'layout.js'), layoutCode);

// Home
const homeCode = `
'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import RecipeList from '../components/RecipeList';
import ArticleSection from '../components/ArticleSection';
import Footer from '../components/Footer';
import { recipes } from '../data/recipes';

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
`;
fs.writeFileSync(path.join(appDir, 'page.js'), homeCode);
console.log('Done Migration Script');
