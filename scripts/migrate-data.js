import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import { createClient } from '@supabase/supabase-js';

// Load env from backend/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../backend/.env') });

// ─── Config ────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://eqcjttvmjhisyrvtydat.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }
if (!SUPABASE_SERVICE_KEY) { console.error('❌ SUPABASE_SERVICE_ROLE not set'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ─── Connect via native MongoClient ────────────────────────────────────────
const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 60000,
    socketTimeoutMS: 120000,
    connectTimeoutMS: 60000,
});
await client.connect();
const db = client.db(); // uses database from the URI
console.log('✅ Connected to MongoDB (native driver)');

// Collections
const Users = db.collection('users');
const Events = db.collection('events');
const Registrations = db.collection('eventregistrations');
const Sponsors = db.collection('sponsors');
const Testimonials = db.collection('testimonials');
const Achievements = db.collection('achievements');
const AdminPermissions = db.collection('adminpermissions');
const ContactQueries = db.collection('contactqueries');

// ─── ID mapping (Supabase UUID → MongoDB ObjectId) ────────────────────────
const userIdMap = new Map();
const eventIdMap = new Map();

// ─── Migrate User Profiles ─────────────────────────────────────────────────
async function migrateUserProfiles() {
    const { data: profiles, error } = await supabase.from('user_profiles').select('*');
    if (error) { console.warn('⚠️  Could not fetch user_profiles:', error.message); return; }
    if (!profiles?.length) { console.log('ℹ️  No user profiles to migrate'); return; }

    const docs = [];
    for (const p of profiles) {
        const _id = new ObjectId();
        userIdMap.set(p.id, _id);
        docs.push({
            _id,
            email: p.email || `migrated-${p.id}@placeholder.com`,
            fullName: p.full_name || '',
            avatarUrl: p.avatar_url || '',
            isAdmin: p.is_admin || false,
            isEmailVerified: true,
            password: '$2b$10$placeholderhashneedsreset',
            createdAt: new Date(p.created_at || Date.now()),
            updatedAt: new Date(),
        });
    }
    if (docs.length) {
        await Users.insertMany(docs, { ordered: false }).catch(e => {
            if (e.code !== 11000) throw e; // ignore duplicates
        });
    }
    console.log(`✅ Migrated ${docs.length} user profiles`);
}

