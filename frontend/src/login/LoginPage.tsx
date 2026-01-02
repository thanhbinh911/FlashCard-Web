import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/LoginPage.css'; // <--- Đừng quên import CSS

interface AuthResponse {
  token: string;
  username: string;
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(async (response) => {
      if (response.ok) return response.json() as Promise<AuthResponse>;
      else {
        const errorText = await response.text();
        throw new Error('Login failed: ' + response.status + ' ' + errorText + '\nUsername or password may be incorrect.');
      }
    })
    .then(data => {
      console.log('Login successful:', data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      navigate('/flashcards');
    })
    .catch((error) => {
      console.error('Error during login:', error);
      alert(error.message);
    });
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              className="form-input"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              type="password" 
              id="password" 
              className="form-input"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn-primary">Login</button>
          
          <div className="auth-link">
            Don't have an account? <a href="/register">Register here</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;