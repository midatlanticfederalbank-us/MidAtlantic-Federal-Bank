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
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState("");
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  // Account number visibility
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const [requestForm, setRequestForm] = useState({
    recipientName: "",
    recipientAccountNumber: "",
    bankName: "",
    amount: "",
    description: "",
  });

  const [requestStatus, setRequestStatus] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);

  // Customer transfer + email OTP
  const [transferOtpOpen, setTransferOtpOpen] = useState(false);
  const [transferOtp, setTransferOtp] = useState("");
  const [transferId, setTransferId] = useState("");
  const [transferOtpStatus, setTransferOtpStatus] = useState("");
  const [transferOtpLoading, setTransferOtpLoading] = useState(false);
  const [transferResendLoading, setTransferResendLoading] = useState(false);
  const [transferReceiptOpen, setTransferReceiptOpen] = useState(false);
  const [transferReceipt, setTransferReceipt] = useState(null);

  // Password change
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

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

    /*
      CUSTOMER PROFILE

      Make sure your profiles table contains:

      id
      full_name
      date_of_birth
      phone_number
      address
      city
      state
      postal_code
      country
      role
      approval_status
    */

    const {
      data: profileData,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        date_of_birth,
        phone_number,
        address,
        city,
        state,
        postal_code,
        country,
        role,
        approval_status
      `)
      .eq("id", user.id)
      .single();

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    setProfile(profileData);

    if (profileData.avatar_path) {
      const { data: avatarData, error: avatarError } = await supabase
        .storage
        .from("profile-pictures")
        .createSignedUrl(profileData.avatar_path, 3600);

      if (!avatarError && avatarData?.signedUrl) {
        setAvatarUrl(avatarData.signedUrl);
      }
    } else {
      setAvatarUrl("");
    }

    if (profileData.approval_status !== "approved") {
      setLoading(false);
      return;
    }

    /*
      CUSTOMER ACCOUNT
    */

    const {
      data: accountData,
      error: accountError,
    } = await supabase
      .from("customer_accounts")
      .select(
        "id, user_id, account_number, balance, status, account_type, created_at, effective_created_at"
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (accountError) {
      setError(accountError.message);
      setLoading(false);
      return;
    }

    setAccount(accountData);

    /*
      TRANSACTIONS
    */

    if (accountData) {
      const {
        data: transactionData,
        error: transactionError,
      } = await supabase
        .from("transactions")
        .select(
          "id, transaction_type, amount, description, transaction_date, created_at"
        )
        .eq("account_id", accountData.id)
        .order("transaction_date", {
          ascending: false,
        });

      if (!transactionError) {
        setTransactions(transactionData || []);
      }
    }

    setLoading(false);
  }

  /*
    =====================================================
    SUPPORT CHAT
    =====================================================
  */

  async function loadChatMessages() {
    if (!user) return;

    const {
      data,
      error,
    } = await supabase
      .from("support_messages")
      .select("id, sender, message, created_at")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.warn(
        "Support messages could not be loaded:",
        error.message
      );

      setChatMessages([
        {
          id: "welcome",
          sender: "support",
          message:
            "Hello. Welcome to MIDATLANTIC FEDERAL BANK Customer Support. How can we help you today?",
          created_at: new Date().toISOString(),
        },
      ]);

      return;
    }

    setChatMessages(
      data && data.length > 0
        ? data
        : [
            {
              id: "welcome",
              sender: "support",
              message:
                "Hello. Welcome to MIDATLANTIC FEDERAL BANK Customer Support. How can we help you today?",
              created_at: new Date().toISOString(),
            },
          ]
    );
  }

  async function sendChatMessage(event) {
    event.preventDefault();

    const message = chatMessage.trim();

    if (!message || chatLoading || !user) return;

    setChatLoading(true);

    const localMessage = {
      id: `local-${Date.now()}`,
      sender: "customer",
      message,
      created_at: new Date().toISOString(),
    };

    setChatMessages((current) => [
      ...current,
      localMessage,
    ]);

    setChatMessage("");

    try {
      const { error } = await supabase
        .from("support_messages")
        .insert({
          user_id: user.id,
          sender: "customer",
          message,
        });

      if (error) {
        console.warn(
          "Chat database insert failed:",
          error.message
        );
      }
    } catch (err) {
      console.warn(
        "Chat connection error:",
        err
      );
    }

    setChatLoading(false);
  }

  /*
    =====================================================
    GENERAL FUNCTIONS
    =====================================================
  */

  async function changePassword(event) {
    event.preventDefault();

    if (passwordLoading) return;

    setPasswordStatus("");

    const password = newPassword;
    const confirmation = confirmPassword;

    if (password.length < 8) {
      setPasswordStatus("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmation) {
      setPasswordStatus("The new passwords do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData?.session?.user) {
        setPasswordStatus(
          "Your session has expired. Please sign in again."
        );
        setPasswordLoading(false);
        return;
      }

      const { error: passwordError } = await supabase.auth.updateUser({
        password,
      });

      if (passwordError) {
        setPasswordStatus(
          passwordError.message ||
            "Your password could not be changed. Please try again."
        );
        setPasswordLoading(false);
        return;
      }
    } catch (err) {
      setPasswordStatus(
        err?.message ||
          "Your password could not be changed. Please try again."
      );
      setPasswordLoading(false);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setPasswordStatus("Your password has been changed successfully.");
    setPasswordLoading(false);

    setTimeout(() => {
      setPasswordModalOpen(false);
      setPasswordStatus("");
    }, 1600);
  }

  async function uploadProfilePicture(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !user || avatarLoading) return;

    setAvatarStatus("");

    if (!file.type.startsWith("image/")) {
      setAvatarStatus("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarStatus("Profile pictures must be 5 MB or smaller.");
      return;
    }

    setAvatarLoading(true);

    try {
      const extension = (file.name.split(".").pop() || "jpg")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      const safeExtension = extension || "jpg";
      const path = `${user.id}/avatar.${safeExtension}`;

      const { error: uploadError } = await supabase
        .storage
        .from("profile-pictures")
        .upload(path, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { error: profileUpdateError } = await supabase
        .rpc("set_profile_avatar_path", {
          p_avatar_path: path,
        });

      if (profileUpdateError) throw profileUpdateError;

      const { data: avatarData, error: signedUrlError } = await supabase
        .storage
        .from("profile-pictures")
        .createSignedUrl(path, 3600);

      if (signedUrlError || !avatarData?.signedUrl) {
        throw signedUrlError || new Error(
          "The profile picture was uploaded, but its preview could not be created."
        );
      }

      setAvatarUrl(avatarData.signedUrl);
      setProfile((current) =>
        current ? { ...current, avatar_path: path } : current
      );
      setAvatarStatus("Profile picture updated successfully.");
    } catch (uploadError) {
      setAvatarStatus(
        uploadError?.message ||
          "Your profile picture could not be uploaded. Please try again."
      );
    } finally {
      setAvatarLoading(false);
    }
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
    setRequestStatus("");

    // Hide account number whenever navigating away
    if (page !== "profile" && page !== "account") {
      setShowAccountNumber(false);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function formatMoney(amount) {
    return Number(amount || 0).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  function formatDateOnly(date) {
    if (!date) return "Not available";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  }

  function maskedAccountNumber(accountNumber) {
    if (!accountNumber) {
      return "Not available";
    }

    const value = String(accountNumber);

    if (value.length <= 4) {
      return value;
    }

    return `•••• ${value.slice(-4)}`;
  }

  function visibleAccountNumber(accountNumber) {
    if (!accountNumber) {
      return "Not available";
    }

    return String(accountNumber);
  }

  /*
    =====================================================
    TRANSFER / WITHDRAWAL REQUESTS
    =====================================================
  */

  function updateRequestField(field, value) {
    setRequestForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitRequest(event) {
    event.preventDefault();

    if (requestLoading || !user) return;

    setRequestStatus("");

    const amount = Number(requestForm.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setRequestStatus("Please enter a valid amount.");
      return;
    }

    if (activePage === "transfer") {
      await startCustomerTransfer();
      return;
    }

    if (
      activePage !== "withdraw" &&
      (
        !requestForm.recipientName.trim() ||
        !requestForm.recipientAccountNumber.trim() ||
        !requestForm.bankName.trim()
      )
    ) {
      setRequestStatus(
        "Please complete the recipient information."
      );

      return;
    }

    setRequestLoading(true);

    try {
      const { error } = await supabase
        .from("transfer_requests")
        .insert({
          user_id: user.id,
          request_type: activePage,

          recipient_name:
            requestForm.recipientName.trim() ||
            null,

          recipient_account_number:
            requestForm.recipientAccountNumber.trim() ||
            null,

          bank_name:
            requestForm.bankName.trim() ||
            null,

          amount,

          description:
            requestForm.description.trim() ||
            null,

          status: "pending",
        });

      if (error) {
        console.warn(
          "Transfer request database insert failed:",
          error.message
        );

        setRequestStatus(
          "Your request could not be submitted. Please try again."
        );

        setRequestLoading(false);
        return;
      }

      resetRequestForm();

      setRequestStatus(
        "Transfer request submitted successfully."
      );
    } catch (err) {
      console.warn(
        "Transfer request connection error:",
        err
      );

      setRequestStatus(
        "Unable to submit the request. Please try again."
      );
    }

    setRequestLoading(false);
  }

  function resetRequestForm() {
    setRequestForm({
      recipientName: "",
      recipientAccountNumber: "",
      bankName: "",
      amount: "",
      description: "",
    });
  }

  async function invokeCustomerTransfer(body) {
    const { data, error } = await supabase.functions.invoke(
      "customer-transfer",
      {
        body,
      }
    );

    if (error) {
      let message = error.message || "Transfer service is unavailable.";

      try {
        const response = error.context;
        if (response && typeof response.json === "function") {
          const payload = await response.json();
          if (payload?.message) {
            message = payload.message;
          }
        }
      } catch (_) {
        // Keep the original error message.
      }

      throw new Error(message);
    }

    if (!data) {
      throw new Error("The transfer service returned no response.");
    }

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  }

  async function startCustomerTransfer() {
    if (
      requestLoading ||
      transferOtpLoading ||
      !user
    ) {
      return;
    }

    setRequestStatus("");
    setTransferOtpStatus("");

    const amount = Number(requestForm.amount);
    const recipientName =
      requestForm.recipientName.trim();
    const recipientAccountNumber =
      requestForm.recipientAccountNumber.trim();
    const description =
      requestForm.description.trim();

    if (!recipientName) {
      setRequestStatus("Please enter the recipient's name.");
      return;
    }

    if (!recipientAccountNumber) {
      setRequestStatus("Please enter the recipient account number.");
      return;
    }

    if (!/^[0-9]{6,20}$/.test(recipientAccountNumber)) {
      setRequestStatus(
        "Please enter a valid recipient account number."
      );
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setRequestStatus("Please enter a valid transfer amount.");
      return;
    }

    if (account?.status !== "active") {
      setRequestStatus(
        "Your account is not active and cannot send a transfer."
      );
      return;
    }

    if (amount > Number(account.balance || 0)) {
      setRequestStatus(
        "The transfer amount is greater than your available balance."
      );
      return;
    }

    setRequestLoading(true);

    try {
      const data = await invokeCustomerTransfer({
        action: "send_otp",
        recipientAccountNumber,
        recipientName,
        amount,
        description: description || "Customer Transfer",
      });

      setTransferId(data.transferId);
      setTransferOtp("");
      setTransferOtpStatus(
        `A 6-digit verification code has been sent to ${data.emailMasked || "your email address"}.`
      );
      setTransferOtpOpen(true);
    } catch (err) {
      setRequestStatus(
        err?.message ||
          "We could not start the transfer. Please try again."
      );
    } finally {
      setRequestLoading(false);
    }
  }

  async function verifyCustomerTransfer(event) {
    event.preventDefault();

    if (
      transferOtpLoading ||
      !transferId ||
      !transferOtp.trim()
    ) {
      return;
    }

    const code = transferOtp.trim();

    if (!/^[0-9]{6}$/.test(code)) {
      setTransferOtpStatus(
        "Enter the 6-digit verification code sent to your email."
      );
      return;
    }

    setTransferOtpLoading(true);
    setTransferOtpStatus("");

    try {
      const data = await invokeCustomerTransfer({
        action: "verify_otp",
        transferId,
        otp: code,
      });

      setTransferOtpOpen(false);
      setTransferOtp("");
      setTransferId("");
      resetRequestForm();
      setRequestStatus("");
      setTransferReceipt(data.receipt);
      setTransferReceiptOpen(true);

      await loadDashboard();
    } catch (err) {
      setTransferOtpStatus(
        err?.message ||
          "The verification code could not be accepted."
      );
    } finally {
      setTransferOtpLoading(false);
    }
  }

  async function resendCustomerTransferOtp() {
    if (
      transferResendLoading ||
      requestLoading ||
      !user
    ) {
      return;
    }

    setTransferResendLoading(true);
    setTransferOtpStatus("");

    try {
      const amount = Number(requestForm.amount);

      const data = await invokeCustomerTransfer({
        action: "send_otp",
        recipientAccountNumber:
          requestForm.recipientAccountNumber.trim(),
        recipientName:
          requestForm.recipientName.trim(),
        amount,
        description:
          requestForm.description.trim() ||
          "Customer Transfer",
      });

      setTransferId(data.transferId);
      setTransferOtp("");
      setTransferOtpStatus(
        `A new verification code has been sent to ${data.emailMasked || "your email address"}.`
      );
    } catch (err) {
      setTransferOtpStatus(
        err?.message ||
          "We could not send a new verification code."
      );
    } finally {
      setTransferResendLoading(false);
    }
  }

  function closeTransferOtp() {
    if (transferOtpLoading) return;

    setTransferOtpOpen(false);
    setTransferOtp("");
    setTransferId("");
    setTransferOtpStatus("");
  }

  function closeTransferReceipt() {
    setTransferReceiptOpen(false);
    setTransferReceipt(null);
  }


  /*
    =====================================================
    LOADING
    =====================================================
  */

  if (loading) {
    return (
      <main className="portal-loading">
        <div className="loading-card">

          <div className="loading-logo">
            M
          </div>

          <h2>
            MIDATLANTIC FEDERAL BANK
          </h2>

          <p>
            Loading your customer portal...
          </p>

        </div>
      </main>
    );
  }

  /*
    =====================================================
    ERROR
    =====================================================
  */

  if (error) {
    return (
      <main className="portal-loading">

        <div className="loading-card">

          <h2>
            Unable to Load Account
          </h2>

          <p>
            {error}
          </p>

          <button
            className="portal-button"
            onClick={logout}
          >
            Sign Out
          </button>

        </div>

      </main>
    );
  }

  /*
    =====================================================
    PENDING APPROVAL
    =====================================================
  */

  if (
    profile &&
    profile.approval_status !== "approved"
  ) {
    return (
      <main className="portal-page">

        <PortalHeader
          menuOpen={false}
          setMenuOpen={setMenuOpen}
          logout={logout}
          openPage={openPage}
          showMenu={false}
        />

        <div className="portal-content">

          <section className="pending-card">

            <span className="status-badge pending">
              PENDING APPROVAL
            </span>

            <h1>
              {greeting()},{" "}
              {profile.full_name || "Customer"}
            </h1>

            <h2>
              Account Awaiting Approval
            </h2>

            <p>
              Your registration has been received
              and is awaiting account approval.
            </p>

          </section>

        </div>

      </main>
    );
  }

  /*
    =====================================================
    NO ACCOUNT
    =====================================================
  */

  if (!account) {
    return (
      <main className="portal-page">

        <PortalHeader
          menuOpen={false}
          setMenuOpen={setMenuOpen}
          logout={logout}
          openPage={openPage}
          showMenu={false}
        />

        <div className="portal-content">

          <section className="pending-card">

            <h1>
              {greeting()},{" "}
              {profile?.full_name || "Customer"}
            </h1>

            <h2>
              Account Information Unavailable
            </h2>

            <p>
              Your customer profile has been
              approved, but an account record has
              not yet been assigned.
            </p>

          </section>

        </div>

      </main>
    );
  }

  /*
    =====================================================
    MAIN PORTAL
    =====================================================
  */

  return (
    <main className="portal-page">

      <PortalHeader
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        logout={logout}
        openPage={openPage}
        showMenu={true}
      />

      <div className="portal-content">

        {/* =================================================
            DASHBOARD
        ================================================= */}

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
                  Here's an overview of your
                  customer account.
                </p>

              </div>

            </section>

            {/* BALANCE */}

            <section className="balance-card-professional">

              <div className="balance-main">

                <p>
                  AVAILABLE BALANCE
                </p>

                <h2>
                  ${formatMoney(account.balance)}
                </h2>

                <span>
                  Account ending in{" "}
                  {String(
                    account.account_number || ""
                  ).slice(-4)}
                </span>

              </div>

              <div className="balance-status">

                <span className="online-dot"></span>

                {account.status || "Active"}

              </div>

            </section>

            {/* QUICK ACTIONS */}

            <section className="portal-section">

              <div className="section-heading">

                <div>

                  <span className="section-label">
                    ACCOUNT SERVICES
                  </span>

                  <h2>
                    Quick Actions
                  </h2>

                </div>

              </div>

              <div className="quick-action-grid">

                <button
                  onClick={() =>
                    openPage("withdraw")
                  }
                  className="quick-action"
                >
                  <span className="action-icon">
                    ↓
                  </span>

                  <strong>
                    Withdraw
                  </strong>

                  <small>
                    Submit a withdrawal request
                  </small>
                </button>

                <button
                  onClick={() =>
                    openPage("transfer")
                  }
                  className="quick-action"
                >
                  <span className="action-icon">
                    ↗
                  </span>

                  <strong>
                    Transfer
                  </strong>

                  <small>
                    Submit a transfer request
                  </small>
                </button>

                <button
                  onClick={() =>
                    openPage("wire")
                  }
                  className="quick-action"
                >
                  <span className="action-icon">
                    ⇄
                  </span>

                  <strong>
                    Wire Transfer
                  </strong>

                  <small>
                    Enter recipient information
                  </small>
                </button>

                <button
                  onClick={() =>
                    openPage("local")
                  }
                  className="quick-action"
                >
                  <span className="action-icon">
                    →
                  </span>

                  <strong>
                    Local Transfer
                  </strong>

                  <small>
                    Submit a local transfer request
                  </small>
                </button>

              </div>

            </section>

            {/* ACCOUNT + NOTIFICATIONS */}

            <div className="two-column">

              <section className="portal-section">

                <span className="section-label">
                  ACCOUNT
                </span>

                <h2>
                  Account Overview
                </h2>

                <div className="detail-row">

                  <span>
                    Account Holder
                  </span>

                  <strong>
                    {profile?.full_name}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>
                    Account Number
                  </span>

                  <strong>
                    {maskedAccountNumber(
                      account.account_number
                    )}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>
                    Account Type
                  </span>

                  <strong>
                    {account.account_type ||
                      "Checking"}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>
                    Account Status
                  </span>

                  <strong className="active-text">
                    {account.status ||
                      "Active"}
                  </strong>

                </div>

              </section>

              <section className="portal-section">

                <span className="section-label">
                  ACCOUNT ACTIVITY
                </span>

                <h2>
                  Notifications
                </h2>

                <div className="notification-item">

                  <div className="notification-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      Account Active
                    </strong>

                    <p>
                      Your customer account is
                      currently available.
                    </p>

                  </div>

                </div>

                <div className="notification-item">

                  <div className="notification-icon warning">
                    !
                  </div>

                  <div>

                    <strong>
                      Security Reminder
                    </strong>

                    <p>
                      Never share passwords or
                      verification codes.
                    </p>

                  </div>

                </div>

              </section>

            </div>

            {/* TRANSACTIONS */}

            <section className="portal-section">

              <div className="section-heading">

                <div>

                  <span className="section-label">
                    ACCOUNT ACTIVITY
                  </span>

                  <h2>
                    Recent Transactions
                  </h2>

                </div>

                <button
                  className="text-button"
                  onClick={() =>
                    openPage("transactions")
                  }
                >
                  View All
                </button>

              </div>

              {transactions.length === 0 ? (

                <div className="empty-state">

                  <div className="empty-icon">
                    ▣
                  </div>

                  <strong>
                    No Transactions Yet
                  </strong>

                  <p>
                    Transactions associated with
                    this account will appear here.
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
                          $
                          {formatMoney(
                            transaction.amount
                          )}
                        </strong>

                      </div>

                    ))}

                </div>

              )}

            </section>

            {/* NEWS & MARKET INSIGHTS */}

            <section className="portal-section news-section">

              <div className="section-heading news-heading">
                <div>
                  <span className="section-label">
                    MARKET & BANKING
                  </span>
                  <h2>News & Investment Insights</h2>
                  <p className="news-subtitle">
                    Banking, global markets and foreign investment highlights.
                  </p>
                </div>
              </div>

              <div className="news-grid">

                <article className="news-card news-card-featured">
                  <div className="news-image news-image-banking">
                    <span className="news-image-tag">BANKING</span>
                    <div>
                      <strong>Modern Banking &amp; Digital Finance</strong>
                      <small>Financial services continue to evolve around secure digital banking.</small>
                    </div>
                  </div>
                  <div className="news-content">
                    <span>FINANCIAL SERVICES</span>
                    <h3>Digital banking continues to reshape how customers manage money</h3>
                    <p>Follow developments in payments, banking technology and the future of financial services.</p>
                    <button className="news-link" type="button" onClick={() => openPage("support")}>Read More →</button>
                  </div>
                </article>

                <article className="news-card">
                  <div className="news-image news-image-investment">
                    <span className="news-image-tag">FOREIGN INVESTMENT</span>
                    <div>
                      <strong>Global Capital &amp; Investment</strong>
                      <small>International investors continue to watch emerging markets and infrastructure.</small>
                    </div>
                  </div>
                  <div className="news-content">
                    <span>GLOBAL MARKETS</span>
                    <h3>Foreign investment remains a key focus for emerging economies</h3>
                    <p>Explore the themes shaping cross-border investment, infrastructure and business growth.</p>
                    <button className="news-link" type="button" onClick={() => openPage("support")}>Read More →</button>
                  </div>
                </article>

                <article className="news-card">
                  <div className="news-image news-image-markets">
                    <span className="news-image-tag">MARKETS</span>
                    <div>
                      <strong>Global Markets &amp; Economic Outlook</strong>
                      <small>Interest rates, currencies and economic activity remain central market themes.</small>
                    </div>
                  </div>
                  <div className="news-content">
                    <span>ECONOMIC OUTLOOK</span>
                    <h3>Markets continue to track rates, currencies and economic growth</h3>
                    <p>Keep up with major financial themes that can influence businesses and international capital.</p>
                    <button className="news-link" type="button" onClick={() => openPage("support")}>Read More →</button>
                  </div>
                </article>

              </div>

              <div className="news-disclaimer">
                <span>MARKET INFORMATION</span>
                <p>News and market content is provided for general information and is not investment advice.</p>
              </div>

            </section>

          </>
        )}

        {/* =================================================
            MY PROFILE
        ================================================= */}

        {activePage === "profile" && (
          <PortalPage
            title="My Profile"
            label="CUSTOMER"
          >

            <div className="profile-header">

              <div className="profile-avatar-wrap">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${profile?.full_name || "Customer"} profile`}
                    className="profile-avatar-image"
                  />
                ) : (
                  <div className="profile-avatar">
                    {(profile?.full_name || "C")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <label className="profile-picture-button">
                  {avatarLoading
                    ? "Uploading..."
                    : avatarUrl
                    ? "Change Photo"
                    : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={uploadProfilePicture}
                    disabled={avatarLoading}
                    hidden
                  />
                </label>
              </div>

              <div>

                <h2>
                  {profile?.full_name ||
                    "Customer"}
                </h2>

                <p>
                  Customer Account
                </p>

              </div>

            </div>

            {avatarStatus && (
              <div
                className={`profile-picture-status ${
                  avatarStatus.toLowerCase().includes("successfully")
                    ? "success"
                    : "error"
                }`}
              >
                {avatarStatus}
              </div>
            )}

            <div className="profile-section-title">
              Personal Information
            </div>

            <InfoRow
              label="Full Name"
              value={profile?.full_name}
            />

            <InfoRow
              label="Date of Birth"
              value={formatDateOnly(
                profile?.date_of_birth
              )}
            />

            <InfoRow
              label="Phone Number"
              value={profile?.phone_number}
            />

            <InfoRow
              label="Email Address"
              value={user?.email}
            />

            <div className="profile-section-title">
              Address Information
            </div>

            <InfoRow
              label="Address"
              value={profile?.address}
            />

            <InfoRow
              label="City"
              value={profile?.city}
            />

            <InfoRow
              label="State"
              value={profile?.state}
            />

            <InfoRow
              label="Postal Code"
              value={profile?.postal_code}
            />

            <InfoRow
              label="Country"
              value={profile?.country}
            />

            <div className="profile-section-title">
              Account Information
            </div>

            <AccountNumberRow
              accountNumber={
                account.account_number
              }
              visible={
                showAccountNumber
              }
              onToggle={() =>
                setShowAccountNumber(
                  (current) => !current
                )
              }
            />

            <InfoRow
              label="Account Type"
              value={
                account.account_type ||
                "Checking"
              }
            />

            <InfoRow
              label="Account Status"
              value={
                account.status ||
                "Active"
              }
            />

            <InfoRow
              label="Account Created"
              value={formatDate(
                account.effective_created_at ||
                account.created_at
              )}
            />

          </PortalPage>
        )}

        {/* =================================================
            ACCOUNT INFORMATION
        ================================================= */}

        {activePage === "account" && (
          <PortalPage
            title="Account Information"
            label="ACCOUNT"
          >

            <InfoRow
              label="Account Holder"
              value={profile?.full_name}
            />

            <AccountNumberRow
              accountNumber={
                account.account_number
              }
              visible={
                showAccountNumber
              }
              onToggle={() =>
                setShowAccountNumber(
                  (current) => !current
                )
              }
            />

            <InfoRow
              label="Account Type"
              value={
                account.account_type ||
                "Checking"
              }
            />

            <InfoRow
              label="Account Status"
              value={
                account.status ||
                "Active"
              }
            />

            <InfoRow
              label="Available Balance"
              value={`$${formatMoney(
                account.balance
              )}`}
            />

            <InfoRow
              label="Account Created"
              value={formatDate(
                account.effective_created_at ||
                account.created_at
              )}
            />

          </PortalPage>
        )}

        {/* =================================================
            WITHDRAW / TRANSFER / WIRE / LOCAL
        ================================================= */}

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

            {activePage === "transfer" ? (
              <form onSubmit={submitRequest}>

                <div className="request-notice transfer-security-notice">
                  <strong>
                    Secure Customer Transfer
                  </strong>

                  <p>
                    Enter the recipient and amount below.
                    A one-time verification code will be sent
                    to your registered email address before
                    the transfer is completed.
                  </p>
                </div>

                <label className="form-label">
                  Recipient Name

                  <input
                    className="portal-input"
                    type="text"
                    value={requestForm.recipientName}
                    onChange={(event) =>
                      updateRequestField(
                        "recipientName",
                        event.target.value
                      )
                    }
                    placeholder="Enter recipient's full name"
                    autoComplete="off"
                    required
                  />
                </label>

                <label className="form-label">
                  Recipient Account Number

                  <input
                    className="portal-input"
                    type="text"
                    inputMode="numeric"
                    value={requestForm.recipientAccountNumber}
                    onChange={(event) =>
                      updateRequestField(
                        "recipientAccountNumber",
                        event.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="Enter recipient account number"
                    autoComplete="off"
                    maxLength={20}
                    required
                  />
                </label>

                <div className="transfer-bank-display">
                  <span>Bank</span>
                  <strong>MIDATLANTIC FEDERAL BANK</strong>
                </div>

                <label className="form-label">
                  Amount

                  <input
                    className="portal-input"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={requestForm.amount}
                    onChange={(event) =>
                      updateRequestField(
                        "amount",
                        event.target.value
                      )
                    }
                    placeholder="0.00"
                    required
                  />

                  <small className="transfer-balance-hint">
                    Available balance: $
                    {formatMoney(account.balance)}
                  </small>
                </label>

                <label className="form-label">
                  Description

                  <textarea
                    className="portal-textarea"
                    rows="4"
                    value={requestForm.description}
                    onChange={(event) =>
                      updateRequestField(
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="What is this transfer for? (optional)"
                  />
                </label>

                {requestStatus && (
                  <div className="request-notice error-notice">
                    <p>{requestStatus}</p>
                  </div>
                )}

                <button
                  className="portal-button transfer-submit-button"
                  type="submit"
                  disabled={requestLoading}
                >
                  {requestLoading
                    ? "Sending Verification Code..."
                    : "Transfer"}
                </button>

              </form>
            ) : (
              <form onSubmit={submitRequest}>

                <div className="request-notice">
                  <strong>
                    Request Information
                  </strong>

                  <p>
                    Submit your request below.
                    Requests are reviewed before
                    any action is taken.
                  </p>
                </div>

                {activePage !== "withdraw" && (
                  <>

                    <label className="form-label">
                      Recipient Name

                      <input
                        className="portal-input"
                        type="text"
                        value={
                          requestForm.recipientName
                        }
                        onChange={(event) =>
                          updateRequestField(
                            "recipientName",
                            event.target.value
                          )
                        }
                        placeholder="Enter recipient name"
                      />
                    </label>

                    <label className="form-label">
                      Recipient Account Number

                      <input
                        className="portal-input"
                        type="text"
                        value={
                          requestForm.recipientAccountNumber
                        }
                        onChange={(event) =>
                          updateRequestField(
                            "recipientAccountNumber",
                            event.target.value
                          )
                        }
                        placeholder="Enter account number"
                      />
                    </label>

                    <label className="form-label">
                      Bank Name

                      <input
                        className="portal-input"
                        type="text"
                        value={
                          requestForm.bankName
                        }
                        onChange={(event) =>
                          updateRequestField(
                            "bankName",
                            event.target.value
                          )
                        }
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
                    min="0.01"
                    step="0.01"
                    value={
                      requestForm.amount
                    }
                    onChange={(event) =>
                      updateRequestField(
                        "amount",
                        event.target.value
                      )
                    }
                    placeholder="0.00"
                    required
                  />
                </label>

                <label className="form-label">
                  Description

                  <textarea
                    className="portal-textarea"
                    rows="4"
                    value={
                      requestForm.description
                    }
                    onChange={(event) =>
                      updateRequestField(
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="Add a description or additional information"
                  />
                </label>

                {requestStatus && (
                  <div className="request-notice success-notice">
                    <p>
                      {requestStatus}
                    </p>
                  </div>
                )}

                <button
                  className="portal-button"
                  type="submit"
                  disabled={requestLoading}
                >
                  {requestLoading
                    ? "Submitting..."
                    : "Submit Request"}
                </button>

              </form>
            )}



          </PortalPage>
        )}

        {/* =================================================
            TRANSACTIONS
        ================================================= */}

        {activePage === "transactions" && (
          <PortalPage
            title="Transaction History"
            label="ACTIVITY"
          >

            {transactions.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  ▣
                </div>

                <strong>
                  No Transactions Yet
                </strong>

                <p>
                  Transactions associated with
                  this account will appear here.
                </p>

              </div>

            ) : (

              <div className="transaction-list-professional">

                {transactions.map(
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
                          {formatDate(
                            transaction.transaction_date
                          )}
                        </small>

                      </div>

                      <strong>
                        $
                        {formatMoney(
                          transaction.amount
                        )}
                      </strong>

                    </div>

                  )
                )}

              </div>

            )}

          </PortalPage>
        )}

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

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

                <strong>
                  Account Active
                </strong>

                <p>
                  Your customer account is
                  currently active.
                </p>

              </div>

            </div>

            <div className="notification-item">

              <div className="notification-icon warning">
                !
              </div>

              <div>

                <strong>
                  Security Reminder
                </strong>

                <p>
                  Never share your password,
                  PIN, or verification codes.
                </p>

              </div>

            </div>

          </PortalPage>
        )}

        {/* =================================================
            CUSTOMER SUPPORT
        ================================================= */}

        {activePage === "support" && (
          <PortalPage
            title="Customer Support"
            label="SUPPORT"
          >

            <div className="support-intro">

              <h2>
                How can we help you today?
              </h2>

              <p>
                Choose a support option or use
                the live chat button in the
                bottom-right corner.
              </p>

            </div>

            <div className="support-grid-professional">

              <button
                onClick={async () => {
                  setChatOpen(true);
                  await loadChatMessages();
                }}
                className="support-option"
              >

                <span>
                  💬
                </span>

                <strong>
                  Live Chat
                </strong>

                <small>
                  Chat with customer support
                </small>

              </button>

              <button className="support-option">

                <span>
                  🎫
                </span>

                <strong>
                  Support Ticket
                </strong>

                <small>
                  Submit a question or complaint
                </small>

              </button>

              <button className="support-option">

                <span>
                  ?
                </span>

                <strong>
                  Frequently Asked Questions
                </strong>

                <small>
                  Find answers to common questions
                </small>

              </button>

              <button className="support-option">

                <span>
                  !
                </span>

                <strong>
                  Report a Problem
                </strong>

                <small>
                  Report an account or security issue
                </small>

              </button>

            </div>

          </PortalPage>
        )}

        {/* =================================================
            SECURITY
        ================================================= */}

        {activePage === "security" && (
          <PortalPage
            title="Security Center"
            label="SECURITY"
          >

            <div className="security-box">

              <h2>
                Protect Your Account
              </h2>

              <p>
                Never share your password, PIN,
                or verification codes with
                another person.
              </p>

            </div>

            <div className="security-box">

              <h3>
                Account Security
              </h3>

              <p>
                Use a strong password and sign
                out when using a shared device.
              </p>

            </div>

          </PortalPage>
        )}

        {/* =================================================
            SETTINGS
        ================================================= */}

        {activePage === "settings" && (
          <PortalPage
            title="Account Settings"
            label="SECURITY"
          >

            <div className="settings-row">

              <div>

                <strong>
                  Password
                </strong>

                <p>
                  Change your account password.
                </p>

              </div>

              <button
                className="secondary-action"
                type="button"
                onClick={() => {
                  setPasswordStatus("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setPasswordModalOpen(true);
                }}
              >
                Change
              </button>

            </div>

            <div className="settings-row">

              <div>

                <strong>
                  Email Address
                </strong>

                <p>
                  {user?.email}
                </p>

              </div>

            </div>

            <div className="settings-row">

              <div>

                <strong>
                  Sign Out
                </strong>

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

      {passwordModalOpen && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !passwordLoading) {
              setPasswordModalOpen(false);
              setPasswordStatus("");
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            background: "rgba(0, 0, 0, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-password-title"
            onMouseDown={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
              color: "#172033",
              position: "relative",
            }}
          >
            <button
              type="button"
              aria-label="Close change password"
              onClick={() => {
                if (passwordLoading) return;
                setPasswordModalOpen(false);
                setPasswordStatus("");
              }}
              style={{
                position: "absolute",
                top: "14px",
                right: "16px",
                border: "none",
                background: "transparent",
                fontSize: "28px",
                lineHeight: 1,
                cursor: passwordLoading ? "not-allowed" : "pointer",
                color: "#5b6577",
              }}
            >
              ×
            </button>

            <div style={{ paddingRight: "30px", marginBottom: "22px" }}>
              <span className="section-label">SECURITY</span>
              <h2 id="change-password-title" style={{ margin: "6px 0 8px" }}>
                Change Password
              </h2>
              <p style={{ margin: 0, color: "#667085", lineHeight: 1.6 }}>
                Choose a new password for your MIDATLANTIC FEDERAL BANK account.
              </p>
            </div>

            <form onSubmit={changePassword}>
              <label
                htmlFor="new-password"
                style={{ display: "block", fontWeight: 700, marginBottom: "8px" }}
              >
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Enter a new password"
                autoComplete="new-password"
                minLength={8}
                required
                disabled={passwordLoading}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px 14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "9px",
                  fontSize: "15px",
                  marginBottom: "8px",
                  background: "#fff",
                  color: "#172033",
                }}
              />

              <small style={{ display: "block", color: "#667085", marginBottom: "18px" }}>
                Use at least 8 characters. A longer password is recommended.
              </small>

              <label
                htmlFor="confirm-new-password"
                style={{ display: "block", fontWeight: 700, marginBottom: "8px" }}
              >
                Confirm New Password
              </label>
              <input
                id="confirm-new-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your new password"
                autoComplete="new-password"
                minLength={8}
                required
                disabled={passwordLoading}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px 14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "9px",
                  fontSize: "15px",
                  marginBottom: "16px",
                  background: "#fff",
                  color: "#172033",
                }}
              />

              {passwordStatus && (
                <div
                  role="status"
                  style={{
                    padding: "12px 14px",
                    borderRadius: "8px",
                    marginBottom: "18px",
                    background: passwordStatus.toLowerCase().includes("success") ? "#ecfdf3" : "#fef2f2",
                    color: passwordStatus.toLowerCase().includes("success") ? "#067647" : "#b42318",
                    border: `1px solid ${passwordStatus.toLowerCase().includes("success") ? "#abefc6" : "#fecdca"}`,
                  }}
                >
                  {passwordStatus}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => {
                    if (passwordLoading) return;
                    setPasswordModalOpen(false);
                    setPasswordStatus("");
                  }}
                  disabled={passwordLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="portal-button"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .profile-avatar-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .profile-avatar-image,
        .profile-avatar {
          width: 92px;
          height: 92px;
          border-radius: 50%;
          object-fit: cover;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .profile-picture-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 36px;
          padding: 8px 14px;
          border-radius: 8px;
          background: #173b70;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }
        .profile-picture-button:hover { opacity: 0.92; }
        .profile-picture-button input { display: none; }
        .profile-picture-status {
          margin: 14px 0 4px;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13px;
        }
        .profile-picture-status.success {
          background: #eaf7ee;
          color: #176b35;
        }
        .profile-picture-status.error {
          background: #fff0f0;
          color: #a12626;
        }
      `}</style>


      {/* ===================================================
          TRANSFER OTP MODAL
      =================================================== */}

      {transferOtpOpen && (
        <div
          className="transfer-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeTransferOtp();
            }
          }}
        >
          <div
            className="transfer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transfer-otp-title"
          >
            <div className="transfer-modal-brand">
              <div className="transfer-receipt-logo">M</div>
              <div>
                <strong>MIDATLANTIC FEDERAL BANK</strong>
                <span>SECURE CUSTOMER TRANSFER</span>
              </div>
            </div>

            <button
              type="button"
              className="transfer-modal-close"
              onClick={closeTransferOtp}
              aria-label="Close verification"
            >
              ×
            </button>

            <div className="transfer-modal-content">
              <span className="section-label">
                EMAIL VERIFICATION
              </span>

              <h2 id="transfer-otp-title">
                Verify Your Transfer
              </h2>

              <p>
                Enter the 6-digit code we sent to your
                registered email address.
              </p>

              {transferOtpStatus && (
                <div
                  className={`transfer-otp-status ${
                    transferOtpStatus.toLowerCase().includes("sent")
                      ? "success"
                      : "error"
                  }`}
                  role="status"
                >
                  {transferOtpStatus}
                </div>
              )}

              <form onSubmit={verifyCustomerTransfer}>
                <label className="form-label">
                  Verification Code

                  <input
                    className="portal-input transfer-otp-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={transferOtp}
                    onChange={(event) =>
                      setTransferOtp(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6)
                      )
                    }
                    placeholder="000000"
                    autoFocus
                    required
                  />
                </label>

                <div className="transfer-otp-summary">
                  <div>
                    <span>Amount</span>
                    <strong>
                      ${formatMoney(requestForm.amount)}
                    </strong>
                  </div>

                  <div>
                    <span>Recipient</span>
                    <strong>
                      {requestForm.recipientName}
                    </strong>
                  </div>

                  <div>
                    <span>Account</span>
                    <strong>
                      {requestForm.recipientAccountNumber}
                    </strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="portal-button"
                  disabled={
                    transferOtpLoading ||
                    transferOtp.length !== 6
                  }
                >
                  {transferOtpLoading
                    ? "Verifying..."
                    : "Verify & Complete Transfer"}
                </button>
              </form>

              <button
                type="button"
                className="transfer-resend-button"
                onClick={resendCustomerTransferOtp}
                disabled={transferResendLoading}
              >
                {transferResendLoading
                  ? "Sending..."
                  : "Didn't receive the code? Send a new code"}
              </button>

              <small className="transfer-security-footnote">
                Never share your verification code with anyone,
                including someone claiming to be bank staff.
              </small>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          TRANSFER SUCCESS RECEIPT
      =================================================== */}

      {transferReceiptOpen && transferReceipt && (
        <div
          className="transfer-modal-backdrop receipt-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeTransferReceipt();
            }
          }}
        >
          <div
            className="transfer-receipt"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transfer-receipt-title"
          >
            <div className="receipt-top">
              <div className="transfer-receipt-logo">M</div>

              <div>
                <strong>
                  MIDATLANTIC FEDERAL BANK
                </strong>
                <span>
                  CUSTOMER BANKING PORTAL
                </span>
              </div>
            </div>

            <div className="receipt-success-icon">
              ✓
            </div>

            <span className="receipt-status">
              TRANSFER SUCCESSFUL
            </span>

            <h2 id="transfer-receipt-title">
              Your transfer was completed
            </h2>

            <div className="receipt-amount">
              $
              {formatMoney(transferReceipt.amount)}
            </div>

            <div className="receipt-details">
              <div className="receipt-detail-row">
                <span>Date</span>
                <strong>
                  {formatDate(transferReceipt.date)}
                </strong>
              </div>

              <div className="receipt-detail-row">
                <span>Customer Name</span>
                <strong>
                  {transferReceipt.customerName}
                </strong>
              </div>

              <div className="receipt-detail-row">
                <span>Receiver Name</span>
                <strong>
                  {transferReceipt.receiverName}
                </strong>
              </div>

              <div className="receipt-detail-row">
                <span>Receiver Account</span>
                <strong>
                  {transferReceipt.receiverAccountNumber}
                </strong>
              </div>

              <div className="receipt-detail-row">
                <span>Bank</span>
                <strong>
                  MIDATLANTIC FEDERAL BANK
                </strong>
              </div>

              {transferReceipt.reference && (
                <div className="receipt-detail-row">
                  <span>Reference</span>
                  <strong>
                    {transferReceipt.reference}
                  </strong>
                </div>
              )}
            </div>

            <div className="receipt-footer">
              <span>
                Keep this receipt for your records.
              </span>

              <button
                type="button"
                className="portal-button"
                onClick={closeTransferReceipt}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ===================================================
          TRANSFER OTP MODAL
      =================================================== */}

      {transferOtpOpen && (
        <div
          className="transfer-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeTransferOtp();
            }
          }}
        >
          <div
            className="transfer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transfer-otp-title"
          >
            <div className="transfer-modal-brand">
              <div className="transfer-receipt-logo">M</div>
              <div>
                <strong>MIDATLANTIC FEDERAL BANK</strong>
                <span>SECURE CUSTOMER TRANSFER</span>
              </div>
            </div>

            <button
              type="button"
              className="transfer-modal-close"
              onClick={closeTransferOtp}
              aria-label="Close verification"
            >
              ×
            </button>

            <div className="transfer-modal-content">
              <span className="section-label">
                EMAIL VERIFICATION
              </span>

              <h2 id="transfer-otp-title">
                Verify Your Transfer
              </h2>

              <p>
                Enter the 6-digit code we sent to your
                registered email address.
              </p>

              {transferOtpStatus && (
                <div
                  className={`transfer-otp-status ${
                    transferOtpStatus.toLowerCase().includes("sent")
                      ? "success"
                      : "error"
                  }`}
                  role="status"
                >
                  {transferOtpStatus}
                </div>
              )}

              <form onSubmit={verifyCustomerTransfer}>
                <label className="form-label">
                  Verification Code

                  <input
                    className="portal-input transfer-otp-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={transferOtp}
                    onChange={(event) =>
                      setTransferOtp(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6)
                      )
                    }
                    placeholder="000000"
                    autoFocus
                    required
                  />
                </label>

                <div className="transfer-otp-summary">
                  <div>
                    <span>Amount</span>
                    <strong>
                      ${formatMoney(requestForm.amount)}
                    </strong>
                  </div>

                  <div>
                    <span>Recipient</span>
                    <strong>
                      {requestForm.recipientName}
                    </strong>
                  </div>

                  <div>
                    <span>Account</span>
                    <strong>
                      {requestForm.recipientAccountNumber}
                    </strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="portal-button"
                  disabled={
                    transferOtpLoading ||
                    transferOtp.length !== 6
                  }
                >
                  {transferOtpLoading
                    ? "Verifying..."
                    : "Verify & Complete Transfer"}
                </button>
              </form>

              <button
                type="button"
                className="transfer-resend-button"
                onClick={resendCustomerTransferOtp}
                disabled={transferResendLoading}
              >
                {transferResendLoading
                  ? "Sending..."
                  : "Didn't receive the code? Send a new code"}
              </button>

              <small className="transfer-security-footnote">
                Never share your verification code with anyone,
                including someone claiming to be bank staff.
              </small>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          TRANSFER SUCCESS RECEIPT
      =================================================== */}

      {transferReceiptOpen && transferReceipt && (
        <div
          className="transfer-modal-backdrop receipt-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeTransferReceipt();
            }
          }}
        >
          <div
            className="transfer-receipt"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transfer-receipt-title"
          >
            <div className="receipt-top">
              <div className="transfer-receipt-logo">M</div>

              <div>
                <strong>
                  MIDATLANTIC FEDERAL BANK
                </strong>
                <span>
                  CUSTOMER BANKING PORTAL
                </span>
              </div>
            </div>

            <div className="receipt-success-icon">
              ✓
            </div>

            <span className="receipt-status">
              TRANSFER SUCCESSFUL
            </span>

            <h2 id="transfer-receipt-title">
              Your transfer was completed
            </h2>

            <div className="receipt-amount">
              $
              {formatMoney(transferReceipt.amount)}
            </div>

            <div className="receipt-details">
              <div className="receipt-detail-row">
                <span>Date</span>
                <strong>
                  {formatDate(transferReceipt.date)}
                </strong>
              </div>

              <div className="receipt-detail-row">
                <span>Customer Name</span>
                <strong>
                  {transferReceipt.customerName}
                </strong>
              </div>

              <div className="receipt-detail-row">
                <span>Receiver Name</span>
                <strong>
                  {transferReceipt.receiverName}
                </strong>
              </div>

              <div className="receipt-detail-row">
                <span>Receiver Account</span>
                <strong>
                  {transferReceipt.receiverAccountNumber}
                </strong>
              </div>

              <div className="receipt-detail-row">
                <span>Bank</span>
                <strong>
                  MIDATLANTIC FEDERAL BANK
                </strong>
              </div>

              {transferReceipt.reference && (
                <div className="receipt-detail-row">
                  <span>Reference</span>
                  <strong>
                    {transferReceipt.reference}
                  </strong>
                </div>
              )}
            </div>

            <div className="receipt-footer">
              <span>
                Keep this receipt for your records.
              </span>

              <button
                type="button"
                className="portal-button"
                onClick={closeTransferReceipt}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}


<style jsx global>{`
  .transfer-bank-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 14px 16px;
    margin: 0 0 18px;
    border: 1px solid rgba(23, 59, 112, 0.14);
    border-radius: 12px;
    background: rgba(23, 59, 112, 0.045);
  }

  .transfer-bank-display span {
    color: #667085;
    font-size: 13px;
    font-weight: 600;
  }

  .transfer-bank-display strong {
    color: #173b70;
    font-size: 13px;
    text-align: right;
  }

  .transfer-balance-hint {
    display: block;
    margin-top: 6px;
    color: #667085;
    font-size: 12px;
  }

  .transfer-submit-button {
    min-height: 50px;
    font-weight: 800;
  }

  .transfer-security-notice {
    border-color: rgba(23, 59, 112, 0.16);
  }

  .error-notice {
    border-color: rgba(180, 35, 35, 0.22);
    background: rgba(180, 35, 35, 0.055);
  }

  .transfer-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 22px;
    background: rgba(8, 18, 36, 0.72);
    backdrop-filter: blur(8px);
    overflow-y: auto;
  }

  .transfer-modal,
  .transfer-receipt {
    position: relative;
    width: min(100%, 520px);
    max-height: calc(100vh - 44px);
    overflow-y: auto;
    border-radius: 20px;
    background: #ffffff;
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.3);
  }

  .transfer-modal {
    padding: 26px;
  }

  .transfer-modal-brand,
  .receipt-top {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-right: 42px;
  }

  .transfer-modal-brand strong,
  .receipt-top strong {
    display: block;
    color: #173b70;
    font-size: 14px;
    letter-spacing: 0.04em;
  }

  .transfer-modal-brand span,
  .receipt-top span {
    display: block;
    margin-top: 3px;
    color: #667085;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.09em;
  }

  .transfer-receipt-logo {
    width: 48px;
    height: 48px;
    flex: 0 0 48px;
    display: grid;
    place-items: center;
    border-radius: 14px;
    background: #173b70;
    color: #ffffff;
    font-size: 24px;
    font-weight: 900;
  }

  .transfer-modal-close {
    position: absolute;
    top: 18px;
    right: 18px;
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.06);
    color: #344054;
    font-size: 23px;
    line-height: 1;
    cursor: pointer;
  }

  .transfer-modal-content {
    margin-top: 26px;
  }

  .transfer-modal-content h2 {
    margin: 6px 0 8px;
  }

  .transfer-modal-content > p {
    margin: 0 0 18px;
    color: #667085;
    line-height: 1.6;
  }

  .transfer-otp-status {
    padding: 11px 13px;
    margin-bottom: 15px;
    border-radius: 10px;
    font-size: 13px;
    line-height: 1.45;
  }

  .transfer-otp-status.success {
    background: rgba(18, 132, 89, 0.08);
    color: #087443;
  }

  .transfer-otp-status.error {
    background: rgba(180, 35, 35, 0.07);
    color: #a11b1b;
  }

  .transfer-otp-input {
    text-align: center;
    font-size: 25px !important;
    font-weight: 800;
    letter-spacing: 0.35em;
  }

  .transfer-otp-summary {
    display: grid;
    gap: 9px;
    margin: 18px 0;
    padding: 15px;
    border-radius: 12px;
    background: #f7f9fc;
  }

  .transfer-otp-summary div {
    display: flex;
    justify-content: space-between;
    gap: 14px;
  }

  .transfer-otp-summary span {
    color: #667085;
    font-size: 12px;
  }

  .transfer-otp-summary strong {
    color: #172b4d;
    font-size: 13px;
    text-align: right;
  }

  .transfer-resend-button {
    display: block;
    width: 100%;
    margin-top: 14px;
    border: 0;
    background: transparent;
    color: #173b70;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  .transfer-resend-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .transfer-security-footnote {
    display: block;
    margin-top: 18px;
    color: #98a2b3;
    font-size: 11px;
    line-height: 1.5;
    text-align: center;
  }

  .transfer-receipt {
    padding: 28px;
  }

  .receipt-top {
    padding-bottom: 20px;
    border-bottom: 1px solid #eaecf0;
  }

  .receipt-success-icon {
    width: 58px;
    height: 58px;
    margin: 25px auto 12px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #0e8a58;
    color: #ffffff;
    font-size: 31px;
    font-weight: 800;
  }

  .receipt-status {
    display: block;
    color: #0e8a58;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-align: center;
  }

  .transfer-receipt h2 {
    margin: 8px 0 0;
    color: #172b4d;
    font-size: 20px;
    text-align: center;
  }

  .receipt-amount {
    margin: 18px 0 22px;
    color: #173b70;
    font-size: 38px;
    font-weight: 900;
    text-align: center;
  }

  .receipt-details {
    border-top: 1px solid #eaecf0;
    border-bottom: 1px solid #eaecf0;
  }

  .receipt-detail-row {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    padding: 13px 0;
    border-bottom: 1px dashed #eaecf0;
  }

  .receipt-detail-row:last-child {
    border-bottom: 0;
  }

  .receipt-detail-row span {
    color: #667085;
    font-size: 12px;
  }

  .receipt-detail-row strong {
    color: #172b4d;
    font-size: 12px;
    text-align: right;
    word-break: break-word;
  }

  .receipt-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-top: 20px;
  }

  .receipt-footer > span {
    color: #98a2b3;
    font-size: 11px;
    line-height: 1.4;
  }

  @media (max-width: 560px) {
    .transfer-modal-backdrop {
      align-items: flex-start;
      padding: 12px;
    }

    .transfer-modal,
    .transfer-receipt {
      max-height: calc(100vh - 24px);
      border-radius: 16px;
    }

    .transfer-modal {
      padding: 20px;
    }

    .transfer-receipt {
      padding: 20px;
    }

    .transfer-bank-display {
      align-items: flex-start;
      flex-direction: column;
      gap: 5px;
    }

    .transfer-bank-display strong {
      text-align: left;
    }

    .receipt-amount {
      font-size: 32px;
    }

    .receipt-detail-row {
      align-items: flex-start;
      flex-direction: column;
      gap: 5px;
    }

    .receipt-detail-row strong {
      text-align: left;
    }

    .receipt-footer {
      align-items: stretch;
      flex-direction: column;
    }
  }
