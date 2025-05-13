// This file is used for Vercel dev environment
// The actual TypeScript code will be compiled to dist/index.js for production

// Use require instead of import for Node.js compatibility
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

// Export the Express API
module.exports = app; 