import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles } from 'lucide-react';
import BananaScene from '@/components/3d/BananaScene';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
      {/* 3D Background */}
      <BananaScene />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(48,100%,50%,0.08)_0%,transparent_60%)] z-10" />
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 text-primary font-body text-sm md:text-base tracking-widest uppercase border border-primary/30 px-4 py-2 rounded-full bg-primary/5">
            <Sparkles className="w-4 h-4" />
            AI-Powered Creative Agency
            <Sparkles className="w-4 h-4" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-7xl md:text-9xl lg:text-[12rem] leading-none tracking-tight mb-4"
        >
          <span className="text-primary glow-text">UNTIL</span>
        </motion.h1>
        
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-7xl md:text-9xl lg:text-[12rem] leading-none tracking-tight mb-8"
        >
          <span className="text-card-foreground">TOMORROW</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-muted-foreground font-body text-lg md:text-xl max-w-2xl mx-auto mb-12"
        >
          From captivating videos to automated campaigns — your growth, enhanced by AI
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="hero" size="xl">
            Explore Our Work
          </Button>
          <Button variant="glow" size="xl">
            View Cases
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-primary/60"
          >
            <span className="text-xs font-body tracking-widest uppercase">Scroll to Explore</span>
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-primary/20 rounded-full animate-pulse-glow opacity-30" />
      <div className="absolute bottom-20 right-10 w-24 h-24 border border-primary/20 rounded-full animate-pulse-glow opacity-30" />
    </section>
  );
}
