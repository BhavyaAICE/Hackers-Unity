import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { api } from "@/lib/apiClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/hackers-unity-logo.png";

interface NavLink {
  name: string;
  href: string;
  isRoute: boolean;
  checkData?: string;
}

const baseNavLinks: NavLink[] = [
  { name: "Home", href: "/", isRoute: true },
  { name: "Achievements", href: "#achievements", isRoute: false },
  { name: "Events", href: "#events", isRoute: false, checkData: "events" },
  { name: "Hackathons", href: "#hackathons", isRoute: false },
  { name: "Sponsors", href: "#sponsors", isRoute: false },
  { name: "Testimonials", href: "#testimonials", isRoute: false, checkData: "testimonials" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleLinks, setVisibleLinks] = useState<NavLink[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navRefs = useRef<(HTMLElement | null)[]>([]);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  // Track scroll state for ambient glow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkDataAvailability = async () => {
      try {
        const [eventsRes, testimonialsRes] = await Promise.allSettled([
          api.get<{ events: any[] }>("/api/events?limit=1"),
          api.get<{ testimonials: any[] }>("/api/content/testimonials"),
        ]);

        const hasEvents = eventsRes.status === 'fulfilled' &&
          eventsRes.value.events?.filter(e => e.eventType !== 'hackathon').length > 0;
        const hasTestimonials = testimonialsRes.status === 'fulfilled' &&
          testimonialsRes.value.testimonials?.length > 0;

        const filtered = baseNavLinks.filter((link) => {
          if (link.checkData === "events") return hasEvents;
          if (link.checkData === "testimonials") return hasTestimonials;
          return true;
        });
        setVisibleLinks(filtered);
      } catch {
        setVisibleLinks(baseNavLinks);
      }
    };
    checkDataAvailability();
  }, []);

  const handleNavClick = (e: React.MouseEvent, link: NavLink, index: number) => {
    setIsOpen(false);
    setActiveIndex(index);

    if (link.name === "Home" || link.name === "About Us") {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (!link.isRoute && link.href.startsWith("#")) {
      e.preventDefault();
      const sectionId = link.href.substring(1);

      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Get position of active nav item for the morphing pill
  const getActiveStyle = () => {
    const el = navRefs.current[activeIndex];
    if (!el) return {};
    return {
      left: el.offsetLeft - 8,
      width: el.offsetWidth + 16,
    };
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
    >
      <div
        className={`
          relative flex items-center justify-between gap-4
          px-6 h-16 rounded-2xl
          bg-background/60 backdrop-blur-2xl
          border border-white/[0.08]
          shadow-lg shadow-black/20
          transition-all duration-500
          max-w-5xl w-full
          ${scrolled ? 'shadow-primary/10 border-primary/20 bg-background/80' : ''}
        `}
      >
        {/* Ambient glow on scroll — always mounted, opacity animated to avoid logo blink */}
        <motion.div
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none"
        />

        {/* Logo */}
        <a href="/" onClick={handleLogoClick} className="flex items-center gap-3 group flex-shrink-0 relative z-10">
          <img
            src={logo}
            alt="Hacker's Unity"
            width={40}
            height={40}
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 relative">
          {/* Morphing active pill indicator */}
          {visibleLinks.length > 0 && (
            <motion.div
              className="absolute h-8 bg-primary/15 rounded-lg border border-primary/20"
              initial={false}
              animate={getActiveStyle()}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}

          {visibleLinks.map((link, index) => (
            link.isRoute ? (
              <Link
                key={link.name}
                to={link.href}
                ref={(el) => { navRefs.current[index] = el; }}
                onClick={(e) => handleNavClick(e, link, index)}
                className={`
                  relative px-3 py-1.5 text-sm font-medium whitespace-nowrap
                  transition-colors duration-300 rounded-lg
                  ${activeIndex === index ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                ref={(el) => { navRefs.current[index] = el; }}
                onClick={(e) => handleNavClick(e, link, index)}
                className={`
                  relative px-3 py-1.5 text-sm font-medium whitespace-nowrap
                  transition-colors duration-300 rounded-lg
                  ${activeIndex === index ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                {link.name}
              </a>
            )
          ))}
        </div>

        {/* CTA Buttons / User Menu */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0 relative z-10">
          {user ? (
            <>
              {isAdmin ? (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="gap-2 border-purple-500/30 hover:border-purple-500/50">
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Panel
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="gap-2 border-purple-500/30 hover:border-purple-500/50">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="hero" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-foreground p-2 relative z-10"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-4 right-4 lg:hidden bg-background/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/30 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-1">
              {visibleLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="block text-muted-foreground hover:text-foreground hover:bg-purple-500/10 transition-colors py-2.5 px-4 rounded-xl font-medium"
                      onClick={(e) => handleNavClick(e, link, index)}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="block text-muted-foreground hover:text-foreground hover:bg-purple-500/10 transition-colors py-2.5 px-4 rounded-xl font-medium"
                      onClick={(e) => handleNavClick(e, link, index)}
                    >
                      {link.name}
                    </a>
                  )}
                </motion.div>
              ))}
              <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-white/[0.08]">
                {user ? (
                  <>
                    {isAdmin && (
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/admin" onClick={() => setIsOpen(false)}>
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/profile" onClick={() => setIsOpen(false)}>
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button variant="hero" className="w-full">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
