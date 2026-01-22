import { motion } from "framer-motion";
import { ArrowLeft, Users, Rocket, Heart, Globe, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const benefits = [
  {
    icon: Rocket,
    title: "Impactful Work",
    description: "Work on projects that reach thousands of developers across India and beyond.",
  },
  {
    icon: Users,
    title: "Amazing Team",
    description: "Collaborate with passionate individuals who are dedicated to building tech communities.",
  },
  {
    icon: Heart,
    title: "Growth Opportunities",
    description: "Learn from industry experts and grow your skills while making a real difference.",
  },
  {
    icon: Globe,
    title: "Flexible Work",
    description: "Work remotely and manage your own schedule while being part of exciting events.",
  },
];

const roles = [
  {
    title: "Community Manager",
    type: "Volunteer",
    location: "Remote",
    description: "Help grow and manage our community of 10,000+ developers across various platforms.",
  },
  {
    title: "Event Coordinator",
    type: "Volunteer",
    location: "Hybrid",
    description: "Plan and execute hackathons, workshops, and tech events across India.",
  },
  {
    title: "Content Creator",
    type: "Volunteer",
    location: "Remote",
    description: "Create engaging content for social media, blogs, and marketing materials.",
  },
  {
    title: "Technical Lead",
    type: "Volunteer",
    location: "Remote",
    description: "Lead technical workshops and mentor participants during hackathons.",
  },
];

const Careers = () => {
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
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-primary text-sm font-semibold uppercase tracking-wider"
              >
                Join Our Team
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold font-display mt-4 mb-6"
              >
                Build the <span className="text-primary">Future</span> With Us
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                We're always looking for talented individuals who are passionate about technology 
                and community building. Join our team of 20+ core members making an impact.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-24 bg-muted/30">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                Why Join Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4">
                Be Part of Something <span className="text-primary">Amazing</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="glass" className="p-6 h-full text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
                      <benefit.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-24">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                Open Positions
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4 mb-4">
                Current <span className="text-primary">Opportunities</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're a volunteer-driven community. Join us to gain experience, build your network, 
                and make an impact in the tech ecosystem.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {roles.map((role, index) => (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="elevated" className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="font-display font-semibold text-lg">{role.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                        <div className="flex gap-3 mt-3">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {role.type}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                            {role.location}
                          </span>
                        </div>
                      </div>
                      <a
                        href="https://forms.gle/CBN36n3sssEr31Lo8"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="whitespace-nowrap">
                          Apply Now
                          <ArrowUpRight className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-muted/30">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold font-display mb-6">
                Don't See a <span className="text-primary">Perfect Fit?</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                We're always open to passionate individuals who want to contribute. 
                Send us your application and let us know how you'd like to help.
              </p>
              <a
                href="https://forms.gle/CBN36n3sssEr31Lo8"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="hero" size="lg">
                  Submit Your Application
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;
