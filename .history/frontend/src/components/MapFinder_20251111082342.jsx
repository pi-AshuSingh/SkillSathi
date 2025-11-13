import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

// Fix default marker icon issues when using leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
})

function LocateControl({ position }) {
    const map = useMap()
    useEffect(() => {
        if (position) map.setView(position, 13)
    }, [position, map])
    return null
}

// Haversine distance in kilometers
function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = d => d * Math.PI / 180
    const R = 6371 // km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
}

// Robustly extract [lat, lng] from a job record.
function getCoordinates(job){
    if (!job) return null
    // common numeric fields
    const num = v => v === 0 || v ? Number(v) : null
    const tryNumPair = (a,b) => { const la = num(a); const lb = num(b); return (la!==null && lb!==null) ? [la, lb] : null }

    let pair = tryNumPair(job.locationLat, job.locationLng)
    if (pair) return pair
    pair = tryNumPair(job.latitude, job.longitude)
    if (pair) return pair
    pair = tryNumPair(job.lat, job.lng)
    if (pair) return pair
    // coordinates arrays
    if (Array.isArray(job.locationCoords) && job.locationCoords.length >= 2) return [Number(job.locationCoords[0]), Number(job.locationCoords[1])]
    if (Array.isArray(job.coordinates) && job.coordinates.length >= 2) return [Number(job.coordinates[1]), Number(job.coordinates[0])] // Geo-like [lng,lat]
    if (Array.isArray(job.coords) && job.coords.length >= 2) return [Number(job.coords[0]), Number(job.coords[1])]

    // GeoJSON objects: { type: 'Point', coordinates: [lng, lat] }
    if (job.location && typeof job.location === 'object'){
        if (Array.isArray(job.location.coordinates) && job.location.coordinates.length >= 2){
            return [Number(job.location.coordinates[1]), Number(job.location.coordinates[0])]
        }
        if (job.location.latitude && job.location.longitude) return tryNumPair(job.location.latitude, job.location.longitude)
    }

    // string parsing: 'lat,lng' or 'lat lng'
    if (job.location && typeof job.location === 'string'){
        const s = job.location.trim()
        // look for two floats
        const m = s.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/)
        if (m) return [Number(m[1]), Number(m[2])]
        const m2 = s.match(/(-?\d+\.\d+)\s+(-?\d+\.\d+)/)
        if (m2) return [Number(m2[1]), Number(m2[2])]
    }

    return null
}

