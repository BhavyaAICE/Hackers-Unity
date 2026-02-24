import mongoose from 'mongoose';

const speakerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: String,
    organization: String,
    bio: String,
    avatarUrl: String,
    linkedinUrl: String,
    twitterUrl: String,
    websiteUrl: String,
}, { timestamps: true });

const scheduleItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    startTime: String,
    endTime: String,
    scheduleDate: String,
    day: { type: Number, default: 1 },
    displayOrder: { type: Number, default: 0 },
});

// ─── Hackathon-specific sub-document schemas ────────────────────────────────

const challengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    detailedDescription: String,
    icon: String,
    imageUrl: String,
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
});

const mentorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: String,
    organization: String,
    avatarUrl: String,
    linkedinUrl: String,
    bio: String,
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
});

const jurySchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: String,
    organization: String,
    avatarUrl: String,
    linkedinUrl: String,
    bio: String,
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
});

const prizeSchema = new mongoose.Schema({
    position: String,
    title: String,
    prizeAmount: String,
    description: String,
    iconUrl: String,
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
});

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: String,
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
});

const winnerSchema = new mongoose.Schema({
    position: String,
    teamName: String,
    projectName: String,
    projectDescription: String,
    members: String,
    prizeWon: String,
    imageUrl: String,
    githubUrl: String,
    projectUrl: String,
    displayOrder: { type: Number, default: 0 },
});

// ─── Main Event Schema ──────────────────────────────────────────────────────

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: String,
    description: String,
    eventType: {
        type: String,
        enum: ['conference', 'workshop', 'meetup', 'hackathon', 'seminar', 'other'],
        default: 'conference',
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming',
    },
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

    prizePool: String,
    maxParticipants: Number,
    benefits: [String],
    benefitsText: String,

    registrationEnabled: { type: Boolean, default: true },
    registrationCount: { type: Number, default: 0 },

    externalLink: String,
    tags: [String],

    // Event speakers & schedule
    speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Speaker' }],
    schedule: [scheduleItemSchema],

    // Hackathon-specific embedded data
    challenges: [challengeSchema],
    mentors: [mentorSchema],
    jury: [jurySchema],
    prizes: [prizeSchema],
    faqs: [faqSchema],
    winners: [winnerSchema],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const Speaker = mongoose.model('Speaker', speakerSchema);
export const Event = mongoose.model('Event', eventSchema);
