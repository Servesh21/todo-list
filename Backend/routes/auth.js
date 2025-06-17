// routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import  pool  from '../db/index.js'; 

const jwtSecret = process.env.JWT_SECRET;

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const { rows } = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
    console.log('User created:', rows[0]);
    res.status(201).json({ message: 'User created', user: rows[0] });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
    console.log('Login attempt:', email, password);
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

    // Set token as HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      maxAge: 3600000, 
    });
    console.log('User logged in:', user);
    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Database error:', err);
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected Route Example (Require Authentication)
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

export default router;
