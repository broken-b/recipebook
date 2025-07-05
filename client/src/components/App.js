import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { recipesAPI } from '../services/api';
import Login from './Login';
import Dashboard from './Dashboard';
import RecipeDetail from './RecipeDetail';
import CreateRecipe from './CreateRecipe';
import EditRecipe from './EditRecipe';
import Profile from './Profile';
import LoadingSpinner from './LoadingSpinner';
import '../styles.css';

function AppContent() {
  const { user, loading, isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadRecipes();
    }
  }, [isAuthenticated]);

  const loadRecipes = async () => {
    setLoadingRecipes(true);
    try {
      const response = await recipesAPI.getAll();
      setRecipes(response.data.recipes || []);
    } catch (error) {
      console.error('Failed to load recipes:', error);
    } finally {
      setLoadingRecipes(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard 
                recipes={recipes} 
                loading={loadingRecipes} 
                onRecipesChange={loadRecipes}
              />
            } 
          />
          <Route 
            path="/recipe/:id" 
            element={<RecipeDetail />} 
          />
          <Route 
            path="/create" 
            element={<CreateRecipe onRecipeCreated={loadRecipes} />} 
          />
          <Route 
            path="/edit/:id" 
            element={<EditRecipe onRecipeUpdated={loadRecipes} />} 
          />
          <Route 
            path="/profile" 
            element={<Profile />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <AppContent />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App; 