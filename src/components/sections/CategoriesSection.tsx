import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, BookOpen, Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import EditableText from "@/components/editor/EditableText";
import EditableLink from "@/components/editor/EditableLink";

const categories = [
  {
    icon: Trophy,
    title: "Hackathons",
    description: "Compete in coding challenges, build innovative solutions, and win exciting prizes",
    color: "from-primary to-cyan-400",
    accentColor: "#0EA5E9",
    href: "/hackathons",
    isRoute: true,
  },
  {
    icon: BookOpen,
    title: "Developer Programs",
    description: "Accelerate your career with industry-led training programs and certifications",
    color: "from-secondary to-blue-400",
    accentColor: "#2563EB",
    href: "#programs",
    isRoute: false,
  },
  {
    icon: Users,
    title: "Workshops",
    description: "Hands-on sessions covering the latest technologies from AI to Web3",
    color: "from-accent to-pink-400",
    accentColor: "#A855F7",
    href: "/workshops",
    isRoute: true,
  },
  {
    icon: Globe,
    title: "Community",
    description: "Connect with 100K+ developers, share knowledge, and grow together",
    color: "from-emerald-400 to-teal-500",
    accentColor: "#10B981",
    href: "https://discord.gg/BmMJFpPe9T",
    isRoute: false,
    isExternal: true,
  },
];

// 3D Tilt Card Component
function TiltCard({ children, accentColor }: { children: React.ReactNode; accentColor: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Tilt: ±12 degrees
      setTilt({
        rotateX: (0.5 - y) * 24,
        rotateY: (x - 0.5) * 24,
      });

      // Spotlight position
      setSpotlight({ x: x * 100, y: y * 100 });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovering(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  return (
    <div className="perspective-1000" style={{ perspective: "1000px" }}>
      <motion.div
        ref={cardRef}
        className="relative preserve-3d cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Gradient shimmer border */}
        <div
          className={`
            absolute -inset-[1px] rounded-2xl opacity-0 transition-opacity duration-500
            ${isHovering ? 'opacity-100' : ''}
          `}
          style={{
            background: `linear-gradient(135deg, ${accentColor}40, transparent 40%, transparent 60%, ${accentColor}40)`,
            backgroundSize: '200% 200%',
            animation: isHovering ? 'shimmer-border 3s ease infinite' : 'none',
          }}
        />

        {/* Card body */}
        <div className="relative rounded-2xl bg-card/30 backdrop-blur-xl border border-white/[0.06] overflow-hidden">
          {/* Spotlight cursor follow */}
          <div
            className="card-spotlight absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-2xl"
            style={{
              opacity: isHovering ? 1 : 0,
              background: `radial-gradient(600px circle at ${spotlight.x}% ${spotlight.y}%, ${accentColor}15, transparent 40%)`,
            }}
          />

          {/* Inner radial glow */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-2xl"
            style={{
              opacity: isHovering ? 0.6 : 0,
              background: `radial-gradient(ellipse at 50% 100%, ${accentColor}10, transparent 60%)`,
            }}
          />

          {/* Floating particles */}
          {isHovering && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  initial={{
                    y: '110%',
                  }}
                  animate={{
                    y: '-10%',
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeOut",
                  }}
                  style={{
                    left: `${20 + i * 20}%`,
                    backgroundColor: accentColor,
                    opacity: 0.4,
                  }}
                />
              ))}
            </div>
          )}

          {children}
        </div>

        {/* Dynamic depth shadow */}
        <div
          className="absolute -inset-1 rounded-2xl -z-10 transition-all duration-300 blur-xl"
          style={{
            opacity: isHovering ? 0.2 : 0,
            background: accentColor,
            transform: `translateX(${tilt.rotateY * 0.5}px) translateY(${-tilt.rotateX * 0.5}px)`,
          }}
        />
      </motion.div>
    </div>
  );
}

const CategoriesSection = () => {
  return (
    <section className="py-24 relative" id="categories">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />

      <div className="container-custom relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-semibold uppercase tracking-wider"
          >
            <EditableText contentKey="categories.subtitle" defaultValue="What We Offer" />
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mt-4 mb-6"
          >
            <EditableText contentKey="categories.heading1" defaultValue="Explore Our " />{" "}
            <span className="text-gradient">
              <EditableText contentKey="categories.heading2" defaultValue="Programs" />
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            <EditableText contentKey="categories.description" defaultValue="From hackathons to mentorship, discover opportunities that will accelerate your tech career" />
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const cardContent = (
              <div className="p-6 h-full relative z-10">
                <motion.div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-5 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <category.icon className="w-7 h-7 text-white" />
                </motion.div>
                <EditableText
                  contentKey={`categories.${index}.title`}
                  defaultValue={category.title}
                  as="h3"
                  className="text-xl font-display font-semibold mb-3 text-foreground group-hover:text-primary transition-colors"
                />
                <EditableText
                  contentKey={`categories.${index}.description`}
                  defaultValue={category.description}
                  as="p"
                  className="text-muted-foreground text-sm leading-relaxed mb-4"
                />
                <div className="flex items-center text-primary text-sm font-medium">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group"
              >
                <EditableLink contentKey={`categories.${index}.href`} defaultHref={category.href}>
                  {(href, editProps) => {
                    const wrapped = (
                      <TiltCard accentColor={category.accentColor}>
                        {cardContent}
                      </TiltCard>
                    );

                    if (Object.keys(editProps).length > 0) {
                      return <div {...editProps}>{wrapped}</div>;
                    }
                    if (category.isRoute) {
                      return (
                        <Link to={href} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                          {wrapped}
                        </Link>
                      );
                    }
                    if (category.isExternal) {
                      return <a href={href} target="_blank" rel="noopener noreferrer">{wrapped}</a>;
                    }
                    return <a href={href}>{wrapped}</a>;
                  }}
                </EditableLink>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
