import './App.css'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { WelcomePage } from './pages/welcomePage'
import { HomePage } from './pages/homePage'

function App() {
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    //dont skip welcome screen during development
    if (process.env.NODE_ENV === 'development') return true

    const hasVisited = localStorage.getItem('hasVisited')
    return !hasVisited
  })

  const handleSkip = () => {
    localStorage.setItem('hasVisited', 'true') 
    setShowWelcome(false) 
  }

  return (
    <Router>
      <Routes>
        {showWelcome ? (
          <Route path="/" element={<WelcomePage onSkip={handleSkip} />} />
        ) : (
          <>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
          </>
        )}
      </Routes>
    </Router>
  )
}

export default App
