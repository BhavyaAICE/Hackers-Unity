<!-- Hackers Unity – Official Website README -->

<div align="center">
  <!-- Project Logo -->
  <!-- Replace src with your actual logo URL if available -->
  <img src="https://placehold.co/180x180?text=Hackers+Unity" alt="Hackers Unity Logo" width="140" height="140" />

  <h1>Hackers Unity – Official Website</h1>

  <p>
    A modern, scalable web platform powering the Hackers Unity tech community —
    built for event management, hackathon registrations, and community engagement.
  </p>
</div>

<hr />

<section>
  <h2>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    About Hackers Unity
  </h2>

  <p>
    <strong>Hackers Unity</strong> is a student-driven technology community based in India,
    focused on empowering developers, innovators, and technology enthusiasts through
    real-world exposure and collaborative learning.
  </p>

  <p>
    The platform serves as the official digital hub for managing hackathons, workshops,
    webinars, and community-led tech initiatives.
  </p>
</section>

<hr />

<section>
  <h2>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="12 2 19 21 5 21 12 2"></polygon>
    </svg>
    Core Features
  </h2>

  <h3>User Experience</h3>
  <ul>
    <li>Secure user authentication and onboarding</li>
    <li>Event and hackathon registration system</li>
    <li>Automated email confirmations</li>
    <li>Responsive, accessible, and SEO-friendly UI</li>
  </ul>

  <h3>Admin Capabilities</h3>
  <ul>
    <li>Complete role-based admin management system</li>
    <li>User profile and registration tracking</li>
    <li>Event participation analytics</li>
    <li>Automated registration counters using database triggers</li>
  </ul>

  <h3>Email & Communication</h3>
  <ul>
    <li>Transactional emails powered by Resend</li>
    <li>Registration confirmation emails</li>
    <li>Extensible system for future announcements</li>
  </ul>
</section>

<hr />

<section>
  <h2>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
    </svg>
    Technology Stack
  </h2>

  <h3>Frontend</h3>
  <ul>
    <li>Vite</li>
    <li>TypeScript</li>
    <li>Tailwind CSS</li>
  </ul>

  <h3>Backend & Database</h3>
  <ul>
    <li>Supabase Authentication</li>
    <li>PostgreSQL Database</li>
    <li>SQL migrations, triggers, and functions</li>
  </ul>

  <h3>Tooling</h3>
  <ul>
    <li>ESLint</li>
    <li>PostCSS</li>
    <li>npm / Bun support</li>
  </ul>
</section>

<hr />

<section>
  <h2>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 3h18v18H3z"></path>
      <path d="M3 9h18"></path>
      <path d="M9 21V9"></path>
    </svg>
    Project Structure
  </h2>

  <pre>
simple-tic-tac-toe-main/
├── index.html
├── src/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   └── index.ts
│
├── migrations/
│   ├── create_user_profiles.sql
│   ├── create_complete_admin_system.sql
│   ├── add_registration_count_trigger.sql
│   └── additional SQL files
│
├── ADMIN_SETUP.md
├── RESEND_SETUP_GUIDE.md
├── README.md
├── package.json
├── tailwind.config.ts
└── tsconfig.json
  </pre>
</section>

<hr />

<section>
  <h2>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2v20"></path>
      <path d="M2 12h20"></path>
    </svg>
    Installation & Setup
  </h2>

  <h3>Clone Repository</h3>
  <pre>
git clone https://github.com/your-username/hackers-unity-website.git
cd hackers-unity-website
  </pre>

  <h3>Install Dependencies</h3>
  <pre>
npm install
# or
bun install
  </pre>

  <h3>Environment Variables</h3>
  <pre>
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
  </pre>
</section>

<hr />

<section>
  <h2>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M5 12h14"></path>
      <path d="M12 5l7 7-7 7"></path>
    </svg>
    Running the Project
  </h2>

  <pre>
npm run dev
# or
bun dev
  </pre>

  <p>
    The application will be available at:
    <strong>http://localhost:5173</strong>
  </p>
</section>

<hr />

<section>
  <h2>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 1l3 5 5 3-5 3-3 5-3-5-5-3 5-3 3-5z"></path>
    </svg>
    Deployment
  </h2>

  <p>
    This project is deployment-ready and can be hosted on platforms such as
    Vercel, Netlify, or any VPS supporting Node.js.
  </p>

  <p>
    Ensure all environment variables are configured correctly in the deployment
    environment.
  </p>
</section>

<hr />

<section>
  <h2>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="4" y="4" width="16" height="16" rx="2"></rect>
      <path d="M9 9h6v6H9z"></path>
    </svg>
    License
  </h2>

  <p>
    This project is proprietary and owned by <strong>Hackers Unity</strong>.
    Unauthorized redistribution or commercial use is strictly prohibited.
  </p>
</section>

<hr />

<section>
  <h2>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1118 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
    Contact
  </h2>

  <p>
    <strong>Hackers Unity</strong><br />
    Official Tech Community Platform<br />
    Email: official Hackers Unity email<br />
    LinkedIn & Socials: Hacker’s Unity
  </p>
</section>
