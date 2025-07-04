import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

function BrokenApp() {
  return <div>RecipeBook (Broken)</div>;
}

const root = createRoot(document.getElementById('root'));
root.render(<App />); 
