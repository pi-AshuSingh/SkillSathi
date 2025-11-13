import axios from 'axios'

const GOOGLE_KEY = process.env.GOOGLE_MAPS_KEY

async function geocodeWithNominatim(address){
    if (!address) return null
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`
    const res = await axios.get(url, { timeout: 10000, headers: { 'User-Agent': 'SkillSathi/1.0 (+https://yourdomain.example)' } })
    if (!res || !res.data || !Array.isArray(res.data) || res.data.length === 0) return null
    const r = res.data[0]
    return {
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lon),
        raw: r,
        provider: 'nominatim'
    }
}

export async function geocodeWithGoogle(address){
    if (!address) return null

    // If we have a Google key, try Google first and fall back to Nominatim on failure
    if (GOOGLE_KEY){
        try{
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_KEY}`
            const res = await axios.get(url, { timeout: 10000 })
            if (res && res.data){
                const data = res.data
                if (data.status === 'OK' && data.results && data.results.length > 0){
                    const r = data.results[0]
                    return {
                        lat: r.geometry.location.lat,
                        lng: r.geometry.location.lng,
                        raw: r,
                        provider: 'google'
                    }
                }
            }
            // no valid google result, fall through to nominatim
        } catch (err){
            // continue to fallback
            console.warn('Google geocode failed, falling back to Nominatim:', err.message)
        }
    }

    // If no Google key or Google failed, use Nominatim
    try{
        return await geocodeWithNominatim(address)
    } catch (e){
        console.warn('Nominatim geocode failed:', e.message)
        return null
    }
}

export default geocodeWithGoogle
