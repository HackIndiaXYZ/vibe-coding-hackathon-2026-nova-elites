import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { AtmosphericPanel } from '../components/AtmosphericPanel';
import { Button } from '../components/Button';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-32">
      {/* Content Container */}
      <div className="max-w-[1280px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left: Editorial Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
          className="col-span-1 lg:col-span-6 flex flex-col items-start gap-8"
        >
          <h1 className="text-display-lg-mobile md:text-5xl lg:text-7xl font-headline font-bold leading-[1.1] tracking-tight">
            Better coordination <br className="hidden md:block"/> means <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary text-glow">faster help.</span>
          </h1>
          
          <p className="text-body-lg text-on-surface-variant max-w-lg leading-relaxed font-body">
            Samanvay helps organizations, volunteers, and communities work together during emergencies, relief operations, and public events.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Button variant="secondary" onClick={() => navigate('/signup')} className="cursor-pointer" icon={<ArrowUpRight className="w-4 h-4 opacity-70" />}>
              Get Started
            </Button>
            <Button variant="ghost" onClick={() => navigate('/login')} className="cursor-pointer">
              Sign In
            </Button>
          </div>
        </motion.div>

        {/* Right: Atmospheric Visual (Recreating the node graph softly) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 0.5 }}
          className="col-span-1 lg:col-span-6 h-[500px] relative mt-12 lg:mt-0"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Soft connecting lines svg */}
            <svg className="absolute w-full h-full atmospheric-line">
              <motion.path 
                d="M 100 150 Q 250 50 400 300 T 600 200" 
                fill="none" 
                strokeWidth="1" 
                strokeDasharray="4 8"
                animate={{ strokeDashoffset: [0, -100] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.path 
                d="M 50 350 Q 300 450 500 150" 
                fill="none" 
                strokeWidth="1" 
                strokeDasharray="4 8"
                animate={{ strokeDashoffset: [0, 100] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
            </svg>

            {/* Drifting nodes */}
            <motion.div 
              className="absolute top-[20%] left-[10%]"
              animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            >
              <AtmosphericPanel className="px-4 py-2 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                <span className="text-xs font-semibold tracking-wider font-headline uppercase text-white/80">HQ</span>
              </AtmosphericPanel>
            </motion.div>

            <motion.div 
              className="absolute top-[60%] left-[30%]"
              animate={{ y: [0, 20, 0], x: [0, -5, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <AtmosphericPanel className="px-4 py-3 flex flex-col gap-1 min-w-[180px]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Supply Route Alpha</span>
                  <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
                </div>
                <span className="text-xs text-on-surface-variant/60">Clear • 14 mins</span>
              </AtmosphericPanel>
            </motion.div>

            <motion.div 
              className="absolute top-[30%] right-[10%]"
              animate={{ y: [0, -10, 0], x: [0, 15, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <AtmosphericPanel className="px-4 py-2 flex items-center gap-3 bg-surface-bright/10 backdrop-blur-md rounded-full border border-white/5">
                <span className="text-xs font-medium text-white/70">Unit 4 Active</span>
              </AtmosphericPanel>
            </motion.div>
            
             <motion.div 
              className="absolute bottom-[20%] right-[20%]"
              animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            >
               <div className="flex flex-col items-center gap-2">
                 <div className="w-16 h-16 rounded-full bg-surface/30 backdrop-blur-xl border border-white/5 flex items-center justify-center relative shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                   <div className="w-3 h-3 rounded-full bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                   <div className="absolute inset-0 rounded-full border border-white/10 animate-[ping_4s_ease-out_infinite]" />
                 </div>
                 <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">Logistics</span>
               </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
      
      {/* Soft fade into next section */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-b from-transparent to-base pointer-events-none z-0" />
    </section>
  );
};
