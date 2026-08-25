export default function SecurityPage() {
  return (
    <main className="public-page">
      {/* =========================
          PAGE HERO
      ========================== */}

      <section className="page-hero">
        <div className="page-hero-content">
          <span className="hero-eyebrow">
            SECURITY CENTER
          </span>

          <h1>
            Protect your
            <span> account information.</span>
          </h1>

          <p>
            Learn important security practices that
            can help protect your online banking
            information and personal details.
          </p>
        </div>
      </section>

      {/* =========================
          SECURITY INTRODUCTION
      ========================== */}

      <section className="public-section">
        <div className="section-introduction">
          <span className="section-label">
            ONLINE SECURITY
          </span>

          <h2>
            Your security matters.
          </h2>

          <p>
            Keeping your account information private
            is an important part of safe online
            banking. Follow these security practices
            whenever you access your account online.
          </p>
        </div>

        <div className="public-feature-grid">
          {/* Passwords */}

          <div className="public-feature-card">
            <div className="feature-icon">
              🔒
            </div>

            <h3>
              Protect Your Password
            </h3>

            <p>
              Use a strong, unique password for your
              account and never share it with another
              person.
            </p>
          </div>

          {/* Verification Codes */}

          <div className="public-feature-card">
            <div className="feature-icon">
              ✓
            </div>

            <h3>
              Protect Verification Codes
            </h3>

            <p>
              Never give verification codes or
              security codes to someone who contacts
              you unexpectedly.
            </p>
          </div>

          {/* Public Devices */}

          <div className="public-feature-card">
            <div className="feature-icon">
              ▣
            </div>

            <h3>
              Use Trusted Devices
            </h3>

            <p>
              Avoid accessing your account from
              unknown or unsecured devices whenever
              possible.
            </p>
          </div>

          {/* Suspicious Activity */}

          <div className="public-feature-card">
            <div className="feature-icon">
              !
            </div>

            <h3>
              Watch for Suspicious Activity
            </h3>

            <p>
              Review your account activity and contact
              support if you notice something you do
              not recognize.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          PHISHING WARNING
      ========================== */}

      <section className="loan-section">
        <div className="loan-content">
          <span className="section-label">
            PHISHING AWARENESS
          </span>

          <h2>
            Be careful with unexpected messages.
          </h2>

          <p>
            Criminals may attempt to impersonate
            banks or customer support representatives
            through email, text messages, phone calls,
            or websites.
          </p>

          <p>
            Do not click suspicious links or provide
            passwords, PINs, verification codes, or
            other sensitive information in response
            to unexpected requests.
          </p>
        </div>

        <div className="loan-options">
          <div>
            <strong>
              Check the Website
            </strong>

            <span>
              Make sure you are using the correct
              website address.
            </span>
          </div>

          <div>
            <strong>
              Do Not Share Codes
            </strong>

            <span>
              Keep verification and security codes
              private.
            </span>
          </div>

          <div>
            <strong>
              Contact Support
            </strong>

            <span>
              Use an official contact method if you
              are unsure about a request.
            </span>
          </div>
        </div>
      </section>

      {/* =========================
          ACCOUNT SAFETY
      ========================== */}

      <section className="public-section">
        <div className="section-heading">
          <div>
            <span className="section-label">
              ACCOUNT SAFETY
            </span>

            <h2>
              Good security habits.
            </h2>
          </div>
        </div>

        <div className="about-value-grid">
          <div className="about-value-card">
            <div className="feature-icon">
              01
            </div>

            <h3>
              Sign Out
            </h3>

            <p>
              Always sign out of your online banking
              session when you are finished, especially
              on shared devices.
            </p>
          </div>

          <div className="about-value-card">
            <div className="feature-icon">
              02
            </div>

            <h3>
              Keep Software Updated
            </h3>

            <p>
              Keep your phone, computer, browser, and
              security software updated.
            </p>
          </div>

          <div className="about-value-card">
            <div className="feature-icon">
              03
            </div>

            <h3>
              Review Account Activity
            </h3>

            <p>
              Regularly review available account
              activity and report unfamiliar activity
              through an appropriate support channel.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          IMPORTANT WARNING
      ========================== */}

      <section className="security-public">
        <div className="security-icon">
          !
        </div>

        <div>
          <span className="section-label">
            IMPORTANT SECURITY NOTICE
          </span>

          <h2>
            Never share sensitive credentials.
          </h2>

          <p>
            Never share your password, PIN,
            verification codes, security questions,
            or other authentication information with
            anyone who asks for them unexpectedly.
          </p>
        </div>
      </section>

      {/* =========================
          CUSTOMER SUPPORT
      ========================== */}

      <section className="support-banner">
        <div>
          <span className="section-label">
            NEED ASSISTANCE?
          </span>

          <h2>
            Contact customer support.
          </h2>

          <p>
            If you believe your account information
            may have been compromised, use an official
            support channel to request assistance.
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
          ONLINE BANKING
        </span>

        <h2>
          Access your account securely.
        </h2>

        <p>
          Use the official website to access your
          online banking account.
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
