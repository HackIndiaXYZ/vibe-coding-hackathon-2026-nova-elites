import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-24 px-6 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-base -z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.1),transparent_40%)] -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.05),transparent_50%)] -z-10" />
      
      {/* Auth Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex justify-center mb-6"
          >
            <div className="w-12 h-12 rounded-full border border-white/5 shadow-[0_0_20px_rgba(139,92,246,0.15)] flex items-center justify-center bg-surface/30">
              <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-headline font-semibold tracking-tight text-text-primary mb-3">
            {title}
          </h1>
          <p className="text-body-md text-text-secondary leading-relaxed max-w-sm mx-auto">
            {subtitle}
          </p>
        </div>

        {children}
      </motion.div>
    </div>
  );
};
