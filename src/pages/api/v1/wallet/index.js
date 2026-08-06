import { supabase } from '@/lib/db';
import { successResponse, errorResponse } from '@/utils/apiResponse';

export async function GET(req) {
  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing or invalid token', 401);
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return errorResponse('AUTH_001', 'Invalid authentication token', 401);
    }

    // Get wallet
    const { data: wallet, error: walletErr } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (walletErr || !wallet) {
      return errorResponse('WALLET_ERR', 'Wallet not found', 404);
    }

    // Get recent transactions (last 20)
    const { data: transactions, error: txErr } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', wallet.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (txErr) {
      return errorResponse('SERVER_ERR', txErr.message, 500);
    }

    return successResponse('Wallet fetched successfully', {
      balance: wallet.balance,
      currency: wallet.currency,
      transactions
    });
  } catch (err) {
    console.error('Wallet GET error:', err);
    return errorResponse('SERVER_ERR', 'Failed to fetch wallet', 500);
  }
}
