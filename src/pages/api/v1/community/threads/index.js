import { supabase } from '@/lib/db';
import { successResponse, errorResponse, createdResponse } from '@/utils/apiResponse';
import { listThreads, getThread, createThread, updateThread, deleteThread, addReply, getReplies, voteThread } from '@/models/Thread';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const { threads, total } = await listThreads(supabase, { limit, offset, category, search });
    return successResponse('Threads fetched', threads, { total, page: Math.floor(offset/limit)+1, limit });
  } catch (err) {
    console.error('Threads GET error:', err);
    return errorResponse('SERVER_ERR', 'Failed to fetch threads', 500);
  }
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing token', 401);
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return errorResponse('AUTH_001', 'Invalid token', 401);

    const body = await req.json();
    const threadData = { ...body, author_id: user.id };
    const newThread = await createThread(supabase, threadData);
    return createdResponse('Thread created', newThread);
  } catch (err) {
    console.error('Threads POST error:', err);
    return errorResponse('SERVER_ERR', 'Failed to create thread', 500);
  }
}