`}</style>

      {/* ===================================================
          FLOATING SUPPORT BUTTON
      =================================================== */}

      <button
        className="live-chat-button"
        onClick={async () => {

          const next = !chatOpen;

          setChatOpen(next);

          if (next && user) {
            await loadChatMessages();
          }

        }}
        aria-label="Open live chat"
      >

        <span className="chat-online-dot"></span>

        <span className="chat-symbol">
          💬
        </span>

        <span className="chat-button-text">
          Support
        </span>

      </button>

      {/* ===================================================
          CHAT WINDOW
      =================================================== */}

      {chatOpen && (

        <div className="live-chat-window">

          <div className="chat-header">

            <div className="chat-header-info">

              <div className="chat-header-logo">
                M
              </div>

              <div>

                <strong>
                  Customer Support
                </strong>

                <span>

                  <span className="chat-header-dot"></span>

                  Online

                </span>

              </div>

            </div>

            <button
              onClick={() =>
                setChatOpen(false)
              }
              className="chat-close"
              aria-label="Close chat"
            >
              ×
            </button>

          </div>

          <div className="chat-body">

            {chatMessages.map(
              (message) => (

                <div
                  key={message.id}
                  className={
                    message.sender === "customer"
                      ? "chat-message customer"
                      : "chat-message support"
                  }
                >
                  {message.message}
                </div>

              )
            )}

          </div>

          <form
            className="chat-input-area"
            onSubmit={sendChatMessage}
          >

            <input
              value={chatMessage}
              onChange={(event) =>
                setChatMessage(
                  event.target.value
                )
              }
              placeholder="Type your message..."
              disabled={chatLoading}
            />

            <button
              type="submit"
              disabled={chatLoading}
            >
              {chatLoading
                ? "..."
                : "Send"}
            </button>

          </form>

        </div>

      )}

    </main>
  );
}

/*
=====================================================
CUSTOMER PORTAL HEADER
=====================================================
*/

function PortalHeader({
  menuOpen,
  setMenuOpen,
  logout,
  openPage,
  showMenu = true,
}) {
  return (
    <header className="portal-header">

      <div className="portal-brand">

        <div className="portal-logo">
          M
        </div>

        <div className="portal-brand-text">

          <strong>
            MIDATLANTIC
          </strong>

          <span>
            FEDERAL BANK
          </span>

          <small>
            CUSTOMER BANKING PORTAL
          </small>

        </div>

      </div>

      <div className="portal-header-right">

        <div className="portal-online">

          <span className="online-dot"></span>

          <span>
            Online
          </span>

        </div>

        {showMenu ? (

          <button
            className={`menu-trigger ${
              menuOpen
                ? "menu-trigger-open"
                : ""
            }`}
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Open customer menu"
            aria-expanded={menuOpen}
          >

            <span></span>
            <span></span>
            <span></span>

          </button>

        ) : (

          <button
            className="portal-button header-signout"
            onClick={logout}
          >
            Sign Out
          </button>

        )}

      </div>

      {showMenu && menuOpen && (

        <div className="customer-menu">

          <div className="menu-header">

            <div>

              <strong>
                Customer Portal
              </strong>

              <span>
                Account Menu
              </span>

            </div>

            <button
              className="menu-close"
              onClick={() =>
                setMenuOpen(false)
              }
              aria-label="Close menu"
            >
              ×
            </button>

          </div>

          <div className="menu-group">

            <div className="menu-section">
              MAIN
            </div>

            <button
              onClick={() =>
                openPage("dashboard")
              }
            >
              <span className="menu-icon">
                ⌂
              </span>

              <span>
                Dashboard
              </span>
            </button>

            <button
              onClick={() =>
                openPage("profile")
              }
            >
              <span className="menu-icon">
                ○
              </span>

              <span>
                My Profile
              </span>
            </button>

            <button
              onClick={() =>
                openPage("account")
              }
            >
              <span className="menu-icon">
                ▣
              </span>

              <span>
                Account Information
              </span>
            </button>

          </div>

          <div className="menu-group">

            <div className="menu-section">
              TRANSFERS & PAYMENTS
            </div>

            <button
              onClick={() =>
                openPage("withdraw")
              }
            >
              <span className="menu-icon">
                ↓
              </span>

              <span>
                Withdraw
              </span>
            </button>

            <button
              onClick={() =>
                openPage("transfer")
              }
            >
              <span className="menu-icon">
                ↗
              </span>

              <span>
                Transfer
              </span>
            </button>

            <button
              onClick={() =>
                openPage("wire")
              }
            >
              <span className="menu-icon">
                ⇄
              </span>

              <span>
                Wire Transfer
              </span>
            </button>

            <button
              onClick={() =>
                openPage("local")
              }
            >
              <span className="menu-icon">
                →
              </span>

              <span>
                Local Transfer
              </span>
            </button>

          </div>

          <div className="menu-group">

            <div className="menu-section">
              ACTIVITY
            </div>

            <button
              onClick={() =>
                openPage("transactions")
              }
            >
              <span className="menu-icon">
                ▤
              </span>

              <span>
                Transaction History
              </span>
            </button>

            <button
              onClick={() =>
                openPage("notifications")
              }
            >
              <span className="menu-icon">
                ○
              </span>

              <span>
                Notifications
              </span>
            </button>

          </div>

          <div className="menu-group">

            <div className="menu-section">
              SUPPORT
            </div>

            <button
              onClick={() =>
                openPage("support")
              }
            >
              <span className="menu-icon">
                ?
              </span>

              <span>
                Customer Support
              </span>
            </button>

          </div>

          <div className="menu-group">

            <div className="menu-section">
              SECURITY
            </div>

            <button
              onClick={() =>
                openPage("security")
              }
            >
              <span className="menu-icon">
                ◇
              </span>

              <span>
                Security Center
              </span>
            </button>

            <button
              onClick={() =>
                openPage("settings")
              }
            >
              <span className="menu-icon">
                ⚙
              </span>

              <span>
                Account Settings
              </span>
            </button>

          </div>

          <div className="menu-divider"></div>

          <button
            className="signout-menu"
            onClick={logout}
          >
            <span className="menu-icon">
              ↪
            </span>

            <span>
              Sign Out
            </span>
          </button>

        </div>

      )}

    </header>
  );
}

/*
=====================================================
ACCOUNT NUMBER ROW
Eye button reveals/hides the complete number.
=====================================================
*/

function AccountNumberRow({
  accountNumber,
  visible,
  onToggle,
}) {
  return (
    <div className="detail-row large account-number-row">

      <span>
        Account Number
      </span>

      <div className="account-number-value">

        <strong>
          {visible
            ? visibleAccountNumber(
                accountNumber
              )
            : maskedAccountNumber(
                accountNumber
              )}
        </strong>

        {accountNumber && (

          <button
            type="button"
            className="account-number-eye"
            onClick={onToggle}
            aria-label={
              visible
                ? "Hide account number"
                : "Show account number"
            }
            title={
              visible
                ? "Hide account number"
                : "Show account number"
            }
          >
            {visible
              ? "◉"
              : "◌"}
          </button>

        )}

      </div>

    </div>
  );
}

/*
=====================================================
GENERIC PAGE
=====================================================
*/

function PortalPage({
  title,
  label,
  children,
}) {
  return (
    <section className="portal-page-section">

      <div className="page-heading">

        <div>

          <span className="section-label">
            {label}
          </span>

          <h1>
            {title}
          </h1>

        </div>

      </div>

      <div className="page-body">
        {children}
      </div>

    </section>
  );
}

/*
=====================================================
INFO ROW
=====================================================
*/

function InfoRow({
  label,
  value,
}) {
  return (
    <div className="detail-row large">

      <span>
        {label}
      </span>

      <strong>
        {value || "Not available"}
      </strong>

    </div>
  );
}

/*
=====================================================
ACCOUNT NUMBER HELPERS
=====================================================
*/

function maskedAccountNumber(
  accountNumber
) {
  if (!accountNumber) {
    return "Not available";
  }

  const value =
    String(accountNumber);

  if (value.length <= 4) {
    return value;
  }

  return `•••• ${value.slice(-4)}`;
}

function visibleAccountNumber(
  accountNumber
) {
  if (!accountNumber) {
    return "Not available";
  }

  return String(accountNumber);
}
