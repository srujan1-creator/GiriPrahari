// apiClient.ts
// Handles API requests and gracefully bypasses local server calls when deployed on Vercel to prevent Mixed Content errors.

export const safeFetch = async (url: string, options: RequestInit) => {
  // If we are deployed on Vercel (or any non-localhost HTTPS site), 
  // bypass HTTP localhost fetches to prevent browser Mixed Content errors.
  if (window.location.hostname !== 'localhost' && url.includes('localhost')) {
    return Promise.reject(new Error('Vercel production mode: Local telephony backend bypassed. Triggering local simulation.'));
  }
  
  return fetch(url, options);
};
