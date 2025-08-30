import type { ErrorEvent, MapMouseEvent, Map } from 'mapbox-gl'

type EventCallback<T> = (event: T) => void;

interface MapServiceInterface {
  readonly map: Map | null,
  on: <T extends null | ErrorEvent>(event: string, callback: EventCallback<T>) => void;
  addPoint: (e: MapMouseEvent) => void,
}

export type { MapServiceInterface, EventCallback };
