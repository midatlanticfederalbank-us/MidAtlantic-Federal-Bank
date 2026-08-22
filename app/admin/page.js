"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminDashboard() {
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setNotice("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    // Confirm administrator
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

    // Load pending customers
    const {
      data: pendingData,
      error: pendingError,
    } = await supabase
      .from("profiles")
      .select("id, full_name, approval_status, created_at")
      .eq("role", "customer")
      .eq("approval_status", "pending")
      .order("created_at", { ascending: false });

    if (pendingError) {
      setNotice(pendingError.message);
      setLoading(false);
      return;
    }

    // Load customer accounts
    const {
      data: accountData,
      error: accountError,
    } = await supabase
      .from("customer_accounts")
      .select(
        "id, user_id, balance, status, account_type, account_number, created_at"
      )
      .order("created_at", { ascending: false });

    if (accountError) {
      setNotice(accountError.message);
      setLoading(false);
      return;
    }

    // Load support messages
    const {
      data: messageData,
      error: messageError,
    } = await supabase
      .from("support_messages")
      .select(
        "id, user_id, subject, message, reply, status, created_at, replied_at"
      )
      .order("created_at", { ascending: false });

    if (messageError) {
      setNotice(messageError.message);
      setLoading(false);
      return;
    }

    setPendingCustomers(pendingData || []);
    setAccounts(accountData || []);
    setMessages(messageData || []);
    setLoading(false);
  }

  function generateAccountNumber() {
    const randomPart = Math.floor(
      1000000000 + Math.random() * 9000000000
    );

    return String(randomPart);
  }

  async function approveCustomer(customerId) {
    setNotice("Approving customer...");

    // Check whether the customer already has an account
    const {
      data: existingAccount,
      error: existingError,
    } = await supabase
      .from("customer_accounts")
      .select("id, account_number")
      .eq("user_id", customerId)
      .maybeSingle();

    if (existingError) {
      setNotice(existingError.message);
      return;
    }

    let accountNumber =
      existingAccount?.account_number ||
      generateAccountNumber();

    // Create account if customer doesn't have one
    if (!existingAccount) {
      const { error: accountError } =
        await supabase
          .from("customer_accounts")
          .insert({
            user_id: customerId,
            account_number: accountNumber,
            balance: 0,
            status: "active",
            account_type: "checking",
          });

      if (accountError) {
        setNotice(accountError.message);
        return;
      }
    }

    // Approve customer
    const { error: approvalError } =
      await supabase
        .from("profiles")
        .update({
          approval_status: "approved",
        })
        .eq("id", customerId);

    if (approvalError) {
      setNotice(approvalError.message);
      return;
    }

    setNotice(
      `Customer approved. Account No: ${accountNumber}`
    );

    await loadData();
  }

  async function updateBalance(accountId) {
    const input = document.getElementById(
      `balance-${accountId}`
    );

    if (!input) return;

    const newBalance = Number(input.value);

    if (Number.isNaN(newBalance)) {
      setNotice("Please enter a valid balance.");
      return;
    }

    const { error } = await supabase
      .from("customer_accounts")
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq("id", accountId);

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice("Account balance updated.");
    await loadData();
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", account.id);

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice(
      newStatus === "frozen"
        ? "Account frozen."
        : "Account activated."
    );

    await loadData();
  }

  async function sendReply(messageId) {
    const input = document.getElementById(
      `reply-${messageId}`
    );

    if (!input || !input.value.trim()) {
      setNotice("Please enter a reply.");
      return;
    }

    const { error } = await supabase
      .from("support_messages")
      .update({
        reply: input.value.trim(),
        status: "replied",
        replied_at: new Date().toISOString(),
      })
      .eq("id", messageId);

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice("Reply sent successfully.");
    await loadData();
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main>
        <span className="real-badge">ADMIN</span>
        <h1>Administrator Dashboard</h1>
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

          <p>
            Customer accounts and support management.
          </p>
        </div>

        <button
          onClick={logout}
          className="primary-button"
        >
          Sign Out
        </button>
      </div>

      {notice && (
        <div className="notification">
          <strong>{notice}</strong>
        </div>
      )}

      {/* PENDING CUSTOMERS */}

      <section>
        <h2>Pending Customers</h2>

        {pendingCustomers.length === 0 ? (
          <div className="notification">
            <p>No pending customers.</p>
          </div>
        ) : (
          <div className="transaction-list">
            {pendingCustomers.map((customer) => (
              <div
                className="transaction"
                key={customer.id}
              >
                <div>
                  <strong>
                    {customer.full_name ||
                      "Customer"}
                  </strong>

                  <p>
                    Registration awaiting
                    administrator approval.
                  </p>

                  <p>
                    Submitted:{" "}
                    {new Date(
                      customer.created_at
                    ).toLocaleDateString()}
                  </p>
                </div>

                <button
                  className="primary-button"
                  onClick={() =>
                    approveCustomer(customer.id)
                  }
                >
                  Approve Customer
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CUSTOMER ACCOUNTS */}

      <section>
        <h2>Customer Accounts</h2>

        {accounts.length === 0 ? (
          <div className="notification">
            <p>No customer accounts found.</p>
          </div>
        ) : (
          <div className="transaction-list">
            {accounts.map((account) => (
              <div
                className="transaction"
                key={account.id}
              >
                <div>
                  <strong>
                    Customer Account
                  </strong>

                  <p>
                    <strong>Account No:</strong>{" "}
                    {account.account_number ||
                      "Not assigned"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {account.status}
                  </p>

                  <p>
                    <strong>Account type:</strong>{" "}
                    {account.account_type}
                  </p>

                  <p>
                    <strong>Current balance:</strong>{" "}
                    $
                    {Number(
                      account.balance
                    ).toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>
                </div>

                <div>
                  <label>
                    Update test balance

                    <input
                      id={`balance-${account.id}`}
                      type="number"
                      step="0.01"
                      defaultValue={
                        account.balance
                      }
                    />
                  </label>

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
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CUSTOMER SUPPORT */}

      <section>
        <h2>Customer Support</h2>

        {messages.length === 0 ? (
          <div className="notification">
            <p>No support messages.</p>
          </div>
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

              <p>
                <strong>Status:</strong>{" "}
                {item.status}
              </p>

              {item.reply && (
                <p>
                  <strong>Current reply:</strong>{" "}
                  {item.reply}
                </p>
              )}

              <textarea
                id={`reply-${item.id}`}
                rows="4"
                placeholder="Write your reply..."
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

      {/* SECURITY NOTICE */}

      <section className="real-notice">
        <h2>Security Warning</h2>

        <p>
          ⛔ Never share your password, PIN,
          verification codes, or other sensitive
          account information with anyone. Our
          support team will never ask you to
          disclose your password or security
          codes.
        </p>
  );
}
