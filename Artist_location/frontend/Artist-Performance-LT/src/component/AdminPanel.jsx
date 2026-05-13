import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminStats,
  fetchAllUsers,
  deleteUser,
  fetchAllArtists,
  createEvent,
  promoteToArtist,
  updateUser,
  updateArtistProfile,
  updateRole,
  updateEvent,
  deleteEvent,
  fetchAllEvents,
  clearAdminError,
} from "../slice/adminSlice";
import MapComponent from "./MapComponent";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearAdminError());
  }, [activeTab, dispatch]);

  const [eventForm, setEventForm] = useState({
    artist: "",
    venueName: "",
    address: "",
    eventDate: "",
    totalPerson: "",
  });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingArtist, setEditingArtist] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showNewRitualModal, setShowNewRitualModal] = useState(false);

  const {
    stats,
    users,
    artists,
    events,
    loading,
    error,
    userPagination,
    userTotals,
    artistPagination,
  } = useSelector((state) => state.admin);

  // Pagination & Tabs for Users section (server-side)
  const [userTab, setUserTab] = useState("artists"); // "artists" or "fans"
  const [artistPage, setArtistPage] = useState(1);
  const [fanPage, setFanPage] = useState(1);
  const usersPerPage = 50;

  // Pagination for Artists tab (artist profiles list, server-side)
  const [artistProfilePage, setArtistProfilePage] = useState(1);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAllEvents());
  }, [dispatch]);

  // Fetch paginated users when tab or page changes
  useEffect(() => {
    const role = userTab === "artists" ? "artist" : "fan";
    const page = userTab === "artists" ? artistPage : fanPage;
    dispatch(fetchAllUsers({ role, page, limit: usersPerPage }));
  }, [dispatch, userTab, artistPage, fanPage]);

  // Fetch paginated artist profiles when page changes
  useEffect(() => {
    dispatch(fetchAllArtists({ page: artistProfilePage, limit: usersPerPage }));
  }, [dispatch, artistProfilePage]);

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    dispatch(createEvent(eventForm));
    setEventForm({
      artist: "",
      venueName: "",
      address: "",
      eventDate: "",
      totalPerson: "",
    });
    setShowNewRitualModal(false);
  };

  const handleUserUpdate = (e) => {
    e.preventDefault();
    dispatch(updateUser({ id: editingUser._id, formData: editForm }));
    setEditingUser(null);
  };

  const handleArtistUpdate = (e) => {
    e.preventDefault();
    dispatch(
      updateArtistProfile({ id: editingArtist._id, formData: editForm }),
    );
    setEditingArtist(null);
  };

  const handleEventDelete = (id) => {
    if (window.confirm("Is this event cancelled forever?")) {
      dispatch(deleteEvent(id));
      if (selectedEvent?._id === id) setSelectedEvent(null);
    }
  };

  const handleEventUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(
        updateEvent({ id: editingEvent._id, formData: editForm }),
      );
      if (res && res.type && res.type.endsWith("/fulfilled") && res.payload) {
        // update local selectedEvent so UI reflects changes immediately
        setSelectedEvent(res.payload);
      }
    } catch (err) {
      // noop - errors handled in slice
      console.log(err.message);
    } finally {
      setEditingEvent(null);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Admin Command Center</h1>
        <p>Manage users, events, and system performance from one place.</p>
      </div>

      <div className="nav-peace" style={{ marginBottom: "2.5rem" }}>
        <div
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "12px",
            cursor: "pointer",
            background:
              activeTab === "overview"
                ? "rgba(179, 204, 189, 0.25)"
                : "transparent",
            color: activeTab === "overview" ? "#d1e8e2" : "var(--text-muted)",
            fontWeight: 600,
            transition: "all 0.3s ease",
          }}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </div>
        <div
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "12px",
            cursor: "pointer",
            background:
              activeTab === "users"
                ? "rgba(179, 204, 189, 0.25)"
                : "transparent",
            color: activeTab === "users" ? "#d1e8e2" : "var(--text-muted)",
            fontWeight: 600,
            transition: "all 0.3s ease",
          }}
          onClick={() => setActiveTab("users")}
        >
          Users
        </div>
        <div
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "12px",
            cursor: "pointer",
            background:
              activeTab === "artists"
                ? "rgba(179, 204, 189, 0.25)"
                : "transparent",
            color: activeTab === "artists" ? "#d1e8e2" : "var(--text-muted)",
            fontWeight: 600,
            transition: "all 0.3s ease",
          }}
          onClick={() => setActiveTab("artists")}
        >
          Artists
        </div>
        <div
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "12px",
            cursor: "pointer",
            background:
              activeTab === "events"
                ? "rgba(179, 204, 189, 0.25)"
                : "transparent",
            color: activeTab === "events" ? "#d1e8e2" : "var(--text-muted)",
            fontWeight: 600,
            transition: "all 0.3s ease",
          }}
          onClick={() => setActiveTab("events")}
        >
          Manage Events
        </div>
      </div>

      {loading && (
        <p style={{ textAlign: "center", margin: "2rem" }}>
          Harmonizing data...
        </p>
      )}
      {error && (
        <p style={{ color: "var(--error)", textAlign: "center" }}>{error}</p>
      )}

      {activeTab === "overview" && stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
          }}
        >
          <div className="peace-card" style={{ textAlign: "center" }}>
            <span
              style={{
                color: "var(--text-muted)",
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
              }}
            >
              Total Users
            </span>
            <div
              style={{ fontSize: "3.5rem", fontWeight: 300, color: "#d1e8e2" }}
            >
              {stats.counts.users}
            </div>
          </div>
          <div className="peace-card" style={{ textAlign: "center" }}>
            <span
              style={{
                color: "var(--text-muted)",
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
              }}
            >
              Active Artists
            </span>
            <div
              style={{ fontSize: "3.5rem", fontWeight: 300, color: "#d1e8e2" }}
            >
              {stats.counts.artists}
            </div>
          </div>
          <div className="peace-card" style={{ textAlign: "center" }}>
            <span
              style={{
                color: "var(--text-muted)",
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
              }}
            >
              Total Events
            </span>
            <div
              style={{ fontSize: "3.5rem", fontWeight: 300, color: "#d1e8e2" }}
            >
              {stats.counts.events}
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Sub-Tabs for Users Section */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => setUserTab("artists")}
              style={{
                flex: 1,
                padding: "1rem",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "1.1rem",
                background:
                  userTab === "artists"
                    ? "rgba(129, 140, 248, 0.15)"
                    : "rgba(255,255,255,0.03)",
                color: userTab === "artists" ? "#818cf8" : "var(--text-muted)",
                borderBottom:
                  userTab === "artists"
                    ? "2px solid #818cf8"
                    : "2px solid transparent",
                transition: "all 0.3s ease",
              }}
            >
              Registered Artists ({userTotals.artist})
            </button>
            <button
              onClick={() => setUserTab("fans")}
              style={{
                flex: 1,
                padding: "1rem",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "1.1rem",
                background:
                  userTab === "fans"
                    ? "rgba(129, 140, 248, 0.15)"
                    : "rgba(255,255,255,0.03)",
                color: userTab === "fans" ? "#818cf8" : "var(--text-muted)",
                borderBottom:
                  userTab === "fans"
                    ? "2px solid #818cf8"
                    : "2px solid transparent",
                transition: "all 0.3s ease",
              }}
            >
              Registered Fans ({userTotals.fan})
            </button>
          </div>

          {/* Artist Users Section */}
          {userTab === "artists" && (
            <div>
              <h3 style={{ color: "#d1e8e2", marginBottom: "1.5rem" }}>
                Registered Artists
              </h3>
              <div className="peace-card" style={{ padding: "0" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        textAlign: "left",
                        borderBottom: "1px solid rgba(179, 204, 189, 0.3)",
                        color: "#d1e8e2",
                      }}
                    >
                      <th style={{ padding: "1.5rem" }}>Username</th>
                      <th style={{ padding: "1.5rem" }}>Email</th>
                      <th style={{ padding: "1.5rem" }}>Role</th>
                      <th style={{ padding: "1.5rem" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u._id}
                        style={{
                          borderBottom: "1px solid rgba(179, 204, 189, 0.15)",
                        }}
                      >
                        <td style={{ padding: "1.2rem 1.5rem" }}>
                          {u.userName}
                        </td>
                        <td
                          style={{
                            padding: "1.2rem 1.5rem",
                            color: "#ced4da",
                          }}
                        >
                          {u.email}
                        </td>
                        <td style={{ padding: "1.2rem 1.5rem" }}>
                          <select
                            value={u.role}
                            onChange={(e) =>
                              dispatch(
                                updateRole({ id: u._id, role: e.target.value }),
                              )
                            }
                            className="form-control"
                            style={{
                              padding: "0.4rem 0.8rem",
                              width: "auto",
                              minWidth: "110px",
                              background: "rgba(179, 204, 189, 0.15)",
                              border: "1px solid rgba(179, 204, 189, 0.3)",
                              borderRadius: "8px",
                              color: "#fff",
                            }}
                          >
                            <option value="fan">Fan</option>
                            <option value="artist">Artist</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td
                          style={{
                            padding: "1.2rem 1.5rem",
                            display: "flex",
                            gap: "1rem",
                          }}
                        >
                          <button
                            onClick={() => {
                              setEditingUser(u);
                              setEditForm({
                                userName: u.userName,
                                email: u.email,
                              });
                            }}
                            style={{
                              color: "#a7c4bc",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "0.9rem",
                            }}
                          >
                            Edit
                          </button>
                          {u.role === "artist" &&
                            !artists.find(
                              (a) => a.user?._id === u._id || a.user === u._id,
                            ) && (
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Promote " + u.userName + " to Artist?",
                                    )
                                  ) {
                                    dispatch(
                                      promoteToArtist({ userId: u._id }),
                                    );
                                  }
                                }}
                                className="btn-peace"
                                style={{
                                  padding: "0.4rem 1rem",
                                  fontSize: "0.85rem",
                                }}
                              >
                                Create Profile
                              </button>
                            )}
                          {u.role !== "admin" && (
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              style={{
                                color: "rgba(255, 107, 107, 0.9)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "0.9rem",
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls for Artists */}
              {userPagination.pages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "1rem",
                    marginTop: "1.5rem",
                  }}
                >
                  <button
                    disabled={artistPage === 1}
                    onClick={() => setArtistPage((prev) => prev - 1)}
                    style={{
                      padding: "0.6rem 1.2rem",
                      background:
                        artistPage === 1
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(129, 140, 248, 0.1)",
                      border:
                        artistPage === 1
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "1px solid rgba(129, 140, 248, 0.3)",
                      color: artistPage === 1 ? "var(--text-muted)" : "#818cf8",
                      borderRadius: "8px",
                      cursor: artistPage === 1 ? "not-allowed" : "pointer",
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
                    }}
                  >
                    Page{" "}
                    <strong style={{ color: "#d1e8e2", margin: "0 0.4rem" }}>
                      {artistPage}
                    </strong>{" "}
                    of {userPagination.pages}
                  </span>
                  <button
                    disabled={artistPage === userPagination.pages}
                    onClick={() => setArtistPage((prev) => prev + 1)}
                    style={{
                      padding: "0.6rem 1.2rem",
                      background:
                        artistPage === userPagination.pages
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(129, 140, 248, 0.1)",
                      border:
                        artistPage === userPagination.pages
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "1px solid rgba(129, 140, 248, 0.3)",
                      color:
                        artistPage === userPagination.pages
                          ? "var(--text-muted)"
                          : "#818cf8",
                      borderRadius: "8px",
                      cursor:
                        artistPage === userPagination.pages
                          ? "not-allowed"
                          : "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Fan Users Section */}
          {userTab === "fans" && (
            <div>
              <div className="peace-card" style={{ padding: "0" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        textAlign: "left",
                        borderBottom: "1px solid rgba(179, 204, 189, 0.3)",
                        color: "#d1e8e2",
                      }}
                    >
                      <th style={{ padding: "1.5rem" }}>Username</th>
                      <th style={{ padding: "1.5rem" }}>Email</th>
                      <th style={{ padding: "1.5rem" }}>Role</th>
                      <th style={{ padding: "1.5rem" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u._id}
                        style={{
                          borderBottom: "1px solid rgba(179, 204, 189, 0.15)",
                        }}
                      >
                        <td style={{ padding: "1.2rem 1.5rem" }}>
                          {u.userName}
                        </td>
                        <td
                          style={{ padding: "1.2rem 1.5rem", color: "#ced4da" }}
                        >
                          {u.email}
                        </td>
                        <td style={{ padding: "1.2rem 1.5rem" }}>
                          <select
                            value={u.role}
                            onChange={(e) =>
                              dispatch(
                                updateRole({ id: u._id, role: e.target.value }),
                              )
                            }
                            className="form-control"
                            style={{
                              padding: "0.4rem 0.8rem",
                              width: "auto",
                              minWidth: "110px",
                              background: "rgba(179, 204, 189, 0.15)",
                              border: "1px solid rgba(179, 204, 189, 0.3)",
                              borderRadius: "8px",
                              color: "#fff",
                            }}
                          >
                            <option value="fan">Fan</option>
                            <option value="artist">Artist</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td
                          style={{
                            padding: "1.2rem 1.5rem",
                            display: "flex",
                            gap: "1rem",
                          }}
                        >
                          <button
                            onClick={() => {
                              setEditingUser(u);
                              setEditForm({
                                userName: u.userName,
                                email: u.email,
                              });
                            }}
                            style={{
                              color: "#a7c4bc",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "0.9rem",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            style={{
                              color: "rgba(255, 107, 107, 0.9)",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "0.9rem",
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls for Fans */}
              {userPagination.pages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "1rem",
                    marginTop: "1.5rem",
                  }}
                >
                  <button
                    disabled={fanPage === 1}
                    onClick={() => setFanPage((prev) => prev - 1)}
                    style={{
                      padding: "0.6rem 1.2rem",
                      background:
                        fanPage === 1
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(129, 140, 248, 0.1)",
                      border:
                        fanPage === 1
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "1px solid rgba(129, 140, 248, 0.3)",
                      color: fanPage === 1 ? "var(--text-muted)" : "#818cf8",
                      borderRadius: "8px",
                      cursor: fanPage === 1 ? "not-allowed" : "pointer",
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
                    }}
                  >
                    Page{" "}
                    <strong style={{ color: "#d1e8e2", margin: "0 0.4rem" }}>
                      {fanPage}
                    </strong>{" "}
                    of {userPagination.pages}
                  </span>
                  <button
                    disabled={fanPage === userPagination.pages}
                    onClick={() => setFanPage((prev) => prev + 1)}
                    style={{
                      padding: "0.6rem 1.2rem",
                      background:
                        fanPage === userPagination.pages
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(129, 140, 248, 0.1)",
                      border:
                        fanPage === userPagination.pages
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "1px solid rgba(129, 140, 248, 0.3)",
                      color:
                        fanPage === userPagination.pages
                          ? "var(--text-muted)"
                          : "#818cf8",
                      borderRadius: "8px",
                      cursor:
                        fanPage === userPagination.pages
                          ? "not-allowed"
                          : "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "artists" && (
        <div>
          <div className="peace-card" style={{ padding: "0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid rgba(179, 204, 189, 0.3)",
                    color: "#d1e8e2",
                  }}
                >
                  <th style={{ padding: "1.5rem" }}>Stage Name</th>
                  <th style={{ padding: "1.5rem" }}>Genre</th>
                  <th style={{ padding: "1.5rem" }}>Bio</th>
                  <th style={{ padding: "1.5rem" }}>User</th>
                  <th style={{ padding: "1.5rem" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {artists.map((a) => (
                  <tr
                    key={a._id}
                    style={{
                      borderBottom: "1px solid rgba(179, 204, 189, 0.15)",
                    }}
                  >
                    <td style={{ padding: "1.2rem 1.5rem" }}>{a.artistName}</td>
                    <td style={{ padding: "1.2rem 1.5rem", color: "#ced4da" }}>
                      {a.genre || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "1.2rem 1.5rem",
                        color: "var(--text-muted)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {a.bio ? a.bio.substring(0, 30) + "..." : "No bio"}
                    </td>
                    <td style={{ padding: "1.2rem 1.5rem" }}>
                      {a.user?.userName || "N/A"}
                    </td>
                    <td style={{ padding: "1.2rem 1.5rem" }}>
                      <button
                        onClick={() => {
                          setEditingArtist(a);
                          setEditForm({
                            artistName: a.artistName,
                            genre: a.genre,
                            bio: a.bio,
                          });
                        }}
                        style={{
                          color: "#a7c4bc",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                      >
                        Edit profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls for Artist Profiles (server-side) */}
          {artistPagination.pages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "1.5rem",
              }}
            >
              <button
                disabled={artistProfilePage === 1}
                onClick={() => setArtistProfilePage((prev) => prev - 1)}
                style={{
                  padding: "0.6rem 1.2rem",
                  background:
                    artistProfilePage === 1
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(129, 140, 248, 0.1)",
                  border:
                    artistProfilePage === 1
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid rgba(129, 140, 248, 0.3)",
                  color:
                    artistProfilePage === 1 ? "var(--text-muted)" : "#818cf8",
                  borderRadius: "8px",
                  cursor: artistProfilePage === 1 ? "not-allowed" : "pointer",
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
                }}
              >
                Page{" "}
                <strong style={{ color: "#d1e8e2", margin: "0 0.4rem" }}>
                  {artistProfilePage}
                </strong>{" "}
                of {artistPagination.pages}
              </span>
              <button
                disabled={artistProfilePage === artistPagination.pages}
                onClick={() => setArtistProfilePage((prev) => prev + 1)}
                style={{
                  padding: "0.6rem 1.2rem",
                  background:
                    artistProfilePage === artistPagination.pages
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(129, 140, 248, 0.1)",
                  border:
                    artistProfilePage === artistPagination.pages
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid rgba(129, 140, 248, 0.3)",
                  color:
                    artistProfilePage === artistPagination.pages
                      ? "var(--text-muted)"
                      : "#818cf8",
                  borderRadius: "8px",
                  cursor:
                    artistProfilePage === artistPagination.pages
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "events" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Header row with title + New Ritual button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ color: "#d1e8e2", fontWeight: 500, margin: 0 }}>
                Manage Events
              </h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  margin: "0.3rem 0 0",
                }}
              >
                {events?.length || 0} event{events?.length !== 1 ? "s" : ""}{" "}
                scheduled
              </p>
            </div>
            <button
              onClick={() => {
                dispatch(fetchAllArtists());
                setShowNewRitualModal(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.7rem 1.4rem",
                background:
                  "linear-gradient(135deg, rgba(179,204,189,0.25), rgba(107,143,123,0.3))",
                border: "1px solid rgba(179, 204, 189, 0.4)",
                borderRadius: "12px",
                color: "#d1e8e2",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backdropFilter: "blur(8px)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(179,204,189,0.4), rgba(107,143,123,0.5))";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(107,143,123,0.25)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(179,204,189,0.25), rgba(107,143,123,0.3))";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>＋</span>
              New Ritual
            </button>
          </div>

          {/* New Ritual Modal */}
          {showNewRitualModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1100,
              }}
              onClick={() => setShowNewRitualModal(false)}
            >
              <div
                className="peace-card"
                style={{
                  width: "480px",
                  background: "#1e293b",
                  border: "1px solid rgba(179, 204, 189, 0.25)",
                  position: "relative",
                  animation: "fadeInUp 0.35s ease-out",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal close button */}
                <button
                  onClick={() => setShowNewRitualModal(false)}
                  style={{
                    position: "absolute",
                    top: "1.2rem",
                    right: "1.2rem",
                    background: "rgba(255,255,255,0.08)",
                    border: "none",
                    color: "#d1e8e2",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    fontSize: "1.3rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.18)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.08)")
                  }
                >
                  ×
                </button>

                <h3
                  style={{
                    marginBottom: "1.8rem",
                    color: "#d1e8e2",
                    fontWeight: 500,
                    fontSize: "1.3rem",
                  }}
                >
                  ✦ New Ritual
                </h3>

                <form onSubmit={handleEventSubmit}>
                  <div
                    className="form-group"
                    style={{ marginBottom: "1.2rem" }}
                  >
                    <label style={{ color: "#ced4da", fontSize: "0.85rem" }}>
                      Select Artist
                    </label>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginTop: "0.4rem",
                      }}
                    >
                      <select
                        className="form-control"
                        required
                        value={eventForm.artist}
                        onChange={(e) =>
                          setEventForm({ ...eventForm, artist: e.target.value })
                        }
                        style={{
                          background: "rgba(179, 204, 189, 0.1)",
                          border: "1px solid rgba(179, 204, 189, 0.3)",
                          color: "#ffffff",
                        }}
                      >
                        <option value="" style={{ background: "#1e293b" }}>
                          Choose Artist
                        </option>
                        {artists && artists.length > 0 ? (
                          artists.map((a) => (
                            <option
                              key={a._id}
                              value={a._id}
                              style={{ background: "#1e293b" }}
                            >
                              {a.artistName}
                            </option>
                          ))
                        ) : (
                          <option disabled style={{ background: "#1e293b" }}>
                            No performers yet
                          </option>
                        )}
                      </select>
                      <button
                        type="button"
                        onClick={() => dispatch(fetchAllArtists())}
                        title="Refresh artist list"
                        style={{
                          padding: "0 0.8rem",
                          background: "rgba(179, 204, 189, 0.2)",
                          border: "1px solid rgba(179, 204, 189, 0.3)",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontSize: "1rem",
                        }}
                      >
                        🔄
                      </button>
                    </div>
                  </div>

                  <div
                    className="form-group"
                    style={{ marginBottom: "1.2rem" }}
                  >
                    <label style={{ color: "#ced4da", fontSize: "0.85rem" }}>
                      Venue Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Whispering Woods"
                      value={eventForm.venueName}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          venueName: e.target.value,
                        })
                      }
                      style={{
                        background: "rgba(179, 204, 189, 0.1)",
                        border: "1px solid rgba(179, 204, 189, 0.3)",
                        marginTop: "0.4rem",
                        color: "#ffffff",
                      }}
                    />
                  </div>

                  <div
                    className="form-group"
                    style={{ marginBottom: "1.2rem" }}
                  >
                    <label style={{ color: "#ced4da", fontSize: "0.85rem" }}>
                      Full Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="Search for location..."
                      value={eventForm.address}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, address: e.target.value })
                      }
                      style={{
                        background: "rgba(179, 204, 189, 0.1)",
                        border: "1px solid rgba(179, 204, 189, 0.3)",
                        marginTop: "0.4rem",
                        color: "#ffffff",
                      }}
                    />
                  </div>

                  <div
                    className="form-group"
                    style={{ marginBottom: "1.2rem" }}
                  >
                    <label style={{ color: "#ced4da", fontSize: "0.85rem" }}>
                      Occurrence Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={eventForm.eventDate}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          eventDate: e.target.value,
                        })
                      }
                      style={{
                        background: "rgba(179, 204, 189, 0.1)",
                        border: "1px solid rgba(179, 204, 189, 0.3)",
                        marginTop: "0.4rem",
                        color: "#ffffff",
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <label style={{ color: "#ced4da", fontSize: "0.85rem" }}>
                      Soul Capacity
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      value={eventForm.totalPerson}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          totalPerson: e.target.value,
                        })
                      }
                      style={{
                        background: "rgba(179, 204, 189, 0.1)",
                        border: "1px solid rgba(179, 204, 189, 0.3)",
                        marginTop: "0.4rem",
                        color: "#ffffff",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                      type="submit"
                      className="btn-peace"
                      style={{ flex: 1 }}
                    >
                      Seal the Event
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewRitualModal(false)}
                      style={{
                        flex: 1,
                        background: "none",
                        border: "1px solid var(--text-muted)",
                        color: "var(--text-muted)",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ── Sanctuary Map – full-width, centred ── */}
          <div
            className="peace-card"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                marginBottom: "1.5rem",
                color: "#d1e8e2",
                fontWeight: 500,
                alignSelf: "flex-start",
              }}
            >
              Sanctuary Map
            </h3>
            <div style={{ width: "100%", marginBottom: "0.5rem" }}>
              <MapComponent
                lat={selectedEvent?.latitude}
                lng={selectedEvent?.longitude}
                venueName={selectedEvent?.venueName || "Pick a destination"}
                events={events}
                onMarkerClick={(ev) => setSelectedEvent(ev)}
                isSelected={!!selectedEvent}
              />
            </div>
            {selectedEvent && (
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                  marginTop: "0.5rem",
                  textAlign: "center",
                }}
              >
                Showing:{" "}
                <strong style={{ color: "#d1e8e2" }}>
                  {selectedEvent.venueName}
                </strong>
              </p>
            )}
          </div>

          {/* ── Events list + selected event details ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: selectedEvent ? "1.2fr 1fr" : "1fr",
              gap: "2rem",
              transition: "grid-template-columns 0.4s ease",
            }}
          >
            {/* Manifested Gatherings list */}
            <div
              className="peace-card"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h3
                style={{
                  marginBottom: "1.5rem",
                  color: "#d1e8e2",
                  fontWeight: 500,
                }}
              >
                Manifested Gatherings
              </h3>
              <div
                style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem" }}
              >
                {events?.map((ev) => (
                  <div
                    key={ev._id}
                    onClick={() => setSelectedEvent(ev)}
                    style={{
                      padding: "1.2rem",
                      borderBottom: "1px solid rgba(179, 204, 189, 0.15)",
                      marginBottom: "0.8rem",
                      cursor: "pointer",
                      background:
                        selectedEvent?._id === ev._id
                          ? "rgba(179, 204, 189, 0.25)"
                          : "transparent",
                      borderRadius: "16px",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.4rem",
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "#d1e8e2" }}>
                        {ev.venueName}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#adb5bd" }}>
                        {new Date(ev.eventDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#ced4da",
                        marginBottom: "0.8rem",
                      }}
                    >
                      {ev.address}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.8rem",
                        fontSize: "0.75rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          background: ev.latitude
                            ? "rgba(179, 204, 189, 0.15)"
                            : "rgba(239, 68, 68, 0.1)",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "6px",
                          color: ev.latitude ? "#b3ccbd" : "#f87171",
                        }}
                      >
                        {ev.latitude
                          ? `${ev.latitude.toFixed(4)}° N`
                          : "Missing Lat"}
                      </div>
                      <div
                        style={{
                          background: ev.longitude
                            ? "rgba(179, 204, 189, 0.15)"
                            : "rgba(239, 68, 68, 0.1)",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "6px",
                          color: ev.longitude ? "#b3ccbd" : "#f87171",
                        }}
                      >
                        {ev.longitude
                          ? `${ev.longitude.toFixed(4)}° E`
                          : "Missing Lng"}
                      </div>
                      <div
                        style={{
                          background:
                            ev.totalPerson - ev.booked <= 10
                              ? "rgba(239, 68, 68, 0.2)"
                              : "rgba(179, 204, 189, 0.25)",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "6px",
                          color:
                            ev.totalPerson - ev.booked <= 10
                              ? "#f87171"
                              : "#d1e8e2",
                          fontWeight: 600,
                        }}
                      >
                        {ev.totalPerson - ev.booked} Souls Remaining
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected event detail panel */}
            {selectedEvent && (
              <div
                className="peace-card"
                style={{
                  background: "rgba(179, 204, 189, 0.06)",
                  border: "1px solid rgba(179, 204, 189, 0.2)",
                  animation: "fadeIn 0.4s ease-out",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        color: "#d1e8e2",
                        fontSize: "1.2rem",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {selectedEvent.venueName}
                    </h4>
                    <p
                      style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}
                    >
                      {selectedEvent.address}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        background: "rgba(179, 204, 189, 0.2)",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        color: "#b3ccbd",
                        fontWeight: 600,
                      }}
                    >
                      {selectedEvent.status}
                    </span>
                    <button
                      onClick={() => setSelectedEvent(null)}
                      title="Close"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "none",
                        color: "var(--text-muted)",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        fontSize: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1.2rem",
                    flex: 1,
                  }}
                >
                  <div>
                    <label
                      style={{
                        color: "#ced4da",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Performer
                    </label>
                    <p
                      style={{
                        color: "#d1e8e2",
                        fontWeight: 500,
                        marginTop: "0.2rem",
                      }}
                    >
                      {selectedEvent.artist?.artistName || "Unknown Artist"}
                    </p>
                  </div>
                  <div>
                    <label
                      style={{
                        color: "#ced4da",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Date
                    </label>
                    <p
                      style={{
                        color: "#d1e8e2",
                        fontWeight: 500,
                        marginTop: "0.2rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      {new Date(selectedEvent.eventDate).toLocaleDateString(
                        undefined,
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <div>
                    <label
                      style={{
                        color: "#ced4da",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Soul Inventory
                    </label>
                    <p
                      style={{
                        color:
                          selectedEvent.totalPerson - selectedEvent.booked <= 5
                            ? "#f87171"
                            : "#b3ccbd",
                        fontWeight: 600,
                        marginTop: "0.2rem",
                      }}
                    >
                      {selectedEvent.totalPerson - selectedEvent.booked} /{" "}
                      {selectedEvent.totalPerson} Available
                    </p>
                  </div>
                  <div>
                    <label
                      style={{
                        color: "#ced4da",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Created On
                    </label>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        marginTop: "0.2rem",
                        fontSize: "0.85rem",
                      }}
                    >
                      {new Date(selectedEvent.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "1.5rem",
                    display: "flex",
                    gap: "1rem",
                    borderTop: "1px solid rgba(179, 204, 189, 0.15)",
                    paddingTop: "1.2rem",
                  }}
                >
                  <button
                    onClick={() => {
                      setEditingEvent(selectedEvent);
                      setEditForm({
                        venueName: selectedEvent.venueName,
                        address: selectedEvent.address,
                        eventDate: new Date(selectedEvent.eventDate)
                          .toISOString()
                          .split("T")[0],
                        totalPerson: selectedEvent.totalPerson,
                        status: selectedEvent.status || "UPCOMING",
                      });
                    }}
                    className="btn-peace"
                    style={{ flex: 1, padding: "0.6rem" }}
                  >
                    Adjust Event
                  </button>
                  <button
                    onClick={() => handleEventDelete(selectedEvent._id)}
                    style={{
                      flex: 1,
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      color: "#f87171",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Dissolve Event
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Edit User Modal */}
      {editingUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="peace-card"
            style={{ width: "400px", background: "#1e293b" }}
          >
            <h3 style={{ marginBottom: "1.5rem", color: "#d1e8e2" }}>
              Edit User Details
            </h3>
            <form onSubmit={handleUserUpdate}>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label style={{ color: "#ced4da" }}>Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.userName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, userName: e.target.value })
                  }
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(179, 204, 189, 0.3)",
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label style={{ color: "#ced4da" }}>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(179, 204, 189, 0.3)",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" className="btn-peace" style={{ flex: 1 }}>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "1px solid var(--text-muted)",
                    color: "var(--text-muted)",
                    borderRadius: "12px",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Artist Modal */}
      {editingArtist && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="peace-card"
            style={{ width: "450px", background: "#1e293b" }}
          >
            <h3 style={{ marginBottom: "1.5rem", color: "#d1e8e2" }}>
              Edit Artist Profile
            </h3>
            <form onSubmit={handleArtistUpdate}>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label style={{ color: "#ced4da" }}>
                  Artist Name (Fixed to Username)
                </label>
                <p style={{ color: "#fff", padding: "0.5rem 0" }}>
                  {editingArtist?.artistName}
                </p>
              </div>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label style={{ color: "#ced4da" }}>Genre</label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.genre}
                  onChange={(e) =>
                    setEditForm({ ...editForm, genre: e.target.value })
                  }
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(179, 204, 189, 0.3)",
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label style={{ color: "#ced4da" }}>Short Bio</label>
                <textarea
                  className="form-control"
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(179, 204, 189, 0.3)",
                    minHeight: "100px",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" className="btn-peace" style={{ flex: 1 }}>
                  Update Highlights
                </button>
                <button
                  type="button"
                  onClick={() => setEditingArtist(null)}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "1px solid var(--text-muted)",
                    color: "var(--text-muted)",
                    borderRadius: "12px",
                  }}
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Event Modal */}
      {editingEvent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
          }}
        >
          <div
            className="peace-card"
            style={{ width: "450px", background: "#1e293b" }}
          >
            <h3 style={{ marginBottom: "1.5rem", color: "#d1e8e2" }}>
              Adjust Ritual Details
            </h3>
            <form onSubmit={handleEventUpdate}>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label style={{ color: "#ced4da" }}>Venue Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.venueName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, venueName: e.target.value })
                  }
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(179, 204, 189, 0.3)",
                    color: "#fff",
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label style={{ color: "#ced4da" }}>Full Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(179, 204, 189, 0.3)",
                    color: "#fff",
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label style={{ color: "#ced4da" }}>occurrence Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={editForm.eventDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, eventDate: e.target.value })
                  }
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(179, 204, 189, 0.3)",
                    color: "#fff",
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label style={{ color: "#ced4da" }}>Soul Capacity</label>
                <input
                  type="number"
                  className="form-control"
                  value={editForm.totalPerson}
                  onChange={(e) =>
                    setEditForm({ ...editForm, totalPerson: e.target.value })
                  }
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(179, 204, 189, 0.3)",
                    color: "#fff",
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label style={{ color: "#ced4da" }}>Status</label>
                <select
                  className="form-control"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(179, 204, 189, 0.3)",
                    color: "#fff",
                    marginTop: "0.4rem",
                    padding: "0.5rem",
                    borderRadius: "8px",
                  }}
                >
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" className="btn-peace" style={{ flex: 1 }}>
                  Confirm Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "1px solid var(--text-muted)",
                    color: "var(--text-muted)",
                    borderRadius: "12px",
                  }}
                >
                  Stay As Is
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
