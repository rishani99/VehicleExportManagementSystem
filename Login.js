import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div>
      {/* Embedded CSS */}
      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .login-box {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          max-width: 400px;
          width: 100%;
          text-align: center;
        }
        .login-title {
          font-size: 2rem;
          margin-bottom: 20px;
          color: #333;
        }
        .login-form input {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 15px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.3s;
        }
        .login-form input:focus {
          border-color: #667eea;
        }
        .btn-login {
          width: 100%;
          padding: 12px;
          background: #667eea;
          color: white;
          font-size: 1rem;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .btn-login:hover {
          background: #5a67d8;
        }
        .error {
          color: red;
          margin-top: 10px;
          font-size: 0.9rem;
        }
        .signup-link {
          margin-top: 15px;
          font-size: 0.9rem;
          color: #555;
        }
        .signup-link span {
          color: #667eea;
          font-weight: bold;
          cursor: pointer;
        }
        .signup-link span:hover {
          text-decoration: underline;
        }
      `}</style>

      {/* Login Form */}
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Login</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn-login">Login</button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
}
