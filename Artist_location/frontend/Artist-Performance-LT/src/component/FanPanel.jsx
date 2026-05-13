import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../config/axios";
import MapComponent from "./MapComponent";

const FanPanel = () => {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistEvents, setArtistEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const artistsPerPage = 50;

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get("/artists");
        setArtists(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch artists:", err);
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  const handleArtistClick = async (artist) => {
    setSelectedArtist(artist);
    setEventsLoading(true);
    try {
      const response = await axios.get(`/events/artist/${artist._id}`);
      setArtistEvents(response.data);
    } catch (err) {
      console.error("Failed to fetch artist events:", err);
    } finally {
      setEventsLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          color: "#b3ccbd",
        }}
      >
        Invoking the musical archives...
      </div>
    );
  }

  // Pagination Logic
  const totalPages = Math.ceil(artists.length / artistsPerPage);
  const indexOfLastArtist = currentPage * artistsPerPage;
  const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
  const currentArtists = artists.slice(indexOfFirstArtist, indexOfLastArtist);

  return (
    <div className="container" style={{ paddingBottom: "4rem" }}>
      <header
        style={{
          textAlign: "center",
          marginBottom: "4rem",
          animation: "fadeInDown 0.8s ease-out",
        }}
      >
        <h1
          style={{ fontSize: "3.5rem", color: "#d1e8e2", marginBottom: "1rem" }}
        >
          Artist Discovery
        </h1>
        <p style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>
          Explore the creators behind the melody.
        </p>
      </header>

      {/* Artist Grid - 3 in a row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2rem",
          animation: "fadeInUp 0.6s ease-out",
        }}
      >
        {currentArtists.map((artist) => (
          <div
            key={artist._id}
            onClick={() => handleArtistClick(artist)}
            className="glass-card"
            style={{
              padding: "2rem",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.3s ease, border-color 0.3s ease",
              border:
                selectedArtist?._id === artist._id
                  ? "1px solid #818cf8"
                  : "1px solid rgba(179, 204, 189, 0.1)",
              background:
                selectedArtist?._id === artist._id
                  ? "rgba(129, 140, 248, 0.05)"
                  : "rgba(255,255,255,0.03)",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: artist.profileImage
                  ? `url(${artist.profileImage}) center/cover no-repeat`
                  : "linear-gradient(135deg, #6b8f7b, #4a6b5a)",
                margin: "0 auto 1.5rem",
                border: "2px solid rgba(179, 204, 189, 0.2)",
              }}
            />
            <h3 style={{ color: "#d1e8e2", marginBottom: "0.5rem" }}>
              {artist.artistName}
            </h3>
            <span
              style={{
                display: "inline-block",
                padding: "0.2rem 0.8rem",
                borderRadius: "100px",
                background: "rgba(129, 140, 248, 0.1)",
                color: "#818cf8",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {artist.genre || "Universal Sound"}
            </span>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "3rem",
          }}
        >
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((prev) => prev - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              padding: "0.8rem 1.5rem",
              background:
                currentPage === 1
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(129, 140, 248, 0.1)",
              border:
                currentPage === 1
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(129, 140, 248, 0.3)",
              color: currentPage === 1 ? "var(--text-muted)" : "#818cf8",
              borderRadius: "8px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Previous
          </button>
          <span
            style={{
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              fontSize: "1.1rem",
            }}
          >
            Page{" "}
            <strong style={{ color: "#d1e8e2", margin: "0 0.4rem" }}>
              {currentPage}
            </strong>{" "}
            of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((prev) => prev + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              padding: "0.8rem 1.5rem",
              background:
                currentPage === totalPages
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(129, 140, 248, 0.1)",
              border:
                currentPage === totalPages
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(129, 140, 248, 0.3)",
              color:
                currentPage === totalPages ? "var(--text-muted)" : "#818cf8",
              borderRadius: "8px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Artist Details Pop-up Modal */}
      {selectedArtist && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setSelectedArtist(null)}
        >
          <div
            style={{
              padding: "3rem",
              background: "rgba(15, 23, 42, 0.95)",
              borderRadius: "32px",
              border: "1px solid rgba(179, 204, 189, 0.15)",
              animation: "fadeInUp 0.4s ease-out",
              width: "90%",
              maxWidth: "900px",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent clicking inside modal from closing it
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedArtist(null)}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                color: "#d1e8e2",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                fontSize: "1.5rem",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")
              }
            >
              ×
            </button>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "3rem",
              }}
            >
              {/* Left: Bio & Stats */}
              <div>
                <h2
                  style={{
                    color: "#d1e8e2",
                    fontSize: "2rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {selectedArtist.artistName}
                </h2>
                <p
                  style={{
                    color: "var(--text-muted)",
                    lineHeight: 1.8,
                    marginBottom: "2rem",
                  }}
                >
                  {selectedArtist.bio ||
                    "This artist's story is still being composed."}
                </p>

                <div style={{ display: "flex", gap: "1rem" }}>
                  {selectedArtist.instagram && (
                    <a
                      href={`https://instagram.com/${selectedArtist.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#b3ccbd",
                        fontSize: "0.9rem",
                        textDecoration: "none",
                      }}
                    >
                      Instagram ↗
                    </a>
                  )}
                  {selectedArtist.twitter && (
                    <a
                      href={`https://twitter.com/${selectedArtist.twitter.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#b3ccbd",
                        fontSize: "0.9rem",
                        textDecoration: "none",
                      }}
                    >
                      Twitter ↗
                    </a>
                  )}
                </div>
              </div>

              {/* Right: Events List */}
              <div
                style={{
                  background: "rgba(179, 204, 189, 0.05)",
                  padding: "2rem",
                  borderRadius: "24px",
                  border: "1px solid rgba(179, 204, 189, 0.1)",
                }}
              >
                <h3
                  style={{
                    color: "#d1e8e2",
                    marginBottom: "1.5rem",
                    fontSize: "1.2rem",
                  }}
                >
                  Upcoming Rituals
                </h3>

                {eventsLoading ? (
                  <p style={{ color: "var(--text-muted)" }}>
                    Decoding event frequencies...
                  </p>
                ) : artistEvents.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    {artistEvents
                      .filter((e) => e.status === "UPCOMING")
                      .map((ev) => (
                        <div
                          key={ev._id}
                          style={{
                            padding: "1rem",
                            background: "rgba(255,255,255,0.02)",
                            borderRadius: "16px",
                            border: "1px solid rgba(179, 204, 189, 0.08)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <span style={{ color: "#b3ccbd", fontWeight: 600 }}>
                              {ev.venueName}
                            </span>
                            <span
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "0.8rem",
                              }}
                            >
                              {new Date(ev.eventDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p
                            style={{
                              color: "#94a3b8",
                              fontSize: "0.85rem",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {ev.address}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "0.75rem",
                              alignItems: "center",
                            }}
                          >
                            <span style={{ color: "var(--text-muted)" }}>
                              Capacity: {ev.totalPerson}
                            </span>
                            <span
                              style={{
                                color:
                                  ev.booked >= ev.totalPerson
                                    ? "#f87171"
                                    : "#10b981",
                                fontWeight: 600,
                              }}
                            >
                              {ev.booked >= ev.totalPerson
                                ? "FULLY BOOKED"
                                : `Available: ${ev.totalPerson - ev.booked}`}
                            </span>
                          </div>
                          {ev.booked < ev.totalPerson && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (
                                  window.confirm(
                                    "Do you want to book this event?",
                                  )
                                ) {
                                  try {
                                    const response = await axios.patch(
                                      `/events/${ev._id}/book`,
                                      {},
                                      {
                                        headers: {
                                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                                        },
                                      },
                                    );
                                    // Update local state
                                    setArtistEvents((prev) =>
                                      prev.map((event) =>
                                        event._id === ev._id
                                          ? response.data
                                          : event,
                                      ),
                                    );
                                    alert(
                                      "Booking successful! Event confirmed.",
                                    );
                                  } catch (err) {
                                    alert(
                                      err.response?.data?.error ||
                                        "Booking failed",
                                    );
                                  }
                                }
                              }}
                              style={{
                                marginTop: "1rem",
                                width: "100%",
                                padding: "0.6rem",
                                background: "rgba(16, 185, 129, 0.15)",
                                border: "1px solid rgba(16, 185, 129, 0.3)",
                                color: "#10b981",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                transition: "all 0.3s ease",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(16, 185, 129, 0.25)";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(16, 185, 129, 0.15)";
                              }}
                            >
                              Book Ritual
                            </button>
                          )}
                        </div>
                      ))}
                    {artistEvents.filter((e) => e.status === "UPCOMING")
                      .length === 0 && (
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontStyle: "italic",
                        }}
                      >
                        No upcoming rituals scheduled.
                      </p>
                    )}
                  </div>
                ) : (
                  <p
                    style={{ color: "var(--text-muted)", fontStyle: "italic" }}
                  >
                    No rituals found for this artist.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FanPanel;
