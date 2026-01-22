import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import AllHackathons from "./pages/AllHackathons";
import AllEvents from "./pages/AllEvents";
import Hackathons from "./pages/Hackathons";
import HackathonDetail from "./pages/HackathonDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ConfirmEmail from "./pages/ConfirmEmail";
import EventDetail from "./pages/EventDetail";
import EventRegister from "./pages/EventRegister";
import Dashboard from "./pages/Dashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Workshops from "./pages/Workshops";
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import FAQs from "./pages/FAQs";
import Support from "./pages/Support";
import AdminDashboard from "./pages/admin/Dashboard";
import Events from "./pages/admin/Events";
import EventForm from "./pages/admin/EventForm";
import HackathonsList from "./pages/admin/HackathonsList";
import HackathonForm from "./pages/admin/HackathonForm";
import Registrations from "./pages/admin/Registrations";
import ContactQueries from "./pages/admin/ContactQueries";
import Achievements from "./pages/admin/Achievements";
import Sponsors from "./pages/admin/Sponsors";
import Testimonials from "./pages/admin/Testimonials";
import Content from "./pages/admin/Content";
import UserManagement from "./pages/admin/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/all-hackathons" element={<AllHackathons />} />
            <Route path="/all-events" element={<AllEvents />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/hackathon/:id" element={<HackathonDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/events/:id/register" element={<EventRegister />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/support" element={<Support />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/hackathons" element={<HackathonsList />} />
            <Route path="/admin/hackathons/create" element={<HackathonForm />} />
            <Route path="/admin/hackathons/edit/:id" element={<HackathonForm />} />
            <Route path="/admin/events" element={<Events />} />
            <Route path="/admin/events/create" element={<EventForm />} />
            <Route path="/admin/events/edit/:id" element={<EventForm />} />
            <Route path="/admin/registrations" element={<Registrations />} />
            <Route path="/admin/contact-queries" element={<ContactQueries />} />
            <Route path="/admin/achievements" element={<Achievements />} />
            <Route path="/admin/sponsors" element={<Sponsors />} />
            <Route path="/admin/testimonials" element={<Testimonials />} />
            <Route path="/admin/content" element={<Content />} />
            <Route path="/admin/users" element={<UserManagement />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
