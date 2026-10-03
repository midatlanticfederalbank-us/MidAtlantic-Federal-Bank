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

  // Customer transfer + email OTP
  const [transferOtpOpen, setTransferOtpOpen] = useState(false);
  const [transferOtp, setTransferOtp] = useState("");
  const [transferId, setTransferId] = useState("");
  const [transferPageType, setTransferPageType] = useState("transfer");
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
        approval_status,
        avatar_path
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

    await loadCardData(user.id, accountData?.id);

    setLoading(false);
  }

  async function loadCardData(userId = user?.id, accountId = account?.id) {
    if (!userId) return;

    setCardLoading(true);

    try {
      const { data: cardData, error: cardError } = await supabase
        .from("customer_cards")
        .select(
          "id, card_type, card_network, cardholder_name, last4, expiry_month, expiry_year, status, created_at, activated_at"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!cardError) {
        setCustomerCard(cardData || null);
      }

      const { data: orders, error: ordersError } = await supabase
        .from("customer_card_orders")
        .select(
          "id, card_type, reason, status, created_at, updated_at"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!ordersError) {
        setCardOrders(orders || []);
      }
    } catch (cardError) {
      console.warn(
        "Card information could not be loaded:",
        cardError
      );
    } finally {
      setCardLoading(false);
    }
  }

  async function orderNewCard() {
    if (cardOrderLoading || !user || !account) return;

    setCardOrderLoading(true);
    setCardStatus("");

    try {
      const { error } = await supabase
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

      if (error) throw error;

      setCardStatus(
        "Your card request has been submitted. The bank will review it and update the status here."
      );

      await loadCardData(user.id, account.id);
    } catch (cardError) {
      setCardStatus(
        cardError?.message ||
          "Your card request could not be submitted. Please try again."
      );
    } finally {
      setCardOrderLoading(false);
    }
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
      setPasswordStatus(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmation) {
      setPasswordStatus(
        "The new passwords do not match."
      );
      return;
    }

    setPasswordLoading(true);

    try {
      const {
        data: sessionData,
        error: sessionError,
      } = await supabase.auth.getSession();

      if (
        sessionError ||
        !sessionData?.session?.user
      ) {
        setPasswordStatus(
          "Your session has expired. Please sign in again."
        );

        setPasswordLoading(false);
        return;
      }

      const { error: passwordError } =
        await supabase.auth.updateUser({
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

    setPasswordStatus(
      "Your password has been changed successfully."
    );

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
      const extension = (
        file.name.split(".").pop() || "jpg"
      )
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

      const safeExtension =
        extension || "jpg";

      const path =
        `${user.id}/avatar.${safeExtension}`;

      const {
        error: uploadError,
      } = await supabase
        .storage
        .from("profile-pictures")
        .upload(path, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        error: profileUpdateError,
      } = await supabase
        .rpc("set_profile_avatar_path", {
          p_avatar_path: path,
        });

      if (profileUpdateError) {
        throw profileUpdateError;
      }

      const {
        data: avatarData,
        error: signedUrlError,
      } = await supabase
        .storage
        .from("profile-pictures")
        .createSignedUrl(path, 3600);

      if (
        signedUrlError ||
        !avatarData?.signedUrl
      ) {
        throw (
          signedUrlError ||
          new Error(
            "The profile picture was uploaded, but its preview could not be created."
          )
        );
      }

      setAvatarUrl(
        avatarData.signedUrl
      );

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
    if (
      page !== "profile" &&
      page !== "account"
    ) {
      setShowAccountNumber(false);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function formatMoney(amount) {
    return Number(
      amount || 0
    ).toLocaleString(
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

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
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

  /*
    =====================================================
    TRANSFER / WITHDRAWAL REQUESTS
    =====================================================
  */

  function updateRequestField(
    field,
    value
  ) {
    setRequestForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitRequest(event) {
    event.preventDefault();

    if (
      requestLoading ||
      !user
    ) {
      return;
    }

    setRequestStatus("");

    const amount =
      Number(
        requestForm.amount
      );

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setRequestStatus(
        "Please enter a valid amount."
      );

      return;
    }

    if (
      [
        "transfer",
        "wire",
        "local",
      ].includes(activePage)
    ) {
      await startCustomerTransfer(
        activePage
      );

      return;
    }

    if (
      activePage !== "withdraw" &&
      (
        !requestForm
          .recipientName
          .trim() ||
        !requestForm
          .recipientAccountNumber
          .trim() ||
        !requestForm
          .bankName
          .trim()
      )
    ) {
      setRequestStatus(
        "Please complete the recipient information."
      );

      return;
    }

    setRequestLoading(true);

    try {
      const {
        error,
      } = await supabase
        .from("transfer_requests")
        .insert({
          user_id: user.id,
          request_type:
            activePage,

          recipient_name:
            requestForm
              .recipientName
              .trim() ||
            null,

          recipient_account_number:
            requestForm
              .recipientAccountNumber
              .trim() ||
            null,

          bank_name:
            requestForm
              .bankName
              .trim() ||
            null,

          amount,

          description:
            requestForm
              .description
              .trim() ||
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
  }

  async function invokeCustomerTransfer(
    body
  ) {
    const {
      data,
      error,
    } = await supabase.functions.invoke(
      "customer-transfer",
      {
        body,
      }
    );

    if (error) {
      let message =
        error.message ||
        "Transfer service is unavailable.";

      try {
        const response =
          error.context;

        if (
          response &&
          typeof response.json ===
            "function"
        ) {
          const payload =
            await response.json();

          if (payload?.message) {
            message =
              payload.message;
          }
        }
      } catch (_) {
        // Keep the original error message.
      }

      throw new Error(
        message
      );
    }

    if (!data) {
      throw new Error(
        "The transfer service returned no response."
      );
    }

    if (data.error) {
      throw new Error(
        data.error
      );
    }

    return data;
  }

  async function startCustomerTransfer(
    pageType = "transfer"
  ) {
    if (
      requestLoading ||
      transferOtpLoading ||
      !user
    ) {
      return;
    }

    setRequestStatus("");
    setTransferOtpStatus("");

    const amount =
      Number(
        requestForm.amount
      );

    const recipientName =
      requestForm
        .recipientName
        .trim();

    const recipientAccountNumber =
      requestForm
        .recipientAccountNumber
        .trim();

    const bankCountry =
      requestForm
        .bankCountry
        .trim()
        .toUpperCase();

    const transferCurrency =
      requestForm
        .transferCurrency
        .trim()
        .toUpperCase();

    const accountName =
      (
        requestForm
          .accountName
          .trim() ||
        recipientName
      );

    if (!recipientName) {
      setRequestStatus(
        "Please enter the recipient's full name."
      );

      return;
    }

    if (
      !recipientAccountNumber
    ) {
      setRequestStatus(
        "Please enter the recipient account number or IBAN."
      );

      return;
    }

    if (
      !/^[A-Z]{2}$/.test(
        bankCountry
      )
    ) {
      setRequestStatus(
        "Enter a valid 2-letter bank country code, for example US or NG."
      );

      return;
    }

    if (
      !/^[A-Z]{3}$/.test(
        transferCurrency
      )
    ) {
      setRequestStatus(
        "Enter a valid 3-letter transfer currency, for example USD or NGN."
      );

      return;
    }

    if (
      !Number.isFinite(
        amount
      ) ||
      amount <= 0
    ) {
      setRequestStatus(
        "Please enter a valid transfer amount."
      );

      return;
    }

    if (
      account?.status !==
      "active"
    ) {
      setRequestStatus(
        "Your account is not active and cannot send a transfer."
      );

      return;
    }

    if (
      amount >
      Number(
        account.balance || 0
      )
    ) {
      setRequestStatus(
        "The transfer amount is greater than your available balance."
      );

      return;
    }

    setRequestLoading(true);

    try {
      const data =
        await invokeCustomerTransfer(
          {
            action:
              "send_otp",

            recipientName,
            recipientAccountNumber,

            bankName:
              requestForm
                .bankName
                .trim(),

            bankCountry,
            transferCurrency,

            transferMethod:
              pageType === "wire"
                ? "SWIFT"
                : pageType === "local"
                ? "LOCAL"
                : requestForm
                    .transferMethod,

            beneficiaryType:
              requestForm
                .beneficiaryType,

            accountName,

            routingType:
              requestForm
                .routingType
                .trim(),

            routingValue:
              requestForm
                .routingValue
                .trim(),

            swiftBic:
              requestForm
                .swiftBic
                .trim(),

            streetAddress:
              requestForm
                .streetAddress
                .trim(),

            city:
              requestForm
                .city
                .trim(),

            state:
              requestForm
                .state
                .trim(),

            postalCode:
              requestForm
                .postalCode
                .trim(),

            amount,

            description:
              requestForm
                .description
                .trim() ||
              "Customer Transfer",
          }
        );

      setTransferId(
        data.transferId
      );

      setTransferPageType(
        pageType
      );

      setTransferOtp("");

      setTransferOtpStatus(
        `A 6-digit verification code has been sent to ${
          data.emailMasked ||
          "your registered email address"
        }.`
      );

      setTransferOtpOpen(
        true
      );
    } catch (err) {
      setRequestStatus(
        err?.message ||
          "We could not start the transfer. Please check the bank details and try again."
      );
    } finally {
      setRequestLoading(
        false
      );
    }
  }

  async function verifyCustomerTransfer(
    event
  ) {
    event.preventDefault();

    if (
      transferOtpLoading ||
      !transferId ||
      !transferOtp.trim()
    ) {
      return;
    }

    const code =
      transferOtp.trim();

    if (
      !/^[0-9]{6}$/.test(
        code
      )
    ) {
      setTransferOtpStatus(
        "Enter the 6-digit verification code sent to your email."
      );

      return;
    }

    setTransferOtpLoading(
      true
    );

    setTransferOtpStatus("");

    try {
      const data =
        await invokeCustomerTransfer(
          {
            action:
              "verify_otp",

            transferId,
            otp: code,
          }
        );

      setTransferOtpOpen(
        false
      );

      setTransferOtp("");

      setTransferId("");

      setTransferPageType(
        "transfer"
      );

      resetRequestForm();

      setRequestStatus("");

      setTransferReceipt(
        data.receipt
      );

      setTransferReceiptOpen(
        true
      );
                  <InfoRow
              label="State"
              value={profile?.state}
            />

            <InfoRow
  label="Postal Code"
  value={profile ? profile.postal_code : null}
/>

            <div className="profile-section-title">
              Account Information
            </div>

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
            />

            <div className="profile-section-title">
              Security
            </div>

            <div className="security-action">
              <div>
                <strong>
                  Password
                </strong>

                <p>
                  Update your customer portal password.
                </p>
              </div>

              <button
                className="portal-button secondary-portal-button"
                type="button"
                onClick={() =>
                  setPasswordModalOpen(true)
                }
              >
                Change Password
              </button>
            </div>

          </PortalPage>
        )}

        {/* =================================================
            TRANSACTIONS
        ================================================= */}

        {activePage === "transactions" && (
          <PortalPage
            title="Transactions"
            label="ACCOUNT ACTIVITY"
          >

            <section className="portal-section">

              <div className="section-heading">

                <div>
                  <span className="section-label">
                    ACCOUNT ACTIVITY
                  </span>

                  <h2>
                    Transaction History
                  </h2>
                </div>

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

            </section>

          </PortalPage>
        )}

        {/* =================================================
            WITHDRAW
        ================================================= */}

        {activePage === "withdraw" && (
          <PortalPage
            title="Withdraw"
            label="ACCOUNT SERVICES"
          >

            <section className="service-form-panel">

              <div className="service-form-heading">

                <span className="section-label">
                  WITHDRAWAL REQUEST
                </span>

                <h2>
                  Submit a Withdrawal Request
                </h2>

                <p>
                  Enter the amount you would like
                  to withdraw from your account.
                  Your request will be reviewed
                  by the bank.
                </p>

              </div>

              <form
                onSubmit={submitWithdrawal}
                className="portal-form"
              >

                <div className="form-group">

                  <label>
                    Withdrawal Amount
                  </label>

                  <div className="currency-input">

                    <span>
                      $
                    </span>

                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      value={
                        withdrawalForm.amount
                      }
                      onChange={(event) =>
                        setWithdrawalForm(
                          (current) => ({
                            ...current,
                            amount:
                              event.target.value,
                          })
                        )
                      }
                      required
                    />

                  </div>

                </div>

                <div className="form-group">

                  <label>
                    Withdrawal Method
                  </label>

                  <select
                    value={
                      withdrawalForm.withdrawalMethod
                    }
                    onChange={(event) =>
                      setWithdrawalForm(
                        (current) => ({
                          ...current,
                          withdrawalMethod:
                            event.target.value,
                        })
                      )
                    }
                  >

                    <option value="cash">
                      Cash Withdrawal
                    </option>

                    <option value="atm">
                      ATM Withdrawal
                    </option>

                    <option value="branch">
                      Branch Withdrawal
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Notes
                  </label>

                  <textarea
                    rows="4"
                    placeholder="Optional withdrawal notes"
                    value={
                      withdrawalForm.notes
                    }
                    onChange={(event) =>
                      setWithdrawalForm(
                        (current) => ({
                          ...current,
                          notes:
                            event.target.value,
                        })
                      )
                    }
                  />

                </div>

                {withdrawalStatus && (
                  <div
                    className={`request-notice ${
                      withdrawalStatus
                        .toLowerCase()
                        .includes("success")
                        ? "success-notice"
                        : "error-notice"
                    }`}
                  >
                    <p>
                      {withdrawalStatus}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="portal-button"
                  disabled={
                    withdrawalLoading
                  }
                >
                  {withdrawalLoading
                    ? "Submitting..."
                    : "Submit Withdrawal Request"}
                </button>

              </form>

            </section>

          </PortalPage>
        )}

        {/* =================================================
            TRANSFER
        ================================================= */}

        {activePage === "transfer" && (
          <PortalPage
            title="Transfer"
            label="ACCOUNT SERVICES"
          >

            <section className="service-form-panel">

              <div className="service-form-heading">

                <span className="section-label">
                  BANK TRANSFER
                </span>

                <h2>
                  Submit a Transfer
                </h2>

                <p>
                  Send funds to an eligible
                  external bank account. Email
                  verification is required before
                  the transfer is submitted.
                </p>

              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  startCustomerTransfer();
                }}
                className="portal-form"
              >

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Recipient Name
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.recipientName
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            recipientName:
                              event.target.value,
                          })
                        )
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Recipient Account Number / IBAN
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.recipientAccountNumber
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            recipientAccountNumber:
                              event.target.value,
                          })
                        )
                      }
                      required
                    />

                  </div>

                </div>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Bank Name
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.bankName
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            bankName:
                              event.target.value,
                          })
                        )
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Bank Country
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.bankCountry
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            bankCountry:
                              event.target.value,
                          })
                        )
                      }
                      placeholder="US"
                      required
                    />

                  </div>

                </div>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Currency
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.transferCurrency
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            transferCurrency:
                              event.target.value
                                .toUpperCase(),
                          })
                        )
                      }
                      placeholder="USD"
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Transfer Method
                    </label>

                    <select
                      value={
                        requestForm.transferMethod
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            transferMethod:
                              event.target.value,
                          })
                        )
                      }
                    >

                      <option value="LOCAL">
                        Local
                      </option>

                      <option value="SWIFT">
                        SWIFT
                      </option>

                    </select>

                  </div>

                </div>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Account Name
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.accountName
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            accountName:
                              event.target.value,
                          })
                        )
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Beneficiary Type
                    </label>

                    <select
                      value={
                        requestForm.beneficiaryType
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            beneficiaryType:
                              event.target.value,
                          })
                        )
                      }
                    >

                      <option value="INDIVIDUAL">
                        Individual
                      </option>

                      <option value="BUSINESS">
                        Business
                      </option>

                    </select>

                  </div>

                </div>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Routing Type
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.routingType
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            routingType:
                              event.target.value,
                          })
                        )
                      }
                      placeholder="ABA / SORT_CODE / IBAN"
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Routing Value
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.routingValue
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            routingValue:
                              event.target.value,
                          })
                        )
                      }
                    />

                  </div>

                </div>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      SWIFT / BIC
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.swiftBic
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            swiftBic:
                              event.target.value,
                          })
                        )
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Amount
                    </label>

                    <div className="currency-input">

                      <span>
                        $
                      </span>

                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={
                          requestForm.amount
                        }
                        onChange={(event) =>
                          setRequestForm(
                            (current) => ({
                              ...current,
                              amount:
                                event.target.value,
                            })
                          )
                        }
                        required
                      />

                    </div>

                  </div>

                </div>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Street Address
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.streetAddress
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            streetAddress:
                              event.target.value,
                          })
                        )
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      City
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.city
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            city:
                              event.target.value,
                          })
                        )
                      }
                    />

                  </div>

                </div>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      State / Province
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.state
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            state:
                              event.target.value,
                          })
                        )
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Postal Code
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.postalCode
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            postalCode:
                              event.target.value,
                          })
                        )
                      }
                    />

                  </div>

                </div>

                <div className="form-group">

                  <label>
                    Description
                  </label>

                  <textarea
                    rows="4"
                    value={
                      requestForm.description
                    }
                    onChange={(event) =>
                      setRequestForm(
                        (current) => ({
                          ...current,
                          description:
                            event.target.value,
                        })
                      )
                    }
                    placeholder="Purpose of transfer"
                  />

                </div>

                {transferStatus && (
                  <div
                    className={`request-notice ${
                      transferStatus
                        .toLowerCase()
                        .includes("success")
                        ? "success-notice"
                        : "error-notice"
                    }`}
                  >
                    <p>
                      {transferStatus}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="portal-button"
                  disabled={requestLoading}
                >
                  {requestLoading
                    ? "Processing..."
                    : "Continue to Verification"}
                </button>

              </form>

            </section>

          </PortalPage>
        )}

        {/* =================================================
            WIRE TRANSFER
        ================================================= */}

        {activePage === "wire" && (
          <PortalPage
            title="Wire Transfer"
            label="ACCOUNT SERVICES"
          >

            <section className="service-form-panel">

              <div className="service-form-heading">

                <span className="section-label">
                  INTERNATIONAL TRANSFER
                </span>

                <h2>
                  Wire Transfer
                </h2>

                <p>
                  Enter the recipient's banking
                  information for a SWIFT wire
                  transfer.
                </p>

              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  startCustomerTransfer();
                }}
                className="portal-form"
              >

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Recipient Name
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.recipientName
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            recipientName:
                              event.target.value,
                          })
                        )
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Recipient IBAN / Account Number
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.recipientAccountNumber
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            recipientAccountNumber:
                              event.target.value,
                          })
                        )
                      }
                      required
                    />

                  </div>

                </div>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Bank Name
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.bankName
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            bankName:
                              event.target.value,
                          })
                        )
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Bank Country
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.bankCountry
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            bankCountry:
                              event.target.value,
                          })
                        )
                      }
                      required
                    />

                  </div>

                </div>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Currency
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.transferCurrency
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            transferCurrency:
                              event.target.value
                                .toUpperCase(),
                          })
                        )
                      }
                      placeholder="USD"
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Amount
                    </label>

                    <div className="currency-input">

                      <span>
                        $
                      </span>

                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={
                          requestForm.amount
                        }
                        onChange={(event) =>
                          setRequestForm(
                            (current) => ({
                              ...current,
                              amount:
                                event.target.value,
                            })
                          )
                        }
                        required
                      />

                    </div>

                  </div>

                </div>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      SWIFT / BIC
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.swiftBic
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            swiftBic:
                              event.target.value,
                          })
                        )
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Account Name
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.accountName
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            accountName:
                              event.target.value,
                          })
                        )
                      }
                    />

                  </div>

                </div>

                <div className="form-group">

                  <label>
                    Street Address
                  </label>

                  <input
                    type="text"
                    value={
                      requestForm.streetAddress
                    }
                    onChange={(event) =>
                      setRequestForm(
                        (current) => ({
                          ...current,
                          streetAddress:
                            event.target.value,
                        })
                      )
                    }
                  />

                </div>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      City
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.city
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            city:
                              event.target.value,
                          })
                        )
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      State / Province
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.state
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            state:
                              event.target.value,
                          })
                        )
                      }
                    />

                  </div>

                </div>

                <div className="form-group">

                  <label>
                    Postal Code
                  </label>

                  <input
                    type="text"
                    value={
                      requestForm.postalCode
                    }
                    onChange={(event) =>
                      setRequestForm(
                        (current) => ({
                          ...current,
                          postalCode:
                            event.target.value,
                        })
                      )
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Description
                  </label>

                  <textarea
                    rows="4"
                    value={
                      requestForm.description
                    }
                    onChange={(event) =>
                      setRequestForm(
                        (current) => ({
                          ...current,
                          description:
                            event.target.value,
                        })
                      )
                    }
                    placeholder="Purpose of wire transfer"
                  />

                </div>

                {transferStatus && (
                  <div
                    className={`request-notice ${
                      transferStatus
                        .toLowerCase()
                        .includes("success")
                        ? "success-notice"
                        : "error-notice"
                    }`}
                  >
                    <p>
                      {transferStatus}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="portal-button"
                  disabled={requestLoading}
                >
                  {requestLoading
                    ? "Processing..."
                    : "Continue to Verification"}
                </button>

              </form>

            </section>

          </PortalPage>
        )}

        {/* =================================================
            LOCAL TRANSFER
        ================================================= */}

        {activePage === "local" && (
          <PortalPage
            title="Local Transfer"
            label="ACCOUNT SERVICES"
          >

            <section className="service-form-panel">

              <div className="service-form-heading">

                <span className="section-label">
                  LOCAL BANK TRANSFER
                </span>

                <h2>
                  Local Transfer
                </h2>

                <p>
                  Send funds using the recipient's
                  local banking details.
                </p>

              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  startCustomerTransfer();
                }}
                className="portal-form"
              >

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Recipient Name
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.recipientName
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            recipientName:
                              event.target.value,
                          })
                        )
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Recipient Account Number / IBAN
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.recipientAccountNumber
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            recipientAccountNumber:
                              event.target.value,
                          })
                        )
                      }
                      required
                    />

                  </div>

                </div>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Bank Name
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.bankName
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            bankName:
                              event.target.value,
                          })
                        )
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Bank Country
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.bankCountry
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            bankCountry:
                              event.target.value,
                          })
                        )
                      }
                      required
                    />

                  </div>

                </div>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Currency
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.transferCurrency
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            transferCurrency:
                              event.target.value
                                .toUpperCase(),
                          })
                        )
                      }
                      placeholder="USD"
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Amount
                    </label>

                    <div className="currency-input">

                      <span>
                        $
                      </span>

                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={
                          requestForm.amount
                        }
                        onChange={(event) =>
                          setRequestForm(
                            (current) => ({
                              ...current,
                              amount:
                                event.target.value,
                            })
                          )
                        }
                        required
                      />

                    </div>

                  </div>

                </div>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Routing Type
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.routingType
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            routingType:
                              event.target.value,
                          })
                        )
                      }
                      placeholder="Routing type"
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Routing Value
                    </label>

                    <input
                      type="text"
                      value={
                        requestForm.routingValue
                      }
                      onChange={(event) =>
                        setRequestForm(
                          (current) => ({
                            ...current,
                            routingValue:
                              event.target.value,
                          })
                        )
                      }
                      placeholder="Routing value"
                    />

                  </div>

                </div>

                <div className="form-group">

                  <label>
                    Description
                  </label>

                  <textarea
                    rows="4"
                    value={
                      requestForm.description
                    }
                    onChange={(event) =>
                      setRequestForm(
                        (current) => ({
                          ...current,
                          description:
                            event.target.value,
                        })
                      )
                    }
                    placeholder="Purpose of local transfer"
                  />

                </div>

                {transferStatus && (
                  <div
                    className={`request-notice ${
                      transferStatus
                        .toLowerCase()
                        .includes("success")
                        ? "success-notice"
                        : "error-notice"
                    }`}
                  >
                    <p>
                      {transferStatus}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="portal-button"
                  disabled={requestLoading}
                >
                  {requestLoading
                    ? "Processing..."
                    : "Continue to Verification"}
                </button>

              </form>

            </section>

          </PortalPage>
        )}
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
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
                {passwordLoading
                  ? "Updating..."
                  : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {chatOpen && (
      <div className="chat-overlay">

        <div className="chat-panel">

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
              type="button"
              onClick={() =>
                setChatOpen(false)
              }
              aria-label="Close chat"
            >
              ×
            </button>

          </div>

          <div className="chat-messages">

            {chatLoading ? (

              <div className="chat-empty">
                Loading messages...
              </div>

            ) : chatMessages.length === 0 ? (

              <div className="chat-empty">

                <strong>
                  Welcome to Customer Support
                </strong>

                <p>
                  Send us a message and our
                  support team will respond.
                </p>

              </div>

            ) : (

              chatMessages.map((message) => {

                const isCustomer =
                  message.sender_id === user?.id;

                return (
                  <div
                    key={message.id}
                    className={
                      isCustomer
                        ? "chat-message customer"
                        : "chat-message support"
                    }
                  >

                    <div className="chat-message-bubble">

                      <p>
                        {message.message}
                      </p>

                      <small>
                        {formatDate(
                          message.created_at
                        )}
                      </small>

                    </div>

                  </div>
                );
              })

            )}

          </div>

          <form
            className="chat-input-row"
            onSubmit={sendChatMessage}
          >

            <input
              type="text"
              value={chatInput}
              onChange={(event) =>
                setChatInput(
                  event.target.value
                )
              }
              placeholder="Type your message..."
              disabled={chatSending}
            />

            <button
              type="submit"
              className="portal-button"
              disabled={
                chatSending ||
                !chatInput.trim()
              }
            >
              {chatSending
                ? "Sending..."
                : "Send"}
            </button>

          </form>

        </div>

      </div>
    )}

    {transferOtpOpen && (
      <div
        className="chat-overlay"
        role="presentation"
      >

        <div
          className="otp-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="transfer-otp-title"
        >

          <div className="otp-modal-header">

            <div>

              <span className="section-label">
                SECURITY VERIFICATION
              </span>

              <h2 id="transfer-otp-title">
                Verify Transfer
              </h2>

            </div>

            <button
              type="button"
              onClick={closeTransferOtp}
              disabled={transferOtpLoading}
              aria-label="Close transfer verification"
            >
              ×
            </button>

          </div>

          <div className="otp-modal-body">

            <p>
              We sent a six-digit verification
              code to{" "}
              <strong>
                {transferEmailMasked ||
                  "your email address"}
              </strong>.
            </p>

            <p>
              Enter the code below to authorize
              this transfer.
            </p>

            <label className="form-label">
              Verification Code

              <input
                className="portal-input otp-input"
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
              />
            </label>

            {transferOtpStatus && (
              <div
                className={`request-notice ${
                  transferOtpStatus
                    .toLowerCase()
                    .includes("success")
                    ? "success-notice"
                    : "error-notice"
                }`}
              >
                <p>
                  {transferOtpStatus}
                </p>
              </div>
            )}

            <div className="otp-actions">

              <button
                type="button"
                className="secondary-action"
                onClick={
                  resendCustomerTransferOtp
                }
                disabled={
                  transferResendLoading ||
                  transferOtpLoading
                }
              >
                {transferResendLoading
                  ? "Sending..."
                  : "Resend Code"}
              </button>

              <button
                type="button"
                className="portal-button"
                onClick={
                  verifyCustomerTransfer
                }
                disabled={
                  transferOtpLoading ||
                  transferOtp.length !== 6
                }
              >
                {transferOtpLoading
                  ? "Verifying..."
                  : "Verify & Send Transfer"}
              </button>

            </div>

          </div>

        </div>

      </div>
    )}

    {transferReceiptOpen && (
      <div
        className="chat-overlay"
        role="presentation"
      >

        <div
          className="otp-modal transfer-receipt-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="transfer-receipt-title"
        >

          <div className="otp-modal-header">

            <div>

              <span className="section-label">
                TRANSFER COMPLETE
              </span>

              <h2 id="transfer-receipt-title">
                Transfer Successful
              </h2>

            </div>

            <button
              type="button"
              onClick={closeTransferReceipt}
              aria-label="Close transfer receipt"
            >
              ×
            </button>

          </div>

          <div className="otp-modal-body">

            <div className="transfer-success-icon">
              ✓
            </div>

            <p>
              Your transfer has been submitted
              successfully.
            </p>

            {transferReceipt && (
              <div className="transfer-receipt-details">

                <div className="detail-row">

                  <span>
                    Recipient
                  </span>

                  <strong>
                    {transferReceipt.recipientName ||
                      "Recipient"}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>
                    Amount
                  </span>

                  <strong>
                    {transferReceipt.currency ||
                      "USD"}{" "}
                    {formatMoney(
                      transferReceipt.amount
                    )}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>
                    Transfer ID
                  </span>

                  <strong>
                    {transferReceipt.transferId ||
                      "Submitted"}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>
                    Status
                  </span>

                  <strong className="active-text">
                    Submitted
                  </strong>

                </div>

              </div>
            )}

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

    <button
      type="button"
      className="floating-support-button"
      onClick={async () => {
        setChatOpen(true);
        await loadChatMessages();
      }}
      aria-label="Open customer support"
    >
      💬
    </button>

  </main>
);
}


/*
=====================================================
PORTAL HEADER
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

      <div className="portal-header-inner">

        <button
          type="button"
          className="portal-brand"
          onClick={() =>
            openPage("dashboard")
          }
        >

          <span className="portal-brand-mark">
            M
          </span>

          <span>
            MIDATLANTIC FEDERAL BANK
          </span>

        </button>

        {showMenu && (
          <nav
            className={`portal-nav ${
              menuOpen ? "open" : ""
            }`}
          >

            <button
              type="button"
              onClick={() =>
                openPage("dashboard")
              }
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() =>
                openPage("account")
              }
            >
              Account
            </button>

            <button
              type="button"
              onClick={() =>
                openPage("transactions")
              }
            >
              Transactions
            </button>

            <button
              type="button"
              onClick={() =>
                openPage("card")
              }
            >
              Cards
            </button>

            <button
              type="button"
              onClick={() =>
                openPage("support")
              }
            >
              Support
            </button>

            <button
              type="button"
              onClick={logout}
            >
              Sign Out
            </button>

          </nav>
        )}

        <button
          type="button"
          className="portal-menu-button"
          onClick={() =>
            setMenuOpen(
              (current) => !current
            )
          }
          aria-label="Toggle navigation"
        >
          ☰
        </button>

      </div>

    </header>
  );
}


/*
=====================================================
PORTAL PAGE
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

        <span className="section-label">
          {label}
        </span>

        <h1>
          {title}
        </h1>

      </div>

      <div className="portal-page-card">
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
    <div className="detail-row">

      <span>
        {label}
      </span>

      <strong>
        {value || "—"}
      </strong>

    </div>
  );
}


/*
=====================================================
ACCOUNT NUMBER ROW
=====================================================
*/

function AccountNumberRow({
  accountNumber,
  visible,
  onToggle,
}) {

  return (
    <div className="detail-row account-number-row">

      <span>
        Account Number
      </span>

      <div className="account-number-value">

        <strong>
          {visible
            ? accountNumber
            : maskedAccountNumber(
                accountNumber
              )}
        </strong>

        <button
          type="button"
          className="account-number-toggle"
          onClick={onToggle}
        >
          {visible
            ? "Hide"
            : "Show"}
        </button>

      </div>

    </div>
  );
}


/*
=====================================================
HELPERS
=====================================================
*/

function formatMoney(value) {

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0.00";
  }

  return number.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}


