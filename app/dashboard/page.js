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
  const [customerCard, setCustomerCard] = useState(null);
  const [cardOrders, setCardOrders] = useState([]);
  const [cardLoading, setCardLoading] = useState(false);
  const [cardOrderLoading, setCardOrderLoading] = useState(false);
  const [cardStatus, setCardStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  const [showAccountNumber, setShowAccountNumber] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const [requestForm, setRequestForm] = useState({
    recipientName: "",
    recipientAccountNumber: "",
    bankName: "",
    bankCountry: "US",
    transferCurrency: "USD",
    transferMethod: "LOCAL",
    beneficiaryType: "PERSONAL",
    accountName: "",
    routingType: "aba",
    routingValue: "",
    swiftBic: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    amount: "",
    description: "",
  });

  const [requestStatus, setRequestStatus] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);

  const [transferOtpOpen, setTransferOtpOpen] = useState(false);
  const [transferOtp, setTransferOtp] = useState("");
  const [transferId, setTransferId] = useState("");
  const [transferPageType, setTransferPageType] = useState("transfer");
  const [transferOtpStatus, setTransferOtpStatus] = useState("");
  const [transferOtpLoading, setTransferOtpLoading] = useState(false);
  const [transferResendLoading, setTransferResendLoading] = useState(false);
  const [transferReceiptOpen, setTransferReceiptOpen] = useState(false);
  const [transferReceipt, setTransferReceipt] = useState(null);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const formatMoney = (value) => {
    const number = Number(value || 0);

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const maskAccountNumber = (value) => {
    if (!value) return "Not available";

    const text = String(value);

    if (text.length <= 4) {
      return text;
    }

    return `••••••${text.slice(-4)}`;
  };

  const maskCardNumber = (last4) => {
    if (!last4) return "•••• •••• •••• ••••";

    return `•••• •••• •••• ${last4}`;
  };

  const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";

    return "Good evening";
  };

  const getInitials = (name) => {
    if (!name) return "C";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  async function loadCardData(userId = user?.id, accountId = account?.id) {
    if (!userId) return;

    setCardLoading(true);

    try {
      let cardQuery = supabase
        .from("customer_cards")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (accountId) {
        cardQuery = cardQuery.eq("account_id", accountId);
      }

      const { data: cards, error: cardError } = await cardQuery;

      if (cardError) {
        console.error("Card load error:", cardError);
      }

      setCustomerCard(cards?.[0] || null);

      const { data: orders, error: orderError } = await supabase
        .from("customer_card_orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (orderError) {
        console.error("Card order load error:", orderError);
      }

      setCardOrders(orders || []);
    } catch (err) {
      console.error("Card loading failed:", err);
    } finally {
      setCardLoading(false);
    }
  }

  async function loadWithdrawalRequests(userId = user?.id) {
    if (!userId) return;

    setWithdrawalLoading(true);

    try {
      const { data, error: withdrawalError } = await supabase
        .from("withdrawal_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (withdrawalError) {
        console.error("Withdrawal request error:", withdrawalError);
        return;
      }

      setWithdrawalRequests(data || []);
    } catch (err) {
      console.error("Withdrawal loading failed:", err);
    } finally {
      setWithdrawalLoading(false);
    }
  }

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user: currentUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!currentUser) {
        window.location.href = "/login";
        return;
      }

      setUser(currentUser);

      const [
        profileResult,
        accountResult,
        transactionsResult,
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle(),

        supabase
          .from("accounts")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle(),

        supabase
          .from("transactions")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      if (profileResult.error) {
        console.error("Profile error:", profileResult.error);
      }

      if (accountResult.error) {
        console.error("Account error:", accountResult.error);
      }

      if (transactionsResult.error) {
        console.error(
          "Transaction error:",
          transactionsResult.error
        );
      }

      const loadedProfile = profileResult.data || null;
      const loadedAccount = accountResult.data || null;

      setProfile(loadedProfile);
      setAccount(loadedAccount);
      setTransactions(transactionsResult.data || []);

      if (loadedProfile?.avatar_url) {
        setAvatarUrl(loadedProfile.avatar_url);
      }

      await Promise.all([
        loadCardData(
          currentUser.id,
          loadedAccount?.id || null
        ),
        loadWithdrawalRequests(currentUser.id),
      ]);
    } catch (err) {
      console.error("Dashboard load error:", err);

      setError(
        err?.message ||
          "We could not load your dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        window.location.href = "/login";
      }

      if (session?.user && event === "SIGNED_IN") {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function uploadAvatar(event) {
    const file = event.target.files?.[0];

    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      setAvatarStatus("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarStatus("Please choose an image smaller than 5 MB.");
      return;
    }

    setAvatarLoading(true);
    setAvatarStatus("");

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const filePath = `${user.id}/profile-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl || "";

      if (!publicUrl) {
        throw new Error("Could not create the profile image URL.");
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
        })
        .eq("id", user.id);

      if (profileError) {
        throw profileError;
      }

      setAvatarUrl(publicUrl);
      setProfile((current) => ({
        ...(current || {}),
        avatar_url: publicUrl,
      }));
      setAvatarStatus("Profile picture updated successfully.");
    } catch (err) {
      console.error("Avatar upload error:", err);
      setAvatarStatus(
        err?.message || "Could not update your profile picture."
      );
    } finally {
      setAvatarLoading(false);
    }
  }

  async function orderNewCard() {
    if (cardOrderLoading || !user || !account) {
      setCardStatus(
        "Your account information is still loading. Please try again."
      );
      return;
    }

    setCardOrderLoading(true);
    setCardStatus("");

    try {
      const { error: orderError } = await supabase
        .from("customer_card_orders")
        .insert({
          user_id: user.id,
          account_id: account.id,
          card_type: "debit",
          reason: "Customer requested a new ATM / Debit Card",
          status: "pending",
        });

      if (orderError) {
        throw orderError;
      }

      setCardStatus(
        "Your card request has been submitted successfully."
      );

      await loadCardData(user.id, account?.id);
    } catch (err) {
      console.error("Card request error:", err);

      setCardStatus(
        err?.message ||
          "We could not submit your card request."
      );
    } finally {
      setCardOrderLoading(false);
    }
  }

  async function changePassword(event) {
    event.preventDefault();

    setPasswordStatus("");

    if (!newPassword || newPassword.length < 8) {
      setPasswordStatus(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus("Passwords do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      const { error: passwordError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (passwordError) {
        throw passwordError;
      }

      setPasswordStatus(
        "Your password has been changed successfully."
      );

      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password change error:", err);

      setPasswordStatus(
        err?.message ||
          "We could not change your password."
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  async function submitWithdrawal(event) {
    event.preventDefault();

    if (!user) {
      setRequestStatus("Please sign in again.");
      return;
    }

    if (!account?.id) {
      setRequestStatus(
        "Your bank account is not available yet. Please refresh and try again."
      );
      return;
    }

    if (account?.status !== "active") {
      setRequestStatus(
        "Withdrawals are unavailable because your account is not active."
      );
      return;
    }

    const amount = Number(requestForm.amount);

    if (!amount || amount <= 0) {
      setRequestStatus("Enter a valid withdrawal amount.");
      return;
    }

    if (amount > Number(account?.balance || 0)) {
      setRequestStatus(
        "The withdrawal amount cannot exceed your available balance."
      );
      return;
    }

    setRequestLoading(true);
    setRequestStatus("");

    try {
      const { error: insertError } = await supabase
        .from("withdrawal_requests")
        .insert({
          user_id: user.id,
          account_id: account?.id,
          amount,
          withdrawal_method: "cash",
          status: "pending",
          notes:
            requestForm.description ||
            "Customer withdrawal request",
        });

      if (insertError) {
        throw insertError;
      }

      setRequestForm((current) => ({
        ...current,
        amount: "",
        description: "",
      }));

      setRequestStatus(
        "Withdrawal request submitted successfully."
      );

      await loadWithdrawalRequests(user.id);
    } catch (err) {
      console.error("Withdrawal error:", err);

      setRequestStatus(
        err?.message ||
          "We could not submit your withdrawal request."
      );
    } finally {
      setRequestLoading(false);
    }
  }

  async function invokeCustomerTransfer(body) {
    const { data, error: functionError } =
      await supabase.functions.invoke(
        "customer-transfer",
        {
          body,
        }
      );

    if (functionError) {
      throw functionError;
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    return data;
  }

  async function startCustomerTransfer(event) {
    event.preventDefault();

    if (!user) {
      setTransferOtpStatus("Please sign in again.");
      return;
    }

    if (!account?.id) {
      setTransferOtpStatus(
        "Your bank account is not available yet. Please refresh and try again."
      );
      return;
    }

    if (account?.status !== "active") {
      setTransferOtpStatus(
        "Transfers are unavailable because your account is not active."
      );
      return;
    }

    const amount = Number(requestForm.amount);

    if (!amount || amount <= 0) {
      setTransferOtpStatus("Enter a valid transfer amount.");
      return;
    }

    if (amount > Number(account?.balance || 0)) {
      setTransferOtpStatus(
        "The transfer amount cannot exceed your available balance."
      );
      return;
    }

    if (!requestForm.recipientName.trim()) {
      setTransferOtpStatus("Enter the recipient name.");
      return;
    }

    if (!requestForm.recipientAccountNumber.trim()) {
      setTransferOtpStatus(
        "Enter the recipient account number or IBAN."
      );
      return;
    }

    if (!requestForm.bankName.trim()) {
      setTransferOtpStatus("Enter the recipient bank name.");
      return;
    }

    setTransferOtpLoading(true);
    setTransferOtpStatus("");

    try {
      const result = await invokeCustomerTransfer({
        action: "send_otp",
        recipientName:
          requestForm.recipientName.trim(),
        recipientAccountNumber:
          requestForm.recipientAccountNumber.trim(),
        bankName: requestForm.bankName.trim(),
        bankCountry: requestForm.bankCountry,
        transferCurrency:
          requestForm.transferCurrency,
        transferMethod:
          requestForm.transferMethod,
        beneficiaryType:
          requestForm.beneficiaryType,
        accountName:
          requestForm.accountName.trim(),
        routingType:
          requestForm.routingType,
        routingValue:
          requestForm.routingValue.trim(),
        swiftBic:
          requestForm.swiftBic.trim(),
        streetAddress:
          requestForm.streetAddress.trim(),
        city: requestForm.city.trim(),
        state: requestForm.state.trim(),
        postalCode:
          requestForm.postalCode.trim(),
        amount,
        description:
          requestForm.description.trim(),
      });

      setTransferId(result?.transfer_id || "");
      setTransferOtp("");
      setTransferOtpStatus(
        result?.message ||
          "A verification code has been sent to your email."
      );
      setTransferOtpOpen(true);
    } catch (err) {
      console.error("Transfer OTP error:", err);

      setTransferOtpStatus(
        err?.message ||
          "We could not start this transfer."
      );
    } finally {
      setTransferOtpLoading(false);
    }
  }

  async function verifyCustomerTransfer(event) {
    event.preventDefault();

    if (!transferOtp.trim()) {
      setTransferOtpStatus(
        "Enter the verification code sent to your email."
      );
      return;
    }

    setTransferOtpLoading(true);
    setTransferOtpStatus("");

    try {
      const result = await invokeCustomerTransfer({
        action: "verify_otp",
        transfer_id: transferId,
        otp: transferOtp.trim(),
      });

      setTransferOtpOpen(false);
      setTransferOtp("");
      setTransferOtpStatus("");

      setTransferReceipt(result?.receipt || result || null);
      setTransferReceiptOpen(true);

      setRequestForm({
        recipientName: "",
        recipientAccountNumber: "",
        bankName: "",
        bankCountry: "US",
        transferCurrency: "USD",
        transferMethod: "LOCAL",
        beneficiaryType: "PERSONAL",
        accountName: "",
        routingType: "aba",
        routingValue: "",
        swiftBic: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        amount: "",
        description: "",
      });

      await loadDashboard();
    } catch (err) {
      console.error("Transfer verification error:", err);

      setTransferOtpStatus(
        err?.message ||
          "The verification code could not be accepted."
      );
    } finally {
      setTransferOtpLoading(false);
    }
  }

  async function resendCustomerTransferOtp() {
    if (!transferId) return;

    setTransferResendLoading(true);
    setTransferOtpStatus("");

    try {
      const result = await invokeCustomerTransfer({
        action: "resend_otp",
        transfer_id: transferId,
      });

      setTransferOtpStatus(
        result?.message ||
          "A new verification code has been sent."
      );
    } catch (err) {
      console.error("OTP resend error:", err);

      setTransferOtpStatus(
        err?.message ||
          "We could not resend the verification code."
      );
    } finally {
      setTransferResendLoading(false);
    }
  }

  async function sendChatMessage(event) {
    event?.preventDefault();

    const message = chatMessage.trim();

    if (!message || chatLoading) return;

    setChatMessage("");
    setChatMessages((current) => [
      ...current,
      {
        role: "user",
        content: message,
      },
    ]);

    setChatLoading(true);

    try {
      const response =
        await supabase.functions.invoke(
          "customer-support",
          {
            body: {
              message,
            },
          }
        );

      if (response.error) {
        throw response.error;
      }

      const answer =
        response.data?.message ||
        response.data?.reply ||
        "Thank you. A bank representative will review your message.";

      setChatMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (err) {
      console.error("Support chat error:", err);

      setChatMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "We could not process your message right now. Please try again later.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  function setFormField(field, value) {
    setRequestForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function navigate(page) {
    setActivePage(page);
    setMenuOpen(false);

    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  if (loading) {
    return (
      <>
        <style>{`
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Inter, Arial, sans-serif;
            background: #f5f7fb;
          }

          .dashboard-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }

          .loading-card {
            width: min(430px, 100%);
            background: white;
            border-radius: 24px;
            padding: 42px 30px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(15, 23, 42, .08);
          }

          .loading-spinner {
            width: 44px;
            height: 44px;
            margin: 0 auto 20px;
            border: 4px solid #e6edf5;
            border-top-color: #123c69;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

        <main className="dashboard-loading">
          <section className="loading-card">
            <div className="loading-spinner" />
            <h2>Loading your account</h2>
            <p>
              Please wait while we securely load your banking dashboard.
            </p>
          </section>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{`
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Inter, Arial, sans-serif;
            background: #f5f7fb;
          }

          .error-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }

          .error-card {
            width: min(520px, 100%);
            background: white;
            border-radius: 24px;
            padding: 42px 30px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(15, 23, 42, .08);
          }

          .error-icon {
            width: 62px;
            height: 62px;
            margin: 0 auto 18px;
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fff1f2;
            color: #b42318;
            font-size: 28px;
          }

          .error-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 24px;
          }

          .error-button {
            border: 0;
            border-radius: 12px;
            padding: 12px 18px;
            cursor: pointer;
            font-weight: 700;
            background: #123c69;
            color: white;
          }

          .error-button.secondary {
            background: #eef2f6;
            color: #17324d;
          }
        `}</style>

        <main className="error-page">
          <section className="error-card">
            <div className="error-icon">!</div>

            <h1>We couldn't load your dashboard</h1>

            <p>
              {error}
            </p>

            <div className="error-actions">
              <button
                className="error-button"
                onClick={loadDashboard}
              >
                Try Again
              </button>

              <button
                className="error-button secondary"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Back Home
              </button>
            </div>
          </section>
        </main>
      </>
    );
  }

  const fullName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Customer";

  const firstName =
    fullName.split(" ").filter(Boolean)[0] ||
    "Customer";

  const accountBalance = Number(account?.balance || 0);

  const recentTransactions = transactions || [];

  const profileAccountNumber =
    account?.account_number || "";

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #f5f7fb;
          color: #172b3a;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button,
        input,
        select,
        textarea {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .dashboard-shell {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top right,
              rgba(30, 102, 172, .08),
              transparent 34%
            ),
            #f5f7fb;
        }

        .dashboard-topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,255,255,.94);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid #e5eaf0;
        }

        .topbar-inner {
          width: min(1400px, calc(100% - 40px));
          margin: 0 auto;
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .brand-area {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .brand-mark {
          width: 44px;
          height: 44px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: linear-gradient(145deg, #123c69, #1b5d96);
          color: white;
          font-weight: 900;
          box-shadow: 0 8px 20px rgba(18,60,105,.18);
        }

        .brand-copy {
          min-width: 0;
        }

        .brand-name {
          font-size: 15px;
          font-weight: 900;
          letter-spacing: .02em;
          color: #123c69;
          white-space: nowrap;
        }

        .brand-subtitle {
          font-size: 11px;
          color: #728093;
          margin-top: 2px;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .topbar-link {
          border: 0;
          background: transparent;
          color: #526274;
          font-weight: 700;
          padding: 10px 12px;
          border-radius: 10px;
        }

        .topbar-link:hover {
          background: #f1f5f9;
          color: #123c69;
        }

        .profile-chip {
          border: 1px solid #e3e8ef;
          background: #fff;
          border-radius: 999px;
          padding: 6px 12px 6px 6px;
          display: flex;
          align-items: center;
          gap: 9px;
          color: #263b50;
          font-weight: 800;
        }

        .profile-chip-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          overflow: hidden;
          background: #e8eef5;
          color: #123c69;
          display: grid;
          place-items: center;
          font-size: 12px;
          font-weight: 900;
        }

        .profile-chip-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mobile-menu-button {
          display: none;
          border: 1px solid #dce4ec;
          background: white;
          border-radius: 10px;
          padding: 9px 11px;
          font-size: 20px;
        }

        .dashboard-body {
          width: min(1400px, calc(100% - 40px));
          margin: 0 auto;
          padding: 34px 0 70px;
        }

        .dashboard-layout {
          display: grid;
          grid-template-columns: 250px minmax(0, 1fr);
          gap: 28px;
          align-items: start;
        }

        .sidebar {
          position: sticky;
          top: 100px;
          background: rgba(255,255,255,.92);
          border: 1px solid #e3e8ef;
          border-radius: 20px;
          padding: 14px;
          box-shadow: 0 10px 30px rgba(15,23,42,.04);
        }

        .sidebar-label {
          padding: 10px 12px;
          font-size: 10px;
          letter-spacing: .12em;
          font-weight: 900;
          color: #8794a4;
        }

        .sidebar-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 11px;
          border: 0;
          background: transparent;
          color: #556577;
          text-align: left;
          padding: 12px;
          border-radius: 12px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .sidebar-button:hover {
          background: #f1f5f9;
          color: #123c69;
        }

        .sidebar-button.active {
          background: #eaf2fa;
          color: #123c69;
        }

        .sidebar-icon {
          width: 26px;
          text-align: center;
          font-size: 17px;
        }

        .main-content {
          min-width: 0;
        }

        .welcome-section {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .eyebrow {
          font-size: 11px;
          color: #55708c;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .welcome-section h1 {
          margin: 7px 0 8px;
          color: #102f4f;
          font-size: clamp(28px, 4vw, 40px);
          line-height: 1.1;
          letter-spacing: -.03em;
        }

        .welcome-section p {
          margin: 0;
          color: #6c7a89;
          line-height: 1.6;
        }

        .security-pill {
          flex-shrink: 0;
          background: #effaf3;
          color: #137333;
          border: 1px solid #ccebd6;
          border-radius: 999px;
          padding: 9px 13px;
          font-size: 12px;
          font-weight: 900;
        }

        .balance-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .balance-card {
          position: relative;
          overflow: hidden;
          min-height: 190px;
          border-radius: 22px;
          padding: 25px;
          color: white;
          background:
            radial-gradient(
              circle at 90% 10%,
              rgba(255,255,255,.18),
              transparent 35%
            ),
            linear-gradient(135deg, #123c69, #0c3157);
          box-shadow: 0 18px 42px rgba(18,60,105,.17);
        }

        .balance-card::after {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 50%;
          right: -75px;
          bottom: -95px;
        }

        .balance-label {
          position: relative;
          z-index: 1;
          color: rgba(255,255,255,.72);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .1em;
          font-weight: 900;
        }

        .balance-value {
          position: relative;
          z-index: 1;
          margin: 12px 0 20px;
          font-size: clamp(30px, 4vw, 43px);
          font-weight: 900;
          letter-spacing: -.04em;
        }

        .balance-meta {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          gap: 14px;
          font-size: 12px;
          color: rgba(255,255,255,.74);
        }

        .summary-card {
          min-height: 190px;
          background: white;
          border: 1px solid #e4e9ef;
          border-radius: 22px;
          padding: 23px;
          box-shadow: 0 10px 28px rgba(15,23,42,.04);
        }

        .summary-label {
          color: #718096;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .summary-value {
          margin-top: 12px;
          font-size: 23px;
          font-weight: 900;
          color: #183653;
          word-break: break-word;
        }

        .summary-small {
          margin-top: 9px;
          color: #8491a0;
          font-size: 12px;
          line-height: 1.5;
        }

        .section-card {
          background: white;
          border: 1px solid #e4e9ef;
          border-radius: 22px;
          box-shadow: 0 10px 28px rgba(15,23,42,.04);
          margin-bottom: 20px;
          overflow: hidden;
        }

        .section-card-header {
          padding: 21px 24px;
          border-bottom: 1px solid #edf0f4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .section-card-header h2 {
          margin: 0;
          font-size: 18px;
          color: #173b5f;
        }

        .section-card-header p {
          margin: 4px 0 0;
          color: #7a8795;
          font-size: 12px;
        }

        .section-card-body {
          padding: 24px;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(5, minmax(0,1fr));
          gap: 12px;
        }

        .quick-action {
          border: 1px solid #e1e8ef;
          background: #fbfcfe;
          border-radius: 16px;
          padding: 17px 13px;
          min-height: 110px;
          text-align: left;
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
        }

        .quick-action:hover {
          transform: translateY(-2px);
          border-color: #bcd0e1;
          box-shadow: 0 10px 24px rgba(15,23,42,.06);
        }

        .quick-action-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #eaf2fa;
          color: #123c69;
          font-size: 18px;
          margin-bottom: 11px;
        }

        .quick-action strong {
          display: block;
          color: #173b5f;
          font-size: 13px;
        }

        .quick-action span {
          display: block;
          color: #8793a0;
          font-size: 11px;
          margin-top: 5px;
          line-height: 1.45;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 14px;
        }

        .overview-item {
          padding: 16px;
          background: #f8fafc;
          border-radius: 15px;
          border: 1px solid #edf1f5;
        }

        .overview-item-label {
          font-size: 10px;
          color: #7d8998;
          text-transform: uppercase;
          letter-spacing: .08em;
          font-weight: 900;
        }

        .overview-item-value {
          margin-top: 8px;
          color: #183653;
          font-weight: 800;
          word-break: break-word;
        }

        .notifications {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 14px;
        }

        .notification {
          border: 1px solid #e5ebf0;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .notification-icon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          border-radius: 11px;
          background: #eaf6ed;
          color: #18804b;
          display: grid;
          place-items: center;
          font-weight: 900;
        }

        .notification strong {
          display: block;
          color: #1c3953;
          font-size: 13px;
        }

        .notification p {
          margin: 4px 0 0;
          color: #788695;
          font-size: 12px;
          line-height: 1.5;
        }

        .transaction-list {
          display: grid;
        }

        .transaction-row {
          display: grid;
          grid-template-columns: 46px minmax(0,1fr) auto;
          gap: 13px;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #eef1f4;
        }

        .transaction-row:last-child {
          border-bottom: 0;
        }

        .transaction-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #edf4fb;
          color: #123c69;
          font-weight: 900;
        }

        .transaction-title {
          font-weight: 800;
          color: #24415b;
          font-size: 13px;
        }

        .transaction-meta {
          margin-top: 4px;
          color: #8a95a3;
          font-size: 11px;
        }

        .transaction-amount {
          font-weight: 900;
          color: #183653;
          white-space: nowrap;
        }

        .empty-state {
          text-align: center;
          padding: 34px 15px;
          color: #7c8896;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 17px;
        }

        .form-grid.three {
          grid-template-columns: repeat(3, minmax(0,1fr));
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-field.full {
          grid-column: 1 / -1;
        }

        .form-label {
          font-size: 11px;
          font-weight: 900;
          color: #526477;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          border: 1px solid #dbe3eb;
          background: #fff;
          border-radius: 12px;
          padding: 12px 13px;
          color: #213c56;
          outline: none;
          transition: border-color .15s ease, box-shadow .15s ease;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          border-color: #6f9ac0;
          box-shadow: 0 0 0 3px rgba(31,98,157,.10);
        }

        .form-textarea {
          min-height: 110px;
          resize: vertical;
        }

        .primary-button,
        .secondary-button,
        .danger-button {
          border: 0;
          border-radius: 12px;
          padding: 12px 17px;
          font-weight: 900;
          transition: transform .15s ease, box-shadow .15s ease;
        }

        .primary-button {
          color: white;
          background: linear-gradient(135deg,#123c69,#1b5d96);
          box-shadow: 0 8px 18px rgba(18,60,105,.15);
        }

        .secondary-button {
          color: #173b5f;
          background: #eef3f8;
        }

        .danger-button {
          color: #9b1c1c;
          background: #fff0f0;
        }

        .primary-button:hover,
        .secondary-button:hover,
        .danger-button:hover {
          transform: translateY(-1px);
        }

        .button-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .status-message {
          margin-top: 14px;
          border-radius: 12px;
          padding: 12px 14px;
          background: #f4f8fb;
          color: #38536c;
          font-size: 13px;
          line-height: 1.5;
        }

        .status-message.success {
          background: #edf9f1;
          color: #177245;
        }

        .status-message.error {
          background: #fff1f2;
          color: #a21c27;
        }

        .profile-layout {
          display: grid;
          grid-template-columns: 270px minmax(0,1fr);
          gap: 24px;
        }

        .profile-avatar-card {
          background: #f8fafc;
          border: 1px solid #e7edf2;
          border-radius: 18px;
          padding: 22px;
          text-align: center;
        }

        .profile-avatar-large {
          width: 116px;
          height: 116px;
          border-radius: 50%;
          margin: 0 auto 15px;
          background: linear-gradient(135deg,#dce9f4,#eef3f7);
          color: #123c69;
          display: grid;
          place-items: center;
          overflow: hidden;
          font-size: 31px;
          font-weight: 900;
        }

        .profile-avatar-large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .upload-label {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 10px;
          padding: 9px 12px;
          background: white;
          border: 1px solid #d9e1e9;
          color: #23435f;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .upload-label input {
          display: none;
        }

        .profile-section {
          margin-bottom: 24px;
        }

        .profile-section:last-child {
          margin-bottom: 0;
        }

        .profile-section-title {
          font-size: 13px;
          font-weight: 900;
          color: #23435f;
          margin-bottom: 12px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 12px;
        }

        .info-row {
          padding: 13px 14px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #edf1f5;
        }

        .info-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .07em;
          font-weight: 900;
          color: #8a96a4;
        }

        .info-value {
          margin-top: 6px;
          color: #213e59;
          font-weight: 750;
          word-break: break-word;
        }

        .account-number-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          background: #f8fafc;
          border: 1px solid #edf1f5;
          border-radius: 12px;
          padding: 13px 14px;
        }

        .account-number-value {
          font-weight: 900;
          color: #1d3b58;
          letter-spacing: .05em;
          word-break: break-all;
        }

        .small-button {
          border: 1px solid #dbe4ec;
          background: white;
          color: #2a4b68;
          border-radius: 9px;
          padding: 7px 10px;
          font-size: 11px;
          font-weight: 900;
        }

        .card-display {
          max-width: 480px;
          min-height: 270px;
          border-radius: 23px;
          padding: 25px;
          color: white;
          background:
            radial-gradient(circle at 90% 10%, rgba(255,255,255,.20), transparent 32%),
            linear-gradient(135deg,#172f4b,#0b2340);
          box-shadow: 0 20px 45px rgba(11,35,64,.22);
          position: relative;
          overflow: hidden;
        }

        .card-display::after {
          content: "";
          position: absolute;
          width: 230px;
          height: 230px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 50%;
          right: -90px;
          bottom: -125px;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-brand {
          font-weight: 900;
          letter-spacing: .04em;
          font-size: 13px;
        }

        .card-network {
          font-weight: 900;
          font-size: 14px;
          opacity: .9;
        }

        .chip {
          width: 46px;
          height: 34px;
          border-radius: 8px;
          background: linear-gradient(135deg,#d7c28a,#f3e2a9);
          margin-top: 44px;
        }

        .card-number {
          margin-top: 27px;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: .11em;
        }

        .card-bottom {
          margin-top: 25px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .card-caption {
          color: rgba(255,255,255,.58);
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .card-value {
          margin-top: 4px;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .request-list {
          display: grid;
          gap: 10px;
        }

        .request-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
          padding: 14px;
          border: 1px solid #e7edf2;
          border-radius: 13px;
          background: #fbfcfe;
        }

        .request-main strong {
          display: block;
          color: #27435c;
          font-size: 13px;
        }

        .request-main small {
          display: block;
          color: #8995a2;
          margin-top: 4px;
        }

        .request-status {
          padding: 7px 10px;
          border-radius: 999px;
          background: #eef4fa;
          color: #345a7b;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .chat-button {
          position: fixed;
          right: 25px;
          bottom: 25px;
          z-index: 60;
          width: 57px;
          height: 57px;
          border: 0;
          border-radius: 50%;
          color: white;
          background: linear-gradient(135deg,#123c69,#1b5d96);
          box-shadow: 0 15px 32px rgba(18,60,105,.28);
          font-size: 22px;
        }

        .chat-panel {
          position: fixed;
          right: 25px;
          bottom: 94px;
          z-index: 60;
          width: min(390px, calc(100vw - 30px));
          height: 540px;
          background: white;
          border: 1px solid #dfe6ed;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 70px rgba(15,23,42,.18);
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          padding: 17px 18px;
          background: #123c69;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-header strong {
          display: block;
        }

        .chat-header small {
          display: block;
          margin-top: 3px;
          opacity: .72;
        }

        .chat-close {
          border: 0;
          background: rgba(255,255,255,.12);
          color: white;
          border-radius: 8px;
          width: 30px;
          height: 30px;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          background: #f7f9fb;
        }

        .chat-message {
          max-width: 82%;
          padding: 10px 12px;
          border-radius: 13px;
          margin-bottom: 9px;
          font-size: 12px;
          line-height: 1.5;
        }

        .chat-message.user {
          margin-left: auto;
          background: #123c69;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .chat-message.assistant {
          background: white;
          color: #324a60;
          border: 1px solid #e2e8ee;
          border-bottom-left-radius: 4px;
        }

        .chat-form {
          display: flex;
          gap: 8px;
          padding: 11px;
          border-top: 1px solid #e6ebf0;
          background: white;
        }

        .chat-form input {
          min-width: 0;
          flex: 1;
          border: 1px solid #dbe3eb;
          border-radius: 10px;
          padding: 10px;
          outline: none;
        }

        .chat-form button {
          width: 42px;
          border: 0;
          border-radius: 10px;
          background: #123c69;
          color: white;
          font-weight: 900;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(8,22,38,.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }

        .modal-card {
          width: min(540px,100%);
          max-height: calc(100vh - 36px);
          overflow-y: auto;
          background: white;
          border-radius: 22px;
          box-shadow: 0 30px 90px rgba(0,0,0,.25);
        }

        .modal-header {
          padding: 20px 22px;
          border-bottom: 1px solid #edf0f4;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .modal-header h3 {
          margin: 0;
          color: #173b5f;
        }

        .modal-close {
          border: 0;
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: #f1f4f7;
          color: #506173;
        }

        .modal-body {
          padding: 22px;
        }

        .otp-code {
          letter-spacing: .35em;
          text-align: center;
          font-size: 24px;
          font-weight: 900;
        }

        .receipt {
          background: #f7fafc;
          border: 1px solid #e3eaf0;
          border-radius: 15px;
          padding: 16px;
        }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 9px 0;
          border-bottom: 1px solid #e7edf2;
          font-size: 13px;
        }

        .receipt-row:last-child {
          border-bottom: 0;
        }

        .receipt-row span:first-child {
          color: #7c8996;
        }

        .receipt-row span:last-child {
          color: #1f3d58;
          font-weight: 800;
          text-align: right;
        }

        @media (max-width: 1150px) {
          .dashboard-layout {
            grid-template-columns: 210px minmax(0,1fr);
          }

          .balance-grid {
            grid-template-columns: repeat(2,minmax(0,1fr));
          }

          .balance-card {
            grid-column: 1 / -1;
          }

          .quick-actions {
            grid-template-columns: repeat(3,minmax(0,1fr));
          }
        }

        @media (max-width: 900px) {
          .topbar-link {
            display: none;
          }

          .mobile-menu-button {
            display: block;
          }

          .dashboard-layout {
            display: block;
          }

          .sidebar {
            position: fixed;
            z-index: 70;
            top: 76px;
            left: 20px;
            width: min(280px,calc(100vw - 40px));
            display: none;
            box-shadow: 0 20px 60px rgba(15,23,42,.18);
          }

          .sidebar.open {
            display: block;
          }

          .profile-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .topbar-inner,
          .dashboard-body {
            width: min(100% - 24px, 1400px);
          }

          .topbar-inner {
            min-height: 68px;
          }

          .dashboard-body {
            padding-top: 24px;
          }

          .brand-subtitle {
            display: none;
          }

          .profile-chip {
            padding-right: 7px;
          }

          .profile-chip span {
            display: none;
          }

          .welcome-section {
            display: block;
          }

          .security-pill {
            display: inline-flex;
            margin-top: 14px;
          }

          .balance-grid {
            grid-template-columns: 1fr;
          }

          .balance-card {
            grid-column: auto;
          }

          .quick-actions {
            grid-template-columns: repeat(2,minmax(0,1fr));
          }

          .overview-grid {
            grid-template-columns: repeat(2,minmax(0,1fr));
          }

          .notifications {
            grid-template-columns: 1fr;
          }

          .form-grid,
          .form-grid.three,
          .info-grid {
            grid-template-columns: 1fr;
          }

          .transaction-row {
            grid-template-columns: 40px minmax(0,1fr);
          }

          .transaction-amount {
            grid-column: 2;
            text-align: left;
          }

          .section-card-header,
          .section-card-body {
            padding: 18px;
          }

          .profile-layout {
            gap: 16px;
          }

          .card-display {
            min-height: 250px;
          }
        }

        @media (max-width: 480px) {
          .brand-name {
            font-size: 13px;
          }

          .quick-actions {
            grid-template-columns: 1fr 1fr;
          }

          .quick-action {
            min-height: 105px;
          }

          .overview-grid {
            grid-template-columns: 1fr;
          }

          .chat-panel {
            right: 15px;
            bottom: 82px;
            width: calc(100vw - 30px);
            height: 500px;
          }

          .chat-button {
            right: 15px;
            bottom: 15px;
          }

          .request-row {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <div className="dashboard-shell">
        <header className="dashboard-topbar">
          <div className="topbar-inner">
            <div className="brand-area">
              <div className="brand-mark">M</div>

              <div className="brand-copy">
                <div className="brand-name">
                  MIDATLANTIC FEDERAL BANK
                </div>

                <div className="brand-subtitle">
                  Secure Online Banking
                </div>
              </div>
            </div>

            <div className="topbar-actions">
              <button
                className="topbar-link"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Home
              </button>

              <button
                className="topbar-link"
                onClick={() => {
                  window.location.href = "/news";
                }}
              >
                News
              </button>

              <button
                className="mobile-menu-button"
                onClick={() =>
                  setMenuOpen((current) => !current)
                }
                aria-label="Open menu"
              >
                ☰
              </button>

              <button
                className="profile-chip"
                onClick={() => navigate("profile")}
              >
                <div className="profile-chip-avatar">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                    />
                  ) : (
                    getInitials(fullName)
                  )}
                </div>

                <span>{firstName}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="dashboard-body">
          <div className="dashboard-layout">
            <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
              <div className="sidebar-label">
                BANKING
              </div>

              <button
                className={`sidebar-button ${
                  activePage === "dashboard"
                    ? "active"
                    : ""
                }`}
                onClick={() => navigate("dashboard")}
              >
                <span className="sidebar-icon">⌂</span>
                Dashboard
              </button>

              <button
                className={`sidebar-button ${
                  activePage === "profile"
                    ? "active"
                    : ""
                }`}
                onClick={() => navigate("profile")}
              >
                <span className="sidebar-icon">◎</span>
                My Profile
              </button>

              <button
                className={`sidebar-button ${
                  activePage === "account"
                    ? "active"
                    : ""
                }`}
                onClick={() => navigate("account")}
              >
                <span className="sidebar-icon">▣</span>
                Account
              </button>

              <button
                className={`sidebar-button ${
                  activePage === "transfer"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setTransferPageType("transfer");
                  navigate("transfer");
                }}
              >
                <span className="sidebar-icon">↗</span>
                Transfer
              </button>

              <button
                className={`sidebar-button ${
                  activePage === "local"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setTransferPageType("local");
                  setFormField("transferMethod", "LOCAL");
                  navigate("local");
                }}
              >
                <span className="sidebar-icon">⇄</span>
                Local Transfer
              </button>

              <button
                className={`sidebar-button ${
                  activePage === "wire"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setTransferPageType("wire");
                  setFormField("transferMethod", "WIRE");
                  navigate("wire");
                }}
              >
                <span className="sidebar-icon">⌁</span>
                Wire Transfer
              </button>

              <button
                className={`sidebar-button ${
                  activePage === "withdraw"
                    ? "active"
                    : ""
                }`}
                onClick={() => navigate("withdraw")}
              >
                <span className="sidebar-icon">↓</span>
                Withdraw
              </button>

              <button
                className={`sidebar-button ${
                  activePage === "card"
                    ? "active"
                    : ""
                }`}
                onClick={() => navigate("card")}
              >
                <span className="sidebar-icon">▤</span>
                ATM / Debit Card
              </button>

              <div className="sidebar-label">
                SUPPORT
              </div>

              <button
                className={`sidebar-button ${
                  activePage === "support"
                    ? "active"
                    : ""
                }`}
                onClick={() => navigate("support")}
              >
                <span className="sidebar-icon">?</span>
                Support
              </button>

              <button
                className="sidebar-button"
                onClick={signOut}
              >
                <span className="sidebar-icon">↪</span>
                Sign Out
              </button>
            </aside>

            <section className="main-content">
              {activePage === "dashboard" && (
                <>
                  <div className="welcome-section">
                    <div>
                      <div className="eyebrow">
                        Personal Banking
                      </div>

                      <h1>
                        {greeting()}, {firstName}.
                      </h1>

                      <p>
                        Here's an overview of your
                        customer account.
                      </p>
                    </div>

                    <div className="security-pill">
                      ● Secure session
                    </div>
                  </div>

                  <div className="balance-grid">
                    <div className="balance-card">
                      <div className="balance-label">
                        Available Balance
                      </div>

                      <div className="balance-value">
                        ${formatMoney(accountBalance)}
                      </div>

                      <div className="balance-meta">
                        <span>
                          Checking Account
                        </span>

                        <span>
                          {maskAccountNumber(
                            account?.account_number
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="summary-card">
                      <div className="summary-label">
                        Account Holder
                      </div>

                      <div className="summary-value">
                        {fullName}
                      </div>

                      <div className="summary-small">
                        Verified customer profile
                      </div>
                    </div>

                    <div className="summary-card">
                      <div className="summary-label">
                        Account Status
                      </div>

                      <div className="summary-value">
                        {account?.status || "Active"}
                      </div>

                      <div className="summary-small">
                        Your online banking access is
                        protected.
                      </div>
                    </div>
                  </div>

                  <section className="section-card">
                    <div className="section-card-header">
                      <div>
                        <h2>Quick Actions</h2>
                        <p>
                          Access your most-used banking
                          services.
                        </p>
                      </div>
                    </div>

                    <div className="section-card-body">
                      <div className="quick-actions">
                        <button
                          className="quick-action"
                          onClick={() =>
                            navigate("withdraw")
                          }
                        >
                          <div className="quick-action-icon">
                            ↓
                          </div>

                          <strong>
                            Withdraw
                          </strong>

                          <span>
                            Submit a withdrawal request
                          </span>
                        </button>

                        <button
                          className="quick-action"
                          onClick={() => {
                            setTransferPageType(
                              "transfer"
                            );
                            navigate("transfer");
                          }}
                        >
                          <div className="quick-action-icon">
                            ↗
                          </div>

                          <strong>
                            Transfer
                          </strong>

                          <span>
                            Submit a transfer request
                          </span>
                        </button>

                        <button
                          className="quick-action"
                          onClick={() => {
                            setTransferPageType(
                              "wire"
                            );
                            setFormField(
                              "transferMethod",
                              "WIRE"
                            );
                            navigate("wire");
                          }}
                        >
                          <div className="quick-action-icon">
                            ⌁
                          </div>

                          <strong>
                            Wire Transfer
                          </strong>

                          <span>
                            Enter recipient information
                          </span>
                        </button>

                        <button
                          className="quick-action"
                          onClick={() => {
                            setTransferPageType(
                              "local"
                            );
                            setFormField(
                              "transferMethod",
                              "LOCAL"
                            );
                            navigate("local");
                          }}
                        >
                          <div className="quick-action-icon">
                            ⇄
                          </div>

                          <strong>
                            Local Transfer
                          </strong>

                          <span>
                            Submit a local transfer
                            request
                          </span>
                        </button>

                        <button
                          className="quick-action"
                          onClick={() =>
                            navigate("card")
                          }
                        >
                          <div className="quick-action-icon">
                            ▤
                          </div>

                          <strong>
                            ATM / Debit Card
                          </strong>

                          <span>
                            View your card or order a
                            new one
                          </span>
                        </button>
                      </div>
                    </div>
                  </section>

                  <section className="section-card">
                    <div className="section-card-header">
                      <div>
                        <h2>Account Overview</h2>
                        <p>
                          Key details associated with
                          your account.
                        </p>
                      </div>
                    </div>

                    <div className="section-card-body">
                      <div className="overview-grid">
                        <div className="overview-item">
                          <div className="overview-item-label">
                            Account Holder
                          </div>

                          <div className="overview-item-value">
                            {fullName}
                          </div>
                        </div>

                        <div className="overview-item">
                          <div className="overview-item-label">
                            Account Number
                          </div>

                          <div className="overview-item-value">
                            {maskAccountNumber(
                              account?.account_number
                            )}
                          </div>
                        </div>

                        <div className="overview-item">
                          <div className="overview-item-label">
                            Account Type
                          </div>

                          <div className="overview-item-value">
                            {account?.account_type ||
                              "Checking"}
                          </div>
                        </div>

                        <div className="overview-item">
                          <div className="overview-item-label">
                            Account Status
                          </div>

                          <div className="overview-item-value">
                            {account?.status ||
                              "Active"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="section-card">
                    <div className="section-card-header">
                      <div>
                        <h2>Notifications</h2>
                        <p>
                          Important account and security
                          information.
                        </p>
                      </div>
                    </div>

                    <div className="section-card-body">
                      <div className="notifications">
                        <div className="notification">
                          <div className="notification-icon">
                            ✓
                          </div>

                          <div>
                            <strong>
                              Account Active
                            </strong>

                            <p>
                              Your banking account is
                              currently active and
                              available for online
                              banking.
                            </p>
                          </div>
                        </div>

                        <div className="notification">
                          <div className="notification-icon">
                            !
                          </div>

                          <div>
                            <strong>
                              Security Reminder
                            </strong>

                            <p>
                              Never share your password,
                              OTP, card PIN, CVV, or
                              full card number with
                              anyone.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="section-card">
                    <div className="section-card-header">
                      <div>
                        <h2>Recent Transactions</h2>
                        <p>
                          Your latest account activity.
                        </p>
                      </div>
                    </div>

                    <div className="section-card-body">
                      {recentTransactions.length ===
                      0 ? (
                        <div className="empty-state">
                          No recent transactions are
                          available.
                        </div>
                      ) : (
                        <div className="transaction-list">
                          {recentTransactions.map(
                            (transaction, index) => {
                              const title =
                                transaction.description ||
                                transaction.title ||
                                transaction.name ||
                                "Account Transaction";

                              const amount =
                                Number(
                                  transaction.amount || 0
                                );

                              return (
                                <div
                                  className="transaction-row"
                                  key={
                                    transaction.id ||
                                    index
                                  }
                                >
                                  <div className="transaction-icon">
                                    {amount < 0
                                      ? "↓"
                                      : "↑"}
                                  </div>

                                  <div>
                                    <div className="transaction-title">
                                      {title}
                                    </div>

                                    <div className="transaction-meta">
                                      {formatDateTime(
                                        transaction.created_at
                                      )}
                                    </div>
                                  </div>

                                  <div className="transaction-amount">
                                    {amount < 0
                                      ? "-"
                                      : "+"}
                                    $
                                    {formatMoney(
                                      Math.abs(amount)
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="section-card">
                    <div className="section-card-header">
                      <div>
                        <h2>Bank News</h2>
                        <p>
                          Read the latest updates from
                          MIDATLANTIC FEDERAL BANK.
                        </p>
                      </div>

                      <button
                        className="secondary-button"
                        onClick={() => {
                          window.location.href =
                            "/news";
                        }}
                      >
                        View News
                      </button>
                    </div>
                  </section>
                </>
              )}

              {activePage === "profile" && (
                <>
                  <div className="welcome-section">
                    <div>
                      <div className="eyebrow">
                        Customer Profile
                      </div>

                      <h1>My Profile</h1>

                      <p>
                        Review your personal and account
                        information.
                      </p>
                    </div>
                  </div>

                  <section className="section-card">
                    <div className="section-card-body">
                      <div className="profile-layout">
                        <div className="profile-avatar-card">
                          <div className="profile-avatar-large">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt="Profile"
                              />
                            ) : (
                              getInitials(fullName)
                            )}
                          </div>

                          <strong>
                            {fullName}
                          </strong>

                          <p
                            style={{
                              color: "#7c8996",
                              fontSize: "12px",
                              lineHeight: 1.5,
                            }}
                          >
                            {user?.email || ""}
                          </p>

                          <label className="upload-label">
                            {avatarLoading
                              ? "Uploading..."
                              : "Change Picture"}

                            <input
                              type="file"
                              accept="image/*"
                              onChange={uploadAvatar}
                              disabled={
                                avatarLoading
                              }
                            />
                          </label>

                          {avatarStatus && (
                            <div className="status-message">
                              {avatarStatus}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="profile-section">
                            <div className="profile-section-title">
                              Personal Information
                            </div>

                            <div className="info-grid">
                              <InfoRow
                                label="Full Name"
                                value={profile?.full_name}
                              />

                              <InfoRow
                                label="Email"
                                value={
                                  profile?.email ||
                                  user?.email
                                }
                              />

                              <InfoRow
                                label="Phone"
                                value={
                                  profile?.phone
                                }
                              />

                              <InfoRow
                                label="Date of Birth"
                                value={
                                  profile?.date_of_birth
                                }
                              />

                              <InfoRow
                                label="Address"
                                value={
                                  profile?.address
                                }
                              />

                              <InfoRow
                                label="City"
                                value={profile?.city}
                              />

                              <InfoRow
                                label="State"
                                value={
                                  profile?.state
                                }
                              />

                              <InfoRow
                                label="Postal Code"
                                value={
                                  profile?.postal_code
                                }
                              />

                              <InfoRow
                                label="Country"
                                value={
                                  profile?.country
                                }
                              />
                            </div>
                          </div>

                          <div className="profile-section">
                            <div className="profile-section-title">
                              Account Information
                            </div>

                            <AccountNumberRow
                              accountNumber={
                                profileAccountNumber
                              }
                              visible={
                                showAccountNumber
                              }
                              onToggle={() =>
                                setShowAccountNumber(
                                  (current) =>
                                    !current
                                )
                              }
                            />

                            <div
                              className="info-grid"
                              style={{
                                marginTop: 12,
                              }}
                            >
                              <InfoRow
                                label="Account Type"
                                value={
                                  account?.account_type ||
                                  "Checking"
                                }
                              />

                              <InfoRow
                                label="Account Status"
                                value={
                                  account?.status ||
                                  "Active"
                                }
                              />

                              <InfoRow
                                label="Account Created"
                                value={formatDate(
                                  account?.effective_created_at ||
                                    account?.created_at
                                )}
                              />
                            </div>
                          </div>

                          <div className="profile-section">
                            <div className="profile-section-title">
                              Security
                            </div>

                            <button
                              className="secondary-button"
                              onClick={() => {
                                setPasswordModalOpen(
                                  true
                                );
                                setPasswordStatus(
                                  ""
                                );
                              }}
                            >
                              Change Password
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {activePage === "account" && (
                <>
                  <div className="welcome-section">
                    <div>
                      <div className="eyebrow">
                        Account
                      </div>

                      <h1>Account Information</h1>

                      <p>
                        Your current account details and
                        available balance.
                      </p>
                    </div>
                  </div>

                  <section className="section-card">
                    <div className="section-card-body">
                      <div className="balance-card">
                        <div className="balance-label">
                          Available Balance
                        </div>

                        <div className="balance-value">
                          ${formatMoney(accountBalance)}
                        </div>

                        <div className="balance-meta">
                          <span>
                            {account?.account_type ||
                              "Checking"}
                          </span>

                          <span>
                            {maskAccountNumber(
                              account?.account_number
                            )}
                          </span>
                        </div>
                      </div>

                      <div
                        className="info-grid"
                        style={{ marginTop: 20 }}
                      >
                        <InfoRow
                          label="Account Holder"
                          value={fullName}
                        />

                        <InfoRow
                          label="Account Number"
                          value={maskAccountNumber(
                            account?.account_number
                          )}
                        />

                        <InfoRow
                          label="Account Type"
                          value={
                            account?.account_type ||
                            "Checking"
                          }
                        />

                        <InfoRow
                          label="Account Status"
                          value={
                            account?.status ||
                            "Active"
                          }
                        />

                        <InfoRow
                          label="Account Created"
                          value={formatDate(
                            account?.effective_created_at ||
                              account?.created_at
                          )}
                        />

                        <InfoRow
                          label="Email"
                          value={
                            profile?.email ||
                            user?.email
                          }
                        />
                      </div>
                    </div>
                  </section>
                </>
              )}

              {(activePage === "transfer" ||
                activePage === "local" ||
                activePage === "wire") && (
                <>
                  <div className="welcome-section">
                    <div>
                      <div className="eyebrow">
                        Money Movement
                      </div>

                      <h1>
                        {activePage === "wire"
                          ? "Wire Transfer"
                          : activePage === "local"
                          ? "Local Transfer"
                          : "Transfer"}
                      </h1>

                      <p>
                        Enter recipient details and
                        submit your transfer securely.
                      </p>
                    </div>
                  </div>

                  <section className="section-card">
                    <div className="section-card-header">
                      <div>
                        <h2>
                          Recipient Information
                        </h2>

                        <p>
                          An email verification code
                          will be required before the
                          transfer is submitted.
                        </p>
                      </div>
                    </div>

                    <div className="section-card-body">
                      <form
                        onSubmit={
                          startCustomerTransfer
                        }
                      >
                        <div className="form-grid">
                          <div className="form-field">
                            <label className="form-label">
                              Recipient Name
                            </label>

                            <input
                              className="form-input"
                              value={
                                requestForm.recipientName
                              }
                              onChange={(event) =>
                                setFormField(
                                  "recipientName",
                                  event.target.value
                                )
                              }
                              required
                            />
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              Recipient Account / IBAN
                            </label>

                            <input
                              className="form-input"
                              value={
                                requestForm.recipientAccountNumber
                              }
                              onChange={(event) =>
                                setFormField(
                                  "recipientAccountNumber",
                                  event.target.value
                                )
                              }
                              required
                            />
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              Bank Name
                            </label>

                            <input
                              className="form-input"
                              value={
                                requestForm.bankName
                              }
                              onChange={(event) =>
                                setFormField(
                                  "bankName",
                                  event.target.value
                                )
                              }
                              required
                            />
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              Bank Country
                            </label>

                            <input
                              className="form-input"
                              value={
                                requestForm.bankCountry
                              }
                              onChange={(event) =>
                                setFormField(
                                  "bankCountry",
                                  event.target.value.toUpperCase()
                                )
                              }
                              required
                            />
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              Currency
                            </label>

                            <input
                              className="form-input"
                              value={
                                requestForm.transferCurrency
                              }
                              onChange={(event) =>
                                setFormField(
                                  "transferCurrency",
                                  event.target.value.toUpperCase()
                                )
                              }
                              required
                            />
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              Transfer Method
                            </label>

                            <select
                              className="form-select"
                              value={
                                requestForm.transferMethod
                              }
                              onChange={(event) =>
                                setFormField(
                                  "transferMethod",
                                  event.target.value
                                )
                              }
                            >
                              <option value="LOCAL">
                                Local
                              </option>

                              <option value="WIRE">
                                Wire
                              </option>
                            </select>
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              Beneficiary Type
                            </label>

                            <select
                              className="form-select"
                              value={
                                requestForm.beneficiaryType
                              }
                              onChange={(event) =>
                                setFormField(
                                  "beneficiaryType",
                                  event.target.value
                                )
                              }
                            >
                              <option value="PERSONAL">
                                Personal
                              </option>

                              <option value="BUSINESS">
                                Business
                              </option>
                            </select>
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              Account Name
                            </label>

                            <input
                              className="form-input"
                              value={
                                requestForm.accountName
                              }
                              onChange={(event) =>
                                setFormField(
                                  "accountName",
                                  event.target.value
                                )
                              }
                            />
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              Routing Type
                            </label>

                            <input
                              className="form-input"
                              value={
                                requestForm.routingType
                              }
                              onChange={(event) =>
                                setFormField(
                                  "routingType",
                                  event.target.value
                                )
                              }
                            />
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              Routing Value
                            </label>

                            <input
                              className="form-input"
                              value={
                                requestForm.routingValue
                              }
                              onChange={(event) =>
                                setFormField(
                                  "routingValue",
                                  event.target.value
                                )
                              }
                            />
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              SWIFT / BIC
                            </label>

                            <input
                              className="form-input"
                              value={
                                requestForm.swiftBic
                              }
                              onChange={(event) =>
                                setFormField(
                                  "swiftBic",
                                  event.target.value.toUpperCase()
                                )
                              }
                            />
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              Amount
                            </label>

                            <input
                              className="form-input"
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={
                                requestForm.amount
                              }
                              onChange={(event) =>
                                setFormField(
                                  "amount",
                                  event.target.value
                                )
                              }
                              required
                            />

                            <small className="summary-small">
                              Available balance: $
                              {formatMoney(
                                account?.balance ?? 0
                              )}
                            </small>
                          </div>

                          <div className="form-field full">
                            <label className="form-label">
                              Street Address
                            </label>

                            <input
                              className="form-input"
                              value={
                                requestForm.streetAddress
                              }
                              onChange={(event) =>
                                setFormField(
                                  "streetAddress",
                                  event.target.value
                                )
                              }
                            />
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              City
                            </label>

                            <input
                              className="form-input"
                              value={
                                requestForm.city
                              }
                              onChange={(event) =>
                                setFormField(
                                  "city",
                                  event.target.value
                                )
                              }
                            />
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              State / Province
                            </label>

                            <input
                              className="form-input"
                              value={
                                requestForm.state
                              }
                              onChange={(event) =>
                                setFormField(
                                  "state",
                                  event.target.value
                                )
                              }
                            />
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              Postal Code
                            </label>

                            <input
                              className="form-input"
                              value={
                                requestForm.postalCode
                              }
                              onChange={(event) =>
                                setFormField(
                                  "postalCode",
                                  event.target.value
                                )
                              }
                            />
                          </div>

                          <div className="form-field full">
                            <label className="form-label">
                              Description
                            </label>

                            <textarea
                              className="form-textarea"
                              value={
                                requestForm.description
                              }
                              onChange={(event) =>
                                setFormField(
                                  "description",
                                  event.target.value
                                )
                              }
                              placeholder="Optional transfer description"
                            />
                          </div>
                        </div>

                        <div className="button-row">
                          <button
                            className="primary-button"
                            type="submit"
                            disabled={
                              transferOtpLoading
                            }
                          >
                            {transferOtpLoading
                              ? "Processing..."
                              : "Continue Securely"}
                          </button>
                        </div>

                        {transferOtpStatus && (
                          <div className="status-message">
                            {transferOtpStatus}
                          </div>
                        )}
                      </form>
                    </div>
                  </section>
                </>
              )}

              {activePage === "withdraw" && (
                <>
                  <div className="welcome-section">
                    <div>
                      <div className="eyebrow">
                        Cash Services
                      </div>

                      <h1>Withdraw</h1>

                      <p>
                        Submit a withdrawal request from
                        your customer account.
                      </p>
                    </div>
                  </div>

                  <section className="section-card">
                    <div className="section-card-header">
                      <div>
                        <h2>
                          Withdrawal Request
                        </h2>

                        <p>
                          Requests are reviewed by the
                          bank before any action is taken.
                        </p>
                      </div>
                    </div>

                    <div className="section-card-body">
                      <form
                        onSubmit={submitWithdrawal}
                      >
                        <div className="form-grid">
                          <div className="form-field">
                            <label className="form-label">
                              Amount
                            </label>

                            <input
                              className="form-input"
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={
                                requestForm.amount
                              }
                              onChange={(event) =>
                                setFormField(
                                  "amount",
                                  event.target.value
                                )
                              }
                              required
                            />

                            <small className="summary-small">
                              Available balance: $
                              {formatMoney(
                                account?.balance ?? 0
                              )}
                            </small>
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              Method
                            </label>

                            <select
                              className="form-select"
                              value="cash"
                              disabled
                            >
                              <option value="cash">
                                Cash Withdrawal
                              </option>
                            </select>
                          </div>

                          <div className="form-field full">
                            <label className="form-label">
                              Notes
                            </label>

                            <textarea
                              className="form-textarea"
                              value={
                                requestForm.description
                              }
                              onChange={(event) =>
                                setFormField(
                                  "description",
                                  event.target.value
                                )
                              }
                              placeholder="Optional notes for the bank"
                            />
                          </div>
                        </div>

                        <div className="button-row">
                          <button
                            className="primary-button"
                            type="submit"
                            disabled={
                              requestLoading
                            }
                          >
                            {requestLoading
                              ? "Submitting..."
                              : "Submit Withdrawal Request"}
                          </button>
                        </div>

                        {requestStatus && (
                          <div className="status-message">
                            {requestStatus}
                          </div>
                        )}
                      </form>
                    </div>
                  </section>

                  <section className="section-card">
                    <div className="section-card-header">
                      <div>
                        <h2>
                          Withdrawal History
                        </h2>

                        <p>
                          Review your previous withdrawal
                          requests.
                        </p>
                      </div>
                    </div>

                    <div className="section-card-body">
                      {withdrawalLoading ? (
                        <div className="empty-state">
                          Loading withdrawal requests...
                        </div>
                      ) : withdrawalRequests.length ===
                        0 ? (
                        <div className="empty-state">
                          No withdrawal requests yet.
                        </div>
                      ) : (
                        <div className="request-list">
                          {withdrawalRequests.map(
                            (request) => (
                              <div
                                className="request-row"
                                key={request.id}
                              >
                                <div className="request-main">
                                  <strong>
                                    $
                                    {formatMoney(
                                      request.amount
                                    )}
                                  </strong>

                                  <small>
                                    {formatDateTime(
                                      request.created_at
                                    )}
                                  </small>
                                </div>

                                <div className="request-status">
                                  {request.status}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </section>
                </>
              )}

              {activePage === "card" && (
                <>
                  <div className="welcome-section">
                    <div>
                      <div className="eyebrow">
                        Card Services
                      </div>

                      <h1>
                        ATM / Debit Card
                      </h1>

                      <p>
                        View your issued card or submit a
                        new card request.
                      </p>
                    </div>
                  </div>

                  <section className="section-card">
                    <div className="section-card-header">
                      <div>
                        <h2>
                          Your Card
                        </h2>

                        <p>
                          Sensitive card information is
                          never displayed in full.
                        </p>
                      </div>
                    </div>

                    <div className="section-card-body">
                      {cardLoading ? (
                        <div className="empty-state">
                          Loading card information...
                        </div>
                      ) : customerCard ? (
                        <div>
                          <div className="card-display">
                            <div className="card-top">
                              <div className="card-brand">
                                MIDATLANTIC FEDERAL BANK
                              </div>

                              <div className="card-network">
                                {customerCard.card_network ||
                                  "DEBIT"}
                              </div>
                            </div>

                            <div className="chip" />

                            <div className="card-number">
                              {maskCardNumber(
                                customerCard.last4
                              )}
                            </div>

                            <div className="card-bottom">
                              <div>
                                <div className="card-caption">
                                  Cardholder
                                </div>

                                <div className="card-value">
                                  {customerCard.cardholder_name ||
                                    fullName}
                                </div>
                              </div>

                              <div>
                                <div className="card-caption">
                                  Expires
                                </div>

                                <div className="card-value">
                                  {String(
                                    customerCard.expiry_month ||
                                      ""
                                  ).padStart(2, "0")}
                                  /
                                  {String(
                                    customerCard.expiry_year ||
                                      ""
                                  ).slice(-2)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            className="status-message success"
                            style={{
                              maxWidth: 480,
                            }}
                          >
                            Card status:{" "}
                            {customerCard.status ||
                              "active"}
                          </div>
                        </div>
                      ) : (
                        <div className="empty-state">
                          <div
                            style={{
                              fontSize: 36,
                              marginBottom: 12,
                            }}
                          >
                            ▣
                          </div>

                          <strong
                            style={{
                              color: "#28445e",
                            }}
                          >
                            No ATM / Debit Card Issued
                          </strong>

                          <p>
                            You do not currently have a
                            card recorded on your
                            customer account. You can
                            submit a card request below.
                          </p>

                          <button
                            className="primary-button"
                            onClick={orderNewCard}
                            disabled={
                              cardOrderLoading
                            }
                          >
                            {cardOrderLoading
                              ? "Submitting..."
                              : "Order New Card"}
                          </button>
                        </div>
                      )}

                      {cardStatus && (
                        <div className="status-message">
                          {cardStatus}
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="section-card">
                    <div className="section-card-header">
                      <div>
                        <h2>
                          Card Requests
                        </h2>

                        <p>
                          Track your card requests.
                        </p>
                      </div>
                    </div>

                    <div className="section-card-body">
                      {cardOrders.length === 0 ? (
                        <div className="empty-state">
                          No card requests yet.
                        </div>
                      ) : (
                        <div className="request-list">
                          {cardOrders.map(
                            (order) => (
                              <div
                                className="request-row"
                                key={order.id}
                              >
                                <div className="request-main">
                                  <strong>
                                    {order.card_type ||
                                      "Debit"}{" "}
                                    Card
                                  </strong>

                                  <small>
                                    Requested{" "}
                                    {formatDateTime(
                                      order.created_at
                                    )}
                                  </small>
                                </div>

                                <div className="request-status">
                                  {order.status}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </section>
                </>
              )}

              {activePage === "support" && (
                <>
                  <div className="welcome-section">
                    <div>
                      <div className="eyebrow">
                        Customer Care
                      </div>

                      <h1>Support</h1>

                      <p>
                        Get help with your MIDATLANTIC
                        FEDERAL BANK account.
                      </p>
                    </div>
                  </div>

                  <section className="section-card">
                    <div className="section-card-header">
                      <div>
                        <h2>
                          Banking Support
                        </h2>

                        <p>
                          Use the secure support assistant
                          for general account questions.
                        </p>
                      </div>
                    </div>

                    <div className="section-card-body">
                      <div
                        style={{
                          padding: 22,
                          background: "#f7fafc",
                          borderRadius: 17,
                          border: "1px solid #e7edf2",
                        }}
                      >
                        <h3
                          style={{
                            marginTop: 0,
                            color: "#193a57",
                          }}
                        >
                          Need assistance?
                        </h3>

                        <p
                          style={{
                            color: "#718092",
                            lineHeight: 1.7,
                          }}
                        >
                          Ask about navigating your
                          dashboard, transfers, cards,
                          withdrawals, or other banking
                          services.
                        </p>

                        <button
                          className="primary-button"
                          onClick={() =>
                            setChatOpen(true)
                          }
                        >
                          Open Secure Support
                        </button>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </section>
          </div>
        </main>

        <button
          className="chat-button"
          onClick={() =>
            setChatOpen((current) => !current)
          }
          aria-label="Open support chat"
        >
          ?
        </button>

        {chatOpen && (
          <div className="chat-panel">
            <div className="chat-header">
              <div>
                <strong>
                  MIDATLANTIC Support
                </strong>

                <small>
                  Secure customer assistance
                </small>
              </div>

              <button
                className="chat-close"
                onClick={() =>
                  setChatOpen(false)
                }
              >
                ×
              </button>
            </div>

            <div className="chat-messages">
              {chatMessages.length === 0 && (
                <div className="chat-message assistant">
                  Hello {firstName}. How can we help
                  you today?
                </div>
              )}

              {chatMessages.map(
                (message, index) => (
                  <div
                    key={index}
                    className={`chat-message ${
                      message.role === "user"
                        ? "user"
                        : "assistant"
                    }`}
                  >
                    {message.content}
                  </div>
                )
              )}

              {chatLoading && (
                <div className="chat-message assistant">
                  Thinking...
                </div>
              )}
            </div>

            <form
              className="chat-form"
              onSubmit={sendChatMessage}
            >
              <input
                value={chatMessage}
                onChange={(event) =>
                  setChatMessage(
                    event.target.value
                  )
                }
                placeholder="Type your question..."
              />

              <button
                type="submit"
                disabled={chatLoading}
              >
                ↑
              </button>
            </form>
          </div>
        )}

        {transferOtpOpen && (
          <div className="modal-backdrop">
            <div className="modal-card">
              <div className="modal-header">
                <div>
                  <h3>
                    Verify Transfer
                  </h3>

                  <div
                    style={{
                      color: "#7a8795",
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    Enter the one-time verification
                    code sent to your email.
                  </div>
                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setTransferOtpOpen(false)
                  }
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <form
                  onSubmit={
                    verifyCustomerTransfer
                  }
                >
                  <div className="form-field">
                    <label className="form-label">
                      Verification Code
                    </label>

                    <input
                      className="form-input otp-code"
                      value={transferOtp}
                      onChange={(event) =>
                        setTransferOtp(
                          event.target.value
                        )
                      }
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={8}
                      required
                    />
                  </div>

                  {transferOtpStatus && (
                    <div className="status-message">
                      {transferOtpStatus}
                    </div>
                  )}

                  <div className="button-row">
                    <button
                      className="primary-button"
                      type="submit"
                      disabled={
                        transferOtpLoading
                      }
                    >
                      {transferOtpLoading
                        ? "Verifying..."
                        : "Verify & Submit"}
                    </button>

                    <button
                      className="secondary-button"
                      type="button"
                      onClick={
                        resendCustomerTransferOtp
                      }
                      disabled={
                        transferResendLoading
                      }
                    >
                      {transferResendLoading
                        ? "Sending..."
                        : "Resend Code"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {transferReceiptOpen && (
          <div className="modal-backdrop">
            <div className="modal-card">
              <div className="modal-header">
                <div>
                  <h3>
                    Transfer Successful
                  </h3>

                  <div
                    style={{
                      color: "#7a8795",
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    Your transfer request was
                    submitted successfully.
                  </div>
                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setTransferReceiptOpen(
                      false
                    )
                  }
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="receipt">
                  <div className="receipt-row">
                    <span>Status</span>

                    <span>
                      {transferReceipt?.status ||
                        "Submitted"}
                    </span>
                  </div>

                  <div className="receipt-row">
                    <span>Amount</span>

                    <span>
                      {transferReceipt?.currency ||
                        requestForm.transferCurrency ||
                        "USD"}{" "}
                      {formatMoney(
                        transferReceipt?.amount ||
                          requestForm.amount
                      )}
                    </span>
                  </div>

                  <div className="receipt-row">
                    <span>Recipient</span>

                    <span>
                      {transferReceipt?.recipient_name ||
                        "Recipient"}
                    </span>
                  </div>

                  {transferReceipt?.transfer_id && (
                    <div className="receipt-row">
                      <span>Transfer ID</span>

                      <span>
                        {transferReceipt.transfer_id}
                      </span>
                    </div>
                  )}

                  {transferReceipt?.created_at && (
                    <div className="receipt-row">
                      <span>Date</span>

                      <span>
                        {formatDateTime(
                          transferReceipt.created_at
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <div className="button-row">
                  <button
                    className="primary-button"
                    onClick={() =>
                      setTransferReceiptOpen(
                        false
                      )
                    }
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {passwordModalOpen && (
          <div className="modal-backdrop">
            <div className="modal-card">
              <div className="modal-header">
                <div>
                  <h3>
                    Change Password
                  </h3>

                  <div
                    style={{
                      color: "#7a8795",
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    Choose a new password for your
                    MIDATLANTIC FEDERAL BANK account.
                  </div>
                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setPasswordModalOpen(false)
                  }
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <form onSubmit={changePassword}>
                  <div className="form-field">
                    <label className="form-label">
                      New Password
                    </label>

                    <input
                      className="form-input"
                      type="password"
                      value={newPassword}
                      onChange={(event) =>
                        setNewPassword(
                          event.target.value
                        )
                      }
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                  </div>

                  <div
                    className="form-field"
                    style={{ marginTop: 15 }}
                  >
                    <label className="form-label">
                      Confirm Password
                    </label>

                    <input
                      className="form-input"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                  </div>

                  {passwordStatus && (
                    <div className="status-message">
                      {passwordStatus}
                    </div>
                  )}

                  <div className="button-row">
                    <button
                      className="primary-button"
                      type="submit"
                      disabled={
                        passwordLoading
                      }
                    >
                      {passwordLoading
                        ? "Changing..."
                        : "Change Password"}
                    </button>

                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() =>
                        setPasswordModalOpen(
                          false
                        )
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <div className="info-label">
        {label}
      </div>

      <div className="info-value">
        {value || "—"}
      </div>
    </div>
  );
}

function AccountNumberRow({
  accountNumber,
  visible,
  onToggle,
}) {
  const value = accountNumber
    ? visible
      ? accountNumber
      : `••••••${String(accountNumber).slice(-4)}`
    : "Not available";

  return (
    <div className="account-number-row">
      <div>
        <div className="info-label">
          Account Number
        </div>

        <div className="account-number-value">
          {value}
        </div>
      </div>

      {accountNumber && (
        <button
          className="small-button"
          type="button"
          onClick={onToggle}
        >
          {visible ? "Hide" : "Show"}
        </button>
      )}
    </div>
  );
}
