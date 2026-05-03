"use client";
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Account() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="h-screen flex items-center justify-center text-gold">Loading...</div>;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="pt-36 pb-24 px-8 min-h-screen max-w-5xl mx-auto">
      <div className="flex justify-between items-end border-b border-[#333] pb-6 mb-12">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-serif text-gold"
        >
          My Account
        </motion.h1>
        <button onClick={handleSignOut} className="text-gray-400 hover:text-white transition-colors">
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111] p-8 border border-[#222]"
        >
          <h3 className="text-xl text-gold mb-4 font-serif">Profile Details</h3>
          <p className="text-gray-400 mb-2">Email</p>
          <p className="text-white">{user.email}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#111] p-8 border border-[#222] md:col-span-2"
        >
          <h3 className="text-xl text-gold mb-4 font-serif">Order History</h3>
          <div className="text-gray-400 py-10 text-center border border-dashed border-[#333]">
            You have no past orders. Discover our collection to place your first order.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
