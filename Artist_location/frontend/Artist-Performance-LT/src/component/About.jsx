const About = () => {
  return (
    <div className="container" style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div className="page-header">
        <h1>Our Mission</h1>
        <p>Bridging the gap between creative talent and world-class stages.</p>
      </div>

      <div className="glass-card">
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary)" }}>
          Who We Are
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: "1.8",
            marginBottom: "2rem",
          }}
        >
          Artist Performance Tracker was born out of a simple need: artists
          should spend more time creating and less time managing spreadsheets.
          We provide a comprehensive platform where performers and venues can
          coordinate seamlessly.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
          }}
        >
          <div
            style={{
              padding: "1.5rem",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
            }}
          >
            <h4 style={{ marginBottom: "0.5rem" }}>For Artists</h4>
            <p style={{ color: "var(--text-muted)" }}>
              Showcase your talent, manage your tour dates, and track your
              growth through data-driven insights.
            </p>
          </div>
          <div
            style={{
              padding: "1.5rem",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
            }}
          >
            <h4 style={{ marginBottom: "0.5rem" }}>For Fans</h4>
            <p style={{ color: "var(--text-muted)" }}>
              Never miss a show by your favorite performers and book tickets
              effortlessly through our platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
