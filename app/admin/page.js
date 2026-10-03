"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function toDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function statusClass(value) {
  const status = String(value || "").toLowerCase();
  if (status === "approved" || status === "active") return "status-approved";
  if (status === "rejected" || status === "frozen") return "status-rejected";
  return "status-pending";
}

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [cardOrders, setCardOrders] = useState([]);
  const [cardAction, setCardAction] = useState(null);

  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [withdrawalAction, setWithdrawalAction] = useState(null);
  const [createdDateDrafts, setCreatedDateDrafts] = useState({});
  const [savingCreatedDate, setSavingCreatedDate] = useState(null);

  useEffect(() => {
    loadAdmin();
  }, []);

  async function requireAdmin() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      window.location.href = "/login";
      return false;
    }

    const { data: admin, error: adminError } = await supabase.rpc("is_admin");
    if (adminError || !admin) {
      window.location.href = "/dashboard";
      return false;
    }
    return true;
  }

  async function loadAdmin() {
    setLoading(true);
    setNotice("");
    try {
      if (!(await requireAdmin())) return;
      await Promise.all([
        loadPending(),
        loadAccounts(),
        loadMessages(),
        loadTransactions(),
        loadWithdrawals(),
        loadCardOrders(),
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
      .select("id, full_name, email, role, approval_status, created_at")
      .eq("role", "customer")
      .eq("approval_status", "pending")
      .order("created_at", { ascending: false });
    if (error) return setNotice(error.message);
    setPending(data || []);
  }

  async function loadAccounts() {
    const { data: accountData, error: accountError } = await supabase
      .from("customer_accounts")
      .select("id, user_id, account_number, account_type, status, balance, created_at, effective_created_at")
      .order("created_at", { ascending: false });
    if (accountError) return setNotice(accountError.message);

    if (!accountData?.length) {
      setAccounts([]);
      setCreatedDateDrafts({});
      return;
    }

    const userIds = [...new Set(accountData.map((a) => a.user_id).filter(Boolean))];
    let profileMap = {};
    if (userIds.length) {
      const { data, error } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds);
      if (error) return setNotice(error.message);
      (data || []).forEach((profile) => { profileMap[profile.id] = profile; });
    }

    const combined = accountData.map((account) => ({
      ...account,
      customerName: profileMap[account.user_id]?.full_name || "Customer",
      customerEmail: profileMap[account.user_id]?.email || "",
    }));
    setAccounts(combined);
    const drafts = {};
    combined.forEach((account) => {
      drafts[account.id] = toDateTimeLocal(account.effective_created_at || account.created_at);
    });
    setCreatedDateDrafts(drafts);
  }

  async function loadMessages() {
    const { data: rows, error } = await supabase
      .from("support_messages")
      .select("id, user_id, sender, message, created_at")
      .order("created_at", { ascending: true });
    if (error) return setNotice(error.message);

    const userIds = [...new Set((rows || []).map((m) => m.user_id).filter(Boolean))];
    let profileMap = {};
    if (userIds.length) {
      const { data, error: profileError } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds);
      if (profileError) return setNotice(profileError.message);
      (data || []).forEach((p) => { profileMap[p.id] = p; });
    }
    setMessages((rows || []).map((m) => ({
      ...m,
      customerName: profileMap[m.user_id]?.full_name || "Customer",
      customerEmail: profileMap[m.user_id]?.email || "",
    })));
  }

  async function loadTransactions() {
    const { data, error } = await supabase
      .from("transactions")
      .select("id, account_id, transaction_type, amount, description, transaction_date")
      .order("transaction_date", { ascending: false });
    if (error) return setNotice(error.message);
    setTransactions(data || []);
  }

  async function loadCardOrders() {
    const { data, error } = await supabase.rpc("admin_list_card_orders");
    if (error) {
      console.error("CARD ORDER LIST ERROR:", error);
      setNotice(`Card requests could not be loaded: ${error.message}`);
      setCardOrders([]);
      return;
    }
    const rows = data || [];
    const userIds = [...new Set(rows.map((r) => r.user_id).filter(Boolean))];
    const accountIds = [...new Set(rows.map((r) => r.account_id).filter(Boolean))];
    let profileMap = {};
    let accountMap = {};
    if (userIds.length) {
      const { data: profiles, error: profileError } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds);
      if (!profileError) (profiles || []).forEach((p) => { profileMap[p.id] = p; });
    }
    if (accountIds.length) {
      const { data: accountRows, error: accountError } = await supabase.from("customer_accounts").select("id, account_number, account_type").in("id", accountIds);
      if (!accountError) (accountRows || []).forEach((a) => { accountMap[a.id] = a; });
    }
    setCardOrders(rows.map((r) => ({
      ...r,
      customerName: profileMap[r.user_id]?.full_name || "Customer",
      customerEmail: profileMap[r.user_id]?.email || "",
      accountNumber: accountMap[r.account_id]?.account_number || "Not available",
      accountType: accountMap[r.account_id]?.account_type || "Checking",
    })));
  }

  async function approveCardOrder(request) {
    if (cardAction) return;
    if (!window.confirm(`Approve the ATM / Debit Card request for ${request.customerName}?`)) return;
    setCardAction({ id: request.id, type: "approve" });
    setNotice("Approving card request...");
    try {
      const { data, error } = await supabase.rpc("admin_approve_card_order", { p_request_id: request.id });
      if (error) throw new Error(error.message);
      const result = Array.isArray(data) ? data[0] : data;
      if (result?.status && String(result.status).toLowerCase() !== "approved") throw new Error("The card request was not approved.");
      setNotice("Card request approved and card issued successfully.");
      await loadCardOrders();
    } catch (error) {
      console.error("APPROVE CARD ERROR:", error);
      setNotice(error?.message || "Unable to approve card request.");
    } finally {
      setCardAction(null);
    }
  }

  async function rejectCardOrder(request) {
    if (cardAction) return;
    const reason = window.prompt("Optional rejection reason:", "Card request rejected by bank review.");
    if (reason === null) return;
    setCardAction({ id: request.id, type: "reject" });
    setNotice("Rejecting card request...");
    try {
      const { data, error } = await supabase.rpc("admin_reject_card_order", {
        p_request_id: request.id,
        p_reason: reason.trim() || null,
      });
      if (error) throw new Error(error.message);
      const result = Array.isArray(data) ? data[0] : data;
      if (result?.status && String(result.status).toLowerCase() !== "rejected") throw new Error("The card request was not rejected.");
      setNotice("Card request rejected. No card was issued.");
      await loadCardOrders();
    } catch (error) {
      console.error("REJECT CARD ERROR:", error);
      setNotice(error?.message || "Unable to reject card request.");
    } finally {
      setCardAction(null);
    }
  }

  async function loadWithdrawals() {
    // Direct table SELECT is intentionally avoided. The table can be protected by RLS.
    const { data, error } = await supabase.rpc("admin_list_withdrawals");
    if (error) {
      console.error("ADMIN WITHDRAWAL LIST ERROR:", error);
      setNotice(`Withdrawal list could not be loaded: ${error.message}`);
      setWithdrawals([]);
      return;
    }

    const rows = data || [];
    const userIds = [...new Set(rows.map((r) => r.user_id).filter(Boolean))];
    const accountIds = [...new Set(rows.map((r) => r.account_id).filter(Boolean))];

    let profileMap = {};
    let accountMap = {};

    if (userIds.length) {
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);
      if (!profileError) (profiles || []).forEach((p) => { profileMap[p.id] = p; });
    }

    if (accountIds.length) {
      const { data: accountRows, error: accountError } = await supabase
        .from("customer_accounts")
        .select("id, account_number, account_type, balance")
        .in("id", accountIds);
      if (!accountError) (accountRows || []).forEach((a) => { accountMap[a.id] = a; });
    }

    setWithdrawals(rows.map((r) => ({
      ...r,
      customerName: profileMap[r.user_id]?.full_name || "Customer",
      customerEmail: profileMap[r.user_id]?.email || "",
      accountNumber: accountMap[r.account_id]?.account_number || "Not available",
      accountType: accountMap[r.account_id]?.account_type || "Checking",
      currentBalance: accountMap[r.account_id]?.balance,
    })));
  }

  function generateAccountNumber() {
    return String(Math.floor(Math.random() * 1000000000)).padStart(9, "0");
  }

  async function getUniqueAccountNumber() {
    for (let i = 0; i < 20; i++) {
      const number = generateAccountNumber();
      const { data, error } = await supabase.from("customer_accounts").select("id").eq("account_number", number).maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return number;
    }
    throw new Error("Unable to generate a unique account number.");
  }

  async function approveCustomer(customer) {
    setNotice("Approving customer...");
    try {
      const { data: existing, error: existingError } = await supabase
        .from("customer_accounts")
        .select("id, account_number, account_type, status")
        .eq("user_id", customer.id)
        .maybeSingle();
      if (existingError) throw new Error(existingError.message);

      let accountNumber = existing?.account_number;
      if (!accountNumber) {
        accountNumber = await getUniqueAccountNumber();
        if (existing) {
          const { error } = await supabase.from("customer_accounts").update({ account_number: accountNumber, account_type: existing.account_type || "checking", status: "active" }).eq("id", existing.id);
          if (error) throw new Error(error.message);
        } else {
          const { error } = await supabase.from("customer_accounts").insert({ user_id: customer.id, account_number: accountNumber, balance: 0, account_type: "checking", status: "active" });
          if (error) throw new Error(error.message);
        }
      }

      const { error: approvalError } = await supabase.from("profiles").update({ approval_status: "approved" }).eq("id", customer.id);
      if (approvalError) throw new Error(approvalError.message);
      setNotice("Customer approved successfully.");
      await Promise.all([loadPending(), loadAccounts()]);
    } catch (error) {
      console.error("APPROVAL ERROR:", error);
      setNotice(error?.message || "Unable to approve customer.");
    }
  }

  async function approveWithdrawal(request) {
    if (withdrawalAction) return;
    if (!window.confirm(`Approve a ${formatMoney(request.amount)} withdrawal for ${request.customerName}? The account will be debited once.`)) return;

    setWithdrawalAction({ id: request.id, type: "approve" });
    setNotice("Approving withdrawal and debiting account...");
    try {
      const { data, error } = await supabase.rpc("admin_approve_withdrawal", { p_request_id: request.id });
      if (error) throw new Error(error.message);
      const result = Array.isArray(data) ? data[0] : data;
      setNotice(`Withdrawal approved. ${result?.transaction_id ? "Debit transaction created." : "Account updated."}`);
      await Promise.all([loadWithdrawals(), loadAccounts(), loadTransactions()]);
    } catch (error) {
      console.error("APPROVE WITHDRAWAL ERROR:", error);
      setNotice(error?.message || "Unable to approve withdrawal.");
    } finally {
      setWithdrawalAction(null);
    }
  }

  async function rejectWithdrawal(request) {
    if (withdrawalAction) return;
    const reason = window.prompt("Optional rejection reason:", "Withdrawal rejected by bank review.");
    if (reason === null) return;

    setWithdrawalAction({ id: request.id, type: "reject" });
    setNotice("Rejecting withdrawal...");
    try {
      const { error } = await supabase.rpc("admin_reject_withdrawal", {
        p_request_id: request.id,
        p_reason: reason.trim() || null,
      });
      if (error) throw new Error(error.message);
      setNotice("Withdrawal rejected. No balance change was made.");
      await loadWithdrawals();
    } catch (error) {
      console.error("REJECT WITHDRAWAL ERROR:", error);
      setNotice(error?.message || "Unable to reject withdrawal.");
    } finally {
      setWithdrawalAction(null);
    }
  }

  async function addTransaction(account) {
    const type = window.prompt("Enter transaction type: credit or debit", "credit");
    if (!type) return;
    const transactionType = type.trim().toLowerCase();
    if (!["credit", "debit"].includes(transactionType)) return setNotice("Transaction type must be credit or debit.");

    const value = window.prompt(`Enter ${transactionType} amount:`, "0.00");
    if (value === null) return;
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) return setNotice("Enter a valid amount.");

    const description = window.prompt("Enter transaction description:", transactionType === "credit" ? "Incoming Payment" : "Service Payment");
    if (!description?.trim()) return setNotice("Transaction description is required.");

    const now = new Date();
    const dateInput = window.prompt("Enter transaction date and time (YYYY-MM-DDTHH:MM):", toDateTimeLocal(now));
    if (dateInput === null) return;
    const enteredDate = new Date(dateInput);
    if (Number.isNaN(enteredDate.getTime()) || enteredDate > now) return setNotice("Enter a valid transaction date that is not in the future.");

    const { error } = await supabase.from("transactions").insert({
      account_id: account.id,
      transaction_type: transactionType,
      amount,
      description: description.trim(),
      transaction_date: enteredDate.toISOString(),
    });
    if (error) return setNotice(error.message);
    setNotice(`${transactionType === "credit" ? "Credit" : "Debit"} transaction added successfully.`);
    await Promise.all([loadAccounts(), loadTransactions()]);
  }

  async function toggleAccount(account) {
    const newStatus = account.status === "active" ? "frozen" : "active";
    const { error } = await supabase.from("customer_accounts").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", account.id);
    if (error) return setNotice(error.message);
    setNotice(newStatus === "frozen" ? "Account frozen." : "Account activated.");
    await loadAccounts();
  }

  async function saveCreatedDate(account) {
    const localValue = createdDateDrafts[account.id];
    const parsed = new Date(localValue || "");
    if (!localValue || Number.isNaN(parsed.getTime()) || parsed > new Date()) return setNotice("Please enter a valid Account Created date that is not in the future.");
    setSavingCreatedDate(account.id);
    const { error } = await supabase.from("customer_accounts").update({ effective_created_at: parsed.toISOString() }).eq("id", account.id);
    setSavingCreatedDate(null);
    if (error) return setNotice(error.message);
    setNotice("Account Created date updated.");
    await loadAccounts();
  }

  async function clearCreatedDateOverride(account) {
    setSavingCreatedDate(account.id);
    const { error } = await supabase.from("customer_accounts").update({ effective_created_at: null }).eq("id", account.id);
    setSavingCreatedDate(null);
    if (error) return setNotice(error.message);
    setNotice("Original Account Created timestamp restored.");
    await loadAccounts();
  }

  async function sendReply(item) {
    const input = document.getElementById(`reply-${item.id}`);
    const reply = input?.value?.trim();
    if (!reply) return setNotice("Please enter a reply.");
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return setNotice("Your session has expired.");
    setNotice("Sending support reply...");
    const { error } = await supabase.rpc("admin_send_support_reply", { p_message: reply, p_user_id: item.user_id });
    if (error) return setNotice(error.message);
    if (input) input.value = "";
    setNotice("Reply sent successfully.");
    await loadMessages();
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const activeAccounts = useMemo(() => accounts.filter((a) => a.status === "active"), [accounts]);
  const frozenAccounts = useMemo(() => accounts.filter((a) => a.status === "frozen"), [accounts]);
  const customerMessages = useMemo(() => messages.filter((m) => m.sender === "customer"), [messages]);
  const pendingWithdrawals = useMemo(() => withdrawals.filter((w) => String(w.status).toLowerCase() === "pending"), [withdrawals]);
  const pendingCardOrders = useMemo(() => cardOrders.filter((c) => String(c.status).toLowerCase() === "pending"), [cardOrders]);

  if (loading) {
    return <main><span className="real-badge">ADMIN</span><h1>Administrator Dashboard</h1><p>Loading administration panel...</p></main>;
  }

  return (
    <main>
      <div className="dashboard-header">
        <div>
          <span className="real-badge">ADMIN</span>
          <h1>Administrator Dashboard</h1>
          <p>Customer, account, withdrawal and support management.</p>
        </div>
        <button className="primary-button" onClick={logout}>Sign Out</button>
      </div>

      {notice && <div className="notification"><p>{notice}</p></div>}

      <nav style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
        <button className="primary-button" onClick={() => setActiveSection("overview")}>Overview</button>
        <button className="primary-button" onClick={() => setActiveSection("pending")}>Pending ({pending.length})</button>
        <button className="primary-button" onClick={() => setActiveSection("withdrawals")}>Withdrawals ({pendingWithdrawals.length})</button>
        <button className="primary-button" onClick={() => setActiveSection("cards")}>Card Requests ({pendingCardOrders.length})</button>
        <button className="primary-button" onClick={() => setActiveSection("accounts")}>Accounts ({accounts.length})</button>
        <button className="primary-button" onClick={() => setActiveSection("support")}>Support ({customerMessages.length})</button>
      </nav>

      {activeSection === "overview" && (
        <>
          <section>
            <h2>Overview</h2>
            <div className="dashboard-grid">
              <div className="notification"><h3>Pending Customers</h3><h2>{pending.length}</h2></div>
              <div className="notification"><h3>Pending Withdrawals</h3><h2>{pendingWithdrawals.length}</h2></div>
              <div className="notification"><h3>Pending Card Requests</h3><h2>{pendingCardOrders.length}</h2></div>
              <div className="notification"><h3>Active Accounts</h3><h2>{activeAccounts.length}</h2></div>
              <div className="notification"><h3>Frozen Accounts</h3><h2>{frozenAccounts.length}</h2></div>
              <div className="notification"><h3>Customer Messages</h3><h2>{customerMessages.length}</h2></div>
            </div>
          </section>
          <section>
            <h2>Recent Activity</h2>
            <div className="transaction-list">
              {transactions.slice(0, 5).map((t) => (
                <div className="transaction" key={t.id}>
                  <div><strong>{t.description || "Transaction"}</strong><p>{t.transaction_type === "credit" ? "+" : "-"}${formatMoney(t.amount)}</p><p>{formatDate(t.transaction_date)}</p></div>
                </div>
              ))}
              {!transactions.length && <div className="notification"><p>No transactions recorded.</p></div>}
            </div>
          </section>
        </>
      )}

      {activeSection === "pending" && (
        <section>
          <h2>Pending Customer Approvals</h2>
          {!pending.length ? <div className="notification"><p>No pending customers.</p></div> : (
            <div className="transaction-list">
              {pending.map((customer) => (
                <div className="transaction" key={customer.id}>
                  <div><strong>{customer.full_name || "Customer"}</strong><p>Email: {customer.email || "Not available"}</p><p>Status: {customer.approval_status}</p><p>Registered: {formatDate(customer.created_at)}</p></div>
                  <button className="primary-button" onClick={() => approveCustomer(customer)}>Approve Customer</button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "withdrawals" && (
        <section>
          <h2>Withdrawal Requests</h2>
          <p>Pending withdrawals do not change the customer balance. Approval performs the debit and creates the debit transaction atomically.</p>
          {!withdrawals.length ? <div className="notification"><p>No withdrawal requests found.</p></div> : (
            <div className="transaction-list">
              {withdrawals.map((request) => {
                const pendingRequest = String(request.status).toLowerCase() === "pending";
                const busy = withdrawalAction?.id === request.id;
                return (
                  <div className="transaction" key={request.id}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong>{request.customerName}</strong>
                      <p>Email: {request.customerEmail || "Not available"}</p>
                      <p>Account: {request.accountNumber}</p>
                      <p>Method: {request.withdrawal_method || "Cash"}</p>
                      <p>Amount: <strong>${formatMoney(request.amount)}</strong></p>
                      <p>Status: <span className={statusClass(request.status)}>{request.status}</span></p>
                      <p>Requested: {formatDate(request.created_at)}</p>
                      {request.notes && <p>Notes: {request.notes}</p>}
                      {request.currentBalance !== undefined && <p>Current balance: ${formatMoney(request.currentBalance)}</p>}
                    </div>
                    {pendingRequest && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "190px" }}>
                        <button className="primary-button" disabled={!!withdrawalAction} onClick={() => approveWithdrawal(request)}>{busy && withdrawalAction.type === "approve" ? "Approving..." : "Approve & Debit"}</button>
                        <button className="primary-button" disabled={!!withdrawalAction} onClick={() => rejectWithdrawal(request)}>{busy && withdrawalAction.type === "reject" ? "Rejecting..." : "Reject"}</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {activeSection === "cards" && (
        <section>
          <h2>ATM / Debit Card Requests</h2>
          <p>Review customer card requests. Approval issues a card record; rejection does not issue a card.</p>
          {!cardOrders.length ? (
            <div className="notification"><p>No card requests found.</p></div>
          ) : (
            <div className="transaction-list">
              {cardOrders.map((request) => {
                const pendingRequest = String(request.status).toLowerCase() === "pending";
                const busy = cardAction?.id === request.id;

                return (
                  <div className="transaction" key={request.id}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong>{request.customerName}</strong>
                      <p>Email: {request.customerEmail || "Not available"}</p>
                      <p>Account: {request.accountNumber}</p>
                      <p>Card type: {request.card_type || "ATM / Debit Card"}</p>
                      <p>Reason: {request.reason || "Card requested by customer"}</p>
                      <p>Status: <span className={statusClass(request.status)}>{request.status}</span></p>
                      <p>Requested: {formatDate(request.created_at)}</p>
                      {request.updated_at && <p>Updated: {formatDate(request.updated_at)}</p>}
                    </div>

                    {pendingRequest && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "190px" }}>
                        <button
                          className="primary-button"
                          disabled={!!cardAction}
                          onClick={() => approveCardOrder(request)}
                        >
                          {busy && cardAction.type === "approve" ? "Approving..." : "Approve & Issue Card"}
                        </button>
                        <button
                          className="primary-button"
                          disabled={!!cardAction}
                          onClick={() => rejectCardOrder(request)}
                        >
                          {busy && cardAction.type === "reject" ? "Rejecting..." : "Reject"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {activeSection === "accounts" && (
        <>
          <section>
            <h2>Customer Accounts</h2>
            {!accounts.length ? <div className="notification"><p>No customer accounts found.</p></div> : (
              <div className="transaction-list">
                {accounts.map((account) => {
                  const hasOverride = Boolean(account.effective_created_at);
                  return (
                    <div className="transaction" key={account.id}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong>{account.customerName}</strong>
                        <p>Email: {account.customerEmail || "Not available"}</p>
                        <p>Account No: {account.account_number || "Not assigned"}</p>
                        <p>Account type: {account.account_type || "Checking"}</p>
                        <p>Status: {account.status}</p>
                        <p>Balance: ${formatMoney(account.balance)}</p>
                        <p><strong>Original Created:</strong> {formatDate(account.created_at)}</p>
                        <p><strong>Displayed Created:</strong> {formatDate(account.effective_created_at || account.created_at)}{hasOverride ? " (admin override)" : " (original)"}</p>
                        <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                          <label htmlFor={`created-date-${account.id}`} style={{ display: "block", fontWeight: 700, marginBottom: "7px" }}>Account Created Date & Time</label>
                          <input id={`created-date-${account.id}`} type="datetime-local" value={createdDateDrafts[account.id] || ""} onChange={(e) => setCreatedDateDrafts((c) => ({ ...c, [account.id]: e.target.value }))} style={{ width: "100%", maxWidth: "360px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }} />
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                            <button type="button" className="primary-button" onClick={() => saveCreatedDate(account)} disabled={savingCreatedDate === account.id}>{savingCreatedDate === account.id ? "Saving..." : "Save Created Date"}</button>
                            {hasOverride && <button type="button" className="primary-button" onClick={() => clearCreatedDateOverride(account)} disabled={savingCreatedDate === account.id}>Use Original Date</button>}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "190px" }}>
                        <button className="primary-button" onClick={() => addTransaction(account)}>Add Transaction</button>
                        <button className="primary-button" onClick={() => toggleAccount(account)}>{account.status === "active" ? "Freeze Account" : "Unfreeze Account"}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
          <section>
            <h2>Recent Transactions</h2>
            <div className="transaction-list">
              {transactions.map((t) => <div className="transaction" key={t.id}><div><strong>{t.description || "Transaction"}</strong><p>Type: {t.transaction_type}</p><p>Amount: {t.transaction_type === "credit" ? "+" : "-"}${formatMoney(t.amount)}</p><p>Date: {formatDate(t.transaction_date)}</p></div></div>)}
              {!transactions.length && <div className="notification"><p>No transactions recorded.</p></div>}
            </div>
          </section>
        </>
      )}

      {activeSection === "support" && (
        <section>
          <h2>Customer Support Inbox</h2>
          {!customerMessages.length ? <div className="notification"><p>No customer support messages.</p></div> : (
            <div className="transaction-list">
              {customerMessages.map((item) => {
                const replies = messages.filter((m) => m.user_id === item.user_id && m.sender === "support" && new Date(m.created_at) > new Date(item.created_at));
                const latestReply = replies.length ? replies[replies.length - 1] : null;
                return (
                  <div className="notification" key={item.id}>
                    <h3>{item.customerName}</h3>
                    <p><strong>Email:</strong> {item.customerEmail || "Not available"}</p>
                    <p><strong>Received:</strong> {formatDate(item.created_at)}</p><hr />
                    <p><strong>Customer Message</strong></p><p>{item.message}</p>
                    {latestReply && <><hr /><p><strong>Support Reply</strong></p><p>{latestReply.message}</p><p><strong>Replied:</strong> {formatDate(latestReply.created_at)}</p></>}
                    <textarea id={`reply-${item.id}`} rows="4" placeholder="Write your support reply..." style={{ width: "100%", marginTop: "12px" }} />
                    <button className="primary-button" onClick={() => sendReply(item)}>Send Support Reply</button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      <section className="real-notice">
        <h2>⛔ Security Warning</h2>
        <p>Never share passwords, PINs, verification codes, or other sensitive account information with anyone. Keep administrator credentials private.</p>
      </section>
    </main>
  );
}
