const serverless = require("serverless-http");

// IMPORTANT: load compiled app, not TS source
const app = require("../dist/src/app.js").app;

module.exports = serverless(app);
