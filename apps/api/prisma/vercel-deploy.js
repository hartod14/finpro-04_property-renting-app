// This file is used by Vercel to handle Prisma deployment

const { execSync } = require('child_process');

// Run Prisma generate
console.log('Running Prisma Generate...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma Generate completed successfully');
} catch (error) {
  console.error('Prisma Generate failed:', error);
  process.exit(1);
}

// No need to run migrations in a serverless environment
// Your database should be managed separately
console.log('Prisma deployment script completed'); 