import mapboxgl, {type GeoJSONSource} from 'mapbox-gl'

import type { MapboxOptions, Map } from 'mapbox-gl'
import type { MapServiceInterface, EventCallback } from '../interfaces/Map.ts'

import {
  RAW_TEMP_SOURCES,
  RAW_TEMP_LAYERS,
  RAW_SOURCES,
  RAW_LAYERS,
  SPREAD_HIGHLIGHT_SOURCE_ID,
  SPREAD_HIGHLIGHT_LAYER,
  SPREAD_HIGHLIGHT_SOURCE,
} from '../const';
import type { SegmentGeometry, SpreadGeometry } from '../interfaces/Segment.ts'

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
    [...RAW_TEMP_SOURCES, ...RAW_SOURCES].forEach(({ id, data }) => {
      this._map.addSource(id, data)
    });

    [...RAW_TEMP_LAYERS, ...RAW_LAYERS].forEach((layer) => {
      this._map.addLayer(layer)
    })

    this._map.addSource(SPREAD_HIGHLIGHT_SOURCE_ID, SPREAD_HIGHLIGHT_SOURCE)

    this._map.addLayer(SPREAD_HIGHLIGHT_LAYER)
  }

  public highlightSegment(spreadGeometry: SpreadGeometry) {
    this.removeHighlightSegment()

    const highlightSource = this._map.getSource(SPREAD_HIGHLIGHT_SOURCE_ID) as GeoJSONSource;

    if (highlightSource) {
      highlightSource.setData({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: spreadGeometry
        }]
      });
    }
  }

  public removeHighlightSegment() {
    const highlightSource = this._map.getSource(SPREAD_HIGHLIGHT_SOURCE_ID) as GeoJSONSource;

    if (highlightSource) {
      highlightSource.setData({
        type: 'FeatureCollection',
        features: []
      });
    }
  }

  public cleanupDrawing(segmentSourceId: string, spreadSourceId: string): void {
    const segmentSource = this._map.getSource(segmentSourceId) as GeoJSONSource

    if (segmentSource) {
      segmentSource.setData({
        type: 'FeatureCollection',
        features: []
      });
    }

    const spreadSource = this._map.getSource(spreadSourceId) as GeoJSONSource

    if (spreadSource) {
      spreadSource.setData({
        type: 'FeatureCollection',
        features: []
      });
    }
  }

  public updateSegmentLayer(segmentSourceId: string, segmentGeometry: SegmentGeometry[]): void {
    const segmentSource = this._map.getSource(segmentSourceId) as GeoJSONSource;

    if (segmentSource) {
      segmentSource.setData({
        type: 'FeatureCollection',
        features: segmentGeometry.map((geometry: SegmentGeometry) => ({
          type: 'Feature',
          geometry: geometry,
          properties: {}
        }))
      });
    }
  }

  public updateMapLayers(
    segmentSourceId: string,
    spreadSourceId: string,
    segmentGeometry: SegmentGeometry[],
    spreadGeometry: SpreadGeometry[],
  ): void {
    this.updateSegmentLayer(segmentSourceId, segmentGeometry)

    const spreadSource = this._map.getSource(spreadSourceId) as GeoJSONSource;

    if (spreadGeometry.length && spreadSource) {
      spreadSource.setData({
        type: 'FeatureCollection',
        features: spreadGeometry.map((geometry: SpreadGeometry) => ({
          type: 'Feature',
          geometry: geometry,
          properties: geometry.properties || {},
        }))
      });
    } else if (spreadSource) {
      spreadSource.setData({
        type: 'FeatureCollection',
        features: []
      });
    }
  }

  public get map(): Map {
    return this._map
  }

  on<T>(event: string, callback: EventCallback<T>): void {
    this._map!.on(event, callback)
  }

  onLayer<T>(event: string, layerId: string, callback: EventCallback<T>): void {
    this._map!.on(event, layerId, callback)
  }

  off<T>(event: string, callback: EventCallback<T>): void {
    this._map!.on(event, callback)
  }

  setCanvasStyle(styles: Record<string, string | number>): void {
    Object.assign(this._map.getCanvas().style, styles)
  }
}