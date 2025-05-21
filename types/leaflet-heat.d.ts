declare namespace L {
  namespace Heat {
    interface HeatLayerOptions {
      minOpacity?: number
      maxZoom?: number
      max?: number
      radius?: number
      blur?: number
      gradient?: Record<string, string>
    }
  }

  function heatLayer(latlngs: Array<[number, number, number?]>, options?: Heat.HeatLayerOptions): L.Layer
}
