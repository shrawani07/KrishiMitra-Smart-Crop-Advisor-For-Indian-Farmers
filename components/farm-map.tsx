"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

interface FarmMapProps {
  position: [number, number];
  locationName: string;
  zoom?: number;
}

const FarmMap: React.FC<FarmMapProps> = ({ position, locationName, zoom = 10 }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  // Setup marker icon globally
  useEffect(() => {
    if (typeof window !== "undefined" && L.Icon.Default.prototype._getIconUrl) {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x.src,
        iconUrl: markerIcon.src,
        shadowUrl: markerShadow.src,
      });
    }
  }, []);

  useEffect(() => {
    // Destroy previous map instance if exists
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    if (mapRef.current) {
      const map = L.map(mapRef.current).setView(position, zoom);
      leafletMapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker(position)
        .addTo(map)
        .bindPopup(`Farm location: <b>${locationName}</b>`)
        .openPopup();
    }
  }, [position, locationName, zoom]);

  return (
    <div
      ref={mapRef}
      style={{
        height: "300px",
        width: "100%",
        borderRadius: "8px",
        zIndex: 0,
      }}
      className="border"
    />
  );
};

export default FarmMap;
