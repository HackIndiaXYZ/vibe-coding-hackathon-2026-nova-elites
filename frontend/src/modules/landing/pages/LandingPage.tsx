import { AtmosphericBackground } from '../../../components/AtmosphericBackground';
import { Navbar } from '../../../sections/Navbar';
import { HeroSection } from '../../../sections/HeroSection';
import { CoordinationSection } from '../../../sections/CoordinationSection';
import { CommunitySection } from '../../../sections/CommunitySection';
import { CtaSection } from '../../../sections/CtaSection';

export function LandingPage() {
  return (
    <div className="relative min-h-screen text-on-surface selection:bg-primary/30 selection:text-white">
      {/* 
        The global continuous atmosphere. 
        It sits at the lowest z-index and provides the environmental lighting for all sections.
      */}
      <AtmosphericBackground />
      
      <Navbar />
      
      <main className="relative z-10 flex flex-col w-full">
        <HeroSection />
        <CoordinationSection />
        <CommunitySection />
        <CtaSection />
      </main>
      
      {/* Minimal Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 mt-16 bg-base/50 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-start gap-2">
            <span className="font-headline text-xl font-semibold text-white">Samanvay</span>
            <span className="text-xs text-on-surface-variant max-w-xs leading-relaxed">
              © 2026 Samanvay Coordination. Human-centric humanitarian infrastructure.
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-on-surface-variant font-medium">
            <a href="#ethics" className="hover:text-white transition-colors">Ethics</a>
            <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="#status" className="hover:text-white transition-colors">Network Status</a>
            <a href="#reach" className="hover:text-white transition-colors">Global Reach</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
