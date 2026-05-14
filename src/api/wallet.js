import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function ensureWallet(userId) {
    if (!isSupabaseConfigured || !userId) {
        return { data: null, error: new Error('Supabase not configured') };
    }
    const { data: existing, error: selErr } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
    if (selErr) return { data: null, error: selErr };
    if (existing) return { data: existing, error: null };

    const { data, error } = await supabase
        .from('wallets')
        .insert([{ user_id: userId }])
        .select()
        .single();
    return { data, error };
}

export async function getWalletLedger(walletId, limit = 50) {
    if (!isSupabaseConfigured || !walletId) {
        return { data: [], error: null };
    }
    const { data, error } = await supabase
        .from('wallet_ledger')
        .select('*')
        .eq('wallet_id', walletId)
        .order('created_at', { ascending: false })
        .limit(limit);
    return { data: data || [], error };
}

export async function getWalletBalance(userId) {
    if (!isSupabaseConfigured || !userId) {
        return { data: 0, error: null };
    }
    const { data, error } = await supabase
        .from('wallets')
        .select('current_balance')
        .eq('user_id', userId)
        .maybeSingle();
    return { data: data?.current_balance || 0, error };
}
