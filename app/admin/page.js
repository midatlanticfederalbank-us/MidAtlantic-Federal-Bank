"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (n) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  // Admin-controlled effective Account Created date.
  // Original created_at is never changed.
  const [createdDateDrafts, setCreatedDateDrafts] = useState({});
  const [savingCreatedDate, setSavingCreatedDate] = useState(null);

  useEffect(() => {
    loadAdmin();
  }, []);

  async function loadAdmin() {
    setLoading(true);
    setNotice("");

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
    /*
      Do not use a Supabase profiles relationship here.
      Your schema does not expose a customer_accounts -> profiles
      relationship in the schema cache, so the two tables are
      loaded separately and combined by user_id.
    */
    const {
      data: accountData,
      error: accountError,
    } = await supabase
      .from("customer_accounts")
      .select(
        "id, user_id, account_number, account_type, status, balance, created_at, effective_created_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (accountError) {
      setNotice(accountError.message);
      return;
    }

    if (!accountData?.length) {
      setAccounts([]);
      setCreatedDateDrafts({});
      return;
    }

    const userIds = [
      ...new Set(
        accountData
          .map((account) => account.user_id)
          .filter(Boolean)
      ),
    ];

    let profileMap = {};

    if (userIds.length > 0) {
      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      if (profileError) {
        setNotice(profileError.message);
        return;
      }

      (profileData || []).forEach((profile) => {
        profileMap[profile.id] = profile;
      });
    }

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

    const drafts = {};

    combined.forEach((account) => {
      drafts[account.id] = toDateTimeLocal(
        account.effective_created_at ||
          account.created_at
      );
    });

    setCreatedDateDrafts(drafts);
  }

  async function loadMessages() {
    const {
      data: messageData,
      error: messageError,
    } = await supabase
      .from("support_messages")
      .select(
        "id, user_id, sender, message, created_at"
      )
      .order("created_at", {
        ascending: true,
      });

    if (messageError) {
      console.error(
        "SUPPORT MESSAGE ERROR:",
        messageError
      );

      setNotice(messageError.message);
      return;
    }

    if (!messageData?.length) {
      setMessages([]);
      return;
    }

    const userIds = [
      ...new Set(
        messageData
          .map((message) => message.user_id)
          .filter(Boolean)
      ),
    ];

    let profileMap = {};

    if (userIds.length > 0) {
      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      if (profileError) {
        setNotice(profileError.message);
        return;
      }

      (profileData || []).forEach((profile) => {
        profileMap[profile.id] = profile;
      });
    }

    const combinedMessages = messageData.map(
      (message) => ({
        ...message,
        customerName:
          profileMap[message.user_id]?.full_name ||
          "Customer",
        customerEmail:
          profileMap[message.user_id]?.email ||
          "",
      })
    );

    setMessages(combinedMessages);
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
      const {
        data: existing,
        error: existingError,
      } = await supabase
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

      const {
        data: verified,
        error: verifyError,
      } = await supabase
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

      const {
        error: approvalError,
      } = await supabase
        .from("profiles")
        .update({
          approval_status: "approved",
        })
        .eq("id", customer.id);

      if (approvalError) {
        throw new Error(approvalError.message);
      }

      setNotice(
        "Customer approved successfully."
      );

      await loadPending();
      await loadAccounts();
    } catch (error) {
      console.error(
        "APPROVAL ERROR:",
        error
      );

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

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
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
      `${
        transactionType === "credit"
          ? "Credit"
          : "Debit"
      } transaction added successfully.`
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
        updated_at:
          new Date().toISOString(),
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

  function updateCreatedDateDraft(
    accountId,
    value
  ) {
    setCreatedDateDrafts((current) => ({
      ...current,
      [accountId]: value,
    }));
  }

  async function saveCreatedDate(account) {
    const localValue =
      createdDateDrafts[account.id];

    if (!localValue) {
      setNotice(
        "Please enter a valid Account Created date and time."
      );
      return;
    }

    const parsed = new Date(localValue);

    if (Number.isNaN(parsed.getTime())) {
      setNotice(
        "Please enter a valid Account Created date and time."
      );
      return;
    }

    if (parsed > new Date()) {
      setNotice(
        "The effective Account Created date cannot be in the future."
      );
      return;
    }

    setSavingCreatedDate(account.id);
    setNotice("Saving Account Created date...");

    const { error } = await supabase
      .from("customer_accounts")
      .update({
        effective_created_at:
          parsed.toISOString(),
      })
      .eq("id", account.id);

    if (error) {
      setNotice(error.message);
      setSavingCreatedDate(null);
      return;
    }

    setNotice(
      `Account Created date updated for ${
        account.customerName || "Customer"
      }.`
    );

    setSavingCreatedDate(null);

    await loadAccounts();
  }

  async function clearCreatedDateOverride(
    account
  ) {
    setSavingCreatedDate(account.id);
    setNotice(
      "Restoring the original Account Created timestamp..."
    );

    const { error } = await supabase
      .from("customer_accounts")
      .update({
        effective_created_at: null,
      })
      .eq("id", account.id);

    if (error) {
      setNotice(error.message);
      setSavingCreatedDate(null);
      return;
    }

    setNotice(
      `Original Account Created timestamp restored for ${
        account.customerName || "Customer"
      }.`
    );

    setSavingCreatedDate(null);

    await loadAccounts();
  }

  async function sendReply(item) {
    const input = document.getElementById(
      `reply-${item.id}`
    );

    const reply = input?.value?.trim();

    if (!reply) {
      setNotice("Please enter a reply.");
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setNotice("Your session has expired.");
      return;
    }

    setNotice("Sending support reply...");

    /*
      IMPORTANT:
      The database function must have this signature:

      admin_send_support_reply(
        p_message text,
        p_user_id uuid
      )

      We do not directly insert support replies from
      the browser.
    */
    const { error } = await supabase.rpc(
      "admin_send_support_reply",
      {
        p_message: reply,
        p_user_id: item.user_id,
      }
    );

    if (error) {
      console.error(
        "ADMIN SUPPORT REPLY ERROR:",
        error
      );

      setNotice(error.message);
      return;
    }

    if (input) {
      input.value = "";
    }

    setNotice("Reply sent successfully.");

    await loadMessages();
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const activeAccounts = accounts.filter(
    (account) =>
      account.status === "active"
  );

  const frozenAccounts = accounts.filter(
    (account) =>
      account.status === "frozen"
  );

  const customerMessages =
    messages.filter(
      (message) =>
        message.sender === "customer"
    );

  if (loading) {
    return (
      <main>
        <span className="real-badge">
          ADMIN
        </span>

        <h1>
          Administrator Dashboard
        </h1>

        <p>
          Loading administration panel...
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
          Support ({customerMessages.length})
        </button>
      </nav>

      {activeSection === "overview" && (
        <>
          <section>
            <h2>Overview</h2>

            <div className="dashboard-grid">
              <div className="notification">
                <h3>
                  Pending Customers
                </h3>

                <h2>
                  {pending.length}
                </h2>
              </div>

              <div className="notification">
                <h3>
                  Active Accounts
                </h3>

                <h2>
                  {activeAccounts.length}
                </h2>
              </div>

              <div className="notification">
                <h3>
                  Frozen Accounts
                </h3>

                <h2>
                  {frozenAccounts.length}
                </h2>
              </div>

              <div className="notification">
                <h3>
                  Customer Messages
                </h3>

                <h2>
                  {customerMessages.length}
                </h2>
              </div>
            </div>
          </section>

          <section>
            <h2>
              Recent Activity
            </h2>

            <div className="transaction-list">
              {transactions.length === 0 ? (
                <div className="notification">
                  <p>
                    No transactions
                    recorded.
                  </p>
                </div>
              ) : (
                transactions
                  .slice(0, 5)
                  .map(
                    (transaction) => (
                      <div
                        className="transaction"
                        key={
                          transaction.id
                        }
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
                    )
                  )
              )}
            </div>
          </section>
        </>
      )}

      {activeSection === "pending" && (
        <section>
          <h2>
            Pending Customer
            Approvals
          </h2>

          {pending.length === 0 ? (
            <div className="notification">
              <p>
                No pending customers.
              </p>
            </div>
          ) : (
            <div className="transaction-list">
              {pending.map(
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
                        Email:{" "}
                        {customer.email ||
                          "Not available"}
                      </p>

                      <p>
                        Status:{" "}
                        {
                          customer.approval_status
                        }
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
      )}

      {activeSection === "accounts" && (
        <>
          <section>
            <h2>
              Customer Accounts
            </h2>

            {accounts.length === 0 ? (
              <div className="notification">
                <p>
                  No customer accounts
                  found.
                </p>
              </div>
            ) : (
              <div className="transaction-list">
                {accounts.map(
                  (account) => {
                    const hasDateOverride =
                      Boolean(
                        account.effective_created_at
                      );

                    return (
                      <div
                        className="transaction"
                        key={account.id}
                      >
                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
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

                          <p>
                            <strong>
                              Original Created:
                            </strong>{" "}
                            {formatDate(
                              account.created_at
                            )}
                          </p>

                          <p>
                            <strong>
                              Displayed Created:
                            </strong>{" "}
                            {formatDate(
                              account.effective_created_at ||
                                account.created_at
                            )}
                            {hasDateOverride
                              ? " (admin override)"
                              : " (original)"}
                          </p>

                          <div
                            style={{
                              marginTop: "14px",
                              paddingTop: "14px",
                              borderTop:
                                "1px solid rgba(0,0,0,0.08)",
                            }}
                          >
                            <label
                              htmlFor={`created-date-${account.id}`}
                              style={{
                                display:
                                  "block",
                                fontWeight: 700,
                                marginBottom:
                                  "7px",
                              }}
                            >
                              Account Created
                              Date & Time
                            </label>

                            <input
                              id={`created-date-${account.id}`}
                              type="datetime-local"
                              value={
                                createdDateDrafts[
                                  account.id
                                ] || ""
                              }
                              onChange={(
                                event
                              ) =>
                                updateCreatedDateDraft(
                                  account.id,
                                  event.target
                                    .value
                                )
                              }
                              style={{
                                width:
                                  "100%",
                                maxWidth:
                                  "360px",
                                padding:
                                  "10px",
                                border:
                                  "1px solid #ccc",
                                borderRadius:
                                  "8px",
                              }}
                            />

                            <div
                              style={{
                                display:
                                  "flex",
                                flexWrap:
                                  "wrap",
                                gap: "8px",
                                marginTop:
                                  "8px",
                              }}
                            >
                              <button
                                type="button"
                                className="primary-button"
                                onClick={() =>
                                  saveCreatedDate(
                                    account
                                  )
                                }
                                disabled={
                                  savingCreatedDate ===
                                  account.id
                                }
                              >
                                {savingCreatedDate ===
                                account.id
                                  ? "Saving..."
                                  : "Save Created Date"}
                              </button>

                              {hasDateOverride && (
                                <button
                                  type="button"
                                  className="primary-button"
                                  onClick={() =>
                                    clearCreatedDateOverride(
                                      account
                                    )
                                  }
                                  disabled={
                                    savingCreatedDate ===
                                    account.id
                                  }
                                >
                                  Use Original Date
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            flexDirection:
                              "column",
                            gap: "8px",
                            minWidth:
                              "190px",
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
                    );
                  }
                )}
              </div>
            )}
          </section>

          <section>
            <h2>
              Recent Transactions
            </h2>

            <div className="transaction-list">
              {transactions.length === 0 ? (
                <div className="notification">
                  <p>
                    No transactions
                    recorded.
                  </p>
                </div>
              ) : (
                transactions.map(
                  (transaction) => (
                    <div
                      className="transaction"
                      key={
                        transaction.id
                      }
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
          <h2>
            Customer Support Inbox
          </h2>

          {customerMessages.length ===
          0 ? (
            <div className="notification">
              <p>
                No customer support
                messages.
              </p>
            </div>
          ) : (
            <div className="transaction-list">
              {customerMessages.map(
                (item) => {
                  const replies =
                    messages.filter(
                      (message) =>
                        message.user_id ===
                          item.user_id &&
                        message.sender ===
                          "support" &&
                        new Date(
                          message.created_at
                        ) >
                          new Date(
                            item.created_at
                          )
                    );

                  const latestReply =
                    replies.length
                      ? replies[
                          replies.length - 1
                        ]
                      : null;

                  return (
                    <div
                      className="notification"
                      key={item.id}
                    >
                      <h3>
                        {item.customerName ||
                          "Customer"}
                      </h3>

                      <p>
                        <strong>
                          Email:
                        </strong>{" "}
                        {item.customerEmail ||
                          "Not available"}
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

                      <p>
                        {item.message}
                      </p>

                      {latestReply && (
                        <>
                          <hr />

                          <p>
                            <strong>
                              Support Reply
                            </strong>
                          </p>

                          <p>
                            {
                              latestReply.message
                            }
                          </p>

                          <p>
                            <strong>
                              Replied:
                            </strong>{" "}
                            {formatDate(
                              latestReply.created_at
                            )}
                          </p>
                        </>
                      )}

                      <textarea
                        id={`reply-${item.id}`}
                        rows="4"
                        placeholder="Write your support reply..."
                        style={{
                          width: "100%",
                          marginTop:
                            "12px",
                        }}
                      />

                      <button
                        className="primary-button"
                        onClick={() =>
                          sendReply(item)
                        }
                      >
                        Send Support Reply
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>
      )}

      <section className="real-notice">
        <h2>
          ⛔ Security Warning
        </h2>

        <p>
          Never share your password, PIN,
          verification codes, or other
          sensitive account information
          with anyone. Our support team
          will never ask you to disclose
          your password or security codes.
        </p>
      </section>
    </main>
  );
}
