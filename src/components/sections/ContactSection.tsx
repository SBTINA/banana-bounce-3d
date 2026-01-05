import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    setFormData({ name: '', email: '', company: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden bg-noise" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-card/50 via-background to-background" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      {/* Floating Decorations */}
      <motion.div
        animate={{ 
          rotate: 360,
          y: [0, -20, 0],
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }}
        className="absolute top-20 right-20 w-40 h-40 opacity-10"
      >
        <div className="w-full h-full bg-primary rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-primary font-body text-sm tracking-widest uppercase mb-4 block">Get In Touch</span>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-card-foreground mb-6">
            LET'S <span className="text-primary">CREATE</span>
          </h2>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-card-foreground mb-6">
            TOGETHER
          </h2>
          <div className="w-24 h-1 bg-gradient-gold mx-auto mb-8" />
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Let's create something extraordinary together. Get in touch today and take your brand to the next level.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-card-foreground font-body text-sm mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-card/50 border border-primary/20 rounded-xl px-4 py-4 text-card-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_20px_hsl(48,100%,50%,0.2)] transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>
                <div className="group">
                  <label className="block text-card-foreground font-body text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-card/50 border border-primary/20 rounded-xl px-4 py-4 text-card-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_20px_hsl(48,100%,50%,0.2)] transition-all duration-300"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="group">
                <label className="block text-card-foreground font-body text-sm mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full bg-card/50 border border-primary/20 rounded-xl px-4 py-4 text-card-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_20px_hsl(48,100%,50%,0.2)] transition-all duration-300"
                  placeholder="Your Company Name"
                />
              </div>
              
              <div className="group">
                <label className="block text-card-foreground font-body text-sm mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-card/50 border border-primary/20 rounded-xl px-4 py-4 text-card-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_20px_hsl(48,100%,50%,0.2)] transition-all duration-300 resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                size="xl" 
                className="w-full group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-8">
              {/* Info Cards */}
              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-start gap-4 p-6 bg-card/30 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-xl text-card-foreground mb-1">Email Us</h4>
                  <p className="text-muted-foreground font-body">hello@fardaai.com</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-start gap-4 p-6 bg-card/30 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-xl text-card-foreground mb-1">Call Us</h4>
                  <p className="text-muted-foreground font-body">+98 21 1234 5678</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-start gap-4 p-6 bg-card/30 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-xl text-card-foreground mb-1">Visit Us</h4>
                  <p className="text-muted-foreground font-body">Tehran, Iran</p>
                </div>
              </motion.div>
            </div>

            {/* Decorative Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-12 p-8 bg-primary/5 rounded-2xl border border-primary/10"
            >
              <p className="font-display text-2xl md:text-3xl text-primary leading-relaxed">
                "THE FUTURE BELONGS TO THOSE WHO PREPARE FOR IT TODAY"
              </p>
              <span className="text-muted-foreground font-body text-sm mt-4 block">— FardaAI Team</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
