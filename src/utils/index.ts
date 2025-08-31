export const calculateAzimuth = (start: [number, number], end: [number, number]): number => {
  const lng1 = start[0] * Math.PI / 180;
  const lat1 = start[1] * Math.PI / 180;
  const lng2 = end[0] * Math.PI / 180;
  const lat2 = end[1] * Math.PI / 180;
  const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
  const azimuth = Math.atan2(y, x) * 180 / Math.PI;

  return (azimuth + 360) % 360;
};

export const calculateDistance = (start: [number, number], end: [number, number]): number => {
  const R = 6371000; // радиус Земли в метрах
  const dLat = (end[1] - start[1]) * Math.PI / 180;
  const dLng = (end[0] - start[0]) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(start[1] * Math.PI / 180) * Math.cos(end[1] * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

export const calculateEndpoint = (start: [number, number], azimuth: number, distance: number): [number, number] => {
  const R = 6371000; // радиус Земли в метрах
  const bearing = azimuth * Math.PI / 180;
  const lat1 = start[1] * Math.PI / 180;
  const lng1 = start[0] * Math.PI / 180;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance/R) +
    Math.cos(lat1) * Math.sin(distance/R) * Math.cos(bearing));
  const lng2 = lng1 + Math.atan2(Math.sin(bearing) * Math.sin(distance/R) * Math.cos(lat1),
    Math.cos(distance/R) - Math.sin(lat1) * Math.sin(lat2));

  return [lng2 * 180 / Math.PI, lat2 * 180 / Math.PI];
};

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

  return points;
};
