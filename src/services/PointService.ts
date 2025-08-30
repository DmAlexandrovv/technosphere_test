import type { Point, PointServiceInterface } from '../interfaces/Point'

export default class PointService implements PointServiceInterface {
  private _points: Point[] = []

  public get points(): Point[] {
    return this._points
  }

  createPoint(lngLat: [number, number]): Point {
    const color = '#3FB1CE';
    const point: Point = {
      id: `point-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lngLat,
      color,
      radius: 20,
    }

    this._points.push(point)

    return point
  }
}
