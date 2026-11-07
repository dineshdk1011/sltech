'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';

import type { AllowedUserRecord, CurrentUserSnapshot } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const UserContext = createContext<CurrentUserSnapshot | null>(null);

function isActiveUser(user: AllowedUserRecord | null): boolean {
  return (
    user?.is_active === true ||
    String(user?.is_active).toLowerCase() === 'true'
  );
}

export function UserProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: CurrentUserSnapshot;
}) {
  const [currentUser, setCurrentUser] = useState(initialUser);

  useEffect(() => {
    const supabase = createClient();
    let requestId = 0;
    let currentAuthUserId = initialUser.authUser?.id ?? null;

    const updateUser = async (authUser: User | null): Promise<void> => {
      const request = ++requestId;
      currentAuthUserId = authUser?.id ?? null;

      if (!authUser?.email) {
        setCurrentUser({
          authUser,
          allowedUser: null,
          allowedUserId: null,
          name: '',
          email: '',
          loading: false,
          allowedUserError: false,
        });
        return;
      }

      const email = authUser.email.trim().toLowerCase();
      setCurrentUser({
        authUser,
        allowedUser: null,
        allowedUserId: null,
        name: '',
        email,
        loading: true,
        allowedUserError: false,
      });

      const { data, error } = await supabase
        .from('allowed_users')
        .select('id, email, name, is_active')
        .ilike('email', email)
        .limit(1)
        .maybeSingle();

      if (request !== requestId) return;

      const allowedUser = data as AllowedUserRecord | null;
      const isActive = !error && isActiveUser(allowedUser);

      setCurrentUser({
        authUser,
        allowedUser,
        allowedUserId: isActive ? allowedUser?.id ?? null : null,
        name: isActive ? String(allowedUser?.name || email) : '',
        email,
        loading: false,
        allowedUserError: Boolean(error),
      });
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const authUser = session?.user ?? null;

      if (
        (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') &&
        (authUser?.id ?? null) === currentAuthUserId
      ) {
        return;
      }

      void updateUser(authUser);
    });

    return () => {
      requestId += 1;
      subscription.unsubscribe();
    };
  }, [initialUser.authUser?.id]);

  return (
    <UserContext.Provider value={currentUser}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser(): CurrentUserSnapshot {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useCurrentUser must be used within a UserProvider');
  }

  return context;
}