import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // 환경에 따라 API 주소 자동 설정
  const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Fallback: if role is missing, try to fetch user info from backend
      let userWithRole = data.user;
      if (!userWithRole.role) {
        try {
          const userRes = await fetch(`${API_BASE}/api/users/me`, { credentials: 'include' });
          if (userRes.ok) {
            const userInfo = await userRes.json();
            userWithRole = { ...userWithRole, ...userInfo };
          }
        } catch (e) {
          // ignore, fallback to original user object
        }
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userWithRole));
      console.log('Token:', data.token);
      console.log('Login successful:', userWithRole);
      console.log('Role:', userWithRole.role, '| Full user:', userWithRole);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignup = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      alert('Signup successful! Please log in.');
      setShowSignup(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit">Log In</button>

        <button
          type="button"
          className="signup-link"
          onClick={() => setShowSignup(true)}
        >
          Sign Up
        </button>

      </form>

      {/* ✅ Sign-Up Modal */}
      {showSignup && (
        <div className="signup-modal">
          <div className="signup-box">
            <h3>Sign Up</h3>

            <input
              type="text"
              placeholder="Name"
              value={signupData.name}
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            />

            <div style={{ marginTop: '1rem' }}>
              <button className="signup-submit" onClick={handleSignup}>Create Account</button>
              <button className="signup-cancel" onClick={() => setShowSignup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;


