export interface Point {
  lat: number
  lng: number
}

export const SRI_LANKA_BOUNDS: [number, number][] = [
  [9.85, 79.52],
  [9.95, 79.95],
  [9.85, 80.45],
  [9.45, 80.9],
  [8.9, 81.2],
  [8.2, 81.4],
  [7.5, 81.35],
  [6.7, 81.0],
  [6.15, 80.5],
  [5.95, 80.0],
  [6.0, 79.35],
  [6.35, 79.0],
  [6.9, 78.95],
  [7.55, 79.1],
  [8.25, 79.25],
  [8.9, 79.35],
  [9.4, 79.35],
  [9.85, 79.52],
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
  return [[5.8, 78.85], [9.9, 81.45]]
}
