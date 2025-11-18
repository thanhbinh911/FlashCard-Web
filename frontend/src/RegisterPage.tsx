import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from './model/userModel'

function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle registration logic here
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    })
    .then((response) => {
      console.log('receive response:', response)
      if (response.ok) {
        return response.json()
      }
      else {
        // Handle error
        alert('Registration failed')
      }
    })
    .then(data => {
      console.log('Registration successful:', data.token)
      localStorage.setItem('token', data.token)
      navigate('/')
    })
    .catch((error) => {
      console.error('Error during registration:', error)
    })
  }

  return (
    <div className="register-container">
      <h2>Register Page</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

const SAMPLE_USER = {
  id: '1',
  username: 'testuser',
  email: 'testuser@example.com',
  password: 'password123'
} as User

export default Register

