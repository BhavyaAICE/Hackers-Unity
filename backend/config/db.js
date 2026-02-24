import mongoose from 'mongoose';

// Cache the connection promise across serverless warm invocations
let connectionPromise = null;

const connectDB = async () => {
    // If already connected, reuse the connection
    if (mongoose.connection.readyState === 1) return;

    // If a connection attempt is in progress, wait for it
    if (connectionPromise) return connectionPromise;

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set.');
    }

    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000, // fail fast on Vercel cold starts
    }).then((conn) => {
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        connectionPromise = null;
    }).catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        connectionPromise = null;
        // Do NOT call process.exit(1) in serverless — it kills the container.
        // Throw so the API route returns a 500 instead of hanging.
        throw error;
    });

    return connectionPromise;
};

export default connectDB;
