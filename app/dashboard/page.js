"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAccount();
  }, []);

  async function loadAccount() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("customer_accounts")
      .select(
        "id, balance, status, account_type, created_at"
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setAccount(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <main>
        <p>Loading your account...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <div className="notification">
          <strong>Unable to load account</strong>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!account) {
    return (
      <main>
        <div className="notification">
          <h2>Account not found</h2>
          <p>
            Your account has not been set up yet.
          </p>
        </div>
      </main>
    );
  }

  const isFrozen = account.status === "frozen";

  return (
    <main>
      <div className="dashboard-header">
        <div>
          <span className="real-badge">
            TEST ACCOUNT
          </span>

          <h1>Account Dashboard</h1>

          <p>
            Welcome back. Here's your account overview.
          </p>
        </div>
      </div>

      <section className="balance-card">
        <p>Available Test Balance</p>

        <h2>
          ${Number(account.balance).toLocaleString(
            "en-US",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
        </h2>

        <p>
          Account ID: {account.id}
        </p>
      </section>

      <div className="dashboard-grid">
        <section>
          <h2>Notifications</h2>

          <div className="notification">
            {isFrozen ? (
              <>
                <strong>Account frozen</strong>
                <p>
                  Your test account is currently
                  frozen.
                </p>
              </>
            ) : (
              <>
                <strong>Account active</strong>
                <p>
                  Your test account is currently
                  active.
                </p>
              </>
            )}
          </div>
        </section>

        <section>
          <h2>Account Status</h2>

          <p>
            <strong>Status:</strong>{" "}
            {account.status}
          </p>

          <p>
            <strong>Account type:</strong>{" "}
            {account.account_type}
          </p>

          <p>
            <strong>Created:</strong>{" "}
            {new Date(
              account.created_at
            ).toLocaleDateString()}
          </p>
        </section>
      </div>

      <section>
        <h2>Recent Transactions</h2>

        <div className="notification">
          <p>
            No transaction records have been
            connected yet.
          </p>
        </div>
      </section>

      <section className="real-notice">
        <h2>Test Environment</h2>

        <p>
          This dashboard displays test account
          data stored in Supabase. It does not
          represent real bank funds or a live
          banking account.
        </p>
      </section>
    </main>
  );
}
