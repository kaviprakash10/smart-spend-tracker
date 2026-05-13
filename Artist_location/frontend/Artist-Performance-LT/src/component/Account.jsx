import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "../slice/authSlice";
import { fetchArtistProfile, updateArtistProfile } from "../slice/artistSlice";
import { Link } from "react-router-dom";

const Account = () => {
  const dispatch = useDispatch();
  const {
    user,
    loading: authLoading,
    error,
    isLoggedIn,
  } = useSelector((state) => state.auth);
  const { profile: artistProfile, loading: artistLoading } = useSelector(
    (state) => state.artist,
  );
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [artistForm, setArtistForm] = useState({
    genre: "",
    bio: "",
    profileImage: "",
    instagram: "",
    twitter: "",
  });

  useEffect(() => {
    if (isLoggedIn && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isLoggedIn, user]);

  useEffect(() => {
    if (user?.role === "artist" && !artistProfile) {
      dispatch(fetchArtistProfile());
    }
  }, [dispatch, user, artistProfile]);

  useEffect(() => {
    if (artistProfile) {
      setArtistForm({
        genre: artistProfile.genre || "",
        bio: artistProfile.bio || "",
        profileImage: artistProfile.profileImage || "",
        instagram: artistProfile.instagram || "",
        twitter: artistProfile.twitter || "",
      });
    }
  }, [artistProfile]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setArtistForm({ ...artistForm, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateArtistProfile(artistForm));
    setIsEditing(false);
  };

  if (authLoading && !user)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(179,204,189,0.2)",
            borderTop: "3px solid #b3ccbd",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  const getAvatar = () => {
    const imgSrc = isEditing
      ? artistForm.profileImage
      : artistProfile?.profileImage || "";
    if (imgSrc) {
      return (
        <div
          onClick={() => isEditing && fileInputRef.current?.click()}
          style={{
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            background: `url(${imgSrc}) center/cover no-repeat`,
            margin: "0 auto 1.5rem",
            border: "3px solid rgba(179, 204, 189, 0.2)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
            cursor: isEditing ? "pointer" : "default",
            position: "relative",
          }}
        >
          {isEditing && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                color: "white",
              }}
            >
              Change
            </div>
          )}
        </div>
      );
    }
    return (
      <div
        onClick={() => isEditing && fileInputRef.current?.click()}
        style={{
          width: "130px",
          height: "130px",
          borderRadius: "50%",
          background:
            user?.role === "artist"
              ? "linear-gradient(135deg, #6b8f7b, #4a6b5a)"
              : "linear-gradient(135deg, var(--primary), #c084fc)",
          margin: "0 auto 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "3.5rem",
          fontWeight: 300,
          color: "white",
          boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
          cursor: isEditing ? "pointer" : "default",
          position: "relative",
        }}
      >
        {user?.userName?.charAt(0).toUpperCase() || "U"}
        {isEditing && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              color: "white",
            }}
          >
            Upload
          </div>
        )}
      </div>
    );
  };

  const labelStyle = {
    color: "#8fa8b5",
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 600,
    display: "block",
    marginBottom: "0.3rem",
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(179, 204, 189, 0.2)",
    borderRadius: "10px",
    padding: "0.6rem 1rem",
    color: "#d1e8e2",
    fontSize: "0.95rem",
    marginTop: "0.2rem",
    outline: "none",
  };

  return (
    <div className="container" style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div
        className="page-header"
        style={{ textAlign: "center", animation: "fadeInDown 0.8s ease-out" }}
      >
        <h1 style={{ color: "#d1e8e2" }}>Account Settings</h1>
        <p>Your personal information and account details</p>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.08)",
            color: "#fca5a5",
            padding: "1rem 2rem",
            borderRadius: "14px",
            marginBottom: "2rem",
            textAlign: "center",
            border: "1px solid rgba(239, 68, 68, 0.15)",
          }}
        >
          {error}
        </div>
      )}

      {user ? (
        <div style={{ animation: "fadeInUp 0.6s ease-out" }}>
          {/* Profile Hero Card */}
          <div
            style={{
              background:
                "linear-gradient(160deg, rgba(179, 204, 189, 0.1) 0%, rgba(30, 41, 59, 0.5) 100%)",
              border: "1px solid rgba(179, 204, 189, 0.15)",
              borderRadius: "28px",
              padding: "3rem",
              marginBottom: "2rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", gap: "3rem", alignItems: "center" }}>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                {getAvatar()}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  accept="image/*"
                />
                <div
                  style={{
                    display: "inline-block",
                    padding: "0.3rem 1rem",
                    borderRadius: "100px",
                    background:
                      user.role === "artist"
                        ? "rgba(107, 143, 123, 0.15)"
                        : "rgba(99, 102, 241, 0.15)",
                    color: user.role === "artist" ? "#b3ccbd" : "#818cf8",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {user.role}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    fontSize: "2rem",
                    color: "#d1e8e2",
                    fontWeight: 600,
                    marginBottom: "0.3rem",
                  }}
                >
                  {user.userName}
                </h2>
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.95rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {user.email}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                  }}
                >
                  <div>
                    <span style={labelStyle}>Member Since</span>
                    <p style={{ color: "#d1e8e2", fontSize: "0.95rem" }}>
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <span style={labelStyle}>Account Status</span>
                    <p style={{ color: "#10b981", fontSize: "0.95rem" }}>
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Artist Profile Section (if artist) */}
          {user.role === "artist" && (
            <div
              style={{
                background: "rgba(107, 143, 123, 0.06)",
                border: "1px solid rgba(107, 143, 123, 0.12)",
                borderRadius: "24px",
                padding: "2.5rem",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                }}
              >
                <h3 style={{ color: "#d1e8e2", fontWeight: 500 }}>
                  ✦ Artist Profile
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  style={{
                    padding: "0.5rem 1.5rem",
                    background: isEditing
                      ? "rgba(239, 68, 68, 0.15)"
                      : "rgba(107, 143, 123, 0.15)",
                    border:
                      "1px solid " +
                      (isEditing
                        ? "rgba(239, 68, 68, 0.2)"
                        : "rgba(107, 143, 123, 0.2)"),
                    borderRadius: "100px",
                    color: isEditing ? "#fca5a5" : "#b3ccbd",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    transition: "all 0.3s ease",
                  }}
                >
                  {isEditing
                    ? "Cancel"
                    : artistProfile
                      ? "Edit Profile"
                      : "Create Profile"}
                </button>
              </div>

              {artistProfile || isEditing ? (
                <form onSubmit={handleUpdate}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "2rem",
                    }}
                  >
                    <div>
                      <span style={labelStyle}>Artist Name</span>
                      <p
                        style={{
                          color: "#d1e8e2",
                          fontSize: "1.1rem",
                          marginTop: "0.3rem",
                        }}
                      >
                        {artistProfile?.artistName || user.userName}
                      </p>
                    </div>
                    <div>
                      <span style={labelStyle}>Genre</span>
                      {isEditing ? (
                        <input
                          style={inputStyle}
                          value={artistForm.genre}
                          onChange={(e) =>
                            setArtistForm({
                              ...artistForm,
                              genre: e.target.value,
                            })
                          }
                          placeholder="e.g. Synthwave"
                          required
                        />
                      ) : (
                        <p
                          style={{
                            color: "#d1e8e2",
                            fontSize: "1.1rem",
                            marginTop: "0.3rem",
                          }}
                        >
                          {artistProfile?.genre || "Not specified"}
                        </p>
                      )}
                    </div>
                    <div>
                      <span style={labelStyle}>Instagram</span>
                      {isEditing ? (
                        <input
                          style={inputStyle}
                          value={artistForm.instagram}
                          onChange={(e) =>
                            setArtistForm({
                              ...artistForm,
                              instagram: e.target.value,
                            })
                          }
                          placeholder="@username"
                        />
                      ) : (
                        <p
                          style={{
                            color: "#d1e8e2",
                            fontSize: "1.1rem",
                            marginTop: "0.3rem",
                          }}
                        >
                          {artistProfile?.instagram ? (
                            <a
                              href={`https://instagram.com/${artistProfile.instagram.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#818cf8",
                                textDecoration: "none",
                              }}
                            >
                              {artistProfile.instagram.startsWith("@")
                                ? artistProfile.instagram
                                : `@${artistProfile.instagram}`}
                            </a>
                          ) : (
                            "Not connected"
                          )}
                        </p>
                      )}
                    </div>
                    <div>
                      <span style={labelStyle}>Twitter / X</span>
                      {isEditing ? (
                        <input
                          style={inputStyle}
                          value={artistForm.twitter}
                          onChange={(e) =>
                            setArtistForm({
                              ...artistForm,
                              twitter: e.target.value,
                            })
                          }
                          placeholder="@username"
                        />
                      ) : (
                        <p
                          style={{
                            color: "#d1e8e2",
                            fontSize: "1.1rem",
                            marginTop: "0.3rem",
                          }}
                        >
                          {artistProfile?.twitter ? (
                            <a
                              href={`https://twitter.com/${artistProfile.twitter.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#818cf8",
                                textDecoration: "none",
                              }}
                            >
                              {artistProfile.twitter.startsWith("@")
                                ? artistProfile.twitter
                                : `@${artistProfile.twitter}`}
                            </a>
                          ) : (
                            "Not connected"
                          )}
                        </p>
                      )}
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <span style={labelStyle}>Bio</span>
                      {isEditing ? (
                        <textarea
                          style={{
                            ...inputStyle,
                            minHeight: "120px",
                            resize: "vertical",
                          }}
                          value={artistForm.bio}
                          onChange={(e) =>
                            setArtistForm({
                              ...artistForm,
                              bio: e.target.value,
                            })
                          }
                          placeholder="Tell your story..."
                          required
                        />
                      ) : (
                        <p
                          style={{
                            color: "#94a3b8",
                            marginTop: "0.3rem",
                            lineHeight: 1.8,
                          }}
                        >
                          {artistProfile?.bio || "No bio set yet."}
                        </p>
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <button
                      type="submit"
                      disabled={artistLoading}
                      style={{
                        marginTop: "2rem",
                        width: "100%",
                        padding: "0.8rem",
                        background: "linear-gradient(135deg, #6b8f7b, #4a6b5a)",
                        border: "none",
                        borderRadius: "12px",
                        color: "white",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {artistLoading
                        ? "Saving..."
                        : artistProfile
                          ? "Update Profile Details"
                          : "Create Artist Identity"}
                    </button>
                  )}
                </form>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    border: "2px dashed rgba(107, 143, 123, 0.15)",
                    borderRadius: "16px",
                  }}
                >
                  <p
                    style={{ color: "var(--text-muted)", marginBottom: "1rem" }}
                  >
                    You haven't manifested your artist identity yet.
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      padding: "0.7rem 2rem",
                      background: "linear-gradient(135deg, #6b8f7b, #4a6b5a)",
                      border: "none",
                      borderRadius: "12px",
                      color: "white",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 4px 20px rgba(107, 143, 123, 0.2)",
                    }}
                  >
                    Set Up Artist Profile
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions (Keep existing) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(179, 204, 189, 0.1)",
                borderRadius: "20px",
                padding: "2rem",
              }}
            >
              <h4 style={{ color: "#d1e8e2", marginBottom: "0.8rem" }}>
                Security
              </h4>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  marginBottom: "1.2rem",
                }}
              >
                Manage your password and security.
              </p>
              <button
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#d1e8e2",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Change Password
              </button>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(179, 204, 189, 0.1)",
                borderRadius: "20px",
                padding: "2rem",
              }}
            >
              <h4 style={{ color: "#d1e8e2", marginBottom: "0.8rem" }}>
                Preferences
              </h4>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  marginBottom: "1.2rem",
                }}
              >
                Customize your experience.
              </p>
              <button
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#d1e8e2",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Edit Preferences
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "4rem",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "24px",
            border: "1px solid rgba(179, 204, 189, 0.1)",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
            No session detected. Please log in.
          </p>
        </div>
      )}
    </div>
  );
};

export default Account;
