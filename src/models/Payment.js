export const paymentTable = 'payments';

// Create a payment record (used by the initiate endpoint)
export const createPayment = async (supabase, paymentData) => {
  const { data, error } = await supabase.from(paymentTable).insert([paymentData]).select().single();
  if (error) throw error;
  return data;
};

// Update payment status and gateway response
export const updatePayment = async (supabase, paymentId, updates) => {
  const { data, error } = await supabase
    .from(paymentTable)
    .update(updates)
    .eq('id', paymentId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Fetch a payment by ID (owner or admin)
export const getPayment = async (supabase, paymentId, userId, isAdmin = false) => {
  let query = supabase.from(paymentTable).select('*').eq('id', paymentId);
  if (!isAdmin) query = query.eq('user_id', userId);
  const { data, error } = await query.single();
  if (error) throw error;
  return data;
};
