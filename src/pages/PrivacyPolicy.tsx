import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container-custom py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-foreground mb-8">
            Privacy Policy
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Hacker's Unity ("we", "our", "us") is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, store, and protect your personal information when you access our website or register for our events.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              1. Information We Collect
            </h2>
            <p className="text-muted-foreground mb-4">
              When you use our website or register for an event, we may collect the following information:
            </p>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">a. Personal Information</h3>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>Date of Birth</li>
              <li>Location (City, State, Country)</li>
              <li>College / Organization name (if applicable)</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mb-2">b. Technical Information</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>IP address</li>
              <li>Browser type and device information</li>
              <li>Pages visited and interaction data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-muted-foreground mb-2">We use your information to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Register and manage your participation in events and hackathons</li>
              <li>Communicate event updates, confirmations, and important announcements</li>
              <li>Verify participant identity and eligibility</li>
              <li>Improve our platform, services, and user experience</li>
              <li>Send newsletters, updates, or promotional content (only if opted in)</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              3. Data Sharing & Disclosure
            </h2>
            <p className="text-muted-foreground mb-2">We do not sell your personal data.</p>
            <p className="text-muted-foreground mb-2">We may share limited information only with:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
              <li>Event partners, sponsors, or judges (only when necessary for event execution)</li>
              <li>Trusted third-party services (email delivery, analytics, hosting)</li>
              <li>Legal authorities if required by law</li>
            </ul>
            <p className="text-muted-foreground">
              All third parties are required to maintain strict confidentiality and data protection standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              4. Cookies & Tracking
            </h2>
            <p className="text-muted-foreground mb-2">We use cookies to:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
              <li>Enhance website performance</li>
              <li>Analyze traffic and usage behavior</li>
              <li>Improve user experience</li>
            </ul>
            <p className="text-muted-foreground">
              You can disable cookies in your browser settings, though some features may not work properly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              5. Data Security
            </h2>
            <p className="text-muted-foreground mb-2">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
              <li>Secure servers and encrypted connections (HTTPS)</li>
              <li>Access control and authentication</li>
              <li>Regular system monitoring</li>
            </ul>
            <p className="text-muted-foreground">
              However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              6. Data Retention
            </h2>
            <p className="text-muted-foreground mb-2">We retain your personal information:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
              <li>As long as necessary to fulfill event-related purposes</li>
              <li>To comply with legal, accounting, or reporting obligations</li>
            </ul>
            <p className="text-muted-foreground">
              You may request deletion of your data at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              7. Your Rights
            </h2>
            <p className="text-muted-foreground mb-2">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
              <li>Access your personal data</li>
              <li>Request corrections or updates</li>
              <li>Withdraw consent</li>
              <li>Request data deletion</li>
            </ul>
            <p className="text-muted-foreground">
              To exercise these rights, contact us at{" "}
              <a href="mailto:hackerunity.community@gmail.com" className="text-primary hover:underline">
                hackerunity.community@gmail.com
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              8. Children's Privacy
            </h2>
            <p className="text-muted-foreground">
              Our services are intended for users aged 13 years and above. We do not knowingly collect data from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              9. Changes to This Policy
            </h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              10. Contact Us
            </h2>
            <p className="text-muted-foreground">
              📧 Email:{" "}
              <a href="mailto:hackerunity.community@gmail.com" className="text-primary hover:underline">
                hackerunity.community@gmail.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
