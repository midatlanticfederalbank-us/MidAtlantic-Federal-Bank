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
    checkAdminAndLoad();
  }, []);

  async function checkAdminAndLoad() {
    setLoading(true);
    setNotice("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: isAdmin, error: adminError } =
      await supabase.rpc("is_admin");

    if (adminError) {
      setNotice(adminError.message);
      setLoading(false);
      return;
    }

    if (!isAdmin) {
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
      setNotice(error.message);
      return;
    }

    setPendingCustomers(data || []);
  }

  async function loadAccounts() {
    const { data, error } = await supabase
      .from("customer_accounts")
      .select(
        "id, user_id, account_number, balance, status, account_type, created_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      setNotice(error.message);
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
      setNotice(error.message);
      return;
    }

    setMessages(data || []);
  }

  function generateAccountNumber() {
    const number = Math.floor(
      Math.random() * 1000000000
    );

    return String(number).padStart(9, "0");
  }

  async function createUniqueAccountNumber() {
    for (let attempt = 0; attempt < 10; attempt++) {
      const accountNumber =
        generateAccountNumber();

      const { data, error } = await supabase
        .from("customer_accounts")
        .select("id")
        .eq(
          "account_number",
          accountNumber
        )
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return accountNumber;
      }
    }

    throw new Error(
      "Unable to generate a unique account number."
    );
  }

  async function approveCustomer(customer) {
    try {
      setNotice(
        "Approving customer and creating account..."
      );

      const { data: existingAccount, error: existingError } =
        await supabase
          .from("customer_accounts")
          .select(
            "id, account_number"
          )
          .eq("user_id", customer.id)
          .maybeSingle();

      if (existingError) {
        setNotice(existingError.message);
        return;
      }

      let accountNumber =
        existingAccount?.account_number;

      if (!existingAccount) {
        accountNumber =
          await createUniqueAccountNumber();

        const { error: accountError } =
          await supabase
            .from("customer_accounts")
            .insert({
              user_id: customer.id,
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
        `Congratulations ${customer.full_name || "Customer"}! ` +
        `Your account has been approved. Account No: ${accountNumber}`
      );

      await loadPendingCustomers();
      await loadAccounts();
    } catch (error) {
      setNotice(error.message);
    }
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
      `reply-${message.id}`
    );

    if (!input || !input.value.trim()) {
      setNotice("Please write a reply first.");
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

          <h1>Administrator Dashboard</h1>

          <p>
            Customer accounts and support management.
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
                    approveCustomer(customer)
                  }
                >
                  Approve Customer
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

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
                    <strong>
                      Account No:
                    </strong>{" "}
                    {account.account_number ||
                      "Not assigned"}
                  </p>

                  <p>
                    <strong>
                      Account type:
                    </strong>{" "}
                    {account.account_type ||
                      "Checking"}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {account.status ||
                      "active"}
                  </p>
                </div>

                <button
                  className="primary-button"
                  onClick={() =>
                    toggleAccount(account)
                  }
                >
                  {account.status ===
                  "active"
                    ? "Freeze Account"
                    : "Unfreeze Account"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Customer Support</h2>

        {messages.length === 0 ? (
          <div className="notification">
            <p>No support messages.</p>
          </div>
        ) : (
          <div className="transaction-list">
            {messages.map((message) => (
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

                <p>{message.message}</p>

                <p>
                  <strong>
                    Status:
                  </strong>{" "}
                  {message.status}
                </p>

                {message.reply && (
                  <p>
                    <strong>
                      Support reply:
                    </strong>{" "}
                    {message.reply}
                  </p>
                )}

                <textarea
                  id={`reply-${message.id}`}
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
            ))}
          </div>
        )}
      </section>

      <section className="real-notice">
        <h2>⛔ Security Warning</h2>

        <p>
          Never share your password, PIN,
          verification codes, or other
          sensitive account information with
          anyone. Our support team will never
          ask you to disclose your password
          or security codes.
        </p>

        <p>
          Account information is provided for
          informational purposes on this
          website.
        </p>
      </section>
    </main>
  );
}
