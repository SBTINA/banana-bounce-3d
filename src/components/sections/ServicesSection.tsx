import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Video, BarChart3, Route, Sparkles, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Video,
    number: '01',
    title: 'Intelligent Video Production',
    description: 'We create stunning, AI-enhanced videos that combine motion design, voiceovers, and visual storytelling — perfect for ads, product launches, and social media.',
    features: ['Motion Design', 'AI Voiceovers', 'Visual Storytelling', 'Social Media'],
  },
  {
    icon: BarChart3,
    number: '02',
    title: 'Predictive Analytics',
    description: 'Using AI-powered data analysis, we predict user behavior, identify trends, and automatically optimize your marketing campaigns for better performance and ROI.',
    features: ['Behavior Prediction', 'Trend Analysis', 'Auto Optimization', 'ROI Focus'],
  },
  {
    icon: Route,
    number: '03',
    title: 'Personalized Journeys',
    description: 'With machine learning, we build smart customer journeys that adapt in real-time — delivering the right message, to the right person, at the right moment.',
    features: ['Real-time Adaptation', 'Smart Targeting', 'ML Powered', 'Perfect Timing'],
  },
  {
    icon: Sparkles,
    number: '04',
    title: 'AI Creative Content',
    description: 'From blog posts to ad copy, we use AI tools to generate high-quality, engaging content tailored to your brand voice — faster and more efficiently than ever.',
    features: ['Blog Posts', 'Ad Copy', 'Brand Voice', 'Fast Delivery'],
  },
];

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="services" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute inset-0 bg-grid opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-primary font-body text-sm tracking-widest uppercase mb-4 block">What We Do</span>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-card-foreground mb-6">
            OUR <span className="text-primary">SERVICES</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-gold mx-auto mb-8" />
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Cutting-edge AI solutions designed to transform your brand's digital presence
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
            >
              <div className={`relative bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 border transition-all duration-500 ${
                hoveredIndex === index ? 'border-primary shadow-[0_0_50px_hsl(48,100%,50%,0.2)]' : 'border-primary/10'
              }`}>
                {/* Number */}
                <span className="absolute top-6 right-8 font-display text-6xl md:text-7xl text-primary/10 group-hover:text-primary/20 transition-colors duration-300">
                  {service.number}
                </span>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                  hoveredIndex === index ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                }`}>
                  <service.icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl md:text-3xl text-card-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground font-body text-base leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs font-body px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <motion.a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-primary font-body text-sm group-hover:gap-4 transition-all duration-300"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </motion.a>

                {/* Hover Glow Effect */}
                <div className={`absolute -inset-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
