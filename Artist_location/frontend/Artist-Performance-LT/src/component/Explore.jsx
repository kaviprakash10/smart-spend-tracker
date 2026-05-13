import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "../config/axios";
import { Link } from "react-router-dom";
import L from "leaflet";

// Fix for default marker icons in React Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 14, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [lat, lng, map]);
  return null;
};

const Explore = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoords, setSelectedCoords] = useState(null);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await axios.get("/events");
        // backend returns pagination metadata with an `events` array property
        const payload = response.data;
        if (Array.isArray(payload)) {
          setEvents(payload);
        } else if (payload && Array.isArray(payload.events)) {
          setEvents(payload.events);
        } else {
          // ensure we always keep an array to avoid runtime errors
          setEvents([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setLoading(false);
      }
    };
    fetchAllEvents();
  }, []);

  const filteredEvents = (Array.isArray(events) ? events : []).filter(
    (ev) =>
      ev.venueName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.artist?.artistName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.address?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const upcomingEvents = filteredEvents.filter(
    (ev) => ev.status === "UPCOMING",
  );

  return (
    <div className="container" style={{ paddingBottom: "4rem" }}>
      <div
        className="page-header"
        style={{
          textAlign: "center",
          marginBottom: "4rem",
          animation: "fadeInDown 0.8s ease-out",
        }}
      >
        <h1 style={{ fontSize: "3.5rem", color: "#d1e8e2" }}>
          Infinite Gatherings
        </h1>
        <p style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>
          Explore the city's artistic frequency on the interactive manifestation
          map.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2.5fr",
          gap: "3rem",
          animation: "fadeInUp 0.6s ease-out",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className="peace-card">
            <h3 style={{ color: "#d1e8e2", marginBottom: "1.5rem" }}>
              Find a frequency
            </h3>
            <input
              type="text"
              className="modern-input"
              placeholder="Artist, Venue or City..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                border: "1px solid rgba(179, 204, 189, 0.2)",
              }}
            />
          </div>

          <div
            className="peace-card"
            style={{ flex: 1, overflowY: "auto", maxHeight: "500px" }}
          >
            <h4 style={{ color: "#d1e8e2", marginBottom: "1.5rem" }}>
              Upcoming Rituals
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {upcomingEvents.map((ev) => (
                <div
                  key={ev._id}
                  onClick={() => {
                    if (ev.latitude && ev.longitude) {
                      setSelectedCoords([ev.latitude, ev.longitude]);
                    }
                  }}
                  style={{
                    padding: "1.2rem",
                    borderRadius: "16px",
                    background:
                      selectedCoords &&
                      selectedCoords[0] === ev.latitude &&
                      selectedCoords[1] === ev.longitude
                        ? "rgba(129, 140, 248, 0.1)"
                        : "rgba(255,255,255,0.03)",
                    border:
                      selectedCoords &&
                      selectedCoords[0] === ev.latitude &&
                      selectedCoords[1] === ev.longitude
                        ? "1px solid rgba(129, 140, 248, 0.5)"
                        : "1px solid rgba(179, 204, 189, 0.1)",
                    cursor: ev.latitude && ev.longitude ? "pointer" : "default",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    if (ev.latitude && ev.longitude) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.1)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (ev.latitude && ev.longitude) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <p style={{ fontWeight: 600, color: "#b3ccbd" }}>
                      {ev.artist?.artistName || "Ancient Echo"}
                    </p>
                    <span
                      style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                    >
                      {new Date(ev.eventDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: "1rem", color: "#d1e8e2" }}>
                    {ev.venueName}
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      marginTop: "0.4rem",
                    }}
                  >
                    {ev.address}
                  </p>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p
                  style={{
                    color: "var(--text-muted)",
                    textAlign: "center",
                    padding: "1rem",
                  }}
                >
                  No rituals found in this frequency.
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          className="peace-card"
          style={{ padding: "1rem", height: "700px", position: "relative" }}
        >
          {loading ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#b3ccbd",
              }}
            >
              Calibrating coordinates...
            </div>
          ) : (
            <MapContainer
              center={[20, 78]}
              zoom={5}
              style={{ height: "100%", width: "100%", borderRadius: "16px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <RecenterMap
                lat={selectedCoords ? selectedCoords[0] : null}
                lng={selectedCoords ? selectedCoords[1] : null}
              />
              {upcomingEvents.map(
                (ev) =>
                  ev.latitude &&
                  ev.longitude && (
                    <Marker key={ev._id} position={[ev.latitude, ev.longitude]}>
                      <Popup>
                        <div style={{ padding: "10px", minWidth: "200px" }}>
                          <h4 style={{ margin: "0 0 5px", color: "#1e293b" }}>
                            {ev.artist?.artistName}
                          </h4>
                          <p style={{ margin: "0 0 5px", fontWeight: 600 }}>
                            {ev.venueName}
                          </p>
                          <p style={{ margin: "0 0 5px", fontSize: "0.9rem" }}>
                            {new Date(ev.eventDate).toDateString()}
                          </p>
                          <p
                            style={{
                              margin: "0",
                              fontSize: "0.85rem",
                              color: "#64748b",
                            }}
                          >
                            {ev.address}
                          </p>
                          <div
                            style={{
                              marginTop: "10px",
                              paddingTop: "10px",
                              borderTop: "1px solid #e2e8f0",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span style={{ fontSize: "0.8rem" }}>
                              Capacity: {ev.totalPerson}
                            </span>
                            <span
                              style={{ fontSize: "0.8rem", color: "#10b981" }}
                            >
                              Booked: {ev.booked}
                            </span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ),
              )}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