// ─── Migrate Events (includes hackathons with embedded data) ───────────────
async function migrateEvents() {
    const { data: events, error } = await supabase.from('events').select('*');
    if (error) { console.warn('⚠️  Could not fetch events:', error.message); return; }
    if (!events?.length) { console.log('ℹ️  No events to migrate'); return; }

    let count = 0;
    for (const e of events) {
        let challenges = [], mentors = [], jury = [], prizes = [], faqs = [], winners = [], schedule = [];

        if (e.event_type === 'hackathon') {
            const [cRes, mRes, jRes, pRes, fRes, wRes, sRes] = await Promise.all([
                supabase.from('hackathon_challenges').select('*').eq('event_id', e.id).order('display_order'),
                supabase.from('hackathon_mentors').select('*').eq('event_id', e.id).order('display_order'),
                supabase.from('hackathon_jury').select('*').eq('event_id', e.id).order('display_order'),
                supabase.from('hackathon_prizes').select('*').eq('event_id', e.id).order('display_order'),
                supabase.from('hackathon_faqs').select('*').eq('event_id', e.id).order('display_order'),
                supabase.from('hackathon_winners').select('*').eq('event_id', e.id).order('display_order'),
                supabase.from('schedule_items').select('*').eq('event_id', e.id).order('day').order('display_order'),
            ]);
            challenges = (cRes.data || []).map(c => ({ _id: new ObjectId(), title: c.title, description: c.description, detailedDescription: c.detailed_description, icon: c.icon, imageUrl: c.image_url, isActive: c.is_active ?? true, displayOrder: c.display_order || 0 }));
            mentors = (mRes.data || []).map(m => ({ _id: new ObjectId(), name: m.name, title: m.title, organization: m.organization, avatarUrl: m.avatar_url, linkedinUrl: m.linkedin_url, bio: m.bio, isActive: m.is_active ?? true, displayOrder: m.display_order || 0 }));
            jury = (jRes.data || []).map(j => ({ _id: new ObjectId(), name: j.name, title: j.title, organization: j.organization, avatarUrl: j.avatar_url, linkedinUrl: j.linkedin_url, bio: j.bio, isActive: j.is_active ?? true, displayOrder: j.display_order || 0 }));
            prizes = (pRes.data || []).map(p => ({ _id: new ObjectId(), position: p.position, title: p.title, prizeAmount: p.prize_amount, description: p.description, iconUrl: p.icon_url, isActive: p.is_active ?? true, displayOrder: p.display_order || 0 }));
            faqs = (fRes.data || []).map(f => ({ _id: new ObjectId(), question: f.question, answer: f.answer, isActive: f.is_active ?? true, displayOrder: f.display_order || 0 }));
            winners = (wRes.data || []).map(w => ({ _id: new ObjectId(), position: w.position, teamName: w.team_name, projectName: w.project_name, projectDescription: w.project_description, members: w.members, prizeWon: w.prize_won, imageUrl: w.image_url, githubUrl: w.github_url, projectUrl: w.project_url, displayOrder: w.display_order || 0 }));
            schedule = (sRes.data || []).map(s => ({ _id: new ObjectId(), title: s.title, description: s.description, startTime: s.start_time, endTime: s.end_time, scheduleDate: s.schedule_date, day: s.day || 1, displayOrder: s.display_order || 0 }));
        } else {
            const { data: sData } = await supabase.from('schedule_items').select('*').eq('event_id', e.id).order('display_order');
            schedule = (sData || []).map(s => ({ _id: new ObjectId(), title: s.title, description: s.description, startTime: s.start_time, endTime: s.end_time, day: s.day || 1, displayOrder: s.display_order || 0 }));
        }

        const _id = new ObjectId();
        eventIdMap.set(e.id, _id);

        await Events.insertOne({
            _id,
            title: e.title, subtitle: e.subtitle, description: e.description,
            eventType: e.event_type || 'conference', status: e.status || 'upcoming',
            eventDate: e.event_date ? new Date(e.event_date) : null,
            eventEndDate: e.event_end_date ? new Date(e.event_end_date) : null,
            registrationDeadline: e.registration_deadline ? new Date(e.registration_deadline) : null,
            durationDays: e.duration_days, timing: e.timing,
            locationType: e.location_type, locationName: e.location_name, locationAddress: e.location_address,
            bannerImage: e.banner_image, thumbnailImage: e.thumbnail_image,
            prizePool: e.prize_pool, maxParticipants: e.max_participants,
            benefitsText: e.benefits_text, benefits: Array.isArray(e.benefits) ? e.benefits : [],
            registrationEnabled: e.registration_enabled ?? true,
            registrationCount: e.registration_count ?? 0,
            externalLink: e.external_link, tags: Array.isArray(e.tags) ? e.tags : [],
            challenges, mentors, jury, prizes, faqs, winners, schedule,
            createdAt: new Date(e.created_at || Date.now()), updatedAt: new Date(),
        });
        count++;
    }
    console.log(`✅ Migrated ${count} events (with embedded hackathon data)`);
}

// ─── Migrate Event Registrations ──────────────────────────────────────────
async function migrateRegistrations() {
    const { data: regs, error } = await supabase.from('event_registrations').select('*');
    if (error) { console.warn('⚠️  Could not fetch registrations:', error.message); return; }
    if (!regs?.length) { console.log('ℹ️  No registrations to migrate'); return; }

    const docs = [];
    for (const r of regs) {
        const mongoEventId = eventIdMap.get(r.event_id);
        const mongoUserId = userIdMap.get(r.user_id);
        if (!mongoEventId) continue;
        docs.push({
            _id: new ObjectId(),
            event: mongoEventId, user: mongoUserId,
            fullName: r.full_name || '', email: r.email || '',
            phone: r.phone, organization: r.organization, designation: r.designation,
            status: r.status || 'registered',
            registeredAt: new Date(r.created_at || Date.now()),
            createdAt: new Date(r.created_at || Date.now()), updatedAt: new Date(),
        });
    }
    if (docs.length) await Registrations.insertMany(docs, { ordered: false }).catch(e => { if (e.code !== 11000) throw e; });
    console.log(`✅ Migrated ${docs.length} registrations`);
}

