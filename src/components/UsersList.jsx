import React, { useState, useEffect } from 'react'
import { Users, Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react'
import './UsersList.css'

const UsersList = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    // Load users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('jainVivahUsers') || '[]')
    setUsers(storedUsers)
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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

  if (users.length === 0) {
    return (
      <div className="users-list-container">
        <div className="no-users">
          <Users size={48} />
          <h3>No Registered Users</h3>
          <p>No users have registered yet. Be the first to join Jain Vivah!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="users-list-container">
      <div className="users-header">
        <h2><Users size={24} /> Registered Members ({users.length})</h2>
        <p>View all registered members of Jain Vivah community</p>
      </div>

      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-avatar">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            
            <div className="user-info">
              <h3>{user.firstName} {user.lastName}</h3>
              <div className="user-details">
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{user.phone}</span>
                </div>
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{user.city}</span>
                </div>
                <div className="detail-item">
                  <Briefcase size={16} />
                  <span>{user.profession}</span>
                </div>
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>{calculateAge(user.dateOfBirth)} years old</span>
                </div>
              </div>
              
              <div className="user-meta">
                <span className="gender-badge">{user.gender}</span>
                <span className="join-date">
                  Joined: {formatDate(user.registrationDate)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="users-footer">
        <button 
          onClick={() => {
            localStorage.removeItem('jainVivahUsers')
            setUsers([])
          }}
          className="clear-btn"
        >
          Clear All Data
        </button>
      </div>
    </div>
  )
}

export default UsersList
