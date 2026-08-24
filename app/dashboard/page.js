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
  const [transactionLoading, setTransactionLoading] = useState(false);

  const [error, setError] = useState("");
  const [transactionError, setTransactionError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [transferType, setTransferType] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !currentUser) {
      window.location.href = "/login";
      return;
    }

    setUser(currentUser);

    const { data: profileData, error: profileError } =
      await supabase
        .from("profiles")
        .select("id, full_name, role, approval_status")
        .eq("id", currentUser.id)
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
        .eq("user_id", currentUser.id)
        .maybeSingle();

    if (accountError) {
      setError(accountError.message);
      setLoading(false);
      return;
    }

    setAccount(accountData);

    if (accountData) {
      await loadTransactions(accountData.id);
    }

    setLoading(false);
  }

  async function loadTransactions(accountId) {
    setTransactionLoading(true);
    setTransactionError("");

    const { data, error: transactionsError } = await supabase
      .from("transactions")
      .select(
        "id, transaction_type, amount, description, transaction_date, created_at"
      )
      .eq("account_id", accountId)
      .order("transaction_date", {
        ascending: false,
      });

    if (transactionsError) {
      console.error("TRANSACTION ERROR:", transactionsError);
      setTransactionError(transactionsError.message);
      setTransactions([]);
      setTransactionLoading(false);
      return;
    }

    setTransactions(data || []);
    setTransactionLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 18) {
      return "Good afternoon";
    }

    return "Good evening";
  }

  function formatBalance(amount) {
    return Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function formatAmount(amount, type) {
    const number = Number(amount || 0);

    const formatted = number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return type === "debit"
      ? `-$${formatted}`
      : `+$${formatted}`;
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function openPanel(panel) {
    setMenuOpen(false);
    setTransferType(null);
    setActivePanel(panel);
  }

  function openTransfer(type) {
    setMenuOpen(false);
    setActivePanel(null);
    setTransferType(type);
  }

  function closePanels() {
    setActivePanel(null);
    setTransferType(null);
  }

  function getPanelTitle() {
    const titles = {
      profile: "My Profile",
      account: "Account Information",
      transactions: "Transaction History",
      support: "Customer Support",
      notifications: "Notifications",
      security: "Security Center",
      settings: "Account Settings",
    };

    return titles[activePanel] || "";
  }

  function getTransferTitle() {
    const titles = {
      withdraw: "Withdrawal Request",
      transfer: "Transfer",
      wire: "Wire Transfer",
      local: "Local Transfer",
    };

    return titles[transferType] || "";
  }

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-logo">M</div>
          <h2>MIDATLANTIC FEDERAL BANK</h2>
          <p>Loading your customer dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-error-card">
          <span className="dashboard-label">CUSTOMER PORTAL</span>

          <h1>Unable to Load Dashboard</h1>

          <p>{error}</p>

          <button
            className="dashboard-primary-button"
            onClick={logout}
          >
            Sign Out
          </button>
        </div>
      </main>
    );
  }

  if (
    profile &&
    profile.approval_status !== "approved"
  ) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-shell">
          <header className="customer-topbar">
            <div className="bank-header">
              <div className="bank-header-mark">M</div>

              <div>
                <strong>MIDATLANTIC FEDERAL BANK</strong>
                <span>Customer Banking Portal</span>
              </div>
            </div>

            <button
              className="dashboard-signout"
              onClick={logout}
            >
              Sign Out
            </button>
          </header>

          <section className="pending-card">
            <span className="dashboard-label">
              CUSTOMER ACCOUNT
            </span>

            <h1>
              {getGreeting()},{" "}
              {profile.full_name || "Customer"}
            </h1>

            <h2>Account Pending Approval</h2>

            <p>
              Your registration has been received and is
              currently awaiting approval.
            </p>

            <p>
              Your customer account information will become
              available here once the account has been approved.
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (!account) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-shell">
          <header className="customer-topbar">
            <div className="bank-header">
              <div className="bank-header-mark">M</div>

              <div>
                <strong>MIDATLANTIC FEDERAL BANK</strong>
                <span>Customer Banking Portal</span>
              </div>
            </div>

            <button
              className="dashboard-signout"
              onClick={logout}
            >
              Sign Out
            </button>
          </header>

          <section className="pending-card">
            <span className="dashboard-label">
              CUSTOMER ACCOUNT
            </span>

            <h1>
              {getGreeting()},{" "}
              {profile?.full_name || "Customer"}
            </h1>

            <h2>Account Information Unavailable</h2>

            <p>
              Your customer profile has been approved, but
              an account record has not yet been created.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">

        {/* TOP BAR */}

        <header className="customer-topbar">
          <a href="/" className="bank-header">
            <div className="bank-header-mark">M</div>

            <div>
              <strong>MIDATLANTIC FEDERAL BANK</strong>
              <span>Customer Banking Portal</span>
            </div>
          </a>

          <div className="customer-actions">
            <button
              className="dashboard-menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open customer menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <button
              className="dashboard-signout"
              onClick={logout}
            >
              Sign Out
            </button>
          </div>

          {/* MENU */}

          {menuOpen && (
            <div className="customer-menu">
              <div className="customer-menu-header">
                <strong>
                  {profile?.full_name || "Customer"}
                </strong>

                <span>
                  Customer Account
                </span>
              </div>

              <button
                onClick={() => openPanel("profile")}
              >
                <span>👤</span>
                My Profile
              </button>

              <button
                onClick={() => openPanel("account")}
              >
                <span>🏦</span>
                Account Information
              </button>

              <button
                onClick={() => openPanel("transactions")}
              >
                <span>📋</span>
                Transaction History
              </button>

              <button
                onClick={() => openPanel("support")}
              >
                <span>💬</span>
                Customer Support
              </button>

              <button
                onClick={() => openPanel("notifications")}
              >
                <span>🔔</span>
                Notifications
              </button>

              <button
                onClick={() => openPanel("security")}
              >
                <span>🔐</span>
                Security Center
              </button>

              <button
                onClick={() => openPanel("settings")}
              >
                <span>⚙️</span>
                Account Settings
              </button>

              <div className="customer-menu-divider"></div>

              <button
                className="customer-menu-danger"
                onClick={logout}
              >
                <span>↪</span>
                Sign Out
              </button>
            </div>
          )}
        </header>

        {/* WELCOME */}

        <section className="welcome-section">
          <div>
            <span className="dashboard-label">
              CUSTOMER DASHBOARD
            </span>

            <h1>
              {getGreeting()},{" "}
              {profile?.full_name || "Customer"}
            </h1>

            <p>
              Here's an overview of your customer account.
            </p>
          </div>

          <div className="account-status-pill">
            <span className="status-dot"></span>
            {account.status || "Active"}
          </div>
        </section>

        {/* BALANCE */}

        <section className="balance-card-new">
          <div className="balance-content">
            <div>
              <p className="balance-label">
                AVAILABLE BALANCE
              </p>

              <h2>
                ${formatBalance(account.balance)}
              </h2>

              <p className="account-number">
                Account Number:{" "}
                <strong>
                  {account.account_number || "Not assigned"}
                </strong>
              </p>
            </div>

            <div className="balance-mark">
              $
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <span>ACCOUNT SERVICES</span>
              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="quick-actions-new">

            <button
              className="quick-action-card"
              onClick={() => openTransfer("withdraw")}
            >
              <div className="quick-action-icon withdrawal-icon">
                ↓
              </div>

              <strong>Withdraw</strong>

              <small>
                Submit a withdrawal request
              </small>
            </button>

            <button
              className="quick-action-card"
              onClick={() => openTransfer("transfer")}
            >
              <div className="quick-action-icon transfer-icon">
                ↗
              </div>

              <strong>Transfer</strong>

              <small>
                Send a transfer request
              </small>
            </button>

            <button
              className="quick-action-card"
              onClick={() => openTransfer("wire")}
            >
              <div className="quick-action-icon wire-icon">
                $
              </div>

              <strong>Wire Transfer</strong>

              <small>
                Enter recipient information
              </small>
            </button>

            <button
              className="quick-action-card"
              onClick={() => openTransfer("local")}
            >
              <div className="quick-action-icon local-icon">
                →
              </div>

              <strong>Local Transfer</strong>

              <small>
                Submit a local transfer request
              </small>
            </button>

          </div>
        </section>

        {/* ACCOUNT OVERVIEW */}

        <div className="dashboard-columns">

          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <span>ACCOUNT</span>
                <h2>Account Overview</h2>
              </div>
            </div>

            <div className="account-overview-list">

              <div className="overview-row">
                <span>Account Holder</span>
                <strong>
                  {profile?.full_name || "Customer"}
                </strong>
              </div>

              <div className="overview-row">
                <span>Account Number</span>
                <strong>
                  {account.account_number || "Not assigned"}
                </strong>
              </div>

              <div className="overview-row">
                <span>Account Type</span>
                <strong>
                  {account.account_type || "Checking"}
                </strong>
              </div>

              <div className="overview-row">
                <span>Account Status</span>
                <strong className="active-text">
                  {account.status || "Active"}
                </strong>
              </div>

            </div>
          </section>

          {/* NOTIFICATIONS */}

          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <span>ACCOUNT ACTIVITY</span>
                <h2>Notifications</h2>
              </div>

              <button
                className="text-button"
                onClick={() =>
                  openPanel("notifications")
                }
              >
                View All
              </button>
            </div>

            <div className="dashboard-notification">
              <div className="notification-icon">
                ✓
              </div>

              <div>
                <strong>Account Active</strong>

                <p>
                  Your customer account is currently
                  active and available in this portal.
                </p>
              </div>
            </div>

            <div className="dashboard-notification">
              <div className="notification-icon">
                !
              </div>

              <div>
                <strong>Security Reminder</strong>

                <p>
                  Never share passwords or verification
                  codes with anyone.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* TRANSACTIONS */}

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <span>ACCOUNT ACTIVITY</span>
              <h2>Recent Transactions</h2>
            </div>

            <button
              className="text-button"
              onClick={() =>
                openPanel("transactions")
              }
            >
              View All
            </button>
          </div>

          {transactionLoading ? (
            <div className="empty-state">
              <p>Loading transactions...</p>
            </div>
          ) : transactionError ? (
            <div className="empty-state">
              <p>
                Unable to load transaction history.
              </p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>

              <strong>No Transactions Yet</strong>

              <p>
                Transactions associated with this account
                will appear here.
              </p>
            </div>
          ) : (
            <div className="transaction-table">

              <div className="transaction-table-header">
                <span>Description</span>
                <span>Date</span>
                <span>Amount</span>
              </div>

              {transactions.slice(0, 5).map(
                (transaction) => (
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
                        {transaction.transaction_type ||
                          "Transaction"}
                      </small>
                    </div>

                    <span>
                      {formatDate(
                        transaction.transaction_date
                      )}
                    </span>

                    <strong
                      className={
                        transaction.transaction_type ===
                        "debit"
                          ? "amount-debit"
                          : "amount-credit"
                      }
                    >
                      {formatAmount(
                        transaction.amount,
                        transaction.transaction_type
                      )}
                    </strong>
                  </div>
                )
              )}

            </div>
          )}
        </section>

        {/* SECURITY NOTICE */}

        <section className="security-notice-new">
          <div className="security-notice-icon">
            🔐
          </div>

          <div>
            <strong>Security Reminder</strong>

            <p>
              Never share your password, PIN, verification
              code, or other sensitive information. Support
              representatives should never ask you to reveal
              your password or security codes.
            </p>
          </div>
        </section>

        {/* FOOTER */}

        <footer className="dashboard-footer">
          <strong>MIDATLANTIC FEDERAL BANK</strong>

          <span>
            Customer Banking Demonstration Portal
          </span>
        </footer>

      </div>

      {/* SAME-PAGE ACCOUNT PANELS */}

      {activePanel && (
        <div
          className="dashboard-overlay"
          onClick={closePanels}
        >
          <div
            className="dashboard-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <span>CUSTOMER PORTAL</span>
                <h2>{getPanelTitle()}</h2>
              </div>

              <button
                className="modal-close"
                onClick={closePanels}
              >
                ×
              </button>
            </div>

            {/* PROFILE */}

            {activePanel === "profile" && (
              <div className="modal-content">

                <div className="profile-header">
                  <div className="profile-avatar-new">
                    {(profile?.full_name || "C")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h3>
                      {profile?.full_name || "Customer"}
                    </h3>

                    <p>Customer Account</p>
                  </div>
                </div>

                <div className="info-grid">

                  <div className="info-card">
                    <span>FULL NAME</span>
                    <strong>
                      {profile?.full_name ||
                        "Not available"}
                    </strong>
                  </div>

                  <div className="info-card">
                    <span>EMAIL ADDRESS</span>
                    <strong>
                      {user?.email ||
                        "Not available"}
                    </strong>
                  </div>

                  <div className="info-card">
                    <span>ACCOUNT NUMBER</span>
                    <strong>
                      {account.account_number ||
                        "Not assigned"}
                    </strong>
                  </div>

                  <div className="info-card">
                    <span>ACCOUNT TYPE</span>
                    <strong>
                      {account.account_type ||
                        "Checking"}
                    </strong>
                  </div>

                </div>

                <button
                  className="modal-primary-button"
                  onClick={() =>
                    openPanel("settings")
                  }
                >
                  Account Settings
                </button>

              </div>
            )}

            {/* ACCOUNT */}

            {activePanel === "account" && (
              <div className="modal-content">

                <div className="info-grid">

                  <div className="info-card">
                    <span>ACCOUNT HOLDER</span>
                    <strong>
                      {profile?.full_name ||
                        "Customer"}
                    </strong>
                  </div>

                  <div className="info-card">
                    <span>ACCOUNT NUMBER</span>
                    <strong>
                      {account.account_number ||
                        "Not assigned"}
                    </strong>
                  </div>

                  <div className="info-card">
                    <span>ACCOUNT TYPE</span>
                    <strong>
                      {account.account_type ||
                        "Checking"}
                    </strong>
                  </div>

                  <div className="info-card">
                    <span>ACCOUNT STATUS</span>
                    <strong className="active-text">
                      {account.status ||
                        "Active"}
                    </strong>
                  </div>

                  <div className="info-card">
                    <span>AVAILABLE BALANCE</span>
                    <strong>
                      ${formatBalance(account.balance)}
                    </strong>
                  </div>

                  <div className="info-card">
                    <span>ACCOUNT CREATED</span>
                    <strong>
                      {formatDate(account.created_at)}
                    </strong>
                  </div>

                </div>

              </div>
            )}

            {/* TRANSACTIONS */}

            {activePanel === "transactions" && (
              <div className="modal-content">

                {transactions.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      📋
                    </div>

                    <strong>
                      No Transactions
                    </strong>

                    <p>
                      There are no transactions available
                      for this account.
                    </p>
                  </div>
                ) : (
                  <div className="modal-transactions">

                    {transactions.map(
                      (transaction) => (
                        <div
                          className="modal-transaction"
                          key={transaction.id}
                        >
                          <div>
                            <strong>
                              {transaction.description ||
                                "Account Transaction"}
                            </strong>

                            <p>
                              {formatDate(
                                transaction.transaction_date
                              )}
                            </p>

                            <small>
                              Type:{" "}
                              {transaction.transaction_type ||
                                "Transaction"}
                            </small>
                          </div>

                          <strong
                            className={
                              transaction.transaction_type ===
                              "debit"
                                ? "amount-debit"
                                : "amount-credit"
                            }
                          >
                            {formatAmount(
                              transaction.amount,
                              transaction.transaction_type
                            )}
                          </strong>
                        </div>
                      )
                    )}

                  </div>
                )}

              </div>
            )}

            {/* SUPPORT */}

            {activePanel === "support" && (
              <div className="modal-content">

                <div className="support-intro">
                  <h3>
                    How can we help you today?
                  </h3>

                  <p>
                    Choose a support option below.
                  </p>
                </div>

                <div className="support-options">

                  <button className="support-option">
                    <span>💬</span>

                    <div>
                      <strong>Live Chat</strong>
                      <small>
                        Chat with customer support.
                      </small>
                    </div>
                  </button>

                  <button className="support-option">
                    <span>🎫</span>

                    <div>
                      <strong>Message / Support Ticket</strong>
                      <small>
                        Submit a question or complaint.
                      </small>
                    </div>
                  </button>

                  <button className="support-option">
                    <span>❓</span>

                    <div>
                      <strong>Frequently Asked Questions</strong>
                      <small>
                        Find answers to common questions.
                      </small>
                    </div>
                  </button>

                  <button className="support-option">
                    <span>⚠️</span>

                    <div>
                      <strong>Report a Problem</strong>
                      <small>
                        Report an account or security issue.
                      </small>
                    </div>
                  </button>

                  <button className="support-option">
                    <span>🔐</span>

                    <div>
                      <strong>Security Center</strong>
                      <small>
                        Learn how to protect your account.
                      </small>
                    </div>
                  </button>

                  <button className="support-option">
                    <span>📢</span>

                    <div>
                      <strong>Announcements</strong>
                      <small>
                        View important service updates.
                      </small>
                    </div>
                  </button>

                </div>

              </div>
            )}

            {/* NOTIFICATIONS */}

            {activePanel === "notifications" && (
              <div className="modal-content">

                <div className="notification-large">
                  <div>✓</div>

                  <section>
                    <strong>Account Active</strong>
                    <p>
                      Your customer account is currently
                      active in this demonstration portal.
                    </p>
                  </section>
                </div>

                <div className="notification-large">
                  <div>🔐</div>

                  <section>
                    <strong>Security Reminder</strong>
                    <p>
                      Never share your password, PIN, or
                      verification codes.
                    </p>
                  </section>
                </div>

              </div>
            )}

            {/* SECURITY */}

            {activePanel === "security" && (
              <div className="modal-content">

                <div className="security-panel-card">
                  <div className="security-panel-icon">
                    🔐
                  </div>

                  <h3>Protect Your Account</h3>

                  <p>
                    Use a strong, unique password and never
                    share your password or verification codes.
                  </p>
                </div>

                <div className="security-list">

                  <div>
                    <strong>Password Security</strong>
                    <span>
                      Use a strong password that you do not
                      reuse on other websites.
                    </span>
                  </div>

                  <div>
                    <strong>Verification Codes</strong>
                    <span>
                      Never share one-time verification codes
                      with another person.
                    </span>
                  </div>

                  <div>
                    <strong>Suspicious Activity</strong>
                    <span>
                      Contact support if you notice unusual
                      account activity.
                    </span>
                  </div>

                </div>

                <button
                  className="modal-primary-button"
                  onClick={() =>
                    openPanel("settings")
                  }
                >
                  Open Account Settings
                </button>

              </div>
            )}

            {/* SETTINGS */}

            {activePanel === "settings" && (
              <div className="modal-content">

                <div className="settings-card">
                  <div>
                    <strong>Password</strong>

                    <p>
                      Change your account password through
                      the secure account recovery process.
                    </p>
                  </div>

                  <button
                    className="settings-button"
                    onClick={() => {
                      window.location.href =
                        "/forgot-password";
                    }}
                  >
                    Change Password
                  </button>
                </div>

                <div className="settings-card">
                  <div>
                    <strong>Email Address</strong>

                    <p>
                      Current login email:
                      <br />
                      <b>{user?.email}</b>
                    </p>
                  </div>
                </div>

                <div className="settings-card">
                  <div>
                    <strong>Sign Out</strong>

                    <p>
                      Sign out of your customer account.
                    </p>
                  </div>

                  <button
                    className="settings-button"
                    onClick={logout}
                  >
                    Sign Out
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* TRANSFER / WITHDRAWAL MODAL */}

      {transferType && (
        <div
          className="dashboard-overlay"
          onClick={closePanels}
        >
          <div
            className="dashboard-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <span>ACCOUNT SERVICE</span>
                <h2>{getTransferTitle()}</h2>
              </div>

              <button
                className="modal-close"
                onClick={closePanels}
              >
                ×
              </button>
            </div>

            <div className="modal-content">

              <div className="demo-transfer-notice">
                <strong>Demonstration Interface</strong>

                <p>
                  This form is for demonstration purposes only.
                  It does not initiate or move real funds.
                </p>
              </div>

              <form
                className="transfer-form"
                onSubmit={(event) => {
                  event.preventDefault();

                  alert(
                    "Demonstration request submitted. No funds were moved."
                  );

                  closePanels();
                }}
              >

                {transferType !== "withdraw" && (
                  <>
                    <label>
                      Recipient Name

                      <input
                        type="text"
                        placeholder="Enter recipient name"
                        required
                      />
                    </label>

                    <label>
                      Recipient Account Number

                      <input
                        type="text"
                        placeholder="Enter account number"
                        required
                      />
                    </label>

                    <label>
                      Bank Name

                      <input
                        type="text"
                        placeholder="Enter bank name"
                        required
                      />
                    </label>
                  </>
                )}

                <label>
                  Amount

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </label>

                <label>
                  Description

                  <textarea
                    rows="4"
                    placeholder="Enter a description"
                  ></textarea>
                </label>

                <button
                  type="submit"
                  className="modal-primary-button"
                >
                  Submit Demonstration Request
                </button>

              </form>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}
