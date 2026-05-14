import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://znjnwdyrhwwbnvnkhfpu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuam53ZHlyaHd3Ym52bmtoZnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NzQ3MDIsImV4cCI6MjA4MDQ1MDcwMn0.Ng8EjxS_gYl4C1cQm7-GnxLMmxo4KCucCXQL_XjvMP8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
    console.log('🌱 Seeding Madventure Travel OS...');

    // 1. Seed Businesses
    console.log('Inserting Businesses...');
    const businesses = [
        { name: 'Sea Pearl Beach Resort', category: 'HOTEL', district: "Cox's Bazar", is_approved: true, is_featured: true, rating: 4.8 },
        { name: 'Pahadi Kitchen', category: 'RESTAURANT', district: 'Bandarban', is_approved: true, rating: 4.5 },
        { name: 'Sylhet Explorer', category: 'GUIDE', district: 'Sylhet', is_approved: true, rating: 4.9 }
    ];

    for (const biz of businesses) {
        const slug = biz.name.toLowerCase().replace(/\s+/g, '-');
        await supabase.from('businesses').upsert({ ...biz, slug }, { onConflict: 'slug' });
    }

    // 2. Seed BI Data (Daily Revenue for the last 30 days)
    console.log('Inserting BI Daily Revenue...');
    const dailyRevenue = [];
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dailyRevenue.push({
            date: date.toISOString().split('T')[0],
            total_revenue: Math.floor(Math.random() * 50000) + 10000,
            booking_count: Math.floor(Math.random() * 10) + 2,
            commission_earned: Math.floor(Math.random() * 5000) + 1000
        });
    }

    const { error: biErr } = await supabase.from('bi_daily_revenue').upsert(dailyRevenue);
    if (biErr) console.error('Error seeding BI data:', biErr.message);

    // 3. Seed Feature Flags
    console.log('Inserting Feature Flags...');
    const flags = [
        { key: 'ai_planner_enabled', name: 'AI Travel Planner', is_enabled: true },
        { key: 'wallet_v2', name: 'Wallet System V2', is_enabled: false },
        { key: 'partner_onboarding', name: 'Partner Self-Onboarding', is_enabled: true }
    ];
    await supabase.from('feature_flags').upsert(flags);

    console.log('\n✅ Seeding Complete. Travel OS is now populated with Demo BI data.');
}

seed();
