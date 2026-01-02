import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/RegisterPage.css'; 

interface AuthResponse {
  token: string;
  username: string;
}

function Register() {
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, username, email, password })
    })
    .then(async (response) => {
      if (response.ok) return response.json() as Promise<AuthResponse>;
      else {
        const errorText = await response.text(); 
        throw new Error(`Registration failed (${response.status}): ${errorText}`);
      }
    })
    .then(data => {
      localStorage.setItem('token', data.token);
      alert("Registration successful!");
      navigate('/'); 
    })
    .catch((error) => {
      alert(error.message); 
    });
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="login-title">Create Account</h2>
        
        <form onSubmit={handleRegister} className="auth-form">
          
          {/* Sử dụng class form-row thay vì style inline để ăn khớp với CSS responsive */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input 
                type="text" id="firstName" required 
                className="form-input"
                placeholder="First Name"
                value={firstName} onChange={(e) => setFirstName(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input 
                type="text" id="lastName" required
                className="form-input"
                placeholder="Last Name"
                value={lastName} onChange={(e) => setLastName(e.target.value)} 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input 
              type="text" id="username" required 
              className="form-input" 
              placeholder="Enter your username"
              value={username} onChange={(e) => setUsername(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input 
              type="email" id="email" required 
              className="form-input" 
              placeholder="name@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              type="password" id="password" required 
              className="form-input" 
              placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
            <input 
              type="password" id="confirm-password" required 
              className="form-input" 
              placeholder="••••••••"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </div>

          <button type="submit" className="btn-primary">Sign Up</button>
          
          <div className="auth-link">
            Already have an account? <a href="/">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;