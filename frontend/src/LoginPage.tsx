import React from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Handle login logic here
    fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        // Handle error
        alert('Login failed')
      }
    })
    .then(data => {
      console.log('Login successful:', data.token)
      localStorage.setItem('token', data.token)
      navigate('/flashcards')
    })
    .catch((error) => {
      console.error('Error during login:', error)
    })
  }

  return (
    <div className="login-container">
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" value={username} onChange={(e) => 
            setUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={password} onChange={(e) => 
            setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
        <div className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </div>
      </form>
    </div>
  )
}

export default Login
