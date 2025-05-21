// Custom map styles for the application
// These styles can be customized using the Google Maps Styling Wizard: https://mapstyle.withgoogle.com/

export const defaultMapStyle = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#e9e9e9",
      },
      {
        lightness: 17,
      },
    ],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
      {
        lightness: 20,
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#ffffff",
      },
      {
        lightness: 17,
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#ffffff",
      },
      {
        lightness: 29,
      },
      {
        weight: 0.2,
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
      {
        lightness: 18,
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
      {
        lightness: 16,
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
      {
        lightness: 21,
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#dedede",
      },
      {
        lightness: 21,
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#ffffff",
      },
      {
        lightness: 16,
      },
      {
        weight: 0.2,
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#444444",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#f2f2f2",
      },
      {
        lightness: 19,
      },
    ],
  },
]

// Dark mode map style
export const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#181818",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1b1b1b",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#2c2c2c",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8a8a8a",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#373737",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#3c3c3c",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#4e4e4e",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3d3d3d",
      },
    ],
  },
]

// Custom marker icons
export const markerIcons = {
  groundNode: {
    path: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
    fillColor: "#4CAF50",
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#ffffff",
    scale: 1.5,
    anchor: { x: 12, y: 22 },
  },
  marineBouy: {
    path: "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
    fillColor: "#2196F3",
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#ffffff",
    scale: 1.5,
    anchor: { x: 12, y: 12 },
  },
  wearable: {
    path: "M16,9H13V14.5A2.5,2.5 0 0,1 10.5,17A2.5,2.5 0 0,1 8,14.5A2.5,2.5 0 0,1 10.5,12C11.07,12 11.58,12.19 12,12.5V7H16M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z",
    fillColor: "#9C27B0",
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#ffffff",
    scale: 1.5,
    anchor: { x: 12, y: 12 },
  },
  drone: {
    path: "M22,10.5A1.5,1.5 0 0,0 20.5,9A1.5,1.5 0 0,0 19,10.5A1.5,1.5 0 0,0 20.5,12A1.5,1.5 0 0,0 22,10.5M22,13.5A1.5,1.5 0 0,0 20.5,12A1.5,1.5 0 0,0 19,13.5A1.5,1.5 0 0,0 20.5,15A1.5,1.5 0 0,0 22,13.5M5,10.5A1.5,1.5 0 0,0 3.5,9A1.5,1.5 0 0,0 2,10.5A1.5,1.5 0 0,0 3.5,12A1.5,1.5 0 0,0 5,10.5M5,13.5A1.5,1.5 0 0,0 3.5,12A1.5,1.5 0 0,0 2,13.5A1.5,1.5 0 0,0 3.5,15A1.5,1.5 0 0,0 5,13.5M10.5,5A1.5,1.5 0 0,0 9,3.5A1.5,1.5 0 0,0 7.5,5A1.5,1.5 0 0,0 9,6.5A1.5,1.5 0 0,0 10.5,5M13.5,5A1.5,1.5 0 0,0 12,3.5A1.5,1.5 0 0,0 10.5,5A1.5,1.5 0 0,0 12,6.5A1.5,1.5 0 0,0 13.5,5M10.5,19A1.5,1.5 0 0,0 9,17.5A1.5,1.5 0 0,0 7.5,19A1.5,1.5 0 0,0 9,20.5A1.5,1.5 0 0,0 10.5,19M13.5,19A1.5,1.5 0 0,0 12,17.5A1.5,1.5 0 0,0 10.5,19A1.5,1.5 0 0,0 12,20.5A1.5,1.5 0 0,0 13.5,19M16.5,15A1.5,1.5 0 0,0 15,13.5A1.5,1.5 0 0,0 13.5,15A1.5,1.5 0 0,0 15,16.5A1.5,1.5 0 0,0 16.5,15M10.5,15A1.5,1.5 0 0,0 9,13.5A1.5,1.5 0 0,0 7.5,15A1.5,1.5 0 0,0 9,16.5A1.5,1.5 0 0,0 10.5,15M16.5,9A1.5,1.5 0 0,0 15,7.5A1.5,1.5 0 0,0 13.5,9A1.5,1.5 0 0,0 15,10.5A1.5,1.5 0 0,0 16.5,9M10.5,9A1.5,1.5 0 0,0 9,7.5A1.5,1.5 0 0,0 7.5,9A1.5,1.5 0 0,0 9,10.5A1.5,1.5 0 0,0 10.5,9M12,14C13.11,14 14,13.11 14,12C14,10.89 13.11,10 12,10C10.89,10 10,10.89 10,12C10,13.11 10.89,14 12,14Z",
    fillColor: "#FF9800",
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#ffffff",
    scale: 1.5,
    anchor: { x: 12, y: 12 },
  },
  helmet: {
    path: "M12,1C9.79,1 8,2.79 8,5H16C16,2.79 14.21,1 12,1M12,6A1,1 0 0,0 11,7A1,1 0 0,0 12,8A1,1 0 0,0 13,7A1,1 0 0,0 12,6M7,9L4,12L7,15V9M17,9V15L20,12L17,9M8,9V16H16V9H8M11.5,10A0.5,0.5 0 0,1 12,10.5A0.5,0.5 0 0,1 11.5,11A0.5,0.5 0 0,1 11,10.5A0.5,0.5 0 0,1 11.5,10M12.5,10A0.5,0.5 0 0,1 13,10.5A0.5,0.5 0 0,1 12.5,11A0.5,0.5 0 0,1 12,10.5A0.5,0.5 0 0,1 12.5,10M8,17L12,21L16,17H8Z",
    fillColor: "#F44336",
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#ffffff",
    scale: 1.5,
    anchor: { x: 12, y: 12 },
  },
  alert: {
    path: "M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",
    fillColor: "#F44336",
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#ffffff",
    scale: 1.5,
    anchor: { x: 12, y: 12 },
  },
}

// Helper function to get marker icon based on device type and status
export function getMarkerIcon(deviceType: string, status = "active") {
  if (status === "critical" || status === "warning") {
    return markerIcons.alert
  }

  switch (deviceType) {
    case "ground-nodes":
    case "ground_node":
      return markerIcons.groundNode
    case "marine-buoys":
    case "marine_buoy":
      return markerIcons.marineBouy
    case "wearables":
    case "wearable":
      return markerIcons.wearable
    case "drones":
    case "drone":
      return markerIcons.drone
    case "helmets":
    case "seh":
      return markerIcons.helmet
    default:
      return markerIcons.groundNode
  }
}
