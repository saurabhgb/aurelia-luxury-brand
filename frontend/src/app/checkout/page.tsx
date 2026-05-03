"use client";
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

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
      const res = await fetch(`${API_URL}/process-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, total })
      });
      const data = await res.json();
      setStatus(data.message);
      clearCart();
    } catch (err) {
      setStatus('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="pt-36 pb-12 px-12 text-center bg-[#111] border-b border-[#222] fade-in">
        <h1 className="text-4xl md:text-5xl text-gold">Secure Checkout</h1>
      </div>

      <div className="max-w-6xl mx-auto py-20 px-8 fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 bg-[#111] p-8 border border-[#333]">
            <h3 className="text-2xl font-serif text-gold mb-6 border-b border-[#333] pb-4">Order Items</h3>
            {cart.length === 0 ? (
              <p className="text-gray-400">Your cart is empty. Please return to the shop.</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex justify-between items-center py-4 border-b border-[#222]">
                  <div className="flex gap-5 items-center">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
                    <div>
                      <h4 className="text-lg">{item.name}</h4>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-lg text-gold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-[#111] p-8 border border-[#333] h-fit">
            <h3 className="text-2xl font-serif text-gold mb-6 border-b border-[#333] pb-4">Order Summary</h3>
            <div className="flex justify-between mb-4">
              <span className="text-gray-300">Subtotal</span>
              <span>Calculated below</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-300">Shipping</span>
              <span>Complimentary</span>
            </div>
            <div className="flex justify-between mt-6 pt-6 border-t border-[#333] text-xl font-serif text-gold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handlePayment} 
              disabled={loading || cart.length === 0} 
              className="btn w-full mt-8"
            >
              {loading ? 'Processing...' : 'Complete Purchase'}
            </button>
            
            {status && <div className="mt-6 text-center text-gold font-medium">{status}</div>}
          </div>
          
        </div>
      </div>
    </>
  );
}
