import mongoose from 'mongoose';

const hackathonChallengeSchema = new mongoose.Schema({
    hackathon: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon', required: true },
    title: { type: String, required: true },
    description: String,
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'intermediate',
    },
    points: { type: Number, default: 0 },
    category: String,
    tags: [String],
    resources: [String],
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

const teamMemberSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    role: { type: String, default: 'member' },
    joinedAt: { type: Date, default: Date.now },
});

const teamSchema = new mongoose.Schema({
    hackathon: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon', required: true },
    name: { type: String, required: true },
    description: String,
    leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [teamMemberSchema],
    inviteCode: { type: String, unique: true, sparse: true },
    maxSize: { type: Number, default: 4 },
    isOpen: { type: Boolean, default: true },
    projectName: String,
    projectDescription: String,
    repositoryUrl: String,
    demoUrl: String,
}, { timestamps: true });

const submissionSchema = new mongoose.Schema({
    hackathon: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon', required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'HackathonChallenge' },
    title: { type: String, required: true },
    description: String,
    repositoryUrl: String,
    demoUrl: String,
    presentationUrl: String,
    videoUrl: String,
    screenshots: [String],
    techStack: [String],
    status: {
        type: String,
        enum: ['submitted', 'under_review', 'accepted', 'rejected'],
        default: 'submitted',
    },
    score: Number,
    feedback: String,
    submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const hackathonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: String,
    description: String,
    status: {
        type: String,
        enum: ['upcoming', 'registration_open', 'ongoing', 'judging', 'completed', 'cancelled'],
        default: 'upcoming',
    },
    startDate: Date,
    endDate: Date,
    registrationDeadline: Date,

    locationType: String,
    locationName: String,
    locationAddress: String,

    bannerImage: String,
    thumbnailImage: String,

    prizePool: String,
    firstPrize: String,
    secondPrize: String,
    thirdPrize: String,
    maxParticipants: Number,
    maxTeamSize: { type: Number, default: 4 },
    minTeamSize: { type: Number, default: 1 },

    registrationEnabled: { type: Boolean, default: true },
    registrationCount: { type: Number, default: 0 },

    themes: [String],
    tags: [String],
    technologies: [String],
    externalLink: String,
    rulesUrl: String,

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const HackathonChallenge = mongoose.model('HackathonChallenge', hackathonChallengeSchema);
export const Team = mongoose.model('Team', teamSchema);
export const Submission = mongoose.model('Submission', submissionSchema);
export const Hackathon = mongoose.model('Hackathon', hackathonSchema);
