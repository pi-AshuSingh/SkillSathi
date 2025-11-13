import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
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

function LocateControl({ position, setMapCenter }) {
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

export default function MapFinder({ jobs = [], defaultRadiusKm = 10 }){
    const { allJobs } = useSelector(s => s.job)
    const navigate = useNavigate()
    const [position, setPosition] = useState(null)
    const [radiusKm, setRadiusKm] = useState(defaultRadiusKm)
    const [nearbyJobs, setNearbyJobs] = useState([])
    const [useAll, setUseAll] = useState(false)
    const [collapsed, setCollapsed] = useState(true)

    const list = jobs.length ? jobs : allJobs || []

    useEffect(() => {
        if (!position) return
        const [lat, lng] = position
        const matches = list
            .map(job => {
                // Extract coordinates from job; expected fields: locationLat, locationLng or locationCoords: [lat,lng]
                let lat2 = job.locationLat || (job.locationCoords && job.locationCoords[0])
                let lng2 = job.locationLng || (job.locationCoords && job.locationCoords[1])
                if ((!lat2 || !lng2) && job.location) {
                    // try to parse "lat,lng" in location string if present
                    const m = String(job.location).match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/)
                    if (m) { lat2 = parseFloat(m[1]); lng2 = parseFloat(m[2]) }
                }
                if (!lat2 || !lng2) return null
                const dist = haversineDistance(lat, lng, Number(lat2), Number(lng2))
                return { job, dist, lat: Number(lat2), lng: Number(lng2) }
            })
            .filter(Boolean)
            .sort((a,b) => a.dist - b.dist)

        setNearbyJobs(matches.filter(m => m.dist <= radiusKm))
    }, [position, radiusKm, list])

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
        const j = list.find(job => job.locationLat || (job.locationCoords && job.locationCoords[0]) || (job.location && /-?\d+\.\d+,\s*-?\d+\.\d+/.test(job.location)))
        if (!j) return [20.5937,78.9629] // India center fallback
        const lat = j.locationLat || (j.locationCoords && j.locationCoords[0]) || (j.location && j.location.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/) ? Number(j.location.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/)[1]) : 20.5937)
        const lng = j.locationLng || (j.locationCoords && j.locationCoords[1]) || (j.location && j.location.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/) ? Number(j.location.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/)[2]) : 78.9629)
        return [lat, lng]
    })())

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Map Finder</h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCollapsed(c => !c)} className="text-sm text-indigo-600">{collapsed ? 'Expand' : 'Collapse'}</button>
                </div>
            </div>

            {collapsed ? (
                <div className="text-sm text-gray-500">Map Finder is collapsed. Click Expand to open the map.</div>
            ) : (
                <>
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
                </>
            )}
        </div>
    )
}
