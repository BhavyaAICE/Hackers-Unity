import { motion } from "framer-motion";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is Hacker's Unity?",
        a: "Hacker's Unity is India's leading tech community, uniting developers, innovators, and technology enthusiasts across the nation. Founded in 2025, we're driven by a mission to empower students with real-world skills and connect them with industry opportunities through hackathons, workshops, and events.",
      },
      {
        q: "How can I join Hacker's Unity?",
        a: "You can join our community by visiting our Discord server or registering on our platform. Membership is free and open to all tech enthusiasts, students, and professionals interested in learning and growing together.",
      },
      {
        q: "Is Hacker's Unity only for experienced developers?",
        a: "Not at all! We welcome everyone from complete beginners to experienced professionals. Our events and workshops are designed to cater to different skill levels, and our community is supportive of learners at all stages.",
      },
    ],
  },
  {
    category: "Hackathons",
    questions: [
      {
        q: "How do I participate in hackathons?",
        a: "To participate in our hackathons, visit our Hackathons page or check our upcoming events. Most registrations happen through platforms like Devfolio or DoraHacks. You can participate individually or form teams based on the event requirements.",
      },
      {
        q: "Do I need a team to participate?",
        a: "It depends on the hackathon. Some allow individual participation while others require teams of 2-6 members. If you don't have a team, you can find teammates through our Discord community or team-finding channels on the hackathon platform.",
      },
      {
        q: "Are the hackathons online or offline?",
        a: "We organize both online and offline hackathons. Online hackathons are accessible globally, while offline events like HACKSTROM are held at physical venues in India with accommodation and food facilities.",
      },
      {
        q: "What kind of projects can I build?",
        a: "Projects vary based on hackathon themes and sponsor challenges. Common tracks include AI/ML, Web3, FinTech, EdTech, Healthcare, and Open Innovation. We encourage innovative solutions that address real-world problems.",
      },
    ],
  },
  {
    category: "Workshops & Events",
    questions: [
      {
        q: "Are the workshops free?",
        a: "Most of our community workshops are free or have nominal fees. Some specialized training programs may have associated costs. Check individual event details for specific pricing information.",
      },
      {
        q: "Can I host a workshop at my college?",
        a: "Yes! We partner with educational institutions to conduct workshops. Visit our Workshops page to submit an inquiry, and our team will get in touch to discuss possibilities.",
      },
      {
        q: "Do I get certificates for participating?",
        a: "Yes, participants receive certificates for hackathons, workshops, and other events. Winners and top performers also receive special recognition certificates.",
      },
    ],
  },
  {
    category: "Partnerships & Sponsorships",
    questions: [
      {
        q: "How can my company sponsor Hacker's Unity?",
        a: "We offer various sponsorship packages for our events and hackathons. Companies can sponsor as Title Sponsor, Principal Sponsor, Track Partner, or In-Kind Sponsor. Contact us at hackerunity.community@gmail.com for sponsorship inquiries.",
      },
      {
        q: "Can my organization become a community partner?",
        a: "Yes! We welcome partnerships with tech communities, educational institutions, and organizations aligned with our mission. Reach out to discuss collaboration opportunities.",
      },
      {
        q: "What benefits do sponsors receive?",
        a: "Sponsors get visibility among our 10,000+ community members, logo placement at events, speaking opportunities, access to talent pool for hiring, and dedicated marketing support.",
      },
    ],
  },
];

const FAQs = () => {
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              >
                <HelpCircle className="w-4 h-4" />
                Have Questions?
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold font-display mb-6"
              >
                Frequently Asked <span className="text-primary">Questions</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                Find answers to common questions about Hacker's Unity, our events, and how to get involved.
              </motion.p>
            </div>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-24">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto space-y-12">
              {faqs.map((section, sectionIndex) => (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: sectionIndex * 0.1 }}
                >
                  <h2 className="text-2xl font-display font-bold mb-6 text-primary">
                    {section.category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {section.questions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${section.category}-${index}`}
                        className="border border-border rounded-lg px-6 data-[state=open]:bg-muted/30"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium text-foreground">{faq.q}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
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
                Still Have <span className="text-primary">Questions?</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Can't find what you're looking for? Our team is here to help. 
                Reach out to us and we'll get back to you as soon as possible.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/#contact";
                    setTimeout(() => {
                      const contactSection = document.getElementById("contact");
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }, 100);
                  }}
                >
                  <Button variant="hero" size="lg">Contact Us</Button>
                </a>
                <a href="https://discord.gg/BmMJFpPe9T" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg">Join Discord</Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQs;
