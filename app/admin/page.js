"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notice, setNotice] = useState("Loading...");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
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

    const { data: accountData, error: accountError } =
      await supabase
        .from("customer_accounts")
        .select(
          "id,user_id,balance,status,account_type,created_at"
        )
        .order("created_at", {
          ascending: false
        });

    if (accountError) {
      setNotice(accountError.message);
      return;
    }

    const { data: messageData, error: messageError } =
      await supabase
        .from("support_messages")
        .select(
          "id,user_id,subject,message,reply,status,created_at,replied_at"
        )
        .order("created_at", {
          ascending: false
        });

    if (messageError) {
      setNotice(messageError.message);
      return;
    }

    setAccounts(accountData || []);
    setMessages(messageData || []);
    setNotice("");
  }

  async function updateBalance(id) {
    const input =
      document.getElementById(
        `balance-${id}`
      );

    const { error } = await supabase
      .from("customer_accounts")
      .update({
        balance: Number(input.value),
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice("Balance updated successfully.");
    loadData();
  }

  async function toggleFreeze(account) {
    const newStatus =
      account.status === "active"
        ? "frozen"
        : "active";

    const { error } = await supabase
      .from("customer_accounts")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq("id", account.id);

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice("Account status updated.");
    loadData();
  }

  async function sendReply(id) {
    const input =
      document.getElementById(`reply-${id}`);

    if (!input.value.trim()) return;

    const { error } = await supabase
      .from("support_messages")
      .update({
        reply: input.value.trim(),
        status: "replied",
        replied_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice("Reply sent.");
    loadData();
  }

  return (
    <main>
      <span className="real-badge">ADMIN</span>

      <h1>Administrator Dashboard</h1>

      {notice && <p>{notice}</p>}

      <section>
        <h2>Customer Accounts</h2>

        {accounts.length === 0 ? (
          <p>No customer accounts found.</p>
        ) : (
          accounts.map((account) => (
            <div
              className="notification"
              key={account.id}
            >
              <h3>Customer Account</h3>

              <p>
                <strong>User ID:</strong>{" "}
                {account.user_id}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {account.status}
              </p>

              <p>
                <strong>Type:</strong>{" "}
                {account.account_type}
              </p>

              <p>
                <strong>Test Balance:</strong>{" "}
                $
                {Number(account.balance).toFixed(
                  2
                )}
              </p>

              <input
                id={`balance-${account.id}`}
                type="number"
                step="0.01"
                defaultValue={account.balance}
              />

              <button
                className="primary-button"
                onClick={() =>
                  updateBalance(account.id)
                }
              >
                Update Balance
              </button>

              <button
                className="primary-button"
                onClick={() =>
                  toggleFreeze(account)
                }
              >
                {account.status === "active"
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

              <p>{item.message}</p>

              <p>
                <strong>Status:</strong>{" "}
                {item.status}
              </p>

              {item.reply && (
                <p>
                  <strong>Reply:</strong>{" "}
                  {item.reply}
                </p>
              )}

              <textarea
                id={`reply-${item.id}`}
                rows="4"
                placeholder="Write a reply..."
              />

              <button
                className="primary-button"
                onClick={() =>
                  sendReply(item.id)
                }
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
          Account balances and controls are for
          testing and development only.
        </p>
      </section>
    </main>
  );
}
