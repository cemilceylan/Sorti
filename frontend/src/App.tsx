// src/App.tsx
import './App.css';
import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoutes } from './routes';

function App() {
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    // Don't skip welcome screen during development
    if (process.env.NODE_ENV === 'development') return true;
    const hasVisited = localStorage.getItem('hasVisited');
    return !hasVisited;
  });

  const handleSkip = () => {
    localStorage.setItem('hasVisited', 'true');
    setShowWelcome(false);
  };

  const router = createBrowserRouter(createRoutes({showWelcome, handleSkip}));

  return <RouterProvider router={router} />;
}

export default App;
