import dotenv from 'dotenv';
import connectDB from '../db.js';
import Job from '../models/job.model.js';
import Company from '../models/company.model.js';
import { geocodeWithGoogle } from '../utils/geocode.js';

dotenv.config();

const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const batchArg = argv.find(a => a.startsWith('--batch='));
const pauseArg = argv.find(a => a.startsWith('--pause='));
const batchSize = batchArg ? parseInt(batchArg.split('=')[1], 10) : 50;
const pauseMs = pauseArg ? parseInt(pauseArg.split('=')[1], 10) : 500; // ms between geocode calls

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function processCollection(Model, name){
  console.log(`\nProcessing ${name}...`);

  const filter = { $or: [ { locationCoords: { $exists: false } }, { geoLocation: { $exists: false } } ] };
  const total = await Model.countDocuments(filter);
  console.log(`${total} ${name} documents missing geo fields`);
  if (!total) return;

  let processed = 0;
  let page = 0;

  while (processed < total){
    const docs = await Model.find(filter).skip(page * batchSize).limit(batchSize).lean();
    if (!docs.length) break;

    for (const doc of docs){
      const id = doc._id.toString();
      const location = doc.location;

      if (!location || typeof location !== 'string'){
        console.log(`${name} ${id} has no textual location, skipping`);
        processed++;
        continue;
      }

      try{
        const geo = await geocodeWithGoogle(location);
        if (!geo){
          console.log(`${name} ${id} -> geocode returned no result for "${location}"`);
        } else {
          console.log(`${name} ${id} -> ${geo.lat},${geo.lng} (provider: ${geo.provider})`);
          if (!dryRun){
            await Model.findByIdAndUpdate(id, {
              locationCoords: [geo.lat, geo.lng],
              geoLocation: { type: 'Point', coordinates: [geo.lng, geo.lat] },
              geocodedAt: new Date(),
              geocodeProvider: geo.provider,
              geocodeRaw: geo.raw
            });
            console.log(`  -> updated ${name} ${id}`);
          } else {
            console.log(`  -> dry-run: would update ${name} ${id}`);
          }
        }
      } catch (err){
        console.error(`${name} ${id} -> geocode error:`, err.message);
      }

      processed++;
      // pause between requests to respect rate limits
      await sleep(pauseMs);
    }

    page++;
  }
}

async function main(){
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set in env. Aborting.');
    process.exit(1);
  }
  if (!process.env.GOOGLE_MAPS_KEY){
    console.warn('GOOGLE_MAPS_KEY not set; geocoding will likely fail. You can run with --dry-run for testing.');
  }

  await connectDB();

  try{
    await processCollection(Job, 'Job');
    await processCollection(Company, 'Company');
    console.log('\nBackfill complete.');
  } catch (err){
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

main();
