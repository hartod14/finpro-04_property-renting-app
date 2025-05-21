/** @format */

import nodemailer from "nodemailer";
import { node_account } from "../config";

// Create a single reusable transporter instance
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    ...node_account,
  },
  // Add connection pool settings
  pool: true,
  maxConnections: 5,
  // Set reasonable timeouts (in milliseconds)
  connectionTimeout: 10000,
  socketTimeout: 30000,
  // Add logger for debugging in development
  ...(process.env.NODE_ENV !== "production" && {
    logger: true
  })
});

// Verify connection configuration at startup
transporter.verify(function(error, success) {
  if (error) {
  } else {
  }
});

// Helper function with retry mechanism
export const sendEmailWithRetry = async (mailOptions: nodemailer.SendMailOptions, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await transporter.sendMail(mailOptions);
    } catch (error) {
      lastError = error;
      
      // Add exponential backoff between retries
      if (attempt < maxRetries) {
        const delay = 1000 * Math.pow(2, attempt); // 2s, 4s, 8s...
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};
