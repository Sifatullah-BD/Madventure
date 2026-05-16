/* eslint-disable no-undef */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://znjnwdyrhwwbnvnkhfpu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuam53ZHlyaHd3Ym52bmtoZnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NzQ3MDIsImV4cCI6MjA4MDQ1MDcwMn0.Ng8EjxS_gYl4C1cQm7-GnxLMmxo4KCucCXQL_XjvMP8';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const tablesToTest = [
    'profiles',
    'districts',
    'tours',
    'bookings',
    'tour_departures',
    'bi_user_segments',
    'audit_logs',
    'cms_pages',
    'chat_rooms'
];

async function runAudit() {
    console.log('🔍 Starting Madventure Supabase Audit...\n');

    for (const table of tablesToTest) {
        const { error } = await supabase.from(table).select('id').limit(1);
        if (error) {
            console.error(`❌ Table [${table}]: FAILED - ${error.message}`);
        } else {
            console.log(`✅ Table [${table}]: OK`);
        }
    }

    console.log('\n🧪 Testing RPC Functions...');
    const rpcs = [
        'get_business_growth_metrics',
        'is_staff'
    ];

    for (const rpc of rpcs) {
        const { error } = await supabase.rpc(rpc);
        if (error && error.message.includes('does not exist')) {
            console.error(`❌ RPC [${rpc}]: NOT FOUND`);
        } else if (error) {
            console.log(`✅ RPC [${rpc}]: FOUND (returned error: ${error.message})`);
        } else {
            console.log(`✅ RPC [${rpc}]: OK`);
        }
    }

    console.log('\nAudit Complete.');
}

runAudit();
