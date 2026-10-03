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

  async function loadCardData(
    userId = user?.id,
    accountId = account?.id
  ) {
    if (!userId) return;

    setCardLoading(true);

    try {
      const {
        data: cardData,
        error: cardError,
      } = await supabase
        .from("customer_cards")
        .select(
          "id, card_type, card_network, cardholder_name, last4, expiry_month, expiry_year, status, created_at, activated_at"
        )
        .eq("user_id", userId)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (!cardError) {
        setCustomerCard(cardData || null);
      }

      const {
        data: orders,
        error: ordersError,
      } = await supabase
        .from("customer_card_orders")
        .select(
          "id, card_type, reason, status, created_at, updated_at"
        )
        .eq("user_id", userId)
        .order("created_at", {
          ascending: false,
        })
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

      const {
        error: passwordError,
      } = await supabase.auth.updateUser({
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

      if (profileUpdateError)
        throw profileUpdateError;

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
      Number(requestForm.amount);

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
      const { error } =
        await supabase
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
        // Keep original error.
      }

      throw new Error(message);
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
      Number(requestForm.amount);

    const recipientName =
      requestForm.recipientName.trim();

    const recipientAccountNumber =
      requestForm.recipientAccountNumber.trim();

    const bankCountry =
      requestForm.bankCountry
        .trim()
        .toUpperCase();

    const transferCurrency =
      requestForm.transferCurrency
        .trim()
        .toUpperCase();

    const accountName =
      (
        requestForm.accountName.trim() ||
        recipientName
      );

    if (!recipientName) {
      setRequestStatus(
        "Please enter the recipient's full name."
      );
      return;
    }

    if (!recipientAccountNumber) {
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
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setRequestStatus(
        "Please enter a valid transfer amount."
      );
      return;
    }

    if (
      account?.status !== "active"
    ) {
      setRequestStatus(
        "Your account is not active and cannot send a transfer."
      );
      return;
    }

    if (
      amount >
      Number(account.balance || 0)
    ) {
      setRequestStatus(
        "The transfer amount is greater than your available balance."
      );
      return;
    }

    setRequestLoading(true);

    try {
      const data =
        await invokeCustomerTransfer({
          action: "send_otp",
          recipientName,
          recipientAccountNumber,
          bankName:
            requestForm.bankName.trim(),
          bankCountry,
          transferCurrency,
          transferMethod:
            pageType === "wire"
              ? "SWIFT"
              : pageType === "local"
              ? "LOCAL"
              : requestForm.transferMethod,
          beneficiaryType:
            requestForm.beneficiaryType,
          accountName,
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
      !/^[0-9]{6}$/.test(code)
    ) {
      setTransferOtpStatus(
        "Enter the 6-digit verification code sent to your email."
      );
      return;
    }

    setTransferOtpLoading(true);
    setTransferOtpStatus("");

    try {
      const data =
        await invokeCustomerTransfer({
          action: "verify_otp",
          transferId,
          otp: code,
        });

      setTransferOtpOpen(false);
      setTransferOtp("");
      setTransferId("");
      setTransferPageType("transfer");
      resetRequestForm();
      setRequestStatus("");
      setTransferReceipt(
        data.receipt
      );
      setTransferReceiptOpen(true);
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
              Account Security
            </div>

            <div className="security-action-row">
              <div>
                <strong>Password</strong>
                <p>
                  Change your customer portal password.
                </p>
              </div>

              <button
                type="button"
                className="portal-button secondary-portal-button"
                onClick={() => {
                  setPasswordStatus("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setPasswordModalOpen(true);
                }}
              >
                Change Password
              </button>
            </div>

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
            TRANSACTIONS
        ================================================= */}

        {activePage === "transactions" && (
          <PortalPage
            title="Transactions"
            label="ACCOUNT ACTIVITY"
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
                            transaction.transaction_date ||
                              transaction.created_at
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

            {activePage !== "withdraw" ? (

              <form
                onSubmit={submitRequest}
              >

                <div className="request-notice transfer-security-notice">

                  <strong>
                    {activePage === "wire"
                      ? "International Wire Transfer"
                      : activePage === "local"
                      ? "Local Bank Transfer"
                      : "International & Local Bank Transfer"}
                  </strong>

                  <p>
                    Enter the recipient's bank details.
                    The transfer is verified by email OTP
                    before it is sent through Airwallex.
                  </p>

                </div>

                <label className="form-label">
                  Recipient Full Name

                  <input
                    className="portal-input"
                    type="text"
                    value={
                      requestForm.recipientName
                    }
                    onChange={(e) =>
                      updateRequestField(
                        "recipientName",
                        e.target.value
                      )
                    }
                    placeholder="Full name of recipient"
                    required
                  />

                </label>

                <label className="form-label">
                  Recipient Account Number / IBAN

                  <input
                    className="portal-input"
                    type="text"
                    value={
                      requestForm.recipientAccountNumber
                    }
                    onChange={(e) =>
                      updateRequestField(
                        "recipientAccountNumber",
                        e.target.value
                      )
                    }
                    placeholder="Account number or IBAN"
                    required
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
                    onChange={(e) =>
                      updateRequestField(
                        "bankName",
                        e.target.value
                      )
                    }
                    placeholder="Recipient bank name"
                  />

                </label>

                <div className="transfer-form-grid">

                  <label className="form-label">
                    Bank Country (2-letter code)

                    <input
                      className="portal-input"
                      type="text"
                      value={
                        requestForm.bankCountry
                      }
                      onChange={(e) =>
                        updateRequestField(
                          "bankCountry",
                          e.target.value
                            .toUpperCase()
                            .slice(0, 2)
                        )
                      }
                      placeholder="US"
                      maxLength={2}
                      required
                    />

                  </label>

                  <label className="form-label">
                    Transfer Currency (3-letter code)

                    <input
                      className="portal-input"
                      type="text"
                      value={
                        requestForm.transferCurrency
                      }
                      onChange={(e) =>
                        updateRequestField(
                          "transferCurrency",
                          e.target.value
                            .toUpperCase()
                            .slice(0, 3)
                        )
                      }
                      placeholder="USD"
                      maxLength={3}
                      required
                    />

                  </label>

                </div>

                <div className="transfer-form-grid">

                  <label className="form-label">
                    Beneficiary Type

                    <select
                      className="portal-input"
                      value={
                        requestForm.beneficiaryType
                      }
                      onChange={(e) =>
                        updateRequestField(
                          "beneficiaryType",
                          e.target.value
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

                  </label>

                  <label className="form-label">
                    Account Name

                    <input
                      className="portal-input"
                      type="text"
                      value={
                        requestForm.accountName
                      }
                      onChange={(e) =>
                        updateRequestField(
                          "accountName",
                          e.target.value
                        )
                      }
                      placeholder="Account holder name"
                    />

                  </label>

                </div>

                <div className="transfer-form-grid">

                  <label className="form-label">
                    Routing Type

                    <select
                      className="portal-input"
                      value={
                        requestForm.routingType
                      }
                      onChange={(e) =>
                        updateRequestField(
                          "routingType",
                          e.target.value
                        )
                      }
                    >
                      <option value="aba">
                        ABA
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

                      <option value="bank_code">
                        Bank Code
                      </option>

                      <option value="iban">
                        IBAN
                      </option>
                    </select>

                  </label>

                  <label className="form-label">
                    Routing Value

                    <input
                      className="portal-input"
                      type="text"
                      value={
                        requestForm.routingValue
                      }
                      onChange={(e) =>
                        updateRequestField(
                          "routingValue",
                          e.target.value
                        )
                      }
                      placeholder="Routing number"
                    />

                  </label>

                </div>

                <label className="form-label">
                  SWIFT / BIC

                  <input
                    className="portal-input"
                    type="text"
                    value={
                      requestForm.swiftBic
                    }
                    onChange={(e) =>
                      updateRequestField(
                        "swiftBic",
                        e.target.value
                          .toUpperCase()
                      )
                    }
                    placeholder="SWIFT or BIC code"
                  />

                </label>

                <div className="transfer-form-grid">

                  <label className="form-label">
                    Street Address

                    <input
                      className="portal-input"
                      type="text"
                      value={
                        requestForm.streetAddress
                      }
                      onChange={(e) =>
                        updateRequestField(
                          "streetAddress",
                          e.target.value
                        )
                      }
                      placeholder="Recipient street address"
                    />

                  </label>

                  <label className="form-label">
                    City

                    <input
                      className="portal-input"
                      type="text"
                      value={
                        requestForm.city
                      }
                      onChange={(e) =>
                        updateRequestField(
                          "city",
                          e.target.value
                        )
                      }
                      placeholder="Recipient city"
                    />

                  </label>

                </div>

                <div className="transfer-form-grid">

                  <label className="form-label">
                    State / Province

                    <input
                      className="portal-input"
                      type="text"
                      value={
                        requestForm.state
                      }
                      onChange={(e) =>
                        updateRequestField(
                          "state",
                          e.target.value
                        )
                      }
                      placeholder="State or province"
                    />

                  </label>

                  <label className="form-label">
                    Postal Code

                    <input
                      className="portal-input"
                      type="text"
                      value={
                        requestForm.postalCode
                      }
                      onChange={(e) =>
                        updateRequestField(
                          "postalCode",
                          e.target.value
                        )
                      }
                      placeholder="Postal code"
                    />

                  </label>

                </div>

                <div className="transfer-form-grid">

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
                      onChange={(e) =>
                        updateRequestField(
                          "amount",
                          e.target.value
                        )
                      }
                      placeholder="0.00"
                      required
                    />

                  </label>

                  <label className="form-label">
                    Transfer Method

                    <select
                      className="portal-input"
                      value={
                        requestForm.transferMethod
                      }
                      onChange={(e) =>
                        updateRequestField(
                          "transferMethod",
                          e.target.value
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

                  </label>

                </div>

                <label className="form-label">
                  Description

                  <textarea
                    className="portal-input portal-textarea"
                    value={
                      requestForm.description
                    }
                    onChange={(e) =>
                      updateRequestField(
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Transfer description"
                    rows={4}
                  />

                </label>

                {requestStatus && (
                  <div className="request-status">
                    {requestStatus}
                  </div>
                )}

                <button
                  className="portal-button"
                  type="submit"
                  disabled={requestLoading}
                >
                  {requestLoading
                    ? "Processing..."
                    : "Continue"}
                </button>

              </form>

            ) : (

              <form
                onSubmit={async (event) => {
                  event.preventDefault();

                  if (
                    requestLoading ||
                    !user
                  ) {
                    return;
                  }

                  setRequestLoading(true);
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
                      "Please enter a valid withdrawal amount."
                    );
                    setRequestLoading(false);
                    return;
                  }

                  if (
                    amount >
                    Number(
                      account.balance || 0
                    )
                  ) {
                    setRequestStatus(
                      "The withdrawal amount is greater than your available balance."
                    );
                    setRequestLoading(false);
                    return;
                  }

                  try {
                    const {
                      error: withdrawalError,
                    } = await supabase
                      .from(
                        "withdrawal_requests"
                      )
                      .insert({
                        user_id: user.id,
                        account_id:
                          account.id,
                        amount,
                        withdrawal_method:
                          "cash",
                        status:
                          "pending",
                        notes:
                          requestForm.description.trim() ||
                          null,
                      });

                    if (
                      withdrawalError
                    ) {
                      throw withdrawalError;
                    }

                    setRequestStatus(
                      "Your withdrawal request has been submitted successfully."
                    );

                    setRequestForm(
                      (current) => ({
                        ...current,
                        amount: "",
                        description: "",
                      })
                    );
                  } catch (withdrawalError) {
                    setRequestStatus(
                      withdrawalError?.message ||
                        "Your withdrawal request could not be submitted. Please try again."
                    );
                  } finally {
                    setRequestLoading(false);
                  }
                }}
              >

                <div className="request-notice">

                  <strong>
                    Cash Withdrawal Request
                  </strong>

                  <p>
                    Submit a withdrawal request
                    from your customer account.
                    The bank will review the request
                    before completion.
                  </p>

                </div>

                <label className="form-label">
                  Withdrawal Amount

                  <input
                    className="portal-input"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={
                      requestForm.amount
                    }
                    onChange={(e) =>
                      updateRequestField(
                        "amount",
                        e.target.value
                      )
                    }
                    placeholder="0.00"
                    required
                  />

                </label>

                <label className="form-label">
                  Notes

                  <textarea
                    className="portal-input portal-textarea"
                    value={
                      requestForm.description
                    }
                    onChange={(e) =>
                      updateRequestField(
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Optional withdrawal notes"
                    rows={4}
                  />

                </label>

                {requestStatus && (
                  <div className="request-status">
                    {requestStatus}
                  </div>
                )}

                <button
                  className="portal-button"
                  type="submit"
                  disabled={requestLoading}
                >
                  {requestLoading
                    ? "Submitting..."
                    : "Submit Withdrawal Request"}
                </button>

              </form>

            )}

          </PortalPage>
        )}

        {/* =================================================
            SUPPORT
        ================================================= */}

        {activePage === "support" && (
          <PortalPage
            title="Customer Support"
            label="SUPPORT"
          >

            <div className="support-page">

              <div className="support-intro">
                <span className="section-label">
                  CUSTOMER SERVICE
                </span>

                <h2>
                  How can we help?
                </h2>

                <p>
                  Send a secure support message
                  to the bank's customer service team.
                </p>
              </div>

              <button
                type="button"
                className="portal-button"
                onClick={async () => {
                  setChatOpen(true);
                  await loadChatMessages();
                }}
              >
                Open Secure Support Chat
              </button>

            </div>

          </PortalPage>
        )}

      </div>

      {/* =================================================
          SUPPORT CHAT
      ================================================= */}

      {chatOpen && (
        <div className="chat-overlay">

          <div className="support-chat">

            <div className="support-chat-header">

              <div>
                <strong>
                  MIDATLANTIC SUPPORT
                </strong>

                <small>
                  Secure customer support
                </small>
              </div>

              <button
                type="button"
                onClick={() =>
                  setChatOpen(false)
                }
                className="chat-close"
              >
                ×
              </button>

            </div>

            <div className="support-chat-messages">

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

                    <div>
                      {message.message}
                    </div>

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
              className="support-chat-form"
              onSubmit={sendChatMessage}
            >

              <input
                className="portal-input"
                type="text"
                value={chatMessage}
                onChange={(e) =>
                  setChatMessage(
                    e.target.value
                  )
                }
                placeholder="Type your message..."
              />

              <button
                className="portal-button"
                type="submit"
                disabled={chatLoading}
              >
                {chatLoading
                  ? "Sending..."
                  : "Send"}
              </button>

            </form>

          </div>

        </div>
      )}

      {/* =================================================
          PASSWORD MODAL
      ================================================= */}

      {passwordModalOpen && (
        <div className="modal-overlay">

          <div className="modal-card">

            <div className="modal-header">

              <div>
                <span className="section-label">
                  SECURITY
                </span>

                <h2>
                  Change Password
                </h2>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => {
                  if (
                    !passwordLoading
                  ) {
                    setPasswordModalOpen(
                      false
                    );
                    setPasswordStatus("");
                  }
                }}
              >
                ×
              </button>

            </div>

            <form
              onSubmit={changePassword}
            >

              <label className="form-label">
                New Password

                <input
                  className="portal-input"
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />

              </label>

              <label className="form-label">
                Confirm New Password

                <input
                  className="portal-input"
                  type="password"
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Repeat your password"
                  minLength={8}
                  required
                />

              </label>

              {passwordStatus && (
                <div className="request-status">
                  {passwordStatus}
                </div>
              )}

              <button
                className="portal-button"
                type="submit"
                disabled={
                  passwordLoading
                }
              >
                {passwordLoading
                  ? "Changing..."
                  : "Change Password"}
              </button>

            </form>

          </div>

        </div>
      )}

      {/* =================================================
          TRANSFER OTP MODAL
      ================================================= */}

      {transferOtpOpen && (
        <div className="modal-overlay">

          <div className="modal-card">

            <div className="modal-header">

              <div>
                <span className="section-label">
                  SECURITY VERIFICATION
                </span>

                <h2>
                  Verify Transfer
                </h2>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeTransferOtp}
                disabled={
                  transferOtpLoading
                }
              >
                ×
              </button>

            </div>

            <p className="modal-description">
              Enter the 6-digit verification
              code sent to your registered email
              address before the transfer can be
              completed.
            </p>

            <form
              onSubmit={
                verifyCustomerTransfer
              }
            >

              <label className="form-label">
                Verification Code

                <input
                  className="portal-input otp-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={transferOtp}
                  onChange={(e) =>
                    setTransferOtp(
                      e.target.value
                        .replace(
                          /[^0-9]/g,
                          ""
                        )
                        .slice(0, 6)
                    )
                  }
                  placeholder="000000"
                  required
                />

              </label>

              {transferOtpStatus && (
                <div className="request-status">
                  {transferOtpStatus}
                </div>
              )}

              <button
                className="portal-button"
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
              type="button"
              className="text-button otp-resend-button"
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
                : "Resend Verification Code"}
            </button>

          </div>

        </div>
      )}

      {/* =================================================
          TRANSFER RECEIPT MODAL
      ================================================= */}

      {transferReceiptOpen &&
        transferReceipt && (
          <div className="modal-overlay">

            <div className="modal-card receipt-card">

              <div className="receipt-success-icon">
                ✓
              </div>

              <span className="section-label">
                TRANSFER COMPLETE
              </span>

              <h2>
                Transfer Successful
              </h2>

              <p className="modal-description">
                Your transfer has been submitted
                successfully.
              </p>

              <div className="receipt-details">

                <InfoRow
                  label="Recipient"
                  value={
                    transferReceipt.recipientName ||
                    "Recipient"
                  }
                />

                <InfoRow
                  label="Amount"
                  value={`$${formatMoney(
                    transferReceipt.amount
                  )}`}
                />

                <InfoRow
                  label="Currency"
                  value={
                    transferReceipt.currency ||
                    requestForm.transferCurrency ||
                    "USD"
                  }
                />

                <InfoRow
                  label="Status"
                  value={
                    transferReceipt.status ||
                    "Submitted"
                  }
                />

                <InfoRow
                  label="Transfer ID"
                  value={
                    transferReceipt.transferId ||
                    transferReceipt.id ||
                    "—"
                  }
                />

                <InfoRow
                  label="Date"
                  value={formatDate(
                    transferReceipt.createdAt ||
                      new Date().toISOString()
                  )}
                />

              </div>

              <button
                type="button"
                className="portal-button"
                onClick={
                  closeTransferReceipt
                }
              >
                Done
              </button>

            </div>

          </div>
        )}

    </main>
  );
}
