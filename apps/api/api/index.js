// This file is used as the entry point for Vercel deployments
require('module-alias/register');

const app = require('../dist/src/index').default;

module.exports = app; 