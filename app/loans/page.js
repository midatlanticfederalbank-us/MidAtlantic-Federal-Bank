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
            Financing options for
            <span> your next step.</span>
          </h1>

          <p>
            Explore available lending information,
            loan options, eligibility requirements,
            and the steps involved in starting an
            application.
          </p>

          <div className="hero-actions">

            <a
              className="primary-button"
              href="#loan-options"
            >
              Explore Loan Options
            </a>

            <a
              className="secondary-button"
              href="/contact"
            >
              Contact Us
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
            Explore options that fit your needs.
          </h2>

          <p>
            Whether you are planning a personal
            expense, considering a vehicle purchase,
            or exploring home financing, learn more
            about available lending options.
          </p>

        </div>


        <div
          id="loan-options"
          className="public-feature-grid"
        >

          {/* PERSONAL LOAN */}

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

            <a href="#apply">
              Learn More →
            </a>

          </div>


          {/* HOME FINANCING */}

          <div className="public-feature-card">

            <div className="feature-icon">
              ⌂
            </div>

            <h3>
              Home Financing
            </h3>

            <p>
              Learn more about available home
              financing options and the information
              required to begin an application.
            </p>

            <a href="#apply">
              Learn More →
            </a>

          </div>


          {/* AUTO FINANCING */}

          <div className="public-feature-card">

            <div className="feature-icon">
              ◇
            </div>

            <h3>
              Auto Financing
            </h3>

            <p>
              Explore financing information for
              eligible customers interested in
              purchasing a vehicle.
            </p>

            <a href="#apply">
              Learn More →
            </a>

          </div>


          {/* OTHER FINANCING */}

          <div className="public-feature-card">

            <div className="feature-icon">
              +
            </div>

            <h3>
              Other Lending Options
            </h3>

            <p>
              Contact our customer support team to
              learn about other available lending
              information.
            </p>

            <a href="/contact">
              Contact Us →
            </a>

          </div>

        </div>

      </section>


      {/* =========================
          APPLICATION PROCESS
      ========================== */}

      <section className="loan-section">

        <div className="loan-content">

          <span className="section-label">
            APPLICATION PROCESS
          </span>

          <h2>
            Starting a loan application.
          </h2>

          <p>
            The application process begins by
            providing the information required for
            your selected lending option. Applications
            may be reviewed before any lending decision
            is made.
          </p>

          <a
            className="primary-button"
            href="/contact"
          >
            Contact Us
          </a>

        </div>


        <div className="loan-options">

          <div>

            <strong>
              01. Choose an Option
            </strong>

            <span>
              Review the available lending options.
            </span>

          </div>


          <div>

            <strong>
              02. Provide Information
            </strong>

            <span>
              Submit the information required for
              your application.
            </span>

          </div>


          <div>

            <strong>
              03. Application Review
            </strong>

            <span>
              Your application can be reviewed before
              a lending decision.
            </span>

          </div>

        </div>

      </section>


      {/* =========================
          APPLICATION INFORMATION
      ========================== */}

      <section
        id="apply"
        className="public-section"
      >

        <div className="section-introduction">

          <span className="section-label">
            LOAN APPLICATION
          </span>

          <h2>
            Ready to discuss your application?
          </h2>

          <p>
            Contact our team to learn about the
            available application process and the
            information required for your selected
            lending option.
          </p>

        </div>


        <div className="public-feature-grid">

          <div className="public-feature-card">

            <div className="feature-icon">
              ✓
            </div>

            <h3>
              Eligibility Information
            </h3>

            <p>
              Ask about eligibility requirements and
              the information needed for the selected
              loan option.
            </p>

          </div>


          <div className="public-feature-card">

            <div className="feature-icon">
              ▤
            </div>

            <h3>
              Application Information
            </h3>

            <p>
              Learn which information and documents
              may be required when beginning an
              application.
            </p>

          </div>


          <div className="public-feature-card">

            <div className="feature-icon">
              ?
            </div>

            <h3>
              Questions?
            </h3>

            <p>
              Our customer support resources can
              help answer questions about available
              lending services.
            </p>

            <a href="/support">
              Customer Support →
            </a>

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
            FINANCIAL SECURITY
          </span>

          <h2>
            Keep your information protected.
          </h2>

          <p>
            Never provide your password, PIN,
            verification codes, or other sensitive
            account information through an
            unverified message or website.
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
            Have questions about lending?
          </h2>

          <p>
            Contact our customer support team for
            more information about available lending
            services and the application process.
          </p>

        </div>


        <div className="support-banner-actions">

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
            Customer Support
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
          Review available loan information or
          contact our team to learn more.
        </p>

        <div className="hero-actions">

          <a
            className="primary-button"
            href="#loan-options"
          >
            View Loan Options
          </a>

          <a
            className="secondary-button"
            href="/contact"
          >
            Contact Us
          </a>

        </div>

      </section>

    </main>
  );
}
