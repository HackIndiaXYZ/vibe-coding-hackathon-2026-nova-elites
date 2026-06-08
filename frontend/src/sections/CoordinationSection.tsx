import React from 'react';
import { motion } from 'framer-motion';
import { AtmosphericPanel } from '../components/AtmosphericPanel';

const stages = [
  {
    num: "01",
    title: "Operations form.",
    desc: "Organizations initiate structured environments for specific crises or events, setting the foundational requirements and geographical scope.",
    align: "lg:ml-[10%]",
    delay: 0
  },
  {
    num: "02",
    title: "Networks converge.",
    desc: "Volunteers, domain experts, and material resources map themselves to the operational needs organically.",
    align: "lg:ml-[50%]",
    delay: 0.2
  },
  {
    num: "03",
    title: "Real-time synthesis.",
    desc: "Support is orchestrated dynamically. Needs are met as they arise, tracked transparently through an atmospheric intelligence layer.",
    align: "lg:ml-[30%]",
    delay: 0.4
  }
];

export const CoordinationSection: React.FC = () => {
  return (
    <section id="platform" className="relative py-32 min-h-screen flex flex-col justify-center">
      <div className="max-w-[1280px] mx-auto px-6 w-full relative z-10">
        
        <div className="mb-24 max-w-2xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="text-3xl md:text-4xl font-headline font-semibold tracking-tight text-white mb-6"
          >
            The flow of response.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-body-md text-on-surface-variant font-body leading-relaxed"
          >
            A continuous, breathing canvas where intent meets action without friction.
          </motion.p>
        </div>

        <div className="relative flex flex-col gap-24 lg:gap-32">
          {/* Subtle connecting line down the middle */}
          <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent -z-10 hidden lg:block" />

          {stages.map((stage, idx) => (
            <motion.div 
              key={stage.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 1.5, delay: stage.delay, ease: "easeOut" }}
              className={`w-full lg:w-[45%] ${stage.align} relative`}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 10 + idx * 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <AtmosphericPanel className="p-8 md:p-10">
                  <div className="w-10 h-10 rounded-full bg-surface-bright/40 flex items-center justify-center mb-6 border border-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                    <span className="text-xs font-semibold text-white/70">{stage.num}</span>
                  </div>
                  <h3 className="text-xl font-headline font-medium text-white mb-4 tracking-tight">
                    {stage.title}
                  </h3>
                  <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
                    {stage.desc}
                  </p>
                </AtmosphericPanel>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
