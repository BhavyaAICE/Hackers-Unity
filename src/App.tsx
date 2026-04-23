import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { EditProvider } from "@/contexts/EditContext";
import { BeamsBackground } from "@/components/ui/beams-background";

// ─── Lazy-loaded pages (code split per route) ─────────────────────────────────
const Index = lazy(() => import("./pages/Index"));
const AllHackathons = lazy(() => import("./pages/AllHackathons"));
const AllEvents = lazy(() => import("./pages/AllEvents"));
const Hackathons = lazy(() => import("./pages/Hackathons"));
const HackathonDetail = lazy(() => import("./pages/HackathonDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ConfirmEmail = lazy(() => import("./pages/ConfirmEmail"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const EventRegister = lazy(() => import("./pages/EventRegister"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Workshops = lazy(() => import("./pages/Workshops"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Careers = lazy(() => import("./pages/Careers"));
const FAQs = lazy(() => import("./pages/FAQs"));
const Support = lazy(() => import("./pages/Support"));
const NotFound = lazy(() => import("./pages/NotFound"));
const EditPage = lazy(() => import("./pages/EditPage"));

// Admin pages — separate heavy chunk
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const Events = lazy(() => import("./pages/admin/Events"));
const EventForm = lazy(() => import("./pages/admin/EventForm"));
const HackathonsList = lazy(() => import("./pages/admin/HackathonsList"));
const HackathonForm = lazy(() => import("./pages/admin/HackathonForm"));
const Registrations = lazy(() => import("./pages/admin/Registrations"));
const ContactQueries = lazy(() => import("./pages/admin/ContactQueries"));
const Achievements = lazy(() => import("./pages/admin/Achievements"));
const Sponsors = lazy(() => import("./pages/admin/Sponsors"));
const Testimonials = lazy(() => import("./pages/admin/Testimonials"));
const Content = lazy(() => import("./pages/admin/Content"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));

// ─── Shared loading fallback ───────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,        // cache responses 1 min
      gcTime: 5 * 60_000,       // keep unused data 5 min
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <BeamsBackground>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<EditProvider pageKey="home"><Index /></EditProvider>} />
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
                <Route path="/about-us" element={<EditProvider pageKey="about"><AboutUs /></EditProvider>} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/faqs" element={<EditProvider pageKey="faqs"><FAQs /></EditProvider>} />
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
                <Route path="/edit" element={<EditPage />} />
                <Route path="/edit/about-us" element={<EditPage />} />
                <Route path="/edit/faqs" element={<EditPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BeamsBackground>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
