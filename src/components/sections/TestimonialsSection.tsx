import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization?: string;
  testimonial: string;
  avatar_url?: string;
  rating?: number;
  is_featured?: boolean;
  display_order?: number;
  is_active?: boolean;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (!error && data) {
        setTestimonials(data);
      }
    } finally {
      setLoading(false);
    }
  };


  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  if (loading) {
    return (
      <section className="py-24 bg-muted/30" id="testimonials">
        <div className="container-custom">
          <div className="text-center">
            <div className="text-muted-foreground">Loading testimonials...</div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-24 bg-muted/30" id="testimonials">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-semibold uppercase tracking-wider"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mt-4 mb-6"
          >
            What Our <span className="text-primary">Partners</span> Say?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Hear from developers who've transformed their careers through Hacker's Unity
          </motion.p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative h-full">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                }}
              >
                <Card variant="glass" className="p-8 md:p-10 flex flex-col justify-between">
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 }}
                    >
                      <span className="text-4xl md:text-5xl text-primary/60 font-display leading-none">99</span>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-foreground text-base md:text-lg leading-relaxed font-light"
                    >
                      "{currentTestimonial.testimonial}"
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-4 pt-6 border-t border-border/40 mt-6"
                  >
                    {currentTestimonial.avatar_url && (
                      <img
                        src={currentTestimonial.avatar_url}
                        alt={currentTestimonial.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30 flex-shrink-0"
                      />
                    )}
                    <div>
                      <h4 className="font-display font-semibold text-foreground text-sm md:text-base">
                        {currentTestimonial.name}
                      </h4>
                      <p className="text-xs md:text-sm text-muted-foreground">{currentTestimonial.role}</p>
                    </div>
                  </motion.div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation - Testimonial Names */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mt-8">
            {testimonials.map((testimonial, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className="relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span
                  className={`text-sm md:text-base font-medium transition-colors duration-300 ${
                    index === currentIndex
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {testimonial.name}
                </span>
                {index === currentIndex && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
