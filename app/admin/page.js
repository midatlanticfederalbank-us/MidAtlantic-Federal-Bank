"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminDashboard() {
  const [customers, setCustomers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileError || profile?.role !== "admin") {
      window.location.href = "/dashboard";
      return;
    }

    await loadCustomers();
    await loadMessages();

    setLoading(false);
  }

  async function loadCustomers() {
    const { data, error } = await supabase
      .from("customer_accounts")
      .select(
        "id, user_id, balance, status, account_type, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setNotice(error.message);
      return;
    }

    const userIds = data.map((account) => account.user_id);

    if (!userIds.length) {
      setCustomers([]);
      return;
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);

    const profileMap = {};

    (profiles || []).forEach((profile) => {
      profileMap[profile.id] = profile.full_name;
    });

    setCustomers(
      data.map((account) => ({
        ...account,
        full_name:
          profileMap[account.user_id] || "Customer"
      }))
    );
  }

  async function loadMessages() {
    const { data, error } = await supabase
      .from("support_messages")
      .select(
        "id, user_id, subject, message, reply, status, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setNotice(error.message);
      return;
    }

    setMessages(data || []);
  }

  async function updateAccount(
    id,
    balance,
    status
  ) {
    const { error } = await supabase
      .from("customer_accounts")
      .update({
        balance: Number(balance),
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice("Account updated.");
    await loadCustomers();
  }

  async function replyToMessage(id, reply) {
    if (!reply.trim()) return;

    const { error } = await supabase
      .from("support_messages")
      .update({
        reply: reply.trim(),
        status: "resolved",
        replied_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice("Reply sent.");
    await loadMessages();
  }

  if (loading) {
    return (
      <main>
        <p>Loading administrator dashboard...</p>
      </main>
    );
  }

  return (
    <main>
      <section>
        <span className="real-badge">ADMIN</span>

        <h1>Administrator Dashboard</h1>

        {notice && <p>{notice}</p>}
      </section>

      <section>
        <h2>Customer Accounts</h2>

        {customers.length === 0 ? (
          <p>No customer accounts found.</p>
        ) : (
          customers.map((customer) => (
            <div
              className="notification"
              key={customer.id}
            >
              <h3>{customer.full_name}</h3>

              <p>
                Status: <strong>{customer.status}</strong>
              </p>

              <p>
                Account type:{" "}
                {customer.account_type}
              </p>

              <p>
                Current test balance: $
                {Number(customer.balance).toFixed(2)}
              </p>

              <input
                id={`balance-${customer.id}`}
                type="number"
                step="0.01"
                defaultValue={customer.balance}
              />

              <button
                className="primary-button"
                onClick={() => {
                  const value =
                    document.getElementById(
                      `balance-${customer.id}`
                    ).value;

                  updateAccount(
                    customer.id,
                    value,
                    customer.status
                  );
                }}
              >
                Update Balance
              </button>

              <button
                className="primary-button"
                onClick={() =>
                  updateAccount(
                    customer.id,
                    customer.balance,
                    customer.status ===
                      "active"
                      ? "frozen"
                      : "active"
                  )
                }
              >
                {customer.status === "active"
                  ? "Freeze Account"
                  : "Unfreeze Account"}
              </button>
            </div>
          ))
        )}
      </section>

      <section>
        <h2>Customer Support</h2>

        {messages.length === 0 ? (
          <p>No support messages.</p>
        ) : (
          messages.map((item) => (
            <div
              className="notification"
              key={item.id}
            >
              <h3>
                {item.subject ||
                  "Customer Support"}
              </h3>

              <p>
                <strong>Customer message:</strong>
              </p>

              <p>{item.message}</p>

              {item.reply && (
                <p>
                  <strong>Reply:</strong>{" "}
                  {item.reply}
                </p>
              )}

              <p>
                Status: {item.status}
              </p>

              <textarea
                id={`reply-${item.id}`}
                rows="4"
                placeholder="Write your reply..."
              />

              <button
                className="primary-button"
                onClick={() => {
                  const reply =
                    document.getElementById(
                      `reply-${item.id}`
                    ).value;

                  replyToMessage(
                    item.id,
                    reply
                  );
                }}
              >
                Send Reply
              </button>
            </div>
          ))
        )}
      </section>

      <section className="real-notice">
        <h2>Test Environment</h2>

        <p>
          Account balances and account controls
          are for testing and development and do
          not represent actual bank funds.
        </p>
      </section>
    </main>
  );
}
