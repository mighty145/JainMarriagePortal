import React, { useState } from 'react'
import { Eye, EyeOff, Heart, Users, Star, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import './LoginPage.css'

const LoginPage = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    // Login fields
    email: '',
    password: '',
    
    // Registration fields
    firstName: '',
    lastName: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    city: '',
    profession: '',
    agreeTerms: false
  })

  // Form validation errors
  const [errors, setErrors] = useState({})

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const toggleForm = () => {
    setIsLogin(!isLogin)
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      city: '',
      profession: '',
      agreeTerms: false
    })
    setErrors({})
    setMessage({ type: '', text: '' })
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 6
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone.replace(/\D/g, ''))
  }

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    // Registration-specific validations
    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required'
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }

      if (!formData.phone) {
        newErrors.phone = 'Phone number is required'
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number'
      }

      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required'
      }

      if (!formData.gender) {
        newErrors.gender = 'Please select your gender'
      }

      if (!formData.city.trim()) {
        newErrors.city = 'City is required'
      }

      if (!formData.profession.trim()) {
        newErrors.profession = 'Profession is required'
      }

      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the terms and conditions'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors below' })
      return
    }

    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      if (isLogin) {
        // Handle login
        await handleLogin()
      } else {
        // Handle registration
        await handleRegistration()
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if user exists in our registered users
    const existingUsers = JSON.parse(localStorage.getItem('jainVivahUsers') || '[]')
    const user = existingUsers.find(u => u.email === formData.email)
    
    if (user) {
      // For demo purposes, accept any password for existing users
      // In a real app, you'd verify the hashed password
      setMessage({ type: 'success', text: 'Login successful! Welcome back.' })
      
      // Store current user session
      localStorage.setItem('currentUser', JSON.stringify(user))
      
      // Call onLogin callback if provided
      if (onLogin) {
        onLogin(user)
      }
      
      console.log('Login successful:', user)
    } else if (formData.email === 'demo@jainvivah.com' && formData.password === 'demo123') {
      // Demo account
      const demoUser = {
        id: 'demo',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@jainvivah.com',
        city: 'Mumbai',
        profession: 'Software Engineer'
      }
      setMessage({ type: 'success', text: 'Login successful! Welcome back.' })
      localStorage.setItem('currentUser', JSON.stringify(demoUser))
      
      if (onLogin) {
        onLogin(demoUser)
      }
    } else {
      throw new Error('Email not found. Please sign up first or check your credentials.')
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Simulate Google OAuth process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate Google user data
      const googleUser = {
        id: `google_${Date.now()}`,
        firstName: 'Google',
        lastName: 'User',
        email: 'googleuser@gmail.com',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        city: 'Delhi',
        profession: 'Professional',
        phone: '9999999999',
        registrationDate: new Date().toISOString(),
        isVerified: true,
        authProvider: 'google'
      }

      // Check if Google user already exists
      const existingUsers = JSON.parse(localStorage.getItem('jainVivahUsers') || '[]')
      let user = existingUsers.find(u => u.email === googleUser.email)
      
      if (!user) {
        // Add new Google user to our database
        existingUsers.push(googleUser)
        localStorage.setItem('jainVivahUsers', JSON.stringify(existingUsers))
        user = googleUser
        setMessage({ type: 'success', text: 'Google Sign-In successful! Account created.' })
      } else {
        setMessage({ type: 'success', text: 'Welcome back! Signed in with Google.' })
      }

      // Store current user session
      localStorage.setItem('currentUser', JSON.stringify(user))
      
      // Call onLogin callback
      if (onLogin) {
        onLogin(user)
      }

    } catch (error) {
      setMessage({ type: 'error', text: 'Google Sign-In failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegistration = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Create user object
    const newUser = {
      id: Date.now(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      city: formData.city,
      profession: formData.profession,
      registrationDate: new Date().toISOString(),
      isVerified: false
    }

    // Store in localStorage for demo purposes
    const existingUsers = JSON.parse(localStorage.getItem('jainVivahUsers') || '[]')
    
    // Check if user already exists
    const userExists = existingUsers.find(user => user.email === formData.email)
    if (userExists) {
      throw new Error('An account with this email already exists')
    }

    // Add new user
    existingUsers.push(newUser)
    localStorage.setItem('jainVivahUsers', JSON.stringify(existingUsers))

    setMessage({ 
      type: 'success', 
      text: 'Registration successful! Logging you in...' 
    })
    
    console.log('Registration successful:', newUser)
    
    // Store current user session and log them in immediately
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    
    // Call onLogin callback to redirect to homepage
    setTimeout(() => {
      if (onLogin) {
        onLogin(newUser)
      }
    }, 1000)
  }

  return (
    <div className="login-container">
      {/* Background decorative elements */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-wrapper">
        {/* Left side - Branding and features */}
        <div className="login-brand">
          <div className="brand-header">
            <div className="logo">
              <Heart className="logo-icon" />
              <h1>Jain Vivah</h1>
            </div>
            <p className="tagline">Dignified Matches for Jain Diagambar Community</p>
          </div>

          <div className="features">
            <div className="feature">
              <Users className="feature-icon" />
              <div>
                <h3>Verified Profiles</h3>
                <p>All profiles are thoroughly verified for authenticity</p>
              </div>
            </div>
            <div className="feature">
              <Shield className="feature-icon" />
              <div>
                <h3>Privacy Protected</h3>
                <p>Your personal information is completely secure</p>
              </div>
            </div>
            <div className="feature">
              <Star className="feature-icon" />
              <div>
                <h3>Success Stories</h3>
                <p>Join thousands of happy couples who found love here</p>
              </div>
            </div>
          </div>

          <div className="stats">
            <div className="stat">
              <span className="stat-number">50,000+</span>
              <span className="stat-label">Active Members</span>
            </div>
            <div className="stat">
              <span className="stat-number">15,000+</span>
              <span className="stat-label">Success Stories</span>
            </div>
          </div>
        </div>

        {/* Right side - Login/Register form */}
        <div className="login-form-container">
          <div className="form-wrapper">
            <div className="form-header">
              <h2>{isLogin ? 'Welcome Back' : 'Join Jain Vivah'}</h2>
              <p>{isLogin ? 'Sign in to continue your journey' : 'Create your profile to find your perfect match'}</p>
            </div>

            {/* Message display */}
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.type === 'success' && <CheckCircle size={16} />}
                {message.type === 'error' && <AlertCircle size={16} />}
                {message.type === 'info' && <AlertCircle size={16} />}
                <span>{message.text}</span>
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  {/* Name fields */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className={errors.firstName ? 'error' : ''}
                      />
                      {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                        className={errors.lastName ? 'error' : ''}
                      />
                      {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                    </div>
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={isLogin ? "Enter your email" : "Enter your email address"}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your 10-digit phone number"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={isLogin ? "Enter your password" : "Create a strong password (min 6 characters)"}
                    className={errors.password ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              {!isLogin && (
                <>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password *</label>
                    <div className="password-input">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className={errors.confirmPassword ? 'error' : ''}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                  </div>

                  {/* Personal Details */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="dateOfBirth">Date of Birth *</label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className={errors.dateOfBirth ? 'error' : ''}
                      />
                      {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="gender">Gender *</label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={errors.gender ? 'error' : ''}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {errors.gender && <span className="error-text">{errors.gender}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter your city"
                        className={errors.city ? 'error' : ''}
                      />
                      {errors.city && <span className="error-text">{errors.city}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="profession">Profession *</label>
                      <input
                        type="text"
                        id="profession"
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        placeholder="Enter your profession"
                        className={errors.profession ? 'error' : ''}
                      />
                      {errors.profession && <span className="error-text">{errors.profession}</span>}
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        className={errors.agreeTerms ? 'error' : ''}
                      />
                      <span className="checkbox-text">
                        I agree to the <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a> *
                      </span>
                    </label>
                    {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}
                  </div>
                </>
              )}

              {isLogin && (
                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-password">Forgot Password?</a>
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <div className="loading-spinner">
                    <span className="spinner"></span>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <button 
                type="button" 
                className="google-btn"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </button>
            </form>

            <div className="form-footer">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button type="button" className="link-btn" onClick={toggleForm}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
