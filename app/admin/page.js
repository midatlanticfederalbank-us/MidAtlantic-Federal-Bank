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
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  async function checkAdminAndLoad() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
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
      .select(`
        id,
        user_id,
        balance,
        status,
        account_type,
        created_at,
        profiles:user_id (
          full_name
        )
      `)
      .order("created_at", { ascending: false });

    if (!error) {
      setCustomers(data || []);
    }
  }

  async function loadMessages() {
    const { data, error } = await supabase
      .from("support_messages")
      .select(`
        id,
        user_id,
        subject,
        message,
        reply,
        status,
        created_at,
        replied_at,
        profiles:user_id (
          full_name
        )
      `)
      .order("created_at", { ascending: false });

    if (!error) {
      setMessages(data || []);
    }
  }

  async function updateAccount(accountId, balance, status) {
    setNotice("");

    const { error } = await supabase
      .from("customer_accounts")
      .update({
        balance: Number(balance),
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", accountId);

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice("Account updated successfully.");
    await loadCustomers();
  }

  async function replyToMessage(messageId, reply) {
    if (!reply.trim()) return;

    const { error } = await supabase
      .from("support_messages")
      .update({
        reply: reply.trim(),
        status: "resolved",
        replied_at: new Date().toISOString()
      })
      .eq("id", messageId);

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice("Reply sent successfully.");
    await loadMessages();
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
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
      <div className="dashboard-header">
        <div>
          <span className="real-badge">ADMIN</span>
          <h1>Administrator Dashboard</h1>
          <p>Customer accounts and support management.</p>
        </div>

        <button onClick={logout} className="primary-button">
          Sign Out
        </button>
      </div>

      {notice && (
        <div className="notification">
          <p>{notice}</p>
        </div>
      )}

      <section>
        <h2>Customer Accounts</h2>

        {customers.length === 0 ? (
          <p>No customer accounts found.</p>
        ) : (
          <div className="transaction-list">
            {customers.map((customer) => (
              <div className="transaction" key={customer.id}>
                <div>
                  <strong>
                    {customer.profiles?.full_name || "Customer"}
                  </strong>

                  <p>
                    Status: {customer.status} · Type:{" "}
                    {customer.account_type}
                  </p>

                  <p>
                    Account created:{" "}
                    {new Date(customer.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label>
                    Test balance
                    <input
                      id={`balance-${customer.id}`}
                      type="number"
                      step="0.01"
                      defaultValue={customer.balance}
                    />
                  </label>

                  <button
                    className="primary-button"
                    onClick={() => {
                      const value = document.getElementById(
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
                        customer.status === "active"
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
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Customer Support</h2>

        {messages.length === 0 ? (
          <p>No support messages.</p>
        ) : (
          messages.map((item) => (
            <div className="notification" key={item.id}>
              <h3>
                {item.subject || "Customer Support"}
              </h3>

              <p>
                <strong>Customer:</strong>{" "}
                {item.profiles?.full_name || "Customer"}
              </p>

              <p>
                <strong>Message:</strong>
              </p>

              <p>{item.message}</p>

              {item.reply && (
                <p>
                  <strong>Current reply:</strong> {item.reply}
                </p>
              )}

              <p>
                <strong>Status:</strong> {item.status}
              </p>

              <textarea
                id={`reply-${item.id}`}
                rows="4"
                placeholder="Write your reply..."
              />

              <button
                className="primary-button"
                onClick={() => {
                  const value = document.getElementById(
                    `reply-${item.id}`
                  ).value;

                  replyToMessage(item.id, value);
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
          Account balances and account controls in this administrator
          interface are for testing and development and do not represent
          actual bank funds.
        </p>
      </section>
    </main>
  );
}
