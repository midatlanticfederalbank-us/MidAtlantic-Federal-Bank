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
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDate(value) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const [admin, setAdmin] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadAdminAccounts();
  }, []);

  async function loadAdminAccounts() {
    setLoading(true);
    setError("");
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: adminProfile, error: adminError } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", user.id)
      .single();

    if (
      adminError ||
      !adminProfile ||
      String(adminProfile.role).toLowerCase() !== "admin"
    ) {
      window.location.href = "/dashboard";
      return;
    }

    setAdmin(adminProfile);

    /*
      Load customer accounts WITHOUT relying on a Supabase
      foreign-key relationship to profiles.

      Your database does not expose the relationship
      customer_accounts -> profiles in the Supabase schema cache,
      so we fetch the two tables separately and combine them
      using user_id.
    */

    const { data: accountRows, error: accountsError } = await supabase
      .from("customer_accounts")
      .select(`
        id,
        user_id,
        account_number,
        account_type,
        status,
        balance,
        created_at,
        effective_created_at
      `)
      .order("created_at", { ascending: false });

    if (accountsError) {
      setError(accountsError.message);
      setLoading(false);
      return;
    }

    const rows = accountRows || [];

    const userIds = [
      ...new Set(
        rows
          .map((account) => account.user_id)
          .filter(Boolean)
      ),
    ];

    let profileMap = {};

    if (userIds.length > 0) {
      const {
        data: profileRows,
        error: profilesError,
      } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .in("id", userIds);

      if (profilesError) {
        /*
          The account list can still be displayed even if profile
          names cannot be loaded.
        */
        console.warn(
          "Customer profiles could not be loaded:",
          profilesError.message
        );
      } else {
        profileMap = Object.fromEntries(
          (profileRows || []).map((profileRow) => [
            profileRow.id,
            profileRow,
          ])
        );
      }
    }

    const combinedRows = rows.map((account) => ({
      ...account,
      customerName:
        profileMap[account.user_id]?.full_name ||
        "Customer",
      customerRole:
        profileMap[account.user_id]?.role || "",
    }));

    setAccounts(combinedRows);

    const initialDrafts = {};

    for (const account of combinedRows) {
      initialDrafts[account.id] = toDateTimeLocal(
        account.effective_created_at ||
        account.created_at
      );
    }

    setDrafts(initialDrafts);
    setLoading(false);
  }

  function setDraft(id, value) {
    setDrafts((current) => ({
      ...current,
      [id]: value,
    }));
  }

  async function saveDate(account) {
    const localValue = drafts[account.id];

    if (!localValue) {
      setError("Please enter a valid account-created date and time.");
      return;
    }

    const parsed = new Date(localValue);

    if (Number.isNaN(parsed.getTime())) {
      setError("Please enter a valid account-created date and time.");
      return;
    }

    if (parsed > new Date()) {
      setError("The effective account-created date cannot be in the future.");
      return;
    }

    setSavingId(account.id);
    setError("");
    setMessage("");

    const { error: updateError } = await supabase
      .from("customer_accounts")
      .update({
        effective_created_at: parsed.toISOString(),
      })
      .eq("id", account.id);

    if (updateError) {
      setError(updateError.message);
      setSavingId(null);
      return;
    }

    setAccounts((current) =>
      current.map((item) =>
        item.id === account.id
          ? {
              ...item,
              effective_created_at: parsed.toISOString(),
            }
          : item
      )
    );

    setMessage(
      `Account ${account.account_number || account.id} updated successfully.`
    );
    setSavingId(null);
  }

  async function clearOverride(account) {
    setSavingId(account.id);
    setError("");
    setMessage("");

    const { error: updateError } = await supabase
      .from("customer_accounts")
      .update({
        effective_created_at: null,
      })
      .eq("id", account.id);

    if (updateError) {
      setError(updateError.message);
      setSavingId(null);
      return;
    }

    setAccounts((current) =>
      current.map((item) =>
        item.id === account.id
          ? {
              ...item,
              effective_created_at: null,
            }
          : item
      )
    );

    setDrafts((current) => ({
      ...current,
      [account.id]: toDateTimeLocal(account.created_at),
    }));

    setMessage(
      `Account ${account.account_number || account.id} now uses its original timestamp.`
    );
    setSavingId(null);
  }

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-shell">
          <div className="admin-card">Loading account administration...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <div className="admin-kicker">MIDATLANTIC FEDERAL BANK</div>
            <h1>Account Administration</h1>
            <p>
              Configure the effective Account Created date/time for customer
              accounts without changing the original database timestamp.
            </p>
          </div>
          <div className="admin-header-actions">
            <span className="admin-user">
              {admin?.full_name || "Administrator"}
            </span>
            <a href="/dashboard" className="admin-back-link">
              Customer Dashboard
            </a>
          </div>
        </header>

        <section className="admin-notice">
          <strong>Audit-safe date correction</strong>
          <span>
            The original <code>created_at</code> remains unchanged. Changes to
            the effective date are recorded in the account-created-date audit
            table.
          </span>
        </section>

        {error && <div className="admin-alert admin-alert-error">{error}</div>}
        {message && (
          <div className="admin-alert admin-alert-success">{message}</div>
        )}

        <section className="admin-card">
          <div className="admin-table-heading">
            <div>
              <h2>Customer Accounts</h2>
              <p>{accounts.length} account(s)</p>
            </div>
          </div>

          <div className="admin-account-list">
            {accounts.length === 0 ? (
              <div className="admin-empty">No customer accounts found.</div>
            ) : (
              accounts.map((account) => {
                const customerName = account.customerName || "Customer";
                const hasOverride = Boolean(account.effective_created_at);

                return (
                  <article className="admin-account-row" key={account.id}>
                    <div className="admin-account-summary">
                      <strong>{customerName}</strong>
                      <span>
                        Account #{account.account_number || "Not assigned"}
                      </span>
                      <span>
                        {account.account_type || "Account"} ·{" "}
                        {account.status || "Active"}
                      </span>
                    </div>

                    <div className="admin-account-original">
                      <span className="admin-label">Original timestamp</span>
                      <strong>{formatDate(account.created_at)}</strong>
                    </div>

                    <div className="admin-account-editor">
                      <label htmlFor={`created-${account.id}`}>
                        Effective Account Created
                      </label>
                      <input
                        id={`created-${account.id}`}
                        type="datetime-local"
                        value={drafts[account.id] || ""}
                        onChange={(event) =>
                          setDraft(account.id, event.target.value)
                        }
                      />
                      <small>
                        {hasOverride
                          ? `Currently displayed: ${formatDate(
                              account.effective_created_at
                            )}`
                          : "Currently using the original timestamp"}
                      </small>
                    </div>

                    <div className="admin-account-actions">
                      <button
                        type="button"
                        className="admin-save-button"
                        onClick={() => saveDate(account)}
                        disabled={savingId === account.id}
                      >
                        {savingId === account.id ? "Saving..." : "Save Date"}
                      </button>

                      {hasOverride && (
                        <button
                          type="button"
                          className="admin-clear-button"
                          onClick={() => clearOverride(account)}
                          disabled={savingId === account.id}
                        >
                          Use Original
                        </button>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
