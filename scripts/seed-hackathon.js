/**
 * Seed script — creates a test admin user + a complete HackStorm hackathon
 * Run from repo root: node scripts/seed-hackathon.js
 * (must be run from backend dir so node_modules are found)
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ─── User Schema ─────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: String,
    fullName: String,
    isAdmin: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: true },
    avatarUrl: String,
}, { timestamps: true });

// ─── Event Schema (hackathons are events with eventType: 'hackathon') ─────────
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: String,
    description: String,
    eventType: { type: String, enum: ['conference', 'workshop', 'meetup', 'hackathon', 'seminar', 'other'], default: 'conference' },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
    eventDate: Date,
    eventEndDate: Date,
    registrationDeadline: Date,
    durationDays: { type: Number, default: 1 },
    timing: String,
    locationType: String,
    locationName: String,
    locationAddress: String,
    bannerImage: String,
    thumbnailImage: String,
    registrationEnabled: { type: Boolean, default: true },
    registrationCount: { type: Number, default: 0 },
    prizePool: String,
    maxParticipants: Number,
    externalLink: String,
    challenges: [mongoose.Schema.Types.Mixed],
    mentors: [mongoose.Schema.Types.Mixed],
    jury: [mongoose.Schema.Types.Mixed],
    prizes: [mongoose.Schema.Types.Mixed],
    faqs: [mongoose.Schema.Types.Mixed],
    winners: [mongoose.Schema.Types.Mixed],
    schedule: [mongoose.Schema.Types.Mixed],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

// ─── Connect & Seed ───────────────────────────────────────────────────────────
async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set — run from backend/ dir with .env loaded');

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected');

    // Admin user
    let admin = await User.findOne({ email: 'admin@hackersunity.com' });
    if (!admin) {
        const hashed = await bcrypt.hash('Admin@1234', 12);
        admin = await User.create({
            email: 'admin@hackersunity.com',
            password: hashed,
            fullName: "Hacker's Unity Admin",
            isAdmin: true,
        });
        console.log("👤 Admin created: admin@hackersunity.com / Admin@1234");
    } else {
        if (!admin.isAdmin) { admin.isAdmin = true; await admin.save(); }
        console.log("👤 Admin already exists: admin@hackersunity.com");
    }

    // Remove old seed if exists
    await Event.deleteOne({ title: "HackStorm 3.0 – AI for India", eventType: 'hackathon' });

    // ─── Create hackathon ─────────────────────────────────────────────────────
    const hackathon = await Event.create({
        eventType: "hackathon",
        title: "HackStorm 3.0 – AI for India",
        subtitle: "Build intelligent solutions for real-world Indian challenges",
        description: "HackStorm 3.0 is India's most ambitious student hackathon, bringing together 500+ developers, designers, and innovators to solve pressing challenges facing India using Artificial Intelligence.\n\nOver 48 hours, teams of 2–5 will ideate, build, and present AI-powered solutions across tracks including Healthcare, FinTech, Agriculture, and Smart Cities. Top solutions get direct access to Hacker's Unity's accelerator network.\n\nWhether you're a first-time hacker or a seasoned builder — HackStorm is where ideas become impact.",
        status: "upcoming",
        eventDate: new Date("2026-03-15T03:30:00.000Z"),
        eventEndDate: new Date("2026-03-16T12:30:00.000Z"),
        registrationDeadline: new Date("2026-03-10T18:29:00.000Z"),
        durationDays: 2,
        timing: "9:00 AM – 6:00 PM IST",
        locationType: "hybrid",
        locationName: "IIT Delhi + Online",
        locationAddress: "Hauz Khas, New Delhi, Delhi 110016",
        bannerImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80",
        thumbnailImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80",
        registrationEnabled: true,
        prizePool: "₹5,00,000",
        maxParticipants: 500,
        externalLink: "https://devfolio.co/hackstorm3",
        createdBy: admin._id,

        challenges: [
            { title: "AI in Healthcare", description: "Build AI solutions that make quality healthcare accessible to every Indian.", detailedDescription: "Problem Brief: India faces a critical shortage of healthcare professionals, especially in rural areas.\n\nSolution Approach: Build tools for disease prediction, diagnostics support, telemedicine, or patient triage.\n\nDatasets: ICMR, WHO India open datasets.\n\nJudging: Impact, Technical excellence, Scalability, UX.", icon: "🏥", imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80", isActive: true, displayOrder: 0 },
            { title: "FinTech Innovation", description: "Democratise financial services with AI for the next billion Indians.", detailedDescription: "Problem Brief: Millions still lack access to credit, insurance, and investments.\n\nSolution Approach: AI-powered credit scoring, fraud detection, micro-investments, or vernacular financial tools.\n\nJudging: Financial inclusion impact, security, UX, business viability.", icon: "💳", imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80", isActive: true, displayOrder: 1 },
            { title: "Smart Agriculture", description: "Empower Indian farmers with AI-driven crop insights.", detailedDescription: "Problem Brief: Indian agriculture faces unpredictable weather, soil degradation, and post-harvest losses.\n\nSolution Approach: Crop disease detection via CV, yield prediction, smart irrigation, or supply-chain optimisation.\n\nDatasets: ICAR, satellite imagery, soil health cards.", icon: "🌾", imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80", isActive: true, displayOrder: 2 },
        ],

        mentors: [
            { name: "Dr. Priya Sharma", title: "Principal AI Researcher", organization: "IIT Bombay", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80", linkedinUrl: "https://linkedin.com/in/example", bio: "Dr. Priya Sharma has 15+ years of experience in ML and computer vision, with 60+ publications and 200+ student projects mentored.", isActive: true, displayOrder: 0 },
            { name: "Arjun Menon", title: "Co-founder & CTO", organization: "HealthAI.in", avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80", linkedinUrl: "https://linkedin.com/in/example2", bio: "Arjun built India's first FDA-cleared AI diagnostic tool and will specifically mentor teams in the AI in Healthcare track.", isActive: true, displayOrder: 1 },
        ],

        jury: [
            { name: "Sneha Kapoor", title: "Partner", organization: "Sequoia Capital India", avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80", linkedinUrl: "https://linkedin.com/in/example3", bio: "Sneha has invested in 40+ AI startups across India and SEA. She evaluates on market potential, scalability, and team strength.", isActive: true, displayOrder: 0 },
            { name: "Vikram Nair", title: "Director of Engineering", organization: "Google India", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", linkedinUrl: "https://linkedin.com/in/example4", bio: "Vikram leads Google's India engineering center. He focuses on technical robustness and code quality.", isActive: true, displayOrder: 1 },
        ],

        prizes: [
            { position: "1st", title: "Grand Prize", prizeAmount: "₹2,00,000", description: "Cash prize + 6-month accelerator access + mentorship from top VCs + AWS credits ₹5,00,000 + national media feature.", isActive: true, displayOrder: 0 },
            { position: "2nd", title: "Runner Up", prizeAmount: "₹1,00,000", description: "Cash prize + 3-month accelerator access + AWS credits ₹2,00,000 + fast-track interviews at 5 partner companies.", isActive: true, displayOrder: 1 },
            { position: "3rd", title: "Second Runner Up", prizeAmount: "₹50,000", description: "Cash prize + AWS credits ₹1,00,000 + Hacker's Unity alumni network membership.", isActive: true, displayOrder: 2 },
            { position: "Track", title: "Best per Track", prizeAmount: "₹25,000 each", description: "Best project in each of the 3 tracks receives ₹25,000 + Hacker's Unity swag kit.", isActive: true, displayOrder: 3 },
        ],

        faqs: [
            { question: "Who can participate?", answer: "Open to all students (UG/PG) and recent graduates (within 2 years). Working professionals are not eligible.", isActive: true, displayOrder: 0 },
            { question: "What is the team size?", answer: "Teams must have 2 to 5 members. Solo participation is not allowed. You can form teams on-site.", isActive: true, displayOrder: 1 },
            { question: "Is there a registration fee?", answer: "No! HackStorm 3.0 is completely free. We waive all fees to make the event accessible to every student in India.", isActive: true, displayOrder: 2 },
            { question: "Do I need prior experience?", answer: "Not at all. We welcome developers, designers, and business folks. Enthusiasm and teamwork matter most.", isActive: true, displayOrder: 3 },
            { question: "Will food and accommodation be provided?", answer: "Yes — meals and snacks throughout the event. Accommodation on first-come-first-served basis for in-person participants.", isActive: true, displayOrder: 4 },
            { question: "Can I participate online?", answer: "Yes! HackStorm 3.0 is hybrid. Online teams join via Discord with the same judging standards as in-person.", isActive: true, displayOrder: 5 },
        ],

        schedule: [
            { day: 1, scheduleDate: "2026-03-15", startTime: "9:00 AM", endTime: "10:00 AM", title: "Registration & Check-in", description: "On-site check-in, kit collection, welcome coffee. Online participants join Discord.", displayOrder: 0 },
            { day: 1, scheduleDate: "2026-03-15", startTime: "10:00 AM", endTime: "11:00 AM", title: "Opening Ceremony", description: "Welcome address, challenge reveal, team formation for solos, sponsor intros.", displayOrder: 1 },
            { day: 1, scheduleDate: "2026-03-15", startTime: "11:00 AM", endTime: "11:30 AM", title: "Hackathon Begins 🚀", description: "Hacking officially starts! Teams begin ideation, prototyping, and building.", displayOrder: 2 },
            { day: 1, scheduleDate: "2026-03-15", startTime: "2:00 PM", endTime: "3:00 PM", title: "Mentor Sessions – Round 1", description: "Book 1-on-1 mentor slots. Get early feedback on your approach.", displayOrder: 3 },
            { day: 1, scheduleDate: "2026-03-15", startTime: "8:00 PM", endTime: "9:00 PM", title: "Mid-hack Check-in", description: "Optional progress check. Share your prototype for early feedback.", displayOrder: 4 },
            { day: 2, scheduleDate: "2026-03-16", startTime: "9:00 AM", endTime: "10:00 AM", title: "Mentor Sessions – Round 2", description: "Final mentor sessions — polish your pitch and demo.", displayOrder: 5 },
            { day: 2, scheduleDate: "2026-03-16", startTime: "12:00 PM", endTime: "12:00 PM", title: "Submission Deadline ⏰", description: "All projects submitted via Devfolio by noon. No extensions.", displayOrder: 6 },
            { day: 2, scheduleDate: "2026-03-16", startTime: "1:00 PM", endTime: "4:00 PM", title: "Project Demos & Judging", description: "Each team: 5 min presentation + 3 min jury Q&A.", displayOrder: 7 },
            { day: 2, scheduleDate: "2026-03-16", startTime: "5:00 PM", endTime: "6:00 PM", title: "Closing Ceremony & Prize Distribution 🏆", description: "Winners announced, prizes distributed, group photos. Keep building!", displayOrder: 8 },
        ],
    });

    console.log(`\n✅ Hackathon created!`);
    console.log(`   ID:    ${hackathon._id}`);
    console.log(`   Title: ${hackathon.title}`);
    console.log(`\n📋 Admin: admin@hackersunity.com / Admin@1234`);
    console.log(`🌐 Vercel: https://hackers-unity-sigma.vercel.app/hackathons`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected.\n');
}

main().catch((err) => { console.error('❌', err.message); process.exit(1); });
