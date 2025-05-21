// Generate random heatmap data points around a center point
export function generateRandomHeatmapData(
  center: { lat: number; lng: number },
  radius: number,
  count: number,
  maxIntensity = 100,
) {
  const points = []

  for (let i = 0; i < count; i++) {
    // Generate a random point within the radius of the center
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * radius
    const lat = center.lat + distance * Math.cos(angle) * 0.01
    const lng = center.lng + distance * Math.sin(angle) * 0.01

    // Generate a random intensity (weight)
    const weight = Math.random() * maxIntensity

    // Add the point to the array
    points.push({
      location: { lat, lng },
      weight,
    })
  }

  return points
}

// Convert Google Maps heatmap data to Leaflet format
export function convertToLeafletHeatmapData(googleHeatmapData: Array<{ location: any; weight?: number }>) {
  return googleHeatmapData.map((point) => {
    const lat = typeof point.location.lat === "function" ? point.location.lat() : point.location.lat
    const lng = typeof point.location.lng === "function" ? point.location.lng() : point.location.lng
    const intensity = point.weight || 1
    return [lat, lng, intensity] as [number, number, number]
  })
}

// Generate heatmap data for multiple centers (e.g., device locations)
export function generateHeatmapDataForDevices(
  devices: Array<{ position: { lat: number; lng: number }; type?: string; status?: string }>,
  pointsPerDevice = 50,
  maxRadius = 5,
) {
  let allPoints: Array<{ location: { lat: number; lng: number }; weight: number }> = []

  devices.forEach((device) => {
    // Determine intensity based on device type and status
    let maxIntensity = 30 // Default intensity

    if (device.status === "critical") {
      maxIntensity = 100
    } else if (device.status === "warning") {
      maxIntensity = 70
    }

    // Generate more points for certain device types
    let pointCount = pointsPerDevice
    if (device.type === "ground-nodes") {
      pointCount = pointsPerDevice * 2
    }

    // Generate random radius based on device type
    let radius = Math.random() * maxRadius + 1
    if (device.type === "marine-buoys") {
      radius = Math.random() * maxRadius * 2 + 3 // Larger radius for marine buoys
    }

    // Generate points for this device
    const devicePoints = generateRandomHeatmapData(device.position, radius, pointCount, maxIntensity)

    // Add to all points
    allPoints = [...allPoints, ...devicePoints]
  })

  return allPoints
}
