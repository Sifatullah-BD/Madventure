/**
 * Canonical app roles (lowercase) align with `profiles.app_role` in Supabase.
 * UI may still use legacy display strings on mock users (e.g. "Admin").
 */

const ADMIN = new Set(['admin', 'super_admin']);
const AGENCY_PORTAL = new Set(['agency', 'admin', 'super_admin', 'hotel_owner']);

export function normalizeAppRole(user) {
    if (!user) return 'traveler';
    const raw =
        user.app_role ??
        user.appRole ??
        user.role ??
        (user.user_metadata && user.user_metadata.role) ??
        'traveler';
    return String(raw).trim().toLowerCase();
}

export function hasAdminAccess(user) {
    return ADMIN.has(normalizeAppRole(user));
}

export function hasAgencyPortalAccess(user) {
    return AGENCY_PORTAL.has(normalizeAppRole(user));
}

export function displayRoleFromAppRole(appRole) {
    const r = String(appRole || 'traveler').toLowerCase();
    const map = {
        traveler: 'Traveler',
        agency: 'Agency',
        hotel_owner: 'Hotel Owner',
        guide: 'Guide',
        partner: 'Partner',
        moderator: 'Moderator',
        admin: 'Admin',
        super_admin: 'Admin',
    };
    return map[r] || 'Traveler';
}
