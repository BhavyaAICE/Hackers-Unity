// Vercel Serverless Bridge
// Vercel requires serverless function entry points to live in the /api directory.
// This file simply re-exports the Express app from the backend so Vercel can
// invoke it as a serverless function. All relative imports inside backend/server.js
// still resolve correctly relative to their own file location.
export { default } from '../backend/server.js';
