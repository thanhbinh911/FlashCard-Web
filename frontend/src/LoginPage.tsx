import React from 'react';
import { useNavigate } from 'react-router-dom';

// Define the type for the authentication response from the backend.
interface AuthResponse {
  token: string;
  username: string;
}

/**
 * The Login component provides a form for users to authenticate.
 * On successful login, it stores the authentication token and username in localStorage
 * and navigates the user to the flashcards page.
 */
function Login() {
<<<<<<< HEAD
  const navigate = useNavigate();
  // State for storing the user's email and password from the form inputs.
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
=======
  const navigate = useNavigate()
  //const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [email, setEmail] = React.useState('')
>>>>>>> main

  /**
   * Handles the form submission for the login process.
   * It sends a POST request to the backend's login endpoint.
   * @param e - The form event.
   */
  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
<<<<<<< HEAD
    e.preventDefault(); // Prevent the default form submission behavior.

    // Send a POST request to the login API endpoint.
=======
    e.preventDefault()
    //navigate('/flashcards')
    // Handle login logic here
>>>>>>> main
    fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'  
      },
      body: JSON.stringify({
<<<<<<< HEAD
        email,    // The backend's LoginRequest.java expects "email".
        password
      })
    })
    .then(async (response) => {
      if (response.ok) {
        // If the response is successful, parse the JSON body.
        return response.json() as Promise<AuthResponse>;
      } else {
        // If there's an error, read the error message from the backend.
        const errorText = await response.text();
        // Throw an error to be caught by the .catch() block.
        throw new Error('Login failed: ' + response.status + ' ' + errorText);
      }
=======
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
>>>>>>> main
    })
    .then(data => {
      // On successful login, store the token and username.
      console.log('Login successful:', data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username); // Store username for display purposes.
      navigate('/flashcards'); // Redirect to the flashcards page.
    })
    .catch((error) => {
      // Log and display any errors that occurred during the login process.
      console.error('Error during login:', error);
      alert(error.message); // Show an alert to the user with the error message.
    });
  }

  // Render the login form.
  return (
    <div className="login-container" style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Login Page</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
<<<<<<< HEAD
          {/* The backend uses email for login, so the label should be "Email". */}
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            style={{ width: '100%' }}
          />
=======
          <label htmlFor="email">Email:</label>
          <input type="text" id="email" name="email" value={email} onChange={(e) => 
            setEmail(e.target.value)} />
>>>>>>> main
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" style={{ marginTop: '10px', padding: '10px' }}>Login</button>
        
        {/* Link to the registration page for new users. */}
        <div className="register-link" style={{ marginTop: '15px', textAlign: 'center' }}>
          Don't have an account? <a href="/register">Register here</a>
        </div>
      </form>
    </div>
  );
}

export default Login;