import { useEffect, useMemo, useState } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { formatPrice } from '../../utils/formatPrice'
import Button from '../ui/Button'
import MapPropertyPreview from './MapPropertyPreview'

const defaultCenter = [20.5937, 78.9629]

const formatMarkerPrice = (price) => formatPrice(price).replace(' ', '').replace('.00', '')

const createPriceIcon = (property, isHighlighted) =>
  L.divIcon({
    className: '',
    html: `
      <div class="nestiq-price-marker ${isHighlighted ? 'nestiq-price-marker-active' : ''}">
        ${formatMarkerPrice(property.price)}
      </div>
    `,
    iconSize: [76, 34],
    iconAnchor: [38, 34],
    popupAnchor: [0, -32],
  })

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

function MapView({
  properties = [],
  className = '',
  highlightedPropertyId = '',
  selectedPropertyId = '',
  onPropertyHover,
  onPropertySelect,
}) {
  const [areaMessage, setAreaMessage] = useState('')
  const mappableProperties = properties.filter((property) => property.location?.lat && property.location?.lng)
  const markerIcons = useMemo(() => {
    return mappableProperties.reduce((icons, property) => {
      icons[property._id] = createPriceIcon(
        property,
        highlightedPropertyId === property._id || selectedPropertyId === property._id,
      )
      return icons
    }, {})
  }, [highlightedPropertyId, mappableProperties, selectedPropertyId])

  const handleSearchArea = () => {
    setAreaMessage('Map area search ready - backend geo filtering can be connected later.')
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <style>
        {`
          .nestiq-price-marker {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 64px;
            height: 30px;
            padding: 0 12px;
            border-radius: 999px;
            border: 2px solid #ffffff;
            background: #0F172A;
            color: #ffffff;
            font-size: 12px;
            font-weight: 900;
            box-shadow: 0 12px 28px rgba(15, 23, 42, 0.28);
            transform: translateY(0);
            transition: transform 160ms ease, background 160ms ease, color 160ms ease;
          }

          .nestiq-price-marker-active {
            background: #F59E0B;
            color: #0F172A;
            transform: translateY(-3px) scale(1.06);
            box-shadow: 0 18px 34px rgba(245, 158, 11, 0.34);
          }

          .leaflet-popup-content-wrapper {
            border-radius: 18px;
            padding: 0;
            overflow: hidden;
            box-shadow: 0 24px 70px rgba(15, 23, 42, 0.24);
          }

          .leaflet-popup-content {
            margin: 0;
          }
        `}
      </style>
      {mappableProperties.length === 0 && (
        <div className="absolute inset-x-4 top-4 z-[500] rounded-xl bg-white/95 px-4 py-3 text-sm font-bold text-primary shadow-sm">
          No map-ready properties match these filters.
        </div>
      )}
      <div className="absolute left-4 top-4 z-[500] flex max-w-[calc(100%-2rem)] flex-wrap items-center gap-2">
        <Button variant="accent" size="sm" onClick={handleSearchArea}>
          Search this area
        </Button>
        {areaMessage && (
          <span className="rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-primary shadow-sm">
            {areaMessage}
          </span>
        )}
      </div>
      <MapContainer center={defaultCenter} zoom={5} scrollWheelZoom className="h-full min-h-[420px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds properties={mappableProperties} />
        {mappableProperties.map((property) => (
          <Marker
            key={property._id}
            position={[property.location.lat, property.location.lng]}
            icon={markerIcons[property._id]}
            eventHandlers={{
              mouseover: () => onPropertyHover?.(property._id),
              mouseout: () => onPropertyHover?.(''),
              click: () => onPropertySelect?.(property._id),
            }}
          >
            <Popup>
              <MapPropertyPreview property={property} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default MapView
