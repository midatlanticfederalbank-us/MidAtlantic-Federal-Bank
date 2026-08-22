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

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileError) {
      setNotice(profileError.message);
      setLoading(false);
      return;
    }

    if (profile?.role !== "admin") {
      window.location.href = "/dashboard";
      return;
    }

    await loadPendingCustomers();
    await loadAccounts();
    await loadMessages();

    setLoading(false);
  }

  async function loadPendingCustomers() {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, full_name, role, approval_status, created_at"
      )
      .eq("role", "customer")
      .eq("approval_status", "pending")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      setNotice(
        "Pending customers: " + error.message
      );
      return;
    }

    setPendingCustomers(data || []);
  }

  async function loadAccounts() {
    const { data, error } = await supabase
      .from("customer_accounts")
      .select(
        "id, user_id, balance, status, account_type, account_number, created_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      setNotice(
        "Customer accounts: " + error.message
      );
      return;
    }

    setAccounts(data || []);
  }

  async function loadMessages() {
    const { data, error } = await supabase
      .from("support_messages")
      .select(
        "id, user_id, subject, message, reply, status, created_at, replied_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      setNotice(
        "Support messages: " + error.message
      );
      return;
    }

    setMessages(data || []);
  }

  function generateAccountNumber() {
    return String(
      Math.floor(
        1000000000 +
          Math.random() * 9000000000
      )
    );
  }

  async function approveCustomer(customer) {
    setNotice("Approving customer...");

    const {
      data: existingAccount,
      error: existingError,
    } = await supabase
      .from("customer_accounts")
      .select("id, account_number")
      .eq("user_id", customer.id)
      .maybeSingle();

    if (existingError) {
      setNotice(existingError.message);
      return;
    }

    let accountNumber =
      existingAccount?.account_number ||
      generateAccountNumber();

    if (!existingAccount) {
      const { error: createError } =
        await supabase
          .from("customer_accounts")
          .insert({
            user_id: customer.id,
            account_number: accountNumber,
            balance: 0,
            status: "active",
            account_type: "checking",
          });

      if (createError) {
        setNotice(createError.message);
        return;
      }
    }

    const { error: approvalError } =
      await supabase
        .from("profiles")
        .update({
          approval_status: "approved",
        })
        .eq("id", customer.id);

    if (approvalError) {
      setNotice(approvalError.message);
      return;
    }

    setNotice(
      "Customer approved. Account No: " +
        accountNumber
    );

    await loadData();
  }

  async function updateBalance(account) {
    const input = document.getElementById(
      "balance-" + account.id
    );

    if (!input) return;

    const balance = Number(input.value);

    if (!Number.isFinite(balance)) {
      setNotice("Enter a valid balance.");
      return;
    }

    const { error } = await supabase
      .from("customer_accounts")
      .update({
        balance: balance,
        updated_at: new Date().toISOString(),
      })
      .eq("id", account.id);

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice("Account balance updated.");

    await loadAccounts();
  }

  async function toggleAccount(account) {
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

    await loadAccounts();
  }

  async function sendReply(message) {
    const input = document.getElementById(
      "reply-" + message.id
    );

    if (!input || !input.value.trim()) {
      setNotice("Write a reply first.");
      return;
    }

    const { error } = await supabase
      .from("support_messages")
      .update({
        reply: input.value.trim(),
        status: "replied",
        replied_at: new Date().toISOString(),
      })
      .eq("id", message.id);

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
        <span className="real-badge">
          ADMIN
        </span>

        <h1>Administrator Dashboard</h1>

        <p>
          Loading administrator dashboard...
        </p>
      </main>
    );
  }

  return (
    <main>
      <div className="dashboard-header">
        <div>
          <span className="real-badge">
            ADMIN
          </span>

          <h1>
            Administrator Dashboard
          </h1>

          <p>
            Customer accounts and support
            management.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={logout}
        >
          Sign Out
        </button>
      </div>

      {notice && (
        <div className="notification">
          <p>{notice}</p>
        </div>
      )}

      {/* PENDING CUSTOMERS */}

      <section>
        <h2>Pending Customers</h2>

        {pendingCustomers.length === 0 ? (
          <div className="notification">
            <p>
              No pending customers.
            </p>
          </div>
        ) : (
          <div className="transaction-list">
            {pendingCustomers.map(
              (customer) => (
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
                      Approval status:{" "}
                      <strong>
                        {customer.approval_status}
                      </strong>
                    </p>

                    <p>
                      Registered:{" "}
                      {new Date(
                        customer.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    className="primary-button"
                    onClick={() =>
                      approveCustomer(
                        customer
                      )
                    }
                  >
                    Approve Customer
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* CUSTOMER ACCOUNTS */}

      <section>
        <h2>Customer Accounts</h2>

        {accounts.length === 0 ? (
          <div className="notification">
            <p>
              No customer accounts found.
            </p>
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
                    <strong>
                      Account No:
                    </strong>{" "}
                    {account.account_number ||
                      "Not assigned"}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {account.status}
                  </p>

                  <p>
                    <strong>
                      Account type:
                    </strong>{" "}
                    {account.account_type}
                  </p>

                  <p>
                    <strong>
                      Balance:
                    </strong>{" "}
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
                    Update balance

                    <input
                      id={
                        "balance-" +
                        account.id
                      }
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
                      updateBalance(
                        account
                      )
                    }
                  >
                    Update Balance
                  </button>

                  <button
                    className="primary-button"
                    onClick={() =>
                      toggleAccount(
                        account
                      )
                    }
                  >
                    {account.status ===
                    "active"
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
            <p>
              No support messages.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              className="notification"
              key={message.id}
            >
              <h3>
                {message.subject ||
                  "Customer Support"}
              </h3>

              <p>
                <strong>
                  Customer message:
                </strong>
              </p>

              <p>
                {message.message}
              </p>

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {message.status}
              </p>

              {message.reply && (
                <p>
                  <strong>
                    Current reply:
                  </strong>{" "}
                  {message.reply}
                </p>
              )}

              <textarea
                id={
                  "reply-" +
                  message.id
                }
                rows="4"
                placeholder="Write your reply..."
              />

              <button
                className="primary-button"
                onClick={() =>
                  sendReply(message)
                }
              >
                Send Reply
              </button>
            </div>
          ))
        )}
      </section>

      {/* SECURITY WARNING */}

      <section className="real-notice">
        <h2>
          ⛔ Security Warning
        </h2>

        <p>
          Never share your password, PIN,
          verification codes, or other
          sensitive account information
          with anyone. Support staff will
          never ask you to disclose your
          password or security codes.
        </p>

        
