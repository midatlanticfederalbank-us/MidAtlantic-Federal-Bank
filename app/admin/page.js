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

  if (Number.isNaN(date.getTime())) return "";

  const pad = (number) => String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatMoney(value) {
  const number = Number(value || 0);

  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusLabel(value) {
  if (!value) return "—";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AdminPage() {
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [cardRequests, setCardRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  const [createdDateDrafts, setCreatedDateDrafts] = useState({});
  const [savingCreatedDate, setSavingCreatedDate] = useState(null);
  const [approvingCardRequest, setApprovingCardRequest] = useState(null);

  useEffect(() => {
    loadAdmin();
  }, []);

  async function loadAdmin() {
    setLoading(true);
    setNotice("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/login";
        return;
      }

      const { data: admin, error: adminError } = await supabase.rpc(
        "is_admin"
      );

      if (adminError || !admin) {
        window.location.href = "/dashboard";
        return;
      }

      await Promise.all([
        loadPending(),
        loadAccounts(),
        loadMessages(),
        loadTransactions(),
        loadCardRequests(),
      ]);
    } catch (error) {
      console.error("Admin dashboard error:", error);
      setNotice(error?.message || "Unable to load the administrator dashboard.");
    } finally {
      setLoading(false);
    }
  }

  async function loadPending() {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, email, full_name, phone, approval_status, created_at, updated_at"
      )
      .eq("role", "customer")
      .eq("approval_status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Pending customers error:", error);
      return;
    }

    setPendingCustomers(data || []);
  }

  async function loadAccounts() {
    const { data: accountRows, error } = await supabase
      .from("customer_accounts")
      .select(
        "id, user_id, account_number, account_type, status, balance, effective_created_at, created_at, updated_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Accounts error:", error);
      return;
    }

    const accountsData = accountRows || [];
    const userIds = [
      ...new Set(accountsData.map((account) => account.user_id).filter(Boolean)),
    ];

    let profiles = [];

    if (userIds.length > 0) {
      const { data: profileRows, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, full_name, phone, approval_status")
        .in("id", userIds);

      if (profileError) {
        console.error("Account profiles error:", profileError);
      } else {
        profiles = profileRows || [];
      }
    }

    const profileMap = new Map(
      profiles.map((profile) => [profile.id, profile])
    );

    const combined = accountsData.map((account) => ({
      ...account,
      profile: profileMap.get(account.user_id) || null,
    }));

    setAccounts(combined);

    const drafts = {};

    combined.forEach((account) => {
      if (account.effective_created_at) {
        drafts[account.id] = toDateTimeLocal(account.effective_created_at);
      } else {
        drafts[account.id] = toDateTimeLocal(account.created_at);
      }
    });

    setCreatedDateDrafts(drafts);
  }

  async function loadMessages() {
    const { data: messageRows, error } = await supabase
      .from("support_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Messages error:", error);
      return;
    }

    const rows = messageRows || [];

    const userIds = [
      ...new Set(rows.map((message) => message.user_id).filter(Boolean)),
    ];

    let profiles = [];

    if (userIds.length > 0) {
      const { data: profileRows, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", userIds);

      if (profileError) {
        console.error("Message profiles error:", profileError);
      } else {
        profiles = profileRows || [];
      }
    }

    const profileMap = new Map(
      profiles.map((profile) => [profile.id, profile])
    );

    setMessages(
      rows.map((message) => ({
        ...message,
        profile: profileMap.get(message.user_id) || null,
      }))
    );
  }

  async function loadTransactions() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Transactions error:", error);
      return;
    }

    setTransactions(data || []);
  }

  async function loadCardRequests() {
    const { data: requestRows, error } = await supabase
      .from("customer_card_orders")
      .select(
        "id, user_id, account_id, card_type, reason, status, created_at, updated_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Card requests error:", error);
      setNotice(
        `Card requests could not be loaded: ${error.message || "Unknown error"}`
      );
      return;
    }

    const rows = requestRows || [];

    const userIds = [
      ...new Set(rows.map((request) => request.user_id).filter(Boolean)),
    ];

    let profiles = [];

    if (userIds.length > 0) {
      const { data: profileRows, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", userIds);

      if (profileError) {
        console.error("Card request profiles error:", profileError);
      } else {
        profiles = profileRows || [];
      }
    }

    const profileMap = new Map(
      profiles.map((profile) => [profile.id, profile])
    );

    setCardRequests(
      rows.map((request) => ({
        ...request,
        profile: profileMap.get(request.user_id) || null,
      }))
    );
  }

  async function approveCustomer(customer) {
    setNotice("");

    try {
      const { data: existingAccount, error: existingError } = await supabase
        .from("customer_accounts")
        .select(
          "id, user_id, account_number, account_type, status, balance, effective_created_at, created_at"
        )
        .eq("user_id", customer.id)
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      let account = existingAccount;

      if (!account) {
        let accountNumber = null;

        for (let attempt = 0; attempt < 10; attempt += 1) {
          const candidate = String(
            Math.floor(100000000 + Math.random() * 900000000)
          );

          const { data: duplicate } = await supabase
            .from("customer_accounts")
            .select("id")
            .eq("account_number", candidate)
            .maybeSingle();

          if (!duplicate) {
            accountNumber = candidate;
            break;
          }
        }

        if (!accountNumber) {
          throw new Error("Unable to generate a unique account number.");
        }

        const { data: newAccount, error: accountInsertError } =
          await supabase
            .from("customer_accounts")
            .insert({
              user_id: customer.id,
              account_number: accountNumber,
              account_type: "checking",
              status: "active",
              balance: 0,
            })
            .select(
              "id, user_id, account_number, account_type, status, balance, effective_created_at, created_at"
            )
            .single();

        if (accountInsertError) {
          throw accountInsertError;
        }

        account = newAccount;
      } else if (account.status !== "active") {
        const { error: accountUpdateError } = await supabase
          .from("customer_accounts")
          .update({ status: "active" })
          .eq("id", account.id);

        if (accountUpdateError) {
          throw accountUpdateError;
        }
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          approval_status: "approved",
        })
        .eq("id", customer.id);

      if (profileError) {
        throw profileError;
      }

      setNotice(
        `${customer.full_name || customer.email || "Customer"} has been approved.`
      );

      await Promise.all([loadPending(), loadAccounts()]);
    } catch (error) {
      console.error("Approve customer error:", error);
      setNotice(error?.message || "Unable to approve customer.");
    }
  }

  async function approveCardRequest(request) {
    setApprovingCardRequest(request.id);
    setNotice("");

    try {
      const { data, error } = await supabase.rpc(
        "approve_customer_card_request",
        {
          p_request_id: request.id,
        }
      );

      if (error) {
        throw error;
      }

      const customerName =
        request.profile?.full_name ||
        request.profile?.email ||
        "Customer";

      const last4 = data?.last4 ? ` •••• ${data.last4}` : "";

      setNotice(
        `Card request approved for ${customerName}.${last4} The customer can now view the active card from the dashboard.`
      );

      await loadCardRequests();
    } catch (error) {
      console.error("Approve card request error:", error);

      setNotice(
        error?.message ||
          "Unable to approve this card request. Make sure the administrator account has permission to approve cards."
      );
    } finally {
      setApprovingCardRequest(null);
    }
  }

  async function addTransaction(account) {
    const typeInput = window.prompt(
      "Enter transaction type: credit or debit",
      "credit"
    );

    if (!typeInput) return;

    const type = typeInput.trim().toLowerCase();

    if (type !== "credit" && type !== "debit") {
      setNotice("Transaction type must be credit or debit.");
      return;
    }

    const amountInput = window.prompt("Enter amount", "100");

    if (!amountInput) return;

    const amount = Number(amountInput);

    if (!Number.isFinite(amount) || amount <= 0) {
      setNotice("Enter a valid transaction amount.");
      return;
    }

    const description =
      window.prompt("Enter transaction description", "Account transaction") ||
      "Account transaction";

    const defaultDate = toDateTimeLocal(new Date());

    const dateInput =
      window.prompt(
        "Enter transaction date and time (YYYY-MM-DDTHH:MM)",
        defaultDate
      ) || defaultDate;

    const transactionDate = new Date(dateInput);

    if (Number.isNaN(transactionDate.getTime())) {
      setNotice("Enter a valid transaction date and time.");
      return;
    }

    setNotice("");

    try {
      const { error } = await supabase.from("transactions").insert({
        account_id: account.id,
        user_id: account.user_id,
        type,
        amount,
        description,
        created_at: transactionDate.toISOString(),
      });

      if (error) {
        throw error;
      }

      setNotice(
        `${type === "credit" ? "Credit" : "Debit"} transaction added successfully.`
      );

      await Promise.all([loadTransactions(), loadAccounts()]);
    } catch (error) {
      console.error("Add transaction error:", error);
      setNotice(error?.message || "Unable to add transaction.");
    }
  }

  async function toggleAccount(account) {
    const nextStatus = account.status === "active" ? "frozen" : "active";

    const action =
      nextStatus === "active"
        ? "activate this account"
        : "freeze this account";

    const confirmed = window.confirm(
      `Are you sure you want to ${action}?`
    );

    if (!confirmed) return;

    setNotice("");

    try {
      const { error } = await supabase
        .from("customer_accounts")
        .update({ status: nextStatus })
        .eq("id", account.id);

      if (error) {
        throw error;
      }

      setNotice(
        `Account ${nextStatus === "active" ? "activated" : "frozen"} successfully.`
      );

      await loadAccounts();
    } catch (error) {
      console.error("Toggle account error:", error);
      setNotice(error?.message || "Unable to update account.");
    }
  }

  async function saveCreatedDate(account) {
    const value = createdDateDrafts[account.id];

    if (!value) {
      setNotice("Choose a valid account creation date.");
      return;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      setNotice("Choose a valid account creation date.");
      return;
    }

    setSavingCreatedDate(account.id);
    setNotice("");

    try {
      const { error } = await supabase
        .from("customer_accounts")
        .update({
          effective_created_at: date.toISOString(),
        })
        .eq("id", account.id);

      if (error) {
        throw error;
      }

      setNotice("Account creation date updated successfully.");

      await loadAccounts();
    } catch (error) {
      console.error("Save created date error:", error);
      setNotice(error?.message || "Unable to update account creation date.");
    } finally {
      setSavingCreatedDate(null);
    }
  }

  async function clearCreatedDateOverride(account) {
    setSavingCreatedDate(account.id);
    setNotice("");

    try {
      const { error } = await supabase
        .from("customer_accounts")
        .update({
          effective_created_at: null,
        })
        .eq("id", account.id);

      if (error) {
        throw error;
      }

      setNotice("Custom account creation date removed.");

      await loadAccounts();
    } catch (error) {
      console.error("Clear created date error:", error);
      setNotice(error?.message || "Unable to remove custom creation date.");
    } finally {
      setSavingCreatedDate(null);
    }
  }

  async function sendReply(item) {
    const reply = window.prompt(
      "Enter your reply:",
      item.admin_reply || ""
    );

    if (reply === null) return;

    if (!reply.trim()) {
      setNotice("Reply cannot be empty.");
      return;
    }

    setNotice("");

    try {
      const { error } = await supabase.rpc("admin_send_support_reply", {
        p_message_id: item.id,
        p_reply: reply.trim(),
      });

      if (error) {
        throw error;
      }

      setNotice("Support reply sent successfully.");

      await loadMessages();
    } catch (error) {
      console.error("Send reply error:", error);
      setNotice(error?.message || "Unable to send support reply.");
    }
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

  const customerMessages = messages.filter(
    (message) => message.user_id || message.profile
  );

  const pendingCardRequests = cardRequests.filter(
    (request) => String(request.status).toLowerCase() === "pending"
  );

  const approvedCardRequests = cardRequests.filter(
    (request) => String(request.status).toLowerCase() === "approved"
  );

  const recentTransactions = transactions.slice(0, 10);

  function accountTransactions(accountId) {
    return transactions
      .filter((transaction) => transaction.account_id === accountId)
      .slice(0, 5);
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background: "#f4f7fb",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            background: "#ffffff",
            borderRadius: "18px",
            padding: "32px",
            textAlign: "center",
            boxShadow: "0 12px 35px rgba(15, 23, 42, 0.08)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "24px" }}>
            Loading Administrator Dashboard
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#64748b",
            }}
          >
            Please wait...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        color: "#0f172a",
      }}
    >
      <header
        style={{
          background: "#0b1f3a",
          color: "#ffffff",
          padding: "22px 24px",
          position: "sticky",
          top: 0,
          zIndex: 20,
          boxShadow: "0 4px 18px rgba(15, 23, 42, 0.16)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "18px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "12px",
                letterSpacing: "0.14em",
                fontWeight: 800,
                opacity: 0.72,
              }}
            >
              MIDATLANTIC FEDERAL BANK
            </div>

            <h1
              style={{
                margin: "5px 0 0",
                fontSize: "25px",
                lineHeight: 1.15,
              }}
            >
              Administrator Dashboard
            </h1>
          </div>

          <button
            type="button"
            onClick={logout}
            style={{
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.08)",
              color: "#ffffff",
              borderRadius: "10px",
              padding: "10px 16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "24px",
        }}
      >
        {notice && (
          <div
            style={{
              marginBottom: "20px",
              padding: "14px 16px",
              borderRadius: "12px",
              background: "#eaf3ff",
              color: "#0b3b70",
              border: "1px solid #c9def5",
              fontWeight: 600,
            }}
          >
            {notice}
          </div>
        )}

        <nav
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          {[
            {
              id: "overview",
              label: "Overview",
            },
            {
              id: "pending",
              label: `Pending Customers${
                pendingCustomers.length ? ` (${pendingCustomers.length})` : ""
              }`,
            },
            {
              id: "cards",
              label: `Card Requests${
                pendingCardRequests.length
                  ? ` (${pendingCardRequests.length})`
                  : ""
              }`,
            },
            {
              id: "accounts",
              label: "Accounts",
            },
            {
              id: "support",
              label: "Support",
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              style={{
                border:
                  activeSection === item.id
                    ? "1px solid #0b1f3a"
                    : "1px solid #d7dee8",
                background:
                  activeSection === item.id ? "#0b1f3a" : "#ffffff",
                color:
                  activeSection === item.id ? "#ffffff" : "#334155",
                borderRadius: "10px",
                padding: "10px 14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {activeSection === "overview" && (
          <section>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(190px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
                }}
              >
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  Active Accounts
                </div>

                <div
                  style={{
                    fontSize: "30px",
                    fontWeight: 800,
                    marginTop: "8px",
                  }}
                >
                  {activeAccounts.length}
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
                }}
              >
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  Frozen Accounts
                </div>

                <div
                  style={{
                    fontSize: "30px",
                    fontWeight: 800,
                    marginTop: "8px",
                  }}
                >
                  {frozenAccounts.length}
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
                }}
              >
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  Pending Customers
                </div>

                <div
                  style={{
                    fontSize: "30px",
                    fontWeight: 800,
                    marginTop: "8px",
                  }}
                >
                  {pendingCustomers.length}
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
                }}
              >
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  Pending Card Requests
                </div>

                <div
                  style={{
                    fontSize: "30px",
                    fontWeight: 800,
                    marginTop: "8px",
                  }}
                >
                  {pendingCardRequests.length}
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
                }}
              >
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  Support Messages
                </div>

                <div
                  style={{
                    fontSize: "30px",
                    fontWeight: 800,
                    marginTop: "8px",
                  }}
                >
                  {customerMessages.length}
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "22px",
                boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                }}
              >
                Recent Activity
              </h2>

              <div style={{ marginTop: "18px" }}>
                {recentTransactions.length === 0 ? (
                  <p style={{ color: "#64748b" }}>
                    No transactions have been recorded yet.
                  </p>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gap: "10px",
                    }}
                  >
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "15px",
                          padding: "13px 14px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                            }}
                          >
                            {transaction.description ||
                              "Account transaction"}
                          </div>

                          <div
                            style={{
                              marginTop: "3px",
                              color: "#64748b",
                              fontSize: "13px",
                            }}
                          >
                            {formatDate(transaction.created_at)}
                          </div>
                        </div>

                        <div
                          style={{
                            fontWeight: 800,
                            color:
                              transaction.type === "credit"
                                ? "#15803d"
                                : "#b91c1c",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {transaction.type === "credit" ? "+" : "-"}$
                          {formatMoney(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {activeSection === "pending" && (
          <section>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "22px",
                boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "21px",
                    }}
                  >
                    Pending Customer Approvals
                  </h2>

                  <p
                    style={{
                      margin: "7px 0 0",
                      color: "#64748b",
                    }}
                  >
                    Review customers waiting for account approval.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadPending}
                  style={{
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    borderRadius: "9px",
                    padding: "9px 13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Refresh
                </button>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  display: "grid",
                  gap: "14px",
                }}
              >
                {pendingCustomers.length === 0 ? (
                  <div
                    style={{
                      padding: "22px",
                      borderRadius: "12px",
                      background: "#f8fafc",
                      color: "#64748b",
                    }}
                  >
                    There are no pending customer approvals.
                  </div>
                ) : (
                  pendingCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "14px",
                        padding: "18px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "16px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              margin: 0,
                              fontSize: "17px",
                            }}
                          >
                            {customer.full_name || "Unnamed Customer"}
                          </h3>

                          <div
                            style={{
                              marginTop: "5px",
                              color: "#64748b",
                            }}
                          >
                            {customer.email || "No email"}
                          </div>

                          {customer.phone && (
                            <div
                              style={{
                                marginTop: "3px",
                                color: "#64748b",
                                fontSize: "14px",
                              }}
                            >
                              {customer.phone}
                            </div>
                          )}

                          <div
                            style={{
                              marginTop: "8px",
                              fontSize: "13px",
                              color: "#64748b",
                            }}
                          >
                            Registered: {formatDate(customer.created_at)}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => approveCustomer(customer)}
                          style={{
                            border: "none",
                            background: "#0b1f3a",
                            color: "#ffffff",
                            borderRadius: "10px",
                            padding: "11px 16px",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          Approve Customer
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {activeSection === "cards" && (
          <section>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "22px",
                boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "21px",
                    }}
                  >
                    Card Requests
                  </h2>

                  <p
                    style={{
                      margin: "7px 0 0",
                      color: "#64748b",
                    }}
                  >
                    Review and approve ATM / debit card requests from
                    customers.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadCardRequests}
                  style={{
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    borderRadius: "9px",
                    padding: "9px 13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Refresh
                </button>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  display: "grid",
                  gap: "14px",
                }}
              >
                {cardRequests.length === 0 ? (
                  <div
                    style={{
                      padding: "24px",
                      borderRadius: "12px",
                      background: "#f8fafc",
                      color: "#64748b",
                    }}
                  >
                    No ATM / debit card requests have been submitted yet.
                  </div>
                ) : (
                  cardRequests.map((request) => {
                    const status = String(
                      request.status || ""
                    ).toLowerCase();

                    const customerName =
                      request.profile?.full_name ||
                      request.profile?.email ||
                      "Customer";

                    return (
                      <div
                        key={request.id}
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: "14px",
                          padding: "18px",
                          background:
                            status === "pending" ? "#ffffff" : "#f8fafc",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "18px",
                            flexWrap: "wrap",
                          }}
                        >
                          <div
                            style={{
                              minWidth: 0,
                              flex: "1 1 420px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                flexWrap: "wrap",
                              }}
                            >
                              <h3
                                style={{
                                  margin: 0,
                                  fontSize: "17px",
                                }}
                              >
                                {customerName}
                              </h3>

                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  borderRadius: "999px",
                                  padding: "5px 10px",
                                  fontSize: "12px",
                                  fontWeight: 800,
                                  background:
                                    status === "pending"
                                      ? "#fff7ed"
                                      : status === "approved"
                                      ? "#ecfdf5"
                                      : "#f1f5f9",
                                  color:
                                    status === "pending"
                                      ? "#c2410c"
                                      : status === "approved"
                                      ? "#047857"
                                      : "#475569",
                                }}
                              >
                                {statusLabel(request.status)}
                              </span>
                            </div>

                            <div
                              style={{
                                marginTop: "6px",
                                color: "#64748b",
                              }}
                            >
                              {request.profile?.email || "No email"}
                            </div>

                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fit, minmax(170px, 1fr))",
                                gap: "12px",
                                marginTop: "17px",
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    color: "#94a3b8",
                                    fontWeight: 800,
                                  }}
                                >
                                  Card Type
                                </div>

                                <div
                                  style={{
                                    marginTop: "4px",
                                    fontWeight: 700,
                                  }}
                                >
                                  {request.card_type || "ATM / Debit Card"}
                                </div>
                              </div>

                              <div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    color: "#94a3b8",
                                    fontWeight: 800,
                                  }}
                                >
                                  Request Date
                                </div>

                                <div
                                  style={{
                                    marginTop: "4px",
                                    fontWeight: 700,
                                  }}
                                >
                                  {formatDate(request.created_at)}
                                </div>
                              </div>

                              <div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    color: "#94a3b8",
                                    fontWeight: 800,
                                  }}
                                >
                                  Account
                                </div>

                                <div
                                  style={{
                                    marginTop: "4px",
                                    fontWeight: 700,
                                  }}
                                >
                                  {request.account_id
                                    ? `Account linked`
                                    : "No account linked"}
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                marginTop: "16px",
                                padding: "12px 14px",
                                borderRadius: "10px",
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.08em",
                                  color: "#94a3b8",
                                  fontWeight: 800,
                                }}
                              >
                                Reason
                              </div>

                              <div
                                style={{
                                  marginTop: "5px",
                                  color: "#334155",
                                  lineHeight: 1.5,
                                }}
                              >
                                {request.reason ||
                                  "No reason provided by customer."}
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              flex: "0 0 auto",
                              minWidth: "150px",
                            }}
                          >
                            {status === "pending" ? (
                              <button
                                type="button"
                                onClick={() => approveCardRequest(request)}
                                disabled={
                                  approvingCardRequest === request.id
                                }
                                style={{
                                  width: "100%",
                                  border: "none",
                                  background:
                                    approvingCardRequest === request.id
                                      ? "#64748b"
                                      : "#0b1f3a",
                                  color: "#ffffff",
                                  borderRadius: "10px",
                                  padding: "12px 15px",
                                  fontWeight: 800,
                                  cursor:
                                    approvingCardRequest === request.id
                                      ? "wait"
                                      : "pointer",
                                }}
                              >
                                {approvingCardRequest === request.id
                                  ? "Approving..."
                                  : "Approve Card"}
                              </button>
                            ) : status === "approved" ? (
                              <div
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  textAlign: "center",
                                  borderRadius: "10px",
                                  padding: "12px 15px",
                                  background: "#ecfdf5",
                                  color: "#047857",
                                  fontWeight: 800,
                                  border: "1px solid #a7f3d0",
                                }}
                              >
                                Card Approved
                              </div>
                            ) : (
                              <div
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  textAlign: "center",
                                  borderRadius: "10px",
                                  padding: "12px 15px",
                                  background: "#f1f5f9",
                                  color: "#475569",
                                  fontWeight: 800,
                                }}
                              >
                                {statusLabel(request.status)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {approvedCardRequests.length > 0 && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    color: "#1e40af",
                    fontSize: "14px",
                    lineHeight: 1.55,
                  }}
                >
                  Approved card requests are now linked to the customer's
                  active card record. The customer dashboard can display the
                  approved card without exposing sensitive card information
                  such as a full card number, CVV, or PIN.
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === "accounts" && (
          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "18px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "21px",
                  }}
                >
                  Customer Accounts
                </h2>

                <p
                  style={{
                    margin: "7px 0 0",
                    color: "#64748b",
                  }}
                >
                  Manage account status, dates, balances, and transactions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  loadAccounts();
                  loadTransactions();
                }}
                style={{
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  borderRadius: "9px",
                  padding: "9px 13px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Refresh
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gap: "18px",
              }}
            >
              {accounts.length === 0 ? (
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "24px",
                    color: "#64748b",
                  }}
                >
                  No customer accounts found.
                </div>
              ) : (
                accounts.map((account) => {
                  const accountTxns = accountTransactions(account.id);

                  return (
                    <div
                      key={account.id}
                      style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        padding: "22px",
                        boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "16px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              margin: 0,
                              fontSize: "18px",
                            }}
                          >
                            {account.profile?.full_name ||
                              account.profile?.email ||
                              "Customer"}
                          </h3>

                          <div
                            style={{
                              marginTop: "4px",
                              color: "#64748b",
                            }}
                          >
                            {account.profile?.email || "No email"}
                          </div>
                        </div>

                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            borderRadius: "999px",
                            padding: "6px 11px",
                            fontSize: "12px",
                            fontWeight: 800,
                            background:
                              account.status === "active"
                                ? "#ecfdf5"
                                : "#fef2f2",
                            color:
                              account.status === "active"
                                ? "#047857"
                                : "#b91c1c",
                          }}
                        >
                          {statusLabel(account.status)}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(170px, 1fr))",
                          gap: "14px",
                          marginTop: "20px",
                        }}
                      >
                        <div
                          style={{
                            padding: "14px",
                            background: "#f8fafc",
                            borderRadius: "11px",
                          }}
                        >
                          <div
                            style={{
                              color: "#94a3b8",
                              fontSize: "11px",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            Account Number
                          </div>

                          <div
                            style={{
                              marginTop: "5px",
                              fontWeight: 800,
                            }}
                          >
                            ••••{" "}
                            {String(account.account_number || "").slice(-4)}
                          </div>
                        </div>

                        <div
                          style={{
                            padding: "14px",
                            background: "#f8fafc",
                            borderRadius: "11px",
                          }}
                        >
                          <div
                            style={{
                              color: "#94a3b8",
                              fontSize: "11px",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            Account Type
                          </div>

                          <div
                            style={{
                              marginTop: "5px",
                              fontWeight: 800,
                            }}
                          >
                            {account.account_type || "checking"}
                          </div>
                        </div>

                        <div
                          style={{
                            padding: "14px",
                            background: "#f8fafc",
                            borderRadius: "11px",
                          }}
                        >
                          <div
                            style={{
                              color: "#94a3b8",
                              fontSize: "11px",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            Balance
                          </div>

                          <div
                            style={{
                              marginTop: "5px",
                              fontWeight: 800,
                            }}
                          >
                            ${formatMoney(account.balance)}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: "20px",
                          padding: "16px",
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 800,
                            marginBottom: "10px",
                          }}
                        >
                          Account Created Date
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          <input
                            type="datetime-local"
                            value={createdDateDrafts[account.id] || ""}
                            onChange={(event) =>
                              setCreatedDateDrafts((current) => ({
                                ...current,
                                [account.id]: event.target.value,
                              }))
                            }
                            style={{
                              border: "1px solid #cbd5e1",
                              borderRadius: "9px",
                              padding: "10px",
                              background: "#ffffff",
                              color: "#0f172a",
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => saveCreatedDate(account)}
                            disabled={savingCreatedDate === account.id}
                            style={{
                              border: "none",
                              background: "#0b1f3a",
                              color: "#ffffff",
                              borderRadius: "9px",
                              padding: "10px 13px",
                              fontWeight: 700,
                              cursor:
                                savingCreatedDate === account.id
                                  ? "wait"
                                  : "pointer",
                            }}
                          >
                            {savingCreatedDate === account.id
                              ? "Saving..."
                              : "Save Date"}
                          </button>

                          {account.effective_created_at && (
                            <button
                              type="button"
                              onClick={() =>
                                clearCreatedDateOverride(account)
                              }
                              disabled={savingCreatedDate === account.id}
                              style={{
                                border: "1px solid #cbd5e1",
                                background: "#ffffff",
                                color: "#334155",
                                borderRadius: "9px",
                                padding: "10px 13px",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              Use Original Date
                            </button>
                          )}
                        </div>

                        <div
                          style={{
                            marginTop: "8px",
                            color: "#64748b",
                            fontSize: "13px",
                          }}
                        >
                          Current displayed date:{" "}
                          {formatDate(
                            account.effective_created_at ||
                              account.created_at
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap",
                          marginTop: "18px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => addTransaction(account)}
                          style={{
                            border: "none",
                            background: "#0b1f3a",
                            color: "#ffffff",
                            borderRadius: "9px",
                            padding: "10px 14px",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          Add Transaction
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleAccount(account)}
                          style={{
                            border:
                              account.status === "active"
                                ? "1px solid #fecaca"
                                : "1px solid #bbf7d0",
                            background:
                              account.status === "active"
                                ? "#fff7f7"
                                : "#f0fdf4",
                            color:
                              account.status === "active"
                                ? "#b91c1c"
                                : "#15803d",
                            borderRadius: "9px",
                            padding: "10px 14px",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          {account.status === "active"
                            ? "Freeze Account"
                            : "Unfreeze Account"}
                        </button>
                      </div>

                      <div
                        style={{
                          marginTop: "22px",
                        }}
                      >
                        <h4
                          style={{
                            margin: "0 0 10px",
                            fontSize: "15px",
                          }}
                        >
                          Recent Transactions
                        </h4>

                        {accountTxns.length === 0 ? (
                          <div
                            style={{
                              padding: "13px",
                              background: "#f8fafc",
                              borderRadius: "10px",
                              color: "#64748b",
                              fontSize: "14px",
                            }}
                          >
                            No transactions for this account.
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "grid",
                              gap: "8px",
                            }}
                          >
                            {accountTxns.map((transaction) => (
                              <div
                                key={transaction.id}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: "14px",
                                  padding: "12px 13px",
                                  border: "1px solid #e2e8f0",
                                  borderRadius: "10px",
                                }}
                              >
                                <div>
                                  <div
                                    style={{
                                      fontWeight: 700,
                                    }}
                                  >
                                    {transaction.description ||
                                      "Account transaction"}
                                  </div>

                                  <div
                                    style={{
                                      color: "#64748b",
                                      fontSize: "12px",
                                      marginTop: "3px",
                                    }}
                                  >
                                    {formatDate(transaction.created_at)}
                                  </div>
                                </div>

                                <div
                                  style={{
                                    fontWeight: 800,
                                    whiteSpace: "nowrap",
                                    color:
                                      transaction.type === "credit"
                                        ? "#15803d"
                                        : "#b91c1c",
                                  }}
                                >
                                  {transaction.type === "credit"
                                    ? "+"
                                    : "-"}
                                  $
                                  {formatMoney(transaction.amount)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}

        {activeSection === "support" && (
          <section>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "22px",
                boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "21px",
                    }}
                  >
                    Support Inbox
                  </h2>

                  <p
                    style={{
                      margin: "7px 0 0",
                      color: "#64748b",
                    }}
                  >
                    Review customer messages and send replies.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadMessages}
                  style={{
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    borderRadius: "9px",
                    padding: "9px 13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Refresh
                </button>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  display: "grid",
                  gap: "14px",
                }}
              >
                {customerMessages.length === 0 ? (
                  <div
                    style={{
                      padding: "22px",
                      borderRadius: "12px",
                      background: "#f8fafc",
                      color: "#64748b",
                    }}
                  >
                    No customer support messages found.
                  </div>
                ) : (
                  customerMessages.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "14px",
                        padding: "18px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "15px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              margin: 0,
                              fontSize: "16px",
                            }}
                          >
                            {item.profile?.full_name ||
                              item.profile?.email ||
                              "Customer"}
                          </h3>

                          <div
                            style={{
                              marginTop: "4px",
                              color: "#64748b",
                              fontSize: "13px",
                            }}
                          >
                            {item.profile?.email || "No email"}
                          </div>
                        </div>

                        <div
                          style={{
                            color: "#64748b",
                            fontSize: "13px",
                          }}
                        >
                          {formatDate(item.created_at)}
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: "15px",
                          padding: "14px",
                          background: "#f8fafc",
                          borderRadius: "10px",
                          lineHeight: 1.55,
                        }}
                      >
                        {item.message || item.content || "No message content."}
                      </div>

                      {item.admin_reply && (
                        <div
                          style={{
                            marginTop: "10px",
                            padding: "14px",
                            background: "#eff6ff",
                            borderRadius: "10px",
                            border: "1px solid #bfdbfe",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              color: "#2563eb",
                              fontWeight: 800,
                              marginBottom: "5px",
                            }}
                          >
                            Admin Reply
                          </div>

                          {item.admin_reply}
                        </div>
                      )}

                      <div
                        style={{
                          marginTop: "13px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => sendReply(item)}
                          style={{
                            border: "none",
                            background: "#0b1f3a",
                            color: "#ffffff",
                            borderRadius: "9px",
                            padding: "10px 14px",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          {item.admin_reply ? "Update Reply" : "Reply"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        <section
          style={{
            marginTop: "24px",
            padding: "16px 18px",
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "14px",
            color: "#9a3412",
            fontSize: "13px",
            lineHeight: 1.55,
          }}
        >
          <strong>Security Warning:</strong> Never store or display complete
          card numbers, CVV codes, PINs, passwords, authentication codes, or
          other sensitive credentials in the administrator interface.
        </section>
      </div>
    </main>
  );
}
