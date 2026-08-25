"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const [chatMessages, setChatMessages] = useState([
    {
      sender: "support",
      text: "Hello. Welcome to MIDATLANTIC FEDERAL BANK Customer Support. How can we help you today?",
    },
  ]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      window.location.href = "/login";
      return;
    }

    setUser(user);

    const { data: profileData, error: profileError } =
      await supabase
        .from("profiles")
        .select("id, full_name, role, approval_status")
        .eq("id", user.id)
        .single();

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    setProfile(profileData);

    if (profileData.approval_status !== "approved") {
      setLoading(false);
      return;
    }

    const { data: accountData, error: accountError } =
      await supabase
        .from("customer_accounts")
        .select(
          "id, user_id, account_number, balance, status, account_type, created_at"
        )
        .eq("user_id", user.id)
        .maybeSingle();

    if (accountError) {
      setError(accountError.message);
      setLoading(false);
      return;
    }

    setAccount(accountData);

    if (accountData) {
      const { data: transactionData } = await supabase
        .from("transactions")
        .select(
          "id, transaction_type, amount, description, transaction_date, created_at"
        )
        .eq("account_id", accountData.id)
        .order("transaction_date", {
          ascending: false,
        });

      setTransactions(transactionData || []);
    }

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  function greeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";

    return "Good evening";
  }

  function openPage(page) {
    setActivePage(page);
    setMenuOpen(false);
  }

  function formatMoney(amount) {
    return Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function sendChatMessage(event) {
    event.preventDefault();

    const message = chatMessage.trim();

    if (!message) return;

    setChatMessages((messages) => [
      ...messages,
      {
        sender: "customer",
        text: message,
      },
    ]);

    setChatMessage("");

    setTimeout(() => {
      setChatMessages((messages) => [
        ...messages,
        {
          sender: "support",
          text: "Thank you for your message. A customer-service representative can review your request.",
        },
      ]);
    }, 700);
  }

  if (loading) {
    return (
      <main className="portal-loading">
        <div className="loading-card">
          <div className="loading-logo">M</div>
          <h2>MIDATLANTIC FEDERAL BANK</h2>
          <p>Loading your customer portal...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="portal-loading">
        <div className="loading-card">
          <h2>Unable to Load Account</h2>
          <p>{error}</p>

          <button className="portal-button" onClick={logout}>
            Sign Out
          </button>
        </div>
      </main>
    );
  }

  if (profile && profile.approval_status !== "approved") {
    return (
      <main className="portal-page">
        <div className="portal-header">
          <div>
            <div className="bank-name">
              MIDATLANTIC FEDERAL BANK
            </div>

            <div className="portal-label">
              CUSTOMER BANKING PORTAL
            </div>
          </div>

          <button className="portal-button" onClick={logout}>
            Sign Out
          </button>
        </div>

        <section className="pending-card">
          <span className="status-badge pending">
            PENDING APPROVAL
          </span>

          <h1>
            {greeting()}, {profile.full_name || "Customer"}
          </h1>

          <h2>Account Awaiting Approval</h2>

          <p>
            Your registration has been received and is
            awaiting account approval.
          </p>
        </section>
      </main>
    );
  }

  if (!account) {
    return (
      <main className="portal-page">
        <div className="portal-header">
          <div>
            <div className="bank-name">
              MIDATLANTIC FEDERAL BANK
            </div>

            <div className="portal-label">
              CUSTOMER BANKING PORTAL
            </div>
          </div>

          <button className="portal-button" onClick={logout}>
            Sign Out
          </button>
        </div>

        <section className="pending-card">
          <h1>
            {greeting()}, {profile?.full_name || "Customer"}
          </h1>

          <h2>Account Information Unavailable</h2>

          <p>
            Your customer profile has been approved, but an
            account record has not yet been assigned.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="portal-page">
      {/* HEADER */}

      <header className="portal-header">
        <div>
          <div className="bank-name">
            MIDATLANTIC FEDERAL BANK
          </div>

          <div className="portal-label">
            CUSTOMER BANKING PORTAL
          </div>
        </div>

        <div className="header-actions">
          <span className="online-status">
            <span className="online-dot"></span>
            Online
          </span>

          <button
            className="menu-trigger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open customer menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* CUSTOMER MENU */}

        {menuOpen && (
          <div className="customer-menu">
            <div className="menu-title">
              CUSTOMER PORTAL
            </div>

            <button onClick={() => openPage("dashboard")}>
              <span className="menu-icon">⌂</span>
              <span>Dashboard</span>
            </button>

            <button onClick={() => openPage("profile")}>
              <span className="menu-icon">○</span>
              <span>My Profile</span>
            </button>

            <button onClick={() => openPage("account")}>
              <span className="menu-icon">▣</span>
              <span>Account Information</span>
            </button>

            <div className="menu-section">
              TRANSFERS & PAYMENTS
            </div>

            <button onClick={() => openPage("withdraw")}>
              <span className="menu-icon">↓</span>
              <span>Withdraw</span>
            </button>

            <button onClick={() => openPage("transfer")}>
              <span className="menu-icon">↗</span>
              <span>Transfer</span>
            </button>

            <button onClick={() => openPage("wire")}>
              <span className="menu-icon">⇄</span>
              <span>Wire Transfer</span>
            </button>

            <button onClick={() => openPage("local")}>
              <span className="menu-icon">→</span>
              <span>Local Transfer</span>
            </button>

            <div className="menu-section">
              ACTIVITY
            </div>

            <button onClick={() => openPage("transactions")}>
              <span className="menu-icon">▤</span>
              <span>Transaction History</span>
            </button>

            <button onClick={() => openPage("notifications")}>
              <span className="menu-icon">○</span>
              <span>Notifications</span>
            </button>

            <div className="menu-section">
              SUPPORT
            </div>

            <button onClick={() => openPage("support")}>
              <span className="menu-icon">?</span>
              <span>Customer Support</span>
            </button>

            <div className="menu-section">
              SECURITY
            </div>

            <button onClick={() => openPage("security")}>
              <span className="menu-icon">◇</span>
              <span>Security Center</span>
            </button>

            <button onClick={() => openPage("settings")}>
              <span className="menu-icon">⚙</span>
              <span>Account Settings</span>
            </button>

            <div className="menu-divider"></div>

            <button
              className="signout-menu"
              onClick={logout}
            >
              <span className="menu-icon">↪</span>
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}

      <div className="portal-content">
        {/* DASHBOARD */}

        {activePage === "dashboard" && (
          <>
            <section className="welcome-section">
              <div>
                <span className="customer-badge">
                  CUSTOMER ACCOUNT
                </span>

                <h1>
                  {greeting()},{" "}
                  {profile?.full_name || "Customer"}
                </h1>

                <p>
                  Here's an overview of your customer account.
                </p>
              </div>
            </section>

            <section className="balance-card-professional">
              <div>
                <p>AVAILABLE BALANCE</p>

                <h2>
                  ${formatMoney(account.balance)}
                </h2>

                <span>
                  Account ending in{" "}
                  {String(account.account_number || "").slice(-4)}
                </span>
              </div>

              <div className="balance-status">
                <span className="online-dot"></span>
                {account.status || "Active"}
              </div>
            </section>

            <section className="portal-section">
              <div className="section-heading">
                <div>
                  <span className="section-label">
                    ACCOUNT SERVICES
                  </span>

                  <h2>Quick Actions</h2>
                </div>
              </div>

              <div className="quick-action-grid">
                <button
                  onClick={() => openPage("withdraw")}
                  className="quick-action"
                >
                  <span className="action-icon">↓</span>
                  <strong>Withdraw</strong>
                  <small>
                    Submit a withdrawal request
                  </small>
                </button>

                <button
                  onClick={() => openPage("transfer")}
                  className="quick-action"
                >
                  <span className="action-icon">↗</span>
                  <strong>Transfer</strong>
                  <small>
                    Submit a transfer request
                  </small>
                </button>

                <button
                  onClick={() => openPage("wire")}
                  className="quick-action"
                >
                  <span className="action-icon">⇄</span>
                  <strong>Wire Transfer</strong>
                  <small>
                    Enter recipient information
                  </small>
                </button>

                <button
                  onClick={() => openPage("local")}
                  className="quick-action"
                >
                  <span className="action-icon">→</span>
                  <strong>Local Transfer</strong>
                  <small>
                    Submit a local transfer request
                  </small>
                </button>
              </div>
            </section>

            <div className="two-column">
              <section className="portal-section">
                <span className="section-label">
                  ACCOUNT
                </span>

                <h2>Account Overview</h2>

                <div className="detail-row">
                  <span>Account Holder</span>
                  <strong>
                    {profile?.full_name}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Account Number</span>
                  <strong>
                    {account.account_number || "Not available"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Account Type</span>
                  <strong>
                    {account.account_type || "Checking"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Account Status</span>
                  <strong className="active-text">
                    {account.status || "Active"}
                  </strong>
                </div>
              </section>

              <section className="portal-section">
                <span className="section-label">
                  ACCOUNT ACTIVITY
                </span>

                <h2>Notifications</h2>

                <div className="notification-item">
                  <div className="notification-icon">
                    ✓
                  </div>

                  <div>
                    <strong>Account Active</strong>

                    <p>
                      Your customer account is currently
                      available.
                    </p>
                  </div>
                </div>

                <div className="notification-item">
                  <div className="notification-icon warning">
                    !
                  </div>

                  <div>
                    <strong>Security Reminder</strong>

                    <p>
                      Never share passwords or verification
                      codes.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <section className="portal-section">
              <div className="section-heading">
                <div>
                  <span className="section-label">
                    ACCOUNT ACTIVITY
                  </span>

                  <h2>Recent Transactions</h2>
                </div>

                <button
                  className="text-button"
                  onClick={() => openPage("transactions")}
                >
                  View All
                </button>
              </div>

              {transactions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">▣</div>

                  <strong>No Transactions Yet</strong>

                  <p>
                    Transactions associated with this
                    account will appear here.
                  </p>
                </div>
              ) : (
                <div className="transaction-list-professional">
                  {transactions
                    .slice(0, 5)
                    .map((transaction) => (
                      <div
                        className="transaction-row"
                        key={transaction.id}
                      >
                        <div>
                          <strong>
                            {transaction.description ||
                              "Account Transaction"}
                          </strong>

                          <small>
                            {formatDate(
                              transaction.transaction_date
                            )}
                          </small>
                        </div>

                        <strong>
                          ${formatMoney(transaction.amount)}
                        </strong>
                      </div>
                    ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* PROFILE */}

        {activePage === "profile" && (
          <PortalPage
            title="My Profile"
            label="CUSTOMER"
          >
            <div className="profile-header">
              <div className="profile-avatar">
                {(profile?.full_name || "C")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h2>{profile?.full_name}</h2>
                <p>Customer Account</p>
              </div>
            </div>

            <InfoRow
              label="Full Name"
              value={profile?.full_name}
            />

            <InfoRow
              label="Email Address"
              value={user?.email}
            />

            <InfoRow
              label="Account Number"
              value={
                account.account_number ||
                "Not available"
              }
            />

            <InfoRow
              label="Account Type"
              value={
                account.account_type || "Checking"
              }
            />
          </PortalPage>
        )}

        {/* ACCOUNT INFORMATION */}

        {activePage === "account" && (
          <PortalPage
            title="Account Information"
            label="ACCOUNT"
          >
            <InfoRow
              label="Account Holder"
              value={profile?.full_name}
            />

            <InfoRow
              label="Account Number"
              value={
                account.account_number ||
                "Not available"
              }
            />

            <InfoRow
              label="Account Type"
              value={
                account.account_type || "Checking"
              }
            />

            <InfoRow
              label="Account Status"
              value={
                account.status || "Active"
              }
            />

            <InfoRow
              label="Available Balance"
              value={`$${formatMoney(account.balance)}`}
            />
          </PortalPage>
        )}

        {/* TRANSFERS & PAYMENTS */}

        {[
          "withdraw",
          "transfer",
          "wire",
          "local",
        ].includes(activePage) && (
          <PortalPage
            title={
              activePage === "withdraw"
                ? "Withdraw"
                : activePage === "transfer"
                ? "Transfer"
                : activePage === "wire"
                ? "Wire Transfer"
                : "Local Transfer"
            }
            label="TRANSFERS & PAYMENTS"
          >
            <div className="request-notice">
              <strong>Request Information</strong>

              <p>
                Complete the form below to submit a request.
                This interface does not directly move funds.
              </p>
            </div>

            {activePage !== "withdraw" && (
              <>
                <label className="form-label">
                  Recipient Name

                  <input
                    className="portal-input"
                    type="text"
                    placeholder="Enter recipient name"
                  />
                </label>

                <label className="form-label">
                  Recipient Account Number

                  <input
                    className="portal-input"
                    type="text"
                    placeholder="Enter account number"
                  />
                </label>

                <label className="form-label">
                  Bank Name

                  <input
                    className="portal-input"
                    type="text"
                    placeholder="Enter bank name"
                  />
                </label>
              </>
            )}

            <label className="form-label">
              Amount

              <input
                className="portal-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </label>

            <label className="form-label">
              Description

              <textarea
                className="portal-textarea"
                rows="4"
                placeholder="Add a description or additional information"
              />
            </label>

            <button
              className="portal-button"
              onClick={() =>
                alert(
                  "Your request has been prepared for submission."
                )
              }
            >
              Submit Request
            </button>
          </PortalPage>
        )}

        {/* TRANSACTION HISTORY */}

        {activePage === "transactions" && (
          <PortalPage
            title="Transaction History"
            label="ACTIVITY"
          >
            {transactions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">▣</div>

                <strong>No Transactions Yet</strong>

                <p>
                  Transactions associated with this account
                  will appear here.
                </p>
              </div>
            ) : (
              <div className="transaction-list-professional">
                {transactions.map((transaction) => (
                  <div
                    className="transaction-row"
                    key={transaction.id}
                  >
                    <div>
                      <strong>
                        {transaction.description ||
                          "Account Transaction"}
                      </strong>

                      <small>
                        {formatDate(
                          transaction.transaction_date
                        )}
                      </small>
                    </div>

                    <strong>
                      ${formatMoney(transaction.amount)}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </PortalPage>
        )}

        {/* NOTIFICATIONS */}

        {activePage === "notifications" && (
          <PortalPage
            title="Notifications"
            label="ACTIVITY"
          >
            <div className="notification-item">
              <div className="notification-icon">
                ✓
              </div>

              <div>
                <strong>Account Active</strong>

                <p>
                  Your customer account is currently active.
                </p>
              </div>
            </div>

            <div className="notification-item">
              <div className="notification-icon warning">
                !
              </div>

              <div>
                <strong>Security Reminder</strong>

                <p>
                  Never share your password, PIN, or
                  verification codes.
                </p>
              </div>
            </div>
          </PortalPage>
        )}

        {/* CUSTOMER SUPPORT */}

        {activePage === "support" && (
          <PortalPage
            title="Customer Support"
            label="SUPPORT"
          >
            <div className="support-intro">
              <h2>How can we help you today?</h2>

              <p>
                Choose a support option or use the live chat
                button in the bottom-right corner.
              </p>
            </div>

            <div className="support-grid-professional">
              <button
                onClick={() => setChatOpen(true)}
                className="support-option"
              >
                <span>💬</span>
                <strong>Live Chat</strong>
                <small>
                  Chat with customer support
                </small>
              </button>

              <button className="support-option">
                <span>🎫</span>
                <strong>Support Ticket</strong>
                <small>
                  Submit a question or complaint
                </small>
              </button>

              <button className="support-option">
                <span>?</span>
                <strong>
                  Frequently Asked Questions
                </strong>
                <small>
                  Find answers to common questions
                </small>
              </button>

              <button className="support-option">
                <span>!</span>
                <strong>Report a Problem</strong>
                <small>
                  Report an account or security issue
                </small>
              </button>
            </div>
          </PortalPage>
        )}

        {/* SECURITY */}

        {activePage === "security" && (
          <PortalPage
            title="Security Center"
            label="SECURITY"
          >
            <div className="security-box">
              <h2>Protect Your Account</h2>

              <p>
                Never share your password, PIN, or
                verification codes with another person.
              </p>
            </div>

            <div className="security-box">
              <h3>Account Security</h3>

              <p>
                Use a strong password and sign out when
                using a shared device.
              </p>
            </div>
          </PortalPage>
        )}

        {/* SETTINGS */}

        {activePage === "settings" && (
          <PortalPage
            title="Account Settings"
            label="SECURITY"
          >
            <div className="settings-row">
              <div>
                <strong>Password</strong>

                <p>
                  Change your account password.
                </p>
              </div>

              <button
                className="secondary-action"
                onClick={() =>
                  alert(
                    "Password-change workflow can be connected to Supabase Auth."
                  )
                }
              >
                Change
              </button>
            </div>

            <div className="settings-row">
              <div>
                <strong>Email Address</strong>

                <p>{user?.email}</p>
              </div>
            </div>

            <div className="settings-row">
              <div>
                <strong>Sign Out</strong>

                <p>
                  End your current customer session.
                </p>
              </div>

              <button
                className="secondary-action"
                onClick={logout}
              >
                Sign Out
              </button>
            </div>
          </PortalPage>
        )}
      </div>

      {/* FLOATING LIVE CHAT */}

      <button
        className="live-chat-button"
        onClick={() => setChatOpen(!chatOpen)}
        aria-label="Open live chat"
      >
        <span className="chat-online-dot"></span>

        <span className="chat-symbol">
          💬
        </span>
      </button>

      {/* CHAT WINDOW */}

      {chatOpen && (
        <div className="live-chat-window">
          <div className="chat-header">
            <div>
              <strong>Customer Support</strong>

              <span>
                <span className="chat-header-dot"></span>
                Online
              </span>
            </div>

            <button
              onClick={() => setChatOpen(false)}
              className="chat-close"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className="chat-body">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={
                  message.sender === "customer"
                    ? "chat-message customer"
                    : "chat-message support"
                }
              >
                {message.text}
              </div>
            ))}
          </div>

          <form
            className="chat-input-area"
            onSubmit={sendChatMessage}
          >
            <input
              value={chatMessage}
              onChange={(event) =>
                setChatMessage(event.target.value)
              }
              placeholder="Type your message..."
            />

            <button type="submit">
              Send
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

function PortalPage({ title, label, children }) {
  return (
    <section className="portal-page-section">
      <div className="page-heading">
        <div>
          <span className="section-label">
            {label}
          </span>

          <h1>{title}</h1>
        </div>
      </div>

      <div className="page-body">
        {children}
      </div>
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="detail-row large">
      <span>{label}</span>

      <strong>
        {value || "Not available"}
      </strong>
    </div>
  );
}
