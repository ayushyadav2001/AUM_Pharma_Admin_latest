// src/components/AuthWrapper.tsx
'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import Loader from '@/views/Loader/Loader';




interface AuthWrapperProps {
  children: any;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
      router.push('/en/login');
    } else {
      setLoading(false); // Continue rendering if token is present
    }
  }, [router]);

  if (loading) {
    // Show loading spinner or placeholder
    return <Loader />;
  }

  // Render nothing or a loading spinner while checking auth
  // Optionally, add a loading state or fallback UI
  return <>{children}</>;
};

export default AuthWrapper;
