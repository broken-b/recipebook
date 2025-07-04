import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import models
import User from './models/User.js';
import Recipe from './models/Recipe.js';
import Comment from './models/Comment.js';

// Import middleware
import auth from './middleware/auth.js';

// Import routes
import routes from './routes/routes.js';

// Configure environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipebook', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', routes);

// Authentication routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = new User({ username, email, password });
    await user.save();
    
    // Generate JWT token
    const jwt = await import('jsonwebtoken');
    const token = jwt.default.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const jwt = await import('jsonwebtoken');
    const token = jwt.default.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Recipe routes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/recipes', auth, async (req, res) => {
  try {
    const { title, description, ingredients, instructions, category, difficulty, prepTime, cookTime, servings } = req.body;
    
    const recipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      category,
      difficulty,
      prepTime,
      cookTime,
      servings,
      author: req.user.userId
    });
    
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username')
      .populate({
        path: 'ratings.user',
        select: 'username'
      });
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Favorites routes
app.get('/api/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/favorites/:recipeId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const recipeId = req.params.recipeId;
    
    if (user.favorites.includes(recipeId)) {
      user.favorites = user.favorites.filter(id => id.toString() !== recipeId);
    } else {
      user.favorites.push(recipeId);
    }
    
    await user.save();
    res.json({ message: 'Favorites updated' });
  } catch (error) {
    console.error('Update favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Comments routes
app.get('/api/comments/:recipeId', async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.recipeId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/comments', auth, async (req, res) => {
  try {
    const { content, recipeId, rating } = req.body;
    
    const comment = new Comment({
      content,
      author: req.user.userId,
      recipe: recipeId,
      rating
    });
    
    await comment.save();
    
    // If rating provided, update recipe rating
    if (rating) {
      const recipe = await Recipe.findById(recipeId);
      const existingRatingIndex = recipe.ratings.findIndex(r => r.user.toString() === req.user.userId);
      
      if (existingRatingIndex >= 0) {
        recipe.ratings[existingRatingIndex] = {
          user: req.user.userId,
          rating,
          date: new Date()
        };
      } else {
        recipe.ratings.push({
          user: req.user.userId,
          rating,
          date: new Date()
        });
      }
      
      await recipe.save();
    }
    
    const populatedComment = await Comment.findById(comment._id).populate('author', 'username');
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search routes
app.get('/api/search', async (req, res) => {
  try {
    const { q, category, difficulty } = req.query;
    let query = {};
    
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    
    const recipes = await Recipe.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    
    res.json(recipes);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile routes
app.get('/api/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Image upload route
app.post('/api/upload', auth, async (req, res) => {
  try {
    // For now, we'll handle base64 images
    // In production, you'd want to use multer with cloud storage
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ message: 'No image provided' });
    }
    
    // Store image URL (in production, upload to cloud storage)
    const imageUrl = image; // This would be the cloud storage URL
    
    res.json({ imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 