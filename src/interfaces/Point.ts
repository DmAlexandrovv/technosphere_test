import type { Segment } from './Segment.ts'

interface Point {
  id: string
  lngLat: [number, number]
  color: string
  radius: number
  segment?: Segment
}

interface PointServiceInterface {
  points: Point[]
  createPoint: (lngLat: [number, number]) => Point
}

export type { Point, PointServiceInterface }
