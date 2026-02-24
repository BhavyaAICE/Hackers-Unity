import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    organization: String,
    designation: String,
    customFields: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
    status: {
        type: String,
        enum: ['registered', 'waitlisted', 'cancelled', 'attended'],
        default: 'registered',
    },
    registeredAt: { type: Date, default: Date.now },
});

// Ensure one registration per user per event
eventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);
export default EventRegistration;
