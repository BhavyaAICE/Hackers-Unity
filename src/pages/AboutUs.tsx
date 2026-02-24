import { motion } from "framer-motion";
import { ArrowLeft, Users, Target, Rocket, Globe, Trophy, Calendar, Building2, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import founderSuraj from "@/assets/founders/jha-suraj-kumar.jpg";
import founderChinmay from "@/assets/founders/chinmay-bhatt.jpg";
import EditableText from "@/components/editor/EditableText";
import EditableLink from "@/components/editor/EditableLink";

const stats = [
  { icon: Users, value: "10,000+", label: "Community Members" },
  { icon: Trophy, value: "8+", label: "Hackathons Organized" },
  { icon: Calendar, value: "15+", label: "Events Conducted" },
  { icon: Building2, value: "11+", label: "Partner Companies" },
];

const values = [
  { icon: Target, title: "Mission", description: "To empower students and developers with real-world skills and connect them with industry opportunities through hands-on experiences." },
  { icon: Rocket, title: "Vision", description: "To build India's most impactful tech community that bridges the gap between learning and industry, creating pathways for the next generation of innovators." },
  { icon: Heart, title: "Values", description: "Innovation, Collaboration, Inclusivity, and Continuous Learning form the foundation of everything we do at Hacker's Unity." },
  { icon: Globe, title: "Impact", description: "From organizing hackathons to conducting workshops across 20+ cities, we're making technology accessible and exciting for everyone." },
];

const founders = [
  {
    name: "Jha Suraj Kumar",
    role: "Founder",
    image: founderSuraj,
    bio: "Tech entrepreneur with experience in building communities and organizing 15+ hackathons and 50+ Technical Workshops. Passionate about empowering the next generation of developers.",
    linkedin: "https://www.linkedin.com/in/jhasurajkumar/",
  },
  {
    name: "Chinmay Bhatt",
    role: "Co-Founder",
    image: founderChinmay,
    bio: "Tech entrepreneur with experience in organizing 4+ hackathons and 5+ Technical Workshops. AI-ML enthusiast and MERN Stack Developer driving innovation.",
    linkedin: "https://www.linkedin.com/in/chinmaybhattt/",
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          
          <div className="container-custom relative">
            <Link to="/">
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <div className="max-w-4xl mx-auto text-center">
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary text-sm font-semibold uppercase tracking-wider">
                <EditableText contentKey="about.hero.subtitle" defaultValue="About Us" />
              </motion.span>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-bold font-display mt-4 mb-6">
                <EditableText contentKey="about.hero.heading1" defaultValue="India's Leading " />
                <span className="text-primary">
                  <EditableText contentKey="about.hero.heading2" defaultValue="Tech Community" />
                </span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                <EditableText contentKey="about.hero.description" defaultValue="Hacker's Unity is a community for tech lovers, developers, and innovators worldwide. We bring people together to learn, share ideas, and grow through hackathons, workshops, and events. Founded in 2025, we're driven by a mission to empower students with real-world skills." />
              </motion.p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <Card variant="glass" className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <EditableText contentKey={`about.stats.${index}.value`} defaultValue={stat.value} as="div" className="text-3xl font-bold font-display text-foreground mb-1" />
                    <EditableText contentKey={`about.stats.${index}.label`} defaultValue={stat.label} as="div" className="text-sm text-muted-foreground" />
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-24">
          <div className="container-custom">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                <EditableText contentKey="about.values.subtitle" defaultValue="What Drives Us" />
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4">
                <EditableText contentKey="about.values.heading1" defaultValue="Our " />
                <span className="text-primary">
                  <EditableText contentKey="about.values.heading2" defaultValue="Mission & Values" />
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div key={value.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <Card variant="elevated" className="p-8 h-full">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center mb-6">
                      <value.icon className="w-7 h-7 text-primary" />
                    </div>
                    <EditableText contentKey={`about.values.${index}.title`} defaultValue={value.title} as="h3" className="text-xl font-display font-semibold mb-3" />
                    <EditableText contentKey={`about.values.${index}.description`} defaultValue={value.description} as="p" className="text-muted-foreground leading-relaxed" />
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-24 bg-muted/30">
          <div className="container-custom">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                <EditableText contentKey="about.whatwedo.subtitle" defaultValue="What We Do" />
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4 mb-6">
                <EditableText contentKey="about.whatwedo.heading1" defaultValue="Building the " />
                <span className="text-primary">
                  <EditableText contentKey="about.whatwedo.heading2" defaultValue="Future of Tech" />
                </span>
              </h2>
              <EditableText contentKey="about.whatwedo.description" defaultValue="Through our diverse programs and events, we create opportunities for developers to learn, connect, and grow in the tech ecosystem." as="p" className="text-muted-foreground max-w-2xl mx-auto" />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Trophy, titleKey: "about.wwd.0.title", titleDefault: "Hackathons", descKey: "about.wwd.0.desc", descDefault: "We organize national and global hackathons including HACKSTROM, BlockseBlock, and HackAryaVerse, providing platforms for innovation with exciting prizes and opportunities." },
                { icon: Calendar, titleKey: "about.wwd.1.title", titleDefault: "Workshops & Events", descKey: "about.wwd.1.desc", descDefault: "From AI/ML to Web3, we conduct hands-on workshops and tech events across India, including participation in India Blockchain Month spanning 20+ cities." },
                { icon: Users, titleKey: "about.wwd.2.title", titleDefault: "Community Building", descKey: "about.wwd.2.desc", descDefault: "With 10,000+ community members and partnerships with leading tech companies, we're creating a vibrant ecosystem for developers to thrive." },
              ].map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <Card variant="neon" className="p-8 h-full">
                    <item.icon className="w-10 h-10 text-primary mb-6" />
                    <EditableText contentKey={item.titleKey} defaultValue={item.titleDefault} as="h3" className="text-xl font-display font-semibold mb-3" />
                    <EditableText contentKey={item.descKey} defaultValue={item.descDefault} as="p" className="text-muted-foreground" />
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Founders */}
        <section className="py-24">
          <div className="container-custom">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                <EditableText contentKey="about.founders.subtitle" defaultValue="Leadership" />
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4">
                <EditableText contentKey="about.founders.heading1" defaultValue="Meet Our " />
                <span className="text-primary">
                  <EditableText contentKey="about.founders.heading2" defaultValue="Founders" />
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {founders.map((founder, index) => (
                <motion.div key={founder.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <Card variant="elevated" className="p-8 text-center">
                    <img src={founder.image} alt={founder.name} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover ring-4 ring-primary/20" />
                    <span className="text-primary text-sm font-medium">
                      <EditableText contentKey={`about.founder.${index}.role`} defaultValue={founder.role} />
                    </span>
                    <EditableText contentKey={`about.founder.${index}.name`} defaultValue={founder.name} as="h3" className="text-xl font-display font-semibold mt-2 mb-3" />
                    <EditableText contentKey={`about.founder.${index}.bio`} defaultValue={founder.bio} as="p" className="text-muted-foreground text-sm mb-4" />
                    <EditableLink contentKey={`about.founder.${index}.linkedin`} defaultHref={founder.linkedin}>
                      {(href, editProps) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:underline text-sm" {...editProps}>
                          Connect on LinkedIn
                        </a>
                      )}
                    </EditableLink>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-muted/30">
          <div className="container-custom text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mb-6">
                <EditableText contentKey="about.cta.heading1" defaultValue="Ready to Join the " />
                <span className="text-primary">
                  <EditableText contentKey="about.cta.heading2" defaultValue="Revolution?" />
                </span>
              </h2>
              <EditableText contentKey="about.cta.description" defaultValue="Become part of India's fastest-growing tech community. Connect with developers, participate in hackathons, and accelerate your career." as="p" className="text-muted-foreground max-w-2xl mx-auto mb-8" />
              <div className="flex flex-wrap justify-center gap-4">
                <EditableLink contentKey="about.cta.discord" defaultHref="https://discord.gg/BmMJFpPe9T">
                  {(href, editProps) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" {...editProps}>
                      <Button variant="hero" size="lg">Join Our Community</Button>
                    </a>
                  )}
                </EditableLink>
                <Link to="/hackathons">
                  <Button variant="outline" size="lg">Explore Hackathons</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
