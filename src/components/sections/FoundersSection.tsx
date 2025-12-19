import { motion } from "framer-motion";
import { Linkedin, Instagram } from "lucide-react";
import jhasurajImg from "@/assets/founders/jha-suraj-kumar.jpg";
import chinmayImg from "@/assets/founders/chinmay-bhatt.jpg";

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const founders = [
  {
    name: "Jha Suraj Kumar",
    role: "Founder",
    image: jhasurajImg,
    description: "Tech entrepreneur with experience in building communities and organizing 15+ hackathons and 50+ Technical Workshops",
    socials: {
      linkedin: "https://www.linkedin.com/in/jha-surajkumar/",
      x: "https://x.com/jhasurajkumar",
      instagram: "https://www.instagram.com/suraj.lov_07"
    }
  },
  {
    name: "Chinmay Bhatt",
    role: "Co-Founder",
    image: chinmayImg,
    description: "Tech entrepreneur with experience in organizing 4+ hackathons and 5+ Technical Workshops",
    socials: {
      linkedin: "https://www.linkedin.com/in/chinmaybhattt/",
      x: "https://x.com/chinmaybhattt",
      instagram: "https://www.instagram.com/chinmaybhattt"
    }
  }
];

const FoundersSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-foreground mb-4">
            Meet Our Founders
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The visionaries behind Hacker's Unity who are dedicated to empowering the tech community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          {founders.map((founder, index) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 pt-10 text-center hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                {/* Profile Image */}
                <div className="relative mx-auto mb-8 w-40 h-40 md:w-48 md:h-48">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary/80 to-accent p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-background">
                      <img
                        src={founder.image}
                        alt={founder.name}
                        width={192}
                        height={192}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  {/* Role Badge */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
                      {founder.role}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-xl md:text-2xl font-bold font-display text-foreground mt-4 mb-3">
                  {founder.name}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 px-2">
                  {founder.description}
                </p>

                {/* Social Links */}
                <div className="flex justify-center gap-4">
                  <a
                    href={founder.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                    aria-label={`${founder.name}'s LinkedIn`}
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={founder.socials.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                    aria-label={`${founder.name}'s X`}
                  >
                    <XIcon className="w-5 h-5" />
                  </a>
                  <a
                    href={founder.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                    aria-label={`${founder.name}'s Instagram`}
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
