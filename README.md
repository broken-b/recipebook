# RecipeBook - A Modern Recipe Sharing Platform

A full-stack web application for sharing and discovering recipes, built with React, Node.js, Express, and MongoDB.

## Features

### 🍳 Recipe Management

- Create, edit, and delete recipes
- Rich recipe details including ingredients, instructions, cooking time, servings, and difficulty
- Recipe categorization with cuisine types and tags
- Image support for recipes
- Like/unlike recipes

### 👥 User System

- User registration and authentication with JWT
- Secure password hashing with bcrypt
- User profiles with customizable information
- User-specific recipe collections

### 💬 Social Features

- Comment system on recipes
- Recipe ratings and reviews
- Search functionality across recipes
- Recipe sharing and discovery

### 🎨 Modern UI/UX

- Responsive design that works on all devices
- Beautiful gradient backgrounds and modern styling
- Intuitive navigation and user experience
- Loading states and error handling
- Toast notifications for user feedback

## Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Icons** - Beautiful icon library
- **React Hot Toast** - Toast notifications
- **CSS3** - Custom styling with modern design

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd recipebook
```

### 2. Install dependencies

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

### 3. Set up environment variables

Create a `.env` file in the `server` directory:

```env
MONGO_URI=mongodb://localhost:27017/recipebook
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

**Note:** Replace `your-super-secret-jwt-key-change-this-in-production` with a strong, unique secret key.

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
# Start MongoDB service from Services or run mongod.exe
```

### 5. Run the application

#### Development mode

Start the backend server:

```bash
cd server
npm run dev
```

In a new terminal, start the frontend:

```bash
cd client
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

#### Production mode

Build the frontend:

```bash
cd client
npm run build
```

Start the production server:

```bash
cd server
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Recipes

- `GET /api/recipes` - Get all recipes (with pagination and filters)
- `POST /api/recipes` - Create a new recipe
- `GET /api/recipes/:id` - Get recipe by ID
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `POST /api/recipes/:id/like` - Like/unlike a recipe

### Comments

- `GET /api/comments` - Get comments for a recipe
- `POST /api/comments` - Add a comment

### Search

- `GET /api/search` - Search recipes

## Database Schema

### User Schema

```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  avatar: String,
  bio: String,
  favorites: [Recipe ObjectIds],
  createdAt: Date,
  updatedAt: Date
}
```

### Recipe Schema

```javascript
{
  title: String (required),
  description: String (required),
  ingredients: [{
    name: String,
    amount: String,
    unit: String
  }],
  instructions: [String],
  cookingTime: Number,
  servings: Number,
  difficulty: String (Easy/Medium/Hard),
  cuisine: String,
  tags: [String],
  image: String,
  author: User ObjectId (required),
  likes: [User ObjectIds],
  rating: {
    average: Number,
    count: Number
  },
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Schema

```javascript
{
  text: String (required),
  recipe: Recipe ObjectId (required),
  author: User ObjectId (required),
  rating: Number (1-5),
  createdAt: Date,
  updatedAt: Date
}
```

## Project Structure

```
recipebook/
├── client/                 # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API service functions
│   │   └── styles.css      # Global styles
│   ├── package.json
│   └── README.md
├── server/                 # Backend Node.js application
│   ├── config/            # Configuration files
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── index.js           # Server entry point
│   └── package.json
└── README.md
```

## Features in Detail

### Recipe Creation

- Multi-step form with validation
- Dynamic ingredient and instruction fields
- Tag system for categorization
- Image URL support
- Cooking time and difficulty settings

### Search and Discovery

- Full-text search across recipe titles, descriptions, and tags
- Filter by cuisine and difficulty
- Pagination for large recipe collections
- Real-time search results

### User Experience

- Responsive design for mobile and desktop
- Loading states and error handling
- Toast notifications for user feedback
- Intuitive navigation with React Router
- Modern UI with gradients and animations

### Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints
- Input validation and sanitization
- CORS configuration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please:

1. Check the existing issues in the repository
2. Create a new issue with detailed information about your problem
3. Include steps to reproduce the issue
4. Provide your environment details (OS, Node.js version, etc.)

## Acknowledgments

- Icons provided by React Icons
- Toast notifications by React Hot Toast
- Design inspiration from modern web applications
- MongoDB for the excellent documentation and tools

---

**Happy Cooking! 🍳👨‍🍳**
