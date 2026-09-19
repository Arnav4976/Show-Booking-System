import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If the user is already authenticated, redirect them away from the login page
    if (isAuthenticated()) {
       if (hasRole('ROLE_ADMIN')) {
         navigate('/admin', { replace: true });
       } else {
         navigate('/', { replace: true });
       }
    }
  }, [isAuthenticated, hasRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await login({ username, password });
      
      // Check if they were redirected here from a protected route
      const origin = location.state?.from?.pathname;

      if (response.roles.includes('ROLE_ADMIN')) {
         // If they were trying to access a specific admin route (e.g. /admin/movies), send them back there
         if (origin && origin.startsWith('/admin')) {
           navigate(origin, { replace: true });
         } else {
           navigate('/admin', { replace: true });
         }
      } else {
         // Standard user
         navigate('/', { replace: true });
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '2px solid var(--ink)', background: 'var(--paper)' }}>
      <h2 className="serif" style={{ textAlign: 'center', margin: '0 0 2rem 0' }}>MEMBER LOGIN</h2>
      
      <div style={{background: 'var(--ink)', height: '2px', margin: '0 -2rem 2rem -2rem'}}></div>

      {error && (
        <div className="mono" style={{ padding: '1rem', border: '2px solid red', color: 'red', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mono" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          Username or Email
          <input 
            type="text" 
            required 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="guest or admin"
            style={{ padding: '0.75rem', border: '2px solid var(--ink)', background: 'transparent' }} 
          />
        </label>
        
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          Password
          <input 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
            style={{ padding: '0.75rem', border: '2px solid var(--ink)', background: 'transparent' }} 
          />
        </label>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isSubmitting}
          style={{ padding: '1rem', marginTop: '1rem' }}
        >
          {isSubmitting ? 'AUTHENTICATING...' : 'LOGIN'}
        </button>
      </form>

      <div style={{marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', opacity: 0.6}} className="mono">
        <p>Testing Credentials:</p>
        <p>User: guest_user | Admin: admin</p>
        <p>Password: anything</p>
      </div>
    </div>
  );
};

export default Login;
