import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// PWA service worker (VitePWA handles registration in production builds)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // No manual registration needed; keep hook for future custom logic
  });
}