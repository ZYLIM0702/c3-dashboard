"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface OSMMapProps {
  center?: [number, number]
  zoom?: number
  markers?: Array<{
    position: [number, number]
    title?: string
    icon?: string
    type?: string
    status?: string
    id?: string
  }>
  height?: string
  width?: string
  onClick?: (e: any) => void
  className?: string
  showHeatmap?: boolean
  heatmapData?: Array<[number, number, number]>
  selectedDeviceId?: string | null
}

export function OSMMap({
  center = [3.139, 101.6869], // Default to Kuala Lumpur
  zoom = 10,
  markers = [],
  height = "100%",
  width = "100%",
  className,
  showHeatmap = false,
  heatmapData = [],
  selectedDeviceId = null,
}: OSMMapProps) {
  const { theme } = useTheme()
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const heatmapLayerRef = useRef<any | null>(null)
  const [isMapInitialized, setIsMapInitialized] = useState(false)

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return

    // Create map instance
    const map = L.map(mapRef.current).setView(center, zoom)

    // Add tile layer with 3D buildings
    const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    })

    // Add 3D buildings layer from OSM Buildings
    const script = document.createElement("script")
    script.src = "https://cdn.osmbuildings.org/classic/0.2.2b/OSMBuildings-Leaflet.js"
    script.async = true
    script.onload = () => {
      if (typeof (window as any).OSMBuildings !== "undefined") {
        const osmb = new (window as any).OSMBuildings(map)
        osmb.load("https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json")
      }
    }
    document.head.appendChild(script)

    // Add the tile layer to the map
    tileLayer.addTo(map)

    // Create layers for markers and heatmap
    markersLayerRef.current = L.layerGroup().addTo(map)

    // Store the map instance
    leafletMap.current = map
    setIsMapInitialized(true)

    // Cleanup on unmount
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove()
        leafletMap.current = null
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  // Update map center and zoom when props change
  useEffect(() => {
    if (!leafletMap.current || !isMapInitialized) return
    leafletMap.current.setView(center, zoom)
  }, [center, zoom, isMapInitialized])

  // Update markers when they change
  useEffect(() => {
    if (!markersLayerRef.current || !isMapInitialized) return

    // Clear existing markers
    markersLayerRef.current.clearLayers()

    // Add new markers
    markers.forEach((marker) => {
      const isSelected = marker.id === selectedDeviceId
      const markerColor = getMarkerColor(marker.type, marker.status)

      // Create custom icon
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          width: ${isSelected ? "16px" : "12px"}; 
          height: ${isSelected ? "16px" : "12px"}; 
          background-color: ${markerColor}; 
          border-radius: 50%; 
          border: ${isSelected ? "3px" : "2px"} solid white;
          box-shadow: 0 0 ${isSelected ? "8px 4px" : "4px 2px"} rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [isSelected ? 22 : 16, isSelected ? 22 : 16],
        iconAnchor: [isSelected ? 11 : 8, isSelected ? 11 : 8],
      })

      // Create marker with popup
      const leafletMarker = L.marker(marker.position, { icon }).bindPopup(`
          <div>
            <strong>${marker.title || "Device"}</strong><br>
            Type: ${marker.type || "Unknown"}<br>
            Status: ${marker.status || "Unknown"}
          </div>
        `)

      // Add to layer group
      markersLayerRef.current?.addLayer(leafletMarker)

      // Open popup if selected
      if (isSelected) {
        leafletMarker.openPopup()
      }
    })
  }, [markers, selectedDeviceId, isMapInitialized])

  // Update heatmap when data changes
  useEffect(() => {
    if (!leafletMap.current || !isMapInitialized) return

    // Remove existing heatmap layer
    if (heatmapLayerRef.current) {
      leafletMap.current.removeLayer(heatmapLayerRef.current)
      heatmapLayerRef.current = null
    }

    // Add new heatmap layer if enabled
    if (showHeatmap && heatmapData.length > 0) {
      // Load heatmap script if needed
      if (typeof (window as any).L.heatLayer === "undefined") {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet.heat/dist/leaflet-heat.js"
        script.async = true
        script.onload = () => {
          if (typeof (window as any).L.heatLayer !== "undefined" && leafletMap.current) {
            heatmapLayerRef.current = (window as any).L.heatLayer(heatmapData, {
              radius: 25,
              blur: 15,
              maxZoom: 17,
            }).addTo(leafletMap.current)
          }
        }
        document.head.appendChild(script)
      } else {
        heatmapLayerRef.current = (window as any).L.heatLayer(heatmapData, {
          radius: 25,
          blur: 15,
          maxZoom: 17,
        }).addTo(leafletMap.current)
      }
    }
  }, [heatmapData, showHeatmap, isMapInitialized])

  // Apply dark/light theme
  useEffect(() => {
    if (!leafletMap.current || !isMapInitialized) return

    const container = leafletMap.current.getContainer()
    if (theme === "dark") {
      container.classList.add("dark-theme")
      document.documentElement.style.setProperty(
        "--map-tiles-filter",
        "brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)",
      )
    } else {
      container.classList.remove("dark-theme")
      document.documentElement.style.removeProperty("--map-tiles-filter")
    }
  }, [theme, isMapInitialized])

  return (
    <div className={`relative ${className || ""}`} style={{ height, width }}>
      <div
        ref={mapRef}
        className="h-full w-full z-0"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      />
      <style jsx global>{`
        .leaflet-tile-pane {
          filter: var(--map-tiles-filter, none);
        }
        .dark-theme .leaflet-control-attribution {
          background: rgba(0, 0, 0, 0.5);
          color: #ddd;
        }
        .dark-theme .leaflet-control-attribution a {
          color: #bbb;
        }
        .dark-theme .leaflet-container {
          background: #303030;
        }
        .custom-marker {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

// Helper function to get marker color based on device type and status
function getMarkerColor(deviceType?: string, status = "active") {
  if (status === "critical") return "#ff0000"
  if (status === "warning") return "#ff9900"

  switch (deviceType) {
    case "ground-nodes":
    case "ground_node":
      return "#00cc00"
    case "marine-buoys":
    case "marine_buoy":
      return "#0066ff"
    case "wearables":
    case "wearable":
      return "#9900cc"
    case "drones":
    case "drone":
      return "#ff6600"
    case "helmets":
    case "seh":
      return "#ffcc00"
    default:
      return "#0066ff"
  }
}
