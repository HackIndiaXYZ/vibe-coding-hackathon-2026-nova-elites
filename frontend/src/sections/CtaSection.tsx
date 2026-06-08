import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';

export const CtaSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 mb-16 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h2 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tight leading-[1.1] mb-8">
            Join the operational <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary-light text-glow">network.</span>
          </h2>
          <p className="text-lg md:text-xl text-on-surface-variant font-body mb-12 max-w-xl mx-auto leading-relaxed">
            Whether you are an organization leading relief efforts or a volunteer ready to assist, Samanvay provides the atmosphere for coordinated action.
          </p>
          
          <Button variant="primary" onClick={() => navigate('/signup')} className="cursor-pointer px-8 py-4 text-lg rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.3)]">
            Get Started
          </Button>
        </motion.div>

      </div>
      
      {/* Subtle bottom glow indicating end of page/depth */}
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-3/4 h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />
    </section>
  );
};
