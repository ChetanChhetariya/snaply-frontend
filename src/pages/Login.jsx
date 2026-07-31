import { useState } from 'react';
import { login as loginApi } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../components/common/AuthForm.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginApi(email, password);
      login(data.token);
      navigate('/feed');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;