function maskedAccountNumber(
  accountNumber
) {

  if (!accountNumber) {
    return "••••••";
  }

  const value = String(
    accountNumber
  );

  const last4 =
    value.slice(-4);

  return `••••••${last4}`;
}


function formatDate(value) {

  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString(
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


function formatDateOnly(value) {

  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}


/*
=====================================================
GREETING
=====================================================
*/

function greeting() {

  const hour =
    new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}
              setMenuOpen(!menuOpen)
            }
            aria-label="Open account menu"
            type="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        ) : null}

      </div>

      {showMenu && menuOpen && (

        <div className="portal-dropdown-menu">

          <button
            type="button"
            onClick={() => {
              openPage("dashboard");
              setMenuOpen(false);
            }}
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => {
              openPage("profile");
              setMenuOpen(false);
            }}
          >
            My Profile
          </button>

          <button
            type="button"
            onClick={() => {
              openPage("account");
              setMenuOpen(false);
            }}
          >
            Account Information
          </button>

          <button
            type="button"
            onClick={() => {
              openPage("transactions");
              setMenuOpen(false);
            }}
          >
            Transactions
          </button>

          <button
            type="button"
            onClick={() => {
              openPage("card");
              setMenuOpen(false);
            }}
          >
            ATM / Debit Card
          </button>

          <button
            type="button"
            onClick={() => {
              openPage("notifications");
              setMenuOpen(false);
            }}
          >
            Notifications
          </button>

          <button
            type="button"
            onClick={() => {
              openPage("support");
              setMenuOpen(false);
            }}
          >
            Customer Support
          </button>

          <button
            type="button"
            onClick={() => {
              openPage("security");
              setMenuOpen(false);
            }}
          >
            Security Center
          </button>

          <button
            type="button"
            onClick={() => {
              openPage("settings");
              setMenuOpen(false);
            }}
          >
            Account Settings
          </button>

          <div className="portal-menu-divider"></div>

          <button
            type="button"
            className="portal-menu-signout"
            onClick={logout}
          >
            Sign Out
          </button>

        </div>

      )}

    </header>
  );
}


