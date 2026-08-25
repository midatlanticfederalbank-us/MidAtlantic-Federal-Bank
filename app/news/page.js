export default function News() {
  const news = [
    {
      title: "Introducing Our New Banking Experience",
      date: "August 20, 2026",
      category: "BANKING",
      text:
        "Explore the updated online banking experience designed to make account management easier and more convenient.",
    },
    {
      title: "Customer Support Improvements",
      date: "August 15, 2026",
      category: "CUSTOMER SERVICE",
      text:
        "Customers can access support resources and submit questions through our customer support center.",
    },
    {
      title: "Mobile Banking Experience Update",
      date: "August 10, 2026",
      category: "DIGITAL BANKING",
      text:
        "Our online banking experience has been optimized for phones, tablets, and desktop screens.",
    },
  ];

  return (
    <main className="public-page">

      {/* =========================
          PAGE HERO
      ========================== */}

      <section className="page-hero">
        <div className="page-hero-content">

          <span className="hero-eyebrow">
            NEWS & UPDATES
          </span>

          <h1>
            Stay informed with
            <span> MidAtlantic Federal Bank.</span>
          </h1>

          <p>
            Read the latest banking announcements,
            digital banking updates, customer service
            information, and security resources.
          </p>

          <div className="hero-actions">
            <a
              className="primary-button"
              href="/"
            >
              Back to Home
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
          LATEST NEWS
      ========================== */}

      <section className="public-section">

        <div className="section-introduction">

          <span className="section-label">
            LATEST UPDATES
          </span>

          <h2>
            News from the bank
          </h2>

          <p>
            Stay up to date with information about
            banking services, customer support,
            digital banking, and security.
          </p>

        </div>


        <div className="news-grid">

          {news.map((item, index) => (
            <article
              className="news-card"
              key={index}
            >

              {/* Image-style news header */}

              <div
                className={`news-image news-image-${index + 1}`}
              >
                <div className="news-image-overlay">
                  <strong>
                    MIDATLANTIC
                  </strong>

                  <span>
                    FEDERAL BANK
                  </span>
                </div>
              </div>


              <div className="news-content">

                <span className="news-category">
                  {item.category}
                </span>

                <h3>
                  {item.title}
                </h3>

                <p className="news-date">
                  {item.date}
                </p>

                <p>
                  {item.text}
                </p>

                <a href="/contact">
                  Learn More →
                </a>

              </div>

            </article>
          ))}

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
            Need help?
          </h2>

          <p>
            If you have a question about your account
            or our banking services, our customer
            support resources are available to assist.
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
          SECURITY NOTICE
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
          Stay connected with your bank.
        </h2>

        <p>
          Access online banking, explore banking
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
            href="/"
          >
            Back to Home
          </a>

        </div>

      </section>

    </main>
  );
}
