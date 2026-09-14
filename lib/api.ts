export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const finalUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
  
  const response = await fetch(finalUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    // This ensures cookies (including HttpOnly JWT) are sent across domains
    credentials: 'include', 
  });

  return response;
}

