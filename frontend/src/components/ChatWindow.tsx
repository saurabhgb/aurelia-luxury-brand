"use client";
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

type Message = {
  text: string;
  sender: 'user' | 'bot';
  isTyping?: boolean;
};

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Welcome to Aurelia. How may our concierge assist you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { cart } = useCart();
  const pathname = usePathname();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }, { text: "...", sender: 'bot', isTyping: true }]);

    try {
      const payload = {
        message: userMsg,
        context: {
          cart: cart,
          pathname: pathname
        }
      };

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      setMessages(prev => {
        const withoutTyping = prev.filter(m => !m.isTyping);
        return [...withoutTyping, { text: data.reply, sender: 'bot' }];
      });
    } catch (error) {
      setMessages(prev => {
        const withoutTyping = prev.filter(m => !m.isTyping);
        return [...withoutTyping, { text: "Connection error. Please try again.", sender: 'bot' }];
      });
    }
  };

  return (
    <>
      <div 
        className="fixed bottom-8 right-8 w-14 h-14 bg-gold text-bg rounded-full flex justify-center items-center cursor-pointer shadow-lg z-[999] hover:scale-110 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageSquare size={24} />
      </div>

      <div className={`fixed bottom-[100px] right-8 w-[350px] h-[450px] bg-[#151515] border border-[#333] rounded-lg flex flex-col z-[999] transition-all duration-300 shadow-2xl ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-5'}`}>
        <div className="bg-[#111] p-4 flex justify-between items-center rounded-t-lg border-b border-[#333]">
          <h4 className="text-gold font-serif">Aurelia Concierge</h4>
          <button onClick={() => setIsOpen(false)} className="text-text hover:text-gold"><X size={20} /></button>
        </div>
        
        <div className="flex-grow p-5 overflow-y-auto flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'bot' ? 'bg-[#222] self-start rounded-bl-sm' : 'bg-gold text-bg self-end rounded-br-sm'}`}
            >
              {msg.isTyping ? <span className="animate-pulse">...</span> : msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="flex p-4 border-t border-[#333]">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-grow bg-transparent border-none text-white outline-none"
          />
          <button onClick={sendMessage} className="text-gold ml-2"><Send size={20} /></button>
        </div>
      </div>
    </>
  );
}
