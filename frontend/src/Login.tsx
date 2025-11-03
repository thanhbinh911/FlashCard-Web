import React from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    navigate('/flashcards')
  }

  return (
    <div className="login-container">
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
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
