export default function ContactPage() {
  return (
    <main className="contact-page">

      {/* =========================
          HEADER
      ========================== */}

      <header className="public-header">
        <a href="/" className="public-logo">
          <div className="bank-logo">M</div>

          <div>
            <strong>MIDATLANTIC</strong>
            <span>FEDERAL BANK</span>
          </div>
        </a>

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
          PAGE HERO
      ========================== */}

      <section className="contact-hero">
        <div>
          <span className="section-label">
            CUSTOMER SERVICE
          </span>

          <h1>We're here to help.</h1>

          <p>
            Have a question about your account, banking services,
            or something else? Contact MidAtlantic Federal Bank
            using one of the options below.
          </p>
        </div>
      </section>

      {/* =========================
          CONTACT INFORMATION
      ========================== */}

      <section className="contact-section">

        <div className="contact-information">

          <span className="section-label">
            CONTACT INFORMATION
          </span>

          <h2>Get in touch with us.</h2>

          <p>
            Our customer support team is available to assist
            with general questions and account-related
            support.
          </p>

          {/* Address */}

          <div className="contact-detail">
            <div className="contact-icon">⌖</div>

            <div>
              <strong>Bank Address</strong>

              <p>
                12822 Wisteria Dr
                <br />
                Germantown, MD 20874
                <br />
                United States
              </p>
            </div>
          </div>

          {/* Email */}

          <div className="contact-detail">
            <div className="contact-icon">@</div>

            <div>
              <strong>Email Address</strong>

              <p>
                <a href="mailto:midfb@outlook.com">
                  midfb@outlook.com
                </a>
              </p>
            </div>
          </div>

          {/* Phone */}

          <div className="contact-detail">
            <div className="contact-icon">☎</div>

            <div>
              <strong>Phone</strong>

              <p>
                <a href="tel:+16266063125">
                  +1 626-606-3125
                </a>
              </p>
            </div>
          </div>

          {/* Customer Support */}

          <div className="contact-detail">
            <div className="contact-icon">?</div>

            <div>
              <strong>Customer Support</strong>

              <p>
                Need help with an account or online banking?
                Visit our customer support center.
              </p>

              <a href="/support">
                Visit Customer Support →
              </a>
            </div>
          </div>

        </div>

        {/* =========================
            MESSAGE FORM
        ========================== */}

        <div className="contact-form-card">

          <span className="section-label">
            SEND US A MESSAGE
          </span>

          <h2>How can we help?</h2>

          <p>
            Send us a message and our customer service team
            can review your request.
          </p>

          <form>

            <label>
              Full Name

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                required
              />
            </label>

            <label>
              Email Address

              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
            </label>

            <label>
              Subject

              <input
                type="text"
                name="subject"
                placeholder="What can we help you with?"
                required
              />
            </label>

            <label>
              Message

              <textarea
                name="message"
                rows="6"
                placeholder="Enter your message..."
                required
              ></textarea>
            </label>

            <button
              type="submit"
              className="primary-button"
            >
              Send Message
            </button>

          </form>

        </div>

      </section>

      {/* =========================
          SUPPORT CTA
      ========================== */}

      <section className="contact-support-banner">

        <div>
          <span className="section-label">
            NEED MORE HELP?
          </span>

          <h2>Visit our Customer Support Center.</h2>

          <p>
            Find support resources, frequently asked questions,
            and additional ways to get assistance.
          </p>
        </div>

        <a
          href="/support"
          className="primary-button"
        >
          Customer Support →
        </a>

      </section>

      {/* =========================
          FOOTER
      ========================== */}

      <footer className="public-footer">

        <div className="footer-main">

          <div className="footer-brand">

            <a href="/" className="public-logo">

              <div className="bank-logo">
                M
              </div>

              <div>
                <strong>MIDATLANTIC</strong>
                <span>FEDERAL BANK</span>
              </div>

            </a>

            <p>
              Online banking and customer support resources.
            </p>

          </div>

          <div className="footer-column">

            <h3>Banking</h3>

            <a href="/services">
              Banking Services
            </a>

            <a href="/loans">
              Loans
            </a>

            <a href="/login">
              Online Banking
            </a>

          </div>

          <div className="footer-column">

            <h3>Company</h3>

            <a href="/about">
              About Us
            </a>

            <a href="/news">
              News
            </a>

            <a href="/contact">
              Contact Us
            </a>

          </div>

          <div className="footer-column">

            <h3>Support</h3>

            <a href="/support">
              Customer Support
            </a>

            <a href="/security">
              Security Center
            </a>

            <a href="/faq">
              FAQs
            </a>

          </div>

        </div>

        <div className="footer-contact">

          <strong>
            Bank Contact Information
          </strong>

          <p>
            12822 Wisteria Dr
            <br />
            Germantown, MD 20874
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

    </main>
  );
}
