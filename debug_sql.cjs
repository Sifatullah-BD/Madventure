console.log('Starting script...');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'server', 'data');
const outputFile = path.join(__dirname, 'db_setup.sql');

const readJson = (filename) => {
    try {
        console.log(`Reading ${filename}...`);
        const content = fs.readFileSync(path.join(dataDir, filename), 'utf-8');
        return JSON.parse(content);
    } catch (err) {
        console.error(`Error reading ${filename}:`, err.message);
        process.exit(1);
    }
};

const divisions = readJson('divisions.json');
const districts = readJson('districts.json');
const tours = readJson('tours.json');
const places = readJson('places.json');

console.log('Data loaded.');
let sql = '';

// --- Schema Definitions ---
console.log('Generating Schema...');

// Divisions
sql += `-- Divisions Table\n`;
sql += `CREATE TABLE IF NOT EXISTS divisions (\n`;
sql += `  id TEXT PRIMARY KEY,\n`;
sql += `  name TEXT NOT NULL,\n`;
sql += `  bn_name TEXT,\n`;
sql += `  lat TEXT,\n`;
sql += `  long TEXT\n`;
sql += `);\n\n`;

// Districts
sql += `-- Districts Table\n`;
sql += `CREATE TABLE IF NOT EXISTS districts (\n`;
sql += `  id TEXT PRIMARY KEY,\n`;
sql += `  division_id TEXT REFERENCES divisions(id),\n`;
sql += `  name TEXT NOT NULL,\n`;
sql += `  bn_name TEXT,\n`;
sql += `  lat TEXT,\n`;
sql += `  long TEXT\n`;
sql += `);\n\n`;

// Tours
sql += `-- Tours Table\n`;
sql += `CREATE TABLE IF NOT EXISTS tours (\n`;
sql += `  id TEXT PRIMARY KEY,\n`; // Changed to TEXT to support "EVT-..."
sql += `  agency_id TEXT,\n`;
sql += `  title TEXT NOT NULL,\n`;
sql += `  destination TEXT,\n`;
sql += `  duration TEXT,\n`;
sql += `  price NUMERIC,\n`;
sql += `  category TEXT,\n`;
sql += `  images TEXT[],\n`; // Array of strings
sql += `  itinerary JSONB,\n`; // JSONB for complex objects
sql += `  includes TEXT[],\n`;
sql += `  excludes TEXT[]\n`;
sql += `);\n\n`;

// Places
sql += `-- Places Table\n`;
sql += `CREATE TABLE IF NOT EXISTS places (\n`;
sql += `  id SERIAL PRIMARY KEY,\n`;
sql += `  name TEXT NOT NULL,\n`;
sql += `  location TEXT,\n`;
sql += `  region TEXT,\n`;
sql += `  image TEXT,\n`;
sql += `  description TEXT,\n`;
sql += `  details TEXT,\n`;
sql += `  fare_chart JSONB,\n`;
sql += `  hidden_spots TEXT[],\n`;
sql += `  food_hotels TEXT[]\n`;
sql += `);\n\n`;

// --- RLS Policies ---
sql += `-- Enable RLS\n`;
sql += `ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;\n`;
sql += `ALTER TABLE districts ENABLE ROW LEVEL SECURITY;\n`;
sql += `ALTER TABLE tours ENABLE ROW LEVEL SECURITY;\n`;
sql += `ALTER TABLE places ENABLE ROW LEVEL SECURITY;\n`;

sql += `-- Create Policies (Public Read)\n`;
sql += `CREATE POLICY "Public Read Divisions" ON divisions FOR SELECT USING (true);\n`;
sql += `CREATE POLICY "Public Read Districts" ON districts FOR SELECT USING (true);\n`;
sql += `CREATE POLICY "Public Read Tours" ON tours FOR SELECT USING (true);\n`;
sql += `CREATE POLICY "Public Read Places" ON places FOR SELECT USING (true);\n\n`;


// --- Data Insertion ---
console.log('Generating Inserts...');

const escapeStr = (str) => {
    if (!str) return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
};

const escapeArr = (arr) => {
    if (!arr) return 'NULL';
    const items = arr.map(item => `"${item.replace(/"/g, '\\"')}"`).join(',');
    return `'${"{" + items + "}"}'`;
};

const escapeJson = (obj) => {
    if (!obj) return 'NULL';
    return `'${JSON.stringify(obj).replace(/'/g, "''")}'`;
};


// Insert Divisions
console.log('  Divisions...');
divisions.forEach(d => {
    sql += `INSERT INTO divisions (id, name, bn_name, lat, long) VALUES (${escapeStr(d.id)}, ${escapeStr(d.name)}, ${escapeStr(d.bn_name)}, ${escapeStr(d.lat)}, ${escapeStr(d.long)}) ON CONFLICT (id) DO NOTHING;\n`;
});
sql += `\n`;

// Insert Districts
console.log('  Districts...');
districts.forEach(d => {
    sql += `INSERT INTO districts (id, division_id, name, bn_name, lat, long) VALUES (${escapeStr(d.id)}, ${escapeStr(d.division_id)}, ${escapeStr(d.name)}, ${escapeStr(d.bn_name)}, ${escapeStr(d.lat)}, ${escapeStr(d.long)}) ON CONFLICT (id) DO NOTHING;\n`;
});
sql += `\n`;

// Insert Tours
console.log('  Tours...');
tours.forEach(t => {
    // Note: Mapping camelCase JSON to snake_case DB columns
    sql += `INSERT INTO tours (id, agency_id, title, destination, duration, price, category, images, itinerary, includes, excludes) VALUES (${escapeStr(t.id)}, ${escapeStr(t.agencyId)}, ${escapeStr(t.title)}, ${escapeStr(t.destination)}, ${escapeStr(t.duration)}, ${t.price}, ${escapeStr(t.category)}, ${escapeArr(t.images)}, ${escapeJson(t.itinerary)}, ${escapeArr(t.includes)}, ${escapeArr(t.excludes)}) ON CONFLICT (id) DO NOTHING;\n`;
});
sql += `\n`;

// Insert Places
console.log('  Places...');
places.forEach(p => {
    sql += `INSERT INTO places (id, name, location, region, image, description, details, fare_chart, hidden_spots, food_hotels) VALUES (${p.id}, ${escapeStr(p.name)}, ${escapeStr(p.location)}, ${escapeStr(p.region)}, ${escapeStr(p.image)}, ${escapeStr(p.description)}, ${escapeStr(p.details)}, ${escapeJson(p.fareChart)}, ${escapeArr(p.hiddenSpots)}, ${escapeArr(p.foodHotels)}) ON CONFLICT (id) DO NOTHING;\n`;
});
sql += `\n`;

console.log('Writing file...');
fs.writeFileSync(outputFile, sql);
console.log('SQL file generated at:', outputFile);
