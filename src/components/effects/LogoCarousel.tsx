import { motion } from 'framer-motion';

interface LogoItem {
  image: string;
  name: string;
}

interface LogoCarouselProps {
  logos: LogoItem[];
  speed?: number;
  itemSize?: number;
}

export default function LogoCarousel({ 
  logos, 
  speed = 30,
  itemSize = 96 // w-24 = 6rem = 96px
}: LogoCarouselProps) {
  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="relative overflow-hidden">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Carousel container */}
      <div className="flex">
        <motion.div
          className="flex gap-8"
          animate={{
            x: [0, -(logos.length * (itemSize + 32))], // itemSize + gap (32px = 2rem)
          }}
          transition={{
            x: {
              duration: speed,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            },
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <motion.div
              key={`logo-${index}`}
              className="flex-shrink-0 bg-card rounded-xl border border-primary/10 flex items-center justify-center p-4 group cursor-pointer"
              style={{
                width: itemSize,
                height: itemSize,
              }}
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(255, 221, 0, 0.4)',
                boxShadow: '0 0 20px rgba(255, 221, 0, 0.15)',
              }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={logo.image}
                alt={logo.name}
                className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0"
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
