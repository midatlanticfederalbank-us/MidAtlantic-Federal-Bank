export default function HomePage() {
  return (
    <>
      <main className="home-page">
        {/* =========================================================
            TOP SECURITY BAR
        ========================================================= */}
        <div className="security-bar">
          <div className="site-container security-bar-inner">
            <div className="security-message">
              <span className="security-dot" />
              <span>Secure online banking</span>
            </div>

            <div className="security-links">
              <a href="/security">Security Center</a>
              <span className="security-divider">|</span>
              <a href="/contact">Contact Us</a>
            </div>
          </div>
        </div>

        {/* =========================================================
            HEADER
        ========================================================= */}
        <header className="main-header">
          <div className="site-container header-inner">
            <a href="/" className="brand" aria-label="MidAtlantic Federal Bank home">
              <div className="brand-mark">
                <span className="brand-mark-top">M</span>
                <span className="brand-mark-bottom">FB</span>
              </div>

              <div className="brand-copy">
                <strong>MIDATLANTIC</strong>
                <span>FEDERAL BANK</span>
              </div>
            </a>

            <nav className="desktop-nav" aria-label="Primary navigation">
              <a href="/">Home</a>
              <a href="#personal-banking">Personal Banking</a>
              <a href="#business-banking">Business</a>
              <a href="#loans">Loans</a>
              <a href="#security">Security</a>
              <a href="/news">News</a>
            </nav>

            <div className="header-actions">
              <a href="/login" className="login-link">
                Sign In
              </a>

              <a href="/signup" className="header-button">
                Open an Account
              </a>
            </div>
          </div>
        </header>

        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="hero">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />

          <div className="site-container hero-grid">
            <div className="hero-content">
              <div className="hero-eyebrow">
                <span className="eyebrow-line" />
                <span>Banking built around you</span>
              </div>

              <h1>
                A stronger financial
                <span> future starts here.</span>
              </h1>

              <p className="hero-description">
                Banking should feel clear, secure, and dependable. Manage your
                money, move funds, access banking services, and stay connected
                with MidAtlantic Federal Bank.
              </p>

              <div className="hero-buttons">
                <a href="/signup" className="primary-button">
                  Open an Account
                  <span>→</span>
                </a>

                <a href="/login" className="outline-button">
                  Sign In to Online Banking
                </a>
              </div>

              <div className="hero-trust">
                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <div>
                    <strong>Secure Access</strong>
                    <small>Protected online banking</small>
                  </div>
                </div>

                <div className="trust-item">
                  <span className="trust-icon">◆</span>
                  <div>
                    <strong>Personal Service</strong>
                    <small>Banking designed around you</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero account card */}
            <div className="hero-visual">
              <div className="floating-badge floating-badge-top">
                <span className="badge-check">✓</span>
                <div>
                  <strong>Secure Banking</strong>
                  <small>Protected account access</small>
                </div>
              </div>

              <div className="hero-bank-card">
                <div className="bank-card-decoration decoration-one" />
                <div className="bank-card-decoration decoration-two" />

                <div className="bank-card-header">
                  <div className="mini-bank-mark">M</div>

                  <div className="mini-bank-name">
                    <strong>MIDATLANTIC</strong>
                    <span>FEDERAL BANK</span>
                  </div>

                  <span className="card-type">DEBIT</span>
                </div>

                <div className="card-chip">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div className="card-number">
                  •••• &nbsp; •••• &nbsp; •••• &nbsp; 4827
                </div>

                <div className="bank-card-footer">
                  <div>
                    <small>CARDHOLDER</small>
                    <strong>YOUR NAME</strong>
                  </div>

                  <div>
                    <small>VALID THRU</small>
                    <strong>•• / ••</strong>
                  </div>
                </div>
              </div>

              <div className="account-preview">
                <div className="account-preview-top">
                  <div>
                    <small>ONLINE BANKING</small>
                    <strong>Everything in one place.</strong>
                  </div>

                  <span className="account-arrow">↗</span>
                </div>

                <div className="account-preview-lines">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="account-preview-bottom">
                  <span>Accounts</span>
                  <span>Transfers</span>
                  <span>Cards</span>
                </div>
              </div>

              <div className="floating-badge floating-badge-bottom">
                <span className="shield-icon">◆</span>
                <div>
                  <strong>Your security matters</strong>
                  <small>Stay protected online</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            QUICK ACCESS STRIP
        ========================================================= */}
        <section className="quick-access">
          <div className="site-container quick-access-grid">
            <a href="/login" className="quick-access-item">
              <div className="quick-icon">↗</div>
              <div>
                <strong>Online Banking</strong>
                <span>Access your account</span>
              </div>
              <span className="quick-arrow">→</span>
            </a>

            <a href="/signup" className="quick-access-item">
              <div className="quick-icon">+</div>
              <div>
                <strong>Open an Account</strong>
                <span>Start banking with us</span>
              </div>
              <span className="quick-arrow">→</span>
            </a>

            <a href="/contact" className="quick-access-item">
              <div className="quick-icon">☎</div>
              <div>
                <strong>Contact Us</strong>
                <span>We're here to help</span>
              </div>
              <span className="quick-arrow">→</span>
            </a>

            <a href="/news" className="quick-access-item">
              <div className="quick-icon">▤</div>
              <div>
                <strong>Banking News</strong>
                <span>Read our latest updates</span>
              </div>
              <span className="quick-arrow">→</span>
            </a>
          </div>
        </section>

        {/* =========================================================
            INTRODUCTION
        ========================================================= */}
        <section className="intro-section">
          <div className="site-container intro-grid">
            <div className="section-heading">
              <span className="section-kicker">BANK WITH CONFIDENCE</span>

              <h2>
                Modern banking with
                <span> a personal approach.</span>
              </h2>
            </div>

            <div className="intro-copy">
              <p>
                Your financial life deserves more than a complicated banking
                experience. MidAtlantic Federal Bank brings everyday banking
                services together in a simple, accessible experience.
              </p>

              <a href="#personal-banking" className="text-link">
                Explore our banking services
                <span>→</span>
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================
            PERSONAL BANKING
        ========================================================= */}
        <section id="personal-banking" className="services-section">
          <div className="site-container">
            <div className="section-top">
              <div>
                <span className="section-kicker">PERSONAL BANKING</span>

                <h2>
                  Banking for every
                  <span> stage of life.</span>
                </h2>
              </div>

              <p>
                Whether you're managing everyday spending or planning ahead,
                explore services designed to help you stay in control.
              </p>
            </div>

            <div className="service-grid">
              <article className="service-card service-card-featured">
                <div className="service-card-number">01</div>

                <div className="service-icon">
                  $
                </div>

                <h3>Checking Accounts</h3>

                <p>
                  Manage everyday spending with convenient access to your
                  account and online banking tools.
                </p>

                <a href="/signup">
                  Open an Account <span>→</span>
                </a>
              </article>

              <article className="service-card">
                <div className="service-card-number">02</div>

                <div className="service-icon">
                  ◫
                </div>

                <h3>Savings</h3>

                <p>
                  Keep your savings organized while working toward the goals
                  that matter to you.
                </p>

                <a href="/contact">
                  Learn More <span>→</span>
                </a>
              </article>

              <article className="service-card">
                <div className="service-card-number">03</div>

                <div className="service-icon">
                  ▣
                </div>

                <h3>Debit Cards</h3>

                <p>
                  Access your funds conveniently and manage your card through
                  your online banking experience.
                </p>

                <a href="/login">
                  Manage Your Card <span>→</span>
                </a>
              </article>

              <article className="service-card">
                <div className="service-card-number">04</div>

                <div className="service-icon">
                  ↗
                </div>

                <h3>Money Transfers</h3>

                <p>
                  Send funds and manage transfer requests through your secure
                  customer banking portal.
                </p>

                <a href="/login">
                  Sign In to Transfer <span>→</span>
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* =========================================================
            ONLINE BANKING FEATURE
        ========================================================= */}
        <section className="online-banking-section">
          <div className="site-container online-banking-grid">
            <div className="online-banking-visual">
              <div className="dashboard-window">
                <div className="dashboard-window-header">
                  <div className="window-brand">
                    <span className="window-logo">M</span>
                    <span>MidAtlantic</span>
                  </div>

                  <div className="window-user">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className="dashboard-window-body">
                  <div className="dashboard-welcome">
                    <div>
                      <small>WELCOME BACK</small>
                      <strong>Your banking, simplified.</strong>
                    </div>

                    <div className="dashboard-avatar">M</div>
                  </div>

                  <div className="balance-preview">
                    <small>AVAILABLE BALANCE</small>
                    <strong>$24,680.00</strong>
                    <span>Account ending •••• 4827</span>
                  </div>

                  <div className="dashboard-stat-grid">
                    <div>
                      <span className="stat-symbol">↗</span>
                      <small>Transfers</small>
                      <strong>Manage</strong>
                    </div>

                    <div>
                      <span className="stat-symbol">▣</span>
                      <small>Cards</small>
                      <strong>Manage</strong>
                    </div>

                    <div>
                      <span className="stat-symbol">▤</span>
                      <small>Activity</small>
                      <strong>View</strong>
                    </div>
                  </div>

                  <div className="dashboard-lines">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            </div>

            <div className="online-banking-content">
              <span className="section-kicker">ONLINE BANKING</span>

              <h2>
                Your bank.
                <span> Wherever you are.</span>
              </h2>

              <p>
                Stay connected to your accounts through a secure online
                banking experience designed for everyday convenience.
              </p>

              <div className="feature-list">
                <div className="feature-list-item">
                  <span className="feature-check">✓</span>
                  <div>
                    <strong>View your accounts</strong>
                    <p>Keep track of balances and account activity.</p>
                  </div>
                </div>

                <div className="feature-list-item">
                  <span className="feature-check">✓</span>
                  <div>
                    <strong>Manage transfers</strong>
                    <p>Submit transfer requests through your secure portal.</p>
                  </div>
                </div>

                <div className="feature-list-item">
                  <span className="feature-check">✓</span>
                  <div>
                    <strong>Manage your card</strong>
                    <p>Access your card information and card services.</p>
                  </div>
                </div>
              </div>

              <a href="/login" className="primary-button">
                Sign In to Online Banking
                <span>→</span>
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================
            BUSINESS BANKING
        ========================================================= */}
        <section id="business-banking" className="business-section">
          <div className="site-container business-grid">
            <div className="business-content">
              <span className="section-kicker">BUSINESS BANKING</span>

              <h2>
                Banking that helps
                <span> your business move forward.</span>
              </h2>

              <p>
                Your business deserves banking services that are organized,
                accessible, and designed to support the way you operate.
              </p>

              <div className="business-points">
                <div>
                  <span>01</span>
                  <strong>Business Accounts</strong>
                  <p>Organize your business finances with dedicated accounts.</p>
                </div>

                <div>
                  <span>02</span>
                  <strong>Business Payments</strong>
                  <p>Manage payment and transfer needs through banking services.</p>
                </div>

                <div>
                  <span>03</span>
                  <strong>Business Support</strong>
                  <p>Connect with our team when you need assistance.</p>
                </div>
              </div>

              <a href="/contact" className="outline-dark-button">
                Talk With Our Team
                <span>→</span>
              </a>
            </div>

            <div className="business-card">
              <div className="business-card-glow" />

              <div className="business-card-top">
                <span>BUSINESS BANKING</span>
                <span>MF</span>
              </div>

              <div className="business-card-main">
                <small>BUILT FOR BUSINESS</small>
                <h3>
                  Keep your
                  <br />
                  finances moving.
                </h3>
              </div>

              <div className="business-card-bottom">
                <span>Accounts</span>
                <span>Payments</span>
                <span>Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            LOANS
        ========================================================= */}
        <section id="loans" className="loans-section">
          <div className="site-container">
            <div className="loans-header">
              <div>
                <span className="section-kicker">LENDING SERVICES</span>

                <h2>
                  When you're ready
                  <span> for what's next.</span>
                </h2>
              </div>

              <p>
                Explore lending services and speak with our team about the
                options available for your financial goals.
              </p>
            </div>

            <div className="loan-grid">
              <article className="loan-card">
                <div className="loan-card-icon">⌂</div>
                <span>HOME</span>
                <h3>Home Financing</h3>
                <p>
                  Explore financing options for a home purchase or your next
                  property goal.
                </p>
                <a href="/contact">Learn More →</a>
              </article>

              <article className="loan-card loan-card-dark">
                <div className="loan-card-icon">◆</div>
                <span>PERSONAL</span>
                <h3>Personal Loans</h3>
                <p>
                  Talk with our team about personal borrowing needs and
                  available lending options.
                </p>
                <a href="/contact">Learn More →</a>
              </article>

              <article className="loan-card">
                <div className="loan-card-icon">▦</div>
                <span>BUSINESS</span>
                <h3>Business Lending</h3>
                <p>
                  Explore lending services designed around business needs and
                  financial plans.
                </p>
                <a href="/contact">Learn More →</a>
              </article>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECURITY
        ========================================================= */}
        <section id="security" className="security-section">
          <div className="site-container security-grid">
            <div className="security-visual">
              <div className="security-orbit orbit-one" />
              <div className="security-orbit orbit-two" />

              <div className="security-shield">
                <div className="shield-inner">
                  <span>✓</span>
                </div>
              </div>

              <div className="security-mini-card security-mini-one">
                <span>ACCESS</span>
                <strong>Protected</strong>
              </div>

              <div className="security-mini-card security-mini-two">
                <span>ACCOUNT</span>
                <strong>Secure</strong>
              </div>
            </div>

            <div className="security-content">
              <span className="section-kicker">SECURITY CENTER</span>

              <h2>
                Your security is
                <span> always important.</span>
              </h2>

              <p>
                Protecting your banking information starts with good security
                habits. We encourage customers to stay alert and protect their
                account credentials.
              </p>

              <div className="security-tips">
                <div className="security-tip">
                  <span>01</span>
                  <div>
                    <strong>Protect your credentials</strong>
                    <p>
                      Never share your password, PIN, or verification code with
                      another person.
                    </p>
                  </div>
                </div>

                <div className="security-tip">
                  <span>02</span>
                  <div>
                    <strong>Watch for suspicious messages</strong>
                    <p>
                      Be cautious of unexpected emails, calls, or messages
                      requesting sensitive information.
                    </p>
                  </div>
                </div>

                <div className="security-tip">
                  <span>03</span>
                  <div>
                    <strong>Use secure access</strong>
                    <p>
                      Always sign in through the official MidAtlantic Federal
                      Bank website.
                    </p>
                  </div>
                </div>
              </div>

              <a href="/security" className="text-link">
                Visit Security Center
                <span>→</span>
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================
            WHY MIDATLANTIC
        ========================================================= */}
        <section className="why-section">
          <div className="site-container">
            <div className="why-header">
              <span className="section-kicker">WHY MIDATLANTIC</span>

              <h2>
                Designed around the way
                <span> you bank.</span>
              </h2>

              <p>
                A straightforward banking experience with the tools and
                services you need for everyday financial management.
              </p>
            </div>

            <div className="why-grid">
              <div className="why-card">
                <div className="why-number">01</div>
                <div className="why-icon">◎</div>
                <h3>Clear &amp; Simple</h3>
                <p>
                  Banking services presented in a straightforward,
                  easy-to-understand experience.
                </p>
              </div>

              <div className="why-card">
                <div className="why-number">02</div>
                <div className="why-icon">◆</div>
                <h3>Security Focused</h3>
                <p>
                  Secure access and responsible account practices are central
                  to the banking experience.
                </p>
              </div>

              <div className="why-card">
                <div className="why-number">03</div>
                <div className="why-icon">↗</div>
                <h3>Connected Banking</h3>
                <p>
                  Manage your banking relationship through an accessible
                  online customer portal.
                </p>
              </div>

              <div className="why-card">
                <div className="why-number">04</div>
                <div className="why-icon">♡</div>
                <h3>Personal Service</h3>
                <p>
                  When you need help, connect with the bank and get support
                  for your banking needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            NEWS
        ========================================================= */}
        <section className="news-section">
          <div className="site-container">
            <div className="news-heading">
              <div>
                <span className="section-kicker">BANKING INSIGHTS</span>

                <h2>
                  Stay informed.
                  <span> Stay connected.</span>
                </h2>
              </div>

              <a href="/news" className="text-link">
                View All News
                <span>→</span>
              </a>
            </div>

            <div className="news-grid">
              <article className="news-card news-card-featured">
                <div className="news-card-image news-image-one">
                  <span>FINANCIAL EDUCATION</span>
                </div>

                <div className="news-card-content">
                  <small>Banking Insights</small>

                  <h3>
                    Building stronger everyday financial habits.
                  </h3>

                  <p>
                    Practical information to help you stay organized and
                    informed about your finances.
                  </p>

                  <a href="/news">
                    Read Article <span>→</span>
                  </a>
                </div>
              </article>

              <article className="news-card">
                <div className="news-card-image news-image-two">
                  <span>SECURITY</span>
                </div>

                <div className="news-card-content">
                  <small>Security Center</small>

                  <h3>
                    Simple ways to protect your online banking access.
                  </h3>

                  <p>
                    Learn the basic security practices every online banking
                    customer should know.
                  </p>

                  <a href="/security">
                    Security Tips <span>→</span>
                  </a>
                </div>
              </article>

              <article className="news-card">
                <div className="news-card-image news-image-three">
                  <span>COMMUNITY</span>
                </div>

                <div className="news-card-content">
                  <small>MidAtlantic Federal Bank</small>

                  <h3>
                    Keeping you connected to your bank.
                  </h3>

                  <p>
                    Explore banking information, service updates, and ways to
                    stay connected.
                  </p>

                  <a href="/news">
                    Explore News <span>→</span>
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* =========================================================
            FINAL CTA
        ========================================================= */}
        <section className="final-cta">
          <div className="final-cta-pattern pattern-one" />
          <div className="final-cta-pattern pattern-two" />

          <div className="site-container final-cta-inner">
            <div>
              <span className="section-kicker light-kicker">
                START BANKING TODAY
              </span>

              <h2>
                Your financial journey.
                <span> Your bank.</span>
              </h2>

              <p>
                Open an account or sign in to manage your banking online.
              </p>
            </div>

            <div className="final-cta-actions">
              <a href="/signup" className="white-button">
                Open an Account
                <span>→</span>
              </a>

              <a href="/login" className="transparent-button">
                Sign In
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================
            FOOTER
        ========================================================= */}
        <footer className="site-footer">
          <div className="site-container">
            <div className="footer-main">
              <div className="footer-brand-column">
                <a href="/" className="footer-brand">
                  <div className="footer-brand-mark">
                    <span>M</span>
                  </div>

                  <div>
                    <strong>MIDATLANTIC</strong>
                    <span>FEDERAL BANK</span>
                  </div>
                </a>

                <p>
                  Banking designed around clarity, access, security, and
                  service.
                </p>

                <div className="footer-secure">
                  <span>✓</span>
                  <div>
                    <strong>Secure Banking</strong>
                    <small>Your security matters to us.</small>
                  </div>
                </div>
              </div>

              <div className="footer-column">
                <h4>Banking</h4>
                <a href="#personal-banking">Personal Banking</a>
                <a href="#business-banking">Business Banking</a>
                <a href="#loans">Loans</a>
                <a href="/signup">Open an Account</a>
                <a href="/login">Online Banking</a>
              </div>

              <div className="footer-column">
                <h4>Resources</h4>
                <a href="/news">Banking News</a>
                <a href="/security">Security Center</a>
                <a href="/contact">Contact Us</a>
                <a href="/faq">FAQs</a>
              </div>

              <div className="footer-column footer-contact">
                <h4>Contact</h4>

                <a href="/contact">
                  Customer Support
                </a>

                <a href="mailto:midfb@outlook.com">
                  midfb@outlook.com
                </a>

                <span>
                  Mon – Fri
                  <br />
                  Customer service hours
                </span>
              </div>
            </div>

            <div className="footer-bottom">
              <div>
                © {new Date().getFullYear()} MidAtlantic Federal Bank. All
                rights reserved.
              </div>

              <div className="footer-legal">
                <a href="/privacy">Privacy</a>
                <a href="/terms">Terms</a>
                <a href="/security">Security</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* =========================================================
          GLOBAL PAGE STYLES
      ========================================================= */}
      <style jsx global>{`
        :root {
          --navy: #071a33;
          --navy-deep: #041225;
          --blue: #123f72;
          --blue-bright: #1e5b98;
          --blue-soft: #eaf2f9;
          --gold: #c9a85d;
          --gold-light: #e4c983;
          --white: #ffffff;
          --off-white: #f6f8fb;
          --text: #152238;
          --muted: #667085;
          --border: #dfe5ec;
          --shadow: 0 24px 60px rgba(5, 25, 48, 0.12);
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          color: var(--text);
          background: var(--white);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
        }

        .home-page {
          min-height: 100vh;
          overflow: hidden;
          background: #fff;
        }

        .site-container {
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
        }

        /* =========================================================
           SECURITY BAR
        ========================================================= */

        .security-bar {
          background: #041225;
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
        }

        .security-bar-inner {
          min-height: 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .security-message,
        .security-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .security-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #5fcf91;
          box-shadow: 0 0 0 4px rgba(95, 207, 145, 0.08);
        }

        .security-links {
          gap: 10px;
        }

        .security-links a {
          color: rgba(255, 255, 255, 0.72);
          transition: color 0.2s ease;
        }

        .security-links a:hover {
          color: #fff;
        }

        .security-divider {
          opacity: 0.3;
        }

        /* =========================================================
           HEADER
        ========================================================= */

        .main-header {
          position: relative;
          z-index: 20;
          background: rgba(255, 255, 255, 0.96);
          border-bottom: 1px solid rgba(15, 45, 78, 0.08);
        }

        .header-inner {
          min-height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .brand-mark {
          width: 45px;
          height: 45px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: 1px solid rgba(201, 168, 93, 0.65);
          background: var(--navy);
          color: white;
          line-height: 1;
          position: relative;
        }

        .brand-mark::after {
          content: "";
          position: absolute;
          inset: 4px;
          border: 1px solid rgba(228, 201, 131, 0.35);
        }

        .brand-mark-top {
          font-size: 19px;
          font-weight: 800;
          z-index: 1;
        }

        .brand-mark-bottom {
          font-size: 7px;
          letter-spacing: 1px;
          color: var(--gold-light);
          z-index: 1;
        }

        .brand-copy {
          display: flex;
          flex-direction: column;
          line-height: 1.05;
        }

        .brand-copy strong {
          font-size: 14px;
          letter-spacing: 1.8px;
          color: var(--navy);
        }

        .brand-copy span {
          margin-top: 4px;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 2.6px;
          color: #8a6e35;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 26px;
          margin-left: auto;
        }

        .desktop-nav a {
          position: relative;
          padding: 32px 0;
          color: #445268;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          transition: color 0.2s ease;
        }

        .desktop-nav a::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 22px;
          height: 2px;
          background: var(--gold);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.2s ease;
        }

        .desktop-nav a:hover {
          color: var(--navy);
        }

        .desktop-nav a:hover::after {
          transform: scaleX(1);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .login-link {
          font-size: 13px;
          font-weight: 700;
          color: var(--navy);
          white-space: nowrap;
        }

        .header-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 18px;
          border-radius: 3px;
          background: var(--navy);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .header-button:hover {
          background: var(--blue);
          transform: translateY(-1px);
        }

        /* =========================================================
           HERO
        ========================================================= */

        .hero {
          position: relative;
          background:
            radial-gradient(
              circle at 85% 20%,
              rgba(42, 95, 145, 0.32),
              transparent 30%
            ),
            linear-gradient(135deg, #06172c 0%, #09284a 52%, #0b355d 100%);
          color: #fff;
          overflow: hidden;
        }

        .hero::before {
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
          background-size: 50px 50px;
          mask-image: linear-gradient(to right, black, transparent);
        }

        .hero-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(1px);
          pointer-events: none;
        }

        .hero-glow-one {
          width: 450px;
          height: 450px;
          right: -150px;
          top: -160px;
          background: rgba(201, 168, 93, 0.09);
        }

        .hero-glow-two {
          width: 300px;
          height: 300px;
          left: 30%;
          bottom: -230px;
          background: rgba(63, 132, 196, 0.12);
        }

        .hero-grid {
          position: relative;
          z-index: 1;
          min-height: 625px;
          display: grid;
          grid-template-columns: 1.02fr 0.98fr;
          align-items: center;
          gap: 50px;
          padding-top: 78px;
          padding-bottom: 78px;
        }

        .hero-content {
          max-width: 620px;
        }

        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
          color: var(--gold-light);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2.1px;
          text-transform: uppercase;
        }

        .eyebrow-line {
          width: 38px;
          height: 1px;
          background: var(--gold);
        }

        .hero h1 {
          margin: 0;
          max-width: 650px;
          font-size: clamp(45px, 5.3vw, 72px);
          line-height: 0.98;
          letter-spacing: -3px;
          font-weight: 700;
        }

        .hero h1 span {
          display: block;
          color: #d9e5f0;
          font-weight: 400;
        }

        .hero-description {
          max-width: 570px;
          margin: 28px 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 16px;
          line-height: 1.8;
        }

        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: 34px;
        }

        .primary-button,
        .outline-button,
        .white-button,
        .transparent-button {
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 22px;
          padding: 0 21px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.1px;
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .primary-button {
          background: var(--gold);
          color: #101c2a;
        }

        .primary-button:hover {
          background: var(--gold-light);
          transform: translateY(-2px);
        }

        .outline-button {
          border: 1px solid rgba(255, 255, 255, 0.28);
          color: #fff;
          background: rgba(255, 255, 255, 0.03);
        }

        .outline-button:hover {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }

        .hero-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
          margin-top: 42px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .trust-icon {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(228, 201, 131, 0.45);
          color: var(--gold-light);
          font-size: 10px;
        }

        .trust-item div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .trust-item strong {
          font-size: 11px;
          color: #fff;
        }

        .trust-item small {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.52);
        }

        .hero-visual {
          position: relative;
          min-height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-bank-card {
          position: relative;
          z-index: 3;
          width: min(455px, 90%);
          aspect-ratio: 1.62;
          padding: 29px;
          overflow: hidden;
          border-radius: 17px;
          background:
            radial-gradient(
              circle at 82% 22%,
              rgba(255, 255, 255, 0.16),
              transparent 24%
            ),
            linear-gradient(135deg, #173e65, #09243f);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow:
            0 35px 80px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transform: rotate(4deg);
        }

        .bank-card-decoration {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .decoration-one {
          width: 320px;
          height: 320px;
          right: -130px;
          top: -160px;
        }

        .decoration-two {
          width: 250px;
          height: 250px;
          left: -150px;
          bottom: -140px;
        }

        .bank-card-header {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .mini-bank-mark {
          width: 33px;
          height: 33px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(228, 201, 131, 0.6);
          color: var(--gold-light);
          font-size: 15px;
          font-weight: 800;
        }

        .mini-bank-name {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .mini-bank-name strong {
          font-size: 9px;
          letter-spacing: 1.1px;
        }

        .mini-bank-name span {
          margin-top: 3px;
          font-size: 5px;
          letter-spacing: 1.4px;
          color: var(--gold-light);
        }

        .card-type {
          margin-left: auto;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.6px;
          color: rgba(255, 255, 255, 0.65);
        }

        .card-chip {
          position: relative;
          z-index: 2;
          width: 48px;
          height: 37px;
          margin-top: 47px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-radius: 7px;
          overflow: hidden;
          background: #c5a45d;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3);
        }

        .card-chip span {
          border: 1px solid rgba(80, 53, 10, 0.35);
        }

        .card-number {
          position: relative;
          z-index: 2;
          margin-top: 22px;
          font-size: clamp(17px, 2.1vw, 24px);
          font-weight: 500;
          letter-spacing: 2.8px;
          color: rgba(255, 255, 255, 0.9);
        }

        .bank-card-footer {
          position: absolute;
          z-index: 2;
          left: 29px;
          right: 29px;
          bottom: 27px;
          display: flex;
          justify-content: space-between;
        }

        .bank-card-footer div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .bank-card-footer small {
          font-size: 6px;
          letter-spacing: 1.3px;
          color: rgba(255, 255, 255, 0.45);
        }

        .bank-card-footer strong {
          font-size: 9px;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.84);
        }

        .account-preview {
          position: absolute;
          z-index: 2;
          width: 315px;
          right: 4%;
          bottom: 3%;
          padding: 19px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 10px;
          background: rgba(5, 24, 43, 0.9);
          backdrop-filter: blur(14px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
        }

        .account-preview-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .account-preview-top div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .account-preview-top small {
          color: var(--gold-light);
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .account-preview-top strong {
          color: white;
          font-size: 11px;
        }

        .account-arrow {
          color: var(--gold-light);
          font-size: 20px;
        }

        .account-preview-lines {
          display: grid;
          gap: 7px;
          margin: 19px 0;
        }

        .account-preview-lines span {
          height: 5px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.09);
        }

        .account-preview-lines span:nth-child(1) {
          width: 88%;
        }

        .account-preview-lines span:nth-child(2) {
          width: 66%;
        }

        .account-preview-lines span:nth-child(3) {
          width: 76%;
        }

        .account-preview-bottom {
          display: flex;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.45);
          font-size: 8px;
        }

        .floating-badge {
          position: absolute;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(15px);
          box-shadow: 0 16px 35px rgba(0, 0, 0, 0.18);
        }

        .floating-badge-top {
          top: 24px;
          right: -5px;
        }

        .floating-badge-bottom {
          left: -8px;
          bottom: 62px;
        }

        .badge-check,
        .shield-icon {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: rgba(201, 168, 93, 0.16);
          color: var(--gold-light);
          font-size: 11px;
        }

        .floating-badge div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .floating-badge strong {
          font-size: 9px;
          color: #fff;
        }

        .floating-badge small {
          font-size: 8px;
          color: rgba(255, 255, 255, 0.5);
        }

        /* =========================================================
           QUICK ACCESS
        ========================================================= */

        .quick-access {
          position: relative;
          z-index: 5;
          margin-top: -1px;
          background: #fff;
          border-bottom: 1px solid var(--border);
        }

        .quick-access-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }

        .quick-access-item {
          min-height: 96px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 17px 20px;
          border-right: 1px solid var(--border);
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .quick-access-item:first-child {
          border-left: 1px solid var(--border);
        }

        .quick-access-item:hover {
          background: #f7f9fc;
        }

        .quick-icon {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border: 1px solid #d8e0e9;
          color: var(--blue);
          font-size: 13px;
        }

        .quick-access-item div:nth-child(2) {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .quick-access-item strong {
          font-size: 11px;
          color: var(--navy);
        }

        .quick-access-item span {
          font-size: 9px;
          color: var(--muted);
        }

        .quick-arrow {
          margin-left: auto;
          color: #98a3b1;
          font-size: 14px;
        }

        /* =========================================================
           GENERAL SECTIONS
        ========================================================= */

        .section-kicker {
          display: inline-block;
          color: #8a6e35;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .section-heading h2,
        .section-top h2,
        .loans-header h2,
        .online-banking-content h2,
        .business-content h2,
        .security-content h2,
        .why-header h2,
        .news-heading h2 {
          margin: 12px 0 0;
          color: var(--navy);
          font-size: clamp(33px, 4vw, 49px);
          line-height: 1.04;
          letter-spacing: -1.8px;
          font-weight: 700;
        }

        .section-heading h2 span,
        .section-top h2 span,
        .loans-header h2 span,
        .online-banking-content h2 span,
        .business-content h2 span,
        .security-content h2 span,
        .why-header h2 span,
        .news-heading h2 span {
          color: #7d8da1;
          font-weight: 400;
        }

        .text-link {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          color: var(--blue);
          font-size: 12px;
          font-weight: 800;
        }

        .text-link span {
          transition: transform 0.2s ease;
        }

        .text-link:hover span {
          transform: translateX(4px);
        }

        /* =========================================================
           INTRO
        ========================================================= */

        .intro-section {
          padding: 105px 0 95px;
          background: #fff;
        }

        .intro-grid {
          display: grid;
          grid-template-columns: 1fr 0.8fr;
          gap: 90px;
          align-items: end;
        }

        .intro-copy {
          max-width: 480px;
        }

        .intro-copy p {
          margin: 0 0 24px;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.9;
        }

        /* =========================================================
           SERVICES
        ========================================================= */

        .services-section {
          padding: 95px 0 110px;
          background: var(--off-white);
        }

        .section-top {
          display: grid;
          grid-template-columns: 1fr 0.65fr;
          align-items: end;
          gap: 60px;
          margin-bottom: 48px;
        }

        .section-top > p {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.8;
        }

        .service-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--border);
          border-left: 1px solid var(--border);
        }

        .service-card {
          position: relative;
          min-height: 325px;
          padding: 30px;
          background: #fff;
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .service-card:hover {
          z-index: 2;
          transform: translateY(-6px);
          box-shadow: var(--shadow);
        }

        .service-card-featured {
          background: var(--navy);
          color: #fff;
        }

        .service-card-number {
          position: absolute;
          top: 28px;
          right: 28px;
          color: #9aa7b7;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .service-card-featured .service-card-number {
          color: rgba(255, 255, 255, 0.3);
        }

        .service-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          margin-bottom: 70px;
          border: 1px solid #d6dee7;
          color: var(--blue);
          font-size: 16px;
          font-weight: 700;
        }

        .service-card-featured .service-icon {
          border-color: rgba(255, 255, 255, 0.22);
          color: var(--gold-light);
        }

        .service-card h3 {
          margin: 0;
          font-size: 19px;
          letter-spacing: -0.3px;
        }

        .service-card p {
          min-height: 67px;
          margin: 12px 0 20px;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.7;
        }

        .service-card-featured p {
          color: rgba(255, 255, 255, 0.62);
        }

        .service-card a {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: var(--blue);
          font-size: 11px;
          font-weight: 800;
        }

        .service-card-featured a {
          color: var(--gold-light);
        }

        /* =========================================================
           ONLINE BANKING
        ========================================================= */

        .online-banking-section {
          padding: 120px 0;
          background: #fff;
        }

        .online-banking-grid {
          display: grid;
          grid-template-columns: 1fr 0.85fr;
          align-items: center;
          gap: 110px;
        }

        .online-banking-visual {
          position: relative;
          min-height: 490px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(
              circle at 30% 30%,
              rgba(30, 91, 152, 0.2),
              transparent 35%
            ),
            #edf3f8;
          overflow: hidden;
        }

        .online-banking-visual::before {
          content: "";
          position: absolute;
          width: 380px;
          height: 380px;
          border: 1px solid rgba(18, 63, 114, 0.08);
          border-radius: 50%;
        }

        .dashboard-window {
          position: relative;
          z-index: 2;
          width: min(430px, 83%);
          min-height: 390px;
          overflow: hidden;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 30px 70px rgba(8, 31, 55, 0.17);
        }

        .dashboard-window-header {
          height: 51px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          background: var(--navy);
          color: #fff;
        }

        .window-brand {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 9px;
          font-weight: 700;
        }

        .window-logo {
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.35);
          color: var(--gold-light);
          font-size: 10px;
        }

        .window-user {
          display: flex;
          gap: 4px;
        }

        .window-user span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.45);
        }

        .dashboard-window-body {
          padding: 22px;
        }

        .dashboard-welcome {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dashboard-welcome div:first-child {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dashboard-welcome small {
          color: #9aa6b5;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .dashboard-welcome strong {
          color: var(--navy);
          font-size: 13px;
        }

        .dashboard-avatar {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #e8eff6;
          color: var(--blue);
          font-size: 10px;
          font-weight: 800;
        }

        .balance-preview {
          margin-top: 20px;
          padding: 19px;
          border-radius: 6px;
          background: var(--navy);
          color: #fff;
        }

        .balance-preview small {
          display: block;
          color: rgba(255, 255, 255, 0.5);
          font-size: 7px;
          letter-spacing: 1px;
        }

        .balance-preview strong {
          display: block;
          margin: 8px 0 5px;
          font-size: 25px;
          letter-spacing: -1px;
        }

        .balance-preview span {
          color: rgba(255, 255, 255, 0.45);
          font-size: 7px;
        }

        .dashboard-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 12px;
        }

        .dashboard-stat-grid > div {
          padding: 12px;
          border: 1px solid #e4e9ef;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .stat-symbol {
          color: var(--blue);
          font-size: 12px;
        }

        .dashboard-stat-grid small {
          color: #9aa6b5;
          font-size: 7px;
        }

        .dashboard-stat-grid strong {
          color: var(--navy);
          font-size: 9px;
        }

        .dashboard-lines {
          display: grid;
          gap: 9px;
          margin-top: 20px;
        }

        .dashboard-lines span {
          height: 6px;
          background: #edf1f5;
          border-radius: 10px;
        }

        .dashboard-lines span:nth-child(1) {
          width: 94%;
        }

        .dashboard-lines span:nth-child(2) {
          width: 78%;
        }

        .dashboard-lines span:nth-child(3) {
          width: 88%;
        }

        .dashboard-lines span:nth-child(4) {
          width: 68%;
        }

        .online-banking-content > p,
        .business-content > p,
        .security-content > p {
          max-width: 500px;
          margin: 25px 0 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.85;
        }

        .feature-list {
          margin: 30px 0 34px;
          border-top: 1px solid var(--border);
        }

        .feature-list-item {
          display: flex;
          gap: 13px;
          padding: 16px 0;
          border-bottom: 1px solid var(--border);
        }

        .feature-check {
          width: 25px;
          height: 25px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          background: #edf4fa;
          color: var(--blue);
          font-size: 10px;
          font-weight: 800;
        }

        .feature-list-item div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .feature-list-item strong {
          color: var(--navy);
          font-size: 11px;
        }

        .feature-list-item p {
          margin: 0;
          color: var(--muted);
          font-size: 10px;
          line-height: 1.5;
        }

        /* =========================================================
           BUSINESS
        ========================================================= */

        .business-section {
          padding: 110px 0;
          background: var(--off-white);
        }

        .business-grid {
          display: grid;
          grid-template-columns: 1fr 0.78fr;
          align-items: center;
          gap: 100px;
        }

        .business-points {
          margin: 31px 0;
          border-top: 1px solid var(--border);
        }

        .business-points > div {
          position: relative;
          display: grid;
          grid-template-columns: 40px 1fr;
          gap: 9px;
          padding: 17px 0;
          border-bottom: 1px solid var(--border);
        }

        .business-points span {
          color: #9aa6b5;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .business-points strong {
          color: var(--navy);
          font-size: 12px;
        }

        .business-points p {
          grid-column: 2;
          margin: -2px 0 0;
          color: var(--muted);
          font-size: 10px;
          line-height: 1.5;
        }

        .outline-dark-button {
          display: inline-flex;
          align-items: center;
          gap: 20px;
          min-height: 48px;
          padding: 0 19px;
          border: 1px solid #cbd5e0;
          color: var(--navy);
          font-size: 11px;
          font-weight: 800;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .outline-dark-button:hover {
          background: #fff;
          transform: translateY(-2px);
        }

        .business-card {
          position: relative;
          min-height: 455px;
          padding: 31px;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 80% 15%,
              rgba(201, 168, 93, 0.13),
              transparent 30%
            ),
            linear-gradient(145deg, #07192e, #0c3760);
          color: #fff;
          box-shadow: 0 30px 60px rgba(7, 26, 51, 0.18);
        }

        .business-card::before {
          content: "";
          position: absolute;
          width: 500px;
          height: 500px;
          right: -260px;
          bottom: -270px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 50%;
        }

        .business-card::after {
          content: "";
          position: absolute;
          width: 350px;
          height: 350px;
          right: -175px;
          bottom: -185px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 50%;
        }

        .business-card-top,
        .business-card-bottom {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          color: rgba(255, 255, 255, 0.54);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        .business-card-top span:last-child {
          color: var(--gold-light);
          font-size: 15px;
        }

        .business-card-main {
          position: absolute;
          z-index: 2;
          left: 31px;
          bottom: 100px;
        }

        .business-card-main small {
          color: var(--gold-light);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .business-card-main h3 {
          margin: 12px 0 0;
          font-size: 42px;
          line-height: 1.05;
          letter-spacing: -1.5px;
          font-weight: 500;
        }

        .business-card-bottom {
          position: absolute;
          left: 31px;
          right: 31px;
          bottom: 31px;
          padding-top: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        /* =========================================================
           LOANS
        ========================================================= */

        .loans-section {
          padding: 110px 0;
          background: #fff;
        }

        .loans-header {
          display: grid;
          grid-template-columns: 1fr 0.6fr;
          gap: 80px;
          align-items: end;
          margin-bottom: 48px;
        }

        .loans-header > p {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.8;
        }

        .loan-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .loan-card {
          min-height: 320px;
          padding: 30px;
          border: 1px solid var(--border);
          background: #fff;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .loan-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow);
        }

        .loan-card-dark {
          border-color: var(--navy);
          background: var(--navy);
          color: #fff;
        }

        .loan-card-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          margin-bottom: 52px;
          border: 1px solid #d5dee8;
          color: var(--blue);
          font-size: 15px;
        }

        .loan-card-dark .loan-card-icon {
          border-color: rgba(255, 255, 255, 0.2);
          color: var(--gold-light);
        }

        .loan-card > span {
          color: #9ba6b3;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .loan-card h3 {
          margin: 8px 0 10px;
          font-size: 21px;
        }

        .loan-card p {
          min-height: 62px;
          margin: 0 0 19px;
          color: var(--muted);
          font-size: 11px;
          line-height: 1.7;
        }

        .loan-card-dark p {
          color: rgba(255, 255, 255, 0.6);
        }

        .loan-card a {
          color: var(--blue);
          font-size: 11px;
          font-weight: 800;
        }

        .loan-card-dark a {
          color: var(--gold-light);
        }

        /* =========================================================
           SECURITY
        ========================================================= */

        .security-section {
          padding: 120px 0;
          background: #f3f6f9;
        }

        .security-grid {
          display: grid;
          grid-template-columns: 0.8fr 1fr;
          gap: 105px;
          align-items: center;
        }

        .security-visual {
          position: relative;
          min-height: 430px;
          display: grid;
          place-items: center;
        }

        .security-orbit {
          position: absolute;
          border: 1px solid rgba(18, 63, 114, 0.12);
          border-radius: 50%;
        }

        .orbit-one {
          width: 300px;
          height: 300px;
        }

        .orbit-two {
          width: 410px;
          height: 410px;
        }

        .security-shield {
          position: relative;
          z-index: 2;
          width: 170px;
          height: 195px;
          display: grid;
          place-items: center;
          clip-path: polygon(
            50% 0%,
            88% 16%,
            88% 58%,
            77% 77%,
            50% 100%,
            23% 77%,
            12% 58%,
            12% 16%
          );
          background: linear-gradient(145deg, var(--navy), #185186);
          box-shadow: 0 30px 60px rgba(9, 40, 74, 0.2);
        }

        .shield-inner {
          width: 86px;
          height: 100px;
          display: grid;
          place-items: center;
          clip-path: inherit;
          background: rgba(255, 255, 255, 0.08);
          color: var(--gold-light);
          font-size: 28px;
        }

        .security-mini-card {
          position: absolute;
          z-index: 3;
          padding: 12px 15px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          border: 1px solid #dce3ea;
          background: #fff;
          box-shadow: 0 16px 35px rgba(10, 34, 59, 0.1);
        }

        .security-mini-card span {
          color: #9aa6b5;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .security-mini-card strong {
          color: var(--navy);
          font-size: 10px;
        }

        .security-mini-one {
          top: 57px;
          left: 10%;
        }

        .security-mini-two {
          right: 5%;
          bottom: 57px;
        }

        .security-tips {
          margin: 32px 0 25px;
          border-top: 1px solid var(--border);
        }

        .security-tip {
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 11px;
          padding: 15px 0;
          border-bottom: 1px solid var(--border);
        }

        .security-tip > span {
          color: #9aa6b5;
          font-size: 9px;
          font-weight: 800;
        }

        .security-tip div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .security-tip strong {
          color: var(--navy);
          font-size: 11px;
        }

        .security-tip p {
          margin: 0;
          color: var(--muted);
          font-size: 10px;
          line-height: 1.6;
        }

        /* =========================================================
           WHY
        ========================================================= */

        .why-section {
          padding: 110px 0;
          background: #fff;
        }

        .why-header {
          max-width: 650px;
          margin-bottom: 50px;
        }

        .why-header > p {
          max-width: 530px;
          margin: 21px 0 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.8;
        }

        .why-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--border);
          border-left: 1px solid var(--border);
        }

        .why-card {
          position: relative;
          min-height: 255px;
          padding: 28px;
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }

        .why-number {
          position: absolute;
          top: 28px;
          right: 28px;
          color: #aab3be;
          font-size: 9px;
          font-weight: 800;
        }

        .why-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          margin-bottom: 55px;
          background: #f0f5f9;
          color: var(--blue);
          font-size: 14px;
        }

        .why-card h3 {
          margin: 0 0 9px;
          color: var(--navy);
          font-size: 16px;
        }

        .why-card p {
          margin: 0;
          color: var(--muted);
          font-size: 10px;
          line-height: 1.7;
        }

        /* =========================================================
           NEWS
        ========================================================= */

        .news-section {
          padding: 105px 0 115px;
          background: var(--off-white);
        }

        .news-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 40px;
          margin-bottom: 46px;
        }

        .news-grid {
          display: grid;
          grid-template-columns: 1.35fr 1fr 1fr;
          gap: 16px;
        }

        .news-card {
          overflow: hidden;
          border: 1px solid var(--border);
          background: #fff;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .news-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow);
        }

        .news-card-image {
          position: relative;
          height: 170px;
          display: flex;
          align-items: flex-end;
          padding: 18px;
          overflow: hidden;
        }

        .news-card-image::before,
        .news-card-image::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.13);
        }

        .news-card-image::before {
          width: 280px;
          height: 280px;
          right: -110px;
          top: -140px;
        }

        .news-card-image::after {
          width: 180px;
          height: 180px;
          left: -70px;
          bottom: -100px;
        }

        .news-image-one {
          background: linear-gradient(145deg, #163f67, #09233d);
        }

        .news-image-two {
          background: linear-gradient(145deg, #274b68, #142d45);
        }

        .news-image-three {
          background: linear-gradient(145deg, #1c4969, #0b2945);
        }

        .news-card-image span {
          position: relative;
          z-index: 2;
          color: rgba(255, 255, 255, 0.7);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        .news-card-content {
          padding: 23px;
        }

        .news-card-content small {
          color: #8a6e35;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .news-card-content h3 {
          min-height: 55px;
          margin: 9px 0 10px;
          color: var(--navy);
          font-size: 18px;
          line-height: 1.2;
          letter-spacing: -0.4px;
        }

        .news-card-content p {
          min-height: 54px;
          margin: 0 0 20px;
          color: var(--muted);
          font-size: 10px;
          line-height: 1.7;
        }

        .news-card-content a {
          color: var(--blue);
          font-size: 10px;
          font-weight: 800;
        }

        /* =========================================================
           FINAL CTA
        ========================================================= */

        .final-cta {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #07192e, #0c3760);
          color: #fff;
        }

        .final-cta-pattern {
          position: absolute;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 50%;
        }

        .pattern-one {
          width: 500px;
          height: 500px;
          right: -230px;
          top: -270px;
        }

        .pattern-two {
          width: 330px;
          height: 330px;
          left: -170px;
          bottom: -190px;
        }

        .final-cta-inner {
          position: relative;
          z-index: 2;
          min-height: 315px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 50px;
        }

        .light-kicker {
          color: var(--gold-light);
        }

        .final-cta h2 {
          max-width: 650px;
          margin: 12px 0 0;
          font-size: clamp(35px, 4vw, 52px);
          line-height: 1;
          letter-spacing: -2px;
        }

        .final-cta h2 span {
          display: block;
          color: rgba(255, 255, 255, 0.55);
          font-weight: 400;
        }

        .final-cta p {
          margin: 18px 0 0;
          color: rgba(255, 255, 255, 0.62);
          font-size: 13px;
        }

        .final-cta-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          flex-shrink: 0;
        }

        .white-button {
          background: #fff;
          color: var(--navy);
        }

        .white-button:hover {
          transform: translateY(-2px);
          background: #f4f7fa;
        }

        .transparent-button {
          border: 1px solid rgba(255, 255, 255, 0.27);
          color: #fff;
        }

        .transparent-button:hover {
          background: rgba(255, 255, 255, 0.07);
          transform: translateY(-2px);
        }

        /* =========================================================
           FOOTER
        ========================================================= */

        .site-footer {
          background: #031123;
          color: #fff;
        }

        .footer-main {
          display: grid;
          grid-template-columns: 1.6fr 0.8fr 0.8fr 1fr;
          gap: 65px;
          padding: 70px 0 60px;
        }

        .footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
        }

        .footer-brand-mark {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(228, 201, 131, 0.55);
          color: var(--gold-light);
          font-size: 17px;
          font-weight: 800;
        }

        .footer-brand > div:last-child {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .footer-brand strong {
          font-size: 12px;
          letter-spacing: 1.7px;
        }

        .footer-brand span {
          margin-top: 4px;
          color: var(--gold-light);
          font-size: 7px;
          letter-spacing: 2.3px;
        }

        .footer-brand-column > p {
          max-width: 300px;
          margin: 19px 0;
          color: rgba(255, 255, 255, 0.47);
          font-size: 11px;
          line-height: 1.7;
        }

        .footer-secure {
          display: flex;
          align-items: center;
          gap: 9px;
          padding-top: 17px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .footer-secure > span {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(228, 201, 131, 0.35);
          color: var(--gold-light);
          font-size: 9px;
        }

        .footer-secure div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .footer-secure strong {
          font-size: 9px;
        }

        .footer-secure small {
          color: rgba(255, 255, 255, 0.38);
          font-size: 8px;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 11px;
        }

        .footer-column h4 {
          margin: 0 0 8px;
          color: var(--gold-light);
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .footer-column a,
        .footer-column span {
          color: rgba(255, 255, 255, 0.52);
          font-size: 10px;
          line-height: 1.6;
          transition: color 0.2s ease;
        }

        .footer-column a:hover {
          color: #fff;
        }

        .footer-contact span {
          margin-top: 6px;
        }

        .footer-bottom {
          min-height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.35);
          font-size: 9px;
        }

        .footer-legal {
          display: flex;
          gap: 18px;
        }

        .footer-legal a {
          transition: color 0.2s ease;
        }

        .footer-legal a:hover {
          color: #fff;
        }

        /* =========================================================
           RESPONSIVE — TABLET
        ========================================================= */

        @media (max-width: 1080px) {
          .desktop-nav {
            gap: 16px;
          }

          .desktop-nav a {
            font-size: 12px;
          }

          .header-actions {
            gap: 11px;
          }

          .hero-grid {
            gap: 30px;
          }

          .service-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .online-banking-grid,
          .business-grid,
          .security-grid {
            gap: 60px;
          }

          .why-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-main {
            grid-template-columns: 1.4fr 1fr 1fr;
          }

          .footer-contact {
            grid-column: 2 / 4;
          }
        }

        /* =========================================================
           RESPONSIVE — MOBILE
        ========================================================= */

        @media (max-width: 820px) {
          .site-container {
            width: min(100% - 32px, 650px);
          }

          .security-bar-inner {
            justify-content: center;
          }

          .security-links {
            display: none;
          }

          .header-inner {
            min-height: 72px;
          }

          .desktop-nav {
            display: none;
          }

          .header-actions {
            margin-left: auto;
          }

          .login-link {
            display: none;
          }

          .header-button {
            min-height: 39px;
            padding: 0 13px;
            font-size: 10px;
          }

          .brand-mark {
            width: 40px;
            height: 40px;
          }

          .brand-copy strong {
            font-size: 12px;
          }

          .brand-copy span {
            font-size: 7px;
          }

          .hero-grid {
            grid-template-columns: 1fr;
            padding-top: 62px;
            padding-bottom: 60px;
          }

          .hero-content {
            max-width: none;
          }

          .hero h1 {
            font-size: clamp(43px, 12vw, 62px);
            letter-spacing: -2.4px;
          }

          .hero-description {
            font-size: 14px;
            line-height: 1.75;
          }

          .hero-buttons {
            align-items: stretch;
            flex-direction: column;
          }

          .primary-button,
          .outline-button {
            width: 100%;
          }

          .hero-trust {
            gap: 18px;
          }

          .hero-visual {
            min-height: 420px;
          }

          .hero-bank-card {
            width: 86%;
          }

          .floating-badge-top {
            right: 0;
          }

          .floating-badge-bottom {
            left: 0;
            bottom: 45px;
          }

          .account-preview {
            right: 0;
            bottom: 0;
            width: 270px;
          }

          .quick-access-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .quick-access-item {
            border-bottom: 1px solid var(--border);
          }

          .quick-access-item:nth-child(odd) {
            border-left: 1px solid var(--border);
          }

          .quick-access-item:nth-child(even) {
            border-right: 1px solid var(--border);
          }

          .intro-section,
          .services-section,
          .online-banking-section,
          .business-section,
          .loans-section,
          .security-section,
          .why-section,
          .news-section {
            padding: 75px 0;
          }

          .intro-grid,
          .section-top,
          .online-banking-grid,
          .business-grid,
          .security-grid,
          .loans-header {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .service-grid,
          .loan-grid,
          .news-grid {
            grid-template-columns: 1fr;
          }

          .service-card {
            min-height: 280px;
          }

          .service-icon {
            margin-bottom: 48px;
          }

          .online-banking-visual {
            min-height: 420px;
          }

          .business-card {
            min-height: 390px;
          }

          .security-visual {
            min-height: 370px;
          }

          .news-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .news-card-image {
            height: 190px;
          }

          .final-cta-inner {
            min-height: auto;
            padding-top: 65px;
            padding-bottom: 65px;
            align-items: flex-start;
            flex-direction: column;
          }

          .final-cta-actions {
            width: 100%;
          }

          .white-button,
          .transparent-button {
            flex: 1;
          }

          .footer-main {
            grid-template-columns: repeat(2, 1fr);
            gap: 45px 30px;
            padding: 55px 0 45px;
          }

          .footer-brand-column {
            grid-column: 1 / -1;
          }

          .footer-contact {
            grid-column: auto;
          }

          .footer-bottom {
            padding: 22px 0;
            align-items: flex-start;
            flex-direction: column;
          }
        }

        /* =========================================================
           RESPONSIVE — SMALL MOBILE
        ========================================================= */

        @media (max-width: 500px) {
          .site-container {
            width: calc(100% - 28px);
          }

          .brand-copy strong {
            letter-spacing: 1.2px;
          }

          .brand-copy span {
            letter-spacing: 1.8px;
          }

          .header-button {
            padding: 0 10px;
          }

          .hero {
            background:
              radial-gradient(
                circle at 80% 15%,
                rgba(42, 95, 145, 0.28),
                transparent 35%
              ),
              linear-gradient(135deg, #06172c, #09284a);
          }

          .hero-grid {
            padding-top: 50px;
          }

          .hero h1 {
            font-size: 43px;
          }

          .hero-description {
            font-size: 13px;
          }

          .hero-trust {
            display: grid;
            grid-template-columns: 1fr;
          }

          .hero-visual {
            min-height: 350px;
            margin-top: 8px;
          }

          .hero-bank-card {
            width: 92%;
            padding: 20px;
            transform: rotate(3deg);
          }

          .card-chip {
            margin-top: 30px;
          }

          .card-number {
            margin-top: 15px;
            font-size: 15px;
            letter-spacing: 1.7px;
          }

          .bank-card-footer {
            left: 20px;
            right: 20px;
            bottom: 19px;
          }

          .account-preview {
            display: none;
          }

          .floating-badge {
            padding: 9px 10px;
          }

          .floating-badge-top {
            top: 5px;
            right: -2px;
          }

          .floating-badge-bottom {
            bottom: 5px;
            left: -2px;
          }

          .floating-badge strong {
            font-size: 8px;
          }

          .floating-badge small {
            font-size: 7px;
          }

          .quick-access-grid {
            grid-template-columns: 1fr;
          }

          .quick-access-item,
          .quick-access-item:first-child {
            border-left: 1px solid var(--border);
            border-right: 1px solid var(--border);
          }

          .section-heading h2,
          .section-top h2,
          .loans-header h2,
          .online-banking-content h2,
          .business-content h2,
          .security-content h2,
          .why-header h2,
          .news-heading h2 {
            font-size: 34px;
          }

          .service-grid {
            grid-template-columns: 1fr;
          }

          .service-card {
            min-height: 260px;
          }

          .service-card-number {
            top: 22px;
            right: 22px;
          }

          .online-banking-visual {
            min-height: 360px;
          }

          .dashboard-window {
            width: 92%;
          }

          .dashboard-window-body {
            padding: 15px;
          }

          .balance-preview strong {
            font-size: 21px;
          }

          .business-card {
            min-height: 350px;
          }

          .business-card-main {
            left: 25px;
            bottom: 85px;
          }

          .business-card-main h3 {
            font-size: 34px;
          }

          .security-visual {
            min-height: 315px;
          }

          .orbit-two {
            width: 300px;
            height: 300px;
          }

          .orbit-one {
            width: 220px;
            height: 220px;
          }

          .security-shield {
            width: 125px;
            height: 145px;
          }

          .security-mini-one {
            left: 0;
            top: 30px;
          }

          .security-mini-two {
            right: 0;
            bottom: 25px;
          }

          .why-grid {
            grid-template-columns: 1fr;
          }

          .why-card {
            min-height: 220px;
          }

          .news-grid {
            gap: 12px;
          }

          .news-card-content h3 {
            min-height: auto;
          }

          .news-card-content p {
            min-height: auto;
          }

          .final-cta h2 {
            font-size: 38px;
          }

          .final-cta-actions {
            flex-direction: column;
          }

          .white-button,
          .transparent-button {
            width: 100%;
          }

          .footer-main {
            grid-template-columns: 1fr 1fr;
          }

          .footer-contact {
            grid-column: 1 / -1;
          }

          .footer-legal {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </>
  );
}
