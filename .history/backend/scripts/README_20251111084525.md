 # Backfill Geocodes

 This script helps backfill missing geocode fields for Job and Company documents using Google Maps Geocoding API.

 Usage (safe):

 - Dry run (no DB updates):
   node backfill_geocodes.js --dry-run

 - Real run with batch size and pause (in ms):
   node backfill_geocodes.js --batch=50 --pause=500

 Requirements:

 - Set `MONGO_URI` in your environment.
 - `GOOGLE_MAPS_KEY` is optional. If not provided the script will use OpenStreetMap's Nominatim service as a fallback. Note that Nominatim has usage policies and rate limits — prefer providing a Google key for large-scale runs.
 - Recommended to run on a small subset first (use `--batch`) and monitor API usage/quota.
 - The script pauses between requests to avoid hitting rate limits. Increase `--pause` for safety.

 Notes:

 - The script updates Job and Company documents with the following fields:

   - locationCoords: [lat, lng]
   - geoLocation: { type: 'Point', coordinates: [lng, lat] }
   - geocodedAt, geocodeProvider, geocodeRaw

 - If you need to restrict which records are processed, modify filter in the script.

 - The script sends a `User-Agent` header when calling Nominatim: `SkillSathi/1.0 (+https://yourdomain.example)`. Change this string in `backend/utils/geocode.js` to point to your domain or contact info to comply with Nominatim usage policy.
