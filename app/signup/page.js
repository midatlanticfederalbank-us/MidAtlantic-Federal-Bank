export default function Signup() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="real-badge">REAL ACCOUNT</span>

        <h1>Create Your Account</h1>

        <p>Set up a real account to explore the site.</p>

        <form>
          <label>
            Full Name
            <input
              type="text"
              name="name"
              placeholder="Your name"
              required
            />
          </label>

          <label>
            Email Address
            <input
              type="email"
              name="email"
              placeholder="real@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              required
            />
          </label>

          <button type="submit" className="primary-button">
            Create Real Account
          </button>
        </form>

        <p className="real-warning">
          Real only — do not enter wrong banking or financial information.
        </p>

        <p>
          Already have an account?{" "}
          <a href="/login">Sign in</a>
        </p>
      </section>
    </main>
  );
}
