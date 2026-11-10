'use client';

import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleLogin = async (): Promise<void> => {
    if (isLoading) return;

    if (!isSupabaseConfigured()) {
      setErrorMessage(
        'Engineer sign-in is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local.',
      );
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/`,
        },
      });

      if (error) {
        console.error('Google sign-in failed:', error);
        setErrorMessage('We could not start Google sign-in. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setErrorMessage('We could not start Google sign-in. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        aria-label="Continue with Google"
        className="inline-flex h-10 w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#002B8B] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B8B] focus-visible:ring-offset-2 active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleMark />
        {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
        <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
      </button>

      {errorMessage && (
        <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M21.35 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.7 2.92-4.2 2.92-7.2Z" />
      <path fill="#34A853" d="M12 21.67c2.63 0 4.84-.87 6.45-2.37l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.5A9.74 9.74 0 0 0 12 21.67Z" />
      <path fill="#FBBC05" d="M6.53 13.76a5.85 5.85 0 0 1 0-3.52v-2.5H3.28a9.75 9.75 0 0 0 0 8.52l3.25-2.5Z" />
      <path fill="#EA4335" d="M12 6.21c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.3 14.63 2.33 12 2.33a9.74 9.74 0 0 0-8.72 5.41l3.25 2.5C7.3 7.93 9.46 6.21 12 6.21Z" />
    </svg>
  );
}