"use client";
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const { addToCart } = useCart();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data.products))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <header className="h-screen flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('/assets/obsidian_blazer.png')" }}>
        <div className="fade-in max-w-3xl px-4">
          <h1 className="text-5xl md:text-6xl mb-6">The Obsidian Collection</h1>
          <p className="text-lg md:text-xl mb-8">Elegance refined. Discover our latest curated selection of timeless luxury pieces designed for the modern connoisseur.</p>
          <a href="#shop" className="btn">Explore the Collection</a>
        </div>
      </header>

      <section className="py-24 px-12 text-center" id="shop">
        <h2 className="text-4xl mb-12 text-gold">Curated Selections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {products.map(product => (
            <div key={product.id} className="bg-[#111] border border-[#222] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold group fade-in">
              <div className="w-full h-[350px] overflow-hidden mb-5">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="mb-4">
                <h3 className="text-lg mb-2">{product.name}</h3>
                <p className="text-gold text-lg">${product.price.toFixed(2)}</p>
              </div>
              <button className="btn btn-outline w-full" onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
