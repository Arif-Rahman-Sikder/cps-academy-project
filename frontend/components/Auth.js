import { useState } from 'react';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? 'http://localhost:1337/api/auth/local'
      : 'http://localhost:1337/api/auth/local/register';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          username: username || email.split('@')[0],
          ...(isLogin && { identifier: email }),
        }),
      });
      const data = await response.json();
      if (data.jwt) {
        localStorage.setItem('token', data.jwt);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
        setMessage('Success! Redirecting...');
      } else {
        setMessage(data.error.message || 'Authentication failed');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-300 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg sm:p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 sm:text-3xl">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-900">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 sm:p-2.5"
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-900">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 sm:p-2.5"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 sm:p-2.5"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-700 text-white rounded-md hover:bg-blue-800 sm:py-2.5 sm:px-6"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full py-2 px-4 bg-gray-300 text-gray-900 rounded-md hover:bg-gray-400 sm:py-2.5 sm:px-6"
          >
            {isLogin ? 'Need to Register?' : 'Already have an account? Login'}
          </button>
          {message && <p className="text-center text-red-600 sm:text-base">{message}</p>}
        </form>
      </div>
    </div>
  );
}