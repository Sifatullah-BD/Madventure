import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://znjnwdyrhwwbnvnkhfpu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuam53ZHlyaHd3Ym52bmtoZnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NzQ3MDIsImV4cCI6MjA4MDQ1MDcwMn0.Ng8EjxS_gYl4C1cQm7-GnxLMmxo4KCucCXQL_XjvMP8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkData() {
    const tables = ['divisions', 'districts', 'places', 'tours'];

    for (const table of tables) {
        const response = await supabase
            .from(table)
            .select('*', { count: 'exact' })
            .limit(1);

        console.log(`Response for ${table}:`, {
            status: response.status,
            statusText: response.statusText,
            count: response.count,
            error: response.error,
            dataLength: response.data?.length
        });
    }
}

checkData();
