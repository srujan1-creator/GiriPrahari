import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Global Fetch Interceptor to prevent Mixed Content errors on Vercel
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : '');
  if (window.location.hostname !== 'localhost' && url.includes('localhost:3001')) {
    console.log('[API Bypassed] Simulating local backend response for Vercel deployment:', url);
    return Promise.resolve(new Response(JSON.stringify({ 
      success: false, 
      requiresSetup: true,
      mode: 'SIMULATION_FALLBACK',
      message: 'Running on Vercel without local backend.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
