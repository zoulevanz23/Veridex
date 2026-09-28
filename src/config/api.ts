// Base URL for the AI analysis backend
// Set via VITE_API_BASE_URL env var (e.g., http://localhost:5000 for local,
// or https://your-render-url.com for production)
const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string) || (import.meta.env.DEV ? 'http://localhost:5000' : '');
export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, ''); 