// ─── Migrate Sponsors ──────────────────────────────────────────────────────
async function migrateSponsors() {
    const { data, error } = await supabase.from('sponsors').select('*');
    if (error || !data?.length) return;
    const docs = data.map(s => ({ _id: new ObjectId(), name: s.name, logoUrl: s.logo_url, websiteUrl: s.website_url, tier: s.tier || 'partner', displayOrder: s.display_order || 0, isActive: s.is_active ?? true, createdAt: new Date(), updatedAt: new Date() }));
    await Sponsors.insertMany(docs, { ordered: false }).catch(e => { if (e.code !== 11000) throw e; });
    console.log(`✅ Migrated ${docs.length} sponsors`);
}

// ─── Migrate Testimonials ─────────────────────────────────────────────────
async function migrateTestimonials() {
    const { data, error } = await supabase.from('testimonials').select('*');
    if (error || !data?.length) return;
    const docs = data.map(t => ({ _id: new ObjectId(), name: t.name, role: t.role, organization: t.organization, testimonial: t.testimonial, avatarUrl: t.avatar_url, rating: t.rating || 5, isFeatured: t.is_featured || false, displayOrder: t.display_order || 0, isActive: t.is_active ?? true, createdAt: new Date(), updatedAt: new Date() }));
    await Testimonials.insertMany(docs, { ordered: false }).catch(e => { if (e.code !== 11000) throw e; });
    console.log(`✅ Migrated ${docs.length} testimonials`);
}

// ─── Migrate Achievements ─────────────────────────────────────────────────
async function migrateAchievements() {
    const { data, error } = await supabase.from('achievements').select('*');
    if (error || !data?.length) return;
    const docs = data.map(a => ({ _id: new ObjectId(), title: a.title, description: a.description, iconUrl: a.icon_url, category: a.category, statsValue: a.stats_value, statsLabel: a.stats_label, displayOrder: a.display_order || 0, isActive: a.is_active ?? true, createdAt: new Date(), updatedAt: new Date() }));
    await Achievements.insertMany(docs, { ordered: false }).catch(e => { if (e.code !== 11000) throw e; });
    console.log(`✅ Migrated ${docs.length} achievements`);
}

// ─── Migrate Admin Permissions ────────────────────────────────────────────
async function migrateAdminPermissions() {
    const { data, error } = await supabase.from('admin_permissions').select('*');
    if (error || !data?.length) return;
    const docs = data.map(p => ({
        _id: new ObjectId(),
        user: userIdMap.get(p.user_id), email: p.email,
        canViewDashboard: p.can_view_dashboard || false, canManageEvents: p.can_manage_events || false,
        canManageHackathons: p.can_manage_hackathons || false, canViewRegistrations: p.can_view_registrations || false,
        canExportData: p.can_export_data || false, canManageSponsors: p.can_manage_sponsors || false,
        canManageTestimonials: p.can_manage_testimonials || false, canManageContent: p.can_manage_content || false,
        canManageAchievements: p.can_manage_achievements || false, canViewContactQueries: p.can_view_contact_queries || false,
        canManageUsers: p.can_manage_users || false, isActive: p.is_active ?? true,
        createdAt: new Date(), updatedAt: new Date(),
    }));
    await AdminPermissions.insertMany(docs, { ordered: false }).catch(e => { if (e.code !== 11000) throw e; });
    console.log(`✅ Migrated ${docs.length} admin permission records`);
}

// ─── Migrate Contact Queries ──────────────────────────────────────────────
async function migrateContactQueries() {
    const { data, error } = await supabase.from('contact_queries').select('*');
    if (error || !data?.length) return;
    const docs = data.map(q => ({ _id: new ObjectId(), name: q.name, email: q.email, phone: q.phone, message: q.message, status: q.status || 'pending', createdAt: new Date(q.created_at || Date.now()), updatedAt: new Date() }));
    await ContactQueries.insertMany(docs, { ordered: false }).catch(e => { if (e.code !== 11000) throw e; });
    console.log(`✅ Migrated ${docs.length} contact queries`);
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
    console.log('\n🚀 Starting Supabase → MongoDB migration...\n');
    try {
        await migrateUserProfiles();
        await migrateEvents();
        await migrateRegistrations();
        await migrateSponsors();
        await migrateTestimonials();
        await migrateAchievements();
        await migrateAdminPermissions();
        await migrateContactQueries();
        console.log('\n🎉 Migration complete!');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await client.close();
        process.exit(0);
    }
}

main();
