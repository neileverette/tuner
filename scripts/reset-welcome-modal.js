#!/usr/bin/env node

/**
 * Reset Welcome Modal Script
 *
 * This script creates an HTML file that will clear the welcome modal dismissal flag
 * and reload the page. Just open the generated file in your browser.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Reset Welcome Modal</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #1a1a1a;
      color: #fff;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    button {
      background: #007bff;
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 1rem;
    }
    button:hover {
      background: #0056b3;
    }
    .info {
      margin-top: 2rem;
      opacity: 0.7;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Welcome Modal</h1>
    <p>Click the button below to reset the welcome modal on localhost:5173</p>
    <button onclick="resetWelcome()">Reset Welcome Modal</button>
    <p class="info">This will open tunr and show the welcome modal again</p>
  </div>
  
  <script>
    function resetWelcome() {
      // Open the app in a new window
      const appWindow = window.open('http://localhost:5173', '_blank');
      
      // Wait a moment for the page to load, then reset the flag
      setTimeout(() => {
        try {
          appWindow.localStorage.removeItem('tuner-welcome-dismissed');
          appWindow.location.reload();
          alert('Welcome modal reset! Check the tunr window.');
        } catch (e) {
          alert('Please manually open http://localhost:5173 and the welcome modal will appear on first visit.');
        }
      }, 1000);
    }
  </script>
</body>
</html>`;

const outputPath = path.join(__dirname, '..', 'reset-welcome.html');
fs.writeFileSync(outputPath, htmlContent);

console.log('✅ Created reset-welcome.html');
console.log('📂 Location:', outputPath);
console.log('\n🚀 To reset the welcome modal:');
console.log('   1. Open reset-welcome.html in your browser');
console.log('   2. Click the "Reset Welcome Modal" button');
console.log('   3. The welcome modal will appear in tunr\n');

// Made with Bob
