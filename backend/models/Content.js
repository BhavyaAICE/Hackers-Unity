import mongoose from 'mongoose';

const sponsorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
    websiteUrl: String,
    tier: {
        type: String,
        enum: ['platinum', 'title', 'gold', 'silver', 'bronze', 'partner', 'media'],
        default: 'partner',
    },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    organization: String,
    testimonial: { type: String, required: true },
    avatarUrl: String,
    rating: { type: Number, default: 5, min: 1, max: 5 },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const websiteContentSchema = new mongoose.Schema({
    sectionKey: { type: String, required: true, unique: true },
    title: String,
    subtitle: String,
    description: String,
    content: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const achievementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    iconUrl: String,
    category: String,
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    year: Number,
    statsValue: String,
    statsLabel: String,
}, { timestamps: true });

const contactQuerySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: String,
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'done', 'new', 'in_progress', 'resolved'],
        default: 'pending',
    },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: Date,
}, { timestamps: true });

export const Sponsor = mongoose.model('Sponsor', sponsorSchema);
export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export const WebsiteContent = mongoose.model('WebsiteContent', websiteContentSchema);
export const Achievement = mongoose.model('Achievement', achievementSchema);
export const ContactQuery = mongoose.model('ContactQuery', contactQuerySchema);
