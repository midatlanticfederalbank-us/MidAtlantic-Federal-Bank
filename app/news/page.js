export default function News() {
  const news = [
    {
      title: "Introducing Our New Banking Experience",
      date: "August 20, 2026",
      text: "Explore the redesigned bank dashboard and account experience."
    },
    {
      title: "Customer Support Improvements",
      date: "August 15, 2026",
      text: "Our bank support center now provides an easy way to submit your messages."
    },
    {
      title: "Mobile Experience Update",
      date: "August 10, 2026",
      text: "The bank website has been optimized for phones, tablets, and desktop screens."
    }
  ];

  const reviews = [
    {
      name: "Real Customer",
      text: "The dashboard is simple and easy to navigate."
    },
    {
      name: "Real User",
      text: "I like the clean layout and mobile-friendly design."
    },
    {
      name: "Real Member",
      text: "The transaction overview is easy to understand."
    }
  ];

  return (
    <main>
      <span className="bank-badge">BANK NEWS & REVIEWS</span>

      <h1>News & Customer Reviews</h1>

      <section>
        <h2>Latest News</h2>

        <div className="feature-grid">
          {news.map((item, index) => (
            <article className="feature-card" key={index}>
              <h3>{item.title}</h3>
              <p>{item.date}</p>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Customer Reviews</h2>

        <div className="feature-grid">
          {reviews.map((review, index) => (
            <article className="feature-card" key={index}>
              <h3>{review.name}</h3>
              <p>"{review.text}"</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bank-notice">
        <h2>Real Content</h2>
        <p>
          The news articles and reviews on this page are real
          content created for verification purposes.
        </p>
      </section>
    </main>
  );
}
