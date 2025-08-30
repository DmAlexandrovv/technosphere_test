import { ref } from 'vue'
import MapboxService from '../services/MapboxService.ts';

import type { Ref } from 'vue'
import type { MapboxOptions, ErrorEvent } from 'mapbox-gl'
import type { EventCallback } from '../interfaces/Map.ts';

interface SingletonMapState {
  map: Ref<MapboxService | null>
  initialize: (options?: MapboxOptions) => Promise<void>
}

const globalMap = ref<MapboxService | null>(null)

export function useMap(): SingletonMapState {
  const initialize = async (options: MapboxOptions = { container: '#map' }): Promise<void> => {
    if (!globalMap.value) {
      try {
        globalMap.value = new MapboxService(options);

        await new Promise<void>((resolve, reject) => {
          globalMap.value!.on('load', () => {
            resolve()
          })

          const errorCallback: EventCallback<ErrorEvent> = (error) => {
            reject(error.error);
          };

          globalMap.value!.on('error', errorCallback)
        })
      } catch (error) {
        console.error('Ошибка при инициализции карты')

        throw error;
      }
    }
  }

  return {
    map: globalMap,
    initialize,
  } as SingletonMapState
}