interface Segment {
  id: string;
  startPoint: [number, number];
  azimuth: number;
  distance: number;
  spread: number;
  azimuthPoint: [number, number];
}

interface SegmentPanelProps {
  id?: string;
  startPoint: [number, number] | null;
  azimuth: number;
  distance: number;
  spread: number;
  azimuthPoint?: [number, number];
}


interface SegmentGeometry {
  type: 'LineString'
  coordinates: [number, number][]
}

interface SpreadGeometry {
  type: 'Polygon'
  coordinates: Array<[number, number][]>
  properties?: Record<string, string>
}

export type { Segment, SegmentGeometry, SpreadGeometry, SegmentPanelProps }
