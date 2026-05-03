"use client";
import { motion } from 'framer-motion';

export default function About() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <>
      <div className="pt-36 pb-12 px-12 text-center bg-[#111] border-b border-[#222]">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl text-gold"
        >
          La Maison Aurelia
        </motion.h1>
      </div>

      <div className="max-w-5xl mx-auto py-20 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 overflow-hidden">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl mb-6 text-gold">The Intersection of Elegance & Innovation</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Founded on the principles of timeless minimalism and technological advancement, Aurelia represents a new era of modern luxury. We believe that true premium experiences exist at the intersection of beautiful design and intelligent, AI-driven functionality.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our philosophy is simple: a digital-first fashion experience must feel as bespoke and elegant as the garments themselves. We strip away the unnecessary to reveal the essential beauty of form, texture, and seamless interaction.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <img src="/assets/champagne_silk_dress.png" alt="Aurelia Heritage" className="w-full border border-[#333] shadow-2xl" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse mb-24 overflow-hidden">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="md:order-2"
          >
            <h2 className="text-3xl mb-6 text-gold">Uncompromising Quality</h2>
            <p className="text-gray-300 leading-relaxed">
              From the subtle sheen of our champagne silk to the structured perfection of our obsidian leather, our commitment to quality is unwavering. We do not follow trends; we create enduring classics designed to be cherished for a lifetime.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="md:order-1"
          >
            <img src="/assets/leather_tote_bag.png" alt="Aurelia Quality" className="w-full border border-[#333] shadow-2xl" />
          </motion.div>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="mt-24 pt-20 border-t border-[#333]"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4 text-gold">Meet the Founder</h2>
            <p className="text-xl text-gray-400 font-serif italic">Shubham Prasad</p>
          </div>
          <div className="max-w-3xl mx-auto text-center">
             <p className="mb-6 text-gray-300 leading-relaxed text-lg italic">
               "As a Computer Science Engineering student with a deep fascination for full-stack development and AI-driven applications, I envisioned Aurelia as more than just a brand—it is a digital-first luxury experience."
             </p>
             <p className="mb-6 text-gray-300 leading-relaxed">
               Aurelia represents my vision of flawlessly blending cutting-edge technology with high-end aesthetics. The goal was to create an environment that feels premium, minimalist, and deeply intelligent, merging elegant UI/UX design with smart, AI-powered concierge interactions.
             </p>
             <p className="text-gray-300 leading-relaxed">
               This project was born from a dual passion: engineering highly functional, scalable web architectures, and elevating the standard of modern fashion presentation. Welcome to the future of luxury.
             </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
