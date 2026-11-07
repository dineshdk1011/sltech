import type { User } from '@supabase/supabase-js';

export interface headerListType {
  name: string;
  id: number;
  path: string;
}

export interface AllowedUserRecord {
  id: string | number;
  email?: string | null;
  name?: string | null;
  is_active?: boolean | string | null;
}

export interface CurrentUserSnapshot {
  authUser: User | null;
  allowedUser: AllowedUserRecord | null;
  allowedUserId: string | number | null;
  name: string;
  email: string;
  loading: boolean;
  allowedUserError: boolean;
}