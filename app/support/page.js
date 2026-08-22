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
      setLoading(false);
      return;
    }

    setMessages(data || []);
    setLoading(false);
  }

  async function sendMessage(event) {
    event.preventDefault();

    if (!subject.trim() || !message.trim()) {
      setNotice("Please enter a subject and message.");
      return;
    }

    if (!user) {
      setNotice("Please sign in again.");
      return;
    }

    setSending(true);
    setNotice("");

    const { error } = await supabase
      .from("support_messages")
      .insert({
        user_id: user.id,
        subject: subject.trim(),
        message: message.trim(),
        status: "open",
      });

    if (error) {
      setNotice(error.message);
      setSending(false);
      return;
    }

    setSubject("");
    setMessage("");
    setNotice("Your message has been sent.");

    await loadSupport();

    setSending(false);
  }

  if (loading) {
    return (
      <main>
        <span className="real-badge">
          CUSTOMER SUPPORT
        </span>

        <h1>Customer Support</h1>

        <p>Loading your support messages...</p>
      </main>
    );
  }

  return (
    <main>
      <div className="dashboard-header">
        <div>
          <span className="real-badge">
            CUSTOMER SUPPORT
          </span>

          <h1>Customer Support</h1>

          <p>
            Send a message to our support team.
          </p>
        </div>
      </div>

      {notice && (
        <div className="notification">
          <p>{notice}</p>
        </div>
      )}

      <section>
        <h2>Contact Support</h2>

        <form onSubmit={sendMessage}>
          <div>
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
              placeholder="Enter your subject"
            />
          </div>

          <div>
            <label htmlFor="message">
              Message
            </label>

            <textarea
              id="message"
              rows="6"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="How can we help you?"
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
      </section>

      <section>
        <h2>My Support Messages</h2>

        {messages.length === 0 ? (
          <div className="notification">
            <p>
              You haven't sent any support messages yet.
            </p>
          </div>
        ) : (
          <div className="transaction-list">
            {messages.map((item) => (
              <div
                className="notification"
                key={item.id}
              >
                <h3>
                  {item.subject ||
                    "Support Message"}
                </h3>

                <p>
                  <strong>Your message:</strong>
                </p>

                <p>{item.message}</p>

                <p>
                  <strong>Status:</strong>{" "}
                  {item.status}
                </p>

                {item.reply && (
                  <>
                    <p>
                      <strong>
                        Support reply:
                      </strong>
                    </p>

                    <p>{item.reply}</p>

                    {item.replied_at && (
                      <p>
                        Replied:{" "}
                        {new Date(
                          item.replied_at
                        ).toLocaleString()}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="real-notice">
        <h2>⛔ Security Warning</h2>

        <p>
          Never share your password, PIN, verification
          codes, or other sensitive account information
          with anyone. Our support team will never ask
          you to disclose your password or security codes.
        </p>

        <p>
          Account information is provided for
          informational purposes on this website.
        </p>
      </section>
    </main>
  );
}
