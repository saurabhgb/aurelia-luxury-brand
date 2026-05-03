"use client";
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data.products))
      .catch(err => console.error(err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <>
      <header className="h-screen flex items-center justify-center text-center bg-cover bg-center relative" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('/assets/obsidian_blazer.png')" }}>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="max-w-3xl px-4 z-10"
        >
          <h1 className="text-5xl md:text-7xl mb-6 text-white drop-shadow-lg">The Obsidian Collection</h1>
          <p className="text-lg md:text-xl mb-10 text-gray-200">Elegance refined. Discover our latest curated selection of timeless luxury pieces designed for the modern connoisseur.</p>
          <a href="#shop" className="btn hover:scale-105 transition-transform">Explore the Collection</a>
        </motion.div>
      </header>

      <section className="py-24 px-8 md:px-12 text-center" id="shop">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-4xl mb-16 text-gold"
        >
          Curated Selections
        </motion.h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto"
        >
          {products.map(product => (
            <motion.div variants={itemVariants} key={product.id} className="bg-[#111] border border-[#222] p-5 text-left transition-all duration-300 hover:border-gold group flex flex-col h-full">
              <Link href={`/shop/${product.id}`} className="w-full h-[350px] overflow-hidden mb-5 block relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </Link>
              <div className="mb-4 flex-grow">
                <Link href={`/shop/${product.id}`}>
                  <h3 className="text-lg mb-2 hover:text-gold transition-colors">{product.name}</h3>
                </Link>
                <p className="text-gold text-lg">${product.price.toFixed(2)}</p>
              </div>
              <button className="btn w-full mt-auto" onClick={() => addToCart(product)}>Add to Cart</button>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}
