import type { MapboxOptions, ErrorEvent } from 'mapbox-gl'
import MapboxService from '../services/MapboxService.ts';
import type { EventCallback } from '../interfaces/Map.ts';

interface SingletonMapState {
  map: MapboxService | null
  initialize: (options?: MapboxOptions) => Promise<MapboxService>
  getMap: () => MapboxService | null
}

let globalMap: MapboxService | null = null

export function useMap(): SingletonMapState {
  const initialize = async (options: MapboxOptions = { container: '#map' }): Promise<MapboxService> => {
    if (globalMap) {
      return globalMap
    }

    try {
      globalMap = new MapboxService(options);

      await new Promise<void>((resolve, reject) => {
        globalMap!.on('load', () => {
          resolve()
        })

        const errorCallback: EventCallback<ErrorEvent> = (error) => {
          reject(error.error);
        };

        globalMap!.on('error', errorCallback)
      })

      return globalMap
    } catch (error) {
      console.error('Ошибка при инициализции карты')

      throw error;
    }
  }

  const getMap = (): MapboxService | null => {
    return globalMap
  }

  return {
    map: globalMap,
    initialize,
    getMap,
  }
}