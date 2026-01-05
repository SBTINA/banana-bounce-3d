import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 overflow-hidden bg-card/50 border-t border-primary/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <motion.a
              href="#home"
              className="font-display text-4xl text-primary glow-text inline-block mb-4"
              whileHover={{ scale: 1.05 }}
            >
              FARDA<span className="text-card-foreground">AI</span>
            </motion.a>
            <p className="text-muted-foreground font-body text-sm max-w-md leading-relaxed">
              Until Tomorrow — Where AI meets creativity to craft the future of digital marketing and brand experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg text-card-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Services', 'Cases', 'Contact'].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase()}`}
                    className="text-muted-foreground hover:text-primary font-body text-sm transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg text-card-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              {['Video Production', 'Predictive Analytics', 'Customer Journeys', 'AI Content'].map((service) => (
                <li key={service}>
                  <span className="text-muted-foreground font-body text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground font-body text-sm">
            © {currentYear} FardaAI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary font-body text-sm transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary font-body text-sm transition-colors duration-300">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
    </footer>
  );
}
