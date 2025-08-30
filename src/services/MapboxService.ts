import mapboxgl from 'mapbox-gl'

import PointService from './PointService.ts';

import { POINT_LAYER_ID, POINT_SOURCE_ID } from '../const'

import type { MapboxOptions, MapMouseEvent, Map, GeoJSONSource } from 'mapbox-gl'
import type { MapServiceInterface, EventCallback } from '../interfaces/Map.ts'
import type  { PointServiceInterface } from '../interfaces/Point'

export default class MapboxService implements MapServiceInterface {
  private readonly _map: Map | null = null
  private _pointService: PointServiceInterface | null = null

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
        this._initializeSourcesAndLayers()
      })

      this._pointService = new PointService()
    } catch (error) {
      console.error('Не удалось создать экземпляр mapbox-gl')

      throw error;
    }
  }

  private _initializeSourcesAndLayers(): void {
    if (!this._map) return

    this._map.addSource(POINT_SOURCE_ID, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    })

    this._map.addLayer({
      id: POINT_LAYER_ID,
      source: POINT_SOURCE_ID,
      type: 'circle',
      paint: {
        'circle-radius': ['get', 'radius'],
        'circle-color': ['get', 'color'],
        'circle-stroke-color': '#FFF',
      }
    })

    this._updatePointsData()
  }

  private _updatePointsData(): void {
    if (!this._map || !this._map.getSource(POINT_SOURCE_ID) || !this._pointService) return

    const features = this._pointService.points.map(point => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: point.lngLat
      },
      properties: {
        id: point.id,
        color: point.color,
        radius: point.radius,
      }
    }))

    const source = this._map.getSource('points-source') as GeoJSONSource

    source.setData({
      type: 'FeatureCollection',
      features
    })
  }

  public get map(): Map | null {
    return this._map;
  }

  on<T>(event: string, callback: EventCallback<T>): void {
    this._map!.on(event, callback);
  }

  addPoint(e: MapMouseEvent): void {
    if (!this._map) {
      return
    }

    this._pointService?.createPoint([e.lngLat.lng, e.lngLat.lat])

    this._updatePointsData()
  }
}