export default function MapFinder({ jobs = [], defaultRadiusKm = 10 }){
    const { allJobs } = useSelector(s => s.job)
    const navigate = useNavigate()
    const [position, setPosition] = useState(null)
    const [radiusKm, setRadiusKm] = useState(defaultRadiusKm)
    const [nearbyJobs, setNearbyJobs] = useState([])
    const [useAll, setUseAll] = useState(false)
    const [collapsed, setCollapsed] = useState(true)
    const geocodeCacheRef = useRef({}) // jobId -> [lat,lng]
    const [geocodeTick, setGeocodeTick] = useState(0)

    const list = useMemo(() => (jobs && jobs.length ? jobs : (allJobs || [])), [jobs, allJobs])

    useEffect(() => {
        if (!position) return
        const [lat, lng] = position
        const matches = list
            .map(job => {
                const coords = getCoordinates(job) || geocodeCacheRef.current[job._id]
                if (!coords) return null
                const [lat2, lng2] = coords
                const dist = haversineDistance(lat, lng, Number(lat2), Number(lng2))
                return { job, dist, lat: Number(lat2), lng: Number(lng2) }
            })
            .filter(Boolean)
            .sort((a,b) => a.dist - b.dist)

        setNearbyJobs(matches.filter(m => m.dist <= radiusKm))
    }, [position, radiusKm, list, geocodeTick])

    // Client-side geocoding fallback using Nominatim for jobs without coordinates.
    // Runs when the panel is expanded to avoid extra requests, caches results, and throttles requests.
    useEffect(() => {
        if (collapsed) return
        if (!list || list.length === 0) return
        let cancelled = false
        const sleep = ms => new Promise(r => setTimeout(r, ms))

        async function fetchGeocode(q){
            if (!q) return null
            try {
                const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`
                const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
                if (!res.ok) return null
                const data = await res.json()
                if (!data || data.length === 0) return null
                const { lat, lon } = data[0]
                return [Number(lat), Number(lon)]
            } catch (e){
                return null
            }
        }

        ;(async () => {
            const toGeocode = []
            for (const job of list){
                if (getCoordinates(job)) continue
                if (geocodeCacheRef.current[job._id]) continue
                if (!job.location || typeof job.location !== 'string') continue
                toGeocode.push(job)
            }
            // limit the number of lookups to avoid heavy usage
            const limit = 30
            for (let i=0;i<Math.min(limit, toGeocode.length);i++){
                if (cancelled) break
                const job = toGeocode[i]
                const coords = await fetchGeocode(job.location)
                if (coords){
                    geocodeCacheRef.current[job._id] = coords
                    setGeocodeTick(t => t + 1)
                }
                // be gentle to the service
                await sleep(700)
            }
        })()

        return () => { cancelled = true }
    }, [collapsed, list])

    const handleFindMe = () => {
        if (!navigator.geolocation) return alert('Geolocation is not supported by your browser')
        navigator.geolocation.getCurrentPosition((pos) => {
            setPosition([pos.coords.latitude, pos.coords.longitude])
        }, (err) => {
            alert('Unable to retrieve your location: ' + err.message)
        }, { enableHighAccuracy: true })
    }

    const center = position || (list.length && (() => {
        // fallback center to first job with coordinates
        const j = list.find(job => getCoordinates(job))
        if (!j) return [20.5937,78.9629] // India center fallback
        const coords = getCoordinates(j)
        return coords || [20.5937,78.9629]
    })())

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Map Finder</h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCollapsed(c => !c)}
                        className="flex items-center gap-2 text-sm text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 rounded"
                        aria-expanded={!collapsed}
                        aria-controls="mapfinder-panel"
                    >
                        <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16" height="16" viewBox="0 0 24 24"
                            aria-hidden="true"
                            initial={false}
                            animate={{ rotate: collapsed ? 0 : 180 }}
                            whileHover={{ rotate: collapsed ? -12 : 192, scale: 1.06 }}
                            transition={{ duration: 0.25 }}
                        >
                            <path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                        </motion.svg>
                        <span>{collapsed ? 'Expand' : 'Collapse'}</span>
                    </button>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {collapsed ? (
                    <motion.div key="collapsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-gray-500">Map Finder is collapsed. Click Expand to open the map.</motion.div>
                ) : (
                    <motion.div id="mapfinder-panel" key="expanded" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}>
                    <div className="mb-3 flex gap-2">
                        <Button onClick={handleFindMe} className="bg-indigo-600 text-white">Find My Location</Button>
                        <Button onClick={() => setUseAll(s => !s)} className="bg-slate-50">{useAll ? 'Show Nearby Only' : 'Show All Jobs'}</Button>
                    </div>

                    <div className="mb-3 flex items-center gap-2">
                        <label className="text-sm text-gray-600">Radius (km)</label>
                        <input type="number" value={radiusKm} onChange={e => setRadiusKm(Number(e.target.value||0))} className="w-20 border rounded px-2 py-1" />
                    </div>

                    <div style={{ height: 360 }} className="rounded overflow-hidden">
                        <MapContainer center={center} zoom={useAll ? 5 : 11} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {position && <LocateControl position={position} />}
                            {position && <Marker position={position}><Popup>Your location</Popup></Marker>}
                            {!useAll && position && <Circle center={position} radius={radiusKm * 1000} pathOptions={{ color: '#4f46e5', fillOpacity: 0.06 }} />}

                            {(useAll ? list : nearbyJobs).map((m, idx) => {
                                const lat = m.lat || m.locationLat || (m.locationCoords && m.locationCoords[0])
                                const lng = m.lng || m.locationLng || (m.locationCoords && m.locationCoords[1])
MapFinder.propTypes = {
    jobs: PropTypes.array,
    defaultRadiusKm: PropTypes.number
}
                                // if map entries are the mapped objects (with dist), handle that
                                const job = m.job || m
                                const dist = m.dist !== undefined ? m.dist : null
                                if (!lat || !lng) return null
                                return (
                                    <Marker key={job._id || idx} position={[Number(lat), Number(lng)]}>
                                        <Popup>
                                            <div className="max-w-xs">
                                                <div className="font-semibold">{job.title}</div>
                                                <div className="text-sm text-gray-600">{job.location}</div>
                                                {dist !== null && <div className="text-sm mt-1">{dist.toFixed(2)} km away</div>}
                                                <div className="mt-2 flex gap-2">
                                                    <Button onClick={() => navigate(`/jobs/${job._id}`)} className="bg-indigo-600 text-white">View</Button>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            })}
                        </MapContainer>
                    </div>

                    <div className="mt-3">
                        <h4 className="font-semibold mb-2">Nearby Jobs ({nearbyJobs.length})</h4>
                        <div className="max-h-44 overflow-auto space-y-2">
                            {nearbyJobs.map(n => (
                                <div key={n.job._id} className="p-2 border rounded flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">{n.job.title}</div>
                                        <div className="text-sm text-gray-600">{n.job.location} — {n.dist.toFixed(2)} km</div>
                                    </div>
                                    <div>
                                        <Button onClick={() => navigate(`/jobs/${n.job._id}`)} className="bg-slate-50">Open</Button>
                                    </div>
                                </div>
                            ))}
                            {nearbyJobs.length === 0 && <div className="text-sm text-gray-500">No nearby jobs found for the selected radius.</div>}
                        </div>
                    </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
