declare namespace google.maps.visualization {
  class HeatmapLayer extends google.maps.MVCObject {
    constructor(options?: HeatmapLayerOptions)
    getData(): google.maps.MVCArray<google.maps.LatLng | google.maps.visualization.WeightedLocation>
    getMap(): google.maps.Map
    setData(
      data:
        | google.maps.MVCArray<google.maps.LatLng | google.maps.visualization.WeightedLocation>
        | Array<google.maps.LatLng | google.maps.visualization.WeightedLocation>,
    ): void
    setMap(map: google.maps.Map | null): void
    setOptions(options: HeatmapLayerOptions): void
  }

  interface HeatmapLayerOptions {
    data?:
      | google.maps.MVCArray<google.maps.LatLng | google.maps.visualization.WeightedLocation>
      | Array<google.maps.LatLng | google.maps.visualization.WeightedLocation>
    dissipating?: boolean
    gradient?: string[]
    map?: google.maps.Map
    maxIntensity?: number
    opacity?: number
    radius?: number
  }

  interface WeightedLocation {
    location: google.maps.LatLng
    weight: number
  }
}
