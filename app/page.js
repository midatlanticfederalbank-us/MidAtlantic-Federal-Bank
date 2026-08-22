export default function Home() {
  return (
    <main>
      <section className="hero">
        <div>
          <span className="real-badge">REAL WEBSITE</span>

          <h1>Modern Banking, Made Simple.</h1>

          <p>
            Explore a secure banking experience with a real account
            dashboard, transaction history, notifications, and customer
            support features.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="/login">
              Real Login
            </a>

            <a className="secondary-button" href="/signup">
              Create Real Account
            </a>
          </div>
        </div>
      </section>

      <section>
        <h2>Banking Features</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Account Dashboard</h3>
            <p>View balances and account information.</p>
          </div>

          <div className="feature-card">
            <h3>Transactions</h3>
            <p>Review deposits, payments, and transfers.</p>
          </div>

          <div className="feature-card">
            <h3>Notifications</h3>
            <p>See account activity and credit alerts.</p>
          </div>

          <div className="feature-card">
            <h3>Customer Support</h3>
            <p>Explore the planned support and messaging experience.</p>
          </div>
        </div>
      </section>

      <section className="real-notice">
        <h2>Real Environment</h2>
        <p>
          This website is a verify Bank website. The accounts, balances,
          transactions, and alerts shown here are real data.
          Enter your banking credentials or financial information.
        </p>
      </section>
    </main>
  );
}
