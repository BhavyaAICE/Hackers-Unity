import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Building2, Calendar, ArrowRight, Sparkles, Award, Target, Rocket, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Achievement {
  id: string;
  icon_name: string;
  value: string;
  label: string;
  gradient: string;
  glow: string;
  display_order: number;
}

const iconMap: Record<string, any> = {
  trophy: Trophy,
  users: Users,
  building2: Building2,
  calendar: Calendar,
  award: Award,
  target: Target,
  rocket: Rocket,
  star: Star,
};

const AchievementsSection = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (!error && data) {
        setAchievements(data);
      }
      setLoading(false);
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return null;
  }

  if (achievements.length === 0) {
    return null;
  }
  return (
    <section className="py-24 relative overflow-hidden" id="achievements">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
      
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Our Impact
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mt-4 mb-6">
            Our <span className="text-primary">Achievements</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Building India's most vibrant tech community, one hackathon at a time
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 auto-rows-fr">
          {achievements.map((achievement, index) => {
            const IconComponent = iconMap[achievement.icon_name] || Trophy;
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${achievement.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />

                <div className={`relative glass-card p-6 md:p-8 text-center rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-500 shadow-lg ${achievement.glow} group-hover:shadow-2xl h-full flex flex-col justify-center`}>
                  {/* Icon Container */}
                  <div className={`w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${achievement.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <IconComponent className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>

                  {/* Value */}
                  <motion.div
                    className={`text-3xl md:text-4xl font-bold font-display bg-gradient-to-r ${achievement.gradient} bg-clip-text text-transparent`}
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {achievement.value}
                  </motion.div>

                  {/* Label */}
                  <p className="text-muted-foreground text-sm md:text-base mt-2 font-medium">
                    {achievement.label}
                  </p>

                  {/* Decorative Line */}
                  <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${achievement.gradient} mx-auto mt-4 rounded-full transition-all duration-500`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="glass-card inline-block p-8 md:p-10 rounded-2xl max-w-xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold font-display mb-3">
              Ready to be part of something <span className="text-primary">amazing</span>?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join India's fastest-growing tech community and unlock endless opportunities
            </p>
            <a
              href="https://discord.gg/2ArqYfykBd"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="hero" size="lg" className="group">
                Join Our Community
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;
