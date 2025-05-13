import App from './app';

const app = new App();
app.start();

// Export the Express app for Vercel serverless functions
export default app.getApp();
