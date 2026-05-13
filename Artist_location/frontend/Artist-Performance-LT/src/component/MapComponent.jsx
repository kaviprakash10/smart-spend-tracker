import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to re-center map when coordinates change
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 13, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [lat, lng, map]);
  return null;
};

const MapComponent = ({
  lat,
  lng,
  venueName,
  events = [],
  onMarkerClick,
  isSelected,
}) => {
  const hasSelectedCoords = lat && lng;
  const mapCenter = hasSelectedCoords ? [lat, lng] : [20, 78];
  const mapZoom = hasSelectedCoords ? 13 : 5;

  return (
    <div
      style={{
        height: "300px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid var(--glass-border)",
        position: "relative",
      }}
    >
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {hasSelectedCoords && <RecenterMap lat={lat} lng={lng} />}

        {/* Render all events passed in */}
        {events.map(
          (ev) =>
            ev.latitude &&
            ev.longitude && (
              <Marker
                key={ev._id}
                position={[ev.latitude, ev.longitude]}
                eventHandlers={{
                  click: () => onMarkerClick && onMarkerClick(ev),
                }}
              >
                <Popup>
                  <strong>{ev.venueName}</strong>
                  <br />
                  {ev.artist?.artistName || "Artist"}
                </Popup>
              </Marker>
            ),
        )}

        {/* Support legacy single marker if not in events array */}
        {hasSelectedCoords &&
          !events.find((e) => e.latitude === lat && e.longitude === lng) && (
            <Marker position={[lat, lng]}>
              <Popup>
                <strong>{venueName}</strong>
              </Popup>
            </Marker>
          )}
      </MapContainer>

      {!hasSelectedCoords && isSelected && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(239, 68, 68, 0.9)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "0.8rem",
            zIndex: 1000,
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          ⚠️ No coordinates found for "{venueName}"
        </div>
      )}

      {!hasSelectedCoords &&
        !events.some((e) => e.latitude && e.longitude) &&
        !isSelected && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              zIndex: 1000,
              pointerEvents: "none",
              borderRadius: "12px",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <div>
              <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                📍 No Manifestations Found
              </p>
              <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                Assign locations to rituals to see them on the map.
              </p>
            </div>
          </div>
        )}
    </div>
  );
};

export default MapComponent;
