import axios from 'axios'

const GOOGLE_KEY = process.env.GOOGLE_MAPS_KEY

export async function geocodeWithGoogle(address){
    if (!address) return null
    if (!GOOGLE_KEY) throw new Error('GOOGLE_MAPS_KEY not set in env')
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_KEY}`
    const res = await axios.get(url, { timeout: 10000 })
    if (!res || !res.data) return null
    const data = res.data
    if (data.status !== 'OK' || !data.results || data.results.length === 0) return null
    const r = data.results[0]
    return {
        lat: r.geometry.location.lat,
        lng: r.geometry.location.lng,
        raw: r,
        provider: 'google'
    }
}

export default geocodeWithGoogle
