"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="pt-36 pb-24 px-8 min-h-screen flex flex-col items-center justify-center text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-serif text-gold mb-6">Checkout Canceled</h1>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Your payment was canceled and no charges were made. Your items are still saved in your shopping bag for when you are ready.
        </p>
        <Link href="/checkout" className="btn py-4 px-10 text-lg">
          Return to Checkout
        </Link>
      </motion.div>
    </div>
  );
}
