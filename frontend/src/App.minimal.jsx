// frontend/src/App.minimal.jsx
// Minimal React test - no imports, just JSX
import React from 'react';

function MinimalApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>125Customs - Test Page</h1>
      <p>If you see this, React is working!</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}

export default MinimalApp;
