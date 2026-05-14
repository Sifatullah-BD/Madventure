import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config({ path: './server/.env' });
if (!process.env.VITE_SUPABASE_URL) {
    dotenv.config({ path: './.env' });
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://znjnwdyrhwwbnvnkhfpu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuam53ZHlyaHd3Ym52bmtoZnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NzQ3MDIsImV4cCI6MjA4MDQ1MDcwMn0.Ng8EjxS_gYl4C1cQm7-GnxLMmxo4KCucCXQL_XjvMP8';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Import Data
import { districtsDetailed } from './src/data/districtsDetailed.js';
import { places } from './src/data/places.js';
import { tourEvents } from './src/data/tourData.js';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf-8'));
const districtsList = readJson('./src/data/districts_list.json').districts;
const divisionsList = readJson('./src/data/divisions.json');

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

    // 2. Upload Districts
    console.log('Uploading Districts...');
    for (const dist of districtsList) {
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
            description: detailed?.short_description || null,
            famous_food: detailed?.famous_food || null,
            hero_image: detailed?.hero_image || null,
            svg_map: detailed?.svg_map || null
        };

        const { error } = await supabase
            .from('districts')
            .upsert(payload);

        if (error) console.error(`Error uploading district ${dist.name}:`, error);

        if (detailed) {
            // Upload Student Tours from districtsDetailed
            if (detailed.student_tours) {
                for (let i = 0; i < detailed.student_tours.length; i++) {
                    const tour = detailed.student_tours[i];
                    const tourId = `ST-${dist.id}-${i + 1}`;

                    const { error: tourError } = await supabase
                        .from('tours')
                        .upsert({
                            id: tourId,
                            title: tour.title,
                            destination_id: parseInt(dist.id),
                            destination: dist.name,
                            price: parseFloat(tour.budget.replace(/[^0-9.]/g, '')),
                            duration: tour.duration,
                            description: tour.notes,
                            image_url: detailed.hero_image,
                            type: 'Student Tour',
                            category: 'Budget'
                        }, { onConflict: 'id' });
                    if (tourError) console.error(`Error uploading student tour ${tour.title}:`, tourError);
                }
            }

            // Upload Top Spots from districtsDetailed (Check for duplicates manually)
            if (detailed.top_spots) {
                for (const spot of detailed.top_spots) {
                    // Check if this spot is already in places.js (which has richer data and hardcoded IDs)
                    // We want to prefer places.js data, so skip here if found.
                    const inPlacesJs = places.find(p => p.name.toLowerCase() === spot.name.toLowerCase());
                    if (inPlacesJs) {
                        console.log(`Skipping ${spot.name} (found in places.js)`);
                        continue;
                    }

                    // Check if place exists in DB by name and district_id
                    const { data: existingPlaces, error: fetchError } = await supabase
                        .from('places')
                        .select('id')
                        .eq('name', spot.name)
                        .eq('district_id', parseInt(dist.id));

                    if (fetchError) {
                        console.error(`Error checking place ${spot.name}:`, fetchError);
                        continue;
                    }

                    if (existingPlaces && existingPlaces.length > 0) {
                        // Update existing (optional, or skip)
                        // console.log(`Place ${spot.name} already exists, skipping...`);
                    } else {
                        // Insert new
                        const { error: placeError } = await supabase
                            .from('places')
                            .insert({
                                district_id: parseInt(dist.id),
                                division_id: parseInt(dist.division_id),
                                name: spot.name,
                                image_url: spot.image,
                                description: `Famous spot in ${dist.name}`,
                                type: 'Tourist Spot'
                            });
                        if (placeError) console.error(`Error uploading place ${spot.name}:`, placeError);
                    }
                }
            }
        }
    }

    // 3. Upload Places from places.js (Rich Data)
    console.log('Uploading Places from places.js...');
    for (const place of places) {
        let districtId = null;
        // Try to find district by name matching location or name
        const dist = districtsList.find(d =>
            d.name.toLowerCase() === place.location.toLowerCase() ||
            d.name.toLowerCase() === place.name.toLowerCase() ||
            place.location.toLowerCase().includes(d.name.toLowerCase())
        );
        if (dist) districtId = parseInt(dist.id);

        const payload = {
            id: place.id,
            name: place.name,
            location: place.location,
            region: place.region,
            image: place.image,
            image_url: place.image,
            description: place.description,
            details: place.details,
            fare_chart: place.fareChart,
            hidden_spots: place.hiddenSpots,
            food_hotels: place.foodHotels,
            district_id: districtId ? districtId.toString() : null,
            type: 'Tourist Spot'
        };

        const { error } = await supabase
            .from('places')
            .upsert(payload); // Upsert by ID

        if (error) console.error(`Error uploading place ${place.name}:`, error);
    }

    // 4. Upload Tours from tourData.js
    console.log('Uploading Tours from tourData.js...');
    for (const tour of tourEvents) {
        const payload = {
            id: tour.id,
            agency_id: tour.agencyId,
            title: tour.title,
            destination: tour.destination,
            duration: tour.duration,
            price: tour.price,
            category: tour.category,
            images: tour.images,
            itinerary: tour.itinerary,
            includes: tour.includes,
            excludes: tour.excludes,
            start_date: tour.dates.start,
            type: 'Agency Tour'
        };

        const { error } = await supabase
            .from('tours')
            .upsert(payload); // Upsert by ID

        if (error) console.error(`Error uploading tour ${tour.title}:`, error);
    }

    console.log('Data upload complete!');
}

uploadData();
