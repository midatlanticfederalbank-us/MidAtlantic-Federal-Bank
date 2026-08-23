"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    loadAdmin();
  }, []);

  async function loadAdmin() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: admin, error } =
      await supabase.rpc("is_admin");

    if (error || !admin) {
      window.location.href = "/dashboard";
      return;
    }

    await Promise.all([
      loadPending(),
      loadAccounts(),
      loadMessages(),
    ]);

    setLoading(false);
  }

  async function loadPending() {
    const { data, error } = await supabase
      .from("profiles")
      .select(
  "id, full_name, email, role, approval_status, created_at"
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

    setPending(data || []);
  }

  async function loadAccounts() {
    const { data, error } = await supabase
      .from("customer_accounts")
      .select(
        "id, user_id, account_number, account_type, status, balance, created_at"
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
    return String(
      Math.floor(Math.random() * 1000000000)
    ).padStart(9, "0");
  }

  async function getUniqueAccountNumber() {
    for (let i = 0; i < 20; i++) {
      const number = generateAccountNumber();

      const { data, error } = await supabase
        .from("customer_accounts")
        .select("id")
        .eq("account_number", number)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return number;
      }
    }

    throw new Error(
      "Unable to generate a unique account number."
    );
  }

  async function approveCustomer(customer) {
    setNotice("Creating customer account...");

    try {
      const { data: existing, error: existingError } =
        await supabase
          .from("customer_accounts")
          .select(
            "id, account_number, account_type, status"
          )
          .eq("user_id", customer.id)
          .maybeSingle();

      if (existingError) {
        throw new Error(existingError.message);
      }

      let accountNumber =
        existing?.account_number;

      if (!accountNumber) {
        accountNumber =
          await getUniqueAccountNumber();

        if (existing) {
          const { error } = await supabase
            .from("customer_accounts")
            .update({
              account_number: accountNumber,
              account_type:
                existing.account_type ||
                "checking",
              status: "active",
            })
            .eq("id", existing.id);

          if (error) {
            throw new Error(error.message);
          }
        } else {
          const { error } = await supabase
            .from("customer_accounts")
            .insert({
              user_id: customer.id,
              account_number: accountNumber,
              balance: 0,
              account_type: "checking",
              status: "active",
            });

          if (error) {
            throw new Error(error.message);
          }
        }
      }

      const { data: verified, error: verifyError } =
        await supabase
          .from("customer_accounts")
          .select(
            "id, account_number, account_type, status"
          )
          .eq("user_id", customer.id)
          .maybeSingle();

      if (verifyError) {
        throw new Error(verifyError.message);
      }

      if (!verified?.account_number) {
        throw new Error(
          "The account number could not be verified."
        );
      }

      const { error: approvalError } =
        await supabase
          .from("profiles")
          .update({
            approval_status: "approved",
          })
          .eq("id", customer.id);

      if (approvalError) {
        throw new Error(approvalError.message);
      }

      setNotice(
        `Congratulations ${
          customer.full_name || "Customer"
        }! Your account has been approved. Account No: ${
          verified.account_number
        }`
      );
if (customer.email) {
  const emailResponse = await fetch(
    "/api/send-approval-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customer.email,
        fullName:
          customer.full_name || "Customer",
        accountNumber:
          verified.account_number,
        accountType:
          verified.account_type || "checking",
      }),
    }
  );

  const emailResult =
    await emailResponse.json();

  if (!emailResponse.ok) {
    throw new Error(
      emailResult.error ||
        "Account approved, but the email could not be sent."
    );
  }
}
      await loadPending();
      await loadAccounts();
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function updateBalance(account) {
    const value = window.prompt(
      "Enter the new balance:",
      String(account.balance ?? 0)
    );

    if (value === null) return;

    const amount = Number(value);

    if (!Number.isFinite(amount) || amount < 0) {
      setNotice(
        "Please enter a valid balance."
      );
      return;
    }

    const { error } = await supabase
      .from("customer_accounts")
      .update({
        balance: amount,
      })
      .eq("id", account.id);

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice("Balance updated.");

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

  async function sendReply(item) {
    const input = document.getElementById(
      `reply-${item.id}`
    );

    if (!input?.value.trim()) {
      setNotice("Please enter a reply.");
      return;
    }

    const { error } = await supabase
      .from("support_messages")
      .update({
        reply: input.value.trim(),
        status: "replied",
        replied_at:
          new Date().toISOString(),
      })
      .eq("id", item.id);

    if (error) {
      setNotice(error.message);
      return;
    }

    input.value = "";

    setNotice("Reply sent.");

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

        <p>Loading...</p>
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

      <section>
        <h2>Pending Customers</h2>

        {pending.length === 0 ? (
          <div className="notification">
            <p>No pending customers.</p>
          </div>
        ) : (
          <div className="transaction-list">
            {pending.map((customer) => (
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
                    {customer.approval_status}
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

                  <p>
                    <strong>
                      Balance:
                    </strong>{" "}
                    $
                    {Number(
                      account.balance || 0
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
                  <button
                    className="primary-button"
                    onClick={() =>
                      updateBalance(account)
                    }
                  >
                    Update Balance
                  </button>

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
            {messages.map((item) => (
              <div
                className="notification"
                key={item.id}
              >
                <h3>
                  {item.subject ||
                    "Customer Support"}
                </h3>

                <p>
                  <strong>
                    Customer message:
                  </strong>
                </p>

                <p>{item.message}</p>

                <p>
                  <strong>
                    Status:
                  </strong>{" "}
                  {item.status}
                </p>

                {item.reply && (
                  <p>
                    <strong>
                      Support reply:
                    </strong>{" "}
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
                    sendReply(item)
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
        <h2>
          ⛔ Security Warning
        </h2>

        <p>
          Never share your password, PIN,
          verification codes, or other
          sensitive account information
          with anyone.
        </p>

        <p>
          Account information is provided
          for informational purposes on this
          website.
        </p>
      </section>
    </main>
  );
}
