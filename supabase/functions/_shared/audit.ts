/**
 * audit.ts – Audit log helper for Supabase Edge Functions
 * Writes to public.audit_logs using service_role client
 */

import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export type ActionType = 'create' | 'update' | 'delete' | 'login' | 'payment' | 'cancel'
export type EntityType = 'booking' | 'tour' | 'profile' | 'payment' | 'wallet'

interface AuditEntry {
  actor_id?: string | null
  action_type: ActionType
  entity_type: EntityType
  entity_id?: string | null
  old_data?: Record<string, unknown> | null
  new_data?: Record<string, unknown> | null
  ip_address?: string | null
}

/**
 * Write an audit log entry. Silently ignores errors to avoid blocking the main flow.
 */
export async function writeAuditLog(
  adminClient: SupabaseClient,
  entry: AuditEntry,
): Promise<void> {
  try {
    await adminClient.from('audit_logs').insert({
      actor_id: entry.actor_id ?? null,
      action_type: entry.action_type,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id ?? null,
      old_data: entry.old_data ?? null,
      new_data: entry.new_data ?? null,
      ip_address: entry.ip_address ?? null,
    })
  } catch (err) {
    console.error('[audit] Failed to write audit log:', err)
  }
}
