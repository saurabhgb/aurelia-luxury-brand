"use client";
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        const found = data.products.find((p: Product) => p.id.toString() === params.id);
        setProduct(found || null);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div className="h-screen flex items-center justify-center text-gold">Loading...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center text-white">Product not found.</div>;

  return (
    <div className="pt-32 pb-24 px-8 md:px-12 max-w-7xl mx-auto min-h-screen">
      <Link href="/#shop" className="inline-flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-10">
        <ArrowLeft size={20} /> Back to Collection
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full h-[500px] md:h-[700px] bg-[#111] border border-[#222] p-8"
        >
          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{product.name}</h1>
          <p className="text-3xl text-gold mb-8">${product.price.toFixed(2)}</p>
          
          <div className="mb-10 text-gray-300 leading-relaxed text-lg">
            <p className="mb-4">Meticulously crafted to represent the pinnacle of modern luxury. This piece is a testament to AURELIA's commitment to uncompromising quality and timeless minimalist design.</p>
            <p>Designed for the digital-first connoisseur, it seamlessly bridges the gap between high-end aesthetics and everyday elegance.</p>
          </div>
          
          <div className="flex gap-4 mb-12">
             <button className="flex-1 btn py-4 text-lg" onClick={() => addToCart(product)}>Add to Bag</button>
          </div>
          
          <div className="border-t border-[#333] pt-8">
            <h3 className="text-xl text-gold mb-4">Product Details</h3>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Premium, ethically sourced materials</li>
              <li>Hand-finished detailing</li>
              <li>Complimentary luxury packaging</li>
              <li>Free worldwide shipping & returns</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
