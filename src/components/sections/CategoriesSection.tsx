import { motion } from "framer-motion";
import { Trophy, Users, BookOpen, Globe, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const categories = [
  {
    icon: Trophy,
    title: "Hackathons",
    description: "Compete in coding challenges, build innovative solutions, and win exciting prizes",
    color: "from-primary to-cyan-400",
    href: "#hackathons",
  },
  {
    icon: BookOpen,
    title: "Developer Programs",
    description: "Accelerate your career with industry-led training programs and certifications",
    color: "from-secondary to-purple-400",
    href: "#programs",
  },
  {
    icon: Users,
    title: "Workshops",
    description: "Hands-on sessions covering the latest technologies from AI to Web3",
    color: "from-accent to-pink-400",
    href: "#workshops",
  },
  {
    icon: Globe,
    title: "Community",
    description: "Connect with 100K+ developers, share knowledge, and grow together",
    color: "from-emerald-500 to-teal-400",
    href: "#community",
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-24 relative" id="categories">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-semibold uppercase tracking-wider"
          >
            What We Offer
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mt-4 mb-6"
          >
            Explore Our <span className="text-primary">Programs</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            From hackathons to mentorship, discover opportunities that will accelerate your tech career
          </motion.p>
        </div>

        {/* Category Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.a
              key={category.title}
              href={category.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card variant="neon" className="p-6 h-full group cursor-pointer hover:-translate-y-2">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
