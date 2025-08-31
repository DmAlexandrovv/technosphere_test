import type { ErrorEvent, Map, AnyLayer, Source, AnySourceData } from 'mapbox-gl'

type EventCallback<T> = (event: T) => void;

interface MapServiceInterface {
  readonly map: Map

  on: <T extends null | ErrorEvent>(event: string, callback: EventCallback<T>) => void

  off: <T extends null | ErrorEvent>(event: string, callback: EventCallback<T>) => void

  setCanvasStyle: (styles: Record<string, string | number>) => void

  getLayer(id: string): AnyLayer | undefined

  removeLayer(id: string): Map

  removeSource(id: string): Map

  getSource(id: string): Source | undefined

  addSource(id: string, source: AnySourceData): Map

  addLayer(layer: AnyLayer, before?: string): Map

  isStyleLoaded(): boolean

  once: <T>(type: string, callback: EventCallback<T>) => Map
}

export type { MapServiceInterface, EventCallback };
