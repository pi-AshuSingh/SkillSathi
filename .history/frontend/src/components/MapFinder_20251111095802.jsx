import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import React, { Suspense } from 'react'
const MapRenderer = React.lazy(() => import('./MapRenderer'))
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'


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
    const { companies } = useSelector(s => s.company)
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
                // prefer job coords
                let coords = getCoordinates(job) || geocodeCacheRef.current[job._id]
                // fallback to company coords if job doesn't have any
                if (!coords && job.company) {
                    let comp = null
                    if (typeof job.company === 'object') comp = job.company
                    else if (companies && companies.length) comp = companies.find(c => String(c._id) === String(job.company))
                    if (comp) {
                        coords = getCoordinates(comp) || geocodeCacheRef.current[`company:${comp._id}`]
                    }
                }
                if (!coords) return null
                const [lat2, lng2] = coords
                const dist = haversineDistance(lat, lng, Number(lat2), Number(lng2))
                return { job, dist, lat: Number(lat2), lng: Number(lng2) }
            })
            .filter(Boolean)
            .sort((a,b) => a.dist - b.dist)

        setNearbyJobs(matches.filter(m => m.dist <= radiusKm))
    }, [position, radiusKm, list, geocodeTick, companies])

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

        (async () => {
            const toGeocodeJobs = []
            const toGeocodeCompanies = []
            for (const job of list){
                // job-level
                if (!getCoordinates(job) && !geocodeCacheRef.current[job._id] && job.location && typeof job.location === 'string'){
                    toGeocodeJobs.push(job)
                }
                // company-level
                if (job.company){
                    let comp = null
                    if (typeof job.company === 'object') comp = job.company
                    else if (companies && companies.length) comp = companies.find(c => String(c._id) === String(job.company))
                    if (comp && !getCoordinates(comp) && !geocodeCacheRef.current[`company:${comp._id}`] && comp.location && typeof comp.location === 'string'){
                        toGeocodeCompanies.push(comp)
                    }
                }
            }

            // dedupe companies by id
            const uniqCompanies = []
            const seen = new Set()
            for (const c of toGeocodeCompanies){ if (!seen.has(String(c._id))){ seen.add(String(c._id)); uniqCompanies.push(c) } }

            const limit = 30
            // first geocode companies (so jobs can reuse company coords)
            for (let i=0;i<Math.min(limit, uniqCompanies.length);i++){
                if (cancelled) break
                const comp = uniqCompanies[i]
                const coords = await fetchGeocode(comp.location)
                if (coords){
                    geocodeCacheRef.current[`company:${comp._id}`] = coords
                    setGeocodeTick(t => t + 1)
                }
                await sleep(700)
            }

            // then geocode jobs
            for (let i=0;i<Math.min(limit, toGeocodeJobs.length);i++){
                if (cancelled) break
                const job = toGeocodeJobs[i]
                const coords = await fetchGeocode(job.location)
                if (coords){
                    geocodeCacheRef.current[job._id] = coords
                    setGeocodeTick(t => t + 1)
                }
                await sleep(700)
            }
        })()

        return () => { cancelled = true }
    }, [collapsed, list, companies])

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
                        <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading map…</div>}>
                            <MapRenderer center={center} position={position} useAll={useAll} listToShow={useAll ? list : nearbyJobs} radiusKm={radiusKm} navigate={navigate} />
                        </Suspense>
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
