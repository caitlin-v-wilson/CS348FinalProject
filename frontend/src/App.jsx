import { useState } from 'react'
import axios from 'axios'
import Profile from './Profile'
import Feed from './Feed'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('profile')
  const [currentUser, setCurrentUser] = useState(null)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [signupPassword, setSignupPassword] = useState('')

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login/', {
        username: loginUsername,
        password: loginPassword
      })
      console.log('Login response:', response.data)
      setCurrentUser(response.data.user_id)
      setIsLoggedIn(true)
      setLoginUsername('')
      setLoginPassword('')
      alert('Successful login')
    } catch (error) {
      console.error('Login error:', error)
      alert('Unsuccessful login')
    }
  }

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/users/', {
        username: signupUsername,
        password: signupPassword,
        about: ''
      })
      console.log('User created:', response.data)
      setCurrentUser(response.data.user_id)
      setIsLoggedIn(true)
      setSignupUsername('')
      setSignupPassword('')
      alert('Sign up successful!')
    } catch (error) {
      console.error('Sign up error:', error)
      const errorMessage = error.response?.data?.error || 'Sign up failed!'
      alert(errorMessage)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    setCurrentPage('profile')
  }

  const handleViewFeed = () => {
    setCurrentPage('feed')
  }

  const handleBackToProfile = () => {
    setCurrentPage('profile')
  }

  if (isLoggedIn) {
    if (currentPage === 'feed') {
      return <Feed onBackToProfile={handleBackToProfile} />
    }
    return <Profile userId={currentUser} onLogout={handleLogout} onViewFeed={handleViewFeed} />
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ border: '1px solid black', padding: '20px', width: '300px' }}>
          <div style={{ marginBottom: '30px' }}>
            <h3>Login</h3>
            <button onClick={handleLogin}>Login</button>
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>

          <div>
            <h3>Sign Up</h3>
            <button onClick={handleSignup}>Sign Up</button>
            <input
              type="text"
              placeholder="Username"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
