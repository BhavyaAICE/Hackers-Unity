import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { api } from "@/lib/apiClient";
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
  subheading: "India's leading tech community uniting developers, innovators, and technology enthusiasts. Empowering students with real-world skills and industry opportunities.",
  cta_text: "Get Started",
  images: [],
};

/* ──────────────────────────────────────────────
   PROCEDURAL GROUND BACKGROUND (WebGL)
   Topographic neon lines + sand-ripple movement
   - Integrated from 21st.dev/saifyxpro responsive-hero-banner
   ────────────────────────────────────────────── */
function AnimatedGradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        
        // Ground Perspective Simulation
        float depth = 1.0 / (uv.y + 1.15);
        vec2 gridUv = vec2(uv.x * depth, depth + u_time * 0.15);
        
        // Layered Procedural Noise for Terrain
        float n = noise(gridUv * 3.5);
        float ripples = sin(gridUv.y * 18.0 + n * 8.0 + u_time * 0.5);
        
        // Neon Topographic Lines
        float topoLine = smoothstep(0.03, 0.0, abs(ripples));
        
        // Color Palette
        vec3 baseColor = vec3(0.04, 0.03, 0.12); // Deep Space
        vec3 accentColor = vec3(0.1, 0.3, 0.8);   // Electric Blue
        vec3 neonColor = vec3(0.6, 0.2, 1.0);     // Neon Purple
        
        // Composite
        vec3 finalColor = mix(baseColor, accentColor, n * 0.6);
        finalColor += topoLine * neonColor * depth * 0.4;
        
        // Horizon Fog / Fade
        float fade = smoothstep(0.1, -1.0, uv.y);
        finalColor *= (1.0 - length(uv) * 0.45) * (1.0 - fade);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const posAttrib = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc = gl.getUniformLocation(program, "u_resolution");

    let animationFrameId: number;
    let lastTime = 0;
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let paused = false;

    const onVisibility = () => {
      paused = document.hidden;
      if (!paused) animationFrameId = requestAnimationFrame(render);
    };
    document.addEventListener("visibilitychange", onVisibility);

    const render = (time: number) => {
      if (paused) return;
      if (time - lastTime < FRAME_INTERVAL) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastTime = time;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }

      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none"
        style={{ filter: 'contrast(1.1) brightness(0.9)' }}
      />
      {/* Edge vignette for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, hsl(var(--background) / 0.6) 100%)',
        }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────
   NEON BUTTON
   Clean neon-bordered button with glow hover
   - Inspired by cybergaz/neon-button from 21st.dev
   ────────────────────────────────────────────── */
function NeonButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`neon-btn group relative inline-flex items-center gap-2
        px-8 py-4 rounded-full text-lg font-semibold
        text-foreground cursor-pointer
        transition-all duration-300
        ${className}`}
    >
      {children}
    </button>
  );
}

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
      const { content: data } = await api.get<{ content: { id: string; content: HeroContent } | null }>("/api/content/hero");
      if (data?.content) {
        setContent({
          ...defaultContent,
          ...data.content,
          images: data.content.images || [],
        });
      }
    } catch (error) {
      console.error("Error fetching hero content:", error);
    }
  };

  const badgeParts = content.badge_text.split("|").map(part => part.trim());
  const validImages = content.images.filter(img => img.url && img.url.length > 0);

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-28 pb-20">
      {/* ANIMATED GRADIENT BACKGROUND */}
      <AnimatedGradientBackground />

      {/* === CONTENT === */}
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full border border-primary/15 bg-primary/5 backdrop-blur-sm"
          >
            <Zap className="w-3.5 h-3.5 text-primary" />
            {badgeParts.map((part, index) => (
              <span key={index} className="flex items-center gap-3">
                <span className="text-primary font-medium text-sm tracking-wide">{part}</span>
                {index < badgeParts.length - 1 && (
                  <span className="w-1 h-1 rounded-full bg-primary/40" />
                )}
              </span>
            ))}
          </motion.div>

          {/* Heading with glow */}
          <div className="relative">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[120px] pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse, hsl(var(--primary) / 0.12) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.1] mb-6"
            >
              {content.heading}{" "}
              <br className="hidden sm:block" />
              <span className="relative inline-block mt-2">
                <span className="text-gradient">{content.heading_highlight}</span>
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), transparent)',
                  }}
                  initial={{ scaleX: 0, transformOrigin: 'left' }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </span>
            </motion.h1>
          </div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {content.subheading}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center mb-16"
          >
            {/* NEON BUTTON — Primary CTA */}
            <NeonButton
              onClick={() => {
                if (isAdmin) navigate("/admin");
                else if (user) navigate("/dashboard");
                else navigate("/register");
              }}
            >
              {isAdmin ? "Admin Panel" : user ? "Dashboard" : content.cta_text}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </NeonButton>

            <a href="https://discord.gg/2ArqYfykBd" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="xl"
                className="border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all"
              >
                Join Discord
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Image Showcase */}
        {validImages.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4 md:gap-6 justify-center items-center max-w-5xl mx-auto"
          >
            {validImages.slice(0, 3).map((image, index) => (
              <motion.div
                key={image.id}
                className="relative group"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className={`
                  ${index === 1
                    ? 'w-[140px] sm:w-[200px] md:w-[260px] lg:w-[320px] aspect-[4/3]'
                    : 'w-[120px] sm:w-[160px] md:w-[220px] lg:w-[260px] aspect-[4/3]'
                  }
                  rounded-xl md:rounded-2xl overflow-hidden
                  ring-1 ring-white/10 group-hover:ring-primary/30
                  transition-all duration-500
                  ${index === 1 ? 'shadow-2xl shadow-primary/10' : 'shadow-xl shadow-black/20'}
                `}>
                  <OptimizedImage
                    src={image.url}
                    alt={image.alt}
                    width={index === 1 ? 320 : 260}
                    height={index === 1 ? 240 : 195}
                    className="w-full h-full object-cover"
                    priority={true}
                    type="hero"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4 md:gap-6 justify-center items-center max-w-5xl mx-auto"
          >
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`
                  ${index === 1
                    ? 'w-[140px] sm:w-[200px] md:w-[260px] lg:w-[320px] aspect-[4/3]'
                    : 'w-[120px] sm:w-[160px] md:w-[220px] lg:w-[260px] aspect-[4/3]'
                  }
                  rounded-xl md:rounded-2xl bg-muted/30 border border-dashed border-muted-foreground/20
                  flex items-center justify-center
                `}
              >
                <p className="text-xs text-muted-foreground text-center px-3">Upload images in admin</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/20 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-3 bg-primary/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
