import type { ErrorEvent, Map } from 'mapbox-gl'
import type {SegmentGeometry, SpreadGeometry} from "./Segment.ts";

type EventCallback<T> = (event: T) => void;

interface MapServiceInterface {
  readonly map: Map

  on: <T extends null | ErrorEvent>(event: string, callback: EventCallback<T>) => void

  onLayer: <T extends null | ErrorEvent>(event: string, id: string, callback: EventCallback<T>) => void

  off: <T extends null | ErrorEvent>(event: string, callback: EventCallback<T>) => void

  setCanvasStyle: (styles: Record<string, string | number>) => void

  cleanupDrawing: (segmentSourceId: string, spreadSourceId: string) => void

  updateSegmentLayer: (segmentSourceId: string, segmentGeometry: SegmentGeometry[]) => void

  updateMapLayers: (
    segmentSourceId: string,
    spreadSourceId: string,
    segmentGeometry: SegmentGeometry[],
    spreadGeometry: SpreadGeometry[],
  ) => void
}

export type { MapServiceInterface, EventCallback };
