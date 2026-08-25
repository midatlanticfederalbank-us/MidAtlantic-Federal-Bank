export default function ContactPage() {
  return (
    <main className="public-page">
      {/* =========================
          PAGE HERO
      ========================== */}

      <section className="page-hero">
        <div className="page-hero-content">
          <span className="hero-eyebrow">
            CONTACT MIDATLANTIC FEDERAL BANK
          </span>

          <h1>
            We're here to
            <span> help.</span>
          </h1>

          <p>
            Have a question about banking services,
            account access, or customer support?
            Contact us using the information below.
          </p>
        </div>
      </section>

      {/* =========================
          CONTACT INFORMATION
      ========================== */}

      <section className="public-section">
        <div className="section-introduction">
          <span className="section-label">
            CONTACT INFORMATION
          </span>

          <h2>
            Get in touch with us.
          </h2>

          <p>
            Use the contact information below for
            general questions and customer support
            inquiries.
          </p>
        </div>

        <div className="public-feature-grid">
          {/* Email */}

          <div className="public-feature-card">
            <div className="feature-icon">
              @
            </div>

            <h3>
              Email
            </h3>

            <p>
              Send us an email with your question or
              inquiry.
            </p>

            <a href="mailto:midfb@outlook.com">
              midfb@outlook.com
            </a>
          </div>

          {/* Phone */}

          <div className="public-feature-card">
            <div className="feature-icon">
              ☎
            </div>

            <h3>
              Phone
            </h3>

            <p>
              Contact us by phone for general
              assistance.
            </p>

            <a href="tel:+16266063125">
              +1 (626) 606-3125
            </a>
          </div>

          {/* Address */}

          <div className="public-feature-card">
            <div className="feature-icon">
              ⌂
            </div>

            <h3>
              Address
            </h3>

            <p>
              Our listed mailing address is:
            </p>

            <address>
              12822 Wisteria Dr
              <br />
              Germantown, MD 20874
              <br />
              United States
            </address>
          </div>

          {/* Support */}

          <div className="public-feature-card">
            <div className="feature-icon">
              ?
            </div>

            <h3>
              Customer Support
            </h3>

            <p>
              Existing customers can sign in to
              access available support resources.
            </p>

            <a href="/support">
              Visit Support →
            </a>
          </div>
        </div>
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
            Need help with your account?
          </h2>

          <p>
            Existing customers can sign in and
            submit a support message through the
            customer support area.
          </p>
        </div>

        <div className="support-banner-actions">
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
            Customer Support
          </a>
        </div>
      </section>

      {/* =========================
          GENERAL INQUIRIES
      ========================== */}

      <section className="public-section">
        <div className="section-introduction">
          <span className="section-label">
            GENERAL INQUIRIES
          </span>

          <h2>
            How can we assist you?
          </h2>

          <p>
            For questions about banking services,
            online account access, lending information,
            or other general matters, please use the
            appropriate contact channel.
          </p>
        </div>

        <div className="about-value-grid">
          <div className="about-value-card">
            <div className="feature-icon">
              $
            </div>

            <h3>
              Banking Services
            </h3>

            <p>
              Learn about available banking services
              and online account resources.
            </p>

            <a href="/services">
              View Banking Services →
            </a>
          </div>

          <div className="about-value-card">
            <div className="feature-icon">
              %
            </div>

            <h3>
              Lending
            </h3>

            <p>
              Explore available lending information
              and financing resources.
            </p>

            <a href="/loans">
              Explore Lending →
            </a>
          </div>

          <div className="about-value-card">
            <div className="feature-icon">
              !
            </div>

            <h3>
              Online Banking
            </h3>

            <p>
              Access your customer account and
              available online banking services.
            </p>

            <a href="/login">
              Sign In →
            </a>
          </div>
        </div>
      </section>

      {/* =========================
          SECURITY NOTICE
      ========================== */}

      <section className="security-public">
        <div className="security-icon">
          ✓
        </div>

        <div>
          <span className="section-label">
            SECURITY
          </span>

          <h2>
            Keep your information private.
          </h2>

          <p>
            Never send your password, PIN,
            verification codes, or other sensitive
            security information by email or through
            an unsecured message.
          </p>
        </div>

        <a href="/security">
          Security Center →
        </a>
      </section>

      {/* =========================
          FINAL CTA
      ========================== */}

      <section className="final-cta">
        <span className="section-label">
          MIDATLANTIC FEDERAL BANK
        </span>

        <h2>
          We're ready to assist.
        </h2>

        <p>
          Contact us or access customer support for
          assistance with available banking services.
        </p>

        <div className="hero-actions">
          <a
            className="primary-button"
            href="mailto:midfb@outlook.com"
          >
            Email Us
          </a>

          <a
            className="secondary-button"
            href="tel:+16266063125"
          >
            Call Us
          </a>
        </div>
      </section>
    </main>
  );
}
