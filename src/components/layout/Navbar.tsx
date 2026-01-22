import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
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
  checkData?: string; // Table name to check for data
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
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkDataAvailability = async () => {
      // Check events (non-hackathon)
      const { data: eventsData } = await supabase
        .from("events")
        .select("id")
        .neq("event_type", "hackathon")
        .limit(1);

      // Check testimonials
      const { data: testimonialsData } = await supabase
        .from("testimonials")
        .select("id")
        .eq("is_active", true)
        .limit(1);

      const hasEvents = eventsData && eventsData.length > 0;
      const hasTestimonials = testimonialsData && testimonialsData.length > 0;

      // Filter links based on data availability
      const filtered = baseNavLinks.filter((link) => {
        if (link.checkData === "events") return hasEvents;
        if (link.checkData === "testimonials") return hasTestimonials;
        return true;
      });

      setVisibleLinks(filtered);
    };

    checkDataAvailability();
  }, []);

  const handleNavClick = (e: React.MouseEvent, link: NavLink) => {
    setIsOpen(false);

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
        // Navigate to home first, then scroll to section
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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20 relative">
          {/* Logo - Left */}
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-3 group flex-shrink-0">
            <img 
              src={logo} 
              alt="Hacker's Unity" 
              width={48}
              height={48}
              className="h-12 w-auto transition-transform group-hover:scale-105"
            />
          </a>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center justify-center gap-8 absolute left-1/2 -translate-x-1/2">
            {visibleLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium relative group whitespace-nowrap"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium relative group whitespace-nowrap"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              )
            ))}
          </div>

          {/* CTA Buttons / User Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                {isAdmin ? (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Panel
                    </Button>
                  </Link>
                ) : (
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm" className="gap-2">
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
            className="lg:hidden text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="container-custom py-6 flex flex-col gap-4">
              {visibleLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors py-2 font-medium"
                    onClick={(e) => handleNavClick(e, link)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors py-2 font-medium"
                    onClick={(e) => handleNavClick(e, link)}
                  >
                    {link.name}
                  </a>
                )
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
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
