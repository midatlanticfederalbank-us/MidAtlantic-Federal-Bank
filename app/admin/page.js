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
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

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
      loadTransactions(),
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
      .order("created_at", { ascending: false });

    if (error) {
      setNotice(error.message);
      return;
    }

    setPending(data || []);
  }

  async function loadAccounts() {
    const { data: accountData, error: accountError } =
      await supabase
        .from("customer_accounts")
        .select(
          "id, user_id, account_number, account_type, status, balance, created_at"
        )
        .order("created_at", { ascending: false });

    if (accountError) {
      setNotice(accountError.message);
      return;
    }

    if (!accountData?.length) {
      setAccounts([]);
      return;
    }

    const userIds = accountData.map(
      (account) => account.user_id
    );

    const { data: profileData, error: profileError } =
      await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

    if (profileError) {
      setNotice(profileError.message);
      return;
    }

    const profileMap = {};

    (profileData || []).forEach((profile) => {
      profileMap[profile.id] = profile;
    });

    const combined = accountData.map((account) => ({
      ...account,
      customerName:
        profileMap[account.user_id]?.full_name ||
        "Customer",
      customerEmail:
        profileMap[account.user_id]?.email ||
        "",
    }));

    setAccounts(combined);
  }

  async function loadMessages() {
    const { data, error } = await supabase
      .from("support_messages")
      .select(
        "id, user_id, subject, message, reply, status, created_at, replied_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setNotice(error.message);
      return;
    }

    setMessages(data || []);
  }

  async function loadTransactions() {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        "id, account_id, transaction_type, amount, description, transaction_date"
      )
      .order("transaction_date", {
        ascending: false,
      });

    if (error) {
      setNotice(error.message);
      return;
    }

    setTransactions(data || []);
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
    setNotice("Approving customer...");

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

      if (!customer.email) {
        throw new Error(
          "This customer does not have an email address."
        );
      }

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
          }),
        }
      );

      const emailResult =
        await emailResponse.json();

      if (!emailResponse.ok) {
        throw new Error(
          emailResult.error ||
            "The approval email could not be sent."
        );
      }

      setNotice(
        "Customer approved successfully."
      );

      await loadPending();
      await loadAccounts();
    } catch (error) {
      console.error("APPROVAL ERROR:", error);

      setNotice(
        error?.message ||
          "Unable to approve customer."
      );
    }
  }

  async function addTransaction(account) {
    const type = window.prompt(
      "Enter transaction type: credit or debit",
      "credit"
    );

    if (!type) return;

    const transactionType =
      type.trim().toLowerCase();

    if (
      transactionType !== "credit" &&
      transactionType !== "debit"
    ) {
      setNotice(
        "Transaction type must be credit or debit."
      );
      return;
    }

    const value = window.prompt(
      `Enter ${transactionType} amount:`,
      "0.00"
    );

    if (value === null) return;

    const amount = Number(value);

    if (!Number.isFinite(amount) || amount <= 0) {
      setNotice("Enter a valid amount.");
      return;
    }

    const description =
      window.prompt(
        "Enter transaction description:",
        transactionType === "credit"
          ? "Incoming Payment"
          : "Service Payment"
      );

    if (!description?.trim()) {
      setNotice(
        "Transaction description is required."
      );
      return;
    }

    const { error } = await supabase
      .from("transactions")
      .insert({
        account_id: account.id,
        transaction_type: transactionType,
        amount,
        description: description.trim(),
        transaction_date:
          new Date().toISOString(),
      });

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice(
      `${transactionType === "credit" ? "Credit" : "Debit"} transaction added successfully.`
    );

    await loadAccounts();
    await loadTransactions();
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

  const activeAccounts = accounts.filter(
    (account) => account.status === "active"
  );

  const frozenAccounts = accounts.filter(
    (account) => account.status === "frozen"
  );

  const repliedMessages = messages.filter(
    (message) => message.status === "replied"
  );

  const openMessages = messages.filter(
    (message) => message.status !== "replied"
  );

  function formatMoney(value) {
    return Number(value || 0).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  function formatDate(value) {
    if (!value) return "Not available";

    return new Date(value).toLocaleString(
      "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  }

  if (loading) {
    return (
      <main>
        <span className="real-badge">
          ADMIN
        </span>

        <h1>Administrator Dashboard</h1>

        <p>Loading administration panel...</p>
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
            Customer, account and support
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

      <nav
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        <button
          className="primary-button"
          onClick={() =>
            setActiveSection("overview")
          }
        >
          Overview
        </button>

        <button
          className="primary-button"
          onClick={() =>
            setActiveSection("pending")
          }
        >
          Pending ({pending.length})
        </button>

        <button
          className="primary-button"
          onClick={() =>
            setActiveSection("accounts")
          }
        >
          Accounts ({accounts.length})
        </button>

        <button
          className="primary-button"
          onClick={() =>
            setActiveSection("support")
          }
        >
          Support ({openMessages.length})
        </button>
      </nav>

      {activeSection === "overview" && (
        <>
          <section>
            <h2>Overview</h2>

            <div className="dashboard-grid">
              <div className="notification">
                <h3>Pending Customers</h3>
                <h2>{pending.length}</h2>
              </div>

              <div className="notification">
                <h3>Active Accounts</h3>
                <h2>
                  {activeAccounts.length}
                </h2>
              </div>

              <div className="notification">
                <h3>Frozen Accounts</h3>
                <h2>
                  {frozenAccounts.length}
                </h2>
              </div>

              <div className="notification">
                <h3>Open Support</h3>
                <h2>
                  {openMessages.length}
                </h2>
              </div>
            </div>
          </section>

          <section>
            <h2>Recent Activity</h2>

            <div className="transaction-list">
              {transactions.length === 0 ? (
                <div className="notification">
                  <p>
                    No transactions recorded.
                  </p>
                </div>
              ) : (
                transactions
                  .slice(0, 5)
                  .map((transaction) => (
                    <div
                      className="transaction"
                      key={transaction.id}
                    >
                      <div>
                        <strong>
                          {transaction.description ||
                            "Transaction"}
                        </strong>

                        <p>
                          {transaction.transaction_type ===
                          "credit"
                            ? "+"
                            : "-"}
                          $
                          {formatMoney(
                            transaction.amount
                          )}
                        </p>

                        <p>
                          {formatDate(
                            transaction.transaction_date
                          )}
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>
        </>
      )}

      {activeSection === "pending" && (
        <section>
          <h2>Pending Customer Approvals</h2>

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
                      Email:{" "}
                      {customer.email ||
                        "Not available"}
                    </p>

                    <p>
                      Status:{" "}
                      {customer.approval_status}
                    </p>

                    <p>
                      Registered:{" "}
                      {formatDate(
                        customer.created_at
                      )}
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
      )}

      {activeSection === "accounts" && (
        <>
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
                        {account.customerName}
                      </strong>

                      <p>
                        Email:{" "}
                        {account.customerEmail ||
                          "Not available"}
                      </p>

                      <p>
                        Account No:{" "}
                        {account.account_number ||
                          "Not assigned"}
                      </p>

                      <p>
                        Account type:{" "}
                        {account.account_type ||
                          "Checking"}
                      </p>

                      <p>
                        Status:{" "}
                        {account.status ||
                          "active"}
                      </p>

                      <p>
                        Balance: $
                        {formatMoney(
                          account.balance
                        )}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <button
                        className="primary-button"
                        onClick={() =>
                          addTransaction(
                            account
                          )
                        }
                      >
                        Add Transaction
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

          <section>
            <h2>Recent Transactions</h2>

            <div className="transaction-list">
              {transactions.length === 0 ? (
                <div className="notification">
                  <p>
                    No transactions recorded.
                  </p>
                </div>
              ) : (
                transactions.map(
                  (transaction) => (
                    <div
                      className="transaction"
                      key={transaction.id}
                    >
                      <div>
                        <strong>
                          {transaction.description ||
                            "Transaction"}
                        </strong>

                        <p>
                          Type:{" "}
                          {
                            transaction.transaction_type
                          }
                        </p>

                        <p>
                          Amount:{" "}
                          {transaction.transaction_type ===
                          "credit"
                            ? "+"
                            : "-"}
                          $
                          {formatMoney(
                            transaction.amount
                          )}
                        </p>

                        <p>
                          Date:{" "}
                          {formatDate(
                            transaction.transaction_date
                          )}
                        </p>
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </section>
        </>
      )}

      {activeSection === "support" && (
        <section>
          <h2>Customer Support Inbox</h2>

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
                    <strong>Status:</strong>{" "}
                    {item.status === "replied"
                      ? "Replied"
                      : "Awaiting Reply"}
                  </p>

                  <p>
                    <strong>
                      Received:
                    </strong>{" "}
                    {formatDate(
                      item.created_at
                    )}
                  </p>

                  <hr />

                  <p>
                    <strong>
                      Customer Message
                    </strong>
                  </p>

                  <p>{item.message}</p>

                  {item.reply && (
                    <>
                      <hr />

                      <p>
                        <strong>
                          Your Support Reply
                        </strong>
                      </p>

                      <p>{item.reply}</p>

                      <p>
                        <strong>
                          Replied:
                        </strong>{" "}
                        {formatDate(
                          item.replied_at
                        )}
                      </p>
                    </>
                  )}

                  <textarea
                    id={`reply-${item.id}`}
                    rows="4"
                    placeholder={
                      item.reply
                        ? "Send another reply..."
                        : "Write your reply..."
                    }
                    style={{
                      width: "100%",
                      marginTop: "12px",
                    }}
                  />

                  <button
                    className="primary-button"
                    onClick={() =>
                      sendReply(item)
                    }
                  >
                    {item.reply
                      ? "Send Another Reply"
                      : "Reply to Customer"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

  <section className="real-notice">
  <h2>⛔ Security Warning</h2>

  <p>
    Never share your password, PIN, verification
    codes, or other sensitive account information
    with anyone. Our support team will never ask
    you to disclose your password or security codes.
  </p>
</section>
}
