import React from 'react';
import { useNavigate } from 'react-router-dom';

// Define the type for the authentication response from the backend.
interface AuthResponse {
  token: string;
  username: string;
}

/**
 * The Register component provides a form for new users to create an account.
 * On successful registration, it stores the authentication token, shows a success message,
 * and navigates the user to the login page.
 */
function Register() {
  const navigate = useNavigate();
  
  // State for all the required registration form fields.
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  /**
   * Handles the form submission for the registration process.
   * It validates the password confirmation and sends a POST request to the backend's register endpoint.
   * @param e - The form event.
   */
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior.

    // Check if the entered passwords match.
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Send the complete data required by the backend's RegisterRequest.
    fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName, // <-- Required by backend
        lastName,  // <-- Required by backend
        username,
        email,
        password
      })
    })
    .then(async (response) => {
      if (response.ok) {
        // If the response is successful, parse the JSON body.
        return response.json() as Promise<AuthResponse>;
      } else {
        // If there's an error, try to read the error message from the backend.
        const errorText = await response.text(); 
        throw new Error(`Registration failed (${response.status}): ${errorText}`);
      }
    })
    .then(data => {
      // On successful registration, store the token and notify the user.
      console.log('Registration successful:', data.token);
      localStorage.setItem('token', data.token);
      alert("Registration successful!");
      navigate('/'); // Redirect to the Login page.
    })
    .catch((error) => {
      // Log and display any errors that occurred during the registration process.
      console.error('Error during registration:', error);
      alert(error.message); 
    });
  }

  // Render the registration form.
  return (
    <div className="register-container" style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Register Page</h2>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* First Name input field */}
        <div>
          <label htmlFor="firstName">First Name</label>
          <input 
            type="text" id="firstName" required 
            value={firstName} onChange={(e) => setFirstName(e.target.value)} 
            style={{ width: '100%' }}
          />
        </div>

        {/* Last Name input field */}
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input 
            type="text" id="lastName" required
            value={lastName} onChange={(e) => setLastName(e.target.value)} 
            style={{ width: '100%' }}
          />
        </div>

        {/* Username input field */}
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" required value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%' }} />
        </div>

        {/* Email input field */}
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} />
        </div>

        {/* Password input field */}
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%' }} />
        </div>

        {/* Confirm Password input field */}
        <div>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input type="password" id="confirm-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '100%' }} />
        </div>

        <button type="submit" style={{ marginTop: '10px', padding: '10px' }}>Register</button>
      </form>
    </div>
  );
}

export default Register;