// Vercel adapter for API deployment
const express = require('express');
const cors = require('cors');

// Create a basic Express app for Vercel
const app = express();
app.use(express.json());
app.use(cors());

// Basic health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: "Welcome to Stayza Renting Property API!" });
});

// Redirect to documentation or provide info about the API
app.use('*', (req, res) => {
  res.status(200).json({
    message: "Stayza API server is running. Please use the correct endpoints.",
    status: "online",
    endpoints: ["/api", "/api/auth", "/api/property", "/api/city"]
  });
});

// Export the Express app for Vercel
module.exports = app; 