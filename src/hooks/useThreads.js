import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/db';
import useRealtime from './useRealtime';

/**
 * useThreads – Fetch threads with pagination, search, category filtering
 * and real-time subscription for new threads/replies.
 *
 * @param {object} opts
 * @param {number}  opts.limit    – items per page (default 20)
 * @param {string}  opts.category – optional category filter
 * @param {string}  opts.search   – optional keyword search
 * @param {boolean} opts.enabled  – skip fetching when false
 */
export const useThreads = ({ limit = 20, category = null, search = null, enabled = true } = {}) => {
  const [threads, setThreads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const offset = (page - 1) * limit;

  const fetchThreads = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('threads')
        .select('*, author:author_id (id, avatar_url, username, full_name)', { count: 'exact' })
        .eq('is_hidden', false)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (category) query = query.eq('category', category);
      if (search) query = query.ilike('title', `%${search}%`);

      const { data, error: fetchErr, count } = await query;
      if (fetchErr) throw fetchErr;
      setThreads(data || []);
      setTotal(count || 0);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [offset, limit, category, search, enabled]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  // Real-time: prepend new threads on INSERT
  useRealtime({
    table: 'threads',
    event: 'INSERT',
    enabled,
    onNew: (newThread) => {
      setThreads((prev) => [newThread, ...prev]);
      setTotal((prev) => prev + 1);
    },
  });

  // Real-time: update thread on UPDATE (e.g. vote count changes, hide)
  useRealtime({
    table: 'threads',
    event: 'UPDATE',
    enabled,
    onNew: (updated) => {
      if (updated.is_hidden) {
        setThreads((prev) => prev.filter((t) => t.id !== updated.id));
        setTotal((prev) => Math.max(0, prev - 1));
      } else {
        setThreads((prev) => prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
      }
    },
  });

  const totalPages = Math.ceil(total / limit);

  return {
    threads,
    total,
    page,
    totalPages,
    setPage,
    loading,
    error,
    refetch: fetchThreads,
  };
};

export default useThreads;
