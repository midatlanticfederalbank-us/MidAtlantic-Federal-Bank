export default function Login() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="real-badge">REAL ACCOUNT</span>

        <h1>Welcome Back</h1>

        <p>Sign in to your real account.</p>

        <form>
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
              placeholder="Enter your password"
              required
            />
          </label>

          <button type="submit" className="primary-button">
            Sign In
          </button>
        </form>

        <p className="real-warning">
          Real only — do not enter wrong banking credentials.
        </p>

        <p>
          Don't have a real account?{" "}
          <a href="/signup">Create one</a>
        </p>
      </section>
    </main>
  );
}
