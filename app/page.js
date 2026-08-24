export default function Home() {
return (
<main>
  {/* =========================
      HERO / WELCOME SECTION
  ========================== */}

  <section className="hero">

    <span className="real-badge">
      MIDATLANTIC FEDERAL BANK
    </span>

    <h1>
      Secure Online Banking
    </h1>

    <p>
      Manage your account conveniently with access to
      your account information, transaction history,
      notifications, and customer support services.
    </p>

    <div className="hero-actions">

      <a
        className="primary-button"
        href="/login"
      >
        Sign In
      </a>

      <a
        className="secondary-button"
        href="/signup"
      >
        Open an Account
      </a>

    </div>

  </section>


  {/* =========================
      BANKING SERVICES
  ========================== */}

  <section>

    <h2>
      Banking Services
    </h2>

    <p>
      Manage your banking experience from one
      convenient place.
    </p>

    <div className="feature-grid">

      <div className="feature-card">

        <h3>
          Account Dashboard
        </h3>

        <p>
          View your account information, available
          balance, account status, and other
          important details.
        </p>

      </div>


      <div className="feature-card">

        <h3>
          Transaction History
        </h3>

        <p>
          Review your available account activity
          and recent transactions.
        </p>

      </div>


      <div className="feature-card">

        <h3>
          Notifications
        </h3>

        <p>
          Stay informed about important account
          notifications and service updates.
        </p>

      </div>


      <div className="feature-card">

        <h3>
          Customer Support
        </h3>

        <p>
          Get assistance through customer support
          resources and available service channels.
        </p>

      </div>

    </div>

  </section>


  {/* =========================
      SECURITY SECTION
  ========================== */}

  <section className="real-notice">

    <h2>
      Security & Privacy
    </h2>

    <p>
      Keep your password, PIN, and verification
      codes private. Never share sensitive account
      information with anyone.
    </p>

    <p>
      Always access your account through the official
      website and sign out when you have finished
      using your account.
    </p>

  </section>


  {/* =========================
      QUICK ACCESS
  ========================== */}

  <section>

    <h2>
      Quick Access
    </h2>

    <div className="feature-grid">

      <div className="feature-card">

        <h3>
          Sign In
        </h3>

        <p>
          Access your customer account and manage
          your account information.
        </p>

        <a href="/login">
          Sign In →
        </a>

      </div>


      <div className="feature-card">

        <h3>
          Open an Account
        </h3>

        <p>
          Begin your account registration and provide
          the required information.
        </p>

        <a href="/signup">
          Get Started →
        </a>

      </div>


      <div className="feature-card">

        <h3>
          Customer Support
        </h3>

        <p>
          Find answers and contact customer support
          for account-related questions.
        </p>

        <a href="/support">
          Visit Support →
        </a>

      </div>


      <div className="feature-card">

        <h3>
          Latest News
        </h3>

        <p>
          Stay informed about announcements and
          important service updates.
        </p>

        <a href="/news">
          View News →
        </a>

      </div>

    </div>

  </section>


  {/* =========================
      FINAL INFORMATION
  ========================== */}

  <section className="real-notice">

    <h2>
      MIDATLANTIC FEDERAL BANK
    </h2>

    <p>
      Your account security and privacy are important
      to us. If you notice unusual activity or have
      questions about your account, please contact
      customer support.
    </p>

  </section>

</main>
);
}
