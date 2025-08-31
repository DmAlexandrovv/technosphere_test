import type { AnyLayer, AnySourceData } from 'mapbox-gl'

export const SEGMENT_TEMP_LAYER_ID = 'segment-temp-layer'
export const SEGMENT_TEMP_SOURCE_ID = 'segment-temp-source'
export const SPREAD_TEMP_LAYER_ID = 'segment-temp-spread-layer'
export const SPREAD_TEMP_SOURCE_ID = 'spread-temp-source'

export const SEGMENT_LAYER_ID = 'segment-layer'
export const SEGMENT_SOURCE_ID = 'segment-source'
export const SPREAD_LAYER_ID = 'segment-spread-layer'
export const SPREAD_SOURCE_ID = 'spread-source'

export const SPREAD_HIGHLIGHT_LAYER_ID = 'spread-highlight-layer'
export const SPREAD_HIGHLIGHT_SOURCE_ID = 'spread-highlight-source'

export const RAW_TEMP_SOURCES: Array<{ id: string, data: AnySourceData }> = [
  {
    id: SEGMENT_TEMP_SOURCE_ID,
    data: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    }
  },
  {
    id: SPREAD_TEMP_SOURCE_ID,
    data: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    }
  }
]

export const RAW_TEMP_LAYERS: AnyLayer[] = [
  {
    id: SEGMENT_TEMP_LAYER_ID,
    type: 'line',
    source: SEGMENT_TEMP_SOURCE_ID,
    paint: {
      'line-color': '#ff0000',
      'line-width': 3,
      'line-dasharray': [2, 2]
    }
  },
  {
    id: SPREAD_TEMP_LAYER_ID,
    type: 'fill',
    source: SPREAD_TEMP_SOURCE_ID,
    paint: {
      'fill-color': '#ff0000',
      'fill-opacity': 0.2
    }
  }
]

export const RAW_SOURCES: Array<{ id: string, data: AnySourceData }> = [
  {
    id: SEGMENT_SOURCE_ID,
    data: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    }
  },
  {
    id: SPREAD_SOURCE_ID,
    data: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    }
  }
]

export const RAW_LAYERS: AnyLayer[] = [
  {
    id: SEGMENT_LAYER_ID,
    type: 'line',
    source: SEGMENT_SOURCE_ID,
    paint: {
      'line-color': '#1976d2',
      'line-width': 3,
      'line-dasharray': [2, 2]
    }
  },
  {
    id: SPREAD_LAYER_ID,
    type: 'fill',
    source: SPREAD_SOURCE_ID,
    paint: {
      'fill-color': '#42a5f5',
      'fill-opacity': 0.25,
      'fill-outline-color': '#1976d2'
    }
  }
]

export const SPREAD_HIGHLIGHT_LAYER: AnyLayer = {
  id: SPREAD_HIGHLIGHT_LAYER_ID,
  type: 'fill',
  source: SPREAD_HIGHLIGHT_SOURCE_ID,
  paint: {
    'fill-color': '#FFFF00',
    'fill-opacity': 0.25,
    'fill-outline-color': '#1976d2'
  }
};

export const SPREAD_HIGHLIGHT_SOURCE: AnySourceData = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: []
  }
};