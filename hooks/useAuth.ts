import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  // Add other fields based on UserResponse
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetchWithAuth('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch auth', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const loginRedirect = () => {
    // Redirect to the main app's login page
    const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL || 'http://localhost:5173/login';
    // Optionally pass a return URL to come back to this app after login
    // window.location.href = `${loginUrl}?returnUrl=${encodeURIComponent(window.location.href)}`;
    window.location.href = loginUrl;
  };

  return { user, loading, loginRedirect };
}

