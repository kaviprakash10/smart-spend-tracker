const Contact = () => {
  return (
    <div className="container" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="page-header">
        <h1>Get In Touch</h1>
        <p>Our team is here to support your creative journey 24/7.</p>
      </div>

      <div className="glass-card">
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-control" placeholder="Your Name" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="email@example.com"
          />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea
            className="form-control"
            rows="4"
            placeholder="How can we help?"
          ></textarea>
        </div>
        <button className="btn-primary">Send Message</button>

        <div
          style={{
            marginTop: "2.5rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--glass-border)",
            textAlign: "center",
          }}
        >
          <p style={{ color: "var(--text-muted)" }}>Or email us directly at:</p>
          <a
            href="mailto:support@artisttracker.com"
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              color: "var(--primary)",
            }}
          >
            support@artisttracker.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
