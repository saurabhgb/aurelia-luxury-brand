"use client";
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the user's cart once they successfully complete a payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="pt-36 pb-24 px-8 min-h-screen flex flex-col items-center justify-center text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-serif text-gold mb-6">Order Confirmed</h1>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Thank you for your purchase. Your exquisite AURELIA pieces are now being prepared for shipping by our concierge team.
          You will receive a confirmation email shortly.
        </p>
        <Link href="/" className="btn py-4 px-10 text-lg">
          Return to Collection
        </Link>
      </motion.div>
    </div>
  );
}
