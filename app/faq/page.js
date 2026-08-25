export default function FAQPage() {
  const faqs = [
    {
      question: "How do I access online banking?",
      answer:
        "Select Sign In from the website navigation and use your account credentials to access available online banking services."
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can visit the Customer Support page to review available support resources or contact the bank using the information provided on the Contact Us page."
    },
    {
      question: "What should I do if I forget my password?",
      answer:
        "Use the available account recovery options on the sign-in page. If you still need assistance, contact customer support through an official support channel."
    },
    {
      question: "How can I protect my account?",
      answer:
        "Use a strong password, keep your login information private, avoid suspicious links, and never share verification codes or security credentials with anyone."
    },
    {
      question: "How can I review my account activity?",
      answer:
        "After signing in, available account activity and transaction information can be reviewed through your online banking dashboard."
    },
    {
      question: "Can I contact support about an account issue?",
      answer:
        "Yes. Existing customers can sign in and use the Customer Support page to submit a support message regarding an account-related question."
    },
    {
      question: "Where can I learn about banking services?",
      answer:
        "Visit the Banking Services page to learn more about the available banking resources and account services."
    },
    {
      question: "Where can I find information about loans?",
      answer:
        "Visit the Loans page to review available lending information and resources."
    }
  ];

  return (
    <main className="public-page">
      {/* =========================
          PAGE HERO
      ========================== */}

      <section className="page-hero">
        <div className="page-hero-content">
          <span className="hero-eyebrow">
            FREQUENTLY ASKED QUESTIONS
          </span>

          <h1>
            Answers to common
            <span> questions.</span>
          </h1>

          <p>
            Find helpful information about online
            banking, customer support, account access,
            security, and available banking services.
          </p>
        </div>
      </section>

      {/* =========================
          FAQ INTRODUCTION
      ========================== */}

      <section className="public-section">
        <div className="section-introduction">
          <span className="section-label">
            FAQ
          </span>

          <h2>
            How can we help?
          </h2>

          <p>
            Browse the questions below for general
            information about using the website and
            available banking resources.
          </p>
        </div>

        {/* =========================
            FAQ LIST
        ========================== */}

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details
              className="faq-item"
              key={index}
            >
              <summary>
                <span>
                  {faq.question}
                </span>

                <strong>
                  +
                </strong>
              </summary>

              <div className="faq-answer">
                <p>
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* =========================
          ONLINE BANKING
      ========================== */}

      <section className="loan-section">
        <div className="loan-content">
          <span className="section-label">
            ONLINE BANKING
          </span>

          <h2>
            Need help with your account?
          </h2>

          <p>
            Existing customers can sign in to access
            available account services and customer
            support resources.
          </p>
        </div>

        <div className="loan-options">
          <div>
            <strong>
              Sign In
            </strong>

            <span>
              Access your available online banking
              services.
            </span>
          </div>

          <div>
            <strong>
              Customer Support
            </strong>

            <span>
              Submit a support message about an
              account-related question.
            </span>
          </div>

          <div>
            <strong>
              Contact Us
            </strong>

            <span>
              Find the available contact information.
            </span>
          </div>
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
            SECURITY
          </span>

          <h2>
            Keep your account information private.
          </h2>

          <p>
            Never share your password, PIN,
            verification codes, or other sensitive
            authentication information with anyone.
          </p>
        </div>

        <a href="/security">
          Security Center →
        </a>
      </section>

      {/* =========================
          SUPPORT CTA
      ========================== */}

      <section className="support-banner">
        <div>
          <span className="section-label">
            STILL HAVE QUESTIONS?
          </span>

          <h2>
            We're here to help.
          </h2>

          <p>
            If you cannot find the information you
            need, contact customer support through an
            available official channel.
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
          MIDATLANTIC FEDERAL BANK
        </span>

        <h2>
          Ready to access your account?
        </h2>

        <p>
          Sign in to your online banking account or
          explore available banking services.
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
            href="/services"
          >
            Banking Services
          </a>
        </div>
      </section>
    </main>
  );
}
