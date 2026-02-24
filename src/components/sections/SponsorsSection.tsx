import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/apiClient";
import type { ApiSponsor } from "@/types/api.types";


const SponsorsSection = () => {
  const [sponsors, setSponsors] = useState<ApiSponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const { sponsors: data } = await api.get<{ sponsors: ApiSponsor[] }>("/api/content/sponsors");
        setSponsors(data);
      } catch (err) {
        console.error("Failed to fetch sponsors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  if (loading) {
    return null;
  }

  if (sponsors.length === 0) {
    return null;
  }

  const getLogoUrl = (logoUrl: string) => logoUrl;
  const allSponsors = [...sponsors, ...sponsors, ...sponsors];
  return (
    <section className="py-24 overflow-hidden" id="sponsors">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Our Partners
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mt-4 mb-6"
          >
            Backed by <span className="text-primary">Amazing Sponsors</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            We're proud to partner with industry leaders who share our vision of empowering the next generation of developers
          </motion.p>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <motion.div
          className="flex gap-8 md:gap-12 py-8"
          animate={{
            x: [0, -1920],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {allSponsors.map((sponsor, index) => {
            const sponsorElement = (
              <div className="glass-card px-8 py-6 md:px-12 md:py-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex items-center justify-center min-w-[200px] md:min-w-[280px]">
                <img
                  src={getLogoUrl(sponsor.logoUrl)}
                  alt={sponsor.name}
                  width={200}
                  height={96}
                  loading="lazy"
                  decoding="async"
                  className="max-h-16 md:max-h-24 w-auto object-contain filter brightness-100 group-hover:brightness-110 transition-all duration-300"
                />
              </div>
            );

            return (
              <div
                key={`${sponsor._id}-${index}`}
                className="flex-shrink-0 group"
              >
                {sponsor.websiteUrl ? (
                  <a
                    href={sponsor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {sponsorElement}
                  </a>
                ) : (
                  sponsorElement
                )}
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="container-custom mt-16">
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center glass-card p-8 md:p-12 max-w-3xl mx-auto rounded-2xl"
        >
          <h3 className="text-2xl font-bold font-display mb-4">
            Become a <span className="text-primary">Sponsor</span>
          </h3>
          <p className="text-muted-foreground mb-6">
            Partner with Hacker's Unity and connect with 10,000+ passionate developers, students, and tech enthusiasts across India. Gain brand visibility and support the future of tech innovation.
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdS8optJDKRZMdMpOwkH_QrKQUKLSGwEWW7YzQaB7wx2YrIXQ/viewform"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="hero" size="lg" className="group">
              Be Our Sponsor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorsSection;