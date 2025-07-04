const express = require('express');
const cors = require('cors');
const app = express();
const User = require('./models/User');
const Recipe = require('./models/Recipe');

let users = [new User({ username: 'admin', password: 'password', email: 'admin@example.com', id: 1 })];
let recipes = [
  new Recipe({ id: 1, title: 'Pasta', description: 'Boil water, add pasta.', author: 'admin' }),
  new Recipe({ id: 2, title: 'Toast', description: 'Put bread in toaster.', author: 'user' })
];
let comments = [];
let favorites = {};

function auth(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  const user = users.find(u => u.token === token);
  if (!user) return res.status(401).send('Unauthorized');
  req.user = user;
  next();
}

app.use(cors());
app.use(express.json());

// Recipes
app.get('/api/recipes', (req, res) => {
  res.json(recipes);
});

app.post('/api/recipes', auth, (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) return res.status(400).send('Title and description required');
  const recipe = new Recipe({
    id: Date.now(),
    title,
    description,
    author: req.user.username
  });
  recipes.push(recipe);
  res.status(201).json(recipe);
});

// Favorites
app.get('/api/favorites', auth, (req, res) => {
  res.json(favorites[req.user.username] || []);
});

app.post('/api/favorites', auth, (req, res) => {
  const { recipeId } = req.body;
  if (!recipeId) return res.status(400).send('Recipe ID required');
  favorites[req.user.username] = favorites[req.user.username] || [];
  if (!favorites[req.user.username].includes(recipeId)) {
    favorites[req.user.username].push(recipeId);
  }
  res.json(favorites[req.user.username]);
});

// Comments
app.get('/api/comments', (req, res) => {
  const { recipeId } = req.query;
  if (!recipeId) return res.json([]);
  res.json(comments.filter(c => c.recipeId == recipeId));
});

app.post('/api/comments', auth, (req, res) => {
  const { recipeId, text } = req.body;
  if (!recipeId || !text) return res.status(400).send('Recipe ID and text required');
  const comment = { id: Date.now(), recipeId, text, author: req.user.username };
  comments.push(comment);
  res.status(201).json(comment);
});

// Search
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const result = recipes.filter(r => r.title.toLowerCase().includes(q.toLowerCase()));
  res.json(result);
});

// Profile
app.get('/api/profile', auth, (req, res) => {
  res.json({ username: req.user.username, email: req.user.email });
});

// Notifications
app.get('/api/notifications', (req, res) => {
  res.json(['Welcome to RecipeBook!', 'Error: Something went wrong.']);
});

// Image upload (dummy)
app.post('/api/upload', auth, (req, res) => {
  res.json({ message: 'Image upload endpoint (not implemented)' });
});

const routes = require('./routes/routes');
app.use('/api', (req, res, next) => {
  req.users = users;
  next();
}, routes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
}); 