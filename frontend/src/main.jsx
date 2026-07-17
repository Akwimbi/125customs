import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('Main.jsx loading...');

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error rendering App:', error);
  document.getElementById('root').innerHTML = `<h1 style="color: red;">Error: ${error.message}</h1>`;
}
