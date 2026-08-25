export default function Home() {
  return (
    <main>
      {/* =========================
          HEADER / NAVIGATION
      ========================== */}

      <header className="public-header">
        <div className="public-logo">
          <div className="bank-logo">M</div>

          <div>
            <strong>MIDATLANTIC</strong>
            <span>FEDERAL BANK</span>
          </div>
        </div>

        <nav className="public-nav">
          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a href="/services">Banking</a>
          <a href="/loans">Loans</a>
          <a href="/news">News</a>
          <a href="/contact">Contact</a>
        </nav>

        <div className="header-actions">
          <a className="header-signin" href="/login">
            Sign In
          </a>

          <a className="header-open" href="/signup">
            Open an Account
          </a>
        </div>
      </header>

      {/* =========================
          HERO
      ========================== */}

      <section className="public-hero">
        <div className="hero-content">
          <span className="hero-eyebrow">PERSONAL BANKING</span>

          <h1>
            Banking designed around
            <span> your financial goals.</span>
          </h1>

          <p>
            Manage your banking needs with convenient online access,
            account services, customer support, and financial resources.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="/login">
              Sign In
            </a>

            <a className="secondary-button" href="/signup">
              Open an Account
            </a>
          </div>

          <div className="hero-security">
            <span>✓ Secure account access</span>
            <span>✓ Online account management</span>
            <span>✓ Customer support</span>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-top">
            <span>ONLINE BANKING</span>
            <span>●</span>
          </div>

          <h2>
            Your banking,
            <br />
            wherever you are.
          </h2>

          <p>
            Access your account, review activity, manage requests,
            and stay connected with customer support.
          </p>

          <a href="/login">Access Online Banking →</a>
        </div>
      </section>

      {/* =========================
          BANKING SERVICES
      ========================== */}

      <section className="public-section">
        <div className="section-introduction">
          <span className="section-label">BANKING MADE SIMPLE</span>

          <h2>Everything you need in one place.</h2>

          <p>
            Explore banking services and resources designed to make
            managing your account straightforward and convenient.
          </p>
        </div>

        <div className="public-feature-grid">
          <div className="public-feature-card">
            <div className="feature-icon">$</div>

            <h3>Checking Accounts</h3>

            <p>
              Manage your everyday banking with convenient account
              access and transaction history.
            </p>

            <a href="/services">Learn More →</a>
          </div>

          <div className="public-feature-card">
            <div className="feature-icon">↗</div>

            <h3>Transfers</h3>

            <p>
              Submit transfer requests and manage your account
              activity through online banking.
            </p>

            <a href="/services">Explore Transfers →</a>
          </div>

          <div className="public-feature-card">
            <div className="feature-icon">%</div>

            <h3>Lending Solutions</h3>

            <p>
              Explore available lending options and learn about
              the application process.
            </p>

            <a href="/loans">Explore Loans →</a>
          </div>

          <div className="public-feature-card">
            <div className="feature-icon">?</div>

            <h3>Customer Support</h3>

            <p>
              Get help with your account through available
              customer support channels.
            </p>

            <a href="/support">Get Support →</a>
          </div>
        </div>
      </section>

      {/* =========================
          ABOUT
      ========================== */}

      <section className="about-preview">
        <div className="about-preview-image">
          <div className="about-image-placeholder">
            MIDATLANTIC
            <br />
            FEDERAL BANK
          </div>
        </div>

        <div className="about-preview-content">
          <span className="section-label">
            ABOUT MIDATLANTIC FEDERAL BANK
          </span>

          <h2>
            A banking experience built around our customers.
          </h2>

          <p>
            Learn more about our organization, banking services,
            customer support, and the principles that guide the way
            we serve our customers.
          </p>

          <a className="primary-button" href="/about">
            About Us
          </a>
        </div>
      </section>

      {/* =========================
          LOANS
      ========================== */}

      <section className="loan-section">
        <div className="loan-content">
          <span className="section-label">LENDING</span>

          <h2>Explore lending options for your plans.</h2>

          <p>
            Learn about available loan products, eligibility
            requirements, and how to begin an application.
          </p>

          <a className="primary-button" href="/loans">
            Explore Loans
          </a>
        </div>

        <div className="loan-options">
          <div>
            <strong>Personal Loans</strong>
            <span>Flexible financing options</span>
          </div>

          <div>
            <strong>Home Financing</strong>
            <span>Explore available options</span>
          </div>

          <div>
            <strong>Auto Financing</strong>
            <span>Financing for eligible customers</span>
          </div>
        </div>
      </section>

      {/* =========================
          NEWS
      ========================== */}

      <section className="public-section">
        <div className="section-heading">
          <div>
            <span className="section-label">NEWS & UPDATES</span>

            <h2>Latest from the bank</h2>
          </div>

          <a className="text-button" href="/news">
            View All News →
          </a>
        </div>

        <div className="news-grid">
          <article className="news-card">
            <div className="news-image">BANK NEWS</div>

            <div className="news-content">
              <span>BANKING</span>

              <h3>Online banking services and account access</h3>

              <p>
                Learn more about managing your account through
                online banking.
              </p>

              <a href="/news">Read More →</a>
            </div>
          </article>

          <article className="news-card">
            <div className="news-image">
              CUSTOMER
              <br />
              SERVICES
            </div>

            <div className="news-content">
              <span>CUSTOMER SERVICE</span>

              <h3>Staying connected with customer support</h3>

              <p>
                Discover the available ways to contact customer
                support.
              </p>

              <a href="/news">Read More →</a>
            </div>
          </article>

          <article className="news-card">
            <div className="news-image">SECURITY</div>

            <div className="news-content">
              <span>SECURITY</span>

              <h3>Protecting your online banking information</h3>

              <p>
                Review important security practices for protecting
                your account.
              </p>

              <a href="/news">Read More →</a>
            </div>
          </article>
        </div>
      </section>

      {/* =========================
          CUSTOMER SUPPORT
      ========================== */}

      <section className="support-banner">
        <div>
          <span className="section-label">CUSTOMER SUPPORT</span>

          <h2>We're here to help.</h2>

          <p>
            Have a question about your account, banking services,
            or an online banking issue? Contact our support team.
          </p>
        </div>

        <div className="support-banner-actions">
          <a className="primary-button" href="/support">
            Customer Support
          </a>

          <a className="secondary-button" href="/contact">
            Contact Us
          </a>
        </div>
      </section>

      {/* =========================
          SECURITY
      ========================== */}

      <section className="security-public">
        <div className="security-icon">✓</div>

        <div>
          <span className="section-label">ONLINE SECURITY</span>

          <h2>Protect your account.</h2>

          <p>
            Never share your password, PIN, verification codes,
            or other sensitive account information. Always access
            online banking through the official website.
          </p>
        </div>

        <a href="/security">Security Center →</a>
      </section>

      {/* =========================
          FINAL CTA
      ========================== */}

      <section className="final-cta">
        <span className="section-label">GET STARTED</span>

        <h2>Ready to get started?</h2>

        <p>
          Access your online banking account or begin the account
          registration process.
        </p>

        <div className="hero-actions">
          <a className="primary-button" href="/login">
            Sign In
          </a>

          <a className="secondary-button" href="/signup">
            Open an Account
          </a>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}

      <footer className="public-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="public-logo">
              <div className="bank-logo">M</div>

              <div>
                <strong>MIDATLANTIC</strong>
                <span>FEDERAL BANK</span>
              </div>
            </div>

            <p>
              Online banking and customer support resources.
            </p>
          </div>

          <div className="footer-column">
            <h3>Banking</h3>

            <a href="/services">Banking Services</a>
            <a href="/loans">Loans</a>
            <a href="/login">Online Banking</a>
          </div>

          <div className="footer-column">
            <h3>Company</h3>

            <a href="/about">About Us</a>
            <a href="/news">News</a>
            <a href="/contact">Contact Us</a>
          </div>

          <div className="footer-column">
            <h3>Support</h3>

            <a href="/support">Customer Support</a>
            <a href="/security">Security Center</a>
            <a href="/faq">FAQs</a>
          </div>
        </div>

        {/* =========================
            CONTACT INFORMATION
        ========================== */}

        <div className="footer-contact">
          <strong>Bank Contact Information</strong>

          <p>
            12822 Wisteria Dr,
            <br />
            Germantown, MD 20874,
            <br />
            United States
          </p>

          <p>
            Email:{" "}
            <a href="mailto:midfb@outlook.com">
              midfb@outlook.com
            </a>
          </p>

          <p>
            Phone:{" "}
            <a href="tel:+16266063125">
              +1 626-606-3125
            </a>
          </p>
        </div>

        {/* =========================
            FOOTER BOTTOM
        ========================== */}

        <div className="footer-bottom">
          <span>
            © 2026 MidAtlantic Federal Bank. All rights reserved.
          </span>

          <div>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/security">Security</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
