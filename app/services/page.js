export default function ServicesPage() {
  return (
    <main className="public-page">
      {/* =========================
          PAGE HERO
      ========================== */}

      <section className="page-hero">
        <div className="page-hero-content">
          <span className="hero-eyebrow">
            BANKING SERVICES
          </span>

          <h1>
            Banking services for
            <span> everyday needs.</span>
          </h1>

          <p>
            Explore available banking services and
            convenient online account resources.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="/login">
              Sign In
            </a>

            <a className="secondary-button" href="/contact">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* =========================
          SERVICES INTRODUCTION
      ========================== */}

      <section className="public-section">
        <div className="section-introduction">
          <span className="section-label">
            OUR BANKING SERVICES
          </span>

          <h2>
            Convenient access to your banking needs.
          </h2>

          <p>
            Explore the banking resources available
            through MidAtlantic Federal Bank. Online
            banking customers can access their account
            information, review activity, and use
            available account services.
          </p>
        </div>

        <div className="public-feature-grid">
          {/* Account Services */}

          <div className="public-feature-card">
            <div className="feature-icon">
              $
            </div>

            <h3>
              Account Services
            </h3>

            <p>
              Review available account information,
              account status, balances, and other
              account details.
            </p>

            <a href="/login">
              Access Your Account →
            </a>
          </div>

          {/* Transaction History */}

          <div className="public-feature-card">
            <div className="feature-icon">
              ↗
            </div>

            <h3>
              Transaction History
            </h3>

            <p>
              Review available account activity and
              transaction information through online
              banking.
            </p>

            <a href="/login">
              View Transactions →
            </a>
          </div>

          {/* Transfers */}

          <div className="public-feature-card">
            <div className="feature-icon">
              ⇄
            </div>

            <h3>
              Transfers
            </h3>

            <p>
              Manage available transfer services and
              review transfer activity through your
              online account.
            </p>

            <a href="/login">
              Manage Transfers →
            </a>
          </div>

          {/* Notifications */}

          <div className="public-feature-card">
            <div className="feature-icon">
              !
            </div>

            <h3>
              Account Notifications
            </h3>

            <p>
              Stay informed about important account
              notifications and available service
              updates.
            </p>

            <a href="/login">
              View Notifications →
            </a>
          </div>
        </div>
      </section>

      {/* =========================
          ONLINE BANKING
      ========================== */}

      <section className="loan-section">
        <div className="loan-content">
          <span className="section-label">
            ONLINE BANKING
          </span>

          <h2>
            Manage your account online.
          </h2>

          <p>
            Sign in to access your available account
            information, transaction history,
            notifications, and customer support
            services.
          </p>

          <a
            className="primary-button"
            href="/login"
          >
            Sign In to Online Banking
          </a>
        </div>

        <div className="loan-options">
          <div>
            <strong>
              Account Dashboard
            </strong>

            <span>
              View available account information
            </span>
          </div>

          <div>
            <strong>
              Transaction History
            </strong>

            <span>
              Review available account activity
            </span>
          </div>

          <div>
            <strong>
              Customer Support
            </strong>

            <span>
              Send a message to support
            </span>
          </div>
        </div>
      </section>

      {/* =========================
          SECURITY
      ========================== */}

      <section className="security-public">
        <div className="security-icon">
          ✓
        </div>

        <div>
          <span className="section-label">
            ONLINE SECURITY
          </span>

          <h2>
            Keep your account information secure.
          </h2>

          <p>
            Never share your password, PIN,
            verification codes, or other sensitive
            account information. Always use the
            official website when accessing your
            online banking account.
          </p>
        </div>

        <a href="/security">
          Security Center →
        </a>
      </section>

      {/* =========================
          CUSTOMER SUPPORT
      ========================== */}

      <section className="support-banner">
        <div>
          <span className="section-label">
            CUSTOMER SUPPORT
          </span>

          <h2>
            Need help with your banking?
          </h2>

          <p>
            Contact customer support if you have
            questions about your account or available
            banking services.
          </p>
        </div>

        <div className="support-banner-actions">
          <a
            className="primary-button"
            href="/support"
          >
            Customer Support
          </a>

          <a
            className="secondary-button"
            href="/contact"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* =========================
          FINAL CTA
      ========================== */}

      <section className="final-cta">
        <span className="section-label">
          GET STARTED
        </span>

        <h2>
          Ready to access your banking?
        </h2>

        <p>
          Sign in to your account or contact our
          support team for assistance.
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
            href="/support"
          >
            Get Support
          </a>
        </div>
      </section>
    </main>
  );
}
