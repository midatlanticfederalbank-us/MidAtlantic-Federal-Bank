"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: profileData, error: profileError } =
      await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    const { data: accountData, error: accountError } =
      await supabase
        .from("customer_accounts")
        .select(
          "id, account_number, balance, status, account_type, created_at"
        )
        .eq("user_id", user.id)
        .maybeSingle();

    if (accountError) {
      setError(accountError.message);
      setLoading(false);
      return;
    }

    if (!accountData) {
      setError("Your account has not been set up yet.");
      setLoading(false);
      return;
    }

    setProfile(profileData);
    setAccount(accountData);
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
          <h2>Unable to load account</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  const name = profile?.full_name || "Customer";
  const frozen = account.status === "frozen";

  return (
    <main>
      <div className="dashboard-header">
        <div>
          <h1>
            Good day, {name}
          </h1>

          <p>
            Welcome back. Here's your account overview.
          </p>
        </div>
      </div>

      <section className="balance-card">
        <p>Available Balance</p>

        <h2>
          $
          {Number(account.balance).toLocaleString(
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

      <div className="dashboard-grid">
        <section>
          <h2>Notifications</h2>

          <div className="notification">
            {frozen ? (
              <>
                <strong>Account status update</strong>
                <p>
                  Your account is currently frozen.
                </p>
              </>
            ) : (
              <>
                <strong>Account active</strong>
                <p>
                  Your account is currently active.
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
        </section>
      </div>

      <section>
        <h2>Recent Transactions</h2>

        <div className="notification">
          <p>
            No transaction records available yet.
          </p>
        </div>
      </section>

      <section>
        <h2>Customer Support</h2>

        <p>
          Need help with your account?
        </p>

        <a href="/support" className="primary-button">
          Contact Support
        </a>
      </section>

      <section className="real-notice">
        <p>
          This website uses simulated account data
          for development and testing and is not
          connected to real bank funds.
        </p>
      </section>
    </main>
  );
}
