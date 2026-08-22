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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        .select(
          "id, full_name, role, approval_status"
        )
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
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main>
        <span className="real-badge">
          CUSTOMER
        </span>

        <h1>Account Dashboard</h1>

        <p>Loading your account...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <span className="real-badge">
          CUSTOMER
        </span>

        <h1>Unable to load account</h1>

        <div className="notification">
          <p>{error}</p>
        </div>

        <button
          className="primary-button"
          onClick={logout}
        >
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
            <span className="real-badge">
              CUSTOMER
            </span>

            <h1>Welcome, {profile.full_name || "Customer"}</h1>

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
            Your registration has been received and
            is currently awaiting administrator approval.
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
            <span className="real-badge">
              CUSTOMER
            </span>

            <h1>
              Welcome,{" "}
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
            Your customer profile is approved, but
            an account record has not been created yet.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <div className="dashboard-header">
        <div>
          <span className="real-badge">
            CUSTOMER
          </span>

          <h1>
            Good day,{" "}
            {profile?.full_name || "Customer"}
          </h1>

          <p>
            Welcome to your account dashboard.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={logout}
        >
          Sign Out
        </button>
      </div>

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
          {account.account_number ||
            "Not assigned"}
        </p>
      </section>

      <div className="dashboard-grid">
        <section>
          <h2>Account Status</h2>

          <p>
            <strong>Status:</strong>{" "}
            {account.status || "active"}
          </p>

          <p>
            <strong>Account type:</strong>{" "}
            {account.account_type ||
              "Checking"}
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

      <section>
        <h2>Account Information</h2>

        <div className="transaction-list">
          <div className="transaction">
            <div>
              <strong>Account Holder</strong>

              <p>
                {profile?.full_name ||
                  "Customer"}
              </p>
            </div>
          </div>

          <div className="transaction">
            <div>
              <strong>Account Number</strong>

              <p>
                {account.account_number ||
                  "Not assigned"}
              </p>
            </div>
          </div>

          <div className="transaction">
            <div>
              <strong>Account Type</strong>

              <p>
                {account.account_type ||
                  "Checking"}
              </p>
            </div>
          </div>

          <div className="transaction">
            <div>
              <strong>Account Status</strong>

              <p>
                {account.status || "active"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="real-notice">
        <h2>⛔ Security Warning</h2>

        <p>
          Never share your password, PIN, verification
          codes, or other sensitive account information
          with anyone. Our support team will never ask
          you to disclose your password or security codes.
        </p>

        <p>
          Account information is provided for
          informational purposes on this website.
        </p>
      </section>
    </main>
  );
}
