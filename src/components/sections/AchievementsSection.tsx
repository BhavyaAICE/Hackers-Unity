import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, Users, Building2, Calendar, ArrowRight, Award, Target, Rocket, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { api } from "@/lib/apiClient";

interface Achievement {
  _id: string;
  category: string | null;
  title: string | null;
  statsValue: string | null;
  statsLabel: string | null;
  displayOrder: number;
  isActive: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  users: Users,
  building2: Building2,
  calendar: Calendar,
  award: Award,
  target: Target,
  rocket: Rocket,
  star: Star,
};

const ACCENT_COLOR = "hsl(var(--primary))";

function useAnimatedCounter(target: number, isInView: boolean, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  useEffect(() => {
    if (!isInView || hasAnimated.current || target === 0) return;
    hasAnimated.current = true;
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;
    const interval = setInterval(() => {
      current++;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (current >= steps) { setCount(target); clearInterval(interval); }
    }, stepDuration);
    return () => clearInterval(interval);
  }, [isInView, target, duration]);
  return count;
}

function parseStatValue(val: string | null): { num: number } {
  if (!val) return { num: 0 };
  const cleaned = val.replace(/,/g, "");
  const match = cleaned.match(/^([\d.]+)\s*([KkMm]?)/);
  if (!match) return { num: 0 };
  let num = parseFloat(match[1]);
  const m = match[2].toUpperCase();
  if (m === "K") num *= 1000;
  else if (m === "M") num *= 1000000;
  return { num };
}

function formatCount(count: number, originalValue: string | null): string {
  if (!originalValue) return "0";
  const cleaned = originalValue.replace(/,/g, "");
  const match = cleaned.match(/^[\d.]+\s*([KkMm]?)\s*(\+?)(.*)$/);
  if (!match) return originalValue;
  const multiplier = match[1].toUpperCase();
  const plus = match[2];
  const rest = match[3];
  if (multiplier === "K") return `${Math.round(count / 1000)}K${plus}${rest}`;
  if (multiplier === "M") return `${(count / 1000000).toFixed(1)}M${plus}${rest}`;
  return `${count}${plus}${rest}`;
}

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const key = achievement.category ?? "default";
  const IconComponent = iconMap[key] ?? Trophy;
  const { num } = parseStatValue(achievement.statsValue);
  const count = useAnimatedCounter(num, isInView);

  // 3D tilt state (from TiltCard)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ rotateX: (0.5 - y) * 20, rotateY: (x - 0.5) * 20 });
    setSpotlight({ x: x * 100, y: y * 100 });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovering(false);
  }, []);

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="min-h-[14rem] list-none"
      style={{ perspective: "1000px" }}
    >
      {/* 3D Tilt wrapper */}
      <motion.div
        ref={cardRef}
        className="relative h-full cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-white/[0.08] p-2 md:rounded-[1.5rem] md:p-3">
          {/* Conic gradient glow border (from Achievements) */}
          <GlowingEffect
            spread={40}
            glow={true}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={3}
          />

          {/* Gradient shimmer border (from Explore Our Programs) */}
          <div
            className={`absolute -inset-[1px] rounded-[inherit] transition-opacity duration-500 ${isHovering ? "opacity-100" : "opacity-0"}`}
            style={{
              background: `linear-gradient(135deg, hsl(var(--primary) / 0.25), transparent 40%, transparent 60%, hsl(var(--primary) / 0.25))`,
              backgroundSize: "200% 200%",
              animation: isHovering ? "shimmer-border 3s ease infinite" : "none",
            }}
          />

          {/* Card inner content */}
          <div className="relative flex h-full flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border-[0.75px] border-white/[0.06] bg-background p-8 shadow-sm">
            {/* Spotlight cursor follow (from Explore Our Programs) */}
            <div
              className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300"
              style={{
                opacity: isHovering ? 1 : 0,
                background: `radial-gradient(500px circle at ${spotlight.x}% ${spotlight.y}%, hsl(var(--primary) / 0.08), transparent 40%)`,
              }}
            />

            {/* Inner radial glow (from Explore Our Programs) */}
            <div
              className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-500"
              style={{
                opacity: isHovering ? 0.6 : 0,
                background: `radial-gradient(ellipse at 50% 100%, hsl(var(--primary) / 0.06), transparent 60%)`,
              }}
            />

            {/* Floating particles (from Explore Our Programs) */}
            {isHovering && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    initial={{ y: "110%" }}
                    animate={{ y: "-10%", opacity: [0, 0.7, 0] }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut",
                    }}
                    style={{
                      left: `${15 + i * 17}%`,
                      backgroundColor: ACCENT_COLOR,
                      opacity: 0.5,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Icon */}
            <motion.div
              className="relative z-10 w-fit rounded-lg border-[0.75px] border-white/[0.08] bg-muted/50 p-3"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <IconComponent className="h-5 w-5 text-primary" />
            </motion.div>

            {/* Number */}
            <motion.span
              className="relative z-10 text-4xl md:text-5xl font-bold font-display text-foreground tracking-tight"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: index * 0.12 + 0.2 }}
            >
              {isInView ? formatCount(count, achievement.statsValue) : "0"}
            </motion.span>

            {/* Label */}
            <span className="relative z-10 text-muted-foreground text-sm uppercase tracking-wider font-medium text-center">
              {achievement.statsLabel}
            </span>
          </div>
        </div>

        {/* Dynamic depth shadow (from Explore Our Programs) */}
        <div
          className="absolute -inset-1 rounded-[1.5rem] -z-10 transition-all duration-300 blur-xl"
          style={{
            opacity: isHovering ? 0.15 : 0,
            background: ACCENT_COLOR,
            transform: `translateX(${tilt.rotateY * 0.5}px) translateY(${-tilt.rotateX * 0.5}px)`,
          }}
        />
      </motion.div>
    </motion.li>
  );
}

const AchievementsSection = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { achievements: data } = await api.get<{ achievements: Achievement[] }>("/api/content/achievements");
        setAchievements(data);
      } catch (err) {
        console.error("Failed to fetch achievements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  if (loading) return null;
  const visible = achievements.filter(a => a.statsValue || a.statsLabel);
  if (visible.length === 0) return null;

  // Determine grid layout based on count
  const getGridClass = () => {
    const count = visible.length;
    if (count <= 2) return "grid-cols-1 sm:grid-cols-2";
    if (count === 3) return "grid-cols-1 sm:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-4";
  };

  return (
    <section className="py-28 relative overflow-hidden" id="achievements">
      {/* Subtle background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, hsl(var(--primary) / 0.03) 0%, transparent 70%)' }}
      />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest inline-flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Our Impact
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mt-4 mb-6">
            Our <span className="text-gradient">Achievements</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Building India's most vibrant tech community, one hackathon at a time
          </p>
        </motion.div>

        {/* EQUAL-SIZE GLOWING CARDS GRID */}
        <ul className={`grid ${getGridClass()} gap-4 max-w-5xl mx-auto mb-16`}>
          {visible.map((achievement, index) => (
            <AchievementCard
              key={achievement._id}
              achievement={achievement}
              index={index}
            />
          ))}
        </ul>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h3 className="text-xl md:text-2xl font-bold font-display mb-3">
            Ready to be part of something <span className="text-gradient">amazing</span>?
          </h3>
          <p className="text-muted-foreground mb-6">
            Join India's fastest-growing tech community and unlock endless opportunities
          </p>
          <a href="https://discord.gg/2ArqYfykBd" target="_blank" rel="noopener noreferrer">
            <Button variant="hero" size="lg" className="group">
              Join Our Community
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;
