const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth'); // Remove unused import
const User = require('../models/User');

// Use req.users for in-memory user storage

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const users = req.users;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    // Generate a simple token (not secure, for demo only)
    user.token = 'token-' + user.username + '-' + Date.now();
    return res.json({ token: user.token });
  }
  res.status(401).send('Login failed');
});
router.post('/register', (req, res) => {
  const { username, password, email } = req.body || {};
  const users = req.users;
  if (!username || !password || !email) return res.status(400).send('All fields required');
  if (users.find(u => u.username === username)) return res.status(409).send('Username already exists');
  // const User = require('../models/User'); // Remove duplicate require
  const user = new User({ username, password, email, id: Date.now() });
  users.push(user);
  res.status(201).json({ username: user.username, email: user.email });
});
module.exports = router; 