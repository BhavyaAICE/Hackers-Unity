// TypeScript types matching MongoDB API responses
// Replaces src/integrations/supabase/types.ts

export interface ApiUser {
    id: string;
    email: string;
    fullName: string;
    avatarUrl: string;
    isAdmin: boolean;
    createdAt?: string;
}

export interface ApiEvent {
    _id: string;
    title: string;
    subtitle?: string;
    description?: string;
    eventType: 'conference' | 'workshop' | 'meetup' | 'hackathon' | 'seminar' | 'other';
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    eventDate?: string;
    eventEndDate?: string;
    registrationDeadline?: string;
    durationDays?: number;
    timing?: string;
    locationType?: string;
    locationName?: string;
    locationAddress?: string;
    bannerImage?: string;
    thumbnailImage?: string;
    prizePool?: string;
    maxParticipants?: number;
    benefits?: string[];
    registrationEnabled: boolean;
    registrationCount: number;
    externalLink?: string;
    tags?: string[];
    speakers?: ApiSpeaker[];
    scheduleItems?: ApiScheduleItem[];
    createdAt: string;
    updatedAt: string;
}

export interface ApiSpeaker {
    _id: string;
    name: string;
    title?: string;
    organization?: string;
    bio?: string;
    avatarUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
}

export interface ApiScheduleItem {
    _id: string;
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    speaker?: ApiSpeaker;
    day: number;
    displayOrder: number;
}

export interface ApiHackathon {
    _id: string;
    title: string;
    subtitle?: string;
    description?: string;
    status: 'upcoming' | 'registration_open' | 'ongoing' | 'judging' | 'completed' | 'cancelled';
    startDate?: string;
    endDate?: string;
    registrationDeadline?: string;
    locationType?: string;
    locationName?: string;
    bannerImage?: string;
    thumbnailImage?: string;
    prizePool?: string;
    firstPrize?: string;
    secondPrize?: string;
    thirdPrize?: string;
    maxParticipants?: number;
    maxTeamSize: number;
    minTeamSize: number;
    registrationEnabled: boolean;
    registrationCount: number;
    themes?: string[];
    tags?: string[];
    technologies?: string[];
    externalLink?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiHackathonChallenge {
    _id: string;
    hackathon: string;
    title: string;
    description?: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    points: number;
    category?: string;
    tags?: string[];
    isActive: boolean;
    displayOrder: number;
}

export interface ApiEventRegistration {
    _id: string;
    event: string | ApiEvent;
    user: string | ApiUser;
    fullName: string;
    email: string;
    phone?: string;
    organization?: string;
    designation?: string;
    status: 'registered' | 'waitlisted' | 'cancelled' | 'attended';
    registeredAt: string;
}

export interface ApiSponsor {
    _id: string;
    name: string;
    logoUrl: string;
    websiteUrl?: string;
    tier: 'title' | 'gold' | 'silver' | 'bronze' | 'partner' | 'media';
    displayOrder: number;
    isActive: boolean;
}

export interface ApiTestimonial {
    _id: string;
    name: string;
    role: string;
    organization?: string;
    testimonial: string;
    avatarUrl?: string;
    rating: number;
    isFeatured: boolean;
    displayOrder: number;
    isActive: boolean;
}

export interface ApiAchievement {
    _id: string;
    title: string;
    description?: string;
    iconUrl?: string;
    category?: string;
    statsValue?: string;
    statsLabel?: string;
    displayOrder: number;
    isActive: boolean;
}

export interface ApiPermissions {
    is_super_admin: boolean;
    can_view_dashboard: boolean;
    can_manage_events: boolean;
    can_manage_hackathons: boolean;
    can_view_registrations: boolean;
    can_export_data: boolean;
    can_manage_sponsors: boolean;
    can_manage_testimonials: boolean;
    can_manage_content: boolean;
    can_manage_achievements: boolean;
    can_view_contact_queries: boolean;
    can_manage_users: boolean;
}

export interface ApiAdminPermission {
    _id: string;
    user?: ApiUser;
    email: string;
    canViewDashboard: boolean;
    canManageEvents: boolean;
    canManageHackathons: boolean;
    canViewRegistrations: boolean;
    canExportData: boolean;
    canManageSponsors: boolean;
    canManageTestimonials: boolean;
    canManageContent: boolean;
    canManageAchievements: boolean;
    canViewContactQueries: boolean;
    canManageUsers: boolean;
    isActive: boolean;
    inviteToken?: string;
    createdAt: string;
}

// Auth response
export interface AuthResponse {
    token: string;
    user: ApiUser;
}
