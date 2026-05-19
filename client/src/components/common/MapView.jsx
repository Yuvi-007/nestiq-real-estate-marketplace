import { useEffect } from 'react'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { formatPrice } from '../../utils/formatPrice'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const defaultCenter = [20.5937, 78.9629]

function MapBounds({ properties }) {
  const map = useMap()

  useEffect(() => {
    const points = properties
      .filter((property) => property.location?.lat && property.location?.lng)
      .map((property) => [property.location.lat, property.location.lng])

    if (points.length === 1) {
      map.setView(points[0], 12)
    }

    if (points.length > 1) {
      map.fitBounds(points, { padding: [36, 36] })
    }
  }, [map, properties])

  return null
}

function MapView({ properties = [], className = '' }) {
  const mappableProperties = properties.filter((property) => property.location?.lat && property.location?.lng)

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {mappableProperties.length === 0 && (
        <div className="absolute inset-x-4 top-4 z-[500] rounded-xl bg-white/95 px-4 py-3 text-sm font-bold text-primary shadow-sm">
          No map-ready properties match these filters.
        </div>
      )}
      <MapContainer center={defaultCenter} zoom={5} scrollWheelZoom className="h-full min-h-[420px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds properties={mappableProperties} />
        {mappableProperties.map((property) => (
          <Marker key={property._id} position={[property.location.lat, property.location.lng]}>
            <Popup>
              <div className="w-52">
                <p className="font-bold text-primary">{property.title}</p>
                <p className="mt-1 text-sm font-semibold text-charcoal">{formatPrice(property.price)}</p>
                <p className="mt-1 text-xs text-slate-600">{property.location.city}</p>
                <Link to={`/properties/${property._id}`} className="mt-3 inline-flex text-sm font-bold text-amber-600">
                  View details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default MapView
