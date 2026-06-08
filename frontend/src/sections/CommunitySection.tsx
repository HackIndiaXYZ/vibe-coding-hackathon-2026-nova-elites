import React from 'react';
import { motion } from 'framer-motion';

export const CommunitySection: React.FC = () => {
  return (
    <section id="network" className="relative py-32">
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-3xl md:text-5xl font-headline font-semibold text-white tracking-tight leading-[1.2] mb-8">
              A collective humanitarian presence.
            </h2>
            <div className="space-y-6 text-on-surface-variant text-body-lg font-body leading-relaxed">
              <p>
                Samanvay is not just a tool; it is a shared space. It brings together NGOs, local organizations, and individual volunteers into a single, cohesive environment.
              </p>
              <p>
                There are no silos here. Only calm, operational collaboration where every entity is aware of the broader mission and their specific role within it.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2, delay: 0.3 }}
            className="w-full lg:w-1/2 relative h-[400px] flex items-center justify-center"
          >
            {/* Abstract representation of human network - NOT logos */}
            <div className="absolute inset-0">
              <div className="w-full h-full relative">
                {/* Nodes representing people/orgs */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/10 backdrop-blur-sm border border-white/5 flex items-center justify-center"
                    style={{
                      width: `${Math.random() * 60 + 40}px`,
                      height: `${Math.random() * 60 + 40}px`,
                      top: `${Math.random() * 80 + 10}%`,
                      left: `${Math.random() * 80 + 10}%`,
                    }}
                    animate={{
                      y: [0, Math.random() * 20 - 10, 0],
                      x: [0, Math.random() * 20 - 10, 0],
                    }}
                    transition={{
                      duration: Math.random() * 10 + 15,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-accent/40 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                  </motion.div>
                ))}
                
                {/* Large gentle glow connecting them */}
                <motion.div 
                  className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full mix-blend-screen"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
