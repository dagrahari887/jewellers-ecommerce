import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../store/useStore';

export const Register = () => {
  const navigate = useNavigate();
  const login = useStore((state) => state.login);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
        'http://localhost:5000/api/auth/register',
        {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
        }
      );

      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem('token', token);
        login(user, token);
        navigate('/account');
        return;
      }

      navigate('/login');
    } catch (err: any) {
      console.error('Registration error:', err);

      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          'Unable to create your account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bj-ivory pt-32 pb-20 px-6 flex items-center justify-center">
      <div className="w-full max-w-md">

        {/* BRAND */}
        <div className="text-center mb-12">
          <p className="text-bj-gold text-[10px] uppercase tracking-[0.35em] mb-4">
            Baikunthh Jewellers
          </p>

          <h1 className="font-serif text-5xl text-bj-charcoal">
            Begin Your Journey
          </h1>

          <p className="text-gray-500 text-sm mt-4">
            Create your private Baikunthh account.
          </p>
        </div>

        {/* REGISTER CARD */}
        <div className="bg-white p-8 md:p-10 shadow-xl shadow-bj-gold/5 border border-bj-gold/10">

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* NAME */}
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder=" "
                className="peer w-full border-b border-gray-300 bg-transparent py-3 outline-none focus:border-bj-gold transition-colors"
              />

              <label
                htmlFor="name"
                className="absolute left-0 top-3 text-gray-400 text-xs uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-bj-gold peer-[:not(:placeholder-shown)]:-top-4"
              >
                Full Name
              </label>
            </div>

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
                className="absolute left-0 top-3 text-gray-400 text-xs uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-bj-gold peer-[:not(:placeholder-shown)]:-top-4"
              >
                Email Address
              </label>
            </div>

            {/* PHONE */}
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
                inputMode="tel"
                placeholder=" "
                className="peer w-full border-b border-gray-300 bg-transparent py-3 outline-none focus:border-bj-gold transition-colors"
              />

              <label
                htmlFor="phone"
                className="absolute left-0 top-3 text-gray-400 text-xs uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-bj-gold peer-[:not(:placeholder-shown)]:-top-4"
              >
                Phone Number
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
                minLength={6}
                autoComplete="new-password"
                placeholder=" "
                className="peer w-full border-b border-gray-300 bg-transparent py-3 outline-none focus:border-bj-gold transition-colors"
              />

              <label
                htmlFor="password"
                className="absolute left-0 top-3 text-gray-400 text-xs uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-bj-gold peer-[:not(:placeholder-shown)]:-top-4"
              >
                Password
              </label>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bj-charcoal text-white py-4 uppercase tracking-[0.25em] text-[10px] font-bold hover:bg-bj-gold transition-all duration-500 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

          </form>

          {/* LOGIN */}
          <div className="text-center mt-8 pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Already a Baikunthh client?
            </p>

            <Link
              to="/login"
              className="inline-block mt-3 text-bj-gold uppercase tracking-widest text-[10px] font-bold hover:text-bj-charcoal transition-colors"
            >
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};