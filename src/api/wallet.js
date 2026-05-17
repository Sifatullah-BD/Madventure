import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * WALLET API — Connected to Supabase `wallet` and `wallet_transactions` tables
 */

/**
 * Get or create wallet for a user
 */
export async function ensureWallet(userId) {
    if (!isSupabaseConfigured || !userId) {
        const local = JSON.parse(localStorage.getItem(`wallet_${userId}`) || '{"balance":0}');
        return { data: local, error: null };
    }

    const { data: existing, error: selErr } = await supabase
        .from('wallet')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (selErr) return { data: null, error: selErr };
    if (existing) return { data: existing, error: null };

    // Create new wallet
    const { data, error } = await supabase
        .from('wallet')
        .insert([{ user_id: userId, balance: 0 }])
        .select()
        .single();

    return { data, error };
}

/**
 * Get wallet balance for a user
 */
export async function getWalletBalance(userId) {
    if (!isSupabaseConfigured || !userId) {
        const local = JSON.parse(localStorage.getItem(`wallet_${userId}`) || '{"balance":0}');
        return { data: local.balance || 0, error: null };
    }

    const { data, error } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', userId)
        .maybeSingle();

    return { data: data?.balance || 0, error };
}

/**
 * Get wallet transaction history
 */
export async function getWalletTransactions(userId, limit = 50) {
    if (!isSupabaseConfigured || !userId) {
        const local = JSON.parse(localStorage.getItem(`wallet_txns_${userId}`) || '[]');
        return { data: local, error: null };
    }

    const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    return { data: data || [], error };
}

/**
 * Add a transaction and update balance
 */
export async function addTransaction(userId, amount, type, description, referenceId = null) {
    if (!isSupabaseConfigured || !userId) {
        const wallet = JSON.parse(localStorage.getItem(`wallet_${userId}`) || '{"balance":0}');
        const newBalance = (wallet.balance || 0) + amount;
        localStorage.setItem(`wallet_${userId}`, JSON.stringify({ balance: newBalance }));

        const txns = JSON.parse(localStorage.getItem(`wallet_txns_${userId}`) || '[]');
        txns.unshift({ id: Date.now(), user_id: userId, amount, type, description, created_at: new Date().toISOString() });
        localStorage.setItem(`wallet_txns_${userId}`, JSON.stringify(txns));

        return { data: { balance: newBalance }, error: null };
    }

    // Insert transaction
    const { error: txErr } = await supabase
        .from('wallet_transactions')
        .insert([{ user_id: userId, amount, type, description, reference_id: referenceId }]);

    if (txErr) return { data: null, error: txErr };

    // Update balance
    const { data: wallet } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', userId)
        .maybeSingle();

    const newBalance = (wallet?.balance || 0) + amount;

    const { data, error } = await supabase
        .from('wallet')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single();

    return { data, error };
}

/**
 * Recharge wallet (top up)
 */
export async function rechargeWallet(userId, amount) {
    return addTransaction(userId, amount, 'recharge', `Wallet recharged: ৳${amount}`);
}

/**
 * Deduct from wallet (payment)
 */
export async function deductFromWallet(userId, amount, description) {
    return addTransaction(userId, -amount, 'payment', description);
}

// Legacy alias
export async function getWalletLedger(userId, limit = 50) {
    return getWalletTransactions(userId, limit);
}
