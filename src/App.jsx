import React, { useState, useEffect } from 'react'
import LoginPage from './components/LoginPage'
import HomePage from './components/HomePage'
import UsersList from './components/UsersList'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('login')
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing user session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setCurrentUser(user)
        setIsAuthenticated(true)
        setCurrentView('home')
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('currentUser')
      }
    }
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user)
    setIsAuthenticated(true)
    setCurrentView('home')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    setCurrentView('login')
    localStorage.removeItem('currentUser')
  }

  const renderCurrentView = () => {
    if (!isAuthenticated) {
      return <LoginPage onLogin={handleLogin} />
    }

    switch (currentView) {
      case 'home':
        return <HomePage user={currentUser} onLogout={handleLogout} />
      case 'users':
        return <UsersList />
      case 'login':
        return <LoginPage onLogin={handleLogin} />
      default:
        return <HomePage user={currentUser} onLogout={handleLogout} />
    }
  }

  return (
    <div className="App">
      {/* Navigation - only show if authenticated */}
      {isAuthenticated && (
        <nav className="app-nav">
          <div className="nav-brand">
            <h1>Jain Vivah</h1>
          </div>
          <div className="nav-links">
            <button 
              className={`nav-btn ${currentView === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentView('home')}
            >
              Home
            </button>
            <button 
              className={`nav-btn ${currentView === 'users' ? 'active' : ''}`}
              onClick={() => setCurrentView('users')}
            >
              All Members
            </button>
            <button 
              className="nav-btn logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={`app-content ${!isAuthenticated ? 'full-height' : ''}`}>
        {renderCurrentView()}
      </main>
    </div>
  )
}

export default App
