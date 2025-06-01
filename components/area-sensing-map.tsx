"use client";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";

const AnimatedCircle = ({ center, baseRadius, color }) => {
  const [radius, setRadius] = React.useState(baseRadius);
  const [growing, setGrowing] = React.useState(true);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRadius((prev) => {
        const next = growing ? prev + 100 : prev - 100;
        if (next > baseRadius + 500) setGrowing(false);
        if (next < baseRadius - 300) setGrowing(true);
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [growing, baseRadius]);
  return <Circle center={center} radius={radius} color={color} />;
};

export default function AreaSensingMap() {
  return (
    <MapContainer
      key={"area-sensing-map"}
      center={[3.1319, 101.6841]}
      zoom={13}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <AnimatedCircle center={[3.1319, 101.6841]} baseRadius={1000} color="#4271ff" />
      <AnimatedCircle center={[3.1342, 101.7277]} baseRadius={3000} color="#f43f5e" />
      <AnimatedCircle center={[3.1360, 101.6243]} baseRadius={2000} color="#e28743" />
      <AnimatedCircle center={[3.0868, 101.6479]} baseRadius={2000} color="#FFFF00" />
    </MapContainer>
  );
}
