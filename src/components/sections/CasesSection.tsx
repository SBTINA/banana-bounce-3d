import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import WaterWaveImage from '../effects/WaterWaveImage';
import Card3DWave from '../effects/Card3DWave';
import LogoCarousel from '../effects/LogoCarousel';

const cases = [
  {
    name: 'Snapp',
    category: 'Digital Campaign',
    image: 'https://fardaai.dm2.ir/wp-content/uploads/2025/09/Snapp.webp',
    video: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
  },
  {
    name: 'Kaleh',
    category: 'Brand Strategy',
    image: 'https://fardaai.dm2.ir/wp-content/uploads/2025/09/%DA%A9%D8%A7%D9%84%D9%87.webp',
    video: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
  },
  {
    name: 'DigiKala',
    category: 'Video Production',
    image: 'https://fardaai.dm2.ir/wp-content/uploads/2025/09/%D8%AF%DB%8C%D8%AC%DB%8C-%DA%A9%D8%A7%D9%84%D8%A7.webp',
    video: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
  },
  {
    name: 'FilFil',
    category: 'AI Campaign',
    image: 'https://fardaai.dm2.ir/wp-content/uploads/2025/09/%D9%81%DB%8C%D9%84%D9%81%DB%8C%D9%84.webp',
    video: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
  },
  {
    name: 'Costco Iran',
    category: 'Content Strategy',
    image: 'https://fardaai.dm2.ir/wp-content/uploads/2025/09/%DA%A9%D8%A7%D8%B3%D8%AA%DA%A9%D9%88-2.webp',
    video: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
  },
  {
    name: 'Nan Avaran',
    category: 'Video Production',
    image: 'https://fardaai.dm2.ir/wp-content/uploads/2025/09/%D9%86%D8%A7%D9%86-%D8%A2%D9%88%D8%B1%D8%A7%D9%86.webp',
    video: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
  },
];

export default function CasesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredCase, setHoveredCase] = useState<number | null>(null);

  return (
    <section id="cases" className="relative py-32 overflow-hidden bg-card/30">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(48,100%,50%,0.05)_0%,transparent_60%)]" />
      
      <div className="container mx-auto px-6" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-primary font-body text-sm tracking-widest uppercase mb-4 block">Our Work</span>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-card-foreground mb-6">
            CASE <span className="text-primary">STUDIES</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-gold mx-auto mb-8" />
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Brands we have collaborated with to create extraordinary digital experiences
          </p>
        </motion.div>

        {/* Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem, index) => (
            <motion.div
              key={caseItem.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCase(index)}
              onMouseLeave={() => setHoveredCase(null)}
              className="group"
            >
              <Card3DWave className="aspect-[4/3]" intensity={12}>
                <div className="relative w-full h-full cursor-pointer">
                  {/* Water Wave Image with Video */}
                  <WaterWaveImage
                    src={caseItem.image}
                    videoSrc={caseItem.video}
                    alt={caseItem.name}
                    className="absolute inset-0"
                    isHovered={hoveredCase === index}
                  />
                  
                  {/* Overlay */}
                  <div className={`absolute inset-0 transition-all duration-500 pointer-events-none ${
                    hoveredCase === index 
                      ? 'bg-gradient-to-t from-background via-background/60 to-transparent' 
                      : 'bg-gradient-to-t from-background/80 via-transparent to-transparent'
                  }`} />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end pointer-events-none">
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={hoveredCase === index ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 0 }}
                      className="text-primary font-body text-xs tracking-widest uppercase mb-2"
                    >
                      {caseItem.category}
                    </motion.span>
                    <h3 className="font-display text-2xl md:text-3xl text-card-foreground group-hover:text-primary transition-colors duration-300">
                      {caseItem.name}
                    </h3>

                    {/* Hover Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={hoveredCase === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-3 mt-4 pointer-events-auto"
                    >
                      <button className="w-10 h-10 bg-primary/20 hover:bg-primary/40 rounded-full flex items-center justify-center text-primary transition-colors duration-300">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 bg-primary/20 hover:bg-primary/40 rounded-full flex items-center justify-center text-primary transition-colors duration-300">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </motion.div>
                  </div>

                  {/* Index Number */}
                  <span className="absolute top-4 right-4 font-display text-4xl text-primary/20 group-hover:text-primary/40 transition-colors duration-300 pointer-events-none">
                    0{index + 1}
                  </span>
                </div>
              </Card3DWave>
            </motion.div>
          ))}
        </div>

        {/* Brand Logos Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20"
        >
          <p className="text-center text-muted-foreground font-body text-sm mb-8 tracking-widest uppercase">
            Trusted by Leading Brands
          </p>
          <LogoCarousel logos={cases} speed={25} itemSize={96} />
        </motion.div>
      </div>
    </section>
  );
}
