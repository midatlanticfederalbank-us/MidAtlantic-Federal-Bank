```jsx
export default function Home() {
  return (
    <main>
      {/* HERO */}

      <section className="hero">
        <div>
          <span className="real-badge">
            MIDATLANTIC FEDERAL BANK
          </span>

          <h1>Secure Online Banking</h1>

          <p>
            A convenient online banking experience for managing your
            account information, reviewing account activity, receiving
            notifications, and accessing customer support.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="/login">
              Sign In
            </a>

            <a className="secondary-button" href="/signup">
              Open an Account
            </a>
          </div>
        </div>
      </section>

      {/* BANKING FEATURES */}

      <section>
        <h2>Banking Services</h2>

        <p>
          Manage your banking experience from one convenient place.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Account Dashboard</h3>
            <p>
              View your account information, available balance, account
              status, and other account details.
            </p>
          </div>

          <div className="feature-card">
            <h3>Transaction History</h3>
            <p>
              Review available account activity and transaction history
              from your customer dashboard.
            </p>
          </div>

          <div className="feature-card">
            <h3>Notifications</h3>
            <p>
              Stay informed about important account activity and
              service notifications.
            </p>
          </div>

          <div className="feature-card">
            <h3>Customer Support</h3>
            <p>
              Access customer support resources and submit questions or
              service requests.
            </p>
          </div>
        </div>
      </section>

      {/* SECURITY */}

      <section className="real-notice">
        <h2>Security & Privacy</h2>

        <p>
          Protect your account by keeping your password, PIN, and
          verification codes private. Never share sensitive login
          information with anyone.
        </p>

        <p>
          For your security, only enter account credentials on the
          official website and always sign out when you are finished.
        </p>
      </section>

      {/* QUICK ACCESS */}

      <section>
        <h2>Quick Access</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Sign In</h3>
            <p>
              Access your customer account and view available account
              information.
            </p>

            <a href="/login">
              Sign In →
            </a>
          </div>

          <div className="feature-card">
            <h3>Open an Account</h3>
            <p>
              Begin the account registration process.
            </p>

            <a href="/signup">
              Get Started →
            </a>
          </div>

          <div className="feature-card">
            <h3>Customer Support</h3>
            <p>
              Find help and information about available support
              services.
            </p>

            <a href="/support">
              Visit Support →
            </a>
          </div>

          <div className="feature-card">
            <h3>Latest News</h3>
            <p>
              View announcements and important service information.
            </p>

            <a href="/news">
              View News →
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER NOTICE */}

      <section className="real-notice">
        <p>
          MIDATLANTIC FEDERAL BANK
        </p>

        <p>
          Please review all account information carefully and contact
          customer support if you notice anything unusual.
        </p>
      </section>
    </main>
  );
}
```

