export default function PrivacyPage() {
  return (
    <main className="public-page">
      {/* =========================
          PAGE HERO
      ========================== */}

      <section className="page-hero">
        <div className="page-hero-content">
          <span className="hero-eyebrow">
            PRIVACY POLICY
          </span>

          <h1>
            Your privacy
            <span> matters.</span>
          </h1>

          <p>
            This page explains general information about
            privacy and the handling of information when
            using this website.
          </p>
        </div>
      </section>

      {/* =========================
          PRIVACY INTRODUCTION
      ========================== */}

      <section className="public-section">
        <div className="section-introduction">
          <span className="section-label">
            PRIVACY
          </span>

          <h2>
            Protecting your information.
          </h2>

          <p>
            We recognize the importance of protecting
            personal and account information. Users should
            take reasonable precautions when accessing
            online services and communicating sensitive
            information.
          </p>
        </div>
      </section>

      {/* =========================
          INFORMATION
      ========================== */}

      <section className="public-section">
        <div className="section-heading">
          <div>
            <span className="section-label">
              INFORMATION
            </span>

            <h2>
              Information provided through the website.
            </h2>
          </div>
        </div>

        <div className="about-value-grid">
          <div className="about-value-card">
            <div className="feature-icon">
              01
            </div>

            <h3>
              Account Information
            </h3>

            <p>
              Information submitted during account
              registration or through available account
              services may be used to provide the
              requested service.
            </p>
          </div>

          <div className="about-value-card">
            <div className="feature-icon">
              02
            </div>

            <h3>
              Support Messages
            </h3>

            <p>
              Information included in customer support
              messages may be used to respond to the
              user's request.
            </p>
          </div>

          <div className="about-value-card">
            <div className="feature-icon">
              03
            </div>

            <h3>
              Website Information
            </h3>

            <p>
              Basic technical information may be
              processed to maintain website functionality,
              security, and performance.
            </p>
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
            SECURITY
          </span>

          <h2>
            Keep your information secure.
          </h2>

          <p>
            Never share passwords, PINs, verification
            codes, or other authentication information
            with anyone. Use appropriate security
            precautions whenever accessing online
            services.
          </p>
        </div>

        <a href="/security">
          Security Center →
        </a>
      </section>

      {/* =========================
          THIRD-PARTY SERVICES
      ========================== */}

      <section className="public-section">
        <div className="section-introduction">
          <span className="section-label">
            THIRD-PARTY SERVICES
          </span>

          <h2>
            External services and links.
          </h2>

          <p>
            This website may contain links or integrations
            to services operated by third parties. Those
            services may have their own privacy policies
            and terms governing the information they
            collect or process.
          </p>

          <p>
            Users should review the applicable privacy
            information of an external service before
            providing personal or sensitive information.
          </p>
        </div>
      </section>

      {/* =========================
          CONTACT
      ========================== */}

      <section className="bank-information">
        <div className="bank-information-content">
          <span className="section-label">
            PRIVACY QUESTIONS
          </span>

          <h2>
            Questions about privacy?
          </h2>

          <p>
            If you have questions about privacy or the
            information presented on this page, contact
            us using the available contact information.
          </p>
        </div>

        <div className="bank-information-card">
          <div className="bank-info-row">
            <span>
              Email
            </span>

            <a href="mailto:midfb@outlook.com">
              midfb@outlook.com
            </a>
          </div>

          <div className="bank-info-row">
            <span>
              Phone
            </span>

            <a href="tel:+16266063125">
              +1 (626) 606-3125
            </a>
          </div>

          <div className="bank-info-row">
            <span>
              Address
            </span>

            <strong>
              12822 Wisteria Dr
              <br />
              Germantown, MD 20874
              <br />
              United States
            </strong>
          </div>
        </div>
      </section>

      {/* =========================
          FINAL CTA
      ========================== */}

      <section className="final-cta">
        <span className="section-label">
          MIDATLANTIC FEDERAL BANK
        </span>

        <h2>
          Have a question?
        </h2>

        <p>
          Contact us or visit the Security Center for
          additional information.
        </p>

        <div className="hero-actions">
          <a
            className="primary-button"
            href="/contact"
          >
            Contact Us
          </a>

          <a
            className="secondary-button"
            href="/security"
          >
            Security Center
          </a>
        </div>
      </section>
    </main>
  );
}
