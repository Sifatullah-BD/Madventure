import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://znjnwdyrhwwbnvnkhfpu.supabase.co';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
    console.error('❌ Missing credentials for RLS audit.');
    process.exit(1);
}

async function audit() {
    console.log('🛡️ Starting RLS Security Audit...\n');

    // 1. Anonymous Access Test
    const anon = createClient(SUPABASE_URL, ANON_KEY);
    
    console.log('Testing Anonymous Access:');
    const { data: bData, error: bErr } = await anon.from('bookings').select('*').limit(1);
    if (bErr || (bData && bData.length > 0)) {
        console.log(`  - Bookings Read: ${bErr ? '✅ Blocked' : '❌ EXPOSED'}`);
    } else {
        console.log('  - Bookings Read: ✅ Empty/Blocked');
    }

    const { data: tData, error: tErr } = await anon.from('tours').select('id').limit(1);
    console.log(`  - Tours Read (Public): ${!tErr ? '✅ Allowed' : '❌ Blocked'}`);

    // 2. Unauthorized Write Test
    console.log('\nTesting Unauthorized Writes:');
    const { error: insErr } = await anon.from('tours').insert({ title: 'Hacked Tour', price_per_person: 0 });
    console.log(`  - Tours Write: ${insErr ? '✅ Blocked' : '❌ EXPOSED'}`);

    const { error: profErr } = await anon.from('profiles').update({ app_role: 'admin' }).eq('id', 'some-id');
    console.log(`  - Profile Role Escalation: ${profErr ? '✅ Blocked' : '❌ EXPOSED'}`);

    console.log('\nAudit Complete.');
}

audit();
