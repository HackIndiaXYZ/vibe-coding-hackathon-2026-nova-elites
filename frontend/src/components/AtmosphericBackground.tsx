import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export const AtmosphericBackground: React.FC = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: [0.35, 0.45, 0.35],
      scale: [1, 1.05, 1],
      transition: {
        duration: 15,
        ease: "easeInOut",
        repeat: Infinity,
      }
    });
  }, [controls]);

  return (
    <div className="atmospheric-canvas">
      <motion.div 
        className="glow-mesh"
        animate={controls}
      />
      {/* Additional subtle moving light node */}
      <motion.div
        className="absolute w-96 h-96 bg-primary-glow rounded-full mix-blend-screen blur-[120px]"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
        }}
        transition={{
          duration: 25,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{ top: '20%', left: '30%' }}
      />
    </div>
  );
};
