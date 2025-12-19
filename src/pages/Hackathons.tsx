import { motion } from "framer-motion";
import { 
  Lightbulb, 
  Users, 
  Rocket, 
  Brain, 
  Target, 
  Trophy, 
  Briefcase,
  Award,
  GraduationCap,
  Building2,
  Handshake,
  Code,
  ClipboardList,
  UsersRound,
  BookOpen,
  Presentation,
  Medal,
  PartyPopper
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.png";

const whyHackathonsData = [
  { icon: Lightbulb, title: "Upskilling", color: "text-yellow-500" },
  { icon: Users, title: "Networking", color: "text-red-500" },
  { icon: Rocket, title: "Innovation", color: "text-red-500" },
  { icon: Brain, title: "Problem Solving", color: "text-red-500" },
  { icon: Target, title: "Team Spirit", color: "text-yellow-500" },
  { icon: Trophy, title: "Entrepreneurship", color: "text-yellow-500" },
  { icon: Briefcase, title: "Job Opportunities", color: "text-red-500" },
  { icon: Award, title: "Rewards & Recognition", color: "text-red-500" },
];

const collegeOfferingsData = [
  { icon: Code, title: "Free Platform", description: "Access to our cutting-edge hackathon platform at no cost" },
  { icon: Handshake, title: "Industry Connections", description: "Connect with leading tech companies and startups" },
  { icon: Trophy, title: "Rewards", description: "Exciting prizes and goodies for participants" },
  { icon: Briefcase, title: "Internship & Job Opportunities", description: "Direct pathway to career opportunities" },
];

const pathStepsData = [
  { icon: ClipboardList, title: "Registration", description: "Fill in your details and create your profile for the hackathon" },
  { icon: UsersRound, title: "Team Formation", description: "Choose your team wisely and come up with the best idea" },
  { icon: BookOpen, title: "Hands-On Training Workshop", description: "Learn from industry experts and upskill yourself" },
  { icon: Presentation, title: "Idea Pitching", description: "Submit your idea and present it in front of the jury panel" },
  { icon: Medal, title: "Judging", description: "Get your idea evaluated from the best in the industry" },
  { icon: PartyPopper, title: "Winners Announcement", description: "The best idea wins amazing prizes and recognition" },
];

const whyChooseUsData = [
  { icon: Code, title: "Hackathon Platform", description: "Fully automated platform for end-to-end execution of the hackathon with built-in communication channel and evaluation process." },
  { icon: GraduationCap, title: "Industry Connect", description: "Learn from the best industry experts through hands-on training sessions and workshops." },
  { icon: Users, title: "Work with the best", description: "Work with highly experienced and professional team for your hackathons/projects." },
  { icon: Building2, title: "Developer Connect", description: "Get access to India's largest community of young developers including students, startups, working professionals and freelancers." },
];

const Hackathons = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-primary/90" />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Hackathon & <span className="text-yellow-400">Bootcamp</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Participate in various bootcamps, hackathons and upskill yourself with industry-ready skills.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Hackathons Section */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Why are <span className="text-primary">hackathons</span> important?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Hackathons boost networking opportunities, team spirit, entrepreneurship, innovation & creativity. 
              With short deadlines and ambitious ideas, hackathons teach you how to code fast and, more importantly, think fast.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {whyHackathonsData.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-20 h-20 rounded-full border-2 border-dashed ${item.color === 'text-yellow-500' ? 'border-yellow-500' : 'border-red-500'} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-10 h-10 ${item.color}`} />
                </div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer to Colleges */}
      <section className="py-20 bg-muted/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">What We Offer to Colleges?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Hacker's Unity offers a customised platform to conduct Hackathons with industry participation 
              and partnership along with rewards and placement/internship opportunities for students.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {collegeOfferingsData.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer to Corporates */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-3xl p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-8">
              What We Offer to Corporates?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-black/80 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold text-yellow-400 mb-3">External</h3>
                <p className="text-white/80 text-sm">
                  Hacker's Unity offers a customised platform to conduct Hackathons with industry participation 
                  and partnership along with rewards and placement/internship opportunities for students.
                </p>
              </div>
              <div className="bg-white/90 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-primary mb-3">Internal</h3>
                <p className="text-muted-foreground text-sm">
                  A platform to conduct internal hackathons to engage internal employees which fosters a 
                  culture of innovation by addressing core challenges along with product evangelisation 
                  and promoting open innovation.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Path Steps */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Path Steps</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Who doesn't want to participate in a hackathon? Hackathon is gaining popularity amongst 
              the developers, corporates to create and/or solve real world solutions.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-primary via-yellow-400 to-primary" />
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {pathStepsData.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center text-center relative"
                >
                  <div className="w-16 h-16 rounded-full bg-card border-2 border-primary flex items-center justify-center mb-4 relative z-10 shadow-lg">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Hacker's Unity */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold">
              Why <span className="text-primary">Hacker's Unity</span>?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUsData.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button variant="hero" size="lg">
              Host a Hackathon with Us
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Hackathons;
