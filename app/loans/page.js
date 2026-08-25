export default function LoansPage() {
  return (
    <main className="public-page">
      {/* =========================
          PAGE HERO
      ========================== */}

      <section className="page-hero">
        <div className="page-hero-content">
          <span className="hero-eyebrow">
            LENDING
          </span>

          <h1>
            Lending options for
            <span> your plans.</span>
          </h1>

          <p>
            Explore available lending information,
            financing options, and resources to help
            you understand the application process.
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
              href="/support"
            >
              Get Support
            </a>
          </div>
        </div>
      </section>

      {/* =========================
          LOAN INTRODUCTION
      ========================== */}

      <section className="public-section">
        <div className="section-introduction">
          <span className="section-label">
            LENDING SOLUTIONS
          </span>

          <h2>
            Financing options for eligible customers.
          </h2>

          <p>
            Explore lending resources and learn more
            about available financing options. Loan
            availability, terms, eligibility, rates,
            and approval requirements may vary.
          </p>
        </div>

        <div className="public-feature-grid">
          {/* Personal Loans */}

          <div className="public-feature-card">
            <div className="feature-icon">
              $
            </div>

            <h3>
              Personal Loans
            </h3>

            <p>
              Explore personal financing options for
              eligible customers and learn about the
              application process.
            </p>

            <a href="/contact">
              Learn More →
            </a>
          </div>

          {/* Home Financing */}

          <div className="public-feature-card">
            <div className="feature-icon">
              ⌂
            </div>

            <h3>
              Home Financing
            </h3>

            <p>
              Learn about available home financing
              resources and the steps involved in
              requesting information.
            </p>

            <a href="/contact">
              Explore Options →
            </a>
          </div>

          {/* Auto Financing */}

          <div className="public-feature-card">
            <div className="feature-icon">
              ▣
            </div>

            <h3>
              Auto Financing
            </h3>

            <p>
              Explore financing information for
              eligible customers interested in vehicle
              financing.
            </p>

            <a href="/contact">
              Learn More →
            </a>
          </div>

          {/* Lending Support */}

          <div className="public-feature-card">
            <div className="feature-icon">
              ?
            </div>

            <h3>
              Lending Support
            </h3>

            <p>
              Have questions about lending options?
              Contact customer support for available
              assistance.
            </p>

            <a href="/support">
              Contact Support →
            </a>
          </div>
        </div>
      </section>

      {/* =========================
          APPLICATION INFORMATION
      ========================== */}

      <section className="loan-section">
        <div className="loan-content">
          <span className="section-label">
            APPLICATION PROCESS
          </span>

          <h2>
            Understand the process before applying.
          </h2>

          <p>
            Before submitting a request, review the
            available information and make sure you
            understand the applicable requirements.
            Approval is subject to applicable
            eligibility criteria.
          </p>

          <a
            className="primary-button"
            href="/contact"
          >
            Request Information
          </a>
        </div>

        <div className="loan-options">
          <div>
            <strong>
              Step 1 — Explore
            </strong>

            <span>
              Review available lending options.
            </span>
          </div>

          <div>
            <strong>
              Step 2 — Learn
            </strong>

            <span>
              Review applicable requirements and
              available information.
            </span>
          </div>

          <div>
            <strong>
              Step 3 — Contact
            </strong>

            <span>
              Contact the bank for assistance and
              next steps.
            </span>
          </div>
        </div>
      </section>

      {/* =========================
          IMPORTANT INFORMATION
      ========================== */}

      <section className="public-section">
        <div className="section-introduction">
          <span className="section-label">
            IMPORTANT INFORMATION
          </span>

          <h2>
            Lending information
          </h2>

          <p>
            Loan products, rates, fees, terms,
            eligibility requirements, and approval
            conditions may vary. Information provided
            on this page is for general informational
            purposes and does not guarantee approval
            or a particular loan offer.
          </p>
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
            Protect your personal information.
          </h2>

          <p>
            Never send passwords, PINs, verification
            codes, or other sensitive security
            information through an unsecured message.
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
            HAVE QUESTIONS?
          </span>

          <h2>
            We're here to help.
          </h2>

          <p>
            Contact customer support if you need
            additional information about available
            lending resources.
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
          Explore your lending options.
        </h2>

        <p>
          Contact us to learn more about available
          lending resources and the next steps.
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
            href="/support"
          >
            Get Support
          </a>
        </div>
      </section>
    </main>
  );
}
