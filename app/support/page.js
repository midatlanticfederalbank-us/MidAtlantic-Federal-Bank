"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Support() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadSupport();

    const channel = supabase
      .channel("support-messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_messages",
        },
        () => {
          loadSupport();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadSupport() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setUser(user);

    const { data, error } = await supabase
      .from("support_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setMessages(data || []);
    }

    setLoading(false);
  }

  async function sendMessage(event) {
    event.preventDefault();

    if (!message.trim()) return;

    setSending(true);
    setStatus("");

    const { error } = await supabase
      .from("support_messages")
      .insert({
        user_id: user.id,
        subject: subject.trim() || "Customer Support",
        message: message.trim(),
      });

    if (error) {
      setStatus(error.message);
    } else {
      setSubject("");
      setMessage("");
      setStatus("Message sent successfully.");
      await loadSupport();
    }

    setSending(false);
  }

  if (loading) {
    return <main><p>Loading support...</p></main>;
  }

  return (
    <main>
      <section className="auth-card">
        <span className="real-badge">CUSTOMER SUPPORT</span>

        <h1>Customer Support</h1>

        <p>
          Send a message to our support team.
        </p>

        <form onSubmit={sendMessage}>
          <label>
            Subject
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="How can we help?"
            />
          </label>

          <label>
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              rows="6"
              required
            />
          </label>

          <button
            type="submit"
            className="primary-button"
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Message"}
          </button>
        </form>

        {status && <p>{status}</p>}
      </section>

      <section>
        <h2>Your Support Messages</h2>

        {messages.length === 0 ? (
          <p>No support messages yet.</p>
        ) : (
          messages.map((item) => (
            <article className="notification" key={item.id}>
              <h3>{item.subject || "Customer Support"}</h3>

              <p>
                <strong>Your message:</strong>
              </p>
              <p>{item.message}</p>

              {item.reply && (
                <>
                  <p>
                    <strong>Support reply:</strong>
                  </p>
                  <p>{item.reply}</p>
                </>
              )}

              <p>
                <strong>Status:</strong> {item.status}
              </p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
