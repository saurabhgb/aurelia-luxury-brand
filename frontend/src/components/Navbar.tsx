"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cart, setIsCartOpen } = useCart();
  const { user, loading } = useAuth();
  
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 w-full px-6 md:px-12 flex justify-between items-center z-50 transition-all duration-400 ${scrolled || pathname !== '/' ? 'bg-bg/90 backdrop-blur-md py-4 border-b border-gold/20' : 'bg-transparent py-6'}`}>
        <div className="flex items-center gap-4">
          <button className="md:hidden text-gold" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={28} />
          </button>
          <div className="font-serif text-2xl font-bold tracking-widest text-gold">
            <Link href="/">AURELIA</Link>
          </div>
        </div>
      <ul className="hidden md:flex gap-8 list-none items-center">
        <li><Link href="/" className={`uppercase text-sm tracking-wide ${pathname === '/' ? 'text-gold' : 'text-text hover:text-gold transition-colors'}`}>Shop</Link></li>
        <li><Link href="/about" className={`uppercase text-sm tracking-wide ${pathname === '/about' ? 'text-gold' : 'text-text hover:text-gold transition-colors'}`}>Maison</Link></li>
        <li><Link href="/contact" className={`uppercase text-sm tracking-wide ${pathname === '/contact' ? 'text-gold' : 'text-text hover:text-gold transition-colors'}`}>Concierge</Link></li>
        {!loading && (
          <li>
            <Link href={user ? "/account" : "/login"} className={`uppercase text-sm tracking-wide ${pathname === '/login' || pathname === '/account' ? 'text-gold' : 'text-text hover:text-gold transition-colors'}`}>
              {user ? 'Account' : 'Login'}
            </Link>
          </li>
        )}
      </ul>
      <div className="flex gap-5">
        {pathname === '/checkout' ? (
           <Link href="/" className="uppercase text-sm">Return to Shop</Link>
        ) : (
          <span className="cursor-pointer relative" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-bg text-xs w-4 h-4 rounded-full flex justify-center items-center font-bold">
                {cartCount}
              </span>
            )}
          </span>
        )}
      </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-[#111] z-[100] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16 border-b border-[#333] pb-6">
              <div className="font-serif text-2xl font-bold tracking-widest text-gold">AURELIA</div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gold"><X size={32} /></button>
            </div>
            <ul className="flex flex-col gap-10 list-none text-2xl font-serif">
              <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`uppercase tracking-wide ${pathname === '/' ? 'text-gold' : 'text-white'}`}>Shop</Link></li>
              <li><Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className={`uppercase tracking-wide ${pathname === '/about' ? 'text-gold' : 'text-white'}`}>Maison</Link></li>
              <li><Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`uppercase tracking-wide ${pathname === '/contact' ? 'text-gold' : 'text-white'}`}>Concierge</Link></li>
              {!loading && (
                <li>
                  <Link href={user ? "/account" : "/login"} onClick={() => setIsMobileMenuOpen(false)} className={`uppercase tracking-wide ${pathname === '/login' || pathname === '/account' ? 'text-gold' : 'text-white'}`}>
                    {user ? 'Account' : 'Login'}
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
