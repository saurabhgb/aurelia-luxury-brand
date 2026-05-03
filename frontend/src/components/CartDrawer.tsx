"use client";
import { useCart } from '@/context/CartContext';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsCartOpen(false)}
      />
      <div className={`fixed top-0 right-0 w-full md:w-[400px] h-screen bg-[#111] z-[1001] p-8 flex flex-col border-l border-[#333] transition-transform duration-400 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-8 border-b border-[#333] pb-4">
          <h3 className="text-xl">Your Shopping Bag</h3>
          <button onClick={() => setIsCartOpen(false)} className="text-text hover:text-gold"><X /></button>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-gray-400">Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 mb-5">
                <img src={item.image} alt={item.name} className="w-[70px] h-[70px] object-cover" />
                <div>
                  <h4 className="text-sm mb-1">{item.name}</h4>
                  <p className="text-gold text-sm">${item.price.toFixed(2)} x {item.quantity}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="bg-transparent border-none text-[#888] text-xs underline cursor-pointer mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="border-t border-[#333] pt-5 mt-5">
          <div className="flex justify-between mb-5 text-xl font-serif">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
            <button className="btn w-full text-center">Proceed to Checkout</button>
          </Link>
        </div>
      </div>
    </>
  );
}
