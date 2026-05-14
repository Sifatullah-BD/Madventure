import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config({ path: './server/.env' }); // Try server .env first
if (!process.env.VITE_SUPABASE_URL) {
    dotenv.config({ path: './.env' }); // Fallback to root .env
}
// Hardcode if env fails (for this script only, based on previous context)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://<YOUR_PROJECT_ID>.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || '<YOUR_ANON_KEY>';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Import Data
import { districtsDetailed } from './src/data/districtsDetailed.js';
// Read JSON files
const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf-8'));
const districtsList = readJson('./src/data/districts_list.json').districts;
const divisionsList = readJson('./src/data/divisions.json').divisions;
// const placesList = readJson('./server/data/places.json'); // If we want to use this too

async function uploadData() {
    console.log('Starting data upload...');

    // 1. Upload Divisions
    console.log('Uploading Divisions...');
    for (const div of divisionsList) {
        const { error } = await supabase
            .from('divisions')
            .upsert({
                id: parseInt(div.id),
                name: div.name,
                bn_name: div.bn_name,
                lat: parseFloat(div.lat),
                long: parseFloat(div.long)
            });
        if (error) console.error(`Error uploading division ${div.name}:`, error);
    }

    // 2. Upload Districts (Merge List + Detailed)
    console.log('Uploading Districts...');
    for (const dist of districtsList) {
        // Find detailed data
        const detailed = districtsDetailed.find(d =>
            d.name_en.toLowerCase() === dist.name.toLowerCase() ||
            d.id.toLowerCase() === dist.name.toLowerCase()
        );

        const payload = {
            id: parseInt(dist.id),
            division_id: parseInt(dist.division_id),
            name: dist.name,
            bn_name: dist.bn_name,
            lat: parseFloat(dist.lat),
            long: parseFloat(dist.long),
            // Rich data from detailed
            description: detailed?.short_description || null,
            famous_food: detailed?.famous_food || null,
            hero_image: detailed?.hero_image || null,
            svg_map: detailed?.svg_map || null
        };

        const { error } = await supabase
            .from('districts')
            .upsert(payload);

        if (error) console.error(`Error uploading district ${dist.name}:`, error);
        else if (detailed) {
            // 3. Upload Places (Top Spots) for this district
            if (detailed.top_spots && detailed.top_spots.length > 0) {
                for (const spot of detailed.top_spots) {
                    const { error: placeError } = await supabase
                        .from('places')
                        .upsert({
                            district_id: parseInt(dist.id),
                            division_id: parseInt(dist.division_id),
                            name: spot.name,
                            image_url: spot.image,
                            description: `Famous spot in ${dist.name}`,
                            type: 'Tourist Spot'
                        }, { onConflict: 'name, district_id' }); // Assuming unique name per district
                    if (placeError) console.error(`Error uploading place ${spot.name}:`, placeError);
                }
            }

            // 4. Upload Tours (Student Tours) for this district
            if (detailed.student_tours && detailed.student_tours.length > 0) {
                for (const tour of detailed.student_tours) {
                    const { error: tourError } = await supabase
                        .from('tours')
                        .upsert({
                            title: tour.title,
                            destination_id: parseInt(dist.id), // Linking to district
                            price: parseFloat(tour.budget.replace(/[^0-9.]/g, '')), // Extract number
                            duration: tour.duration,
                            description: tour.notes,
                            image_url: detailed.hero_image, // Use district hero as fallback
                            type: 'Student Tour'
                        }, { onConflict: 'title' });
                    if (tourError) console.error(`Error uploading tour ${tour.title}:`, tourError);
                }
            }
        }
    }

    console.log('Data upload complete!');
}

uploadData();
