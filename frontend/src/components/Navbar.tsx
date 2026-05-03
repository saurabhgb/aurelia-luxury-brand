"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, User } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
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
    <nav className={`fixed top-0 w-full px-12 flex justify-between items-center z-50 transition-all duration-400 ${scrolled || pathname !== '/' ? 'bg-bg/90 backdrop-blur-md py-4 border-b border-gold/20' : 'bg-transparent py-6'}`}>
      <div className="font-serif text-2xl font-bold tracking-widest text-gold">
        <Link href="/">AURELIA</Link>
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
  );
}
