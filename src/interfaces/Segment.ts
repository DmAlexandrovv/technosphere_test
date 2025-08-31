interface Segment {
  id: string;
  startPoint: [number, number];
  azimuth: number;
  distance: number;
  spread: number;
  azimuthPoint: [number, number];
}

interface SegmentGeometry {
  type: 'LineString'
  coordinates: [number, number][]
}

interface SpreadGeometry {
  type: 'Polygon'
  coordinates: Array<[number, number][]>
}

export type { Segment, SegmentGeometry, SpreadGeometry }
