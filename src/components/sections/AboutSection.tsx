import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Lightbulb, Cpu, TrendingUp, Users } from 'lucide-react';

const features = [
  {
    icon: Lightbulb,
    title: 'Creative Excellence',
    description: 'Blending human creativity with AI innovation',
  },
  {
    icon: Cpu,
    title: 'AI Technology',
    description: 'Cutting-edge machine learning solutions',
  },
  {
    icon: TrendingUp,
    title: 'Data-Driven',
    description: 'Insights that drive measurable results',
  },
  {
    icon: Users,
    title: 'Brand Connection',
    description: 'Building authentic audience relationships',
  },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-32 overflow-hidden bg-noise">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(48,100%,50%,0.05)_0%,transparent_50%)]" />
      
      <div className="container mx-auto px-6" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-primary font-body text-sm tracking-widest uppercase mb-4 block">About Us</span>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-card-foreground mb-6">
            WE ARE <span className="text-primary">FARDA</span>AI
          </h2>
          <div className="w-24 h-1 bg-gradient-gold mx-auto" />
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="font-display text-3xl md:text-4xl text-card-foreground mb-6">
              The Future of Marketing is <span className="text-primary">Intelligent</span>
            </h3>
            <p className="text-muted-foreground font-body text-lg leading-relaxed mb-6">
              At our agency, we seamlessly blend human creativity with advanced AI technologies to craft innovative, data-driven solutions tailored for sustainable brand growth.
            </p>
            <p className="text-muted-foreground font-body text-lg leading-relaxed mb-6">
              We believe that the future of marketing lies in the perfect harmony between intuition and intelligent automation. Our team leverages cutting-edge tools to understand audience behavior, predict trends, and personalize content like never before.
            </p>
            <p className="text-muted-foreground font-body text-lg leading-relaxed">
              Our goal is not only to deliver campaigns that perform — but also to create meaningful, lasting digital experiences and smart marketing strategies that foster deeper, more authentic connections between businesses and their audiences.
            </p>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-square relative">
              {/* Rotating rings */}
              <div className="absolute inset-0 border border-primary/20 rounded-full animate-spin-slow" />
              <div className="absolute inset-8 border border-primary/30 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
              <div className="absolute inset-16 border border-primary/40 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }} />
              
              {/* Center glow */}
              <div className="absolute inset-24 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="font-display text-6xl md:text-7xl text-primary glow-text">AI</span>
                  <span className="block font-body text-sm text-muted-foreground tracking-widest uppercase mt-2">Powered</span>
                </div>
              </div>

              {/* Floating icons */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-card p-4 rounded-xl border border-primary/20"
              >
                <Cpu className="w-6 h-6 text-primary" />
              </motion.div>
              
              <motion.div
                animate={{ x: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 bg-card p-4 rounded-xl border border-primary/20"
              >
                <TrendingUp className="w-6 h-6 text-primary" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="group relative bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 hover-lift"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-display text-xl text-card-foreground mb-2">{feature.title}</h4>
                <p className="text-muted-foreground font-body text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
