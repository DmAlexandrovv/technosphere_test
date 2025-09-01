const EARTH_METER_RADIUS = 6371000

export const calculateAzimuth = (start: [number, number], end: [number, number]): number => {
  const lng1Rad = start[0] * Math.PI / 180
  const lat1Rad = start[1] * Math.PI / 180
  const lng2Rad = end[0] * Math.PI / 180
  const lat2Rad = end[1] * Math.PI / 180

  const y = Math.sin(lng2Rad - lng1Rad) * Math.cos(lat2Rad)
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lng2Rad - lng1Rad)

  const azimuth = Math.atan2(y, x) * 180 / Math.PI

  return (azimuth + 360) % 360
}

export const calculateDistance = (start: [number, number], end: [number, number]): number => {
  const radLatDifference = (end[1] - start[1]) * Math.PI / 180
  const radLngDifference = (end[0] - start[0]) * Math.PI / 180

  const a = Math.sin(radLatDifference / 2) * Math.sin(radLatDifference / 2) +
    Math.cos(start[1] * Math.PI / 180) * Math.cos(end[1] * Math.PI / 180) *
    Math.sin(radLngDifference / 2) * Math.sin(radLngDifference / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_METER_RADIUS * c
}

export const calculateEndpoint = (start: [number, number], azimuth: number, distance: number): [number, number] => {
  const azimuthRad = azimuth * Math.PI / 180
  const lat1Rad = start[1] * Math.PI / 180
  const lng1Rad = start[0] * Math.PI / 180
  const lat2 = Math.asin(Math.sin(lat1Rad) * Math.cos(distance / EARTH_METER_RADIUS) +
    Math.cos(lat1Rad) * Math.sin(distance / EARTH_METER_RADIUS) * Math.cos(azimuthRad))
  const lng2 = lng1Rad + Math.atan2(Math.sin(azimuthRad) * Math.sin(distance / EARTH_METER_RADIUS) * Math.cos(lat1Rad),
    Math.cos(distance / EARTH_METER_RADIUS) - Math.sin(lat1Rad) * Math.sin(lat2))

  return [lng2 * 180 / Math.PI, lat2 * 180 / Math.PI]
}

export const calculateArcPoints = (
  center: [number, number],
  radius: number,
  startAngle: number,
  endAngle: number,
  segments: number = 36
): [number, number][] => {
  const points: [number, number][] = []
  const angleStep = (endAngle - startAngle) / segments

  for (let i = 0; i <= segments; i++) {
    const angle = startAngle + (angleStep * i)

    points.push(calculateEndpoint(center, angle, radius))
  }

  return points
}
