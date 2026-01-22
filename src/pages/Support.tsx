import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Mail, Phone, MessageCircle, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Get in touch via email for detailed inquiries",
    contact: "hackerunity.community@gmail.com",
    href: "mailto:hackerunity.community@gmail.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Reach out to our founders directly",
    contact: "+91 93242 64950",
    href: "tel:+919324264950",
  },
  {
    icon: MessageCircle,
    title: "Discord",
    description: "Join our community for quick support",
    contact: "Join Server",
    href: "https://discord.gg/BmMJFpPe9T",
  },
];

const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("contact_queries").insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        message: `[Support Request] ${formData.message.trim()}`,
      });

      if (error) throw error;

      toast.success("Your support request has been submitted successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
                <Headphones className="w-4 h-4" />
                We're Here to Help
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold font-display mb-6"
              >
                Get <span className="text-primary">Support</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                Need help with an event, hackathon, or have questions about our community? 
                We're here to assist you.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.title}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="block"
                >
                  <Card variant="neon" className="p-6 h-full text-center hover:-translate-y-1 transition-transform">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
                      <method.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                    <span className="text-primary font-medium">{method.contact}</span>
                  </Card>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Support Form */}
        <section className="py-24">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                  Submit a Request
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4 mb-4">
                  How Can We <span className="text-primary">Help You?</span>
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form below and our team will get back to you within 24-48 hours.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card variant="elevated" className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name <span className="text-primary">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                          placeholder="Your name"
                          required
                          maxLength={100}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email <span className="text-primary">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                          placeholder="your@email.com"
                          required
                          maxLength={255}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                        placeholder="+91 XXXXX XXXXX"
                        maxLength={20}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        How can we help? <span className="text-primary">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground resize-none"
                        placeholder="Describe your issue or question in detail..."
                        required
                        maxLength={1000}
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Submit Request"}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-24 bg-muted/30">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold font-display mb-6">
                Looking for <span className="text-primary">Something Else?</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Check out these helpful resources or explore our FAQs for quick answers.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/faqs">
                  <Button variant="outline" size="lg">View FAQs</Button>
                </Link>
                <Link to="/about-us">
                  <Button variant="outline" size="lg">About Us</Button>
                </Link>
                <Link to="/hackathons">
                  <Button variant="outline" size="lg">Hackathons</Button>
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

export default Support;
