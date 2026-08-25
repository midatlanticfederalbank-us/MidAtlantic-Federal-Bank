"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SupportPage() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("");

  useEffect(() => {
    loadSupport();
  }, []);

  async function loadSupport() {
    setLoading(true);
    setNotice("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      window.location.href = "/login";
      return;
    }

    setUser(user);

    const { data, error } = await supabase
      .from("support_messages")
      .select(
        "id, user_id, subject, message, reply, status, created_at, replied_at"
      )
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      setNotice(error.message);
      setNoticeType("error");
      setLoading(false);
      return;
    }

    setMessages(data || []);
    setLoading(false);
  }

  async function sendMessage(event) {
    event.preventDefault();

    setNotice("");
    setNoticeType("");

    if (!subject.trim()) {
      setNotice("Please enter a subject.");
      setNoticeType("error");
      return;
    }

    if (!message.trim()) {
      setNotice("Please enter your message.");
      setNoticeType("error");
      return;
    }

    if (!user) {
      setNotice("Your session has expired. Please sign in again.");
      setNoticeType("error");
      return;
    }

    setSending(true);

    const { error } = await supabase
      .from("support_messages")
      .insert({
        user_id: user.id,
        subject: subject.trim(),
        message: message.trim(),
        status: "open",
      });

    if (error) {
      setNotice(
        "We could not send your message. Please try again."
      );
      setNoticeType("error");
      setSending(false);
      return;
    }

    setSubject("");
    setMessage("");

    setNotice(
      "Your message has been sent to customer support."
    );
    setNoticeType("success");

    await loadSupport();

    setSending(false);
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getStatusLabel(status) {
    if (!status) return "Open";

    const value = String(status).toLowerCase();

    if (value === "closed") return "Closed";
    if (value === "resolved") return "Resolved";
    if (value === "pending") return "Pending";

    return "Open";
  }

  if (loading) {
    return (
      <main className="public-page">
        <section className="page-hero">
          <div className="page-hero-content">
            <span className="hero-eyebrow">
              CUSTOMER SUPPORT
            </span>

            <h1>
              Customer Support
            </h1>

            <p>
              Loading your support center...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="public-page">

      {/* =========================
          PAGE HERO
      ========================== */}

      <section className="page-hero">

        <div className="page-hero-content">

          <span className="hero-eyebrow">
            CUSTOMER SUPPORT
          </span>

          <h1>
            We're here to
            <span> help.</span>
          </h1>

          <p>
            Send a message to our customer support
            team, review previous conversations, or
            find information about getting assistance
            with your account.
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
          SUPPORT OPTIONS
      ========================== */}

      <section className="public-section">

        <div className="section-introduction">

          <span className="section-label">
            HOW CAN WE HELP?
          </span>

          <h2>
            Choose a support option.
          </h2>

          <p>
            Use the support center to contact the team
            about account questions, banking services,
            or other issues.
          </p>

        </div>


        <div className="public-feature-grid">

          <div className="public-feature-card">

            <div className="feature-icon">
              ✉
            </div>

            <h3>
              Send a Message
            </h3>

            <p>
              Send a detailed message to customer
              support and review the response from
              your account.
            </p>

          </div>


          <div className="public-feature-card">

            <div className="feature-icon">
              ?
            </div>

            <h3>
              Account Questions
            </h3>

            <p>
              Contact support if you have questions
              about your account or available banking
              services.
            </p>

          </div>


          <div className="public-feature-card">

            <div className="feature-icon">
              !
            </div>

            <h3>
              Security Concerns
            </h3>

            <p>
              Contact support if you notice suspicious
              activity or have an account security
              concern.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          MESSAGE FORM
      ========================== */}

      <section className="public-section">

        <div className="section-introduction">

          <span className="section-label">
            CONTACT SUPPORT
          </span>

          <h2>
            Send us a message.
          </h2>

          <p>
            Complete the form below and your message
            will be added to your support history.
          </p>

        </div>


        <div className="support-form-card">

          {notice && (
            <div
              className={
                noticeType === "success"
                  ? "notification success-notice"
                  : "notification error-notice"
              }
            >
              <p>{notice}</p>
            </div>
          )}


          <form onSubmit={sendMessage}>

            <div className="form-group">

              <label htmlFor="subject">
                Subject
              </label>

              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value)
                }
                placeholder="What can we help you with?"
                disabled={sending}
              />

            </div>


            <div className="form-group">

              <label htmlFor="message">
                Message
              </label>

              <textarea
                id="message"
                rows="8"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Please describe your question or issue..."
                disabled={sending}
              />

            </div>


            <button
              type="submit"
              className="primary-button"
              disabled={sending}
            >
              {sending
                ? "Sending..."
                : "Send Message"}
            </button>

          </form>

        </div>

      </section>


      {/* =========================
          SUPPORT HISTORY
      ========================== */}

      <section className="public-section">

        <div className="section-introduction">

          <span className="section-label">
            SUPPORT HISTORY
          </span>

          <h2>
            My Support Messages
          </h2>

          <p>
            Review messages you have previously sent
            and any responses from customer support.
          </p>

        </div>


        {messages.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              ✉
            </div>

            <strong>
              No Support Messages
            </strong>

            <p>
              You have not sent any support messages yet.
            </p>

          </div>

        ) : (

          <div className="support-message-list">

            {messages.map((item) => (

              <article
                className="support-message-card"
                key={item.id}
              >

                <div className="support-message-header">

                  <div>

                    <span className="section-label">
                      SUPPORT REQUEST
                    </span>

                    <h3>
                      {item.subject ||
                        "Support Message"}
                    </h3>

                  </div>

                  <span className="support-status">
                    {getStatusLabel(item.status)}
                  </span>

                </div>


                <p className="support-message-date">
                  Sent {formatDate(item.created_at)}
                </p>


                <div className="support-message-body">

                  <strong>
                    Your Message
                  </strong>

                  <p>
                    {item.message}
                  </p>

                </div>


                {item.reply && (

                  <div className="support-reply">

                    <strong>
                      Customer Support Reply
                    </strong>

                    <p>
                      {item.reply}
                    </p>

                    {item.replied_at && (
                      <small>
                        Replied{" "}
                        {formatDate(item.replied_at)}
                      </small>
                    )}

                  </div>

                )}

              </article>

            ))}

          </div>

        )}

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
            Keep your account information secure.
          </h2>

          <p>
            Never send your password, PIN,
            verification codes, or other sensitive
            authentication information through a
            support message.
          </p>

        </div>

        <a href="/security">
          Security Center →
        </a>

      </section>


      {/* =========================
          CONTACT
      ========================== */}

      <section className="support-banner">

        <div>

          <span className="section-label">
            MORE WAYS TO GET HELP
          </span>

          <h2>
            Need another way to reach us?
          </h2>

          <p>
            Visit the contact page for the available
            bank contact channels and additional
            information.
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
            href="/"
          >
            Back to Home
          </a>

        </div>

      </section>

    </main>
  );
}
