export default function Support() {
  return (
    <main>
      <section className="auth-card">
        <span className="real-badge">REAL SUPPORT</span>

        <h1>Customer Support</h1>

        <p>
          Send a message to our real time support team.
        </p>

        <form>
          <label>
            Name
            <input type="text" name="name" placeholder="Your name" required />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="real@example.com"
              required
            />
          </label>

          <label>
            Message
            <textarea
              name="message"
              placeholder="How can we help?"
              rows="6"
              required
            />
          </label>

          <button type="submit" className="primary-button">
            Send Real Message
          </button>
        </form>

        <p className="real-warning">
          Real only. Messages are connected to your bank or financial
          institution.
        </p>
      </section>
    </main>
  );
}
