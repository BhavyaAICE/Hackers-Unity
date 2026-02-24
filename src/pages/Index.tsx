import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import EventsSection from "@/components/sections/EventsSection";
import SponsorsSection from "@/components/sections/SponsorsSection";
import HackathonsSection from "@/components/sections/HackathonsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";
import FoundersSection from "@/components/sections/FoundersSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AchievementsSection />
        <CategoriesSection />
        <HackathonsSection />
        <SponsorsSection />
        <EventsSection />
        <TestimonialsSection />
        <ContactSection />
        <FoundersSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
