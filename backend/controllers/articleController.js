const db = require('../config/db');

exports.getAllArticles = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM articles WHERE status = 'approved' ORDER BY created_at DESC");
    const articles = rows.map(r => {
      let excerpt = '';
      let content = r.content;
      if (content && content.startsWith('EXCERPT: ')) {
        const parts = content.split('\n\n');
        excerpt = parts[0].replace('EXCERPT: ', '');
        content = parts.slice(1).join('\n\n');
      }
      return { ...r, excerpt, content };
    });
    res.json({ success: true, data: articles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllArticlesAdmin = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM articles ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { title, excerpt, content } = req.body;
    const author_id = req.user.id;
    const status = 'pending';
    const image = req.body.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';
    const date = new Date().toISOString().split('T')[0];
    
    let finalContent = content;
    if (excerpt) {
      finalContent = `EXCERPT: ${excerpt}\n\n${content}`;
    }

    const [result] = await db.query(
      `INSERT INTO articles (author_id, title, content, image, date, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [author_id, title, finalContent, image, date, status]
    );

    res.status(201).json({ success: true, message: 'Artikel berhasil dikirim dan menunggu persetujuan admin.' });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ success: false, message: 'Server error saat membuat artikel' });
  }
};

exports.approveArticle = async (req, res) => {
  try {
    await db.query("UPDATE articles SET status = 'approved' WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: 'Artikel disetujui.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.getArticleById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM articles WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    let article = rows[0];
    let excerpt = '';
    let content = article.content;
    if (content && content.startsWith('EXCERPT: ')) {
      const parts = content.split('\n\n');
      excerpt = parts[0].replace('EXCERPT: ', '');
      content = parts.slice(1).join('\n\n');
    }
    article = { ...article, excerpt, content };

    res.json({ success: true, data: article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
