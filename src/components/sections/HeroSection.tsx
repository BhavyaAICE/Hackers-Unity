import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import OptimizedImage from "@/components/ui/optimized-image";

interface HeroImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

interface HeroContent {
  badge_text: string;
  heading: string;
  heading_highlight: string;
  subheading: string;
  cta_text: string;
  images: HeroImage[];
}

const defaultContent: HeroContent = {
  badge_text: "Learn | Build | Innovate",
  heading: "Empowering Developers with",
  heading_highlight: "Hacker's Unity",
  subheading: "Hacker's Unity is India's leading tech community, uniting developers, innovators, and technology enthusiasts across the nation. Driven by a mission to empower students with real-world skills and connect them with industry opportunities.",
  cta_text: "Get Started",
  images: [],
};

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [content, setContent] = useState<HeroContent>(defaultContent);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("website_content")
        .select("content")
        .eq("section_key", "hero")
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching hero content:", error);
        return;
      }

      if (data?.content) {
        const heroData = data.content as unknown as HeroContent;
        setContent({
          ...defaultContent,
          ...heroData,
          images: heroData.images || [],
        });
      }
    } catch (error) {
      console.error("Error fetching hero content:", error);
    }
  };

  // Parse badge text to handle styling
  const badgeParts = content.badge_text.split("|").map(part => part.trim());

  // Filter only images that have a valid URL
  const validImages = content.images.filter(img => img.url && img.url.length > 0);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="hero-glow top-1/4 left-0 -translate-x-1/2" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-8 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-6 flex-wrap"
            >
              {badgeParts.map((part, index) => (
                <span key={index} className="flex items-center gap-2">
                  <span className="text-primary font-semibold">{part}</span>
                  {index < badgeParts.length - 1 && (
                    <span className="text-muted-foreground">|</span>
                  )}
                </span>
              ))}
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight mb-2"
            >
              {content.heading}{" "}
              <span className="relative inline-block">
                <span className="text-gradient">{content.heading_highlight}</span>
                <svg 
                  className="absolute -bottom-2 left-0 w-full" 
                  viewBox="0 0 200 12" 
                  fill="none"
                >
                  <defs>
                    <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0EA5E9" />
                      <stop offset="50%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#0EA5E9" />
                    </linearGradient>
                  </defs>
                  <motion.path 
                    d="M2 8C50 2 150 2 198 8" 
                    stroke="url(#underlineGradient)" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed"
            >
              {content.subheading}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button 
                variant="hero" 
                size="xl" 
                className="group"
                onClick={() => {
                  if (isAdmin) {
                    navigate("/admin");
                  } else if (user) {
                    navigate("/dashboard");
                  } else {
                    navigate("/register");
                  }
                }}
              >
                {isAdmin ? "Admin Panel" : user ? "Dashboard" : content.cta_text}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>

          {/* Right Content - Images */}
          <div>
            {validImages.length > 0 ? (
              <div className="flex gap-3 sm:gap-4 md:gap-5 justify-center lg:justify-end items-end">
                {validImages.slice(0, 3).map((image, index) => {
                  const isMiddle = index === 1;
                  const isLast = index === 2;
                  
                  return (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, y: isMiddle ? 60 : isLast ? 30 : 40 }}
                      animate={{ 
                        opacity: 1, 
                        y: isMiddle ? 20 : isLast ? -10 : 0 
                      }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                      className={`relative ${isMiddle ? 'mt-4 sm:mt-6 md:mt-8' : ''}`}
                    >
                      <div className={`
                        ${isLast 
                          ? 'w-[100px] sm:w-32 md:w-40 lg:w-44 xl:w-48 aspect-[3/4]' 
                          : 'w-[100px] sm:w-36 md:w-44 lg:w-52 xl:w-56 aspect-[3/4]'
                        } 
                        rounded-xl sm:rounded-2xl overflow-hidden hero-image-frame
                      `}>
                        <OptimizedImage 
                          src={image.url}
                          alt={image.alt}
                          width={isLast ? 192 : 224}
                          height={isLast ? 256 : 299}
                          className="w-full h-full object-cover object-top"
                          priority={true}
                          type="hero"
                        />
                      </div>
                      {/* Decorative element for first image */}
                      {index === 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.6 }}
                          className="absolute -top-2 -right-2 text-primary"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="sm:w-5 sm:h-5 md:w-6 md:h-6">
                            <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" fill="currentColor"/>
                          </svg>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex gap-3 sm:gap-4 md:gap-5 justify-center lg:justify-end items-end">
                {[0, 1, 2].map((index) => {
                  const isMiddle = index === 1;
                  const isLast = index === 2;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: isMiddle ? 60 : isLast ? 30 : 40 }}
                      animate={{ 
                        opacity: 1, 
                        y: isMiddle ? 20 : isLast ? -10 : 0 
                      }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                      className={`relative ${isMiddle ? 'mt-4 sm:mt-6 md:mt-8' : ''}`}
                    >
                      <div className={`
                        ${isLast 
                          ? 'w-[100px] sm:w-32 md:w-40 lg:w-44 xl:w-48 aspect-[3/4]' 
                          : 'w-[100px] sm:w-36 md:w-44 lg:w-52 xl:w-56 aspect-[3/4]'
                        } 
                        rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-muted/50 flex items-center justify-center border-2 border-dashed border-muted-foreground/20
                      `}>
                        <p className="text-xs text-muted-foreground text-center p-2">
                          Upload images in admin
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on smaller screens */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-3 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
