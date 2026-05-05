"use client";
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handlePayment = async () => {
    setLoading(true);
    setStatus('');
    
    try {
      const res = await fetch(`${API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, total })
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        setStatus(data.detail || 'Payment failed to initialize.');
      }
    } catch (err) {
      setStatus('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="pt-36 pb-12 px-12 text-center bg-[#111] border-b border-[#222]">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl text-gold"
        >
          Secure Checkout
        </motion.h1>
      </div>

      <div className="max-w-6xl mx-auto py-20 px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 bg-[#111] p-8 border border-[#333]"
          >
            <h3 className="text-2xl font-serif text-gold mb-6 border-b border-[#333] pb-4">Order Items</h3>
            {cart.length === 0 ? (
              <p className="text-gray-400">Your cart is empty. Please return to the shop.</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex justify-between items-center py-6 border-b border-[#222]">
                  <div className="flex gap-6 items-center">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover border border-[#222]" />
                    <div>
                      <h4 className="text-xl mb-1">{item.name}</h4>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-xl text-gold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-[#111] p-8 border border-[#333] h-fit"
          >
            <h3 className="text-2xl font-serif text-gold mb-6 border-b border-[#333] pb-4">Order Summary</h3>
            <div className="flex justify-between mb-4 text-lg">
              <span className="text-gray-300">Subtotal</span>
              <span>Calculated below</span>
            </div>
            <div className="flex justify-between mb-4 text-lg">
              <span className="text-gray-300">Shipping</span>
              <span>Complimentary</span>
            </div>
            <div className="flex justify-between mt-8 pt-6 border-t border-[#333] text-2xl font-serif text-gold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handlePayment} 
              disabled={loading || cart.length === 0} 
              className="btn w-full mt-10 py-4 text-lg"
            >
              {loading ? 'Processing...' : 'Complete Purchase'}
            </button>
            
            {status && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center text-gold font-medium text-lg">{status}</motion.div>}
          </motion.div>
          
        </div>
      </div>
    </>
  );
}
