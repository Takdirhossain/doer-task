const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

connectDB().then(() => {
  server.listen(PORT, HOST, () => {
    console.log(` Server running on http://${HOST}:${PORT}`);
  });
}).catch((err) => {
  console.error(' Failed to start server:', err);
});
