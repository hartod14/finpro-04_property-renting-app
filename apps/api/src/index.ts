// Import app without module-alias
import App from './app';

// Create app instance
const app = new App();

// Start server for local development (not needed for Vercel)
if (process.env.NODE_ENV === 'local') {
  app.start();
}

// Export Express app for Vercel
export default app.getApp();
