/**
 * rbac.ts – RBAC middleware for Supabase Edge Functions
 * Usage: const user = await requireRole(req, supabaseAdmin, ['admin', 'super_admin'])
 */

import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export type AppRole =
  | 'traveler'
  | 'agency'
  | 'hotel_owner'
  | 'guide'
  | 'partner'
  | 'moderator'
  | 'admin'
  | 'super_admin'

export interface AuthUser {
  id: string
  email: string | undefined
  app_role: AppRole
}

const ROLE_HIERARCHY: Record<AppRole, number> = {
  traveler: 0,
  guide: 1,
  partner: 1,
  hotel_owner: 2,
  agency: 2,
  moderator: 3,
  admin: 4,
  super_admin: 5,
}

/**
 * Authenticate the request and assert the user has one of the allowed roles.
 * Throws a Response with the appropriate HTTP status on failure.
 */
export async function requireRole(
  req: Request,
  adminClient: SupabaseClient,
  allowedRoles: AppRole[],
): Promise<AuthUser> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Verify JWT with Supabase
  const anonClient = adminClient // we'll use getUser with service role client
  const { data, error } = await adminClient.auth.getUser(authHeader.replace('Bearer ', ''))

  if (error || !data?.user) {
    throw new Response(JSON.stringify({ error: 'Invalid or expired session' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const authUser = data.user

  // Fetch role from profiles table
  const { data: profile, error: profileErr } = await adminClient
    .from('profiles')
    .select('app_role')
    .eq('id', authUser.id)
    .maybeSingle()

  const role = (profile?.app_role ?? 'traveler') as AppRole

  const minRequiredLevel = Math.min(...allowedRoles.map(r => ROLE_HIERARCHY[r]))
  if (ROLE_HIERARCHY[role] < minRequiredLevel) {
    throw new Response(
      JSON.stringify({
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: role,
      }),
      { status: 403, headers: { 'Content-Type': 'application/json' } },
    )
  }

  return {
    id: authUser.id,
    email: authUser.email,
    app_role: role,
  }
}

/**
 * Lightweight auth check – just verifies the JWT without role enforcement.
 */
export async function requireAuth(
  req: Request,
  adminClient: SupabaseClient,
): Promise<AuthUser> {
  return requireRole(req, adminClient, ['traveler'])
}
