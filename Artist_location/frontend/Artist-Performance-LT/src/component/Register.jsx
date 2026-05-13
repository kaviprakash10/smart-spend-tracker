import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Joi from "joi";
import { registerUser } from "../slice/authSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "fan",
  });
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error: serverError, loading } = useSelector((state) => state.auth);

  const schema = Joi.object({
    userName: Joi.string().trim().min(3).max(30).required().label("Username"),
    email: Joi.string()
      .trim()
      .lowercase()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    password: Joi.string()
      .trim()
      .min(8)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$"))
      .required()
      .label("Password")
      .messages({
        "string.pattern.base":
          "Password must contain uppercase, lowercase, number and special character",
      }),
    role: Joi.string().valid("artist", "fan").required().label("Role"),
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
        registerUser({
          formData,
          redirect: () => navigate("/login"),
        }),
      );
    }
  };

  return (
    <div className="auth-split-container">
      <div className="auth-visual">
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: 800,
              marginBottom: "1rem",
            }}
          >
            Elevate Your Art.
          </h1>
          <p style={{ fontSize: "1.25rem", opacity: 0.9, maxWidth: "400px" }}>
            Join thousands of artists managing their performance careers with
            precision and style.
          </p>
        </div>
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            top: "-50px",
            left: "-50px",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            bottom: "10%",
            right: "10%",
          }}
        ></div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-card">
          <h2>Join the Stage</h2>
          <p className="subtitle">Create your account to get started.</p>

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
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#475569",
                  marginBottom: "0.5rem",
                }}
              >
                Username
              </label>
              <input
                type="text"
                name="userName"
                className="modern-input"
                placeholder="e.g. musicmaster"
                value={formData.userName}
                onChange={handleChange}
              />
              {formErrors.userName && (
                <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>
                  {formErrors.userName}
                </span>
              )}
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
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

            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#475569",
                  marginBottom: "0.5rem",
                }}
              >
                Password
              </label>
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
                I am a...
              </label>
              <select
                name="role"
                className="modern-input"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="fan">Fan / Attendee</option>
                <option value="artist">Performing Artist</option>
              </select>
            </div>

            <button type="submit" className="btn-modern" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p
            style={{
              marginTop: "2rem",
              textAlign: "center",
              color: "#64748b",
              fontSize: "0.875rem",
            }}
          >
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#4f46e5", fontWeight: 600 }}>
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
