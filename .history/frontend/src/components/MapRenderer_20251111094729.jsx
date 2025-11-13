import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import PropTypes from 'prop-types'

// Fix default marker icon issues when using leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
})

function LocateControl({ position }) {
    const map = useMap()
    React.useEffect(() => {
        if (position) map.setView(position, 13)
    }, [position, map])
    return null
}

export default function MapRenderer({ center, position, useAll, listToShow, radiusKm, navigate }){
    return (
        <MapContainer center={center} zoom={useAll ? 5 : 11} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {position && <LocateControl position={position} />}
            {position && <Marker position={position}><Popup>Your location</Popup></Marker>}
            {!useAll && position && <Circle center={position} radius={radiusKm * 1000} pathOptions={{ color: '#4f46e5', fillOpacity: 0.06 }} />}

            {listToShow.map((m, idx) => {
                const lat = m.lat || m.locationLat || (m.locationCoords && m.locationCoords[0])
                const lng = m.lng || m.locationLng || (m.locationCoords && m.locationCoords[1])
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
                                    <button onClick={() => navigate(`/jobs/${job._id}`)} className="px-2 py-1 bg-indigo-600 text-white rounded text-sm">View</button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )
            })}
        </MapContainer>
    )
}

MapRenderer.propTypes = {
    center: PropTypes.array,
    position: PropTypes.array,
    useAll: PropTypes.bool,
    listToShow: PropTypes.array,
    radiusKm: PropTypes.number,
    navigate: PropTypes.func
}
