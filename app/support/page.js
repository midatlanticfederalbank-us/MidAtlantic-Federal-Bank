"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Support() {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [messages, setMessages] = useState([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("support_messages")
      .select(
        "id, subject, message, reply, status, created_at, replied_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setNotice(error.message);
      return;
    }

    setMessages(data || []);
  }

  async function sendMessage(event) {
    event.preventDefault();

    setNotice("");

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase
      .from("support_messages")
      .insert({
        user_id: user.id,
        subject: subject.trim() || "Customer Support",
        message: message.trim(),
        status: "open"
      });

    if (error) {
      setNotice(error.message);
      return;
    }

    setSubject("");
    setMessage("");
    setNotice("Message sent successfully.");

    await loadMessages();
  }

  return (
    <main>
      <section className="auth-card">
        <span className="real-badge">
          CUSTOMER SUPPORT
        </span>

        <h1>Customer Support</h1>

        <p>
          Send a message to our support team.
        </p>

        {notice && (
          <div className="notification">
            <p>{notice}</p>
          </div>
        )}

        <form onSubmit={sendMessage}>
          <label>
            Subject
            <input
              type="text"
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
              placeholder="What do you need help with?"
            />
          </label>

          <label>
            Message
            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Write your message..."
              rows="6"
              required
            />
          </label>

          <button
            type="submit"
            className="primary-button"
          >
            Send Message
          </button>
        </form>
      </section>

      <section>
        <h2>My Support Messages</h2>

        {messages.length === 0 ? (
          <p>You have no support messages yet.</p>
        ) : (
          messages.map((item) => (
            <div
              className="notification"
              key={item.id}
            >
              <h3>
                {item.subject || "Customer Support"}
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
                <div>
                  <p>
                    <strong>Support reply:</strong>
                  </p>

                  <p>{item.reply}</p>

                  {item.replied_at && (
                    <small>
                      Replied:{" "}
                      {new Date(
                        item.replied_at
                      ).toLocaleString()}
                    </small>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </main>
  );
}
