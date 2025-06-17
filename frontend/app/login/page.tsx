'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginUser } from '../lib/api';
import { useAuthStore } from '../store/UseAuthStore';
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => {
    
    return state.login });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ prevent full page reload
    const response = await loginUser(email, password);
    console.log('Response from login:', response); // ✅ log the response
    if (response.message === 'Login successful') {
      login(); // update Zustand state
      console.log('redirecting to dashboard...');
      router.push('/dashboard'); // ✅ navigate after login
    } else {
      setError(response.message || 'Login failed');

  };
}
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <button onClick={() => router.back()} className="text-blue-600 mb-4">
          ← Back
        </button>

        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        {error && <p className="text-red-600">{error}</p>}

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm">
          Dont have an account?{' '}
          <span
            onClick={() => router.push('/register')}
            className="text-blue-600 cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}


