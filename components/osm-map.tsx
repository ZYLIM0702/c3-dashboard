"use client"

import { useEffect, useRef } from "react"

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
  show3DBuildings?: boolean
}

export function OSMMap({
  height = "100%",
  width = "100%",
  className,
}: OSMMapProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Keyboard shortcut for auto-rotate (press 'e') and hide UI (Ctrl+U)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "e" || e.key === "E") {
        // Post a message to the iframe to trigger auto-rotate
        if (iframeRef.current) {
          iframeRef.current.contentWindow?.postMessage({ type: "autoRotate" }, "*")
        }
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) {
        // Post a message to the iframe to hide UI
        if (iframeRef.current) {
          iframeRef.current.contentWindow?.postMessage({ type: "hideUI" }, "*")
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // When iframe loads, listen for Ctrl+U to hide UI
  const handleIframeLoad = () => {
    // Optionally, you could auto-hide UI here or just rely on the shortcut
  }

  return (
    <iframe
      ref={iframeRef}
      src="https://streets.gl/#3.15925,101.71337,45.00,0.00,1500.00"
      style={{ height, width, minHeight: 400, minWidth: 300, border: "2px solid #888", background: "#e0e0e0" }}
      className={className}
      allowFullScreen
      title="StreetsGL 3D Map"
      onLoad={handleIframeLoad}
    />
  )
}
