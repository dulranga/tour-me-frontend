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
import {
  fetchRouteEstimate,
  formatDistance,
  formatDuration,
  type RouteEstimate,
} from '#/lib/osrm'

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
  const [routeEstimate, setRouteEstimate] = useState<RouteEstimate | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true

    async function fetchRoute() {
      setIsLoading(true)
      try {
        const estimate = await fetchRouteEstimate(
          pickup,
          destination,
          controller.signal,
        )

        if (!isActive) return

        setRouteEstimate(estimate)
      } catch (error) {
        if (!isActive || controller.signal.aborted) return

        console.error('OSRM routing error:', error)
        setRouteEstimate(null)
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    if (pickup && destination) {
      fetchRoute()
    }

    return () => {
      isActive = false
      controller.abort()
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
          {routeEstimate?.routePath && routeEstimate.routePath.length > 0 && (
            <Polyline
              positions={routeEstimate.routePath}
              color="var(--interactive-default)"
              weight={4}
              opacity={0.8}
            />
          )}
          <MapBounds
            pickup={pickup}
            destination={destination}
            route={routeEstimate?.routePath}
          />
        </MapContainer>
      </div>
      {routeEstimate && (
        <div className="flex items-center justify-between gap-3 text-xs text-text-muted">
          <span>
            Estimated route distance:{' '}
            <span className="font-semibold text-text-primary">
              {formatDistance(routeEstimate.distanceKm)}
            </span>
          </span>
          <span>
            Estimated travel time:{' '}
            <span className="font-semibold text-text-primary">
              {formatDuration(routeEstimate.durationMinutes)}
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
