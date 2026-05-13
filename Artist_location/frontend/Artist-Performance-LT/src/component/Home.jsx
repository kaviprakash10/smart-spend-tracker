import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container" style={{ padding: "4rem 1rem" }}>
      <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
        <span
          style={{
            background: "rgba(99, 102, 241, 0.1)",
            color: "var(--primary)",
            padding: "0.5rem 1rem",
            borderRadius: "100px",
            fontSize: "0.9rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
            display: "inline-block",
          }}
        >
          The Ultimate Performance Tracker
        </span>

        <h1
          style={{
            fontSize: "4.5rem",
            lineHeight: "1",
            marginBottom: "2rem",
            letterSpacing: "-0.04em",
          }}
        >
          Track Your Performances <br />
          <span
            style={{
              background: "linear-gradient(to right, #818cf8, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Like a Rockstar.
          </span>
        </h1>

        <p
          style={{
            fontSize: "1.25rem",
            color: "var(--text-muted)",
            marginBottom: "3rem",
            lineHeight: "1.6",
          }}
        >
          Empowering artists to manage their schedule, track ticket sales, and
          connect with venues all in one elegant dashboard. Simple for you,
          powerful for your career.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link
            to="/explore"
            className="btn-primary"
            style={{
              display: "inline-block",
              width: "auto",
              padding: "1rem 2.5rem",
              fontSize: "1.1rem",
              background: "var(--primary)",
              color: "white",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            Explore Performances
          </Link>
          <Link
            to="/about"
            style={{
              display: "inline-block",
              padding: "1rem 2.5rem",
              border: "1px solid var(--glass-border)",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            Learn More
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2rem",
          marginTop: "6rem",
        }}
      >
        {[
          {
            title: "Artist Oriented",
            desc: "Custom profiles designed to showcase your unique style and genre.",
            icon: "🎸",
          },
          {
            title: "Performance Stats",
            desc: "Real-time tracking of booked seats and venue capacity.",
            icon: "📊",
          },
          {
            title: "Smart Scheduling",
            desc: "Unique indexing prevents double bookings and venue conflicts.",
            icon: "📅",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="glass-card"
            style={{ padding: "2rem", textAlign: "center" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
              {feature.icon}
            </div>
            <h3 style={{ marginBottom: "1rem" }}>{feature.title}</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.5" }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
