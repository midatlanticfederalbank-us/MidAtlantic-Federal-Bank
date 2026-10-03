"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const EMPTY_FORM = {
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
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [customerCard, setCustomerCard] = useState(null);
  const [cardOrders, setCardOrders] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activePage, setActivePage] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  const [requestForm, setRequestForm] = useState(EMPTY_FORM);
  const [requestStatus, setRequestStatus] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);

  const [withdrawalLoading, setWithdrawalLoading] = useState(false);

  const [cardLoading, setCardLoading] = useState(false);
  const [cardOrderLoading, setCardOrderLoading] = useState(false);
  const [cardStatus, setCardStatus] = useState("");

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

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !currentUser) {
        window.location.href = "/login";
        return;
      }

      setUser(currentUser);

      const { data: profileData, error: profileError } = await supabase
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
          approval_status,
          avatar_path
        `)
        .eq("id", currentUser.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      setProfile(profileData);

      if (profileData.avatar_path) {
        const { data } = await supabase.storage
          .from("profile-pictures")
          .createSignedUrl(profileData.avatar_path, 3600);

        setAvatarUrl(data?.signedUrl || "");
      } else {
        setAvatarUrl("");
      }

      if (profileData.approval_status !== "approved") {
        setLoading(false);
        return;
      }

      const { data: accountData, error: accountError } = await supabase
        .from("customer_accounts")
        .select(`
          id,
          user_id,
          account_number,
          balance,
          status,
          account_type,
          created_at,
          effective_created_at
        `)
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (accountError) {
        throw accountError;
      }

      setAccount(accountData);

      if (accountData) {
        const { data: transactionData } = await supabase
          .from("transactions")
          .select(`
            id,
            transaction_type,
            amount,
            description,
            transaction_date,
            created_at
          `)
          .eq("account_id", accountData.id)
          .order("transaction_date", { ascending: false });

        setTransactions(transactionData || []);
      } else {
        setTransactions([]);
      }

      await Promise.all([
        loadCardData(currentUser.id, accountData?.id),
        loadWithdrawalRequests(currentUser.id),
      ]);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Unable to load your account.");
    } finally {
      setLoading(false);
    }
  }

  async function loadCardData(userId = user?.id) {
    if (!userId) return;

    setCardLoading(true);

    try {
      const { data: cardData } = await supabase
        .from("customer_cards")
        .select(`
          id,
          card_type,
          card_network,
          cardholder_name,
          last4,
          expiry_month,
          expiry_year,
          status,
          created_at,
          activated_at
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setCustomerCard(cardData || null);

      const { data: orders } = await supabase
        .from("customer_card_orders")
        .select(`
          id,
          card_type,
          reason,
          status,
          created_at,
          updated_at
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      setCardOrders(orders || []);
    } catch (err) {
      console.warn("Card data could not be loaded:", err);
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
        .select(`
          id,
          account_id,
          amount,
          withdrawal_method,
          status,
          notes,
          created_at,
          updated_at
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (withdrawalError) {
        console.warn(withdrawalError);
        return;
      }

      setWithdrawalRequests(data || []);
    } catch (err) {
      console.warn(err);
    } finally {
      setWithdrawalLoading(false);
    }
  }

  async function orderNewCard() {
    if (cardOrderLoading || !user || !account) return;

    setCardOrderLoading(true);
    setCardStatus("");

    try {
      const { error: insertError } = await supabase
        .from("customer_card_orders")
        .insert({
          user_id: user.id,
          account_id: account.id,
          card_type: "ATM / Debit Card",
          reason: customerCard
            ? "Replacement card requested by customer"
            : "New card requested by customer",
          status: "pending",
        });

      if (insertError) {
        throw insertError;
      }

      setCardStatus(
        "Your card request has been submitted successfully. The bank will review it and update the status here."
      );

      await loadCardData(user.id);
    } catch (err) {
      setCardStatus(
        err?.message ||
          "Your card request could not be submitted. Please try again."
      );
    } finally {
      setCardOrderLoading(false);
    }
  }

  function greeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  function formatMoney(value) {
    return Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function formatDateOnly(value) {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function maskedAccountNumber(value) {
    if (!value) return "Not available";

    const number = String(value);

    if (number.length <= 4) return number;

    return `•••• ${number.slice(-4)}`;
  }

  function visibleAccountNumber(value) {
    if (!value) return "Not available";
    return String(value);
  }

  function openPage(page) {
    setActivePage(page);
    setMenuOpen(false);
    setRequestStatus("");
    setCardStatus("");

    if (page !== "profile" && page !== "account") {
      setShowAccountNumber(false);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function updateRequestField(field, value) {
    setRequestForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetRequestForm() {
    setRequestForm(EMPTY_FORM);
  }

  async function submitRequest(event) {
    event.preventDefault();

    if (!user || requestLoading) return;

    setRequestStatus("");

    if (activePage === "withdraw") {
      await submitWithdrawal();
      return;
    }

    await startCustomerTransfer(activePage);
  }

  async function submitWithdrawal() {
    const amount = Number(requestForm.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setRequestStatus("Please enter a valid withdrawal amount.");
      return;
    }

    if (!account) {
      setRequestStatus("Your account information is unavailable.");
      return;
    }

    if (account.status !== "active") {
      setRequestStatus(
        "Your account is not active and cannot submit a withdrawal."
      );
      return;
    }

    if (amount > Number(account.balance || 0)) {
      setRequestStatus(
        "The withdrawal amount is greater than your available balance."
      );
      return;
    }

    setRequestLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("withdrawal_requests")
        .insert({
          user_id: user.id,
          account_id: account.id,
          amount,
          withdrawal_method: "cash",
          status: "pending",
          notes: requestForm.description.trim() || null,
        });

      if (insertError) {
        throw insertError;
      }

      resetRequestForm();

      setRequestStatus(
        "Withdrawal request submitted successfully. Your request is now pending bank review."
      );

      await loadWithdrawalRequests(user.id);
    } catch (err) {
      setRequestStatus(
        err?.message ||
          "Your withdrawal request could not be submitted. Please try again."
      );
    } finally {
      setRequestLoading(false);
    }
  }

  async function invokeCustomerTransfer(body) {
    const { data, error: functionError } =
      await supabase.functions.invoke("customer-transfer", {
        body,
      });

    if (functionError) {
      let message =
        functionError.message ||
        "The transfer service is unavailable.";

      try {
        if (
          functionError.context &&
          typeof functionError.context.json === "function"
        ) {
          const payload = await functionError.context.json();

          if (payload?.message) {
            message = payload.message;
          }
        }
      } catch (_) {}

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

  async function startCustomerTransfer(pageType = "transfer") {
    if (requestLoading || !user) return;

    setRequestStatus("");
    setTransferOtpStatus("");

    const amount = Number(requestForm.amount);
    const recipientName = requestForm.recipientName.trim();
    const recipientAccountNumber =
      requestForm.recipientAccountNumber.trim();
    const bankCountry =
      requestForm.bankCountry.trim().toUpperCase();
    const transferCurrency =
      requestForm.transferCurrency.trim().toUpperCase();
    const accountName =
      requestForm.accountName.trim() || recipientName;

    if (!recipientName) {
      setRequestStatus("Please enter the recipient's full name.");
      return;
    }

    if (!recipientAccountNumber) {
      setRequestStatus(
        "Please enter the recipient account number or IBAN."
      );
      return;
    }

    if (!/^[A-Z]{2}$/.test(bankCountry)) {
      setRequestStatus(
        "Enter a valid 2-letter bank country code, such as US, NG, or TR."
      );
      return;
    }

    if (!/^[A-Z]{3}$/.test(transferCurrency)) {
      setRequestStatus(
        "Enter a valid 3-letter transfer currency, such as USD, NGN, or TRY."
      );
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setRequestStatus("Please enter a valid transfer amount.");
      return;
    }

    if (!account || account.status !== "active") {
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

        recipientName,
        recipientAccountNumber,
        bankName: requestForm.bankName.trim(),

        bankCountry,
        transferCurrency,

        transferMethod:
          pageType === "wire"
            ? "SWIFT"
            : pageType === "local"
            ? "LOCAL"
            : requestForm.transferMethod,

        beneficiaryType: requestForm.beneficiaryType,

        accountName,

        routingType: requestForm.routingType.trim(),
        routingValue: requestForm.routingValue.trim(),

        swiftBic: requestForm.swiftBic.trim(),

        streetAddress:
          requestForm.streetAddress.trim(),

        city: requestForm.city.trim(),
        state: requestForm.state.trim(),
        postalCode: requestForm.postalCode.trim(),

        amount,

        description:
          requestForm.description.trim() ||
          "Customer Transfer",
      });

      setTransferId(data.transferId || "");
      setTransferPageType(pageType);
      setTransferOtp("");

      setTransferOtpStatus(
        `A 6-digit verification code has been sent to ${
          data.emailMasked || "your registered email address"
        }.`
      );

      setTransferOtpOpen(true);
    } catch (err) {
      setRequestStatus(
        err?.message ||
          "We could not start the transfer. Please check the bank details and try again."
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

    if (!/^[0-9]{6}$/.test(transferOtp.trim())) {
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
        otp: transferOtp.trim(),
      });

      setTransferOtpOpen(false);
      setTransferOtp("");
      setTransferId("");
      setTransferPageType("transfer");

      resetRequestForm();
      setRequestStatus("");

      setTransferReceipt(data.receipt || data);
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

        recipientName:
          requestForm.recipientName.trim(),

        recipientAccountNumber:
          requestForm.recipientAccountNumber.trim(),

        bankName:
          requestForm.bankName.trim(),

        bankCountry:
          requestForm.bankCountry
            .trim()
            .toUpperCase(),

        transferCurrency:
          requestForm.transferCurrency
            .trim()
            .toUpperCase(),

        transferMethod:
          transferPageType === "wire"
            ? "SWIFT"
            : transferPageType === "local"
            ? "LOCAL"
            : requestForm.transferMethod,

        beneficiaryType:
          requestForm.beneficiaryType,

        accountName:
          requestForm.accountName.trim() ||
          requestForm.recipientName.trim(),

        routingType:
          requestForm.routingType.trim(),

        routingValue:
          requestForm.routingValue.trim(),

        swiftBic:
          requestForm.swiftBic.trim(),

        streetAddress:
          requestForm.streetAddress.trim(),

        city:
          requestForm.city.trim(),

        state:
          requestForm.state.trim(),

        postalCode:
          requestForm.postalCode.trim(),

        amount,

        description:
          requestForm.description.trim() ||
          "Customer Transfer",
      });

      setTransferId(data.transferId || "");
      setTransferOtp("");

      setTransferOtpStatus(
        `A new verification code has been sent to ${
          data.emailMasked || "your registered email address"
        }.`
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

  async function changePassword(event) {
    event.preventDefault();

    if (passwordLoading) return;

    setPasswordStatus("");

    if (newPassword.length < 8) {
      setPasswordStatus(
        "Your new password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus(
        "The new passwords do not match."
      );
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

      setTimeout(() => {
        setPasswordModalOpen(false);
        setPasswordStatus("");
      }, 1500);
    } catch (err) {
      setPasswordStatus(
        err?.message ||
          "Your password could not be changed."
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  async function uploadProfilePicture(event) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file || !user || avatarLoading) return;

    setAvatarStatus("");

    if (!file.type.startsWith("image/")) {
      setAvatarStatus(
        "Please choose an image file."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarStatus(
        "Profile pictures must be 5 MB or smaller."
      );
      return;
    }

    setAvatarLoading(true);

    try {
      const extension =
        (
          file.name.split(".").pop() ||
          "jpg"
        )
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "") ||
        "jpg";

      const path =
        `${user.id}/avatar.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("profile-pictures")
          .upload(path, file, {
            cacheControl: "3600",
            contentType: file.type,
            upsert: true,
          });

      if (uploadError) {
        throw uploadError;
      }

      const { error: profileError } =
        await supabase.rpc(
          "set_profile_avatar_path",
          {
            p_avatar_path: path,
          }
        );

      if (profileError) {
        throw profileError;
      }

      const { data: signedData } =
        await supabase.storage
          .from("profile-pictures")
          .createSignedUrl(path, 3600);

      if (!signedData?.signedUrl) {
        throw new Error(
          "The photo was uploaded but could not be displayed."
        );
      }

      setAvatarUrl(signedData.signedUrl);

      setProfile((current) =>
        current
          ? {
              ...current,
              avatar_path: path,
            }
          : current
      );

      setAvatarStatus(
        "Profile picture updated successfully."
      );
    } catch (err) {
      setAvatarStatus(
        err?.message ||
          "Your profile picture could not be uploaded."
      );
    } finally {
      setAvatarLoading(false);
    }
  }

  async function loadChatMessages() {
    if (!user) return;

    const { data, error: chatError } =
      await supabase
        .from("support_messages")
        .select(
          "id, sender, message, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: true,
        });

    if (chatError) {
      setChatMessages([
        {
          id: "welcome",
          sender: "support",
          message:
            "Hello. Welcome to MIDATLANTIC FEDERAL BANK Customer Support. How can we help you today?",
          created_at:
            new Date().toISOString(),
        },
      ]);

      return;
    }

    setChatMessages(
      data?.length
        ? data
        : [
            {
              id: "welcome",
              sender: "support",
              message:
                "Hello. Welcome to MIDATLANTIC FEDERAL BANK Customer Support. How can we help you today?",
              created_at:
                new Date().toISOString(),
            },
          ]
    );
  }

  async function sendChatMessage(event) {
    event.preventDefault();

    const message = chatMessage.trim();

    if (
      !message ||
      chatLoading ||
      !user
    ) {
      return;
    }

    setChatLoading(true);

    const localMessage = {
      id: `local-${Date.now()}`,
      sender: "customer",
      message,
      created_at:
        new Date().toISOString(),
    };

    setChatMessages((current) => [
      ...current,
      localMessage,
    ]);

    setChatMessage("");

    try {
      await supabase
        .from("support_messages")
        .insert({
          user_id: user.id,
          sender: "customer",
          message,
        });
    } catch (err) {
      console.warn(err);
    } finally {
      setChatLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <main className="loading-screen">
          <div className="loading-box">
            <div className="loading-mark">
              M
            </div>

            <div className="spinner"></div>

            <h2>
              MIDATLANTIC FEDERAL BANK
            </h2>

            <p>
              Loading your secure banking portal...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{styles}</style>

        <main className="loading-screen">
          <div className="loading-box error-box">
            <div className="loading-mark">
              !
            </div>

            <h2>
              Unable to Load Account
            </h2>

            <p>{error}</p>

            <button
              className="primary-button"
              onClick={logout}
            >
              Sign Out
            </button>
          </div>
        </main>
      </>
    );
  }

  if (
    profile &&
    profile.approval_status !== "approved"
  ) {
    return (
      <>
        <style>{styles}</style>

        <main className="app-shell">
          <Header
            menuOpen={false}
            setMenuOpen={setMenuOpen}
            openPage={openPage}
            logout={logout}
            showMenu={false}
          />

          <div className="page-container">
            <section className="approval-card">
              <span className="status-pill pending">
                PENDING APPROVAL
              </span>

              <div className="approval-icon">
                ⏳
              </div>

              <h1>
                {greeting()},{" "}
                {profile.full_name ||
                  "Customer"}
              </h1>

              <h2>
                Your account is awaiting approval
              </h2>

              <p>
                Your registration has been
                received successfully. A bank
                administrator must approve your
                customer account before banking
                services become available.
              </p>

              <button
                className="primary-button"
                onClick={logout}
              >
                Sign Out
              </button>
            </section>
          </div>
        </main>
      </>
    );
  }

  if (!account) {
    return (
      <>
        <style>{styles}</style>

        <main className="app-shell">
          <Header
            menuOpen={false}
            setMenuOpen={setMenuOpen}
            openPage={openPage}
            logout={logout}
            showMenu={false}
          />

          <div className="page-container">
            <section className="approval-card">
              <div className="approval-icon">
                ✓
              </div>

              <h1>
                {greeting()},{" "}
                {profile?.full_name ||
                  "Customer"}
              </h1>

              <h2>
                Account information unavailable
              </h2>

              <p>
                Your customer profile has been
                approved, but an account record
                has not yet been assigned.
              </p>

              <button
                className="primary-button"
                onClick={logout}
              >
                Sign Out
              </button>
            </section>
          </div>
        </main>
      </>
    );
  }

  const activeTitle =
    activePage === "withdraw"
      ? "Withdraw"
      : activePage === "transfer"
      ? "Transfer"
      : activePage === "wire"
      ? "Wire Transfer"
      : activePage === "local"
      ? "Local Transfer"
      : activePage === "card"
      ? "ATM / Debit Card"
      : activePage === "profile"
      ? "My Profile"
      : activePage === "account"
      ? "Account Information"
      : activePage === "transactions"
      ? "Transaction History"
      : activePage === "notifications"
      ? "Notifications"
      : activePage === "support"
      ? "Customer Support"
      : activePage === "security"
      ? "Security Center"
      : activePage === "settings"
      ? "Account Settings"
      : "";

  return (
    <>
      <style>{styles}</style>

      <main className="app-shell">
        <Header
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          openPage={openPage}
          logout={logout}
          showMenu
        />

        <div className="page-container">

          {activePage === "dashboard" && (
            <>
              <section className="hero-row">
                <div>
                  <span className="eyebrow">
                    CUSTOMER BANKING
                  </span>

                  <h1>
                    {greeting()},{" "}
                    {profile?.full_name ||
                      "Customer"}
                  </h1>

                  <p>
                    Welcome back. Here's your
                    secure account overview.
                  </p>
                </div>

                <div className="hero-security">
                  <span className="secure-dot">
                    ✓
                  </span>
                  <div>
                    <strong>
                      Secure session
                    </strong>
                    <small>
                      Your connection is protected
                    </small>
                  </div>
                </div>
              </section>

              <section className="balance-card">
                <div className="balance-card-glow"></div>

                <div className="balance-top">
                  <span>
                    AVAILABLE BALANCE
                  </span>

                  <span className="active-badge">
                    <i></i>
                    {account.status ||
                      "Active"}
                  </span>
                </div>

                <div className="balance-amount">
                  $
                  {formatMoney(
                    account.balance
                  )}
                </div>

                <div className="balance-bottom">
                  <span>
                    Account ending in{" "}
                    {String(
                      account.account_number ||
                        ""
                    ).slice(-4)}
                  </span>

                  <button
                    onClick={() =>
                      openPage("account")
                    }
                  >
                    View account →
                  </button>
                </div>
              </section>

              <section className="section-block">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">
                      ACCOUNT SERVICES
                    </span>
                    <h2>
                      What would you like to do?
                    </h2>
                  </div>
                </div>

                <div className="action-grid">
                  <ActionCard
                    icon="↓"
                    title="Withdraw"
                    text="Submit a withdrawal request"
                    onClick={() =>
                      openPage("withdraw")
                    }
                  />

                  <ActionCard
                    icon="↗"
                    title="Transfer"
                    text="Send money to another bank"
                    onClick={() =>
                      openPage("transfer")
                    }
                  />

                  <ActionCard
                    icon="⇄"
                    title="Wire Transfer"
                    text="Send an international wire"
                    onClick={() =>
                      openPage("wire")
                    }
                  />

                  <ActionCard
                    icon="→"
                    title="Local Transfer"
                    text="Make a local bank transfer"
                    onClick={() =>
                      openPage("local")
                    }
                  />

                  <ActionCard
                    icon="▣"
                    title="ATM / Debit Card"
                    text="View or request a card"
                    onClick={() =>
                      openPage("card")
                    }
                  />
                </div>
              </section>

              <div className="dashboard-grid">

                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">
                        ACCOUNT
                      </span>
                      <h2>
                        Account Overview
                      </h2>
                    </div>

                    <button
                      className="link-button"
                      onClick={() =>
                        openPage("account")
                      }
                    >
                      Details →
                    </button>
                  </div>

                  <InfoRow
                    label="Account Holder"
                    value={
                      profile?.full_name
                    }
                  />

                  <InfoRow
                    label="Account Number"
                    value={maskedAccountNumber(
                      account.account_number
                    )}
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
                    success
                  />
                </section>

                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">
                        ACCOUNT ACTIVITY
                      </span>
                      <h2>
                        Notifications
                      </h2>
                    </div>
                  </div>

                  <NoticeItem
                    icon="✓"
                    title="Account Active"
                    text="Your customer account is currently available."
                  />

                  <NoticeItem
                    icon="!"
                    title="Security Reminder"
                    text="Never share passwords or verification codes."
                    warning
                  />
                </section>
              </div>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">
                      ACCOUNT ACTIVITY
                    </span>

                    <h2>
                      Recent Transactions
                    </h2>
                  </div>

                  <button
                    className="link-button"
                    onClick={() =>
                      openPage(
                        "transactions"
                      )
                    }
                  >
                    View all →
                  </button>
                </div>

                {transactions.length ===
                0 ? (
                  <EmptyState
                    title="No Transactions Yet"
                    text="Transactions associated with this account will appear here."
                  />
                ) : (
                  <TransactionList
                    transactions={transactions.slice(
                      0,
                      5
                    )}
                    formatMoney={
                      formatMoney
                    }
                    formatDate={
                      formatDate
                    }
                  />
                )}
              </section>

              <section className="news-banner">
                <div>
                  <span className="eyebrow">
                    MARKET & BANKING
                  </span>

                  <h2>
                    Banking news and insights
                  </h2>

                  <p>
                    Read the latest banking and
                    market information from
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
                  View Bank News →
                </button>
              </section>
            </>
          )}

          {activePage === "card" && (
            <PageShell
              title={activeTitle}
              label="CARD SERVICES"
            >
              <section className="panel card-panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">
                      YOUR CARD
                    </span>
                    <h2>
                      ATM / Debit Card
                    </h2>
                    <p>
                      View your issued card or
                      submit a new card request.
                    </p>
                  </div>
                </div>

                {cardLoading ? (
                  <LoadingInline text="Loading card information..." />
                ) : customerCard ? (
                  <div className="bank-card">
                    <div className="bank-card-shine"></div>

                    <div className="bank-card-top">
                      <strong>
                        MIDATLANTIC
                      </strong>

                      <span>
                        {customerCard.card_network ||
                          "DEBIT"}
                      </span>
                    </div>

                    <div className="chip">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <div className="card-number">
                      •••• •••• ••••{" "}
                      {customerCard.last4 ||
                        "----"}
                    </div>

                    <div className="card-details">
                      <div>
                        <small>
                          CARDHOLDER
                        </small>
                        <strong>
                          {customerCard.cardholder_name ||
                            profile?.full_name ||
                            "Customer"}
                        </strong>
                      </div>

                      <div>
                        <small>
                          EXPIRES
                        </small>
                        <strong>
                          {customerCard.expiry_month &&
                          customerCard.expiry_year
                            ? `${String(
                                customerCard.expiry_month
                              ).padStart(
                                2,
                                "0"
                              )}/${String(
                                customerCard.expiry_year
                              ).slice(-2)}`
                            : "--/--"}
                        </strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="No ATM / Debit Card Issued"
                    text="You do not currently have a card recorded on your account."
                  />
                )}

                <div className="card-request-box">
                  <div>
                    <span className="eyebrow">
                      CARD REQUEST
                    </span>

                    <h3>
                      {customerCard
                        ? "Need a replacement card?"
                        : "Order an ATM / Debit Card"}
                    </h3>

                    <p>
                      Card issuance and delivery
                      are subject to bank review
                      and approval.
                    </p>
                  </div>

                  <button
                    className="primary-button"
                    onClick={orderNewCard}
                    disabled={
                      cardOrderLoading
                    }
                  >
                    {cardOrderLoading
                      ? "Submitting..."
                      : customerCard
                      ? "Order Replacement"
                      : "Order New Card"}
                  </button>
                </div>

                {cardStatus && (
                  <div className="success-message">
                    {cardStatus}
                  </div>
                )}

                {cardOrders.length >
                  0 && (
                  <div className="request-history">
                    <h3>
                      Recent Card Requests
                    </h3>

                    {cardOrders.map(
                      (order) => (
                        <div
                          className="history-row"
                          key={order.id}
                        >
                          <div>
                            <strong>
                              {order.card_type ||
                                "ATM / Debit Card"}
                            </strong>

                            <small>
                              {formatDate(
                                order.created_at
                              )}
                            </small>
                          </div>

                          <StatusBadge
                            status={
                              order.status
                            }
                          />
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>
            </PageShell>
          )}

          {activePage === "profile" && (
            <PageShell
              title="My Profile"
              label="CUSTOMER"
            >
              <section className="panel">
                <div className="profile-top">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      className="profile-avatar-image"
                      alt="Profile"
                    />
                  ) : (
                    <div className="profile-avatar">
                      {(
                        profile?.full_name ||
                        "C"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h2>
                      {profile?.full_name ||
                        "Customer"}
                    </h2>

                    <p>
                      Customer Account
                    </p>

                    <label className="upload-button">
                      {avatarLoading
                        ? "Uploading..."
                        : avatarUrl
                        ? "Change Photo"
                        : "Upload Photo"}

                      <input
                        type="file"
                        hidden
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={
                          uploadProfilePicture
                        }
                        disabled={
                          avatarLoading
                        }
                      />
                    </label>
                  </div>
                </div>

                {avatarStatus && (
                  <div
                    className={
                      avatarStatus
                        .toLowerCase()
                        .includes(
                          "successfully"
                        )
                        ? "success-message"
                        : "error-message"
                    }
                  >
                    {avatarStatus}
                  </div>
                )}

                <ProfileGroup title="Personal Information">
                  <InfoRow
                    label="Full Name"
                    value={
                      profile?.full_name
                    }
                  />

                  <InfoRow
                    label="Date of Birth"
                    value={formatDateOnly(
                      profile?.date_of_birth
                    )}
                  />

                  <InfoRow
                    label="Phone Number"
                    value={
                      profile?.phone_number
                    }
                  />

                  <InfoRow
                    label="Email Address"
                    value={user?.email}
                  />
                </ProfileGroup>

                <ProfileGroup title="Address Information">
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
                </ProfileGroup>

                <ProfileGroup title="Account Information">
                  <AccountNumberRow
                    accountNumber={
                      account.account_number
                    }
                    visible={
                      showAccountNumber
                    }
                    onToggle={() =>
                      setShowAccountNumber(
                        (value) => !value
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
                    success
                  />

                  <InfoRow
                    label="Account Created"
                    value={formatDate(
                      account.effective_created_at ||
                        account.created_at
                    )}
                  />
                </ProfileGroup>
              </section>
            </PageShell>
          )}

          {activePage === "account" && (
            <PageShell
              title="Account Information"
              label="ACCOUNT"
            >
              <section className="panel">
                <InfoRow
                  label="Account Holder"
                  value={
                    profile?.full_name
                  }
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
                      (value) => !value
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
                  success
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
              </section>
            </PageShell>
          )}

          {[
            "withdraw",
            "transfer",
            "wire",
            "local",
          ].includes(activePage) && (
            <PageShell
              title={activeTitle}
              label="TRANSFERS & PAYMENTS"
            >
              {activePage ===
              "withdraw" ? (
                <WithdrawalPage
                  account={account}
                  form={requestForm}
                  updateField={
                    updateRequestField
                  }
                  submit={submitRequest}
                  loading={
                    requestLoading
                  }
                  status={
                    requestStatus
                  }
                  requests={
                    withdrawalRequests
                  }
                  withdrawalLoading={
                    withdrawalLoading
                  }
                  formatMoney={
                    formatMoney
                  }
                  formatDate={
                    formatDate
                  }
                />
              ) : (
                <TransferPage
                  type={activePage}
                  form={requestForm}
                  updateField={
                    updateRequestField
                  }
                  submit={submitRequest}
                  loading={
                    requestLoading
                  }
                  status={
                    requestStatus
                  }
                  account={account}
                  formatMoney={
                    formatMoney
                  }
                />
              )}
            </PageShell>
          )}

          {activePage ===
            "transactions" && (
            <PageShell
              title="Transaction History"
              label="ACCOUNT ACTIVITY"
            >
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">
                      ACCOUNT ACTIVITY
                    </span>

                    <h2>
                      All Transactions
                    </h2>
                  </div>
                </div>

                {transactions.length ===
                0 ? (
                  <EmptyState
                    title="No Transactions Yet"
                    text="There are no transactions associated with this account."
                  />
                ) : (
                  <TransactionList
                    transactions={
                      transactions
                    }
                    formatMoney={
                      formatMoney
                    }
                    formatDate={
                      formatDate
                    }
                  />
                )}
              </section>
            </PageShell>
          )}

          {activePage ===
            "notifications" && (
            <PageShell
              title="Notifications"
              label="ACCOUNT ACTIVITY"
            >
              <section className="panel">
                <NoticeItem
                  icon="✓"
                  title="Account Active"
                  text="Your customer account is currently available."
                />

                <NoticeItem
                  icon="!"
                  title="Security Reminder"
                  text="Never share passwords or verification codes."
                  warning
                />

                {withdrawalRequests
                  .filter(
                    (item) =>
                      item.status ===
                      "pending"
                  )
                  .map((item) => (
                    <NoticeItem
                      key={item.id}
                      icon="↓"
                      title="Withdrawal Pending"
                      text={`Your $${formatMoney(
                        item.amount
                      )} withdrawal request is awaiting bank review.`}
                    />
                  ))}
              </section>
            </PageShell>
          )}

          {activePage === "support" && (
            <PageShell
              title="Customer Support"
              label="SUPPORT"
            >
              <section className="panel support-panel">
                <div className="support-header">
                  <div className="support-icon">
                    ?
                  </div>

                  <div>
                    <h2>
                      Customer Support
                    </h2>

                    <p>
                      Send a message to the bank
                      support team.
                    </p>
                  </div>
                </div>

                <button
                  className="primary-button"
                  onClick={async () => {
                    setChatOpen(true);
                    await loadChatMessages();
                  }}
                >
                  Open Support Chat
                </button>
              </section>
            </PageShell>
          )}

          {activePage === "security" && (
            <PageShell
              title="Security Center"
              label="SECURITY"
            >
              <section className="panel security-panel">
                <div className="security-item">
                  <div className="security-icon">
                    ✓
                  </div>

                  <div>
                    <h3>
                      Secure Customer Session
                    </h3>

                    <p>
                      Your banking session is
                      protected by Supabase
                      authentication.
                    </p>
                  </div>
                </div>

                <div className="security-item">
                  <div className="security-icon">
                    ✉
                  </div>

                  <div>
                    <h3>
                      Transfer Verification
                    </h3>

                    <p>
                      Bank transfers require
                      email verification before
                      they are submitted.
                    </p>
                  </div>
                </div>

                <div className="security-item warning-security">
                  <div className="security-icon">
                    !
                  </div>

                  <div>
                    <h3>
                      Protect Your Verification Code
                    </h3>

                    <p>
                      Bank staff should never ask
                      you to disclose a one-time
                      verification code over the
                      phone or chat.
                    </p>
                  </div>
                </div>
              </section>
            </PageShell>
          )}

          {activePage === "settings" && (
            <PageShell
              title="Account Settings"
              label="SECURITY"
            >
              <section className="panel settings-panel">
                <div className="settings-item">
                  <div>
                    <span className="eyebrow">
                      PASSWORD
                    </span>

                    <h3>
                      Change Password
                    </h3>

                    <p>
                      Update your customer login
                      password.
                    </p>
                  </div>

                  <button
                    className="secondary-button"
                    onClick={() => {
                      setPasswordStatus("");
                      setPasswordModalOpen(
                        true
                      );
                    }}
                  >
                    Change Password
                  </button>
                </div>

                <div className="settings-item">
                  <div>
                    <span className="eyebrow">
                      SESSION
                    </span>

                    <h3>
                      Sign Out
                    </h3>

                    <p>
                      Securely end your current
                      customer session.
                    </p>
                  </div>

                  <button
                    className="danger-button"
                    onClick={logout}
                  >
                    Sign Out
                  </button>
                </div>
              </section>
            </PageShell>
          )}
        </div>

        <footer className="portal-footer">
          <div>
            <strong>
              MIDATLANTIC FEDERAL BANK
            </strong>

            <span>
              Secure Customer Banking Portal
            </span>
          </div>

          <span>
            © {new Date().getFullYear()} MIDATLANTIC FEDERAL BANK
          </span>
        </footer>

        <button
          className="floating-support"
          onClick={async () => {
            setChatOpen(true);
            await loadChatMessages();
          }}
          aria-label="Open support chat"
        >
          ?
        </button>

        {chatOpen && (
          <div className="chat-overlay">
            <div className="chat-window">
              <div className="chat-header">
                <div>
                  <strong>
                    Customer Support
                  </strong>

                  <small>
                    MIDATLANTIC FEDERAL BANK
                  </small>
                </div>

                <button
                  onClick={() =>
                    setChatOpen(false)
                  }
                >
                  ×
                </button>
              </div>

              <div className="chat-messages">
                {chatMessages.map(
                  (message) => (
                    <div
                      key={message.id}
                      className={`chat-message ${
                        message.sender ===
                        "customer"
                          ? "customer-message"
                          : "support-message"
                      }`}
                    >
                      {message.message}

                      <small>
                        {formatDate(
                          message.created_at
                        )}
                      </small>
                    </div>
                  )
                )}
              </div>

              <form
                className="chat-input"
                onSubmit={
                  sendChatMessage
                }
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
          </div>
        )}

        {transferOtpOpen && (
          <div className="modal-overlay">
            <div className="modal-card">
              <button
                className="modal-close"
                onClick={
                  closeTransferOtp
                }
              >
                ×
              </button>

              <div className="modal-icon">
                ✉
              </div>

              <span className="eyebrow">
                SECURITY VERIFICATION
              </span>

              <h2>
                Verify Your Transfer
              </h2>

              <p>
                Enter the 6-digit verification
                code sent to your registered
                email address.
              </p>

              {transferOtpStatus && (
                <div
                  className={
                    transferOtpStatus
                      .toLowerCase()
                      .includes("could")
                      ? "error-message"
                      : "success-message"
                  }
                >
                  {transferOtpStatus}
                </div>
              )}

              <form
                onSubmit={
                  verifyCustomerTransfer
                }
              >
                <label className="field">
                  Verification Code

                  <input
                    className="otp-input"
                    inputMode="numeric"
                    maxLength={6}
                    value={transferOtp}
                    onChange={(event) =>
                      setTransferOtp(
                        event.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(0, 6)
                      )
                    }
                    placeholder="000000"
                    autoFocus
                  />
                </label>

                <button
                  className="primary-button full"
                  type="submit"
                  disabled={
                    transferOtpLoading
                  }
                >
                  {transferOtpLoading
                    ? "Verifying..."
                    : "Verify & Send Transfer"}
                </button>
              </form>

              <button
                className="modal-link"
                onClick={
                  resendCustomerTransferOtp
                }
                disabled={
                  transferResendLoading
                }
              >
                {transferResendLoading
                  ? "Sending new code..."
                  : "Didn't receive the code? Send again"}
              </button>

              <div className="security-note">
                Never share this verification
                code with anyone.
              </div>
            </div>
          </div>
        )}

        {transferReceiptOpen && (
          <div className="modal-overlay">
            <div className="modal-card receipt-card">
              <button
                className="modal-close"
                onClick={
                  closeTransferReceipt
                }
              >
                ×
              </button>

              <div className="receipt-success">
                ✓
              </div>

              <span className="eyebrow">
                TRANSFER COMPLETE
              </span>

              <h2>
                Transfer Successful
              </h2>

              <p>
                Your transfer was submitted
                successfully.
              </p>

              <div className="receipt">
                <ReceiptRow
                  label="Recipient"
                  value={
                    transferReceipt?.recipientName ||
                    transferReceipt?.recipient_name ||
                    "Recipient"
                  }
                />

                <ReceiptRow
                  label="Amount"
                  value={
                    transferReceipt?.amount
                      ? `${transferReceipt.currency || ""} ${transferReceipt.amount}`
                      : "Transfer submitted"
                  }
                />

                <ReceiptRow
                  label="Status"
                  value={
                    transferReceipt?.status ||
                    "Submitted"
                  }
                />

                <ReceiptRow
                  label="Date"
                  value={formatDate(
                    transferReceipt?.createdAt ||
                      transferReceipt?.created_at ||
                      new Date()
                  )}
                />

                {(transferReceipt?.recipientAccountNumber ||
                  transferReceipt?.recipient_account_number) && (
                  <ReceiptRow
                    label="Recipient Account"
                    value={maskSensitiveAccount(
                      transferReceipt?.recipientAccountNumber ||
                        transferReceipt?.recipient_account_number
                    )}
                  />
                )}
              </div>

              <button
                className="primary-button full"
                onClick={
                  closeTransferReceipt
                }
              >
                Done
              </button>
            </div>
          </div>
        )}

        {passwordModalOpen && (
          <div className="modal-overlay">
            <div className="modal-card">
              <button
                className="modal-close"
                onClick={() =>
                  setPasswordModalOpen(
                    false
                  )
                }
              >
                ×
              </button>

              <div className="modal-icon">
                🔒
              </div>

              <span className="eyebrow">
                SECURITY
              </span>

              <h2>
                Change Password
              </h2>

              <p>
                Choose a strong password that
                you do not use elsewhere.
              </p>

              <form
                onSubmit={
                  changePassword
                }
              >
                <label className="field">
                  New Password

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(
                        event.target.value
                      )
                    }
                    minLength={8}
                    required
                  />
                </label>

                <label className="field">
                  Confirm New Password

                  <input
                    type="password"
                    value={
                      confirmPassword
                    }
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    minLength={8}
                    required
                  />
                </label>

                {passwordStatus && (
                  <div
                    className={
                      passwordStatus
                        .includes(
                          "successfully"
                        )
                        ? "success-message"
                        : "error-message"
                    }
                  >
                    {passwordStatus}
                  </div>
                )}

                <button
                  className="primary-button full"
                  type="submit"
                  disabled={
                    passwordLoading
                  }
                >
                  {passwordLoading
                    ? "Updating..."
                    : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function Header({
  menuOpen,
  setMenuOpen,
  openPage,
  logout,
  showMenu,
}) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">
          M
        </div>

        <div className="brand-copy">
          <strong>
            MIDATLANTIC
          </strong>

          <span>
            FEDERAL BANK
          </span>

          <small>
            CUSTOMER BANKING
          </small>
        </div>
      </div>

      <div className="topbar-right">
        <div className="online-status">
          <i></i>
          Online
        </div>

        {showMenu ? (
          <button
            className={`menu-button ${
              menuOpen ? "open" : ""
            }`}
            onClick={() =>
              setMenuOpen(
                (value) => !value
              )
            }
            aria-label="Open menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        ) : (
          <button
            className="signout-button"
            onClick={logout}
          >
            Sign Out
          </button>
        )}
      </div>

      {showMenu && menuOpen && (
        <div className="side-menu">
          <div className="menu-head">
            <div>
              <strong>
                Customer Portal
              </strong>

              <span>
                Account Menu
              </span>
            </div>

            <button
              onClick={() =>
                setMenuOpen(false)
              }
            >
              ×
            </button>
          </div>

          <MenuGroup title="MAIN">
            <MenuButton
              icon="⌂"
              text="Dashboard"
              onClick={() =>
                openPage(
                  "dashboard"
                )
              }
            />

            <MenuButton
              icon="○"
              text="My Profile"
              onClick={() =>
                openPage(
                  "profile"
                )
              }
            />

            <MenuButton
              icon="▣"
              text="Account Information"
              onClick={() =>
                openPage(
                  "account"
                )
              }
            />
          </MenuGroup>

          <MenuGroup title="TRANSFERS & PAYMENTS">
            <MenuButton
              icon="↓"
              text="Withdraw"
              onClick={() =>
                openPage(
                  "withdraw"
                )
              }
            />

            <MenuButton
              icon="↗"
              text="Transfer"
              onClick={() =>
                openPage(
                  "transfer"
                )
              }
            />

            <MenuButton
              icon="⇄"
              text="Wire Transfer"
              onClick={() =>
                openPage(
                  "wire"
                )
              }
            />

            <MenuButton
              icon="→"
              text="Local Transfer"
              onClick={() =>
                openPage(
                  "local"
                )
              }
            />

            <MenuButton
              icon="▣"
              text="ATM / Debit Card"
              onClick={() =>
                openPage(
                  "card"
                )
              }
            />
          </MenuGroup>

          <MenuGroup title="ACTIVITY">
            <MenuButton
              icon="▤"
              text="Transaction History"
              onClick={() =>
                openPage(
                  "transactions"
                )
              }
            />

            <MenuButton
              icon="○"
              text="Notifications"
              onClick={() =>
                openPage(
                  "notifications"
                )
              }
            />
          </MenuGroup>

          <MenuGroup title="SUPPORT">
            <MenuButton
              icon="?"
              text="Customer Support"
              onClick={() =>
                openPage(
                  "support"
                )
              }
            />
          </MenuGroup>

          <MenuGroup title="SECURITY">
            <MenuButton
              icon="◇"
              text="Security Center"
              onClick={() =>
                openPage(
                  "security"
                )
              }
            />

            <MenuButton
              icon="⚙"
              text="Account Settings"
              onClick={() =>
                openPage(
                  "settings"
                )
              }
            />
          </MenuGroup>

          <button
            className="menu-signout"
            onClick={logout}
          >
            ↪
            <span>
              Sign Out
            </span>
          </button>
        </div>
      )}
    </header>
  );
}

function MenuGroup({
  title,
  children,
}) {
  return (
    <div className="menu-group">
      <div className="menu-label">
        {title}
      </div>

      {children}
    </div>
  );
}

function MenuButton({
  icon,
  text,
  onClick,
}) {
  return (
    <button
      className="menu-item"
      onClick={onClick}
    >
      <span className="menu-item-icon">
        {icon}
      </span>

      <span>{text}</span>
    </button>
  );
}

function ActionCard({
  icon,
  title,
  text,
  onClick,
}) {
  return (
    <button
      className="action-card"
      onClick={onClick}
    >
      <span className="action-icon">
        {icon}
      </span>

      <strong>
        {title}
      </strong>

      <small>
        {text}
      </small>

      <span className="action-arrow">
        →
      </span>
    </button>
  );
}

function PageShell({
  title,
  label,
  children,
}) {
  return (
    <section className="content-page">
      <div className="page-title">
        <span className="eyebrow">
          {label}
        </span>

        <h1>{title}</h1>
      </div>

      {children}
    </section>
  );
}

function InfoRow({
  label,
  value,
  success = false,
}) {
  return (
    <div className="info-row">
      <span>{label}</span>

      <strong
        className={
          success ? "success-text" : ""
        }
      >
        {value || "Not available"}
      </strong>
    </div>
  );
}

function AccountNumberRow({
  accountNumber,
  visible,
  onToggle,
}) {
  return (
    <div className="info-row">
      <span>
        Account Number
      </span>

      <div className="account-value">
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
            className="eye-button"
            onClick={onToggle}
            type="button"
            title={
              visible
                ? "Hide account number"
                : "Show account number"
            }
          >
            {visible ? "◉" : "◌"}
          </button>
        )}
      </div>
    </div>
  );
}

function ProfileGroup({
  title,
  children,
}) {
  return (
    <div className="profile-group">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function NoticeItem({
  icon,
  title,
  text,
  warning = false,
}) {
  return (
    <div className="notice-item">
      <div
        className={`notice-icon ${
          warning ? "warning" : ""
        }`}
      >
        {icon}
      </div>

      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  text,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        ▣
      </div>

      <strong>{title}</strong>

      <p>{text}</p>
    </div>
  );
}

function LoadingInline({ text }) {
  return (
    <div className="loading-inline">
      <div className="small-spinner"></div>
      {text}
    </div>
  );
}

function TransactionList({
  transactions,
  formatMoney,
  formatDate,
}) {
  return (
    <div className="transaction-list">
      {transactions.map(
        (transaction) => (
          <div
            className="transaction"
            key={transaction.id}
          >
            <div className="transaction-icon">
              {Number(
                transaction.amount
              ) >= 0
                ? "↓"
                : "↑"}
            </div>

            <div className="transaction-main">
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

            <strong
              className={
                Number(
                  transaction.amount
                ) >= 0
                  ? "amount-positive"
                  : "amount-negative"
              }
            >
              {Number(
                transaction.amount
              ) >= 0
                ? "+"
                : "-"}
              $
              {formatMoney(
                Math.abs(
                  Number(
                    transaction.amount
                  )
                )
              )}
            </strong>
          </div>
        )
      )}
    </div>
  );
}

function StatusBadge({
  status,
}) {
  const normalized =
    String(
      status || "pending"
    ).toLowerCase();

  return (
    <span
      className={`status-pill ${normalized}`}
    >
      {status || "Pending"}
    </span>
  );
}

function WithdrawalPage({
  account,
  form,
  updateField,
  submit,
  loading,
  status,
  requests,
  withdrawalLoading,
  formatMoney,
  formatDate,
}) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">
            WITHDRAWAL REQUEST
          </span>

          <h2>
            Request a Withdrawal
          </h2>

          <p>
            Submit a withdrawal request for
            bank review. Your balance is not
            changed until the request is
            approved and processed.
          </p>
        </div>
      </div>

      <div className="security-banner">
        <span>✓</span>

        <div>
          <strong>
            Secure withdrawal request
          </strong>

          <p>
            Requests are reviewed before
            funds are released.
          </p>
        </div>
      </div>

      <form onSubmit={submit}>
        <div className="form-grid">
          <label className="field">
            Withdrawal Method

            <select
              className="input"
              value="cash"
              disabled
            >
              <option value="cash">
                Cash Withdrawal
              </option>
            </select>
          </label>

          <label className="field">
            Amount

            <input
              className="input"
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(event) =>
                updateField(
                  "amount",
                  event.target.value
                )
              }
              placeholder="0.00"
              required
            />

            <small>
              Available balance: $
              {formatMoney(
                account?.balance
              )}
            </small>
          </label>
        </div>

        <label className="field">
          Notes / Withdrawal Reason

          <textarea
            className="textarea"
            rows={4}
            value={
              form.description
            }
            onChange={(event) =>
              updateField(
                "description",
                event.target.value
              )
            }
            placeholder="Optional notes for the bank"
          />
        </label>

        {status && (
          <div
            className={
              status
                .toLowerCase()
                .includes(
                  "successfully"
                ) ||
              status
                .toLowerCase()
                .includes("pending")
                ? "success-message"
                : "error-message"
            }
          >
            {status}
          </div>
        )}

        <button
          className="primary-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : "Submit Withdrawal Request"}
        </button>
      </form>

      <div className="request-history">
        <div className="panel-heading compact">
          <div>
            <span className="eyebrow">
              REQUEST HISTORY
            </span>

            <h3>
              Recent Withdrawal Requests
            </h3>
          </div>
        </div>

        {withdrawalLoading ? (
          <LoadingInline text="Loading withdrawal requests..." />
        ) : requests.length === 0 ? (
          <EmptyState
            title="No Withdrawal Requests"
            text="Your withdrawal requests will appear here."
          />
        ) : (
          requests.map(
            (request) => (
              <div
                className="history-row"
                key={request.id}
              >
                <div>
                  <strong>
                    $
                    {formatMoney(
                      request.amount
                    )}
                  </strong>

                  <small>
                    {formatDate(
                      request.created_at
                    )}
                  </small>
                </div>

                <StatusBadge
                  status={
                    request.status
                  }
                />
              </div>
            )
          )
        )}
      </div>
    </section>
  );
}

function TransferPage({
  type,
  form,
  updateField,
  submit,
  loading,
  status,
  account,
  formatMoney,
}) {
  const isWire = type === "wire";
  const isLocal = type === "local";

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">
            {isWire
              ? "INTERNATIONAL TRANSFER"
              : isLocal
              ? "LOCAL TRANSFER"
              : "BANK TRANSFER"}
          </span>

          <h2>
            {isWire
              ? "Wire Transfer"
              : isLocal
              ? "Local Transfer"
              : "Transfer Money"}
          </h2>

          <p>
            Enter the recipient bank
            information. A verification code
            will be sent to your registered
            email before the transfer is
            submitted.
          </p>
        </div>
      </div>

      <div className="security-banner">
        <span>✉</span>

        <div>
          <strong>
            Email verification required
          </strong>

          <p>
            Your transfer cannot be submitted
            until the verification code is
            confirmed.
          </p>
        </div>
      </div>

      <form onSubmit={submit}>
        <div className="form-grid">
          <label className="field">
            Recipient Full Name

            <input
              className="input"
              value={
                form.recipientName
              }
              onChange={(event) =>
                updateField(
                  "recipientName",
                  event.target.value
                )
              }
              placeholder="Full name of recipient"
              required
            />
          </label>

          <label className="field">
            Bank Name

            <input
              className="input"
              value={form.bankName}
              onChange={(event) =>
                updateField(
                  "bankName",
                  event.target.value
                )
              }
              placeholder="Recipient's bank"
              required
            />
          </label>
        </div>

        <div className="form-grid">
          <label className="field">
            Bank Country

            <input
              className="input"
              value={
                form.bankCountry
              }
              maxLength={2}
              onChange={(event) =>
                updateField(
                  "bankCountry",
                  event.target.value
                    .toUpperCase()
                    .slice(0, 2)
                )
              }
              placeholder="US"
              required
            />

            <small>
              Use a 2-letter country code.
            </small>
          </label>

          <label className="field">
            Transfer Currency

            <input
              className="input"
              value={
                form.transferCurrency
              }
              maxLength={3}
              onChange={(event) =>
                updateField(
                  "transferCurrency",
                  event.target.value
                    .toUpperCase()
                    .slice(0, 3)
                )
              }
              placeholder="USD"
              required
            />

            <small>
              Example: USD, NGN, TRY.
            </small>
          </label>
        </div>

        <div className="form-grid">
          <label className="field">
            Recipient Type

            <select
              className="input"
              value={
                form.beneficiaryType
              }
              onChange={(event) =>
                updateField(
                  "beneficiaryType",
                  event.target.value
                )
              }
            >
              <option value="PERSONAL">
                Individual
              </option>

              <option value="COMPANY">
                Business
              </option>
            </select>
          </label>

          <label className="field">
            Bank Account Name

            <input
              className="input"
              value={
                form.accountName
              }
              onChange={(event) =>
                updateField(
                  "accountName",
                  event.target.value
                )
              }
              placeholder="Name on bank account"
              required
            />
          </label>
        </div>

        <label className="field">
          Account Number / IBAN

          <input
            className="input"
            value={
              form.recipientAccountNumber
            }
            onChange={(event) =>
              updateField(
                "recipientAccountNumber",
                event.target.value
              )
            }
            placeholder="Account number or IBAN"
            autoComplete="off"
            required
          />
        </label>

        <div className="form-grid">
          <label className="field">
            SWIFT / BIC

            <input
              className="input"
              value={form.swiftBic}
              onChange={(event) =>
                updateField(
                  "swiftBic",
                  event.target.value
                    .toUpperCase()
                )
              }
              placeholder={
                isWire
                  ? "Required for many international wires"
                  : "Optional where applicable"
              }
            />
          </label>

          <label className="field">
            Routing Type

            <select
              className="input"
              value={
                form.routingType
              }
              onChange={(event) =>
                updateField(
                  "routingType",
                  event.target.value
                )
              }
            >
              <option value="aba">
                ABA / Routing
              </option>

              <option value="sort_code">
                Sort Code
              </option>

              <option value="bsb">
                BSB
              </option>

              <option value="ifsc">
                IFSC
              </option>

              <option value="branch_code">
                Branch Code
              </option>
            </select>
          </label>
        </div>

        <label className="field">
          Routing Value

          <input
            className="input"
            value={
              form.routingValue
            }
            onChange={(event) =>
              updateField(
                "routingValue",
                event.target.value
              )
            }
            placeholder="Routing / clearing code"
          />
        </label>

        <div className="form-grid">
          <label className="field">
            City

            <input
              className="input"
              value={form.city}
              onChange={(event) =>
                updateField(
                  "city",
                  event.target.value
                )
              }
              placeholder="Recipient city"
            />
          </label>

          <label className="field">
            State / Province

            <input
              className="input"
              value={form.state}
              onChange={(event) =>
                updateField(
                  "state",
                  event.target.value
                )
              }
              placeholder="State or province"
            />
          </label>
        </div>

        <div className="form-grid">
          <label className="field">
            Street Address

            <input
              className="input"
              value={
                form.streetAddress
              }
              onChange={(event) =>
                updateField(
                  "streetAddress",
                  event.target.value
                )
              }
              placeholder="Recipient address"
            />
          </label>

          <label className="field">
            Postal Code

            <input
              className="input"
              value={
                form.postalCode
              }
              onChange={(event) =>
                updateField(
                  "postalCode",
                  event.target.value
                )
              }
              placeholder="Postal code"
            />
          </label>
        </div>

        <div className="form-grid">
          <label className="field">
            Amount

            <input
              className="input amount-input"
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(event) =>
                updateField(
                  "amount",
                  event.target.value
                )
              }
              placeholder="0.00"
              required
            />

            <small>
              Available balance: $
              {formatMoney(
                account?.balance
              )}
            </small>
          </label>

          <label className="field">
            Transfer Method

            <select
              className="input"
              value={
                isWire
                  ? "SWIFT"
                  : isLocal
                  ? "LOCAL"
                  : form.transferMethod
              }
              disabled={
                isWire || isLocal
              }
              onChange={(event) =>
                updateField(
                  "transferMethod",
                  event.target.value
                )
              }
            >
              <option value="LOCAL">
                Local
              </option>

              <option value="SWIFT">
                SWIFT / International
              </option>
            </select>
          </label>
        </div>

        <label className="field">
          Transfer Description

          <textarea
            className="textarea"
            rows={4}
            value={
              form.description
            }
            onChange={(event) =>
              updateField(
                "description",
                event.target.value
              )
            }
            placeholder="What is this transfer for?"
          />
        </label>

        {status && (
          <div className="error-message">
            {status}
          </div>
        )}

        <button
          className="primary-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Starting Verification..."
            : "Continue to Email Verification"}
        </button>
      </form>
    </section>
  );
}

function ReceiptRow({
  label,
  value,
}) {
  return (
    <div className="receipt-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function maskSensitiveAccount(value) {
  if (!value) return "—";

  const stringValue =
    String(value);

  if (stringValue.length <= 4) {
    return `•••• ${stringValue}`;
  }

  return `•••• ${stringValue.slice(
    -4
  )}`;
}

const styles = `
* {
  box-sizing: border-box;
}

:root {
  --navy: #071a35;
  --navy-2: #0b2345;
  --blue: #155eef;
  --blue-dark: #1049bd;
  --blue-soft: #edf4ff;
  --gold: #d9ad4d;
  --green: #138a55;
  --green-soft: #eaf8f1;
  --red: #c93636;
  --red-soft: #fff0f0;
  --orange: #c77712;
  --orange-soft: #fff6e7;
  --text: #152238;
  --muted: #68778e;
  --border: #e4e9f1;
  --surface: #ffffff;
  --background: #f5f7fb;
  --shadow: 0 18px 55px rgba(10, 34, 68, 0.08);
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--background);
  color: var(--text);
}

body {
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
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.app-shell {
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 80% 0%,
      rgba(21, 94, 239, 0.08),
      transparent 28%
    ),
    var(--background);
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: 78px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5%;
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(18px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 13px;
}

.brand-mark {
  width: 43px;
  height: 43px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: white;
  font-size: 21px;
  font-weight: 900;
  background:
    linear-gradient(
      145deg,
      var(--blue),
      var(--navy)
    );
  box-shadow:
    0 10px 25px rgba(21, 94, 239, 0.25);
}

.brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.brand-copy strong {
  color: var(--navy);
  font-size: 14px;
  letter-spacing: 0.08em;
}

.brand-copy span {
  color: var(--navy);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.brand-copy small {
  color: var(--muted);
  margin-top: 4px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.13em;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.online-status {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--green);
  font-size: 13px;
  font-weight: 700;
}

.online-status i,
.active-badge i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22ad6e;
  display: inline-block;
  box-shadow: 0 0 0 4px rgba(34, 173, 110, 0.1);
}

.menu-button {
  width: 44px;
  height: 44px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.menu-button span {
  width: 18px;
  height: 2px;
  border-radius: 2px;
  background: var(--navy);
  transition: 0.2s;
}

.menu-button.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.menu-button.open span:nth-child(2) {
  opacity: 0;
}

.menu-button.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.signout-button,
.danger-button {
  border: 0;
  border-radius: 10px;
  padding: 11px 17px;
  font-weight: 800;
  color: white;
  background: var(--red);
}

.side-menu {
  position: absolute;
  right: 5%;
  top: 70px;
  width: 330px;
  max-height: calc(100vh - 90px);
  overflow-y: auto;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: white;
  box-shadow: 0 25px 70px rgba(10, 28, 55, 0.18);
}

.menu-head {
  display: flex;
  justify-content: space-between;
  padding: 14px 12px 18px;
  border-bottom: 1px solid var(--border);
}

.menu-head div {
  display: flex;
  flex-direction: column;
}

.menu-head strong {
  color: var(--navy);
}

.menu-head span {
  color: var(--muted);
  margin-top: 3px;
  font-size: 12px;
}

.menu-head button {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 8px;
  background: #f2f5f9;
  font-size: 22px;
}

.menu-group {
  padding: 14px 0 4px;
}

.menu-label {
  padding: 0 12px 7px;
  color: #8995a8;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 0;
  border-radius: 11px;
  padding: 12px;
  background: transparent;
  color: var(--text);
  text-align: left;
  font-weight: 650;
}

.menu-item:hover {
  color: var(--blue);
  background: var(--blue-soft);
}

.menu-item-icon {
  width: 29px;
  height: 29px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: var(--blue);
  background: var(--blue-soft);
  font-weight: 900;
}

.menu-signout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding: 14px 12px;
  border: 0;
  border-top: 1px solid var(--border);
  background: transparent;
  color: var(--red);
  text-align: left;
  font-weight: 800;
}

.page-container {
  width: min(1180px, 90%);
  margin: 0 auto;
  padding: 46px 0 70px;
}

.hero-row {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 30px;
  margin-bottom: 25px;
}

.eyebrow {
  display: block;
  color: var(--blue);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.hero-row h1 {
  margin: 7px 0 7px;
  color: var(--navy);
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1.05;
  letter-spacing: -0.035em;
}

.hero-row p {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
}

.hero-security {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: white;
  box-shadow: var(--shadow);
}

.secure-dot {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--green);
  background: var(--green-soft);
  font-weight: 900;
}

.hero-security div {
  display: flex;
  flex-direction: column;
}

.hero-security strong {
  color: var(--navy);
  font-size: 13px;
}

.hero-security small {
  margin-top: 2px;
  color: var(--muted);
  font-size: 11px;
}

.balance-card {
  position: relative;
  overflow: hidden;
  padding: 32px;
  min-height: 245px;
  border-radius: 25px;
  color: white;
  background:
    linear-gradient(
      135deg,
      #061a35 0%,
      #0c2b57 55%,
      #155eef 130%
    );
  box-shadow:
    0 25px 60px rgba(7, 26, 53, 0.2);
}

.balance-card-glow {
  position: absolute;
  right: -80px;
  top: -100px;
  width: 330px;
  height: 330px;
  border-radius: 50%;
  background: rgba(255,255,255,0.07);
}

.balance-top,
.balance-bottom {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.balance-top span:first-child {
  color: rgba(255,255,255,0.68);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.active-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 11px;
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  font-size: 11px;
  font-weight: 800;
}

.active-badge i {
  background: #54db99;
}

.balance-amount {
  position: relative;
  margin-top: 18px;
  font-size: clamp(36px, 6vw, 58px);
  line-height: 1;
  font-weight: 850;
  letter-spacing: -0.04em;
}

.balance-bottom {
  position: absolute;
  left: 32px;
  right: 32px;
  bottom: 27px;
  color: rgba(255,255,255,0.65);
  font-size: 12px;
}

.balance-bottom button {
  border: 0;
  color: white;
  background: transparent;
  font-weight: 800;
}

.section-block {
  margin-top: 34px;
}

.section-heading,
.panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  margin-bottom: 17px;
}

.section-heading h2,
.panel-heading h2,
.page-title h1 {
  margin: 5px 0 0;
  color: var(--navy);
  letter-spacing: -0.025em;
}

.section-heading h2,
.panel-heading h2 {
  font-size: 21px;
}

.panel-heading p {
  max-width: 720px;
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.65;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 13px;
}

.action-card {
  position: relative;
  min-height: 168px;
  padding: 19px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  border: 1px solid var(--border);
  border-radius: 17px;
  background: white;
  box-shadow: 0 8px 28px rgba(10, 30, 60, 0.04);
  transition: 0.2s ease;
}

.action-card:hover {
  transform: translateY(-4px);
  border-color: #cddcff;
  box-shadow: 0 18px 38px rgba(10, 30, 60, 0.1);
}

.action-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  margin-bottom: 21px;
  border-radius: 12px;
  color: var(--blue);
  background: var(--blue-soft);
  font-size: 21px;
  font-weight: 900;
}

.action-card strong {
  color: var(--navy);
  font-size: 14px;
}

.action-card small {
  max-width: 150px;
  margin-top: 7px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.45;
}

.action-arrow {
  position: absolute;
  right: 16px;
  bottom: 17px;
  color: #aab6c8;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-top: 22px;
}

.panel {
  padding: 27px;
  margin-top: 18px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.dashboard-grid .panel {
  margin-top: 0;
}

.panel-heading.compact {
  margin-bottom: 10px;
}

.panel-heading.compact h3 {
  margin: 5px 0 0;
  color: var(--navy);
}

.link-button {
  border: 0;
  padding: 0;
  color: var(--blue);
  background: transparent;
  font-size: 12px;
  font-weight: 800;
}

.info-row {
  min-height: 57px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 25px;
  border-bottom: 1px solid #edf0f5;
}

.info-row:last-child {
  border-bottom: 0;
}

.info-row > span {
  color: var(--muted);
  font-size: 13px;
}

.info-row strong {
  color: var(--navy);
  font-size: 13px;
  text-align: right;
}

.success-text {
  color: var(--green) !important;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 14px 0;
  border-bottom: 1px solid #edf0f5;
}

.notice-item:last-child {
  border-bottom: 0;
}

.notice-icon {
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: var(--green);
  background: var(--green-soft);
  font-weight: 900;
}

.notice-icon.warning {
  color: var(--orange);
  background: var(--orange-soft);
}

.notice-item strong {
  color: var(--navy);
  font-size: 13px;
}

.notice-item p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.5;
}

.transaction-list {
  overflow: hidden;
}

.transaction {
  min-height: 70px;
  display: flex;
  align-items: center;
  gap: 13px;
  border-bottom: 1px solid #edf0f5;
}

.transaction:last-child {
  border-bottom: 0;
}

.transaction-icon {
  width: 37px;
  height: 37px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 11px;
  color: var(--blue);
  background: var(--blue-soft);
  font-weight: 900;
}

.transaction-main {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.transaction-main strong {
  overflow: hidden;
  color: var(--navy);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-main small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 11px;
}

.transaction > strong {
  font-size: 13px;
}

.amount-positive {
  color: var(--green);
}

.amount-negative {
  color: var(--red);
}

.news-banner {
  margin-top: 18px;
  padding: 25px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  border-radius: 20px;
  color: white;
  background:
    linear-gradient(
      135deg,
      var(--navy),
      #124183
    );
  box-shadow: var(--shadow);
}

.news-banner .eyebrow {
  color: #9ec0ff;
}

.news-banner h2 {
  margin: 5px 0;
  font-size: 21px;
}

.news-banner p {
  margin: 0;
  max-width: 650px;
  color: rgba(255,255,255,0.7);
  font-size: 13px;
  line-height: 1.6;
}

.primary-button,
.secondary-button,
.danger-button {
  min-height: 45px;
  border: 0;
  border-radius: 11px;
  padding: 0 18px;
  font-weight: 800;
  transition: 0.2s;
}

.primary-button {
  color: white;
  background: linear-gradient(
    135deg,
    var(--blue),
    var(--blue-dark)
  );
  box-shadow:
    0 9px 22px rgba(21, 94, 239, 0.2);
}

.primary-button:hover {
  transform: translateY(-1px);
}

.primary-button.full {
  width: 100%;
}

.secondary-button {
  color: var(--navy);
  background: white;
  border: 1px solid var(--border);
}

.content-page {
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-title {
  margin-bottom: 26px;
}

.page-title h1 {
  font-size: clamp(29px, 4vw, 39px);
}

.bank-card {
  position: relative;
  overflow: hidden;
  max-width: 600px;
  min-height: 330px;
  margin: 20px 0 28px;
  padding: 28px;
  border-radius: 24px;
  color: white;
  background:
    linear-gradient(
      135deg,
      #06182f,
      #0d376e 60%,
      #185fee
    );
  box-shadow:
    0 25px 55px rgba(7, 26, 53, 0.25);
}

.bank-card-shine {
  position: absolute;
  width: 270px;
  height: 270px;
  right: -80px;
  top: -80px;
  border-radius: 50%;
  background: rgba(255,255,255,0.07);
}

.bank-card-top {
  position: relative;
  display: flex;
  justify-content: space-between;
  letter-spacing: 0.1em;
  font-size: 12px;
}

.bank-card-top span {
  opacity: 0.7;
}

.chip {
  position: relative;
  width: 49px;
  height: 39px;
  margin-top: 45px;
  border-radius: 8px;
  background:
    linear-gradient(
      135deg,
      #d8bd73,
      #9b7c37
    );
}

.chip span {
  position: absolute;
  border: 1px solid rgba(40, 30, 10, 0.35);
}

.chip span:nth-child(1) {
  left: 50%;
  top: 0;
  bottom: 0;
  border-width: 0 1px;
}

.chip span:nth-child(2) {
  left: 0;
  right: 0;
  top: 50%;
  border-width: 1px 0 0;
}

.chip span:nth-child(3) {
  left: 10px;
  right: 10px;
  top: 10px;
  bottom: 10px;
  border-radius: 4px;
}

.chip span:nth-child(4) {
  left: 25%;
  right: 25%;
  top: 0;
  bottom: 0;
  border-width: 0 1px;
}

.card-number {
  position: relative;
  margin-top: 36px;
  font-size: clamp(20px, 4vw, 29px);
  letter-spacing: 0.13em;
}

.card-details {
  position: absolute;
  left: 28px;
  right: 28px;
  bottom: 28px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.card-details div {
  display: flex;
  flex-direction: column;
}

.card-details small {
  color: rgba(255,255,255,0.55);
  font-size: 8px;
  letter-spacing: 0.14em;
}

.card-details strong {
  margin-top: 5px;
  font-size: 11px;
  letter-spacing: 0.05em;
}

.card-request-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: #f9fbfe;
}

.card-request-box h3 {
  margin: 5px 0;
  color: var(--navy);
}

.card-request-box p {
  margin: 0;
  max-width: 650px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}

.request-history {
  margin-top: 30px;
}

.request-history h3 {
  color: var(--navy);
}

.history-row {
  min-height: 67px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid #edf0f5;
}

.history-row:last-child {
  border-bottom: 0;
}

.history-row > div {
  display: flex;
  flex-direction: column;
}

.history-row strong {
  color: var(--navy);
  font-size: 13px;
}

.history-row small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 11px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: #eef2f7;
  color: var(--muted);
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
}

.status-pill.pending {
  color: var(--orange);
  background: var(--orange-soft);
}

.status-pill.approved,
.status-pill.active,
.status-pill.completed {
  color: var(--green);
  background: var(--green-soft);
}

.status-pill.rejected {
  color: var(--red);
  background: var(--red-soft);
}

.profile-top {
  display: flex;
  align-items: center;
  gap: 18px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--border);
}

.profile-avatar,
.profile-avatar-image {
  width: 88px;
  height: 88px;
  border-radius: 50%;
}

.profile-avatar {
  display: grid;
  place-items: center;
  color: white;
  background:
    linear-gradient(
      135deg,
      var(--blue),
      var(--navy)
    );
  font-size: 32px;
  font-weight: 900;
}

.profile-avatar-image {
  object-fit: cover;
}

.profile-top h2 {
  margin: 0;
  color: var(--navy);
}

.profile-top p {
  margin: 5px 0 12px;
  color: var(--muted);
  font-size: 13px;
}

.upload-button {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 13px;
  border-radius: 9px;
  color: var(--blue);
  background: var(--blue-soft);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.profile-group {
  margin-top: 28px;
}

.profile-group h3 {
  margin: 0 0 4px;
  color: var(--navy);
  font-size: 15px;
}

.account-value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.eye-button {
  width: 29px;
  height: 29px;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--blue);
  background: white;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field {
  display: block;
  margin-bottom: 18px;
  color: var(--navy);
  font-size: 12px;
  font-weight: 800;
}

.field small {
  display: block;
  margin-top: 6px;
  color: var(--muted);
  font-size: 10px;
  font-weight: 500;
}

.input,
.textarea {
  width: 100%;
  margin-top: 8px;
  border: 1px solid #dbe2ec;
  border-radius: 11px;
  padding: 12px 13px;
  color: var(--text);
  background: white;
  outline: none;
  transition: 0.2s;
}

.input {
  min-height: 45px;
}

.textarea {
  resize: vertical;
  line-height: 1.5;
}

.input:focus,
.textarea:focus {
  border-color: var(--blue);
  box-shadow:
    0 0 0 3px rgba(21,94,239,0.09);
}

.security-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
  padding: 14px;
  border: 1px solid #dce8ff;
  border-radius: 13px;
  background: #f4f8ff;
}

.security-banner > span {
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 9px;
  color: var(--blue);
  background: white;
  font-weight: 900;
}

.security-banner strong {
  color: var(--navy);
  font-size: 12px;
}

.security-banner p {
  margin: 3px 0 0;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.5;
}

.success-message,
.error-message {
  margin: 14px 0;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.5;
}

.success-message {
  color: var(--green);
  background: var(--green-soft);
  border: 1px solid #c9eddc;
}

.error-message {
  color: var(--red);
  background: var(--red-soft);
  border: 1px solid #f3cccc;
}

.empty-state {
  padding: 42px 20px;
  text-align: center;
  border: 1px dashed #dce3ec;
  border-radius: 15px;
  background: #fafbfd;
}

.empty-state-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  margin: 0 auto 12px;
  border-radius: 14px;
  color: var(--blue);
  background: var(--blue-soft);
  font-size: 21px;
}

.empty-state strong {
  color: var(--navy);
}

.empty-state p {
  max-width: 500px;
  margin: 7px auto 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}

.loading-inline {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--muted);
  font-size: 12px;
}

.small-spinner,
.spinner {
  border: 3px solid #dfe7f2;
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.small-spinner {
  width: 18px;
  height: 18px;
}

.spinner {
  width: 34px;
  height: 34px;
  margin: 20px auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.support-header,
.security-item,
.settings-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px 0;
  border-bottom: 1px solid var(--border);
}

.support-header {
  margin-bottom: 25px;
}

.support-icon,
.security-icon {
  width: 45px;
  height: 45px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 13px;
  color: var(--blue);
  background: var(--blue-soft);
  font-size: 19px;
  font-weight: 900;
}

.support-header h2,
.security-item h3,
.settings-item h3 {
  margin: 0;
  color: var(--navy);
}

.support-header p,
.security-item p,
.settings-item p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.5;
}

.warning-security .security-icon {
  color: var(--orange);
  background: var(--orange-soft);
}

.settings-item {
  justify-content: space-between;
}

.settings-item:last-child {
  border-bottom: 0;
}

.loading-screen {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 30px;
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(21,94,239,0.12),
      transparent 35%
    ),
    #f5f7fb;
}

.loading-box {
  width: min(430px, 100%);
  padding: 45px 35px;
  text-align: center;
  border: 1px solid var(--border);
  border-radius: 24px;
  background: white;
  box-shadow: var(--shadow);
}

.loading-mark {
  width: 62px;
  height: 62px;
  display: grid;
  place-items: center;
  margin: 0 auto;
  border-radius: 18px;
  color: white;
  background:
    linear-gradient(
      135deg,
      var(--blue),
      var(--navy)
    );
  font-size: 28px;
  font-weight: 900;
}

.loading-box h2 {
  color: var(--navy);
  font-size: 18px;
}

.loading-box p {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.6;
}

.approval-card {
  max-width: 700px;
  margin: 50px auto;
  padding: 55px 45px;
  text-align: center;
  border: 1px solid var(--border);
  border-radius: 25px;
  background: white;
  box-shadow: var(--shadow);
}

.approval-icon {
  width: 70px;
  height: 70px;
  display: grid;
  place-items: center;
  margin: 25px auto;
  border-radius: 50%;
  color: var(--blue);
  background: var(--blue-soft);
  font-size: 29px;
}

.approval-card h1 {
  color: var(--navy);
}

.approval-card h2 {
  color: var(--navy);
  font-size: 20px;
}

.approval-card p {
  max-width: 540px;
  margin: 0 auto 25px;
  color: var(--muted);
  line-height: 1.7;
}

.modal-overlay,
.chat-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(3, 15, 31, 0.62);
  backdrop-filter: blur(7px);
}

.modal-card {
  position: relative;
  width: min(480px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  padding: 34px;
  border-radius: 22px;
  background: white;
  box-shadow: 0 30px 100px rgba(0,0,0,0.25);
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 9px;
  color: var(--muted);
  background: #f3f5f8;
  font-size: 22px;
}

.modal-icon,
.receipt-success {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  margin-bottom: 17px;
  border-radius: 15px;
  color: var(--blue);
  background: var(--blue-soft);
  font-size: 22px;
}

.receipt-success {
  color: var(--green);
  background: var(--green-soft);
}

.modal-card h2 {
  margin: 5px 0 8px;
  color: var(--navy);
}

.modal-card > p {
  margin: 0 0 20px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.6;
}

.otp-input {
  width: 100%;
  margin-top: 8px;
  padding: 14px;
  border: 1px solid #dbe2ec;
  border-radius: 12px;
  outline: none;
  text-align: center;
  font-size: 27px;
  font-weight: 800;
  letter-spacing: 0.35em;
}

.otp-input:focus {
  border-color: var(--blue);
  box-shadow:
    0 0 0 3px rgba(21,94,239,0.1);
}

.modal-link {
  display: block;
  margin: 17px auto 0;
  border: 0;
  color: var(--blue);
  background: transparent;
  font-size: 12px;
  font-weight: 800;
}

.security-note {
  margin-top: 18px;
  padding: 11px;
  border-radius: 9px;
  color: var(--orange);
  background: var(--orange-soft);
  font-size: 10px;
  text-align: center;
}

.receipt {
  margin: 20px 0;
  padding: 10px 15px;
  border: 1px solid var(--border);
  border-radius: 13px;
  background: #fafbfd;
}

.receipt-row {
  min-height: 47px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid #edf0f5;
}

.receipt-row:last-child {
  border-bottom: 0;
}

.receipt-row span {
  color: var(--muted);
  font-size: 11px;
}

.receipt-row strong {
  color: var(--navy);
  font-size: 11px;
  text-align: right;
}

.chat-overlay {
  place-items: end end;
  padding: 25px;
}

.chat-window {
  width: min(410px, calc(100vw - 30px));
  height: min(650px, calc(100vh - 50px));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 20px;
  background: white;
  box-shadow: 0 30px 100px rgba(0,0,0,0.25);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  padding: 17px 18px;
  color: white;
  background: var(--navy);
}

.chat-header div {
  display: flex;
  flex-direction: column;
}

.chat-header strong {
  font-size: 13px;
}

.chat-header small {
  margin-top: 4px;
  color: rgba(255,255,255,0.55);
  font-size: 9px;
}

.chat-header button {
  width: 31px;
  height: 31px;
  border: 0;
  border-radius: 8px;
  color: white;
  background: rgba(255,255,255,0.1);
  font-size: 20px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 18px;
  background: #f5f7fb;
}

.chat-message {
  max-width: 82%;
  margin-bottom: 10px;
  padding: 10px 12px;
  border-radius: 13px;
  font-size: 12px;
  line-height: 1.5;
}

.chat-message small {
  display: block;
  margin-top: 5px;
  opacity: 0.55;
  font-size: 8px;
}

.support-message {
  margin-right: auto;
  background: white;
  border: 1px solid var(--border);
}

.customer-message {
  margin-left: auto;
  color: white;
  background: var(--blue);
}

.chat-input {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid var(--border);
}

.chat-input input {
  min-width: 0;
  flex: 1;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 11px;
  outline: none;
}

.chat-input button {
  border: 0;
  border-radius: 10px;
  padding: 0 14px;
  color: white;
  background: var(--blue);
  font-weight: 800;
}

.floating-support {
  position: fixed;
  right: 25px;
  bottom: 25px;
  z-index: 90;
  width: 52px;
  height: 52px;
  border: 0;
  border-radius: 50%;
  color: white;
  background:
    linear-gradient(
      135deg,
      var(--blue),
      var(--navy)
    );
  box-shadow:
    0 15px 35px rgba(21,94,239,0.3);
  font-size: 21px;
  font-weight: 900;
}

.portal-footer {
  width: min(1180px, 90%);
  margin: 0 auto;
  padding: 25px 0 40px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  color: var(--muted);
  font-size: 10px;
}

.portal-footer div {
  display: flex;
  flex-direction: column;
}

.portal-footer strong {
  color: var(--navy);
  font-size: 11px;
}

.portal-footer span {
  margin-top: 3px;
}

@media (max-width: 1050px) {
  .action-grid {
    grid-template-columns:
      repeat(3, 1fr);
  }
}

@media (max-width: 780px) {
  .topbar {
    padding: 0 4%;
  }

  .online-status {
    display: none;
  }

  .page-container {
    width: 92%;
    padding-top: 32px;
  }

  .hero-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-security {
    width: 100%;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .action-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .news-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .card-request-box,
  .settings-item {
    align-items: flex-start;
    flex-direction: column;
  }

  .side-menu {
    right: 3%;
    left: 3%;
    width: auto;
  }

  .portal-footer {
    flex-direction: column;
  }
}

@media (max-width: 520px) {
  .brand-copy small {
    display: none;
  }

  .brand-copy strong {
    font-size: 12px;
  }

  .brand-copy span {
    font-size: 10px;
  }

  .brand-mark {
    width: 38px;
    height: 38px;
  }

  .page-container {
    width: 94%;
  }

  .balance-card {
    min-height: 220px;
    padding: 23px;
  }

  .balance-bottom {
    left: 23px;
    right: 23px;
    bottom: 22px;
  }

  .action-grid {
    grid-template-columns: 1fr;
  }

  .action-card {
    min-height: 125px;
  }

  .action-icon {
    margin-bottom: 13px;
  }

  .panel {
    padding: 20px;
    border-radius: 16px;
  }

  .hero-row h1 {
    font-size: 32px;
  }

  .info-row {
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    padding: 13px 0;
  }

  .info-row strong {
    text-align: left;
  }

  .profile-top {
    align-items: flex-start;
    flex-direction: column;
  }

  .bank-card {
    min-height: 275px;
    padding: 21px;
  }

  .chip {
    margin-top: 28px;
  }

  .card-number {
    margin-top: 25px;
    font-size: 17px;
  }

  .card-details {
    left: 21px;
    right: 21px;
    bottom: 21px;
  }

  .card-details strong {
    font-size: 9px;
  }

  .modal-card {
    padding: 27px 20px;
  }

  .chat-overlay {
    padding: 10px;
  }

  .chat-window {
    width: calc(100vw - 20px);
    height: calc(100vh - 20px);
  }

  .floating-support {
    right: 17px;
    bottom: 17px;
  }
}
`;
