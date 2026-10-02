export default function NewsPage() {
  const stories = [
    {
      category: "BANKING",
      title: "Digital banking continues to reshape everyday financial services",
      summary:
        "Explore the changing role of secure digital banking, online account access and modern customer service.",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85",
      featured: true,
    },
    {
      category: "FOREIGN INVESTMENT",
      title: "Global capital and international investment remain key market themes",
      summary:
        "Cross-border investment, infrastructure and business expansion continue to connect economies around the world.",
      image:
        "https://images.unsplash.com/photo-1521292270410-a8c4d716d518?auto=format&fit=crop&w=1200&q=85",
    },
    {
      category: "GLOBAL MARKETS",
      title: "Markets continue to follow rates, currencies and economic growth",
      summary:
        "Keep an eye on the financial themes that influence businesses, investors and international capital.",
      image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=85",
    },
    {
      category: "FINANCIAL TECHNOLOGY",
      title: "Technology is changing the way customers interact with financial institutions",
      summary:
        "From digital payments to online services, financial technology continues to transform the customer experience.",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=85",
    },
    {
      category: "BUSINESS",
      title: "Businesses continue to watch international trade and investment conditions",
      summary:
        "International business activity connects companies, financial institutions and investors across markets.",
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
    },
    {
      category: "SECURITY",
      title: "Online banking security remains an important customer priority",
      summary:
        "Strong passwords, careful verification and secure account access are important parts of protecting financial information.",
      image:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=85",
    },
  ];

  return (
    <main>
      {/* HEADER */}
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
          <a className="active" href="/news">News</a>
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

      {/* NEWS HERO */}
      <section className="news-page-hero">
        <div>
          <span className="section-label">NEWS & MARKET INSIGHTS</span>

          <h1>Banking, markets and global investment.</h1>

          <p>
            Stay connected with banking developments, financial technology,
            global markets, business activity and international investment
            themes.
          </p>

          <div className="news-hero-actions">
            <a className="primary-button" href="/login">
              Access Online Banking
            </a>
            <a className="secondary-button" href="/contact">
              Contact Us
            </a>
          </div>
        </div>

        <div className="news-hero-panel">
          <div className="news-hero-stat">
            <strong>6</strong>
            <span>Featured stories</span>
          </div>

          <div className="news-hero-stat">
            <strong>4</strong>
            <span>Market themes</span>
          </div>

          <div className="news-hero-stat">
            <strong>24/7</strong>
            <span>Online access</span>
          </div>
        </div>
      </section>

      {/* FEATURED STORY */}
      <section className="public-section news-featured-section">
        <div className="section-heading">
          <div>
            <span className="section-label">FEATURED</span>
            <h2>What's happening in finance</h2>
          </div>
        </div>

        <article className="news-featured-card">
          <div className="news-featured-image">
            <img
              src={stories[0].image}
              alt={stories[0].title}
              loading="eager"
            />
            <span className="news-overlay-label">{stories[0].category}</span>
          </div>

          <div className="news-featured-content">
            <span className="news-category">{stories[0].category}</span>
            <h2>{stories[0].title}</h2>
            <p>{stories[0].summary}</p>
            <a className="primary-button" href="/contact">
              Explore This Topic →
            </a>
          </div>
        </article>
      </section>

      {/* ALL STORIES */}
      <section className="public-section">
        <div className="section-heading">
          <div>
            <span className="section-label">LATEST STORIES</span>
            <h2>Banking & global market news</h2>
          </div>

          <span className="news-updated">
            MARKET & BANKING
          </span>
        </div>

        <div className="news-page-grid">
          {stories.slice(1).map((story) => (
            <article className="news-page-card" key={story.title}>
              <div className="news-page-image">
                <img
                  src={story.image}
                  alt={story.title}
                  loading="lazy"
                />
                <span className="news-overlay-label">{story.category}</span>
              </div>

              <div className="news-page-content">
                <span className="news-category">{story.category}</span>

                <h3>{story.title}</h3>

                <p>{story.summary}</p>

                <a href="/contact">Read More →</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* MARKET THEMES */}
      <section className="news-market-strip">
        <div>
          <span className="section-label">MARKET THEMES</span>
          <h2>Areas to watch</h2>
          <p>
            Follow the broad financial themes that can shape businesses,
            investors and international markets.
          </p>
        </div>

        <div className="news-theme-list">
          <div>
            <strong>Global Investment</strong>
            <span>Cross-border capital and business expansion</span>
          </div>

          <div>
            <strong>Digital Finance</strong>
            <span>Technology and modern financial services</span>
          </div>

          <div>
            <strong>Market Activity</strong>
            <span>Rates, currencies and economic conditions</span>
          </div>

          <div>
            <strong>Banking Security</strong>
            <span>Protecting customers and financial information</span>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="news-disclaimer-public">
        <strong>MARKET INFORMATION</strong>
        <p>
          News and market content on this page is provided for general
          informational purposes. It is not investment advice or a
          recommendation to buy or sell any financial product.
        </p>
      </section>

      {/* CTA */}
      <section className="final-cta">
        <span className="section-label">MIDATLANTIC FEDERAL BANK</span>

        <h2>Stay connected with your banking.</h2>

        <p>
          Access your account online or explore our banking and lending
          services.
        </p>

        <div className="hero-actions">
          <a className="primary-button" href="/login">
            Sign In
          </a>

          <a className="secondary-button" href="/services">
            Explore Banking
          </a>
        </div>
      </section>

      {/* FOOTER */}
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
