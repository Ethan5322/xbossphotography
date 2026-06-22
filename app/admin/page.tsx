'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError('Incorrect password. Please try again.');
        return;
      }

      router.push('/admin/upcoming');
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-500 mb-4">
            <Camera className="w-8 h-8 text-gray-900" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">X-BOSS</h1>
          <p className="text-gray-500 text-sm mt-1">Photography Studio — Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-yellow-500" />
            <h2 className="text-white font-semibold text-sm">Secure Login</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder="Enter admin password"
                  required
                  autoFocus
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-12
                             text-white text-sm placeholder-gray-600
                             focus:outline-none focus:border-yellow-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-red-400 text-xs bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl bg-yellow-500 text-gray-900 font-bold text-sm
                         hover:bg-yellow-400 transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying…' : 'Login to Admin Panel'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-700 text-xs mt-6">
          X-BOSS Photography Studio © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
