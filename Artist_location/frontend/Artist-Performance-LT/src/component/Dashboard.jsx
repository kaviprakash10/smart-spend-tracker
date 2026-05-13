import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchArtistProfile, fetchMyEvents } from "../slice/artistSlice";
import { Link } from "react-router-dom";
import axios from "../config/axios";
import MapComponent from "./MapComponent";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, events, loading } = useSelector((state) => state.artist);

  const [fanBookings, setFanBookings] = useState([]);
  const [fanLoading, setFanLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const isArtist = user?.role === "artist";

  useEffect(() => {
    if (isArtist && !profile) {
      dispatch(fetchArtistProfile());
    }
  }, [dispatch, isArtist, profile]);

  useEffect(() => {
    if (isArtist && profile?._id) {
      dispatch(fetchMyEvents(profile._id));
    }
  }, [dispatch, isArtist, profile]);

  useEffect(() => {
    if (!isArtist && user) {
      const fetchBookings = async () => {
        setFanLoading(true);
        try {
          const response = await axios.get("/events/my-bookings", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setFanBookings(response.data);
        } catch (err) {
          console.error("Failed to fetch fan bookings:", err);
        } finally {
          setFanLoading(false);
        }
      };
      fetchBookings();
    }
  }, [isArtist, user]);

  const currentEvents = isArtist ? events : fanBookings;
  const currentLoading = isArtist ? loading : fanLoading;

  const upcomingEvents = currentEvents.filter((ev) => ev.status === "UPCOMING");
  const pastEvents = currentEvents.filter((ev) => ev.status === "COMPLETED");
  const totalBooked = currentEvents.reduce(
    (sum, ev) => sum + (ev.booked || 0),
    0,
  );
  const totalCapacity = currentEvents.reduce(
    (sum, ev) => sum + (ev.totalPerson || 0),
    0,
  );
  const bookingRate =
    totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  return (
    <div className="container" style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div
        className="page-header"
        style={{
          animation: "fadeInDown 0.8s ease-out",
          textAlign: "center",
          marginBottom: "3rem",
        }}
      >
        <h1 style={{ color: "#d1e8e2", fontSize: "2.8rem" }}>
          {isArtist
            ? `Welcome back, ${profile?.artistName || user?.userName}`
            : `Welcome back, ${user?.userName}`}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
          {isArtist
            ? "Here's a snapshot of your performance journey."
            : "Here's the lineup of your upcoming and past booked rituals."}
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2.5rem",
          animation: "fadeInUp 0.6s ease-out",
        }}
      >
        {[
          {
            label: isArtist ? "Upcoming Shows" : "Booked Returns",
            value: upcomingEvents.length,
            icon: "◈",
            color: "#818cf8",
            gradient:
              "linear-gradient(135deg, rgba(129,140,248,0.1), rgba(129,140,248,0.03))",
          },
          {
            label: isArtist ? "Booking Rate" : "Total Reserved Seats",
            value: isArtist ? `${bookingRate}%` : totalBooked,
            icon: "▣",
            color: "#10b981",
            gradient:
              "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.03))",
          },
          {
            label: isArtist ? "Past Performances" : "Attended Rituals",
            value: pastEvents.length,
            icon: "✦",
            color: "#c084fc",
            gradient:
              "linear-gradient(135deg, rgba(192,132,252,0.1), rgba(192,132,252,0.03))",
          },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: stat.gradient,
              border: "1px solid rgba(179, 204, 189, 0.1)",
              borderRadius: "22px",
              padding: "2rem",
              textAlign: "center",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "14px",
                right: "18px",
                fontSize: "1.5rem",
                opacity: 0.15,
                color: stat.color,
              }}
            >
              {stat.icon}
            </div>
            <span
              style={{
                display: "block",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontWeight: 600,
                marginBottom: "0.8rem",
              }}
            >
              {stat.label}
            </span>
            <span
              style={{ fontSize: "2.8rem", fontWeight: 300, color: stat.color }}
            >
              {currentLoading ? "..." : stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "2rem",
          animation: "fadeInUp 0.8s ease-out",
        }}
      >
        {/* Upcoming Events List */}
        <div
          style={{
            background: "rgba(179, 204, 189, 0.06)",
            border: "1px solid rgba(179, 204, 189, 0.12)",
            borderRadius: "24px",
            padding: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ color: "#d1e8e2", fontWeight: 500 }}>
              Upcoming Performances
            </h3>
          </div>

          {currentLoading ? (
            <div
              style={{ textAlign: "center", padding: "2rem", color: "#b3ccbd" }}
            >
              Loading your schedule...
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {upcomingEvents.slice(0, 5).map((ev, i) => (
                <div
                  key={ev._id}
                  onClick={() => {
                    if (ev.latitude && ev.longitude) {
                      setSelectedLocation({
                        lat: ev.latitude,
                        lng: ev.longitude,
                        venueName: ev.venueName,
                      });
                    } else {
                      setSelectedLocation({ venueName: ev.venueName });
                    }
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1.2rem 0",
                    borderBottom:
                      i < Math.min(upcomingEvents.length, 5) - 1
                        ? "1px solid rgba(179, 204, 189, 0.08)"
                        : "none",
                    cursor: !isArtist ? "pointer" : "default",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        background: "rgba(129, 140, 248, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#818cf8",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {new Date(ev.eventDate).getDate()}
                    </div>
                    <div>
                      <p
                        style={{
                          fontWeight: 500,
                          color: "#d1e8e2",
                          fontSize: "0.95rem",
                        }}
                      >
                        {ev.venueName}{" "}
                        {!isArtist && (
                          <span
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-muted)",
                              marginLeft: "0.5rem",
                            }}
                          >
                            - {ev.artist?.artistName}
                          </span>
                        )}
                      </p>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {new Date(ev.eventDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {" · "}
                        {ev.address?.substring(0, 30)}
                        {ev.address?.length > 30 ? "..." : ""}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.8rem",
                        borderRadius: "100px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: "rgba(16, 185, 129, 0.1)",
                        color: "#10b981",
                      }}
                    >
                      Confirmed
                    </span>
                    {isArtist && (
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          marginTop: "0.3rem",
                        }}
                      >
                        {ev.booked || 0}/{ev.totalPerson} seats
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                border: "2px dashed rgba(179, 204, 189, 0.1)",
                borderRadius: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "2rem",
                  opacity: 0.3,
                  display: "block",
                  marginBottom: "1rem",
                }}
              >
                ◈
              </span>
              <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
                {isArtist
                  ? "No upcoming shows scheduled yet."
                  : "Explore our curated list of artists and their upcoming performances."}
              </p>
              {!isArtist && (
                <Link
                  to="/fan"
                  style={{
                    display: "inline-block",
                    padding: "0.7rem 2rem",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "white",
                    borderRadius: "12px",
                    fontWeight: 600,
                    textDecoration: "none",
                    boxShadow: "0 4px 20px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  Discover Artists
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Quick Glance */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Map - shows selected upcoming event location for fans */}
          <MapComponent
            lat={selectedLocation?.lat}
            lng={selectedLocation?.lng}
            venueName={selectedLocation?.venueName}
            events={currentEvents}
            onMarkerClick={(ev) => {
              if (ev.latitude && ev.longitude) {
                setSelectedLocation({
                  lat: ev.latitude,
                  lng: ev.longitude,
                  venueName: ev.venueName,
                });
              }
            }}
            isSelected={!!selectedLocation}
          />
          {/* Booking Progress */}
          {isArtist && totalCapacity > 0 && (
            <div
              style={{
                background: "rgba(179, 204, 189, 0.06)",
                border: "1px solid rgba(179, 204, 189, 0.12)",
                borderRadius: "24px",
                padding: "2rem",
              }}
            >
              <h4
                style={{
                  color: "#d1e8e2",
                  marginBottom: "1.5rem",
                  fontWeight: 500,
                }}
              >
                Booking Overview
              </h4>
              <div style={{ marginBottom: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}
                  >
                    Overall Capacity
                  </span>
                  <span
                    style={{
                      color: "#d1e8e2",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {totalBooked} / {totalCapacity}
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    borderRadius: "100px",
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${bookingRate}%`,
                      height: "100%",
                      borderRadius: "100px",
                      background: "linear-gradient(90deg, #6b8f7b, #10b981)",
                      transition: "width 1s ease",
                    }}
                  />
                </div>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                {bookingRate}% of total seats filled across all events
              </p>
            </div>
          )}

          {/* Recent Past Events */}
          <div
            style={{
              background: "rgba(179, 204, 189, 0.04)",
              border: "1px solid rgba(179, 204, 189, 0.08)",
              borderRadius: "24px",
              padding: "2rem",
              flex: 1,
            }}
          >
            <h4
              style={{
                color: "#d1e8e2",
                marginBottom: "1.5rem",
                fontWeight: 500,
              }}
            >
              {isArtist ? "Past Performances" : "Attended Rituals"}
            </h4>
            {pastEvents.length > 0 ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "0" }}
              >
                {pastEvents.slice(0, 4).map((ev, i) => (
                  <div
                    key={ev._id}
                    style={{
                      padding: "0.8rem 0",
                      borderBottom:
                        i < Math.min(pastEvents.length, 4) - 1
                          ? "1px solid rgba(179, 204, 189, 0.06)"
                          : "none",
                      opacity: 0.7,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#ced4da", fontSize: "0.9rem" }}>
                        {ev.venueName}{" "}
                        {!isArtist && (
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {" "}
                            - {ev.artist?.artistName}
                          </span>
                        )}
                      </span>
                      <span
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.78rem",
                        }}
                      >
                        {new Date(ev.eventDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                  fontSize: "0.9rem",
                }}
              >
                {isArtist
                  ? "Your history is being written."
                  : "Log in as an artist to view past shows."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
