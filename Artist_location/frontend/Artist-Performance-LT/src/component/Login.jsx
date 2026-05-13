import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Joi from "joi";
import { loginUser } from "../slice/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error: serverError, loading } = useSelector((state) => state.auth);

  const schema = Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    password: Joi.string().trim().min(8).required().label("Password"),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const result = schema.validate(formData, { abortEarly: false });
    if (!result.error) return null;

    const errors = {};
    for (let item of result.error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors || {});

    if (!errors) {
      dispatch(
        loginUser({
          formData,
          redirect: () => navigate("/account"),
        }),
      );
    }
  };

  return (
    <div className="auth-split-container">
      <div
        className="auth-visual"
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
        }}
      >
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: 800,
              marginBottom: "1rem",
            }}
          >
            Welcome Back.
          </h1>
          <p style={{ fontSize: "1.25rem", opacity: 0.9, maxWidth: "400px" }}>
            Log in to manage your performances, track your reach, and stay
            connected with your venues.
          </p>
        </div>
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            width: "250px",
            height: "250px",
            background: "rgba(255,255,255,0.08)",
            top: "20%",
            left: "10%",
            transform: "rotate(45deg)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            bottom: "5%",
            right: "15%",
          }}
        ></div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-card">
          <h2>Sign In</h2>
          <p className="subtitle">Welcome back! Please enter your details.</p>

          {serverError && (
            <div
              style={{
                background: "#fef2f2",
                color: "#dc2626",
                padding: "0.75rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                fontSize: "0.875rem",
              }}
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#475569",
                  marginBottom: "0.5rem",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="modern-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>
                  {formErrors.email}
                </span>
              )}
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#475569",
                  }}
                >
                  Password
                </label>
                <a
                  href="#"
                  style={{
                    fontSize: "0.813rem",
                    color: "#4f46e5",
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                className="modern-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && (
                <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>
                  {formErrors.password}
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <input
                type="checkbox"
                id="remember"
                style={{ marginRight: "0.5rem", cursor: "pointer" }}
              />
              <label
                htmlFor="remember"
                style={{
                  fontSize: "0.875rem",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                Remember for 30 days
              </label>
            </div>

            <button type="submit" className="btn-modern" disabled={loading}>
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>

          <p
            style={{
              marginTop: "2.5rem",
              textAlign: "center",
              color: "#64748b",
              fontSize: "0.875rem",
            }}
          >
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#4f46e5", fontWeight: 600 }}>
              Sign Up Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
