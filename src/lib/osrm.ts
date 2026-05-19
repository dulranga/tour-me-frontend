export type RoutePoint = {
  lat: number
  lng: number
}

type OsrmRouteResponse = {
  code?: string
  routes?: Array<{
    distance: number
    duration: number
    geometry?: {
      coordinates: [number, number][]
    }
  }>
}

export type RouteEstimate = {
  distanceMeters: number
  durationSeconds: number
  distanceKm: number
  durationMinutes: number
  routePath: [number, number][]
}

export function formatDistance(distanceKm: number) {
  return `${distanceKm.toFixed(1)} km`
}

export function formatDuration(durationMinutes: number) {
  if (durationMinutes < 60) {
    return `${Math.round(durationMinutes)} min`
  }

  const hours = Math.floor(durationMinutes / 60)
  const minutes = Math.round(durationMinutes % 60)

  if (minutes === 0) {
    return `${hours} h`
  }

  return `${hours} h ${minutes} min`
}

export async function fetchRouteEstimate(
  pickup: RoutePoint,
  destination: RoutePoint,
  signal?: AbortSignal,
): Promise<RouteEstimate> {
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`,
    { signal },
  )

  const data = (await response.json()) as OsrmRouteResponse
  const route = data.routes?.[0]

  if (!response.ok || data.code !== 'Ok' || !route) {
    throw new Error('Unable to calculate route estimate')
  }

  return {
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    distanceKm: route.distance / 1000,
    durationMinutes: route.duration / 60,
    routePath:
      route.geometry?.coordinates.map(([lng, lat]) => [lat, lng]) ?? [],
  }
}