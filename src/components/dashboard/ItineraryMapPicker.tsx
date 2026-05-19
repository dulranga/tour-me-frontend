import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface Point {
  lat: number
  lng: number
  address?: string
}

interface ItineraryMapPickerProps {
  pickup?: Point
  destination?: Point
  onPointSelect: (
    type: 'pickup' | 'destination',
    lat: number,
    lng: number,
  ) => void
}

function MapUpdater({
  pickup,
  destination,
}: {
  pickup?: Point
  destination?: Point
}) {
  const map = useMap()

  useEffect(() => {
    if (pickup && destination) {
      const bounds = L.latLngBounds(
        [pickup.lat, pickup.lng],
        [destination.lat, destination.lng],
      )
      map.fitBounds(bounds, { padding: [50, 50] })
    } else if (pickup) {
      map.setView([pickup.lat, pickup.lng], 13)
    } else if (destination) {
      map.setView([destination.lat, destination.lng], 13)
    }
  }, [pickup, destination, map])

  return null
}

function LocationPickerEvents({
  onPointSelect,
  nextType,
}: {
  onPointSelect: (
    type: 'pickup' | 'destination',
    lat: number,
    lng: number,
  ) => void
  nextType: 'pickup' | 'destination'
}) {
  useMapEvents({
    click(e) {
      onPointSelect(nextType, e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export function ItineraryMapPicker({
  pickup,
  destination,
  onPointSelect,
}: ItineraryMapPickerProps) {
  const nextType = !pickup ? 'pickup' : 'destination'

  return (
    <div className="h-[300px] w-full rounded-md border border-border overflow-hidden">
      <MapContainer
        center={[6.9271, 79.8612]} // Colombo default
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pickup && (
          <Marker
            position={[pickup.lat, pickup.lng]}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target
                const position = marker.getLatLng()
                onPointSelect('pickup', position.lat, position.lng)
              },
            }}
          />
        )}
        {destination && (
          <Marker
            position={[destination.lat, destination.lng]}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target
                const position = marker.getLatLng()
                onPointSelect('destination', position.lat, position.lng)
              },
            }}
          />
        )}
        <MapUpdater pickup={pickup} destination={destination} />
        <LocationPickerEvents
          onPointSelect={onPointSelect}
          nextType={nextType}
        />
      </MapContainer>
      <div className="bg-bg-elevated p-2 text-[10px] text-text-muted text-center border-t border-border">
        {!pickup
          ? 'Click on map to set Pickup location'
          : !destination
            ? 'Click on map to set Destination'
            : 'Drag markers to adjust locations'}
      </div>
    </div>
  )
}