/*
=====================================================
PORTAL PAGE WRAPPER
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

        <span className="section-label">
          {label}
        </span>

        <h1>
          {title}
        </h1>

      </div>

      <div className="portal-page-card">

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
    <div className="detail-row">

      <span>
        {label}
      </span>

      <strong>
        {value || "—"}
      </strong>

    </div>
  );
}


/*
=====================================================
ACCOUNT NUMBER ROW
=====================================================
*/

function AccountNumberRow({
  accountNumber,
  visible,
  onToggle,
}) {

  return (
    <div className="detail-row">

      <span>
        Account Number
      </span>

      <strong
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >

        {visible
          ? accountNumber
          : maskedAccountNumber(
              accountNumber
            )}

        <button
          type="button"
          onClick={onToggle}
          className="account-number-toggle"
        >
          {visible
            ? "Hide"
            : "Show"}
        </button>

      </strong>

    </div>
  );
}


/*
=====================================================
HELPERS
=====================================================
*/

function formatMoney(value) {

  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return "0.00";
  }

  return number.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}


function maskedAccountNumber(
  accountNumber
) {

  if (!accountNumber) {
    return "••••••";
  }

  const value =
    String(accountNumber);

  return `••••••${value.slice(-4)}`;
}


function formatDate(value) {

  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleString(
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


function formatDateOnly(value) {

  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}


function greeting() {

  const hour =
    new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}
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
