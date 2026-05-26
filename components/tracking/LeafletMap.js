"use client";

import { useEffect, useRef } from "react";

// ─── LeafletMap Component ─────────────────────────────────────────────────────
// Uses Leaflet.js + OpenStreetMap tiles (free, no API key needed)
// Route polyline drawn via OSRM public demo server
// ─────────────────────────────────────────────────────────────────────────────

export default function LeafletMap({
  origin,
  destination,
  current,
  originLabel = "Origin",
  destinationLabel = "Destination",
  currentLabel = "Current Location",
  status,
}) {
  const mapRef     = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!origin || !destination) return;

    // Dynamically import Leaflet only on client
    let L;
    let isMounted = true;

    async function initMap() {
      try {
        L = (await import("leaflet")).default;

        // Leaflet CSS — inject if not already present
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id   = "leaflet-css";
          link.rel  = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        if (!mapRef.current || !isMounted) return;

        // Destroy previous instance if re-rendering
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }

        // Compute map center
        const midLat  = (origin[0] + destination[0]) / 2;
        const midLng  = (origin[1] + destination[1]) / 2;

        const map = L.map(mapRef.current, {
          center: [midLat, midLng],
          zoom: 3,
          zoomControl: true,
          scrollWheelZoom: false,
          attributionControl: true,
        });

        mapInstance.current = map;

        // OpenStreetMap tile layer (free, no key)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);

        // ── Custom icon helper ──────────────────────────────────────────────
        const makeIcon = (color, size = 32) => L.divIcon({
          html: `
            <div style="
              width:${size}px;height:${size}px;
              background:${color};
              border:3px solid white;
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              box-shadow:0 2px 8px rgba(0,0,0,0.3);
            "></div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size],
          className: "",
        });

        const originIcon = makeIcon("#FFB800", 28);
        const destIcon   = makeIcon("#0F172A", 28);
        const curIcon    = makeIcon("#22C55E", 32);

        // ── Markers ─────────────────────────────────────────────────────────
        const originMarker = L.marker(origin, { icon: originIcon }).addTo(map);
        originMarker.bindPopup(`<b>📦 Origin</b><br/>${originLabel}`, { closeButton: false });

        const destMarker = L.marker(destination, { icon: destIcon }).addTo(map);
        destMarker.bindPopup(`<b>🏁 Destination</b><br/>${destinationLabel}`, { closeButton: false });

        // Current location marker (if different from origin)
        if (current && (current[0] !== origin[0] || current[1] !== origin[1])) {
          const curMarker = L.marker(current, { icon: curIcon }).addTo(map);
          curMarker.bindPopup(`<b>📍 Current Location</b><br/>${currentLabel}`, { closeButton: false });
          curMarker.openPopup();
        } else {
          originMarker.openPopup();
        }

        // ── Fit map bounds ───────────────────────────────────────────────────
        const bounds = L.latLngBounds([origin, destination]);
        if (current) bounds.extend(current);
        map.fitBounds(bounds, { padding: [40, 40] });

        // ── Route via OSRM ───────────────────────────────────────────────────
        // OSRM public demo server (no key needed, suitable for demo usage)
        // For production, host your own OSRM or use a paid routing API
        try {
          // Build a great-circle arc if OSRM unavailable (transoceanic routes)
          const dist = Math.sqrt(
            Math.pow(destination[0] - origin[0], 2) +
            Math.pow(destination[1] - origin[1], 2)
          );

          if (dist > 40) {
            // Long-haul route — draw a curved arc (great circle approximation)
            const arcPoints = generateArc(origin, destination, 50);
            L.polyline(arcPoints, {
              color: "#FFB800",
              weight: 3,
              opacity: 0.8,
              dashArray: "8 6",
            }).addTo(map);

            // Add plane icon at midpoint
            const mid = arcPoints[Math.floor(arcPoints.length / 2)];
            L.marker(mid, {
              icon: L.divIcon({
                html: `<div style="font-size:22px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">✈️</div>`,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
                className: "",
              }),
            }).addTo(map);
          } else {
            // Short route — try OSRM
            const [oLng, oLat] = [origin[1], origin[0]];
            const [dLng, dLat] = [destination[1], destination[0]];
            const url = `https://router.project-osrm.org/route/v1/driving/${oLng},${oLat};${dLng},${dLat}?overview=full&geometries=geojson`;

            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 5000);

            const res  = await fetch(url, { signal: controller.signal });
            clearTimeout(timer);

            if (res.ok) {
              const data = await res.json();
              if (data.routes?.[0]?.geometry?.coordinates) {
                const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
                L.polyline(coords, {
                  color: "#FFB800",
                  weight: 4,
                  opacity: 0.85,
                }).addTo(map);
              }
            }
          }
        } catch (routeErr) {
          // Route fetch failed — draw straight dashed line as fallback
          L.polyline([origin, destination], {
            color: "#FFB800",
            weight: 3,
            opacity: 0.6,
            dashArray: "10 8",
          }).addTo(map);
        }
      } catch (err) {
        console.error("Leaflet map init error:", err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [origin, destination, current, originLabel, destinationLabel, currentLabel]);

  return (
    <div
      ref={mapRef}
      style={{ height: "260px", width: "100%" }}
      className="z-0 rounded-t-2xl"
    />
  );
}

// ── Great circle arc generator ────────────────────────────────────────────────
function generateArc(start, end, numPoints = 50) {
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    // Simple interpolation with a parabolic altitude offset for visual arc
    const lat = start[0] + (end[0] - start[0]) * t;
    const lng = start[1] + (end[1] - start[1]) * t;
    // Lift the middle of the arc slightly northward for visual effect
    const arc = Math.sin(Math.PI * t) * 8;
    points.push([lat + arc, lng]);
  }
  return points;
}