"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    try {
      const res = await fetch(`${API_URL}/contact-submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      setStatus(result.message);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus('Error sending message. Please try again.');
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
          Private Concierge
        </motion.h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-3xl mx-auto py-20 px-8"
      >
        <p className="text-center mb-12 text-gray-400 text-lg">
          For personalized styling advice, bespoke requests, or inquiries regarding your order, our dedicated concierge team is at your service.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl mx-auto">
          <div>
            <input type="text" name="name" placeholder="Full Name" required className="w-full p-4 bg-[#111] border border-[#333] text-white outline-none focus:border-gold transition-colors" />
          </div>
          <div>
            <input type="email" name="email" placeholder="Email Address" required className="w-full p-4 bg-[#111] border border-[#333] text-white outline-none focus:border-gold transition-colors" />
          </div>
          <div>
            <textarea name="message" rows={6} placeholder="Your Message" required className="w-full p-4 bg-[#111] border border-[#333] text-white outline-none focus:border-gold transition-colors"></textarea>
          </div>
          <button type="submit" disabled={loading} className="btn py-4 text-lg">
            {loading ? 'Sending...' : 'Send Message'}
          </button>
          
          {status && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-4 text-gold">{status}</motion.div>}
        </form>
      </motion.div>
    </>
  );
}
