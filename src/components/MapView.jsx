import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../utils/fixLeafletIcon'
import { useState } from 'react'

function ClickMarker({ setPos }) {
  useMapEvents({
    click(e) {
      setPos([e.latlng.lat, e.latlng.lng])
    }
  })
  return null
}

export default function MapView({ height=300, center=[20.5937, 78.9629], zoom=5, marker, path, onClickSetMarker }) {
  const [pos, setPos] = useState(marker || null)
  const m = marker || pos
  return (
    <div className="w-full" style={{ height }}>
      <MapContainer center={m || center} zoom={zoom} style={{ height: '100%', width: '100%', borderRadius: '1rem' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {onClickSetMarker && <ClickMarker setPos={(p)=>{ setPos(p); onClickSetMarker(p); }} />}
        {m && (
          <Marker position={m}>
            <Tooltip permanent>Selected</Tooltip>
          </Marker>
        )}
        {Array.isArray(path) && path.length>1 && (
          <Polyline positions={path} />
        )}
      </MapContainer>
    </div>
  )
}
