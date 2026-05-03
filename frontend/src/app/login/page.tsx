"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = '/account';
    }
  };

  return (
    <div className="pt-36 pb-24 px-8 min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-[#111] p-10 border border-[#333]"
      >
        <h1 className="text-3xl font-serif text-gold mb-8 text-center">Client Login</h1>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full p-4 bg-[#1a1a1a] border border-[#333] text-white outline-none focus:border-gold transition-colors" 
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full p-4 bg-[#1a1a1a] border border-[#333] text-white outline-none focus:border-gold transition-colors" 
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn py-4 mt-4 w-full">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          
          {error && <p className="text-red-500 text-center mt-2 text-sm">{error}</p>}
        </form>

        <div className="mt-8 text-center text-gray-400 text-sm">
          Don't have an account? <Link href="/signup" className="text-gold hover:underline">Create Account</Link>
        </div>
      </motion.div>
    </div>
  );
}
