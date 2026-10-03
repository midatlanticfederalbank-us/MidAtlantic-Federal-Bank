export default function Home() {
  return (
    <main className="bank-home">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="bank-header">
        <div className="bank-header-inner">

          <a href="/" className="bank-brand">
            <div className="brand-mark">
              M
            </div>

            <div className="brand-text">
              <strong>MIDATLANTIC</strong>
              <span>FEDERAL BANK</span>
            </div>
          </a>

          <nav className="bank-nav">
            <a className="active" href="/">
              Home
            </a>

            <a href="/about">
              About Us
            </a>

            <a href="/services">
              Banking
            </a>

            <a href="/loans">
              Loans
            </a>

            <a href="/news">
              News
            </a>

            <a href="/contact">
              Contact
            </a>
          </nav>

          <div className="bank-header-actions">
            <a
              href="/login"
              className="header-login"
            >
              Sign In
            </a>

            <a
              href="/signup"
              className="header-account"
            >
              Open an Account
            </a>
          </div>

        </div>
      </header>


      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="bank-hero">

        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="bank-hero-inner">

          <div className="hero-copy">

            <div className="hero-kicker">
              <span className="kicker-line" />
              PERSONAL &amp; BUSINESS BANKING
            </div>

            <h1>
              Banking built around
              <span> your future.</span>
            </h1>

            <p className="hero-description">
              A modern banking experience designed to help you
              manage your money, access your accounts, explore
              lending solutions, and stay connected wherever you are.
            </p>

            <div className="hero-buttons">

              <a
                href="/login"
                className="gold-button"
              >
                Sign In to Online Banking
                <span>→</span>
              </a>

              <a
                href="/signup"
                className="outline-light-button"
              >
                Open an Account
              </a>

            </div>

            <div className="hero-trust">

              <div>
                <span className="trust-check">
                  ✓
                </span>

                <span>
                  Secure online access
                </span>
              </div>

              <div>
                <span className="trust-check">
                  ✓
                </span>

                <span>
                  Convenient account management
                </span>
              </div>

              <div>
                <span className="trust-check">
                  ✓
                </span>

                <span>
                  Dedicated customer support
                </span>
              </div>

            </div>

          </div>


          {/* DIGITAL BANKING PANEL */}

          <div className="hero-banking-panel">

            <div className="hero-panel-glow" />

            <div className="hero-panel-top">

              <div className="panel-label">
                <span className="live-dot" />
                ONLINE BANKING
              </div>

              <div className="panel-mark">
                M
              </div>

            </div>

            <div className="hero-panel-body">

              <span className="panel-small-label">
                YOUR BANKING, YOUR WAY
              </span>

              <h2>
                Everything you need,
                <br />
                right at your fingertips.
              </h2>

              <p>
                Review your balance, monitor activity,
                manage transfers, request services,
                and stay connected to your bank.
              </p>

              <a
                href="/login"
                className="panel-link"
              >
                Access Online Banking
                <span>→</span>
              </a>

            </div>

            <div className="hero-panel-footer">

              <div>
                <span>ACCOUNT ACCESS</span>
                <strong>24 / 7</strong>
              </div>

              <div>
                <span>SECURE</span>
                <strong>Protected</strong>
              </div>

              <div>
                <span>SUPPORT</span>
                <strong>Available</strong>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          TRUST STRIP
      ========================================================= */}

      <section className="trust-strip">

        <div className="trust-strip-inner">

          <div className="trust-item">

            <div className="trust-icon">
              ✓
            </div>

            <div>
              <strong>
                Secure Banking
              </strong>

              <span>
                Protecting your financial information
              </span>
            </div>

          </div>


          <div className="trust-divider" />


          <div className="trust-item">

            <div className="trust-icon">
              $
            </div>

            <div>
              <strong>
                Everyday Banking
              </strong>

              <span>
                Convenient access to your account
              </span>
            </div>

          </div>


          <div className="trust-divider" />


          <div className="trust-item">

            <div className="trust-icon">
              ↗
            </div>

            <div>
              <strong>
                Digital Access
              </strong>

              <span>
                Manage your banking online
              </span>
            </div>

          </div>


          <div className="trust-divider" />


          <div className="trust-item">

            <div className="trust-icon">
              ?
            </div>

            <div>
              <strong>
                Customer Support
              </strong>

              <span>
                Help when you need it
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          BANKING SERVICES
      ========================================================= */}

      <section className="home-section services-section">

        <div className="section-top">

          <div>

            <span className="section-kicker">
              BANKING SERVICES
            </span>

            <h2>
              Banking made simpler.
            </h2>

            <p>
              Explore services designed around the way you
              manage your money every day.
            </p>

          </div>

          <a
            href="/services"
            className="section-link"
          >
            View All Services
            <span>→</span>
          </a>

        </div>


        <div className="service-grid">

          <a
            href="/services"
            className="service-card service-card-featured"
          >

            <div className="service-card-top">
              <span className="service-number">
                01
              </span>

              <div className="service-icon">
                $
              </div>
            </div>

            <div className="service-card-content">

              <h3>
                Checking Accounts
              </h3>

              <p>
                Convenient everyday banking with account
                access, transaction history, and digital
                account management.
              </p>

              <span className="service-arrow">
                Explore Checking
                <b>→</b>
              </span>

            </div>

          </a>


          <a
            href="/services"
            className="service-card"
          >

            <div className="service-card-top">
              <span className="service-number">
                02
              </span>

              <div className="service-icon">
                ↗
              </div>
            </div>

            <div className="service-card-content">

              <h3>
                Transfers &amp; Payments
              </h3>

              <p>
                Manage transfer requests and stay in control
                of your account activity through online banking.
              </p>

              <span className="service-arrow">
                Explore Transfers
                <b>→</b>
              </span>

            </div>

          </a>


          <a
            href="/loans"
            className="service-card"
          >

            <div className="service-card-top">
              <span className="service-number">
                03
              </span>

              <div className="service-icon">
                %
              </div>
            </div>

            <div className="service-card-content">

              <h3>
                Lending Solutions
              </h3>

              <p>
                Explore available lending options and learn
                more about the application process.
              </p>

              <span className="service-arrow">
                Explore Loans
                <b>→</b>
              </span>

            </div>

          </a>


          <a
            href="/support"
            className="service-card"
          >

            <div className="service-card-top">
              <span className="service-number">
                04
              </span>

              <div className="service-icon">
                ?
              </div>
            </div>

            <div className="service-card-content">

              <h3>
                Customer Support
              </h3>

              <p>
                Find help with your account, banking services,
                online banking, and general questions.
              </p>

              <span className="service-arrow">
                Get Support
                <b>→</b>
              </span>

            </div>

          </a>

        </div>

      </section>


      {/* =========================================================
          ABOUT / WHY MIDATLANTIC
      ========================================================= */}

      <section className="about-section">

        <div className="about-visual">

          <div className="about-pattern" />

          <div className="about-main-card">

            <div className="about-card-logo">
              M
            </div>

            <span>
              MIDATLANTIC
            </span>

            <strong>
              FEDERAL BANK
            </strong>

            <div className="about-card-line" />

            <small>
              BANKING • SERVICE • TRUST
            </small>

          </div>


          <div className="about-floating-card">

            <span>
              CUSTOMER FIRST
            </span>

            <strong>
              Banking that puts
              <br />
              people first.
            </strong>

            <div className="floating-check">
              ✓
            </div>

          </div>

        </div>


        <div className="about-copy">

          <span className="section-kicker">
            WHY MIDATLANTIC
          </span>

          <h2>
            A banking relationship
            built for the long term.
          </h2>

          <p>
            Banking should feel clear, accessible, and
            dependable. Our customer experience is designed
            to make everyday banking easier while giving
            you the tools and resources to manage your
            financial needs.
          </p>


          <div className="about-points">

            <div className="about-point">

              <div className="about-point-icon">
                01
              </div>

              <div>
                <strong>
                  Convenient access
                </strong>

                <span>
                  Manage your banking through secure online
                  account access.
                </span>
              </div>

            </div>


            <div className="about-point">

              <div className="about-point-icon">
                02
              </div>

              <div>
                <strong>
                  Straightforward service
                </strong>

                <span>
                  Find banking information and support
                  without unnecessary complexity.
                </span>
              </div>

            </div>


            <div className="about-point">

              <div className="about-point-icon">
                03
              </div>

              <div>
                <strong>
                  Security focused
                </strong>

                <span>
                  Protect your account and financial
                  information with secure banking practices.
                </span>
              </div>

            </div>

          </div>


          <a
            href="/about"
            className="dark-button"
          >
            Learn About Us
            <span>→</span>
          </a>

        </div>

      </section>


      {/* =========================================================
          LENDING
      ========================================================= */}

      <section className="lending-section">

        <div className="lending-background-shape" />

        <div className="lending-inner">

          <div className="lending-copy">

            <span className="light-kicker">
              LENDING SOLUTIONS
            </span>

            <h2>
              When you have a plan,
              we're here to help.
            </h2>

            <p>
              Explore lending options for personal goals,
              major purchases, and other financial needs.
              Review available products and learn how to
              begin the application process.
            </p>

            <a
              href="/loans"
              className="gold-button"
            >
              Explore Lending
              <span>→</span>
            </a>

          </div>


          <div className="lending-options">

            <a href="/loans">

              <span className="loan-number">
                01
              </span>

              <div>
                <strong>
                  Personal Loans
                </strong>

                <span>
                  Financing options for eligible customers
                </span>
              </div>

              <b>
                →
              </b>

            </a>


            <a href="/loans">

              <span className="loan-number">
                02
              </span>

              <div>
                <strong>
                  Home Financing
                </strong>

                <span>
                  Explore available home financing options
                </span>
              </div>

              <b>
                →
              </b>

            </a>


            <a href="/loans">

              <span className="loan-number">
                03
              </span>

              <div>
                <strong>
                  Auto Financing
                </strong>

                <span>
                  Financing options for eligible customers
                </span>
              </div>

              <b>
                →
              </b>

            </a>

          </div>

        </div>

      </section>


      {/* =========================================================
          NEWS
      ========================================================= */}

      <section className="home-section news-section">

        <div className="section-top">

          <div>

            <span className="section-kicker">
              NEWS &amp; INSIGHTS
            </span>

            <h2>
              Stay informed.
            </h2>

            <p>
              Explore banking, financial technology,
              global markets, and security information.
            </p>

          </div>

          <a
            href="/news"
            className="section-link"
          >
            View All News
            <span>→</span>
          </a>

        </div>


        <div className="news-grid">

          <article className="news-card">

            <div className="news-image">

              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85"
                alt="Professionals discussing financial services"
                loading="lazy"
              />

              <span>
                BANKING
              </span>

            </div>

            <div className="news-card-body">

              <small>
                BANKING &amp; DIGITAL SERVICES
              </small>

              <h3>
                Modern banking and convenient
                digital account access
              </h3>

              <p>
                Learn more about managing your banking
                through convenient online services.
              </p>

              <a href="/news">
                Read Story →
              </a>

            </div>

          </article>


          <article className="news-card">

            <div className="news-image">

              <img
                src="https://images.unsplash.com/photo-1521292270410-a8c4d716d518?auto=format&fit=crop&w=1400&q=85"
                alt="Global city representing international business"
                loading="lazy"
              />

              <span>
                GLOBAL MARKETS
              </span>

            </div>

            <div className="news-card-body">

              <small>
                MARKETS &amp; INVESTMENT
              </small>

              <h3>
                Global markets and
                international investment
              </h3>

              <p>
                Follow developments across international
                markets and cross-border investment.
              </p>

              <a href="/news">
                Read Story →
              </a>

            </div>

          </article>


          <article className="news-card">

            <div className="news-image">

              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=85"
                alt="Digital banking security"
                loading="lazy"
              />

              <span>
                SECURITY
              </span>

            </div>

            <div className="news-card-body">

              <small>
                ONLINE SECURITY
              </small>

              <h3>
                Protecting your online
                banking information
              </h3>

              <p>
                Review important practices for protecting
                your account and financial information.
              </p>

              <a href="/security">
                Security Center →
              </a>

            </div>

          </article>

        </div>

      </section>


      {/* =========================================================
          SECURITY BANNER
      ========================================================= */}

      <section className="security-banner">

        <div className="security-banner-icon">
          ✓
        </div>

        <div className="security-banner-copy">

          <span>
            ONLINE BANKING SECURITY
          </span>

          <h2>
            Your security matters.
          </h2>

          <p>
            Never share your password, PIN, verification
            codes, or other sensitive account information.
            Always access online banking through the official
            bank website.
          </p>

        </div>

        <a
          href="/security"
          className="security-banner-link"
        >
          Visit Security Center
          <span>→</span>
        </a>

      </section>


      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="final-bank-cta">

        <div className="cta-decoration cta-decoration-one" />
        <div className="cta-decoration cta-decoration-two" />

        <div className="cta-content">

          <span className="light-kicker">
            GET STARTED
          </span>

          <h2>
            Your next banking
            <br />
            chapter starts here.
          </h2>

          <p>
            Access your account online or begin the
            registration process today.
          </p>

          <div className="cta-buttons">

            <a
              href="/login"
              className="gold-button"
            >
              Sign In
              <span>→</span>
            </a>

            <a
              href="/signup"
              className="outline-light-button"
            >
              Open an Account
            </a>

          </div>

        </div>

      </section>


      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="bank-footer">

        <div className="footer-main">

          <div className="footer-brand-column">

            <a
              href="/"
              className="bank-brand footer-brand"
            >

              <div className="brand-mark">
                M
              </div>

              <div className="brand-text">
                <strong>MIDATLANTIC</strong>
                <span>FEDERAL BANK</span>
              </div>

            </a>

            <p>
              Online banking and customer support
              resources for our customers.
            </p>

            <div className="footer-status">
              <span />
              Online banking available
            </div>

          </div>


          <div className="footer-column">

            <h3>
              Banking
            </h3>

            <a href="/services">
              Banking Services
            </a>

            <a href="/loans">
              Loans
            </a>

            <a href="/login">
              Online Banking
            </a>

            <a href="/news">
              News &amp; Insights
            </a>

          </div>


          <div className="footer-column">

            <h3>
              Company
            </h3>

            <a href="/about">
              About Us
            </a>

            <a href="/contact">
              Contact Us
            </a>

            <a href="/support">
              Customer Support
            </a>

            <a href="/faq">
              FAQs
            </a>

          </div>


          <div className="footer-column footer-contact-column">

            <h3>
              Contact
            </h3>

            <p>
              12822 Wisteria Dr
              <br />
              Germantown, MD 20874
              <br />
              United States
            </p>

            <a href="mailto:midfb@outlook.com">
              midfb@outlook.com
            </a>

            <a href="tel:+16266063125">
              +1 626-606-3125
            </a>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © 2026 MidAtlantic Federal Bank.
            All rights reserved.
          </span>

          <div>

            <a href="/privacy">
              Privacy
            </a>

            <a href="/terms">
              Terms
            </a>

            <a href="/security">
              Security
            </a>

          </div>

        </div>

      </footer>


      {/* =========================================================
          PAGE STYLES
      ========================================================= */}

      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        .bank-home {
          width: 100%;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          background: #f7f9fc;
          color: #14263d;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .bank-header {
          position: relative;
          z-index: 50;
          width: 100%;
          background: rgba(255, 255, 255, 0.97);
          border-bottom: 1px solid #e6ebf2;
          backdrop-filter: blur(18px);
        }

        .bank-header-inner {
          width: min(1240px, calc(100% - 48px));
          min-height: 82px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
        }

        .bank-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #14263d;
          text-decoration: none;
          flex-shrink: 0;
        }

        .brand-mark {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background:
            linear-gradient(
              145deg,
              #163f72,
              #0a2344
            );
          color: #ffffff;
          font-size: 21px;
          font-weight: 900;
          letter-spacing: -0.04em;
          box-shadow:
            0 8px 24px rgba(10, 35, 68, 0.18);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .brand-text strong {
          color: #102844;
          font-size: 15px;
          letter-spacing: 0.13em;
          font-weight: 900;
        }

        .brand-text span {
          margin-top: 5px;
          color: #68778a;
          font-size: 9px;
          letter-spacing: 0.26em;
          font-weight: 800;
        }

        .bank-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 28px;
          flex: 1;
        }

        .bank-nav a {
          position: relative;
          padding: 31px 0;
          color: #536377;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition:
            color 0.2s ease;
        }

        .bank-nav a::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 21px;
          height: 2px;
          border-radius: 20px;
          background: #b38a3c;
          transform: scaleX(0);
          transform-origin: center;
          transition:
            transform 0.2s ease;
        }

        .bank-nav a:hover,
        .bank-nav a.active {
          color: #102d50;
        }

        .bank-nav a:hover::after,
        .bank-nav a.active::after {
          transform: scaleX(1);
        }

        .bank-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .header-login,
        .header-account {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 17px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .header-login {
          color: #153a67;
          border: 1px solid #d6dee8;
          background: #ffffff;
        }

        .header-account {
          color: #ffffff;
          background: #153a67;
          box-shadow:
            0 8px 20px rgba(21, 58, 103, 0.15);
        }

        .header-login:hover,
        .header-account:hover {
          transform: translateY(-2px);
        }

        .header-login:hover {
          background: #f5f8fb;
        }

        .header-account:hover {
          box-shadow:
            0 12px 28px rgba(21, 58, 103, 0.23);
        }


        /* =====================================================
           HERO
        ===================================================== */

        .bank-hero {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 85% 25%,
              rgba(68, 122, 184, 0.28),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #071a31 0%,
              #0c294b 52%,
              #123d68 100%
            );
          color: #ffffff;
        }

        .bank-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
          mask-image:
            linear-gradient(
              to right,
              black,
              transparent 85%
            );
          pointer-events: none;
        }

        .hero-glow {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.2;
          pointer-events: none;
        }

        .hero-glow-one {
          top: -200px;
          right: 12%;
          background: #8db7e4;
        }

        .hero-glow-two {
          bottom: -280px;
          left: 25%;
          background: #b38a3c;
        }

        .bank-hero-inner {
          position: relative;
          z-index: 2;
          width: min(1240px, calc(100% - 48px));
          min-height: 610px;
          margin: 0 auto;
          display: grid;
          grid-template-columns:
            minmax(0, 1.08fr)
            minmax(420px, 0.82fr);
          align-items: center;
          gap: 70px;
          padding: 80px 0;
        }

        .hero-copy {
          max-width: 680px;
        }

        .hero-kicker,
        .section-kicker,
        .light-kicker {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #b38a3c;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        .kicker-line {
          width: 34px;
          height: 2px;
          border-radius: 20px;
          background: #c49b50;
        }

        .hero-copy h1 {
          max-width: 680px;
          margin: 23px 0 23px;
          font-size: clamp(48px, 5.4vw, 76px);
          line-height: 0.99;
          letter-spacing: -0.055em;
          font-weight: 850;
        }

        .hero-copy h1 span {
          display: block;
          color: #d7b06b;
        }

        .hero-description {
          max-width: 610px;
          margin: 0;
          color: #c4d0de;
          font-size: 17px;
          line-height: 1.75;
        }

        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: 32px;
        }

        .gold-button,
        .outline-light-button,
        .dark-button {
          min-height: 52px;
          padding: 0 21px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 850;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .gold-button {
          color: #14263d;
          background:
            linear-gradient(
              135deg,
              #d8b875,
              #b88d42
            );
          box-shadow:
            0 10px 28px rgba(0, 0, 0, 0.17);
        }

        .gold-button:hover {
          transform: translateY(-3px);
          box-shadow:
            0 16px 34px rgba(0, 0, 0, 0.24);
        }

        .gold-button span {
          font-size: 17px;
        }

        .outline-light-button {
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.28);
          background: rgba(255, 255, 255, 0.055);
        }

        .outline-light-button:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.11);
        }

        .hero-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 17px 25px;
          margin-top: 29px;
          color: #aebdce;
          font-size: 11px;
          font-weight: 650;
        }

        .hero-trust div {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .trust-check {
          width: 18px;
          height: 18px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: rgba(214, 177, 104, 0.13);
          color: #d7b06b;
          font-size: 10px;
          font-weight: 900;
        }


        /* Hero banking panel */

        .hero-banking-panel {
          position: relative;
          min-height: 450px;
          overflow: hidden;
          border:
            1px solid
            rgba(255, 255, 255, 0.14);
          border-radius: 22px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.12),
              rgba(255, 255, 255, 0.045)
            );
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(18px);
        }

        .hero-panel-glow {
          position: absolute;
          width: 260px;
          height: 260px;
          right: -80px;
          top: -80px;
          border-radius: 50%;
          background: rgba(214, 177, 104, 0.16);
          filter: blur(40px);
        }

        .hero-panel-top {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 27px 29px;
          border-bottom:
            1px solid
            rgba(255, 255, 255, 0.1);
        }

        .panel-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #b8c8d9;
          font-size: 10px;
          letter-spacing: 0.16em;
          font-weight: 900;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #65c98b;
          box-shadow:
            0 0 0 5px rgba(101, 201, 139, 0.08);
        }

        .panel-mark {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.09);
          font-weight: 900;
        }

        .hero-panel-body {
          position: relative;
          padding: 48px 35px 45px;
        }

        .panel-small-label {
          color: #d3ae6c;
          font-size: 10px;
          letter-spacing: 0.16em;
          font-weight: 900;
        }

        .hero-panel-body h2 {
          margin: 13px 0 16px;
          color: #ffffff;
          font-size: 34px;
          line-height: 1.12;
          letter-spacing: -0.035em;
        }

        .hero-panel-body p {
          max-width: 420px;
          margin: 0;
          color: #b9c7d7;
          font-size: 14px;
          line-height: 1.7;
        }

        .panel-link {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          margin-top: 30px;
          color: #ffffff;
          text-decoration: none;
          font-size: 12px;
          font-weight: 850;
        }

        .panel-link span {
          color: #d7b06b;
          font-size: 17px;
        }

        .hero-panel-footer {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top:
            1px solid
            rgba(255, 255, 255, 0.1);
        }

        .hero-panel-footer div {
          padding: 19px 18px;
          border-right:
            1px solid
            rgba(255, 255, 255, 0.08);
        }

        .hero-panel-footer div:last-child {
          border-right: 0;
        }

        .hero-panel-footer span {
          display: block;
          color: #8295aa;
          font-size: 8px;
          letter-spacing: 0.12em;
          font-weight: 800;
        }

        .hero-panel-footer strong {
          display: block;
          margin-top: 5px;
          color: #ffffff;
          font-size: 12px;
        }


        /* =====================================================
           TRUST STRIP
        ===================================================== */

        .trust-strip {
          background: #ffffff;
          border-bottom: 1px solid #e5eaf0;
        }

        .trust-strip-inner {
          width: min(1240px, calc(100% - 48px));
          margin: 0 auto;
          min-height: 105px;
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
          align-items: center;
          gap: 22px;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .trust-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 11px;
          color: #174273;
          background: #eef4fa;
          font-size: 16px;
          font-weight: 900;
        }

        .trust-item strong {
          display: block;
          color: #172d47;
          font-size: 12px;
        }

        .trust-item span:not(.trust-icon) {
          display: block;
          margin-top: 4px;
          color: #7a8796;
          font-size: 10px;
          line-height: 1.4;
        }

        .trust-divider {
          width: 1px;
          height: 36px;
          background: #e3e8ee;
        }


        /* =====================================================
           GENERAL SECTIONS
        ===================================================== */

        .home-section {
          width: min(1240px, calc(100% - 48px));
          margin: 0 auto;
          padding: 105px 0;
        }

        .section-top {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 48px;
        }

        .section-kicker {
          color: #a17a35;
        }

        .section-top h2 {
          max-width: 680px;
          margin: 12px 0 10px;
          color: #122b48;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.05;
          letter-spacing: -0.045em;
        }

        .section-top p {
          max-width: 620px;
          margin: 0;
          color: #718096;
          font-size: 15px;
          line-height: 1.7;
        }

        .section-link {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          flex-shrink: 0;
          color: #173d69;
          text-decoration: none;
          font-size: 12px;
          font-weight: 850;
        }

        .section-link span {
          color: #ae843d;
          font-size: 17px;
        }


        /* =====================================================
           SERVICES
        ===================================================== */

        .services-section {
          background: #f7f9fc;
        }

        .service-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 17px;
        }

        .service-card {
          min-height: 360px;
          display: flex;
          flex-direction: column;
          padding: 27px;
          border:
            1px solid
            #e0e7ef;
          border-radius: 15px;
          background: #ffffff;
          color: inherit;
          text-decoration: none;
          box-shadow:
            0 5px 18px rgba(16, 42, 67, 0.025);
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .service-card:hover {
          transform: translateY(-7px);
          border-color: #c9d6e4;
          box-shadow:
            0 22px 45px rgba(16, 42, 67, 0.11);
        }

        .service-card-featured {
          color: #ffffff;
          border-color: #163b67;
          background:
            linear-gradient(
              150deg,
              #173f70,
              #0a2545
            );
          box-shadow:
            0 18px 38px rgba(14, 48, 83, 0.16);
        }

        .service-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .service-number {
          color: #9aa8b8;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .service-card-featured .service-number {
          color: #9fb6cf;
        }

        .service-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: #183e6c;
          background: #eef4fa;
          font-size: 20px;
          font-weight: 900;
        }

        .service-card-featured .service-icon {
          color: #d8b574;
          background: rgba(255, 255, 255, 0.08);
        }

        .service-card-content {
          display: flex;
          flex: 1;
          flex-direction: column;
          margin-top: auto;
          padding-top: 60px;
        }

        .service-card h3 {
          margin: 0 0 13px;
          color: #15304e;
          font-size: 20px;
          letter-spacing: -0.025em;
        }

        .service-card-featured h3 {
          color: #ffffff;
        }

        .service-card p {
          margin: 0;
          color: #718096;
          font-size: 13px;
          line-height: 1.7;
        }

        .service-card-featured p {
          color: #b9c9da;
        }

        .service-arrow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 30px;
          color: #1a4a7c;
          font-size: 11px;
          font-weight: 850;
        }

        .service-card-featured .service-arrow {
          color: #d8b574;
        }

        .service-arrow b {
          font-size: 16px;
        }


        /* =====================================================
           ABOUT
        ===================================================== */

        .about-section {
          width: min(1240px, calc(100% - 48px));
          margin: 0 auto;
          padding: 25px 0 110px;
          display: grid;
          grid-template-columns:
            minmax(0, 0.95fr)
            minmax(0, 1fr);
          gap: 100px;
          align-items: center;
        }

        .about-visual {
          position: relative;
          min-height: 520px;
          display: grid;
          place-items: center;
          overflow: visible;
        }

        .about-pattern {
          position: absolute;
          inset: 30px 25px 30px 0;
          border-radius: 26px;
          background:
            linear-gradient(
              135deg,
              #eaf1f8,
              #dce7f2
            );
        }

        .about-pattern::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.5;
          background-image:
            linear-gradient(
              135deg,
              rgba(20, 55, 91, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              45deg,
              rgba(20, 55, 91, 0.05) 1px,
              transparent 1px
            );
          background-size: 35px 35px;
          border-radius: inherit;
        }

        .about-main-card {
          position: relative;
          z-index: 2;
          width: min(330px, 70%);
          aspect-ratio: 1.45;
          padding: 34px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-radius: 20px;
          background:
            linear-gradient(
              145deg,
              #1a4778,
              #092544
            );
          color: #ffffff;
          box-shadow:
            0 28px 60px rgba(10, 38, 69, 0.25);
          transform: rotate(-4deg);
        }

        .about-card-logo {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          margin-bottom: 30px;
          border:
            1px solid
            rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          font-size: 21px;
          font-weight: 900;
        }

        .about-main-card > span {
          color: #d7b06b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        .about-main-card > strong {
          margin-top: 7px;
          font-size: 21px;
          letter-spacing: 0.04em;
        }

        .about-card-line {
          width: 45px;
          height: 2px;
          margin: 27px 0 14px;
          background: #c99f57;
        }

        .about-main-card small {
          color: #aabed3;
          font-size: 8px;
          letter-spacing: 0.18em;
          font-weight: 800;
        }

        .about-floating-card {
          position: absolute;
          z-index: 3;
          right: 0;
          bottom: 35px;
          width: 245px;
          padding: 25px;
          border-radius: 17px;
          background: #ffffff;
          box-shadow:
            0 20px 55px rgba(15, 39, 64, 0.14);
        }

        .about-floating-card span {
          color: #a47c39;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .about-floating-card strong {
          display: block;
          margin-top: 10px;
          color: #18334f;
          font-size: 18px;
          line-height: 1.3;
          letter-spacing: -0.025em;
        }

        .floating-check {
          position: absolute;
          right: 20px;
          top: 20px;
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #2c7b52;
          background: #eaf7ef;
          font-weight: 900;
        }

        .about-copy {
          max-width: 590px;
        }

        .about-copy h2 {
          margin: 14px 0 18px;
          color: #122b48;
          font-size: clamp(36px, 4vw, 53px);
          line-height: 1.04;
          letter-spacing: -0.05em;
        }

        .about-copy > p {
          margin: 0;
          color: #6f7f91;
          font-size: 15px;
          line-height: 1.8;
        }

        .about-points {
          margin: 34px 0;
          border-top: 1px solid #e4e9ef;
        }

        .about-point {
          display: flex;
          gap: 15px;
          padding: 17px 0;
          border-bottom: 1px solid #e4e9ef;
        }

        .about-point-icon {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 8px;
          color: #9b7435;
          background: #f7f1e5;
          font-size: 8px;
          font-weight: 900;
        }

        .about-point strong {
          display: block;
          color: #18344f;
          font-size: 12px;
        }

        .about-point span {
          display: block;
          margin-top: 4px;
          color: #788696;
          font-size: 11px;
          line-height: 1.55;
        }

        .dark-button {
          color: #ffffff;
          background: #14385f;
          box-shadow:
            0 10px 25px rgba(20, 56, 95, 0.15);
        }

        .dark-button:hover {
          transform: translateY(-3px);
          box-shadow:
            0 15px 30px rgba(20, 56, 95, 0.22);
        }

        .dark-button span {
          font-size: 17px;
        }


        /* =====================================================
           LENDING
        ===================================================== */

        .lending-section {
          position: relative;
          overflow: hidden;
          color: #ffffff;
          background:
            linear-gradient(
              135deg,
              #0a2545,
              #143f6c
            );
        }

        .lending-background-shape {
          position: absolute;
          width: 520px;
          height: 520px;
          right: -180px;
          top: -220px;
          border-radius: 50%;
          border:
            1px solid
            rgba(255, 255, 255, 0.08);
          box-shadow:
            0 0 0 70px rgba(255, 255, 255, 0.015),
            0 0 0 140px rgba(255, 255, 255, 0.012);
        }

        .lending-inner {
          position: relative;
          z-index: 2;
          width: min(1240px, calc(100% - 48px));
          margin: 0 auto;
          padding: 100px 0;
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(420px, 0.85fr);
          gap: 100px;
          align-items: center;
        }

        .light-kicker {
          color: #d5ad68;
        }

        .lending-copy h2 {
          max-width: 620px;
          margin: 15px 0 18px;
          color: #ffffff;
          font-size: clamp(37px, 4.4vw, 57px);
          line-height: 1.02;
          letter-spacing: -0.05em;
        }

        .lending-copy p {
          max-width: 570px;
          margin: 0;
          color: #b7c7d8;
          font-size: 15px;
          line-height: 1.8;
        }

        .lending-copy .gold-button {
          margin-top: 30px;
        }

        .lending-options {
          overflow: hidden;
          border:
            1px solid
            rgba(255, 255, 255, 0.13);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.045);
        }

        .lending-options a {
          min-height: 110px;
          display: grid;
          grid-template-columns: 50px 1fr 25px;
          align-items: center;
          gap: 17px;
          padding: 20px 24px;
          color: #ffffff;
          text-decoration: none;
          border-bottom:
            1px solid
            rgba(255, 255, 255, 0.1);
          transition:
            background 0.2s ease,
            padding 0.2s ease;
        }

        .lending-options a:last-child {
          border-bottom: 0;
        }

        .lending-options a:hover {
          padding-left: 29px;
          background: rgba(255, 255, 255, 0.06);
        }

        .loan-number {
          color: #d1a65c;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .lending-options strong {
          display: block;
          font-size: 15px;
        }

        .lending-options span:not(.loan-number) {
          display: block;
          margin-top: 5px;
          color: #9fb2c6;
          font-size: 11px;
        }

        .lending-options b {
          color: #d5ad68;
          font-size: 18px;
        }


        /* =====================================================
           NEWS
        ===================================================== */

        .news-section {
          background: #f7f9fc;
        }

        .news-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .news-card {
          overflow: hidden;
          border:
            1px solid
            #e1e7ee;
          border-radius: 15px;
          background: #ffffff;
          box-shadow:
            0 6px 22px rgba(18, 43, 72, 0.035);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .news-card:hover {
          transform: translateY(-6px);
          box-shadow:
            0 20px 42px rgba(18, 43, 72, 0.11);
        }

        .news-image {
          position: relative;
          height: 230px;
          overflow: hidden;
          background: #dce5ee;
        }

        .news-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition:
            transform 0.5s ease;
        }

        .news-card:hover .news-image img {
          transform: scale(1.045);
        }

        .news-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to top,
              rgba(6, 24, 45, 0.46),
              transparent 55%
            );
          pointer-events: none;
        }

        .news-image > span {
          position: absolute;
          z-index: 2;
          left: 17px;
          bottom: 17px;
          padding: 7px 9px;
          border-radius: 5px;
          color: #ffffff;
          background: rgba(8, 32, 57, 0.76);
          backdrop-filter: blur(6px);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .news-card-body {
          padding: 25px;
        }

        .news-card-body small {
          color: #a17834;
          font-size: 8px;
          letter-spacing: 0.15em;
          font-weight: 900;
        }

        .news-card-body h3 {
          margin: 10px 0 11px;
          color: #18334f;
          font-size: 19px;
          line-height: 1.28;
          letter-spacing: -0.025em;
        }

        .news-card-body p {
          margin: 0;
          color: #718093;
          font-size: 12px;
          line-height: 1.7;
        }

        .news-card-body a {
          display: inline-flex;
          margin-top: 21px;
          color: #173d69;
          text-decoration: none;
          font-size: 11px;
          font-weight: 900;
        }


        /* =====================================================
           SECURITY
        ===================================================== */

        .security-banner {
          width: min(1240px, calc(100% - 48px));
          margin: 0 auto 100px;
          padding: 28px 32px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 22px;
          border:
            1px solid
            #dce6e0;
          border-radius: 16px;
          background:
            linear-gradient(
              100deg,
              #f1f8f4,
              #ffffff
            );
        }

        .security-banner-icon {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          color: #28734b;
          background: #e2f2e8;
          font-size: 21px;
          font-weight: 900;
        }

        .security-banner-copy > span {
          color: #42805e;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .security-banner-copy h2 {
          margin: 4px 0 4px;
          color: #173d2a;
          font-size: 19px;
        }

        .security-banner-copy p {
          max-width: 680px;
          margin: 0;
          color: #687d70;
          font-size: 11px;
          line-height: 1.55;
        }

        .security-banner-link {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #28734b;
          text-decoration: none;
          white-space: nowrap;
          font-size: 11px;
          font-weight: 900;
        }


        /* =====================================================
           FINAL CTA
        ===================================================== */

        .final-bank-cta {
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(
              135deg,
              #071b31,
              #0e3358
            );
          color: #ffffff;
        }

        .cta-decoration {
          position: absolute;
          border:
            1px solid
            rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          pointer-events: none;
        }

        .cta-decoration-one {
          width: 500px;
          height: 500px;
          right: -190px;
          top: -280px;
        }

        .cta-decoration-two {
          width: 330px;
          height: 330px;
          left: -170px;
          bottom: -210px;
        }

        .cta-content {
          position: relative;
          z-index: 2;
          width: min(900px, calc(100% - 48px));
          margin: 0 auto;
          padding: 105px 0;
          text-align: center;
        }

        .cta-content .light-kicker {
          justify-content: center;
        }

        .cta-content h2 {
          margin: 16px 0;
          color: #ffffff;
          font-size: clamp(42px, 5vw, 65px);
          line-height: 1.02;
          letter-spacing: -0.055em;
        }

        .cta-content p {
          max-width: 550px;
          margin: 0 auto;
          color: #b4c6d9;
          font-size: 15px;
          line-height: 1.7;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }


        /* =====================================================
           FOOTER
        ===================================================== */

        .bank-footer {
          color: #b6c3d0;
          background: #06182b;
        }

        .footer-main {
          width: min(1240px, calc(100% - 48px));
          margin: 0 auto;
          padding: 70px 0 58px;
          display: grid;
          grid-template-columns:
            1.55fr
            1fr
            1fr
            1.25fr;
          gap: 55px;
        }

        .footer-brand {
          color: #ffffff;
        }

        .footer-brand .brand-text strong {
          color: #ffffff;
        }

        .footer-brand .brand-text span {
          color: #7e93a9;
        }

        .footer-brand-column > p {
          max-width: 280px;
          margin: 20px 0;
          color: #8194a9;
          font-size: 11px;
          line-height: 1.7;
        }

        .footer-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #91a3b5;
          font-size: 9px;
          font-weight: 700;
        }

        .footer-status span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #55b77a;
          box-shadow:
            0 0 0 4px rgba(85, 183, 122, 0.08);
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .footer-column h3 {
          margin: 0 0 19px;
          color: #ffffff;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .footer-column a {
          margin-bottom: 12px;
          color: #8295a9;
          text-decoration: none;
          font-size: 11px;
          transition:
            color 0.2s ease;
        }

        .footer-column a:hover {
          color: #d3aa65;
        }

        .footer-contact-column p {
          margin: 0 0 14px;
          color: #8295a9;
          font-size: 11px;
          line-height: 1.7;
        }

        .footer-contact-column a {
          margin-bottom: 10px;
        }

        .footer-bottom {
          width: min(1240px, calc(100% - 48px));
          margin: 0 auto;
          min-height: 70px;
          padding: 20px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-top:
            1px solid
            rgba(255, 255, 255, 0.08);
          color: #687d91;
          font-size: 9px;
        }

        .footer-bottom div {
          display: flex;
          gap: 20px;
        }

        .footer-bottom a {
          color: #8295a9;
          text-decoration: none;
        }

        .footer-bottom a:hover {
          color: #d3aa65;
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1050px) {

          .bank-header-inner {
            gap: 16px;
          }

          .bank-nav {
            gap: 17px;
          }

          .bank-nav a {
            font-size: 11px;
          }

          .bank-header-actions {
            display: none;
          }

          .bank-hero-inner {
            grid-template-columns: 1fr;
            gap: 45px;
            padding: 70px 0;
          }

          .hero-copy {
            max-width: 850px;
          }

          .hero-banking-panel {
            max-width: 650px;
            width: 100%;
          }

          .service-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .about-section {
            gap: 55px;
          }

          .lending-inner {
            grid-template-columns: 1fr;
            gap: 50px;
          }

          .lending-options {
            max-width: 700px;
          }

          .footer-main {
            grid-template-columns:
              1.5fr 1fr 1fr;
          }

          .footer-contact-column {
            grid-column: 2 / -1;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 720px) {

          .bank-header-inner,
          .bank-hero-inner,
          .trust-strip-inner,
          .home-section,
          .about-section,
          .lending-inner,
          .security-banner,
          .footer-main,
          .footer-bottom {
            width: calc(100% - 28px);
          }

          .bank-header-inner {
            min-height: auto;
            padding: 13px 0;
            flex-wrap: wrap;
          }

          .bank-brand {
            margin-right: auto;
          }

          .bank-nav {
            order: 3;
            width: 100%;
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 3px;
            gap: 22px;
            scrollbar-width: none;
          }

          .bank-nav::-webkit-scrollbar {
            display: none;
          }

          .bank-nav a {
            flex-shrink: 0;
            padding: 10px 0 13px;
            font-size: 11px;
          }

          .bank-nav a::after {
            bottom: 3px;
          }

          .bank-hero-inner {
            min-height: auto;
            padding: 58px 0 65px;
            gap: 38px;
          }

          .hero-copy h1 {
            margin-top: 18px;
            font-size: 48px;
          }

          .hero-description {
            font-size: 14px;
            line-height: 1.7;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: stretch;
          }

          .hero-buttons a {
            width: 100%;
          }

          .hero-trust {
            flex-direction: column;
            gap: 10px;
          }

          .hero-banking-panel {
            min-height: 400px;
          }

          .hero-panel-body {
            padding: 38px 25px 35px;
          }

          .hero-panel-body h2 {
            font-size: 29px;
          }

          .hero-panel-footer div {
            padding: 15px 10px;
          }

          .hero-panel-footer strong {
            font-size: 10px;
          }

          .trust-strip-inner {
            padding: 23px 0;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 22px 16px;
          }

          .trust-divider {
            display: none;
          }

          .home-section {
            padding: 72px 0;
          }

          .section-top {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 32px;
          }

          .section-top h2 {
            font-size: 35px;
          }

          .service-grid {
            grid-template-columns: 1fr;
          }

          .service-card {
            min-height: 300px;
          }

          .service-card-content {
            padding-top: 45px;
          }

          .about-section {
            padding: 10px 0 75px;
            grid-template-columns: 1fr;
            gap: 45px;
          }

          .about-visual {
            min-height: 390px;
          }

          .about-main-card {
            width: 270px;
          }

          .about-floating-card {
            width: 210px;
            right: 0;
            bottom: 8px;
          }

          .about-copy h2 {
            font-size: 37px;
          }

          .lending-inner {
            padding: 75px 0;
          }

          .lending-copy h2 {
            font-size: 39px;
          }

          .lending-options a {
            grid-template-columns: 35px 1fr 20px;
            gap: 10px;
            padding: 18px;
          }

          .news-grid {
            grid-template-columns: 1fr;
          }

          .news-image {
            height: 215px;
          }

          .security-banner {
            margin-bottom: 72px;
            padding: 24px;
            grid-template-columns: auto 1fr;
          }

          .security-banner-link {
            grid-column: 1 / -1;
            padding-left: 76px;
          }

          .final-bank-cta {
            margin-top: 0;
          }

          .cta-content {
            width: calc(100% - 28px);
            padding: 75px 0;
          }

          .cta-content h2 {
            font-size: 43px;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .cta-buttons a {
            width: 100%;
          }

          .footer-main {
            padding: 55px 0 40px;
            grid-template-columns: 1fr 1fr;
            gap: 40px 25px;
          }

          .footer-brand-column {
            grid-column: 1 / -1;
          }

          .footer-contact-column {
            grid-column: 1 / -1;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px 0;
          }

          .footer-bottom div {
            flex-wrap: wrap;
            gap: 14px;
          }

        }


        /* =====================================================
           SMALL PHONES
        ===================================================== */

        @media (max-width: 430px) {

          .brand-mark {
            width: 41px;
            height: 41px;
          }

          .brand-text strong {
            font-size: 12px;
          }

          .brand-text span {
            font-size: 7px;
          }

          .hero-copy h1 {
            font-size: 41px;
          }

          .hero-banking-panel {
            min-height: 380px;
          }

          .hero-panel-top {
            padding: 21px;
          }

          .hero-panel-body {
            padding: 31px 21px;
          }

          .hero-panel-body h2 {
            font-size: 27px;
          }

          .hero-panel-footer span {
            font-size: 7px;
          }

          .hero-panel-footer strong {
            font-size: 9px;
          }

          .trust-strip-inner {
            grid-template-columns: 1fr;
          }

          .about-visual {
            min-height: 350px;
          }

          .about-main-card {
            width: 240px;
          }

          .about-floating-card {
            width: 190px;
            padding: 19px;
          }

          .about-floating-card strong {
            font-size: 15px;
          }

          .lending-copy h2 {
            font-size: 35px;
          }

          .security-banner {
            grid-template-columns: 1fr;
          }

          .security-banner-link {
            grid-column: auto;
            padding-left: 0;
          }

          .cta-content h2 {
            font-size: 38px;
          }

          .footer-main {
            grid-template-columns: 1fr;
          }

        }

      `}</style>

    </main>
  );
}
