// Simple SPA server for React Router (handles client-side routing)
const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - return index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ SPA server running at http://localhost:${PORT}`);
  console.log(`   (All routes return index.html for React Router)`);
});
