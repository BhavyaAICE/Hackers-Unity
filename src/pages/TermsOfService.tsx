import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container-custom py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-foreground mb-8">
            Terms of Service
          </h1>
          
          <p className="text-muted-foreground mb-8">
            By accessing or using the Hacker's Unity website, you agree to the following Terms of Service.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground mb-2">By using our platform, you confirm that you:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Are at least 13 years old</li>
              <li>Have read and agreed to these Terms and our Privacy Policy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              2. Use of Services
            </h2>
            <p className="text-muted-foreground mb-2">You agree to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Provide accurate and truthful information during registration</li>
              <li>Use the platform only for lawful purposes</li>
              <li>Not misuse, hack, scrape, or disrupt our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              3. Event Registration
            </h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Event registrations may be free or paid, as specified</li>
              <li>Submission does not guarantee selection unless stated</li>
              <li>We reserve the right to approve, reject, or cancel registrations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              4. Code of Conduct
            </h2>
            <p className="text-muted-foreground mb-2">Participants must:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
              <li>Maintain respectful and professional behavior</li>
              <li>Avoid plagiarism, cheating, or misuse of intellectual property</li>
              <li>Follow event-specific rules and guidelines</li>
            </ul>
            <p className="text-muted-foreground">
              Violation may result in disqualification or account suspension.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              5. Intellectual Property
            </h2>
            <p className="text-muted-foreground mb-2">All website content including:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
              <li>Logos</li>
              <li>Text</li>
              <li>Designs</li>
              <li>Event materials</li>
            </ul>
            <p className="text-muted-foreground">
              are the intellectual property of Hacker's Unity unless otherwise stated. Unauthorized use is prohibited.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              6. Third-Party Links
            </h2>
            <p className="text-muted-foreground">
              Our website may contain links to third-party websites. We are not responsible for their content or privacy practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-muted-foreground mb-2">Hacker's Unity is not liable for:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Technical issues or service interruptions</li>
              <li>Loss of data beyond reasonable control</li>
              <li>Any indirect or consequential damages</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              8. Termination
            </h2>
            <p className="text-muted-foreground mb-2">We reserve the right to suspend or terminate access if:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Terms are violated</li>
              <li>Fraudulent or harmful activity is detected</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              9. Governing Law
            </h2>
            <p className="text-muted-foreground">
              These Terms are governed by the laws of India. Any disputes shall be subject to Indian jurisdiction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              10. Contact Information
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

export default TermsOfService;
