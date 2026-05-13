import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slice/authSlice";
import { resetArtist } from "../slice/artistSlice";
import { resetAdmin } from "../slice/adminSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetArtist());
    dispatch(resetAdmin());
    navigate("/login");
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: "1.5rem",
          fontWeight: 800,
          background: "linear-gradient(to right, #818cf8, #c084fc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        ARTIST TRACKER
      </Link>

      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/explore" className="nav-link">
          Explore
        </Link>
        <Link to="/about" className="nav-link">
          About
        </Link>
        <Link to="/contact" className="nav-link">
          Contact
        </Link>

        {isLoggedIn ? (
          <>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="nav-link"
                style={{ color: "#fbbf24" }}
              >
                Admin Panel
              </Link>
            )}

            {user?.role === "fan" && (
              <Link to="/fan" className="nav-link" style={{ color: "#10b981" }}>
                Artist Discovery
              </Link>
            )}
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/account" className="nav-link">
              Account
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "8px",
                padding: "0.4rem 1rem",
                fontWeight: 500,
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link to="/login" style={{ padding: "0.5rem 1rem" }}>
              Login
            </Link>
            <Link
              to="/register"
              style={{
                background: "#6366f1",
                padding: "0.5rem 1.2rem",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

      <style>{`
                .nav-link {
                    font-weight: 500;
                    color: #94a3b8;
                }
                .nav-link:hover {
                    color: #fff;
                }
            `}</style>
    </nav>
  );
};

export default NavBar;
