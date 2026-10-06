"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/* ============================================================
   HELPERS
   ============================================================ */

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (n) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function statusClass(value) {
  const status = String(value || "").toLowerCase();

  if (
    status === "approved" ||
    status === "active" ||
    status === "resolved" ||
    status === "closed"
  ) {
    return "status-approved";
  }

  if (
    status === "rejected" ||
    status === "frozen" ||
    status === "urgent" ||
    status === "high"
  ) {
    return "status-rejected";
  }

  return "status-pending";
}

function supportStatusClass(value) {
  const status = String(value || "").toLowerCase();

  if (
    status === "resolved" ||
    status === "closed"
  ) {
    return "status-approved";
  }

  return "status-pending";
}

function priorityClass(value) {
  const priority = String(value || "").toLowerCase();

  if (
    priority === "urgent" ||
    priority === "high"
  ) {
    return "status-rejected";
  }

  return "status-pending";
}

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */

export default function AdminDashboard() {
  /* ==========================================================
     MAIN DATA
     ========================================================== */

  const [pending, setPending] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [cardOrders, setCardOrders] = useState([]);

  /* ==========================================================
     LIVE CHAT
     ========================================================== */

  const [chatConversations, setChatConversations] =
    useState([]);

  const [selectedChat, setSelectedChat] =
    useState(null);

  const [chatMessages, setChatMessages] =
    useState([]);

  const [chatReply, setChatReply] =
    useState("");

  const [chatLoading, setChatLoading] =
    useState(false);

  const [chatAction, setChatAction] =
    useState(null);

  const [chatRetentionHours, setChatRetentionHours] =
    useState(24);

  const selectedChatIdRef =
    useRef(null);

  /* ==========================================================
     ACTION STATES
     ========================================================== */

  const [cardAction, setCardAction] =
    useState(null);

  const [withdrawalAction, setWithdrawalAction] =
    useState(null);

  const [ticketAction, setTicketAction] =
    useState(null);

  /* ==========================================================
     PAGE STATE
     ========================================================== */

  const [loading, setLoading] =
    useState(true);

  const [notice, setNotice] =
    useState("");

  const [activeSection, setActiveSection] =
    useState("overview");

  /* ==========================================================
     ACCOUNT CREATED DATE
     ========================================================== */

  const [createdDateDrafts, setCreatedDateDrafts] =
    useState({});

  const [savingCreatedDate, setSavingCreatedDate] =
    useState(null);

  /* ==========================================================
     INITIAL LOAD
     ========================================================== */

  useEffect(() => {
    loadAdmin();
  }, []);

  /* ==========================================================
     LIVE CHAT REALTIME
     ========================================================== */

  useEffect(() => {
    const channel = supabase
      .channel("admin-live-chat-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_chat_messages",
        },
        async () => {
          try {
            await loadLiveChatConversations();

            const conversationId =
              selectedChatIdRef.current;

            if (conversationId) {
              await loadLiveChatMessages(
                conversationId
              );
            }
          } catch (error) {
            console.error(
              "LIVE CHAT REALTIME ERROR:",
              error
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ==========================================================
     REQUIRE ADMIN
     ========================================================== */

  async function requireAdmin() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      window.location.href = "/login";
      return false;
    }

    const {
      data: admin,
      error: adminError,
    } = await supabase.rpc("is_admin");

    if (adminError || !admin) {
      window.location.href = "/dashboard";
      return false;
    }

    return true;
  }

  /* ==========================================================
     LOAD EVERYTHING
     ========================================================== */

  async function loadAdmin() {
    setLoading(true);
    setNotice("");

    try {
      if (!(await requireAdmin())) {
        return;
      }

      await Promise.all([
        loadPending(),
        loadAccounts(),
        loadLiveChatConversations(),
        loadSupportTickets(),
        loadTransactions(),
        loadWithdrawals(),
        loadCardOrders(),
      ]);
    } catch (error) {
      console.error(
        "ADMIN DASHBOARD ERROR:",
        error
      );

      setNotice(
        error?.message ||
          "Unable to load the administrator dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  /* ==========================================================
     PENDING CUSTOMERS
     ========================================================== */

  async function loadPending() {
    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .select(
        "id, full_name, email, role, approval_status, created_at"
      )
      .eq("role", "customer")
      .eq("approval_status", "pending")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      setNotice(error.message);
      return;
    }

    setPending(data || []);
  }

  /* ==========================================================
     ACCOUNTS
     ========================================================== */

  async function loadAccounts() {
    const {
      data: accountData,
      error: accountError,
    } = await supabase
      .from("customer_accounts")
      .select(
        "id, user_id, account_number, account_type, status, balance, created_at, effective_created_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (accountError) {
      setNotice(accountError.message);
      return;
    }

    if (!accountData?.length) {
      setAccounts([]);
      setCreatedDateDrafts({});
      return;
    }

    const userIds = [
      ...new Set(
        accountData
          .map(
            (account) =>
              account.user_id
          )
          .filter(Boolean)
      ),
    ];

    let profileMap = {};

    if (userIds.length) {
      const {
        data,
        error,
      } = await supabase
        .from("profiles")
        .select(
          "id, full_name, email"
        )
        .in("id", userIds);

      if (error) {
        setNotice(error.message);
        return;
      }

      (data || []).forEach(
        (profile) => {
          profileMap[profile.id] =
            profile;
        }
      );
    }

    const combined =
      accountData.map(
        (account) => ({
          ...account,

          customerName:
            profileMap[
              account.user_id
            ]?.full_name ||
            "Customer",

          customerEmail:
            profileMap[
              account.user_id
            ]?.email || "",
        })
      );

    setAccounts(combined);

    const drafts = {};

    combined.forEach(
      (account) => {
        drafts[account.id] =
          toDateTimeLocal(
            account.effective_created_at ||
              account.created_at
          );
      }
    );

    setCreatedDateDrafts(
      drafts
    );
  }

  /* ==========================================================
     LIVE CHAT - CONVERSATIONS
     ========================================================== */

  async function loadLiveChatConversations() {
    const {
      data,
      error,
    } = await supabase.rpc(
      "admin_list_live_chat_conversations"
    );

    if (error) {
      console.error(
        "ADMIN LIVE CHAT CONVERSATION ERROR:",
        error
      );

      setNotice(
        `Live chat could not be loaded: ${error.message}`
      );

      setChatConversations([]);
      return [];
    }

    const rows = data || [];

    const userIds = [
      ...new Set(
        rows
          .map(
            (row) =>
              row.user_id
          )
          .filter(Boolean)
      ),
    ];

    let profileMap = {};

    if (userIds.length) {
      const {
        data: profiles,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select(
          "id, full_name, email"
        )
        .in("id", userIds);

      if (profileError) {
        setNotice(
          profileError.message
        );
      } else {
        (profiles || []).forEach(
          (profile) => {
            profileMap[
              profile.id
            ] = profile;
          }
        );
      }
    }

    const conversations =
      rows.map(
        (row) => ({
          ...row,

          customerName:
            profileMap[
              row.user_id
            ]?.full_name ||
            "Customer",

          customerEmail:
            profileMap[
              row.user_id
            ]?.email || "",
        })
      );

    setChatConversations(
      conversations
    );

    return conversations;
  }

  /* ==========================================================
     LIVE CHAT - MESSAGES
     ========================================================== */

  async function loadLiveChatMessages(
    conversationId
  ) {
    if (!conversationId) {
      setChatMessages([]);
      return;
    }

    setChatLoading(true);

    try {
      const {
        data,
        error,
      } = await supabase.rpc(
        "admin_list_live_chat_messages",
        {
          p_conversation_id:
            conversationId,
        }
      );

      if (error) {
        throw new Error(
          error.message
        );
      }

      setChatMessages(
        data || []
      );
    } catch (error) {
      console.error(
        "LIVE CHAT MESSAGE ERROR:",
        error
      );

      setNotice(
        error.message ||
          "Unable to load live chat messages."
      );
    } finally {
      setChatLoading(false);
    }
  }

  /* ==========================================================
     OPEN LIVE CHAT
     ========================================================== */

  async function openLiveChat(
    conversation
  ) {
    setSelectedChat(
      conversation
    );

    selectedChatIdRef.current =
      conversation.id;

    setChatReply("");

    await loadLiveChatMessages(
      conversation.id
    );
  }

  /* ==========================================================
     SEND LIVE CHAT REPLY
     ========================================================== */

  async function sendLiveChatReply() {
    if (!selectedChat) {
      return;
    }

    const message =
      chatReply.trim();

    if (!message) {
      setNotice(
        "Please enter a message."
      );
      return;
    }

    setChatAction(
      selectedChat.id
    );

    try {
      const {
        error,
      } = await supabase.rpc(
        "admin_send_live_chat_reply",
        {
          p_conversation_id:
            selectedChat.id,

          p_message:
            message,
        }
      );

      if (error) {
        throw new Error(
          error.message
        );
      }

      setChatReply("");

      await loadLiveChatMessages(
        selectedChat.id
      );

      await loadLiveChatConversations();

      setNotice(
        "Live chat reply sent successfully."
      );
    } catch (error) {
      console.error(
        "LIVE CHAT REPLY ERROR:",
        error
      );

      setNotice(
        error.message ||
          "Unable to send live chat reply."
      );
    } finally {
      setChatAction(null);
    }
  }

  /* ==========================================================
     CLOSE LIVE CHAT
     ========================================================== */

  async function closeLiveChat(
    conversation
  ) {
    if (chatAction) {
      return;
    }

    setChatAction(
      conversation.id
    );

    try {
      const {
        error,
      } = await supabase.rpc(
        "admin_close_live_chat",
        {
          p_conversation_id:
            conversation.id,
        }
      );

      if (error) {
        throw new Error(
          error.message
        );
      }

      const updated = {
        ...conversation,
        status: "closed",
        closed_at:
          new Date().toISOString(),
      };

      setSelectedChat(
        updated
      );

      await loadLiveChatConversations();

      setNotice(
        "Live chat conversation closed."
      );
    } catch (error) {
      console.error(
        "CLOSE LIVE CHAT ERROR:",
        error
      );

      setNotice(
        error.message ||
          "Unable to close conversation."
      );
    } finally {
      setChatAction(null);
    }
  }

  /* ==========================================================
     DELETE LIVE CHAT
     ========================================================== */

  async function deleteLiveChat(
    conversation
  ) {
    if (chatAction) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete the entire conversation with ${conversation.customerName}?\n\nAll messages in this conversation will be permanently deleted.`
      );

    if (!confirmed) {
      return;
    }

    setChatAction(
      conversation.id
    );

    try {
      const {
        error,
      } = await supabase.rpc(
        "admin_delete_live_chat_conversation",
        {
          p_conversation_id:
            conversation.id,
        }
      );

      if (error) {
        throw new Error(
          error.message
        );
      }

      if (
        selectedChat?.id ===
        conversation.id
      ) {
        setSelectedChat(null);
        selectedChatIdRef.current =
          null;
        setChatMessages([]);
        setChatReply("");
      }

      await loadLiveChatConversations();

      setNotice(
        "Live chat conversation deleted."
      );
    } catch (error) {
      console.error(
        "DELETE LIVE CHAT ERROR:",
        error
      );

      setNotice(
        error.message ||
          "Unable to delete conversation."
      );
    } finally {
      setChatAction(null);
    }
  }

  /* ==========================================================
     SUPPORT TICKETS
     ========================================================== */

  async function loadSupportTickets() {
    const {
      data: rows,
      error,
    } = await supabase.rpc(
      "admin_list_support_tickets"
    );

    if (error) {
      console.error(
        "ADMIN SUPPORT TICKET ERROR:",
        error
      );

      setNotice(
        `Support tickets could not be loaded: ${error.message}`
      );

      setSupportTickets([]);
      return;
    }

    const userIds = [
      ...new Set(
        (rows || [])
          .map(
            (ticket) =>
              ticket.user_id
          )
          .filter(Boolean)
      ),
    ];

    let profileMap = {};

    if (userIds.length) {
      const {
        data,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select(
          "id, full_name, email"
        )
        .in("id", userIds);

      if (profileError) {
        setNotice(
          profileError.message
        );
        return;
      }

      (data || []).forEach(
        (profile) => {
          profileMap[
            profile.id
          ] = profile;
        }
      );
    }

    setSupportTickets(
      (rows || []).map(
        (ticket) => ({
          ...ticket,

          customerName:
            profileMap[
              ticket.user_id
            ]?.full_name ||
            "Customer",

          customerEmail:
            profileMap[
              ticket.user_id
            ]?.email || "",
        })
      )
    );
  }

  /* ==========================================================
     TRANSACTIONS
     ========================================================== */

  async function loadTransactions() {
    const {
      data,
      error,
    } = await supabase
      .from("transactions")
      .select(
        "id, account_id, transaction_type, amount, description, transaction_date"
      )
      .order(
        "transaction_date",
        {
          ascending: false,
        }
      );

    if (error) {
      setNotice(
        error.message
      );
      return;
    }

    setTransactions(
      data || []
    );
  }

  /* ==========================================================
     CARD ORDERS
     ========================================================== */

  async function loadCardOrders() {
    const {
      data,
      error,
    } = await supabase.rpc(
      "admin_list_card_orders"
    );

    if (error) {
      console.error(
        "CARD ORDER LIST ERROR:",
        error
      );

      setNotice(
        `Card requests could not be loaded: ${error.message}`
      );

      setCardOrders([]);
      return;
    }

    const rows = data || [];

    const userIds = [
      ...new Set(
        rows
          .map(
            (row) =>
              row.user_id
          )
          .filter(Boolean)
      ),
    ];

    const accountIds = [
      ...new Set(
        rows
          .map(
            (row) =>
              row.account_id
          )
          .filter(Boolean)
      ),
    ];

    let profileMap = {};
    let accountMap = {};

    if (userIds.length) {
      const {
        data: profiles,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select(
          "id, full_name, email"
        )
        .in("id", userIds);

      if (!profileError) {
        (profiles || []).forEach(
          (profile) => {
            profileMap[
              profile.id
            ] = profile;
          }
        );
      }
    }

    if (accountIds.length) {
      const {
        data: accountRows,
        error: accountError,
      } = await supabase
        .from("customer_accounts")
        .select(
          "id, account_number, account_type"
        )
        .in("id", accountIds);

      if (!accountError) {
        (accountRows || []).forEach(
          (account) => {
            accountMap[
              account.id
            ] = account;
          }
        );
      }
    }

    setCardOrders(
      rows.map(
        (row) => ({
          ...row,

          customerName:
            profileMap[
              row.user_id
            ]?.full_name ||
            "Customer",

          customerEmail:
            profileMap[
              row.user_id
            ]?.email || "",

          accountNumber:
            accountMap[
              row.account_id
            ]?.account_number ||
            "Not available",

          accountType:
            accountMap[
              row.account_id
            ]?.account_type ||
            "Checking",
        })
      )
    );
  }

  /* ==========================================================
     WITHDRAWALS
     ========================================================== */

  async function loadWithdrawals() {
    const {
      data,
      error,
    } = await supabase.rpc(
      "admin_list_withdrawals"
    );

    if (error) {
      console.error(
        "ADMIN WITHDRAWAL LIST ERROR:",
        error
      );

      setNotice(
        `Withdrawal list could not be loaded: ${error.message}`
      );

      setWithdrawals([]);
      return;
    }

    const rows = data || [];

    const userIds = [
      ...new Set(
        rows
          .map(
            (row) =>
              row.user_id
          )
          .filter(Boolean)
      ),
    ];

    const accountIds = [
      ...new Set(
        rows
          .map(
            (row) =>
              row.account_id
          )
          .filter(Boolean)
      ),
    ];

    let profileMap = {};
    let accountMap = {};

    if (userIds.length) {
      const {
        data: profiles,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select(
          "id, full_name, email"
        )
        .in("id", userIds);

      if (!profileError) {
        (profiles || []).forEach(
          (profile) => {
            profileMap[
              profile.id
            ] = profile;
          }
        );
      }
    }

    if (accountIds.length) {
      const {
        data: accountRows,
        error: accountError,
      } = await supabase
        .from("customer_accounts")
        .select(
          "id, account_number, account_type, balance"
        )
        .in("id", accountIds);

      if (!accountError) {
        (accountRows || []).forEach(
          (account) => {
            accountMap[
              account.id
            ] = account;
          }
        );
      }
    }

    setWithdrawals(
      rows.map(
        (row) => ({
          ...row,

          customerName:
            profileMap[
              row.user_id
            ]?.full_name ||
            "Customer",

          customerEmail:
            profileMap[
              row.user_id
            ]?.email || "",

          accountNumber:
            accountMap[
              row.account_id
            ]?.account_number ||
            "Not available",

          accountType:
            accountMap[
              row.account_id
            ]?.account_type ||
            "Checking",

          currentBalance:
            accountMap[
              row.account_id
            ]?.balance,
        })
      )
    );
  }

  /* ==========================================================
     ACCOUNT NUMBER
     ========================================================== */

  function generateAccountNumber() {
    return String(
      Math.floor(
        Math.random() * 1000000000
      )
    ).padStart(9, "0");
  }

  async function getUniqueAccountNumber() {
    for (
      let i = 0;
      i < 20;
      i++
    ) {
      const number =
        generateAccountNumber();

      const {
        data,
        error,
      } = await supabase
        .from("customer_accounts")
        .select("id")
        .eq(
          "account_number",
          number
        )
        .maybeSingle();

      if (error) {
        throw new Error(
          error.message
        );
      }

      if (!data) {
        return number;
      }
    }

    throw new Error(
      "Unable to generate a unique account number."
    );
  }

  /* ==========================================================
     APPROVE CUSTOMER
     ========================================================== */

  async function approveCustomer(
    customer
  ) {
    setNotice(
      "Approving customer..."
    );

    try {
      const {
        data: existing,
        error: existingError,
      } = await supabase
        .from("customer_accounts")
        .select(
          "id, account_number, account_type, status"
        )
        .eq(
          "user_id",
          customer.id
        )
        .maybeSingle();

      if (existingError) {
        throw new Error(
          existingError.message
        );
      }

      let accountNumber =
        existing?.account_number;

      if (!accountNumber) {
        accountNumber =
          await getUniqueAccountNumber();

        if (existing) {
          const {
            error,
          } = await supabase
            .from(
              "customer_accounts"
            )
            .update({
              account_number:
                accountNumber,

              account_type:
                existing.account_type ||
                "checking",

              status: "active",
            })
            .eq(
              "id",
              existing.id
            );

          if (error) {
            throw new Error(
              error.message
            );
          }
        } else {
          const {
            error,
          } = await supabase
            .from(
              "customer_accounts"
            )
            .insert({
              user_id:
                customer.id,

              account_number:
                accountNumber,

              balance: 0,

              account_type:
                "checking",

              status: "active",
            });

          if (error) {
            throw new Error(
              error.message
            );
          }
        }
      }

      const {
        error: approvalError,
      } = await supabase
        .from("profiles")
        .update({
          approval_status:
            "approved",
        })
        .eq(
          "id",
          customer.id
        );

      if (approvalError) {
        throw new Error(
          approvalError.message
        );
      }

      /*
        Send the account approval email through the Supabase Edge Function.

        IMPORTANT:
        The Resend API key is NOT placed in this browser/admin code.
        The Edge Function keeps the Resend API key and service-role
        credentials on the server side.
      */
      let approvalNotice =
        "Customer approved successfully.";

      try {
        const {
          data: emailData,
          error: emailError,
        } = await supabase.functions.invoke(
          "send-account-approval-email",
          {
            body: {
              customerId: customer.id,
            },
          }
        );

        if (emailError) {
          console.error(
            "ACCOUNT APPROVAL EMAIL ERROR:",
            emailError
          );

          approvalNotice =
            "Customer approved successfully, but the approval email could not be sent.";
        } else if (emailData?.error) {
          console.error(
            "ACCOUNT APPROVAL EMAIL ERROR:",
            emailData.error
          );

          approvalNotice =
            "Customer approved successfully, but the approval email could not be sent.";
        } else {
          approvalNotice =
            "Customer approved successfully. Approval email sent.";
        }
      } catch (emailError) {
        console.error(
          "ACCOUNT APPROVAL EMAIL ERROR:",
          emailError
        );

        approvalNotice =
          "Customer approved successfully, but the approval email could not be sent.";
      }

      setNotice(approvalNotice);

      await Promise.all([
        loadPending(),
        loadAccounts(),
      ]);
    } catch (error) {
      console.error(
        "APPROVAL ERROR:",
        error
      );

      setNotice(
        error?.message ||
          "Unable to approve customer."
      );
    }
  }

  /* ==========================================================
     APPROVE WITHDRAWAL
     ========================================================== */

  async function approveWithdrawal(
    request
  ) {
    if (withdrawalAction) {
      return;
    }

    if (
      !window.confirm(
        `Approve a ${formatMoney(
          request.amount
        )} withdrawal for ${
          request.customerName
        }? The account will be debited once.`
      )
    ) {
      return;
    }

    setWithdrawalAction({
      id: request.id,
      type: "approve",
    });

    setNotice(
      "Approving withdrawal and debiting account..."
    );

    try {
      const {
        data,
        error,
      } = await supabase.rpc(
        "admin_approve_withdrawal",
        {
          p_request_id:
            request.id,
        }
      );

      if (error) {
        throw new Error(
          error.message
        );
      }

      const result =
        Array.isArray(data)
          ? data[0]
          : data;

      setNotice(
        `Withdrawal approved. ${
          result?.transaction_id
            ? "Debit transaction created."
            : "Account updated."
        }`
      );

      await Promise.all([
        loadWithdrawals(),
        loadAccounts(),
        loadTransactions(),
      ]);
    } catch (error) {
      console.error(
        "APPROVE WITHDRAWAL ERROR:",
        error
      );

      setNotice(
        error?.message ||
          "Unable to approve withdrawal."
      );
    } finally {
      setWithdrawalAction(
        null
      );
    }
  }

  /* ==========================================================
     REJECT WITHDRAWAL
     ========================================================== */

  async function rejectWithdrawal(
    request
  ) {
    if (withdrawalAction) {
      return;
    }

    const reason =
      window.prompt(
        "Optional rejection reason:",
        "Withdrawal rejected by bank review."
      );

    if (reason === null) {
      return;
    }

    setWithdrawalAction({
      id: request.id,
      type: "reject",
    });

    setNotice(
      "Rejecting withdrawal..."
    );

    try {
      const {
        error,
      } = await supabase.rpc(
        "admin_reject_withdrawal",
        {
          p_request_id:
            request.id,

          p_reason:
            reason.trim() ||
            null,
        }
      );

      if (error) {
        throw new Error(
          error.message
        );
      }

      setNotice(
        "Withdrawal rejected. No balance change was made."
      );

      await loadWithdrawals();
    } catch (error) {
      console.error(
        "REJECT WITHDRAWAL ERROR:",
        error
      );

      setNotice(
        error?.message ||
          "Unable to reject withdrawal."
      );
    } finally {
      setWithdrawalAction(
        null
      );
    }
  }

  /* ==========================================================
     APPROVE CARD
     ========================================================== */

  async function approveCardOrder(
    request
  ) {
    if (cardAction) {
      return;
    }

    if (
      !window.confirm(
        `Approve the ATM / Debit Card request for ${request.customerName}?`
      )
    ) {
      return;
    }

    setCardAction({
      id: request.id,
      type: "approve",
    });

    setNotice(
      "Approving card request..."
    );

    try {
      const {
        data,
        error,
      } = await supabase.rpc(
        "admin_approve_card_order",
        {
          p_request_id:
            request.id,
        }
      );

      if (error) {
        throw new Error(
          error.message
        );
      }

      const result =
        Array.isArray(data)
          ? data[0]
          : data;

      if (
        result?.status &&
        String(
          result.status
        ).toLowerCase() !==
          "approved"
      ) {
        throw new Error(
          "The card request was not approved."
        );
      }

      setNotice(
        "Card request approved and card issued successfully."
      );

      await loadCardOrders();
    } catch (error) {
      console.error(
        "APPROVE CARD ERROR:",
        error
      );

      setNotice(
        error?.message ||
          "Unable to approve card request."
      );
    } finally {
      setCardAction(null);
    }
  }

  /* ==========================================================
     REJECT CARD
     ========================================================== */

  async function rejectCardOrder(
    request
  ) {
    if (cardAction) {
      return;
    }

    const reason =
      window.prompt(
        "Optional rejection reason:",
        "Card request rejected by bank review."
      );

    if (reason === null) {
      return;
    }

    setCardAction({
      id: request.id,
      type: "reject",
    });

    setNotice(
      "Rejecting card request..."
    );

    try {
      const {
        data,
        error,
      } = await supabase.rpc(
        "admin_reject_card_order",
        {
          p_request_id:
            request.id,

          p_reason:
            reason.trim() ||
            null,
        }
      );

      if (error) {
        throw new Error(
          error.message
        );
      }

      const result =
        Array.isArray(data)
          ? data[0]
          : data;

      if (
        result?.status &&
        String(
          result.status
        ).toLowerCase() !==
          "rejected"
      ) {
        throw new Error(
          "The card request was not rejected."
        );
      }

      setNotice(
        "Card request rejected. No card was issued."
      );

      await loadCardOrders();
    } catch (error) {
      console.error(
        "REJECT CARD ERROR:",
        error
      );

      setNotice(
        error?.message ||
          "Unable to reject card request."
      );
    } finally {
      setCardAction(null);
    }
  }

  /* ==========================================================
     ADD TRANSACTION
     ========================================================== */

  async function addTransaction(
    account
  ) {
    const type =
      window.prompt(
        "Enter transaction type: credit or debit",
        "credit"
      );

    if (!type) {
      return;
    }

    const transactionType =
      type.trim().toLowerCase();

    if (
      ![
        "credit",
        "debit",
      ].includes(
        transactionType
      )
    ) {
      return setNotice(
        "Transaction type must be credit or debit."
      );
    }

    const value =
      window.prompt(
        `Enter ${transactionType} amount:`,
        "0.00"
      );

    if (value === null) {
      return;
    }

    const amount =
      Number(value);

    if (
      !Number.isFinite(
        amount
      ) ||
      amount <= 0
    ) {
      return setNotice(
        "Enter a valid amount."
      );
    }

    const description =
      window.prompt(
        "Enter transaction description:",
        transactionType ===
          "credit"
          ? "Incoming Payment"
          : "Service Payment"
      );

    if (
      !description?.trim()
    ) {
      return setNotice(
        "Transaction description is required."
      );
    }

    const now =
      new Date();

    const dateInput =
      window.prompt(
        "Enter transaction date and time (YYYY-MM-DDTHH:MM):",
        toDateTimeLocal(now)
      );

    if (dateInput === null) {
      return;
    }

    const enteredDate =
      new Date(dateInput);

    if (
      Number.isNaN(
        enteredDate.getTime()
      ) ||
      enteredDate > now
    ) {
      return setNotice(
        "Enter a valid transaction date that is not in the future."
      );
    }

    const {
      error,
    } = await supabase
      .from("transactions")
      .insert({
        account_id:
          account.id,

        transaction_type:
          transactionType,

        amount,

        description:
          description.trim(),

        transaction_date:
          enteredDate.toISOString(),
      });

    if (error) {
      return setNotice(
        error.message
      );
    }

    setNotice(
      `${
        transactionType ===
        "credit"
          ? "Credit"
          : "Debit"
      } transaction added successfully.`
    );

    await Promise.all([
      loadAccounts(),
      loadTransactions(),
    ]);
  }

  /* ==========================================================
     FREEZE / UNFREEZE ACCOUNT
     ========================================================== */

  async function toggleAccount(
    account
  ) {
    const newStatus =
      account.status ===
      "active"
        ? "frozen"
        : "active";

    const {
      error,
    } = await supabase
      .from(
        "customer_accounts"
      )
      .update({
        status: newStatus,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        account.id
      );

    if (error) {
      return setNotice(
        error.message
      );
    }

    setNotice(
      newStatus ===
        "frozen"
        ? "Account frozen."
        : "Account activated."
    );

    await loadAccounts();
  }

  /* ==========================================================
     ACCOUNT CREATED DATE
     ========================================================== */

  async function saveCreatedDate(
    account
  ) {
    const localValue =
      createdDateDrafts[
        account.id
      ];

    const parsed =
      new Date(
        localValue || ""
      );

    if (
      !localValue ||
      Number.isNaN(
        parsed.getTime()
      ) ||
      parsed > new Date()
    ) {
      return setNotice(
        "Please enter a valid Account Created date that is not in the future."
      );
    }

    setSavingCreatedDate(
      account.id
    );

    const {
      error,
    } = await supabase
      .from(
        "customer_accounts"
      )
      .update({
        effective_created_at:
          parsed.toISOString(),
      })
      .eq(
        "id",
        account.id
      );

    setSavingCreatedDate(
      null
    );

    if (error) {
      return setNotice(
        error.message
      );
    }

    setNotice(
      "Account Created date updated."
    );

    await loadAccounts();
  }

  async function clearCreatedDateOverride(
    account
  ) {
    setSavingCreatedDate(
      account.id
    );

    const {
      error,
    } = await supabase
      .from(
        "customer_accounts"
      )
      .update({
        effective_created_at:
          null,
      })
      .eq(
        "id",
        account.id
      );

    setSavingCreatedDate(
      null
    );

    if (error) {
      return setNotice(
        error.message
      );
    }

    setNotice(
      "Original Account Created timestamp restored."
    );

    await loadAccounts();
  }

  /* ==========================================================
     SUPPORT TICKET STATUS
     ========================================================== */

  async function updateTicketStatus(
    ticket,
    newStatus
  ) {
    if (ticketAction) {
      return;
    }

    setTicketAction({
      id: ticket.id,
      type: "status",
    });

    setNotice(
      "Updating ticket status..."
    );

    try {
      const {
        error,
      } = await supabase.rpc(
        "admin_update_support_ticket_status",
        {
          p_ticket_id:
            ticket.id,

          p_status:
            newStatus,
        }
      );

      if (error) {
        throw new Error(
          error.message
        );
      }

      setNotice(
        `Ticket status changed to ${newStatus.replace(
          "_",
          " "
        )}. Customer notification sent.`
      );

      await loadSupportTickets();
    } catch (error) {
      console.error(
        "UPDATE TICKET STATUS ERROR:",
        error
      );

      setNotice(
        error?.message ||
          "Unable to update support ticket status."
      );
    } finally {
      setTicketAction(null);
    }
  }

  /* ==========================================================
     SUPPORT TICKET PRIORITY
     ========================================================== */

  async function updateTicketPriority(
    ticket,
    newPriority
  ) {
    if (ticketAction) {
      return;
    }

    setTicketAction({
      id: ticket.id,
      type: "priority",
    });

    setNotice(
      "Updating ticket priority..."
    );

    try {
      const {
        error,
      } = await supabase.rpc(
        "admin_update_support_ticket_priority",
        {
          p_ticket_id:
            ticket.id,

          p_priority:
            newPriority,
        }
      );

      if (error) {
        throw new Error(
          error.message
        );
      }

      setNotice(
        `Ticket priority changed to ${newPriority}.`
      );

      await loadSupportTickets();
    } catch (error) {
      console.error(
        "UPDATE TICKET PRIORITY ERROR:",
        error
      );

      setNotice(
        error?.message ||
          "Unable to update ticket priority."
      );
    } finally {
      setTicketAction(null);
    }
  }

  /* ==========================================================
     SUPPORT TICKET REPLY
     ========================================================== */

  async function replyToSupportTicket(
    ticket
  ) {
    if (ticketAction) {
      return;
    }

    const input =
      document.getElementById(
        `ticket-reply-${ticket.id}`
      );

    const reply =
      input?.value?.trim();

    if (!reply) {
      return setNotice(
        "Please enter a support response."
      );
    }

    const statusInput =
      document.getElementById(
        `ticket-status-${ticket.id}`
      );

    const status =
      statusInput?.value ||
      "in_progress";

    setTicketAction({
      id: ticket.id,
      type: "reply",
    });

    setNotice(
      "Sending support ticket reply..."
    );

    try {
      const {
        error,
      } = await supabase.rpc(
        "admin_reply_support_ticket",
        {
          p_ticket_id:
            ticket.id,

          p_response:
            reply,

          p_status:
            status,
        }
      );

      if (error) {
        throw new Error(
          error.message
        );
      }

      if (input) {
        input.value = "";
      }

      setNotice(
        "Support reply sent. The customer has been notified."
      );

      await loadSupportTickets();
    } catch (error) {
      console.error(
        "SUPPORT TICKET REPLY ERROR:",
        error
      );

      setNotice(
        error?.message ||
          "Unable to send support ticket reply."
      );
    } finally {
      setTicketAction(null);
    }
  }

  /* ==========================================================
     LOGOUT
     ========================================================== */

  async function logout() {
    await supabase.auth.signOut();

    window.location.href =
      "/login";
  }

  /* ==========================================================
     DERIVED DATA
     ========================================================== */

  const activeAccounts =
    useMemo(
      () =>
        accounts.filter(
          (account) =>
            account.status ===
            "active"
        ),
      [accounts]
    );

  const frozenAccounts =
    useMemo(
      () =>
        accounts.filter(
          (account) =>
            account.status ===
            "frozen"
        ),
      [accounts]
    );

  const pendingWithdrawals =
    useMemo(
      () =>
        withdrawals.filter(
          (withdrawal) =>
            String(
              withdrawal.status
            ).toLowerCase() ===
            "pending"
        ),
      [withdrawals]
    );

  const pendingCardOrders =
    useMemo(
      () =>
        cardOrders.filter(
          (card) =>
            String(
              card.status
            ).toLowerCase() ===
            "pending"
        ),
      [cardOrders]
    );

  const openSupportTickets =
    useMemo(
      () =>
        supportTickets.filter(
          (ticket) =>
            [
              "open",
              "in_progress",
            ].includes(
              String(
                ticket.status ||
                  ""
              ).toLowerCase()
            )
        ),
      [supportTickets]
    );

  const unresolvedSupportTickets =
    useMemo(
      () =>
        supportTickets.filter(
          (ticket) =>
            ![
              "resolved",
              "closed",
            ].includes(
              String(
                ticket.status ||
                  ""
              ).toLowerCase()
            )
        ),
      [supportTickets]
    );

  /* ==========================================================
     COMPLAINTS
     ========================================================== */

  const complaints =
    useMemo(() => {
      return supportTickets.filter(
        (ticket) => {
          const requestType =
            String(
              ticket.request_type ||
                ""
            ).toLowerCase();

          if (
            requestType ===
            "complaint"
          ) {
            return true;
          }

          if (!requestType) {
            const category =
              String(
                ticket.category ||
                  ""
              ).toLowerCase();

            return !(
              category.includes(
                "problem"
              ) ||
              category.includes(
                "report"
              )
            );
          }

          return false;
        }
      );
    }, [supportTickets]);

  /* ==========================================================
     REPORTED PROBLEMS
     ========================================================== */

  const reportedProblems =
    useMemo(() => {
      return supportTickets.filter(
        (ticket) => {
          const requestType =
            String(
              ticket.request_type ||
                ""
            ).toLowerCase();

          if (
            requestType ===
            "problem"
          ) {
            return true;
          }

          if (!requestType) {
            const category =
              String(
                ticket.category ||
                  ""
              ).toLowerCase();

            return (
              category.includes(
                "problem"
              ) ||
              category.includes(
                "report"
              )
            );
          }

          return false;
        }
      );
    }, [supportTickets]);

  const openChats =
    useMemo(
      () =>
        chatConversations.filter(
          (conversation) =>
            conversation.status ===
            "open"
        ),
      [chatConversations]
    );

  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
    return (
      <main>
        <span className="real-badge">
          ADMIN
        </span>

        <h1>
          Administrator Dashboard
        </h1>

        <p>
          Loading administration
          panel...
        </p>
      </main>
    );
  }

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <main>
      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="dashboard-header">
        <div>
          <span className="real-badge">
            ADMIN
          </span>

          <h1>
            Administrator Dashboard
          </h1>

          <p>
            Customer, account,
            withdrawal, card and
            support management.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={logout}
        >
          Sign Out
        </button>
      </div>

      {/* ======================================================
          NOTICE
          ====================================================== */}

      {notice && (
        <div className="notification">
          <p>{notice}</p>
        </div>
      )}

      {/* ======================================================
          NAVIGATION
          ====================================================== */}

      <nav
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        <button
          className="primary-button"
          onClick={() =>
            setActiveSection(
              "overview"
            )
          }
        >
          Overview
        </button>

        <button
          className="primary-button"
          onClick={() =>
            setActiveSection(
              "pending"
            )
          }
        >
          Pending (
          {pending.length})
        </button>

        <button
          className="primary-button"
          onClick={() =>
            setActiveSection(
              "withdrawals"
            )
          }
        >
          Withdrawals (
          {
            pendingWithdrawals.length
          }
          )
        </button>

        <button
          className="primary-button"
          onClick={() =>
            setActiveSection(
              "cards"
            )
          }
        >
          Card Requests (
          {
            pendingCardOrders.length
          }
          )
        </button>

        <button
          className="primary-button"
          onClick={() =>
            setActiveSection(
              "accounts"
            )
          }
        >
          Accounts (
          {accounts.length})
        </button>
      </nav>

      {/* ======================================================
          SUPPORT NAVIGATION
          ====================================================== */}

      <div
        style={{
          marginBottom: "28px",
          padding: "16px",
          borderRadius: "12px",
          border:
            "1px solid rgba(0,0,0,0.08)",
          background:
            "rgba(0,0,0,0.02)",
        }}
      >
        <strong
          style={{
            display: "block",
            marginBottom: "10px",
            fontSize: "12px",
            letterSpacing:
              "0.08em",
          }}
        >
          SUPPORT
        </strong>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <button
            className="primary-button"
            onClick={() =>
              setActiveSection(
                "live-chat"
              )
            }
          >
            💬 Live Chat (
            {openChats.length})
          </button>

          <button
            className="primary-button"
            onClick={() =>
              setActiveSection(
                "complaints"
              )
            }
          >
            📩 Complaints (
            {complaints.length})
          </button>

          <button
            className="primary-button"
            onClick={() =>
              setActiveSection(
                "problems"
              )
            }
          >
            🚨 Reported Problems (
            {reportedProblems.length})
          </button>
        </div>
      </div>

      {/* ======================================================
          OVERVIEW
          ====================================================== */}

      {activeSection ===
        "overview" && (
        <>
          <section>
            <h2>
              Overview
            </h2>

            <div className="dashboard-grid">
              <div className="notification">
                <h3>
                  Pending Customers
                </h3>

                <h2>
                  {pending.length}
                </h2>
              </div>

              <div className="notification">
                <h3>
                  Pending Withdrawals
                </h3>

                <h2>
                  {
                    pendingWithdrawals.length
                  }
                </h2>
              </div>

              <div className="notification">
                <h3>
                  Pending Card Requests
                </h3>

                <h2>
                  {
                    pendingCardOrders.length
                  }
                </h2>
              </div>

              <div className="notification">
                <h3>
                  Open Support Tickets
                </h3>

                <h2>
                  {
                    openSupportTickets.length
                  }
                </h2>
              </div>

              <div className="notification">
                <h3>
                  Live Chat
                </h3>

                <h2>
                  {openChats.length}
                </h2>

                <p>
                  Open customer
                  conversations
                </p>
              </div>

              <div className="notification">
                <h3>
                  Complaints
                </h3>

                <h2>
                  {complaints.length}
                </h2>
              </div>

              <div className="notification">
                <h3>
                  Reported Problems
                </h3>

                <h2>
                  {
                    reportedProblems.length
                  }
                </h2>
              </div>

              <div className="notification">
                <h3>
                  Active Accounts
                </h3>

                <h2>
                  {
                    activeAccounts.length
                  }
                </h2>
              </div>

              <div className="notification">
                <h3>
                  Frozen Accounts
                </h3>

                <h2>
                  {
                    frozenAccounts.length
                  }
                </h2>
              </div>
            </div>
          </section>

          <section>
            <h2>
              Recent Activity
            </h2>

            <div className="transaction-list">
              {transactions
                .slice(0, 5)
                .map(
                  (
                    transaction
                  ) => (
                    <div
                      className="transaction"
                      key={
                        transaction.id
                      }
                    >
                      <div>
                        <strong>
                          {transaction.description ||
                            "Transaction"}
                        </strong>

                        <p>
                          {transaction.transaction_type ===
                          "credit"
                            ? "+"
                            : "-"}
                          $
                          {formatMoney(
                            transaction.amount
                          )}
                        </p>

                        <p>
                          {formatDate(
                            transaction.transaction_date
                          )}
                        </p>
                      </div>
                    </div>
                  )
                )}

              {!transactions.length && (
                <div className="notification">
                  <p>
                    No transactions
                    recorded.
                  </p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ======================================================
          PENDING CUSTOMERS
          ====================================================== */}

      {activeSection ===
        "pending" && (
        <section>
          <h2>
            Pending Customer
            Approvals
          </h2>

          {!pending.length ? (
            <div className="notification">
              <p>
                No pending
                customers.
              </p>
            </div>
          ) : (
            <div className="transaction-list">
              {pending.map(
                (customer) => (
                  <div
                    className="transaction"
                    key={
                      customer.id
                    }
                  >
                    <div>
                      <strong>
                        {customer.full_name ||
                          "Customer"}
                      </strong>

                      <p>
                        Email:{" "}
                        {customer.email ||
                          "Not available"}
                      </p>

                      <p>
                        Status:{" "}
                        {
                          customer.approval_status
                        }
                      </p>

                      <p>
                        Registered:{" "}
                        {formatDate(
                          customer.created_at
                        )}
                      </p>
                    </div>

                    <button
                      className="primary-button"
                      onClick={() =>
                        approveCustomer(
                          customer
                        )
                      }
                    >
                      Approve Customer
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      )}

      {/* ======================================================
          WITHDRAWALS
          ====================================================== */}

      {activeSection ===
        "withdrawals" && (
        <section>
          <h2>
            Withdrawal Requests
          </h2>

          <p>
            Pending withdrawals do
            not change the customer
            balance. Approval performs
            the debit and creates the
            debit transaction
            atomically.
          </p>

          {!withdrawals.length ? (
            <div className="notification">
              <p>
                No withdrawal
                requests found.
              </p>
            </div>
          ) : (
            <div className="transaction-list">
              {withdrawals.map(
                (request) => {
                  const pendingRequest =
                    String(
                      request.status
                    ).toLowerCase() ===
                    "pending";

                  const busy =
                    withdrawalAction?.id ===
                    request.id;

                  return (
                    <div
                      className="transaction"
                      key={
                        request.id
                      }
                    >
                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <strong>
                          {
                            request.customerName
                          }
                        </strong>

                        <p>
                          Email:{" "}
                          {request.customerEmail ||
                            "Not available"}
                        </p>

                        <p>
                          Account:{" "}
                          {
                            request.accountNumber
                          }
                        </p>

                        <p>
                          Method:{" "}
                          {request.withdrawal_method ||
                            "Cash"}
                        </p>

                        <p>
                          Amount:{" "}
                          <strong>
                            $
                            {formatMoney(
                              request.amount
                            )}
                          </strong>
                        </p>

                        <p>
                          Status:{" "}
                          <span
                            className={statusClass(
                              request.status
                            )}
                          >
                            {
                              request.status
                            }
                          </span>
                        </p>

                        <p>
                          Requested:{" "}
                          {formatDate(
                            request.created_at
                          )}
                        </p>

                        {request.notes && (
                          <p>
                            Notes:{" "}
                            {
                              request.notes
                            }
                          </p>
                        )}

                        {request.currentBalance !==
                          undefined && (
                          <p>
                            Current balance:
                            {" "}
                            $
                            {formatMoney(
                              request.currentBalance
                            )}
                          </p>
                        )}
                      </div>

                      {pendingRequest && (
                        <div
                          style={{
                            display:
                              "flex",
                            flexDirection:
                              "column",
                            gap: "8px",
                            minWidth:
                              "190px",
                          }}
                        >
                          <button
                            className="primary-button"
                            disabled={
                              !!withdrawalAction
                            }
                            onClick={() =>
                              approveWithdrawal(
                                request
                              )
                            }
                          >
                            {busy &&
                            withdrawalAction.type ===
                              "approve"
                              ? "Approving..."
                              : "Approve & Debit"}
                          </button>

                          <button
                            className="primary-button"
                            disabled={
                              !!withdrawalAction
                            }
                            onClick={() =>
                              rejectWithdrawal(
                                request
                              )
                            }
                          >
                            {busy &&
                            withdrawalAction.type ===
                              "reject"
                              ? "Rejecting..."
                              : "Reject"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>
      )}

      {/* ======================================================
          CARD REQUESTS
          ====================================================== */}

      {activeSection ===
        "cards" && (
        <section>
          <h2>
            ATM / Debit Card
            Requests
          </h2>

          <p>
            Review customer card
            requests. Approval issues
            a card record; rejection
            does not issue a card.
          </p>

          {!cardOrders.length ? (
            <div className="notification">
              <p>
                No card requests
                found.
              </p>
            </div>
          ) : (
            <div className="transaction-list">
              {cardOrders.map(
                (request) => {
                  const pendingRequest =
                    String(
                      request.status
                    ).toLowerCase() ===
                    "pending";

                  const busy =
                    cardAction?.id ===
                    request.id;

                  return (
                    <div
                      className="transaction"
                      key={
                        request.id
                      }
                    >
                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <strong>
                          {
                            request.customerName
                          }
                        </strong>

                        <p>
                          Email:{" "}
                          {request.customerEmail ||
                            "Not available"}
                        </p>

                        <p>
                          Account:{" "}
                          {
                            request.accountNumber
                          }
                        </p>

                        <p>
                          Card type:{" "}
                          {request.card_type ||
                            "ATM / Debit Card"}
                        </p>

                        <p>
                          Reason:{" "}
                          {request.reason ||
                            "Card requested by customer"}
                        </p>

                        <p>
                          Status:{" "}
                          <span
                            className={statusClass(
                              request.status
                            )}
                          >
                            {
                              request.status
                            }
                          </span>
                        </p>

                        <p>
                          Requested:{" "}
                          {formatDate(
                            request.created_at
                          )}
                        </p>

                        {request.updated_at && (
                          <p>
                            Updated:{" "}
                            {formatDate(
                              request.updated_at
                            )}
                          </p>
                        )}
                      </div>

                      {pendingRequest && (
                        <div
                          style={{
                            display:
                              "flex",
                            flexDirection:
                              "column",
                            gap: "8px",
                            minWidth:
                              "190px",
                          }}
                        >
                          <button
                            className="primary-button"
                            disabled={
                              !!cardAction
                            }
                            onClick={() =>
                              approveCardOrder(
                                request
                              )
                            }
                          >
                            {busy &&
                            cardAction.type ===
                              "approve"
                              ? "Approving..."
                              : "Approve & Issue Card"}
                          </button>

                          <button
                            className="primary-button"
                            disabled={
                              !!cardAction
                            }
                            onClick={() =>
                              rejectCardOrder(
                                request
                              )
                            }
                          >
                            {busy &&
                            cardAction.type ===
                              "reject"
                              ? "Rejecting..."
                              : "Reject"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>
      )}

      {/* ======================================================
          ACCOUNTS
          ====================================================== */}

      {activeSection ===
        "accounts" && (
        <>
          <section>
            <h2>
              Customer Accounts
            </h2>

            {!accounts.length ? (
              <div className="notification">
                <p>
                  No customer
                  accounts found.
                </p>
              </div>
            ) : (
              <div className="transaction-list">
                {accounts.map(
                  (account) => {
                    const hasOverride =
                      Boolean(
                        account.effective_created_at
                      );

                    return (
                      <div
                        className="transaction"
                        key={
                          account.id
                        }
                      >
                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <strong>
                            {
                              account.customerName
                            }
                          </strong>

                          <p>
                            Email:{" "}
                            {account.customerEmail ||
                              "Not available"}
                          </p>

                          <p>
                            Account No:{" "}
                            {account.account_number ||
                              "Not assigned"}
                          </p>

                          <p>
                            Account type:{" "}
                            {account.account_type ||
                              "Checking"}
                          </p>

                          <p>
                            Status:{" "}
                            {account.status}
                          </p>

                          <p>
                            Balance: $
                            {formatMoney(
                              account.balance
                            )}
                          </p>

                          <p>
                            <strong>
                              Original Created:
                            </strong>{" "}
                            {formatDate(
                              account.created_at
                            )}
                          </p>

                          <p>
                            <strong>
                              Displayed Created:
                            </strong>{" "}
                            {formatDate(
                              account.effective_created_at ||
                                account.created_at
                            )}

                            {hasOverride
                              ? " (admin override)"
                              : " (original)"}
                          </p>

                          <div
                            style={{
                              marginTop:
                                "14px",
                              paddingTop:
                                "14px",
                              borderTop:
                                "1px solid rgba(0,0,0,0.08)",
                            }}
                          >
                            <label
                              htmlFor={`created-date-${account.id}`}
                              style={{
                                display:
                                  "block",
                                fontWeight:
                                  700,
                                marginBottom:
                                  "7px",
                              }}
                            >
                              Account Created
                              Date & Time
                            </label>

                            <input
                              id={`created-date-${account.id}`}
                              type="datetime-local"
                              value={
                                createdDateDrafts[
                                  account.id
                                ] || ""
                              }
                              onChange={(
                                event
                              ) =>
                                setCreatedDateDrafts(
                                  (
                                    current
                                  ) => ({
                                    ...current,

                                    [account.id]:
                                      event
                                        .target
                                        .value,
                                  })
                                )
                              }
                              style={{
                                width:
                                  "100%",
                                maxWidth:
                                  "360px",
                                padding:
                                  "10px",
                                border:
                                  "1px solid #ccc",
                                borderRadius:
                                  "8px",
                              }}
                            />

                            <div
                              style={{
                                display:
                                  "flex",
                                flexWrap:
                                  "wrap",
                                gap: "8px",
                                marginTop:
                                  "8px",
                              }}
                            >
                              <button
                                type="button"
                                className="primary-button"
                                onClick={() =>
                                  saveCreatedDate(
                                    account
                                  )
                                }
                                disabled={
                                  savingCreatedDate ===
                                  account.id
                                }
                              >
                                {savingCreatedDate ===
                                account.id
                                  ? "Saving..."
                                  : "Save Created Date"}
                              </button>

                              {hasOverride && (
                                <button
                                  type="button"
                                  className="primary-button"
                                  onClick={() =>
                                    clearCreatedDateOverride(
                                      account
                                    )
                                  }
                                  disabled={
                                    savingCreatedDate ===
                                    account.id
                                  }
                                >
                                  Use Original
                                  Date
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            flexDirection:
                              "column",
                            gap: "8px",
                            minWidth:
                              "190px",
                          }}
                        >
                          <button
                            className="primary-button"
                            onClick={() =>
                              addTransaction(
                                account
                              )
                            }
                          >
                            Add Transaction
                          </button>

                          <button
                            className="primary-button"
                            onClick={() =>
                              toggleAccount(
                                account
                              )
                            }
                          >
                            {account.status ===
                            "active"
                              ? "Freeze Account"
                              : "Unfreeze Account"}
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </section>

          <section>
            <h2>
              Recent Transactions
            </h2>

            <div className="transaction-list">
              {transactions.map(
                (transaction) => (
                  <div
                    className="transaction"
                    key={
                      transaction.id
                    }
                  >
                    <div>
                      <strong>
                        {transaction.description ||
                          "Transaction"}
                      </strong>

                      <p>
                        Type:{" "}
                        {
                          transaction.transaction_type
                        }
                      </p>

                      <p>
                        Amount:{" "}
                        {transaction.transaction_type ===
                        "credit"
                          ? "+"
                          : "-"}
                        $
                        {formatMoney(
                          transaction.amount
                        )}
                      </p>

                      <p>
                        Date:{" "}
                        {formatDate(
                          transaction.transaction_date
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}

              {!transactions.length && (
                <div className="notification">
                  <p>
                    No transactions
                    recorded.
                  </p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ======================================================
          LIVE CHAT
          ====================================================== */}

      {activeSection ===
        "live-chat" && (
        <section>
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "flex-start",
              gap: "15px",
              flexWrap:
                "wrap",
              marginBottom:
                "18px",
            }}
          >
            <div>
              <h2>
                💬 Live Chat
              </h2>

              <p>
                View and respond to
                customer conversations
                in real time.
              </p>
            </div>

            <div
              style={{
                padding:
                  "12px 15px",
                borderRadius:
                  "10px",
                background:
                  "rgba(0,0,0,0.04)",
                minWidth:
                  "220px",
              }}
            >
              <strong>
                Chat Retention
              </strong>

              <select
                value={
                  chatRetentionHours
                }
                onChange={(event) =>
                  setChatRetentionHours(
                    Number(
                      event.target
                        .value
                    )
                  )
                }
                style={{
                  display:
                    "block",
                  width:
                    "100%",
                  marginTop:
                    "7px",
                  padding:
                    "9px",
                  border:
                    "1px solid #ccc",
                  borderRadius:
                    "8px",
                }}
              >
                <option value={24}>
                  Delete after 24 hours
                </option>

                <option value={48}>
                  Delete after 48 hours
                </option>
              </select>

              <small
                style={{
                  display:
                    "block",
                  marginTop:
                    "7px",
                  opacity:
                    0.65,
                }}
              >
                Automatic cleanup is
                controlled by the
                Supabase scheduled job.
              </small>
            </div>
          </div>

          {!chatConversations.length ? (
            <div className="notification">
              <h3>
                No live chat
                conversations
              </h3>

              <p>
                Customer live chat
                conversations will
                appear here.
              </p>
            </div>
          ) : (
            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "minmax(260px, 360px) minmax(0, 1fr)",
                minHeight:
                  "650px",
                border:
                  "1px solid rgba(0,0,0,0.10)",
                borderRadius:
                  "14px",
                overflow:
                  "hidden",
                background:
                  "#fff",
              }}
            >
              {/* ============================================
                  CONVERSATION LIST
                  ============================================ */}

              <div
                style={{
                  borderRight:
                    "1px solid rgba(0,0,0,0.10)",
                  overflowY:
                    "auto",
                }}
              >
                <div
                  style={{
                    padding:
                      "16px",
                    borderBottom:
                      "1px solid rgba(0,0,0,0.10)",
                    fontWeight:
                      800,
                  }}
                >
                  Conversations (
                  {
                    chatConversations.length
                  }
                  )
                </div>

                {chatConversations.map(
                  (
                    conversation
                  ) => {
                    const active =
                      selectedChat?.id ===
                      conversation.id;

                    return (
                      <button
                        type="button"
                        key={
                          conversation.id
                        }
                        onClick={() =>
                          openLiveChat(
                            conversation
                          )
                        }
                        style={{
                          width:
                            "100%",
                          display:
                            "flex",
                          gap:
                            "11px",
                          textAlign:
                            "left",
                          border:
                            "0",
                          borderBottom:
                            "1px solid rgba(0,0,0,0.07)",
                          padding:
                            "15px",
                          cursor:
                            "pointer",
                          background:
                            active
                              ? "rgba(0,80,180,0.08)"
                              : "#fff",
                        }}
                      >
                        <div
                          style={{
                            width:
                              "42px",
                            height:
                              "42px",
                            minWidth:
                              "42px",
                            borderRadius:
                              "50%",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            background:
                              "#e8eef8",
                            fontWeight:
                              800,
                          }}
                        >
                          {(
                            conversation.customerName ||
                            "C"
                          )
                            .charAt(
                              0
                            )
                            .toUpperCase()}
                        </div>

                        <div
                          style={{
                            minWidth:
                              0,
                            flex:
                              1,
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              gap:
                                "7px",
                            }}
                          >
                            <strong
                              style={{
                                overflow:
                                  "hidden",
                                textOverflow:
                                  "ellipsis",
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {
                                conversation.customerName
                              }
                            </strong>

                            <small>
                              {formatDate(
                                conversation.last_message_at
                              )}
                            </small>
                          </div>

                          <div
                            style={{
                              fontSize:
                                "12px",
                              opacity:
                                0.65,
                              marginTop:
                                "3px",
                              overflow:
                                "hidden",
                              textOverflow:
                                "ellipsis",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {
                              conversation.customerEmail
                            }
                          </div>

                          <div
                            style={{
                              display:
                                "flex",
                              gap:
                                "7px",
                              marginTop:
                                "7px",
                              fontSize:
                                "11px",
                            }}
                          >
                            <span
                              className={statusClass(
                                conversation.status
                              )}
                            >
                              {
                                conversation.status
                              }
                            </span>

                            <span>
                              {
                                conversation.message_count
                              }{" "}
                              messages
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>

              {/* ============================================
                  CHAT WINDOW
                  ============================================ */}

              <div
                style={{
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  minWidth:
                    0,
                  background:
                    "#f8fafc",
                }}
              >
                {!selectedChat ? (
                  <div
                    style={{
                      flex: 1,
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      textAlign:
                        "center",
                      padding:
                        "30px",
                      opacity:
                        0.7,
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          "42px",
                        marginBottom:
                          "12px",
                      }}
                    >
                      💬
                    </div>

                    <h3>
                      Select a
                      conversation
                    </h3>

                    <p>
                      Select a customer
                      on the left to
                      view the complete
                      conversation.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* CHAT HEADER */}

                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        gap:
                          "12px",
                        padding:
                          "15px 18px",
                        background:
                          "#fff",
                        borderBottom:
                          "1px solid rgba(0,0,0,0.10)",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <div>
                        <strong>
                          {
                            selectedChat.customerName
                          }
                        </strong>

                        <p
                          style={{
                            margin:
                              "3px 0 0",
                            fontSize:
                              "12px",
                            opacity:
                              0.65,
                          }}
                        >
                          {
                            selectedChat.customerEmail
                          }
                        </p>
                      </div>

                      <div
                        style={{
                          display:
                            "flex",
                          gap:
                            "8px",
                          flexWrap:
                            "wrap",
                        }}
                      >
                        {selectedChat.status ===
                          "open" && (
                          <button
                            type="button"
                            className="primary-button"
                            disabled={
                              !!chatAction
                            }
                            onClick={() =>
                              closeLiveChat(
                                selectedChat
                              )
                            }
                          >
                            {chatAction ===
                            selectedChat.id
                              ? "Working..."
                              : "Close Chat"}
                          </button>
                        )}

                        <button
                          type="button"
                          className="primary-button"
                          disabled={
                            !!chatAction
                          }
                          onClick={() =>
                            deleteLiveChat(
                              selectedChat
                            )
                          }
                        >
                          {chatAction ===
                          selectedChat.id
                            ? "Working..."
                            : "Delete Chat"}
                        </button>
                      </div>
                    </div>

                    {/* MESSAGES */}

                    <div
                      style={{
                        flex:
                          1,
                        overflowY:
                          "auto",
                        padding:
                          "22px",
                      }}
                    >
                      {chatLoading ? (
                        <div
                          style={{
                            textAlign:
                              "center",
                            padding:
                              "40px",
                            opacity:
                              0.65,
                          }}
                        >
                          Loading
                          conversation...
                        </div>
                      ) : !chatMessages.length ? (
                        <div
                          style={{
                            textAlign:
                              "center",
                            padding:
                              "40px",
                            opacity:
                              0.65,
                          }}
                        >
                          No messages
                          yet.
                        </div>
                      ) : (
                        chatMessages.map(
                          (
                            message
                          ) => {
                            const isCustomer =
                              message.sender ===
                              "customer";

                            return (
                              <div
                                key={
                                  message.id
                                }
                                style={{
                                  display:
                                    "flex",
                                  flexDirection:
                                    "column",
                                  alignItems:
                                    isCustomer
                                      ? "flex-start"
                                      : "flex-end",
                                  marginBottom:
                                    "18px",
                                }}
                              >
                                <small
                                  style={{
                                    marginBottom:
                                      "5px",
                                    opacity:
                                      0.55,
                                    fontWeight:
                                      700,
                                  }}
                                >
                                  {isCustomer
                                    ? selectedChat.customerName
                                    : "MIDATLANTIC FEDERAL BANK"}
                                </small>

                                <div
                                  style={{
                                    maxWidth:
                                      "75%",
                                    padding:
                                      "11px 14px",
                                    borderRadius:
                                      "14px",
                                    background:
                                      isCustomer
                                        ? "#fff"
                                        : "#eaf2ff",
                                    border:
                                      "1px solid rgba(0,0,0,0.08)",
                                    whiteSpace:
                                      "pre-wrap",
                                    overflowWrap:
                                      "anywhere",
                                  }}
                                >
                                  {
                                    message.message
                                  }
                                </div>

                                <small
                                  style={{
                                    marginTop:
                                      "5px",
                                    opacity:
                                      0.5,
                                    fontSize:
                                      "10px",
                                  }}
                                >
                                  {formatDate(
                                    message.created_at
                                  )}
                                </small>
                              </div>
                            );
                          }
                        )
                      )}
                    </div>

                    {/* COMPOSER */}

                    <div
                      style={{
                        padding:
                          "14px",
                        background:
                          "#fff",
                        borderTop:
                          "1px solid rgba(0,0,0,0.10)",
                      }}
                    >
                      {selectedChat.status ===
                      "closed" ? (
                        <div
                          style={{
                            padding:
                              "13px",
                            textAlign:
                              "center",
                            background:
                              "rgba(0,0,0,0.04)",
                            borderRadius:
                              "8px",
                            opacity:
                              0.7,
                          }}
                        >
                          This
                          conversation
                          is closed.
                        </div>
                      ) : (
                        <div
                          style={{
                            display:
                              "flex",
                            gap:
                              "10px",
                            alignItems:
                              "flex-end",
                          }}
                        >
                          <textarea
                            value={
                              chatReply
                            }
                            onChange={(
                              event
                            ) =>
                              setChatReply(
                                event
                                  .target
                                  .value
                              )
                            }
                            placeholder="Type your reply..."
                            rows={3}
                            style={{
                              flex:
                                1,
                              minWidth:
                                0,
                              padding:
                                "11px",
                              resize:
                                "vertical",
                              border:
                                "1px solid #ccc",
                              borderRadius:
                                "9px",
                              boxSizing:
                                "border-box",
                            }}
                            onKeyDown={(
                              event
                            ) => {
                              if (
                                event.key ===
                                  "Enter" &&
                                !event.shiftKey
                              ) {
                                event.preventDefault();

                                sendLiveChatReply();
                              }
                            }}
                          />

                          <button
                            type="button"
                            className="primary-button"
                            disabled={
                              !!chatAction ||
                              !chatReply.trim()
                            }
                            onClick={
                              sendLiveChatReply
                            }
                          >
                            {chatAction ===
                            selectedChat.id
                              ? "Sending..."
                              : "Send Reply"}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ======================================================
          COMPLAINTS
          ====================================================== */}

      {activeSection ===
        "complaints" && (
        <section>
          <h2>
            📩 Complaints
          </h2>

          <p>
            Customer complaints are
            separated from live chat
            and reported problems.
          </p>

          {!complaints.length ? (
            <div className="notification">
              <h3>
                No complaints
              </h3>

              <p>
                There are currently
                no customer complaints.
              </p>
            </div>
          ) : (
            <div className="transaction-list">
              {complaints.map(
                (ticket) => {
                  const busy =
                    ticketAction?.id ===
                    ticket.id;

                  return (
                    <div
                      className="notification"
                      key={
                        ticket.id
                      }
                      style={{
                        marginBottom:
                          "16px",
                      }}
                    >
                      <h3>
                        📩 Complaint
                      </h3>

                      <p>
                        <strong>
                          Customer:
                        </strong>{" "}
                        {
                          ticket.customerName
                        }
                      </p>

                      <p>
                        <strong>
                          Email:
                        </strong>{" "}
                        {ticket.customerEmail ||
                          "Not available"}
                      </p>

                      <p>
                        <strong>
                          Subject:
                        </strong>{" "}
                        {ticket.subject ||
                          "Customer Complaint"}
                      </p>

                      <p>
                        <strong>
                          Category:
                        </strong>{" "}
                        {ticket.category ||
                          "General"}
                      </p>

                      <p>
                        <strong>
                          Created:
                        </strong>{" "}
                        {formatDate(
                          ticket.created_at
                        )}
                      </p>

                      <p>
                        <strong>
                          Priority:
                        </strong>{" "}
                        <span
                          className={priorityClass(
                            ticket.priority
                          )}
                        >
                          {ticket.priority ||
                            "normal"}
                        </span>
                      </p>

                      <p>
                        <strong>
                          Status:
                        </strong>{" "}
                        <span
                          className={supportStatusClass(
                            ticket.status
                          )}
                        >
                          {ticket.status ||
                            "open"}
                        </span>
                      </p>

                      <hr />

                      <p>
                        <strong>
                          Customer
                          Description
                        </strong>
                      </p>

                      <div
                        style={{
                          padding:
                            "12px",
                          borderRadius:
                            "8px",
                          background:
                            "rgba(0,0,0,0.04)",
                          whiteSpace:
                            "pre-wrap",
                          overflowWrap:
                            "anywhere",
                        }}
                      >
                        {ticket.description ||
                          ticket.message ||
                          "No description provided."}
                      </div>

                      {ticket.admin_response && (
                        <>
                          <hr />

                          <p>
                            <strong>
                              Latest Admin
                              Response
                            </strong>
                          </p>

                          <div
                            style={{
                              padding:
                                "12px",
                              borderRadius:
                                "8px",
                              background:
                                "rgba(0,0,0,0.04)",
                              whiteSpace:
                                "pre-wrap",
                              overflowWrap:
                                "anywhere",
                            }}
                          >
                            {
                              ticket.admin_response
                            }
                          </div>
                        </>
                      )}

                      <hr />

                      <div
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(180px, 1fr))",
                          gap:
                            "12px",
                        }}
                      >
                        <div>
                          <label
                            htmlFor={`complaint-status-${ticket.id}`}
                            style={{
                              display:
                                "block",
                              fontWeight:
                                700,
                              marginBottom:
                                "6px",
                            }}
                          >
                            Status
                          </label>

                          <select
                            id={`complaint-status-${ticket.id}`}
                            defaultValue={
                              ticket.status ||
                              "open"
                            }
                            disabled={
                              !!ticketAction
                            }
                            onChange={(
                              event
                            ) =>
                              updateTicketStatus(
                                ticket,
                                event
                                  .target
                                  .value
                              )
                            }
                            style={{
                              width:
                                "100%",
                              padding:
                                "10px",
                              border:
                                "1px solid #ccc",
                              borderRadius:
                                "8px",
                            }}
                          >
                            <option value="open">
                              Open
                            </option>

                            <option value="in_progress">
                              In Progress
                            </option>

                            <option value="resolved">
                              Resolved
                            </option>

                            <option value="closed">
                              Closed
                            </option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor={`complaint-priority-${ticket.id}`}
                            style={{
                              display:
                                "block",
                              fontWeight:
                                700,
                              marginBottom:
                                "6px",
                            }}
                          >
                            Priority
                          </label>

                          <select
                            id={`complaint-priority-${ticket.id}`}
                            defaultValue={
                              ticket.priority ||
                              "normal"
                            }
                            disabled={
                              !!ticketAction
                            }
                            onChange={(
                              event
                            ) =>
                              updateTicketPriority(
                                ticket,
                                event
                                  .target
                                  .value
                              )
                            }
                            style={{
                              width:
                                "100%",
                              padding:
                                "10px",
                              border:
                                "1px solid #ccc",
                              borderRadius:
                                "8px",
                            }}
                          >
                            <option value="low">
                              Low
                            </option>

                            <option value="normal">
                              Normal
                            </option>

                            <option value="high">
                              High
                            </option>

                            <option value="urgent">
                              Urgent
                            </option>
                          </select>
                        </div>
                      </div>

                      <textarea
                        id={`ticket-reply-${ticket.id}`}
                        rows={5}
                        placeholder="Write your response to the customer..."
                        disabled={
                          !!ticketAction
                        }
                        style={{
                          width:
                            "100%",
                          marginTop:
                            "14px",
                          padding:
                            "12px",
                          resize:
                            "vertical",
                          border:
                            "1px solid #ccc",
                          borderRadius:
                            "8px",
                          boxSizing:
                            "border-box",
                        }}
                      />

                      <button
                        className="primary-button"
                        disabled={
                          !!ticketAction
                        }
                        onClick={() =>
                          replyToSupportTicket(
                            ticket
                          )
                        }
                        style={{
                          marginTop:
                            "10px",
                        }}
                      >
                        {busy &&
                        ticketAction.type ===
                          "reply"
                          ? "Sending..."
                          : "Reply & Notify Customer"}
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>
      )}

      {/* ======================================================
          REPORTED PROBLEMS
          ====================================================== */}

      {activeSection ===
        "problems" && (
        <section>
          <h2>
            🚨 Reported Problems
          </h2>

          <p>
            Account, security,
            technical and other
            problems reported by
            customers.
          </p>

          {!reportedProblems.length ? (
            <div className="notification">
              <h3>
                No reported problems
              </h3>

              <p>
                There are currently
                no reported problems.
              </p>
            </div>
          ) : (
            <div className="transaction-list">
              {reportedProblems.map(
                (ticket) => {
                  const busy =
                    ticketAction?.id ===
                    ticket.id;

                  return (
                    <div
                      className="notification"
                      key={
                        ticket.id
                      }
                      style={{
                        marginBottom:
                          "16px",
                        borderLeft:
                          "4px solid #d92d20",
                      }}
                    >
                      <h3>
                        🚨 Reported
                        Problem
                      </h3>

                      <p>
                        <strong>
                          Customer:
                        </strong>{" "}
                        {
                          ticket.customerName
                        }
                      </p>

                      <p>
                        <strong>
                          Email:
                        </strong>{" "}
                        {ticket.customerEmail ||
                          "Not available"}
                      </p>

                      <p>
                        <strong>
                          Subject:
                        </strong>{" "}
                        {ticket.subject ||
                          "Reported Problem"}
                      </p>

                      <p>
                        <strong>
                          Category:
                        </strong>{" "}
                        {ticket.category ||
                          "Problem Report"}
                      </p>

                      <p>
                        <strong>
                          Created:
                        </strong>{" "}
                        {formatDate(
                          ticket.created_at
                        )}
                      </p>

                      <p>
                        <strong>
                          Priority:
                        </strong>{" "}
                        <span
                          className={priorityClass(
                            ticket.priority
                          )}
                        >
                          {ticket.priority ||
                            "normal"}
                        </span>
                      </p>

                      <p>
                        <strong>
                          Status:
                        </strong>{" "}
                        <span
                          className={supportStatusClass(
                            ticket.status
                          )}
                        >
                          {ticket.status ||
                            "open"}
                        </span>
                      </p>

                      <hr />

                      <p>
                        <strong>
                          Customer
                          Description
                        </strong>
                      </p>

                      <div
                        style={{
                          padding:
                            "12px",
                          borderRadius:
                            "8px",
                          background:
                            "rgba(0,0,0,0.04)",
                          whiteSpace:
                            "pre-wrap",
                          overflowWrap:
                            "anywhere",
                        }}
                      >
                        {ticket.description ||
                          ticket.message ||
                          "No description provided."}
                      </div>

                      {ticket.admin_response && (
                        <>
                          <hr />

                          <p>
                            <strong>
                              Latest Admin
                              Response
                            </strong>
                          </p>

                          <div
                            style={{
                              padding:
                                "12px",
                              borderRadius:
                                "8px",
                              background:
                                "rgba(0,0,0,0.04)",
                              whiteSpace:
                                "pre-wrap",
                              overflowWrap:
                                "anywhere",
                            }}
                          >
                            {
                              ticket.admin_response
                            }
                          </div>
                        </>
                      )}

                      <hr />

                      <div
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(180px, 1fr))",
                          gap:
                            "12px",
                        }}
                      >
                        <div>
                          <label
                            htmlFor={`problem-status-${ticket.id}`}
                            style={{
                              display:
                                "block",
                              fontWeight:
                                700,
                              marginBottom:
                                "6px",
                            }}
                          >
                            Status
                          </label>

                          <select
                            id={`problem-status-${ticket.id}`}
                            defaultValue={
                              ticket.status ||
                              "open"
                            }
                            disabled={
                              !!ticketAction
                            }
                            onChange={(
                              event
                            ) =>
                              updateTicketStatus(
                                ticket,
                                event
                                  .target
                                  .value
                              )
                            }
                            style={{
                              width:
                                "100%",
                              padding:
                                "10px",
                              border:
                                "1px solid #ccc",
                              borderRadius:
                                "8px",
                            }}
                          >
                            <option value="open">
                              Open
                            </option>

                            <option value="in_progress">
                              In Progress
                            </option>

                            <option value="resolved">
                              Resolved
                            </option>

                            <option value="closed">
                              Closed
                            </option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor={`problem-priority-${ticket.id}`}
                            style={{
                              display:
                                "block",
                              fontWeight:
                                700,
                              marginBottom:
                                "6px",
                            }}
                          >
                            Priority
                          </label>

                          <select
                            id={`problem-priority-${ticket.id}`}
                            defaultValue={
                              ticket.priority ||
                              "normal"
                            }
                            disabled={
                              !!ticketAction
                            }
                            onChange={(
                              event
                            ) =>
                              updateTicketPriority(
                                ticket,
                                event
                                  .target
                                  .value
                              )
                            }
                            style={{
                              width:
                                "100%",
                              padding:
                                "10px",
                              border:
                                "1px solid #ccc",
                              borderRadius:
                                "8px",
                            }}
                          >
                            <option value="low">
                              Low
                            </option>

                            <option value="normal">
                              Normal
                            </option>

                            <option value="high">
                              High
                            </option>

                            <option value="urgent">
                              Urgent
                            </option>
                          </select>
                        </div>
                      </div>

                      <textarea
                        id={`ticket-reply-${ticket.id}`}
                        rows={5}
                        placeholder="Write your response to the customer..."
                        disabled={
                          !!ticketAction
                        }
                        style={{
                          width:
                            "100%",
                          marginTop:
                            "14px",
                          padding:
                            "12px",
                          resize:
                            "vertical",
                          border:
                            "1px solid #ccc",
                          borderRadius:
                            "8px",
                          boxSizing:
                            "border-box",
                        }}
                      />

                      <button
                        className="primary-button"
                        disabled={
                          !!ticketAction
                        }
                        onClick={() =>
                          replyToSupportTicket(
                            ticket
                          )
                        }
                        style={{
                          marginTop:
                            "10px",
                        }}
                      >
                        {busy &&
                        ticketAction.type ===
                          "reply"
                          ? "Sending..."
                          : "Reply & Notify Customer"}
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>
      )}

      {/* ======================================================
          SECURITY WARNING
          ====================================================== */}

      <section className="real-notice">
        <h2>
          ⛔ Security Warning
        </h2>

        <p>
          Never share passwords, PINs,
          verification codes, or other
          sensitive account information
          with anyone. Keep administrator
          credentials private.
        </p>
      </section>
    </main>
  );
}
