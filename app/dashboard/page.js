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
      await loadTransactions(accountData.id);
    }

    setLoading(false);
  }

  async function loadTransactions(accountId) {
    setTransactionLoading(true);
    setTransactionError("");

    const { data, error } = await supabase
      .from("transactions")
      .select(
        "id, transaction_type, amount, description, transaction_date, created_at"
      )
      .eq("account_id", accountId)
      .order("transaction_date", {
        ascending: false,
      });

    if (error) {
      console.error("TRANSACTION ERROR:", error);
      setTransactionError(error.message);
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

  if (loading) {
    return (
      <main>
        <span className="real-badge">CUSTOMER</span>
        <h1>Account Dashboard</h1>
        <p>Loading your account...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <span className="real-badge">CUSTOMER</span>

        <h1>Unable to load account</h1>

        <div className="notification">
          <p>{error}</p>
        </div>

        <button className="primary-button" onClick={logout}>
          Sign Out
        </button>
      </main>
    );
  }

  if (
    profile &&
    profile.approval_status !== "approved"
  ) {
    return (
      <main>
        <div className="dashboard-header">
          <div>
            <span className="real-badge">CUSTOMER</span>

            <h1>
              {getGreeting()},{" "}
              {profile.full_name || "Customer"}
            </h1>

            <p>
              Your account is awaiting approval.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={logout}
          >
            Sign Out
          </button>
        </div>

        <section className="notification">
          <h2>Account Pending</h2>

          <p>
            Your registration has been received and is
            currently awaiting administrator approval.
          </p>

          <p>
            Once your account is approved, your account
            information will appear here.
          </p>
        </section>
      </main>
    );
  }

  if (!account) {
    return (
      <main>
        <div className="dashboard-header">
          <div>
            <span className="real-badge">CUSTOMER</span>

            <h1>
              {getGreeting()},{" "}
              {profile?.full_name || "Customer"}
            </h1>

            <p>
              Your account has been approved.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={logout}
          >
            Sign Out
          </button>
        </div>

        <section className="notification">
          <h2>Account Not Found</h2>

          <p>
            Your customer profile is approved, but an
            account record has not been created yet.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main>
      {/* HEADER */}

      <div className="dashboard-header">
        <div>
          <span className="real-badge">CUSTOMER</span>

          <h1>
            {getGreeting()},{" "}
            {profile?.full_name || "Customer"}
          </h1>

          <p>
            Here's an overview of your account.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {/* THREE DOT MENU */}

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open account menu"
          >
            ⋮
          </button>

          <button
            className="primary-button"
            onClick={logout}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* THREE DOT MENU */}

      {menuOpen && (
        <div className="account-menu">
          <button onClick={() => openPanel("profile")}>
            👤 Profile
          </button>

          <button onClick={() => openPanel("account")}>
            🏦 Account Information
          </button>

          <button onClick={() => openPanel("transactions")}>
            📋 Transactions
          </button>

          <button onClick={() => openPanel("support")}>
            💬 Customer Support
          </button>

          <button onClick={() => openPanel("notifications")}>
            🔔 Notifications
          </button>

          <button onClick={() => openPanel("security")}>
            🔐 Security
          </button>

          <button onClick={() => openPanel("settings")}>
            ⚙️ Settings
          </button>

          <button
            className="menu-danger"
            onClick={logout}
          >
            🚪 Sign Out
          </button>
        </div>
      )}

      {/* BALANCE */}

      <section className="balance-card">
        <p>Available Balance</p>

        <h2>
          $
          {Number(account.balance || 0).toLocaleString(
            "en-US",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
        </h2>

        <p>
          Account No:{" "}
          {account.account_number || "Not assigned"}
        </p>
      </section>

      {/* QUICK ACTIONS */}

      <section>
        <h2>Quick Actions</h2>

        <div className="quick-actions">
          <button
            className="action-card"
            onClick={() => openTransfer("withdraw")}
          >
            <span>💵</span>
            <strong>Withdraw</strong>
            <small>Request a withdrawal</small>
          </button>

          <button
            className="action-card"
            onClick={() => openTransfer("transfer")}
          >
            <span>↗️</span>
            <strong>Transfer</strong>
            <small>Send to another account</small>
          </button>

          <button
            className="action-card"
            onClick={() => openTransfer("wire")}
          >
            <span>🏦</span>
            <strong>Wire Transfer</strong>
            <small>Enter recipient details</small>
          </button>

          <button
            className="action-card"
            onClick={() => openTransfer("local")}
          >
            <span>🏠</span>
            <strong>Local Transfer</strong>
            <small>Send a local transfer</small>
          </button>
        </div>
      </section>

      {/* ACCOUNT OVERVIEW */}

      <div className="dashboard-grid">
        <section>
          <h2>Account Status</h2>

          <p>
            <strong>Status:</strong>{" "}
            {account.status || "active"}
          </p>

          <p>
            <strong>Account type:</strong>{" "}
            {account.account_type || "Checking"}
          </p>
        </section>

        <section>
          <h2>Notifications</h2>

          <div className="notification">
            <strong>Account active</strong>

            <p>
              Your customer account is currently
              available from your dashboard.
            </p>
          </div>
        </section>
      </div>

      {/* RECENT TRANSACTIONS */}

      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Recent Transactions</h2>

          <button
            className="secondary-button"
            onClick={() => openPanel("transactions")}
          >
            View All
          </button>
        </div>

        {transactionLoading ? (
          <div className="notification">
            <p>Loading transactions...</p>
          </div>
        ) : transactionError ? (
          <div className="notification">
            <p>
              Unable to load transaction history.
            </p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="notification">
            <p>
              No transactions are available for this
              account.
            </p>
          </div>
        ) : (
          <div className="transaction-list">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                className="transaction"
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
                </div>

                <strong>
                  {formatAmount(
                    transaction.amount,
                    transaction.transaction_type
                  )}
                </strong>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECURITY */}

      <section className="real-notice">
        <h2>⛔ Security Warning</h2>

        <p>
          Never share your password, PIN, verification
          codes, or other sensitive account information
          with anyone.
        </p>

        <p>
          Our support team will never ask you to disclose
          your password or security codes.
        </p>
      </section>

      {/* SAME-PAGE PANELS */}

      {activePanel && (
        <div
          className="panel-overlay"
          onClick={closePanels}
        >
          <div
            className="dashboard-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-header">
              <h2>
                {activePanel === "profile" &&
                  "My Profile"}

                {activePanel === "account" &&
                  "Account Information"}

                {activePanel === "transactions" &&
                  "Transaction History"}

                {activePanel === "support" &&
                  "Customer Support"}

                {activePanel === "notifications" &&
                  "Notifications"}

                {activePanel === "security" &&
                  "Security"}

                {activePanel === "settings" &&
                  "Settings"}
              </h2>

              <button
                className="close-button"
                onClick={closePanels}
              >
                ×
              </button>
            </div>

            {/* PROFILE */}

            {activePanel === "profile" && (
              <div className="panel-content">
                <div className="profile-avatar">
                  {(profile?.full_name || "C")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <h3>
                  {profile?.full_name || "Customer"}
                </h3>

                <div className="info-box">
                  <strong>Full Name</strong>
                  <p>
                    {profile?.full_name ||
                      "Not available"}
                  </p>
                </div>

                <div className="info-box">
                  <strong>Email</strong>
                  <p>
                    {user?.email || "Not available"}
                  </p>
                </div>

                <div className="info-box">
                  <strong>Account Number</strong>
                  <p>
                    {account.account_number ||
                      "Not assigned"}
                  </p>
                </div>

                <button
                  className="secondary-button"
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
              <div className="panel-content">
                <div className="info-box">
                  <strong>Account Holder</strong>
                  <p>
                    {profile?.full_name ||
                      "Customer"}
                  </p>
                </div>

                <div className="info-box">
                  <strong>Account Number</strong>
                  <p>
                    {account.account_number ||
                      "Not assigned"}
                  </p>
                </div>

                <div className="info-box">
                  <strong>Account Type</strong>
                  <p>
                    {account.account_type ||
                      "Checking"}
                  </p>
                </div>

                <div className="info-box">
                  <strong>Status</strong>
                  <p>
                    {account.status || "active"}
                  </p>
                </div>

                <div className="info-box">
                  <strong>Available Balance</strong>
                  <p>
                    $
                    {Number(
                      account.balance || 0
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* TRANSACTIONS */}

            {activePanel === "transactions" && (
              <div className="panel-content">
                {transactions.length === 0 ? (
                  <div className="notification">
                    No transactions available.
                  </div>
                ) : (
                  <div className="transaction-list">
                    {transactions.map(
                      (transaction) => (
                        <div
                          className="transaction"
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

                            <p>
                              Type:{" "}
                              {transaction.transaction_type ||
                                "Transaction"}
                            </p>
                          </div>

                          <strong>
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

            {/* CUSTOMER SUPPORT */}

            {activePanel === "support" && (
              <div className="panel-content">
                <div className="support-grid">
                  <button className="support-card">
                    💬
                    <strong>Live Chat</strong>
                    <small>
                      Chat with customer support
                    </small>
                  </button>

                  <button className="support-card">
                    🎫
                    <strong>Message / Ticket</strong>
                    <small>
                      Submit a support request
                    </small>
                  </button>

                  <button className="support-card">
                    ❓
                    <strong>FAQ</strong>
                    <small>
                      Find answers to common questions
                    </small>
                  </button>

                  <button className="support-card">
                    ⚠️
                    <strong>Report a Problem</strong>
                    <small>
                      Report account or security issues
                    </small>
                  </button>

                  <button className="support-card">
                    🔐
                    <strong>Security Center</strong>
                    <small>
                      Account security information
                    </small>
                  </button>

                  <button className="support-card">
                    📢
                    <strong>Announcements</strong>
                    <small>
                      Important service updates
                    </small>
                  </button>

                  <button className="support-card">
                    📍
                    <strong>Branch / ATM</strong>
                    <small>
                      Find branches and ATMs
                    </small>
                  </button>

                  <button className="support-card">
                    ⭐
                    <strong>Feedback</strong>
                    <small>
                      Rate your support experience
                    </small>
                  </button>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}

            {activePanel === "notifications" && (
              <div className="panel-content">
                <div className="notification">
                  <strong>Account active</strong>

                  <p>
                    Your account is currently active.
                  </p>
                </div>

                <div className="notification">
                  <strong>Security reminder</strong>

                  <p>
                    Never share your password or
                    verification codes.
                  </p>
                </div>
              </div>
            )}

            {/* SECURITY */}

            {activePanel === "security" && (
              <div className="panel-content">
                <div className="security-card">
                  <h3>🔐 Account Security</h3>

                  <p>
                    Keep your account secure by using a
                    strong password and never sharing
                    verification codes.
                  </p>
                </div>

                <button
                  className="secondary-button"
                  onClick={() =>
                    openPanel("settings")
                  }
                >
                  Change Password
                </button>
              </div>
            )}

            {/* SETTINGS */}

            {activePanel === "settings" && (
              <div className="panel-content">
                <h3>Account Settings</h3>

                <div className="settings-item">
                  <div>
                    <strong>Password</strong>
                    <p>
                      Update your account password.
                    </p>
                  </div>

                  <button className="secondary-button">
                    Change
                  </button>
                </div>

                <div className="settings-item">
                  <div>
                    <strong>Email</strong>
                    <p>
                      Your current login email is{" "}
                      {user?.email}.
                    </p>
                  </div>
                </div>

                <div className="settings-item">
                  <div>
                    <strong>Sign Out</strong>
                    <p>
                      Sign out of this account.
                    </p>
                  </div>

                  <button
                    className="secondary-button"
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

      {/* TRANSFER / WITHDRAWAL PANEL */}

      {transferType && (
        <div
          className="panel-overlay"
          onClick={closePanels}
        >
          <div
            className="dashboard-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="panel-header">
              <h2>
                {transferType === "withdraw" &&
                  "Withdrawal Request"}

                {transferType === "transfer" &&
                  "Transfer"}

                {transferType === "wire" &&
                  "Wire Transfer"}

                {transferType === "local" &&
                  "Local Transfer"}
              </h2>

              <button
                className="close-button"
                onClick={closePanels}
              >
                ×
              </button>
            </div>

            <div className="panel-content">
              <div className="demo-notice">
                <strong>Demo interface</strong>

                <p>
                  This form currently collects transfer
                  information for the interface only. It
                  does not move or withdraw real funds.
                </p>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();

                  alert(
                    "This is a demonstration form. No funds were transferred."
                  );
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
                    placeholder="Enter a description"
                    rows="3"
                  />
                </label>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Continue
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
