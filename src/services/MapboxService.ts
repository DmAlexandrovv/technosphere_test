import mapboxgl from 'mapbox-gl'

import type { MapboxOptions, Map, AnyLayer, Source, AnySourceData } from 'mapbox-gl'
import type { MapServiceInterface, EventCallback } from '../interfaces/Map.ts'

import { SEGMENT_TEMP_LAYER_ID, SEGMENT_TEMP_SOURCE_ID, SPREAD_TEMP_LAYER_ID, SPREAD_TEMP_SOURCE_ID } from '../const';

export default class MapboxService implements MapServiceInterface {
  private readonly _map: Map

  constructor(options: MapboxOptions = { container: '#map' }) {
    try {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

      this._map = new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/standard',
        center: [37.6173, 55.7558],
        zoom: 10,
        ...options
      });

      this._map.on('load', () => {
        this._initializeSourcesAndLayers();
      })
    } catch (error) {
      console.error('Не удалось создать экземпляр mapbox-gl')

      throw error
    }
  }

  private _initializeSourcesAndLayers(): void {
    this._map.addSource(SEGMENT_TEMP_SOURCE_ID, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    })

    this._map.addLayer({
      id: SEGMENT_TEMP_LAYER_ID,
      type: 'line',
      source: SEGMENT_TEMP_SOURCE_ID,
      paint: {
        'line-color': '#ff0000',
        'line-width': 3,
        'line-dasharray': [2, 2]
      }
    })

    this._map.addSource(SPREAD_TEMP_SOURCE_ID, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    })

    this._map.addLayer({
      id: SPREAD_TEMP_LAYER_ID,
      type: 'fill',
      source: SPREAD_TEMP_SOURCE_ID,
      paint: {
        'fill-color': '#ff0000',
        'fill-opacity': 0.2
      }
    })
  }

  public get map(): Map {
    return this._map
  }

  on<T>(event: string, callback: EventCallback<T>): void {
    this._map!.on(event, callback)
  }

  off<T>(event: string, callback: EventCallback<T>): void {
    this._map!.on(event, callback)
  }

  setCanvasStyle(styles: Record<string, string | number>): void {
    Object.assign(this._map.getCanvas().style, styles)
  }

  getLayer(id: string): AnyLayer | undefined {
    return this._map.getLayer(id)
  }

  removeLayer(id: string): Map {
    return this._map.removeLayer(id)
  }

  getSource(id: string): Source | undefined {
    return this._map.getSource(id)
  }

  removeSource(id: string): Map {
    return this._map.removeSource(id)
  }

  addSource(id: string, source: AnySourceData): Map {
    return this._map.addSource(id, source)
  }

  addLayer(layer: AnyLayer, before?: string): Map {
    return this._map.addLayer(layer, before)
  }

  isStyleLoaded(): boolean {
    return this._map.isStyleLoaded()
  }

  once<T>(event: string, callback: EventCallback<T>): Map {
    return this._map.once(event, callback)
  }
}