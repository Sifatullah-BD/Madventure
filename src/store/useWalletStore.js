/**
 * useWalletStore.js – Client-side wallet ledger state using Zustand
 * Mirrors the Supabase wallet table and provides optimistic UI updates.
 * Never modifies the real ledger – mutations go through paymentService.
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

const useWalletStore = create(
    devtools(
        (set, get) => ({
            balance: 0,
            currency: 'BDT',
            transactions: [],
            loading: false,
            error: null,

            // Fetch wallet and recent ledger entries from Supabase
            fetchWallet: async (userId) => {
                set({ loading: true, error: null });
                try {
                    // Wallet balance
                    const { data: wallet, error: wErr } = await supabase
                        .from('wallets')
                        .select('current_balance, currency')
                        .eq('user_id', userId)
                        .maybeSingle();

                    if (wErr) throw wErr;

                    // Recent ledger
                    const { data: ledger, error: lErr } = await supabase
                        .from('wallet_ledger')
                        .select('*')
                        .eq('wallet_id', wallet?.id || '')
                        .order('created_at', { ascending: false })
                        .limit(20);

                    set({
                        balance: wallet?.current_balance ?? 0,
                        currency: wallet?.currency ?? 'BDT',
                        transactions: ledger || [],
                        loading: false,
                    });
                } catch (err) {
                    set({ error: err.message, loading: false });
                }
            },

            // Optimistic debit (show immediately, rollback on failure)
            optimisticDebit: (amount, remark) => {
                const prev = get().balance;
                set(state => ({
                    balance: Math.max(0, state.balance - amount),
                    transactions: [{
                        id: `opt_${Date.now()}`,
                        debit: amount,
                        credit: 0,
                        balance_after: Math.max(0, state.balance - amount),
                        remarks: remark,
                        created_at: new Date().toISOString(),
                        _optimistic: true,
                    }, ...state.transactions],
                }));
                // Return rollback fn
                return () => set({ balance: prev });
            },

            // Optimistic credit
            optimisticCredit: (amount, remark) => {
                const prev = get().balance;
                set(state => ({
                    balance: state.balance + amount,
                    transactions: [{
                        id: `opt_${Date.now()}`,
                        debit: 0,
                        credit: amount,
                        balance_after: state.balance + amount,
                        remarks: remark,
                        created_at: new Date().toISOString(),
                        _optimistic: true,
                    }, ...state.transactions],
                }));
                return () => set({ balance: prev });
            },

            // Replace optimistic entries with confirmed server data
            confirmTransactions: (serverTransactions) => set(state => ({
                transactions: [
                    ...serverTransactions,
                    ...state.transactions.filter(t => !t._optimistic),
                ],
            })),

            reset: () => set({ balance: 0, currency: 'BDT', transactions: [], loading: false, error: null }),
        }),
        { name: 'WalletStore' }
    )
);

export default useWalletStore;
