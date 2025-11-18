import React from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  //const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [email, setEmail] = React.useState('')

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    //navigate('/flashcards')
    // Handle login logic here
    fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'  
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    .then((response) => {
      console.log('receive response:', response)
      if (!response.ok) {
        alert('Login failed')
      } 
      return response.json()
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
          <label htmlFor="email">Email:</label>
          <input type="text" id="email" name="email" value={email} onChange={(e) => 
            setEmail(e.target.value)} />
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
