import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../store/useStore';

export const Login = () => {
  const navigate = useNavigate();
  const login = useStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          email: email.trim(),
          password,
        }
      );

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Invalid login response.');
      }

      localStorage.setItem('token', token);

      login(user, token);

      navigate('/account');
    } catch (err: any) {
      console.error('Login error:', err);

      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          'Unable to sign in. Please check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell px-4">
      <div className="w-full max-w-md mx-auto">

        {/* BRAND */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl text-bj-charcoal">
            Sign In
          </h1>

          <p className="text-gray-500 text-sm mt-4">
            View your orders, saved pieces and appointments.
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white p-8 md:p-10 shadow-xl shadow-bj-gold/5 border border-bj-gold/10">

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* EMAIL */}
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder=" "
                className="peer w-full border-b border-gray-300 bg-transparent py-3 outline-none focus:border-bj-gold transition-colors"
              />

              <label
                htmlFor="email"
                className="absolute left-0 top-3 text-gray-500 text-xs uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-bj-gold peer-[:not(:placeholder-shown)]:-top-4"
              >
                Email Address
              </label>
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder=" "
                className="peer w-full border-b border-gray-300 bg-transparent py-3 outline-none focus:border-bj-gold transition-colors"
              />

              <label
                htmlFor="password"
                className="absolute left-0 top-3 text-gray-500 text-xs uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-bj-gold peer-[:not(:placeholder-shown)]:-top-4"
              >
                Password
              </label>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bj-charcoal text-white py-4 uppercase tracking-[0.25em] text-[10px] font-bold hover:bg-bj-gold-deep transition-all duration-500 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

          </form>

          {/* REGISTER */}
          <div className="text-center mt-8 pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              New to Baikunthh?
            </p>

            <Link
              to="/register"
              className="inline-block mt-3 text-bj-gold uppercase tracking-widest text-[10px] font-bold hover:text-bj-charcoal transition-colors"
            >
              Create an Account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};