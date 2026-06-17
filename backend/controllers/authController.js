const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validasi Password: minimal 8 karakter, ada huruf dan angka
    if (!password || password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Kata sandi harus minimal 8 karakter dan merupakan kombinasi huruf dan angka.' 
      });
    }

    // Check if user exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const assignRole = role === 'admin' ? 'admin' : 'user';

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, assignRole]
    );

    const token = generateToken(result.insertId, assignRole);

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        name,
        email,
        role: assignRole,
        bio: '',
        location: '',
        instagram: '',
        token
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio || '',
        location: user.location || '',
        instagram: user.instagram || '',
        token
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, bio, location, instagram } = req.body;

    // Validate required field
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama tidak boleh kosong.' });
    }

    // Check columns exist — profile columns may not exist yet, add them gracefully
    // Update user record
    await db.query(
      'UPDATE users SET name = ?, bio = ?, location = ?, instagram = ? WHERE id = ?',
      [name.trim(), bio || '', location || '', instagram || '', userId]
    );

    // Fetch updated user data to return to client
    const [rows] = await db.query('SELECT id, name, email, role, bio, location, instagram FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    const updatedUser = rows[0];
    const token = generateToken(updatedUser.id, updatedUser.role);

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        location: updatedUser.location,
        instagram: updatedUser.instagram,
        token
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Server error saat memperbarui profil.' });
  }
};

