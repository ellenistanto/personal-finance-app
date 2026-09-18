// Vercel Serverless Function entry point
// This file imports the Express app from the backend directory
// The backend is written in CommonJS (require/module.exports)
const app = require('../backend/server.js');

// Export the Express app for Vercel's @vercel/node runtime
module.exports = app;
