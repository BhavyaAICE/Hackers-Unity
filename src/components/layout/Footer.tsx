import { useNavigate, useLocation } from "react-router-dom";
import { Linkedin, Instagram, Youtube, Github, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/hackers-unity-logo.png";

const footerLinks = {
  company: [
    { name: "About Us", href: "/about-us", isRoute: true },
    { name: "Workshops", href: "/workshops", isRoute: true },
  ],
  programs: [
    { name: "Hackathons", href: "/hackathons", isRoute: true },
    { name: "Events", href: "#events", isRoute: false },
  ],
  resources: [
    { name: "FAQs", href: "/faqs", isRoute: true },
    { name: "Support", href: "/support", isRoute: true },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy-policy", isRoute: true },
    { name: "Terms of Service", href: "/terms-of-service", isRoute: true },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/hackerunity/posts/?feedView=all", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/hackerunity/", label: "Instagram" },
  { icon: Youtube, href: "http://www.youtube.com/@HackerUnity", label: "YouTube" },
  { icon: Github, href: "https://github.com/Hackers-Unity", label: "GitHub" },
];

interface FooterLink {
  name: string;
  href: string;
  isRoute: boolean;
}

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (e: React.MouseEvent, link: FooterLink) => {
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

  const handleRouteClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    navigate(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderLink = (link: FooterLink) => {
    if (link.isRoute) {
      return (
        <a
          key={link.name}
          href={link.href}
          onClick={(e) => handleRouteClick(e, link.href)}
          className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          {link.name}
        </a>
      );
    }
    return (
      <a
        key={link.name}
        href={link.href}
        onClick={(e) => handleLinkClick(e, link)}
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        {link.name}
      </a>
    );
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container-custom py-12 md:py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-10">
          {/* Brand & Contact Column */}
          <div className="lg:col-span-4 space-y-6">
            <a href="/" onClick={handleLogoClick} className="inline-flex items-center gap-2">
              <img src={logo} alt="Hacker's Unity" width={56} height={56} className="h-12 w-auto" />
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              India's leading tech community empowering developers, innovators, and technology enthusiasts.
            </p>
            
            {/* Contact Details */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <a 
                href="mailto:hackerunity.community@gmail.com" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                hackerunity.community@gmail.com
              </a>
              <a 
                href="tel:+918852924002" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                +91 8852924002
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4 text-sm">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>{renderLink(link)}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-foreground mb-4 text-sm">Programs</h4>
              <ul className="space-y-3">
                {footerLinks.programs.map((link) => (
                  <li key={link.name}>{renderLink(link)}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-foreground mb-4 text-sm">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>{renderLink(link)}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-foreground mb-4 text-sm">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>{renderLink(link)}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Discord & Social Column */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4 text-sm">Join Our Community</h4>
              <Button
                asChild
                className="bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,55%)] text-white gap-2 w-full sm:w-auto"
              >
                <a 
                  href="https://discord.gg/hackersunity" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <DiscordIcon className="w-5 h-5" />
                  Join Discord
                </a>
              </Button>
            </div>
            
            {/* Social Links */}
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4 text-sm">Follow Us</h4>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center lg:text-left">
            © 2025 Hacker's Unity. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
