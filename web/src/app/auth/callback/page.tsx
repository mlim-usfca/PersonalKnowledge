'use client';

import { useEffect } from 'react';
import { useAuth } from '@/app/auth/provider';
import { useRouter } from 'next/navigation';

const AuthCallback = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const url = new URL(window.location.href);
      const hashParams = new URLSearchParams(url.hash.substr(1)); // remove the '#' at the start
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      if (accessToken && refreshToken) {
        localStorage.setItem('sb-access-token', accessToken);
        localStorage.setItem('sb-refresh-token', refreshToken);
        try {
          if (isAuthenticated) {
            alert('Signed in successfully!');
            router.push('/dashboard');
          } else {
            router.push('/');
          }
        } catch (error) {
          console.error('Error during OAuth callback:', error);
          router.push('/');
        }
      } else {
        console.error('No access token or refresh token found');
        router.push('/');
      }
    };

    handleCallback();
  }, [router, isAuthenticated]);

  return <div>Redirecting...</div>;
};

export default AuthCallback;