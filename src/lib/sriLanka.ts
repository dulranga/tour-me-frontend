export interface Point {
  lat: number
  lng: number
}

export const SRI_LANKA_BOUNDS: [number, number][] = [
  [81.787959, 6.523055],
  [81.637322, 6.481775],
  [81.21802, 6.197141],
  [80.348357, 5.96837],
  [79.87246, 6.763463],
  [79.695167, 8.200843],
  [80.147801, 9.824078],
  [80.838818, 9.268427],
  [81.304319, 8.564206],
  [81.787959, 7.523055],
]

export function isPointInSriLanka({ lat, lng }: Point) {
  let inside = false

  for (
    let index = 0, previous = SRI_LANKA_BOUNDS.length - 1;
    index < SRI_LANKA_BOUNDS.length;
    previous = index++
  ) {
    const current = SRI_LANKA_BOUNDS[index]
    const previousPoint = SRI_LANKA_BOUNDS[previous]
    const intersects =
      current[1] > lat !== previousPoint[1] > lat &&
      lng <
        ((previousPoint[0] - current[0]) * (lat - current[1])) /
          (previousPoint[1] - current[1]) +
          current[0]

    if (intersects) inside = !inside
  }

  return inside
}

export function getSriLankaBounds(): [[number, number], [number, number]] {
  return [[5.9, 79.6], [10.0, 81.9]]
}
