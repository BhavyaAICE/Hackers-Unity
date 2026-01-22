import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

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

const AUTO_SLIDE_INTERVAL = 5000;

// Sample testimonials fallback
const sampleTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Arjun Sharma",
    role: "Full Stack Developer",
    organization: "Microsoft",
    testimonial:
      "Hacker's Unity transformed my career. The hackathons pushed me beyond my limits and helped me connect with amazing mentors who guided me to land my dream job.",
    is_active: true,
  },
  {
    id: "2",
    name: "Priya Patel",
    role: "ML Engineer",
    organization: "Google",
    testimonial:
      "Being part of this community opened doors I never knew existed. The workshops on AI/ML were top-notch, and I met my co-founders at one of their hackathons.",
    is_active: true,
  },
  {
    id: "3",
    name: "Rahul Verma",
    role: "Blockchain Developer",
    organization: "Polygon",
    testimonial:
      "The Web3 hackathons organized by Hacker's Unity were exceptional. I learned more in those 48 hours than I did in months of self-study.",
    is_active: true,
  },
];

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(sampleTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

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

      if (!error && data && data.length > 0) {
        setTestimonials(data);
      }
    } catch {
      // fallback already set
    }
  };

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return;
    const interval = setInterval(goToNext, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [goToNext, testimonials.length, isPaused]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.96,
    }),
  };

  const current = testimonials[currentIndex];

  return (
    <section
      id="testimonials"
      className="py-24 bg-gradient-to-b from-background to-muted/30 overflow-hidden"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            What Our <span className="text-primary">Partners</span> Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Hear from developers who've transformed their careers through Hacker's Unity
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-12 h-12 rounded-full bg-card border shadow flex items-center justify-center hover:text-primary"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-12 h-12 rounded-full bg-card border shadow flex items-center justify-center hover:text-primary"
          >
            <ChevronRight />
          </button>

          {/* Fixed-height container */}
          <div className="relative h-[360px] md:h-[340px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 260, damping: 28 } }}
                className="absolute inset-0"
              >
                {/* 🔒 FIXED HEIGHT CARD */}
                <Card className="h-full p-8 md:p-10 bg-card/80 backdrop-blur-sm border-border/50 shadow-xl flex flex-col justify-between">
                  <Quote className="w-10 h-10 text-primary/40 mb-6" />

                  {/* Clamped text */}
                  <p className="italic text-base md:text-lg text-foreground leading-relaxed line-clamp-5">

                    "{current.testimonial}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 mt-6 border-t border-border/40">
                    {current.avatar_url ? (
                      <img
                        src={current.avatar_url}
                        alt={current.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/30"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary">
                          {current.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-lg">{current.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {current.role}
                        {current.organization && ` at ${current.organization}`}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={`rounded-full transition-all ${
                  i === currentIndex
                    ? "w-8 h-2 bg-primary"
                    : "w-2 h-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
