import { supabase } from '@/lib/db';
import { successResponse, errorResponse } from '@/utils/apiResponse';

export async function GET(req) {
  try {
    // Extract JWT from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing or invalid token', 401);
    }
    const token = authHeader.split(' ')[1];

    // Verify user with Supabase using the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return errorResponse('AUTH_001', 'Invalid authentication token', 401);
    }

    // Fetch the extended profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return errorResponse('NOT_FOUND', 'User profile not found', 404);
    }

    return successResponse('Profile retrieved successfully', {
      user_id: user.id,
      email: user.email,
      profile
    });
  } catch (err) {
    console.error('Profile GET error:', err);
    return errorResponse('SERVER_ERR', 'Internal server error', 500);
  }
}

export async function PATCH(req) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing or invalid token', 401);
    }
    const token = authHeader.split(' ')[1];

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return errorResponse('AUTH_001', 'Invalid authentication token', 401);
    }

    // Parse request body for profile updates
    const body = await req.json();
    const allowedUpdates = ['full_name', 'phone', 'avatar_url', 'preferred_language', 'travel_preferences', 'emergency_contact'];
    const updates = {};
    
    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse('BAD_REQUEST', 'No valid fields provided for update', 400);
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      return errorResponse('UPDATE_ERR', updateError.message, 500);
    }

    return successResponse('Profile updated successfully', updatedProfile);
  } catch (err) {
    console.error('Profile PATCH error:', err);
    return errorResponse('SERVER_ERR', 'Internal server error', 500);
  }
}
