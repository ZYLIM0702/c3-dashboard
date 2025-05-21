import type * as L from "leaflet"

declare namespace OSMBuildings {
  interface OSMBuildingsOptions {
    minZoom?: number
    maxZoom?: number
    attribution?: string
    baseURL?: string
    zoom?: number
    position?: [number, number]
    tilt?: number
    rotation?: number
    effects?: string[]
    disabled?: boolean
    backgroundColor?: string
    highlightColor?: string
    fogColor?: string
    showBackfaces?: boolean
    minBackFaceAlpha?: number
    maxBackFaceAlpha?: number
  }

  class OSMBuildings {
    constructor(map: L.Map, options?: OSMBuildingsOptions)
    load(url: string): this
    setStyle(style: object): this
    setDate(date: Date): this
    setPosition(position: [number, number]): this
    setZoom(zoom: number): this
    setRotation(rotation: number): this
    setTilt(tilt: number): this
    highlight(id: string | string[], color?: string): this
    show(): this
    hide(): this
    getTarget(x: number, y: number, callback: (feature: any) => void): this
  }
}

declare global {
  interface Window {
    OSMBuildings: {
      new (map: L.Map, options?: OSMBuildings.OSMBuildingsOptions): OSMBuildings.OSMBuildings
    }
  }
}
