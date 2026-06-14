const db = require('../config/db');

exports.getAllArticles = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM articles WHERE status = 'approved' ORDER BY created_at DESC");
    const articles = rows.map(r => {
      let summary = r.summary;
      let content = r.content;
      if (!summary && content && content.startsWith('EXCERPT: ')) {
        const parts = content.split('\n\n');
        summary = parts[0].replace('EXCERPT: ', '');
        content = parts.slice(1).join('\n\n');
      }
      return { ...r, summary, content };
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

exports.getUserArticles = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM articles WHERE author_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { title, summary, content } = req.body;
    const author_id = req.user.id;
    const status = 'pending';
    let image = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';
    if (req.file) {
      image = '/uploads/' + req.file.filename;
    }
    const date = new Date().toISOString().split('T')[0];
    
    const [result] = await db.query(
      `INSERT INTO articles (author_id, title, summary, content, image, date, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [author_id, title, summary || '', content, image, date, status]
    );

    res.status(201).json({ success: true, message: 'Artikel berhasil dikirim dan menunggu persetujuan admin.', id: result.insertId });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ success: false, message: 'Server error saat membuat artikel' });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const [articleRows] = await db.query('SELECT * FROM articles WHERE id = ?', [id]);
    
    if (articleRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' });
    }
    
    const article = articleRows[0];
    if (req.user.role !== 'admin' && article.author_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki izin untuk mengedit artikel ini' });
    }

    const { title, summary, content, status } = req.body;
    
    let newStatus = status || article.status;
    if (req.user.role !== 'admin') {
      newStatus = 'pending';
    }

    let updateQuery = `UPDATE articles SET title = ?, summary = ?, content = ?, status = ?`;
    let queryParams = [title, summary || '', content, newStatus];

    if (req.file) {
      updateQuery += `, image = ?`;
      queryParams.push('/uploads/' + req.file.filename);
    }
    
    updateQuery += ` WHERE id = ?`;
    queryParams.push(id);

    await db.query(updateQuery, queryParams);
    
    res.json({ success: true, message: 'Artikel berhasil diupdate' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const [articleRows] = await db.query('SELECT * FROM articles WHERE id = ?', [id]);
    
    if (articleRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' });
    }
    
    await db.query('DELETE FROM articles WHERE id = ?', [id]);
    
    res.json({ success: true, message: 'Artikel berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
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
    let summary = article.summary;
    let content = article.content;
    if (!summary && content && content.startsWith('EXCERPT: ')) {
      const parts = content.split('\n\n');
      summary = parts[0].replace('EXCERPT: ', '');
      content = parts.slice(1).join('\n\n');
    }
    article = { ...article, summary, content };

    res.json({ success: true, data: article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
