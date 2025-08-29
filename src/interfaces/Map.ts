import type { ErrorEvent } from 'mapbox-gl'

type EventCallback<T> = (event: T) => void;

interface MapInterface {
  map: mapboxgl.Map | null,
  on: <T extends null | ErrorEvent>(event: string, callback: EventCallback<T>) => void;
}

export type { MapInterface, EventCallback };
