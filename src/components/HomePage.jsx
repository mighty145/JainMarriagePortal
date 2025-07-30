import React, { useState, useEffect } from 'react'
import { 
  Heart, 
  Users, 
  Search, 
  MessageCircle, 
  Star, 
  Settings, 
  LogOut,
  User,
  Bell,
  Filter,
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  Phone
} from 'lucide-react'
import './HomePage.css'

const HomePage = ({ user, onLogout }) => {
  const [allUsers, setAllUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [ageFilter, setAgeFilter] = useState({ min: 18, max: 50 })
  const [cityFilter, setCityFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Load all users except current user
    const storedUsers = JSON.parse(localStorage.getItem('jainVivahUsers') || '[]')
    const otherUsers = storedUsers.filter(u => u.email !== user.email)
    setAllUsers(otherUsers)
    setFilteredUsers(otherUsers)
  }, [user.email])

  const calculateAge = (dateOfBirth) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    filterUsers(query, ageFilter, cityFilter)
  }

  const handleAgeFilter = (min, max) => {
    const newAgeFilter = { min, max }
    setAgeFilter(newAgeFilter)
    filterUsers(searchQuery, newAgeFilter, cityFilter)
  }

  const handleCityFilter = (city) => {
    setCityFilter(city)
    filterUsers(searchQuery, ageFilter, city)
  }

  const filterUsers = (query, ageRange, city) => {
    let filtered = allUsers

    // Text search
    if (query) {
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(query.toLowerCase()) ||
        user.lastName.toLowerCase().includes(query.toLowerCase()) ||
        user.profession.toLowerCase().includes(query.toLowerCase()) ||
        user.city.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Age filter
    filtered = filtered.filter(user => {
      const age = calculateAge(user.dateOfBirth)
      return age >= ageRange.min && age <= ageRange.max
    })

    // City filter
    if (city) {
      filtered = filtered.filter(user => 
        user.city.toLowerCase().includes(city.toLowerCase())
      )
    }

    setFilteredUsers(filtered)
  }

  const sendInterest = (targetUser) => {
    // Simulate sending interest
    alert(`Interest sent to ${targetUser.firstName} ${targetUser.lastName}!`)
  }

  const getUniqueFilter = (field) => {
    return [...new Set(allUsers.map(user => user[field]))].sort()
  }

  return (
    <div className="homepage">
      {/* Header */}
      <header className="homepage-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <Heart className="logo-icon" />
              <h1>Jain Vivah</h1>
            </div>
          </div>
          
          <div className="header-center">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by name, profession, or city..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="header-right">
            <button className="header-btn">
              <Bell size={20} />
            </button>
            <button className="header-btn">
              <MessageCircle size={20} />
            </button>
            <div className="user-menu">
              <div className="user-avatar">
                {user.firstName?.charAt(0) || user.email.charAt(0)}
              </div>
              <span className="user-name">
                {user.firstName ? `${user.firstName} ${user.lastName}` : user.email}
              </span>
              <button className="logout-btn" onClick={onLogout}>
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="homepage-main">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="profile-card">
            <div className="profile-avatar">
              {user.firstName?.charAt(0) || user.email.charAt(0)}
            </div>
            <h3>{user.firstName ? `${user.firstName} ${user.lastName}` : 'Welcome'}</h3>
            <p>{user.email}</p>
            {user.city && <p className="profile-location"><MapPin size={14} /> {user.city}</p>}
            <button className="edit-profile-btn">
              <Settings size={16} />
              Edit Profile
            </button>
          </div>

          <div className="quick-stats">
            <h4>Quick Stats</h4>
            <div className="stat">
              <Users size={16} />
              <span>{allUsers.length} Members</span>
            </div>
            <div className="stat">
              <Search size={16} />
              <span>{filteredUsers.length} Matches</span>
            </div>
          </div>

          {/* Filters */}
          <div className="filters">
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filters
            </button>
            
            {showFilters && (
              <div className="filter-content">
                <div className="filter-group">
                  <label>Age Range</label>
                  <div className="age-inputs">
                    <input
                      type="number"
                      min="18"
                      max="80"
                      value={ageFilter.min}
                      onChange={(e) => handleAgeFilter(parseInt(e.target.value), ageFilter.max)}
                      placeholder="Min"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      min="18"
                      max="80"
                      value={ageFilter.max}
                      onChange={(e) => handleAgeFilter(ageFilter.min, parseInt(e.target.value))}
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div className="filter-group">
                  <label>City</label>
                  <select
                    value={cityFilter}
                    onChange={(e) => handleCityFilter(e.target.value)}
                  >
                    <option value="">All Cities</option>
                    {getUniqueFilter('city').map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <button 
                  className="clear-filters"
                  onClick={() => {
                    setSearchQuery('')
                    setAgeFilter({ min: 18, max: 50 })
                    setCityFilter('')
                    setFilteredUsers(allUsers)
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Content Area */}
        <section className="content-area">
          {filteredUsers.length === 0 ? (
            <div className="no-matches">
              <Users size={48} />
              <h3>No matches found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            <>
              <div className="results-header">
                <h2>Potential Matches ({filteredUsers.length})</h2>
                <p>Find your perfect life partner from our verified Jain community</p>
              </div>

              <div className="users-grid">
                {filteredUsers.map((matchUser) => (
                  <div key={matchUser.id} className="user-card">
                    <div className="card-header">
                      <div className="user-avatar large">
                        {matchUser.firstName.charAt(0)}{matchUser.lastName.charAt(0)}
                      </div>
                      <div className="user-basic-info">
                        <h3>{matchUser.firstName} {matchUser.lastName}</h3>
                        <p className="age-location">
                          {calculateAge(matchUser.dateOfBirth)} years, {matchUser.city}
                        </p>
                      </div>
                      <div className="gender-badge">
                        {matchUser.gender}
                      </div>
                    </div>

                    <div className="user-details">
                      <div className="detail-item">
                        <Briefcase size={14} />
                        <span>{matchUser.profession}</span>
                      </div>
                      <div className="detail-item">
                        <Mail size={14} />
                        <span>{matchUser.email}</span>
                      </div>
                      <div className="detail-item">
                        <Phone size={14} />
                        <span>{matchUser.phone}</span>
                      </div>
                    </div>

                    <div className="card-actions">
                      <button 
                        className="interest-btn"
                        onClick={() => sendInterest(matchUser)}
                      >
                        <Heart size={16} />
                        Send Interest
                      </button>
                      <button className="message-btn">
                        <MessageCircle size={16} />
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

export default HomePage
