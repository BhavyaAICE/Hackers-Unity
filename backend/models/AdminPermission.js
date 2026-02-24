import mongoose from 'mongoose';

const adminPermissionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, required: true, unique: true, lowercase: true },
    // Granular permissions (mirrors admin_permissions table)
    canViewDashboard: { type: Boolean, default: false },
    canManageEvents: { type: Boolean, default: false },
    canManageHackathons: { type: Boolean, default: false },
    canViewRegistrations: { type: Boolean, default: false },
    canExportData: { type: Boolean, default: false },
    canManageSponsors: { type: Boolean, default: false },
    canManageTestimonials: { type: Boolean, default: false },
    canManageContent: { type: Boolean, default: false },
    canManageAchievements: { type: Boolean, default: false },
    canViewContactQueries: { type: Boolean, default: false },
    canManageUsers: { type: Boolean, default: false },
    // Invite flow
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    inviteToken: { type: String, unique: true, sparse: true },
    inviteAcceptedAt: Date,
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const AdminPermission = mongoose.model('AdminPermission', adminPermissionSchema);
export default AdminPermission;
