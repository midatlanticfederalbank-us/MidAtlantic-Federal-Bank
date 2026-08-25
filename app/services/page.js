export default function AboutPage() {
  return (
    <main className="public-page">

      {/* =========================
          PAGE HERO
      ========================== */}

      <section className="page-hero">

        <div className="page-hero-content">

          <span className="hero-eyebrow">
            ABOUT MIDATLANTIC FEDERAL BANK
          </span>

          <h1>
            Banking built around
            <span> our customers.</span>
          </h1>

          <p>
            Learn more about MidAtlantic Federal Bank,
            our banking services, customer support,
            and our commitment to providing a convenient
            banking experience.
          </p>

        </div>

      </section>


      {/* =========================
          INTRODUCTION
      ========================== */}

      <section className="public-section">

        <div className="section-introduction">

          <span className="section-label">
            WHO WE ARE
          </span>

          <h2>
            A customer-focused banking experience.
          </h2>

          <p>
            MidAtlantic Federal Bank provides banking
            resources designed to help customers manage
            their financial needs through convenient
            account services and online banking access.
          </p>

          <p>
            Our website provides access to account
            information, banking services, customer
            support resources, financial information,
            and other services available to our customers.
          </p>

        </div>

      </section>


      {/* =========================
          OUR APPROACH
      ========================== */}

      <section className="about-values">

        <div className="about-value-intro">

          <span className="section-label">
            OUR APPROACH
          </span>

          <h2>
            Simple, accessible and customer focused.
          </h2>

          <p>
            We believe banking should be straightforward.
            Our services are designed to give customers
            convenient access to the information and
            support they need.
          </p>

        </div>


        <div className="about-value-grid">

          <div className="about-value-card">

            <div className="feature-icon">
              ✓
            </div>

            <h3>
              Customer Service
            </h3>

            <p>
              We provide customer support resources to
              help customers with questions, account
              information, and banking services.
            </p>

          </div>


          <div className="about-value-card">

            <div className="feature-icon">
              ◇
            </div>

            <h3>
              Security
            </h3>

            <p>
              Protecting customer account information is
              an important part of a secure online banking
              experience.
            </p>

          </div>


          <div className="about-value-card">

            <div className="feature-icon">
              →
            </div>

            <h3>
              Convenience
            </h3>

            <p>
              Online banking provides convenient access
              to account information and available
              banking services.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          BANKING SERVICES
      ========================== */}

      <section className="public-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              OUR SERVICES
            </span>

            <h2>
              Banking resources for everyday needs.
            </h2>

          </div>

        </div>


        <div className="public-feature-grid">

          <div className="public-feature-card">

            <div className="feature-icon">
              $
            </div>

            <h3>
              Account Services
            </h3>

            <p>
              Access available account information,
              account activity, and other online
              banking services.
            </p>

            <a href="/services">
              Banking Services →
            </a>

          </div>


          <div className="public-feature-card">

            <div className="feature-icon">
              ↗
            </div>

            <h3>
              Online Banking
            </h3>

            <p>
              Manage your customer account through
              convenient online banking access.
            </p>

            <a href="/login">
              Sign In →
            </a>

          </div>


          <div className="public-feature-card">

            <div className="feature-icon">
              %
            </div>

            <h3>
              Lending
            </h3>

            <p>
              Explore available lending information
              and learn about the application process.
            </p>

            <a href="/loans">
              Explore Loans →
            </a>

          </div>


          <div className="public-feature-card">

            <div className="feature-icon">
              ?
            </div>

            <h3>
              Customer Support
            </h3>

            <p>
              Find customer support resources and
              information for banking-related questions.
            </p>

            <a href="/support">
              Get Support →
            </a>

          </div>

        </div>

      </section>


      {/* =========================
          BANK INFORMATION
      ========================== */}

      <section className="bank-information">

        <div className="bank-information-content">

          <span className="section-label">
            BANK INFORMATION
          </span>

          <h2>
            MidAtlantic Federal Bank
          </h2>

          <p>
            Our customer support team is available to
            assist with questions about banking services,
            account access, and available customer
            resources.
          </p>

        </div>


        <div className="bank-information-card">

          <div className="bank-info-row">

            <span>
              Address
            </span>

            <strong>
              12822 Wisteria Dr,
              <br />
              Germantown, MD 20874
              <br />
              United States
            </strong>

          </div>


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
            Protect your account information.
          </h2>

          <p>
            Never share your password, PIN,
            verification codes, or other sensitive
            account information with anyone.
            Always use the official website when
            accessing online banking.
          </p>

        </div>

        <a href="/security">
          Security Center →
        </a>

      </section>


      {/* =========================
          CALL TO ACTION
      ========================== */}

      <section className="final-cta">

        <span className="section-label">
          GET STARTED
        </span>

        <h2>
          Explore your banking options.
        </h2>

        <p>
          Access online banking, explore available
          services, or contact customer support.
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
            href="/contact"
          >
            Contact Us
          </a>

        </div>

      </section>

    </main>
  );
}
