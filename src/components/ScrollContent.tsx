import { motion } from 'framer-motion';
import { Sparkles, ArrowDown, Brain, Video, BarChart3, Users, ExternalLink, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ScrollContentProps {
  scrollProgress: number;
}

// Scene content sections with their scroll ranges
const getSceneOpacity = (scrollProgress: number, start: number, end: number) => {
  const fadeIn = 0.03;
  const fadeOut = 0.03;
  
  if (scrollProgress < start) return 0;
  if (scrollProgress < start + fadeIn) return (scrollProgress - start) / fadeIn;
  if (scrollProgress < end - fadeOut) return 1;
  if (scrollProgress < end) return (end - scrollProgress) / fadeOut;
  return 0;
};

export default function ScrollContent({ scrollProgress }: ScrollContentProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const services = [
    { icon: Brain, title: 'AI Generated Content', desc: 'محتوای هوشمند با قدرت هوش مصنوعی' },
    { icon: Video, title: 'Intelligent Video', desc: 'تولید ویدیو با تکنولوژی پیشرفته' },
    { icon: BarChart3, title: 'Predictive Analytics', desc: 'تحلیل داده و پیش‌بینی هوشمند' },
    { icon: Users, title: 'Personalized Journeys', desc: 'سفر مشتری شخصی‌سازی شده' },
  ];

  const cases = [
    { name: 'Snapp', category: 'Digital Campaign' },
    { name: 'Kaleh', category: 'Brand Strategy' },
    { name: 'DigiKala', category: 'AI Content' },
    { name: 'FilFil', category: 'Video Production' },
    { name: 'Tap30', category: 'Analytics' },
    { name: 'Alibaba', category: 'Personalization' },
  ];

  return (
    <div className="relative z-10">
      {/* Scene 1: Hero (0 - 0.15) */}
      <section 
        className="h-screen flex items-center justify-center relative"
        style={{ opacity: getSceneOpacity(scrollProgress, 0, 0.18) }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(48,100%,50%,0.05)_0%,transparent_50%)]" />
        
        <div className="text-center px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 text-primary font-body text-sm tracking-widest uppercase border border-primary/30 px-4 py-2 rounded-full bg-primary/5">
              <Sparkles className="w-4 h-4" />
              AI-Powered Creative Agency
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-display text-6xl md:text-8xl lg:text-[10rem] leading-none tracking-tight"
          >
            <span className="text-primary glow-text block">UNTIL</span>
            <span className="text-foreground block mt-2">TOMORROW</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-muted-foreground font-body text-lg md:text-xl max-w-xl mx-auto mt-8"
          >
            آینده‌ی هوش مصنوعی در بازاریابی و برندینگ
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center gap-2 text-primary/60"
            >
              <span className="text-xs font-body tracking-widest uppercase">Scroll to Begin</span>
              <ArrowDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Scene 2: About / Growth (0.15 - 0.30) */}
      <section 
        className="h-screen flex items-center justify-center"
        style={{ opacity: getSceneOpacity(scrollProgress, 0.12, 0.33) }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-2xl ml-auto text-right">
            <motion.span
              className="text-primary font-body text-sm tracking-widest uppercase mb-4 block"
            >
              About Farda AI
            </motion.span>
            
            <h2 className="font-display text-4xl md:text-6xl text-foreground mb-6">
              ما آینده را
              <span className="text-primary block">می‌سازیم</span>
            </h2>
            
            <p className="text-muted-foreground font-body text-lg leading-relaxed mb-8">
              با ترکیب خلاقیت انسانی و هوش مصنوعی، محتوای دیجیتال و کمپین‌های هوشمند خلق می‌کنیم که برند شما را به فردا می‌برد. از تولید محتوای AI-powered گرفته تا تحلیل پیش‌بینانه، همه چیز برای رشد شماست.
            </p>

            <div className="flex gap-4 justify-end">
              <Button variant="glow" size="lg">
                بیشتر بدانید
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Scene 3: Services / Peel (0.30 - 0.50) */}
      <section 
        className="min-h-screen flex items-center py-20"
        style={{ opacity: getSceneOpacity(scrollProgress, 0.27, 0.53) }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-xl">
            <span className="text-primary font-body text-sm tracking-widest uppercase mb-4 block">
              Our Services
            </span>
            
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-12">
              خدمات ما
            </h2>

            <div className="space-y-6">
              {services.map((service, i) => {
                const serviceProgress = (scrollProgress - 0.30) / 0.20;
                const serviceOpacity = Math.min(1, Math.max(0, (serviceProgress - i * 0.2) * 3));
                
                return (
                  <div
                    key={i}
                    className="group p-6 rounded-2xl border border-primary/20 bg-card/30 backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
                    style={{ 
                      opacity: serviceOpacity,
                      transform: `translateX(${(1 - serviceOpacity) * -30}px)`
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <service.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-foreground mb-1">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground font-body text-sm">
                          {service.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Scene 4: Cases / Bite (0.50 - 0.65) */}
      <section 
        className="min-h-screen flex items-center py-20"
        style={{ opacity: getSceneOpacity(scrollProgress, 0.47, 0.68) }}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-primary font-body text-sm tracking-widest uppercase mb-4 block">
              Case Studies
            </span>
            
            <h2 className="font-display text-4xl md:text-6xl text-foreground">
              نمونه کارها
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {cases.map((item, i) => (
              <div
                key={i}
                className="group relative aspect-square rounded-2xl border border-primary/20 bg-card/20 backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <h3 className="font-display text-2xl text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-muted-foreground font-body text-xs mt-2">
                    {item.category}
                  </p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scene 5: Banana Universe / Fall (0.65 - 0.85) */}
      <section 
        className="min-h-screen flex items-center py-20"
        style={{ opacity: getSceneOpacity(scrollProgress, 0.62, 0.88) }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="font-display text-5xl md:text-7xl lg:text-8xl text-primary glow-text mb-8"
          >
            BANANA
            <span className="block text-foreground">UNIVERSE</span>
          </motion.h2>
          
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto mb-8">
            در دنیای موز، خلاقیت بی‌پایان است. هر ایده‌ای می‌تواند به واقعیت تبدیل شود. 
            ما اینجا هستیم تا رویاهای دیجیتال شما را به واقعیت تبدیل کنیم.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {['Creative', 'Innovative', 'AI-Powered', 'Future-Ready'].map((tag, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-full border border-primary/30 text-primary font-body text-sm bg-primary/5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Scene 6: Contact / Ground (0.85 - 1.0) */}
      <section 
        className="min-h-screen flex items-center py-20"
        style={{ opacity: getSceneOpacity(scrollProgress, 0.82, 1.05) }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-primary font-body text-sm tracking-widest uppercase mb-4 block">
                Get in Touch
              </span>
              
              <h2 className="font-display text-4xl md:text-5xl text-foreground">
                تماس با ما
              </h2>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input
                  type="text"
                  placeholder="نام شما"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl bg-card/30 border border-primary/20 text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              
              <div>
                <input
                  type="email"
                  placeholder="ایمیل شما"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl bg-card/30 border border-primary/20 text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              
              <div>
                <textarea
                  placeholder="پیام شما"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl bg-card/30 border border-primary/20 text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>
              
              <Button variant="hero" size="xl" className="w-full">
                <Send className="w-5 h-5 ml-2" />
                ارسال پیام
              </Button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 py-8 text-center border-t border-primary/10">
          <p className="text-muted-foreground font-body text-sm">
            © {new Date().getFullYear()} FardaAI. All rights reserved.
          </p>
        </div>
      </section>

      {/* Spacer for scroll */}
      <div className="h-[500vh]" />
    </div>
  );
}
