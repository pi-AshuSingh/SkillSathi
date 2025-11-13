// Quick test for getCoordinates used in MapFinder.jsx

function getCoordinates(job){
    if (!job) return null
    const num = v => v === 0 || v ? Number(v) : null
    const tryNumPair = (a,b) => { const la = num(a); const lb = num(b); return (la!==null && lb!==null) ? [la, lb] : null }

    let pair = tryNumPair(job.locationLat, job.locationLng)
    if (pair) return pair
    pair = tryNumPair(job.latitude, job.longitude)
    if (pair) return pair
    pair = tryNumPair(job.lat, job.lng)
    if (pair) return pair
    if (Array.isArray(job.locationCoords) && job.locationCoords.length >= 2) return [Number(job.locationCoords[0]), Number(job.locationCoords[1])]
    if (Array.isArray(job.coordinates) && job.coordinates.length >= 2) return [Number(job.coordinates[1]), Number(job.coordinates[0])]
    if (Array.isArray(job.coords) && job.coords.length >= 2) return [Number(job.coords[0]), Number(job.coords[1])]

    if (job.location && typeof job.location === 'object'){
        if (Array.isArray(job.location.coordinates) && job.location.coordinates.length >= 2){
            return [Number(job.location.coordinates[1]), Number(job.location.coordinates[0])]
        }
        if (job.location.lat && job.location.lng) return tryNumPair(job.location.lat, job.location.lng)
        if (job.location.latitude && job.location.longitude) return tryNumPair(job.location.latitude, job.location.longitude)
    }

    if (job.location && typeof job.location === 'string'){
        const s = job.location.trim()
        const m = s.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/)
        if (m) return [Number(m[1]), Number(m[2])]
        const m2 = s.match(/(-?\d+\.\d+)\s+(-?\d+\.\d+)/)
        if (m2) return [Number(m2[1]), Number(m2[2])]
    }

    return null
}

const samples = [
    { _id:1, title:'Numeric lat/lng', locationLat: 12.34, locationLng: 56.78 },
    { _id:2, title:'Latitude/Longitude', latitude: '9.01', longitude: '23.45' },
    { _id:3, title:'lat/lng fields', lat: 1.2, lng: 3.4 },
    { _id:4, title:'coords array', locationCoords: [ -7.11, 8.22 ] },
    { _id:5, title:'geojson coordinates [lng,lat]', coordinates: [100.5, 13.75] },
    { _id:6, title:'location object point', location: { type: 'Point', coordinates: [77.59,12.97] } },
    { _id:7, title:'location object lat/lng', location: { lat: 40.71, lng: -74.0 } },
    { _id:8, title:'string lat,lng', location: '12.9716,77.5946' },
    { _id:9, title:'string lat lng', location: '12.9716 77.5946' },
    { _id:10, title:'no coords', location: 'Bengaluru, India' },
]

for (const s of samples){
    console.log(s._id, s.title, '->', getCoordinates(s))
}
