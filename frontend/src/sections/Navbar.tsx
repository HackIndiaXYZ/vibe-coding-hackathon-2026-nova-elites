import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 max-w-[1280px] mx-auto"
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="font-headline text-2xl font-semibold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          Samanvay
        </span>
      </div>

      {/* Links - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-8 px-8 py-3 rounded-2xl bg-surface/20 backdrop-blur-md border border-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
        {['Platform', 'Impact', 'Network', 'Stories'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-on-surface hover:text-white transition-colors duration-300">
            {item}
          </a>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/login')} className="hidden sm:inline-flex text-sm py-2 px-5 cursor-pointer">
          Sign In
        </Button>
        <Button variant="secondary" onClick={() => navigate('/signup')} className="hidden sm:inline-flex text-sm py-2 px-5 cursor-pointer">
          Get Started
        </Button>
        <button className="p-2 text-on-surface hover:text-white transition-colors cursor-pointer">
          <Globe className="w-5 h-5 opacity-70" />
        </button>
      </div>
    </motion.nav>
  );
};
