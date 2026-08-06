import { supabase } from '@/lib/db';
import { successResponse, errorResponse, createdResponse } from '@/utils/apiResponse';
import { getThread, updateThread, deleteThread, addReply, getReplies, voteThread } from '@/models/Thread';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const thread = await getThread(supabase, id);
    const replies = await getReplies(supabase, id);
    return successResponse('Thread fetched', { thread, replies });
  } catch (err) {
    console.error('Thread GET error:', err);
    return errorResponse('SERVER_ERR', 'Failed to fetch thread', 500);
  }
}

export async function PATCH(req, { params }) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing token', 401);
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return errorResponse('AUTH_001', 'Invalid token', 401);

    const { id } = params;
    const body = await req.json();
    const updated = await updateThread(supabase, id, body);
    return successResponse('Thread updated', updated);
  } catch (err) {
    console.error('Thread PATCH error:', err);
    return errorResponse('SERVER_ERR', 'Failed to update thread', 500);
  }
}

export async function DELETE(req, { params }) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing token', 401);
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return errorResponse('AUTH_001', 'Invalid token', 401);

    const { id } = params;
    // Verify ownership inside model (policy ensures) - just delete
    await deleteThread(supabase, id);
    return successResponse('Thread deleted');
  } catch (err) {
    console.error('Thread DELETE error:', err);
    return errorResponse('SERVER_ERR', 'Failed to delete thread', 500);
  }
}

// Sub-route for replies
export async function POST(req, { params }) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing token', 401);
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return errorResponse('AUTH_001', 'Invalid token', 401);

    const { id } = params; // thread id
    const body = await req.json();
    const replyData = { ...body, thread_id: id, author_id: user.id };
    const reply = await addReply(supabase, replyData);
    return createdResponse('Reply added', reply);
  } catch (err) {
    console.error('Reply POST error:', err);
    return errorResponse('SERVER_ERR', 'Failed to add reply', 500);
  }
}

// Voting endpoint
export async function PUT(req, { params }) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing token', 401);
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return errorResponse('AUTH_001', 'Invalid token', 401);

    const { id } = params; // thread id
    const { voteType } = await req.json(); // 1 or -1
    await voteThread(supabase, { threadId: id, userId: user.id, voteType });
    return successResponse('Vote recorded');
  } catch (err) {
    console.error('Vote error:', err);
    return errorResponse('SERVER_ERR', 'Failed to record vote', 500);
  }
}
