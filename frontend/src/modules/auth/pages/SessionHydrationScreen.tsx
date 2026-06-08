import React from 'react';
import { motion } from 'framer-motion';

export const SessionHydrationScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base text-on-surface">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08),transparent_60%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute inset-0 border border-white/5 rounded-full" />
          <motion.div 
            animate={{ 
              boxShadow: [
                '0 0 10px rgba(139,92,246,0.1)',
                '0 0 30px rgba(139,92,246,0.3)',
                '0 0 10px rgba(139,92,246,0.1)'
              ] 
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-2 h-2 bg-primary rounded-full"
          />
        </div>
        
        <div className="text-center">
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-xs uppercase tracking-[0.2em] font-headline text-text-secondary font-medium"
          >
            Initializing coordination environment
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};
