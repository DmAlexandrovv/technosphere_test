import mapboxgl, { type MapboxOptions } from 'mapbox-gl';
import type { MapInterface, EventCallback } from '../interfaces/Map.ts';

export default class MapboxService implements MapInterface {
  private _map: mapboxgl.Map | null = null;

  constructor(options: MapboxOptions = { container: '#map' }) {
    try {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

      this._map = new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/standard',
        center: [37.6173, 55.7558],
        zoom: 10,
        ...options
      });
    } catch (error) {
      console.error('Не удалось создать экземпляр mapbox-gl')

      throw error;
    }
  }

  public get map() {
    return this._map;
  }

  on<T>(event: string, callback: EventCallback<T>) {
    this._map!.on(event, callback);
  }
}