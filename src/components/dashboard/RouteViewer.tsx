import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface Point {
  lat: number
  lng: number
}

interface RouteViewerProps {
  pickup: Point
  destination: Point
}

function MapBounds({
  pickup,
  destination,
  route,
}: {
  pickup: Point
  destination: Point
  route?: [number, number][]
}) {
  const map = useMap()

  useEffect(() => {
    const points =
      route && route.length > 0
        ? route
        : ([
            [pickup.lat, pickup.lng],
            [destination.lat, destination.lng],
          ] as [number, number][])
    const bounds = L.latLngBounds(points)
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [pickup, destination, route, map])

  return null
}

export function RouteViewer({ pickup, destination }: RouteViewerProps) {
  const [route, setRoute] = useState<[number, number][]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [distance, setDistance] = useState<number | null>(null)

  useEffect(() => {
    async function fetchRoute() {
      setIsLoading(true)
      try {
        // OSRM coordinates are [lng, lat]
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`,
        )
        const data = await response.json()
        if (data.routes && data.routes.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]],
          )
          setRoute(coordinates)
          setDistance(data.routes[0].distance / 1000) // convert to km
        }
      } catch (error) {
        console.error('OSRM routing error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (pickup && destination) {
      fetchRoute()
    }
  }, [pickup, destination])

  return (
    <div className="space-y-2">
      <div className="h-[250px] w-full rounded-md border border-border overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 z-[1000] bg-bg-overlay flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-interactive-default" />
          </div>
        )}
        <MapContainer
          center={[pickup.lat, pickup.lng]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[pickup.lat, pickup.lng]} />
          <Marker position={[destination.lat, destination.lng]} />
          {route.length > 0 && (
            <Polyline
              positions={route}
              color="var(--interactive-default)"
              weight={4}
              opacity={0.8}
            />
          )}
          <MapBounds pickup={pickup} destination={destination} route={route} />
        </MapContainer>
      </div>
      {distance && (
        <div className="text-xs text-text-muted text-right">
          Estimated route distance:{' '}
          <span className="font-semibold text-text-primary">
            {distance.toFixed(1)} km
          </span>
        </div>
      )}
    </div>
  )
}
