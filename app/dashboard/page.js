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
const [withdrawalRequests, setWithdrawalRequests] = useState([]);
const [withdrawalLoading, setWithdrawalLoading] = useState(false);
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
await loadWithdrawalRequests(user.id);
setLoading(false);
}
async function loadCardData(userId = user?.id, accountId = account?.id) {
if (!userId) return;
setCardLoading(true);
try {
const { data: cardData, error: cardError } = await supabase
.from("customer_cards")
.select("id, card_type, card_network, cardholder_name, last4, expiry_month, expiry_year, status, created_at, activated_at")
.eq("user_id", userId)
.order("created_at", { ascending: false })
.limit(1)
.maybeSingle();
if (!cardError) {
setCustomerCard(cardData || null);
}
const { data: orders, error: ordersError } = await supabase
.from("customer_card_orders")
.select("id, card_type, reason, status, created_at, updated_at")
.eq("user_id", userId)
.order("created_at", { ascending: false })
.limit(5);
if (!ordersError) {
setCardOrders(orders || []);
}
} catch (cardError) {
console.warn("Card information could not be loaded:", cardError);
} finally {
setCardLoading(false);
}
}
async function loadWithdrawalRequests(userId = user?.id) {
if (!userId) return;
setWithdrawalLoading(true);
try {
const { data, error } = await supabase
.from("withdrawal_requests")
.select("id, account_id, amount, withdrawal_method, status, notes, created_at, updated_at")
.eq("user_id", userId)
.order("created_at", { ascending: false })
.limit(10);
if (!error) {
setWithdrawalRequests(data || []);
} else {
console.warn("Withdrawal requests could not be loaded:", error.message);
}
} catch (withdrawalError) {
console.warn("Withdrawal request connection error:", withdrawalError);
} finally {
setWithdrawalLoading(false);
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
reason: customerCard ? "Replacement card requested by customer" : "New card requested by customer",
status: "pending",
});
if (error) throw error;
setCardStatus("Your card request has been submitted. The bank will review it and update the status here.");
await loadCardData(user.id, account.id);
} catch (cardError) {
setCardStatus(cardError?.message || "Your card request could not be submitted. Please try again.");
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
if (["transfer", "wire", "local"].includes(activePage)) {
await startCustomerTransfer(activePage);
return;
}
if (activePage === "withdraw") {
if (!account?.id) {
setRequestStatus("Your account information is not available. Please try again.");
return;
}
if (account?.status !== "active") {
setRequestStatus("Your account is not active and cannot submit a withdrawal.");
return;
}
if (amount > Number(account.balance || 0)) {
setRequestStatus("The withdrawal amount is greater than your available balance.");
return;
}
setRequestLoading(true);
try {
const { error } = await supabase
.from("withdrawal_requests")
.insert({
user_id: user.id,
account_id: account.id,
amount,
withdrawal_method: "cash",
status: "pending",
notes: requestForm.description.trim() || null,
});
if (error) throw error;
resetRequestForm();
setRequestStatus("Your withdrawal request has been submitted successfully. It is pending bank review.");
await loadWithdrawalRequests(user.id);
} catch (withdrawalError) {
console.error("Withdrawal request insert failed:", withdrawalError);
const message =
withdrawalError?.message ||
withdrawalError?.details ||
withdrawalError?.hint ||
"Your withdrawal request could not be submitted. Please try again.";
setRequestStatus(`Withdrawal request failed: ${message}`);
} finally {
setRequestLoading(false);
}
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
recipientName: "", recipientAccountNumber: "", bankName: "",
bankCountry: "US", transferCurrency: "USD", transferMethod: "LOCAL",
beneficiaryType: "PERSONAL", accountName: "", routingType: "aba", routingValue: "",
swiftBic: "", streetAddress: "", city: "", state: "", postalCode: "",
amount: "", description: "",
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
async function startCustomerTransfer(pageType = "transfer") {
if (requestLoading || transferOtpLoading || !user) return;
setRequestStatus("");
setTransferOtpStatus("");
const amount = Number(requestForm.amount);
const recipientName = requestForm.recipientName.trim();
const recipientAccountNumber = requestForm.recipientAccountNumber.trim();
const bankCountry = requestForm.bankCountry.trim().toUpperCase();
const transferCurrency = requestForm.transferCurrency.trim().toUpperCase();
const accountName = (requestForm.accountName.trim() || recipientName);
if (!recipientName) {
setRequestStatus("Please enter the recipient's full name.");
return;
}
if (!recipientAccountNumber) {
setRequestStatus("Please enter the recipient account number or IBAN.");
return;
}
if (!/^[A-Z]{2}$/.test(bankCountry)) {
setRequestStatus("Enter a valid 2-letter bank country code, for example US or NG.");
return;
}
if (!/^[A-Z]{3}$/.test(transferCurrency)) {
setRequestStatus("Enter a valid 3-letter transfer currency, for example USD or NGN.");
return;
}
if (!Number.isFinite(amount) || amount <= 0) {
setRequestStatus("Please enter a valid transfer amount.");
return;
}
if (account?.status !== "active") {
setRequestStatus("Your account is not active and cannot send a transfer.");
return;
}
if (amount > Number(account.balance || 0)) {
setRequestStatus("The transfer amount is greater than your available balance.");
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
streetAddress: requestForm.streetAddress.trim(),
city: requestForm.city.trim(),
state: requestForm.state.trim(),
postalCode: requestForm.postalCode.trim(),
amount,
description: requestForm.description.trim() || "Customer Transfer",
});
setTransferId(data.transferId);
setTransferPageType(pageType);
setTransferOtp("");
setTransferOtpStatus(
`A 6-digit verification code has been sent to ${data.emailMasked || "your registered email address"}.`
);
setTransferOtpOpen(true);
} catch (err) {
setRequestStatus(err?.message || "We could not start the transfer. Please check the bank details and try again.");
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
setTransferPageType("transfer");
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
recipientName: requestForm.recipientName.trim(),
recipientAccountNumber: requestForm.recipientAccountNumber.trim(),
bankName: requestForm.bankName.trim(),
bankCountry: requestForm.bankCountry.trim().toUpperCase(),
transferCurrency: requestForm.transferCurrency.trim().toUpperCase(),
transferMethod:
transferPageType === "wire"
? "SWIFT"
: transferPageType === "local"
? "LOCAL"
: requestForm.transferMethod,
beneficiaryType: requestForm.beneficiaryType,
accountName: requestForm.accountName.trim() || requestForm.recipientName.trim(),
routingType: requestForm.routingType.trim(),
routingValue: requestForm.routingValue.trim(),
swiftBic: requestForm.swiftBic.trim(),
streetAddress: requestForm.streetAddress.trim(),
city: requestForm.city.trim(),
state: requestForm.state.trim(),
postalCode: requestForm.postalCode.trim(),
amount,
description: requestForm.description.trim() || "Customer Transfer",
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
setTransferPageType("transfer");
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
<button
onClick={() =>
openPage("card")
}
className="quick-action"
>
<span className="action-icon">
▣
</span>
<strong>
ATM / Debit Card
</strong>
<small>
View your card or order a new one
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
{/* NEWS LINK */}
<section className="portal-section dashboard-news-link">
<div>
<span className="section-label">
MARKET &amp; BANKING
</span>
<h2>News &amp; Banking Insights</h2>
<p className="news-subtitle">
Read the latest banking and market information on the bank's public News page.
</p>
</div>
<button
className="portal-button secondary-portal-button"
type="button"
onClick={() => {
window.location.href = "/news";
}}
>
View Bank News →
</button>
</section>
</>
)}
{/* =================================================
ATM / DEBIT CARD
================================================= */}
{activePage === "card" && (
<PortalPage
title="ATM / Debit Card"
label="CARD SERVICES"
>
<section className="card-service-panel">
<div className="card-service-header">
<div>
<span className="section-label">
YOUR CARD
</span>
<h2>ATM / Debit Card</h2>
<p>
View your issued card details securely or request a replacement/new card.
</p>
</div>
</div>
{cardLoading ? (
<div className="empty-state">Loading card information...</div>
) : customerCard ? (
<div className="customer-bank-card">
<div className="bank-card-topline">
<span>MIDATLANTIC FEDERAL BANK</span>
<span>{customerCard.card_network || "DEBIT"}</span>
</div>
<div className="bank-card-chip">▦</div>
<div className="bank-card-number">
•••• •••• •••• {customerCard.last4 || "----"}
</div>
<div className="bank-card-bottom">
<div>
<small>CARDHOLDER</small>
<strong>{customerCard.cardholder_name || profile?.full_name || "Customer"}</strong>
</div>
<div>
<small>EXPIRES</small>
<strong>{customerCard.expiry_month && customerCard.expiry_year ? `${String(customerCard.expiry_month).padStart(2, "0")}/${String(customerCard.expiry_year).slice(-2)}` : "--/--"}</strong>
</div>
<div>
<small>STATUS</small>
<strong>{customerCard.status || "Active"}</strong>
</div>
</div>
</div>
) : (
<div className="card-empty-panel">
<div className="empty-icon">▣</div>
<strong>No ATM / Debit Card Issued</strong>
<p>
You do not currently have a card recorded on your customer account. You can submit a card request below.
</p>
</div>
)}
<div className="card-order-panel">
<div>
<span className="section-label">
CARD REQUEST
</span>
<h3>{customerCard ? "Need a replacement card?" : "Order an ATM / Debit Card"}</h3>
<p>
Submit your request to the bank. Card issuance and delivery are subject to bank approval and processing.
</p>
</div>
<button
className="portal-button"
type="button"
onClick={orderNewCard}
disabled={cardOrderLoading}
>
{cardOrderLoading ? "Submitting..." : customerCard ? "Order Replacement Card" : "Order New Card"}
</button>
</div>
{cardStatus && (
<div className="request-notice success-notice">
<p>{cardStatus}</p>
</div>
)}
{cardOrders.length > 0 && (
<div className="card-orders-list">
<div className="profile-section-title">Recent Card Requests</div>
{cardOrders.map((order) => (
<div className="detail-row" key={order.id}>
<span>
{order.card_type || "ATM / Debit Card"}
<small className="detail-subtext">{formatDate(order.created_at)}</small>
</span>
<strong className="card-order-status">{order.status || "Pending"}</strong>
</div>
))}
</div>
)}
</section>
</PortalPage>
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
{activePage !== "withdraw" ? (
<form onSubmit={submitRequest}>
<div className="request-notice transfer-security-notice">
<strong>{activePage === "wire" ? "International Wire Transfer" : activePage === "local" ? "Local Bank Transfer" : "International &amp; Local Bank Transfer"}</strong>
<p>Enter the recipient's bank details. The transfer is verified by email OTP before it is sent through Airwallex.</p>
</div>
<label className="form-label">Recipient Full Name
<input className="portal-input" type="text" value={requestForm.recipientName} onChange={(e) => updateRequestField("recipientName", e.target.value)} placeholder="Full name of recipient" required />
</label>
<div className="transfer-form-grid">
<label className="form-label">Bank Country (2-letter code)
<input className="portal-input" type="text" value={requestForm.bankCountry} onChange={(e) => updateRequestField("bankCountry", e.target.value.toUpperCase().slice(0,2))} placeholder="US" maxLength={2}
required />
</label>
<label className="form-label">Transfer Currency (3-letter code)
<input className="portal-input" type="text" value={requestForm.transferCurrency} onChange={(e) => updateRequestField("transferCurrency", e.target.value.toUpperCase().slice(0,3))} placeholder="USD"
maxLength={3} required />
</label>
</div>
<div className="transfer-form-grid">
<label className="form-label">Transfer Method
<select
className="portal-input"
value={
activePage === "wire"
? "SWIFT"
: activePage === "local"
? "LOCAL"
: requestForm.transferMethod
}
onChange={(e) => updateRequestField("transferMethod", e.target.value)}
disabled={activePage === "wire" || activePage === "local"}
>
<option value="LOCAL">Local</option>
<option value="SWIFT">SWIFT / International</option>
</select>
</label>
<label className="form-label">Recipient Type
<select className="portal-input" value={requestForm.beneficiaryType} onChange={(e) => updateRequestField("beneficiaryType", e.target.value)}>
<option value="PERSONAL">Individual</option>
<option value="COMPANY">Business</option>
</select>
</label>
</div>
<label className="form-label">Bank Account Name
<input className="portal-input" type="text" value={requestForm.accountName} onChange={(e) => updateRequestField("accountName", e.target.value)} placeholder="Name exactly as shown on the bank account"
required />
</label>
<label className="form-label">Account Number / IBAN
<input className="portal-input" type="text" value={requestForm.recipientAccountNumber} onChange={(e) => updateRequestField("recipientAccountNumber", e.target.value.trimStart())} placeholder="Account number
or IBAN" autoComplete="off" required />
</label>
<div className="transfer-form-grid">
<label className="form-label">Routing Type
<input className="portal-input" type="text" value={requestForm.routingType} onChange={(e) => updateRequestField("routingType", e.target.value)} placeholder="aba, sort_code, bsb, ifsc" />
</label>
<label className="form-label">Routing / Clearing Code
<input className="portal-input" type="text" value={requestForm.routingValue} onChange={(e) => updateRequestField("routingValue", e.target.value)} placeholder="Bank routing code" />
</label>
</div>
<div className="transfer-form-grid">
<label className="form-label">SWIFT / BIC (if applicable)
<input className="portal-input" type="text" value={requestForm.swiftBic} onChange={(e) => updateRequestField("swiftBic", e.target.value.toUpperCase())} placeholder="SWIFT or BIC" />
</label>
<label className="form-label">Bank Name
<input className="portal-input" type="text" value={requestForm.bankName} onChange={(e) => updateRequestField("bankName", e.target.value)} placeholder="Recipient's bank" />
</label>
</div>
<div className="transfer-form-grid">
<label className="form-label">City
<input className="portal-input" type="text" value={requestForm.city} onChange={(e) => updateRequestField("city", e.target.value)} placeholder="Bank/recipient city" />
</label>
<label className="form-label">State / Province
<input className="portal-input" type="text" value={requestForm.state} onChange={(e) => updateRequestField("state", e.target.value)} placeholder="State or province" />
</label>
</div>
<div className="transfer-form-grid">
<label className="form-label">Street Address
<input className="portal-input" type="text" value={requestForm.streetAddress} onChange={(e) => updateRequestField("streetAddress", e.target.value)} placeholder="Street address" />
</label>
<label className="form-label">Postal Code
<input className="portal-input" type="text" value={requestForm.postalCode} onChange={(e) => updateRequestField("postalCode", e.target.value)} placeholder="Postal code" />
</label>
</div>
<label className="form-label">Amount
<input className="portal-input" type="number" min="0.01" step="0.01" value={requestForm.amount} onChange={(e) => updateRequestField("amount", e.target.value)} placeholder="0.00" required />
<small className="transfer-balance-hint">Available balance: ${formatMoney(account.balance)}</small>
</label>
<label className="form-label">Description / Transfer Reason
<textarea className="portal-textarea" rows="3" value={requestForm.description} onChange={(e) => updateRequestField("description", e.target.value)} placeholder="What is this transfer for?" />
</label>
{requestStatus && <div className="request-notice error-notice"><p>{requestStatus}</p></div>}
<button className="portal-button transfer-submit-button" type="submit" disabled={requestLoading}>
{requestLoading ? "Sending Verification Code..." : "Transfer"}
</button>
</form>
) : (
<form onSubmit={submitRequest}>
<div className="request-notice">
<strong>
Withdrawal Request
</strong>
<p>
Submit a withdrawal request from your customer account.
Requests are reviewed by the bank before any action is taken.
</p>
</div>
<label className="form-label">
Withdrawal Method
<select
className="portal-input"
value="cash"
disabled
>
<option value="cash">Cash Withdrawal</option>
</select>
</label>
<label className="form-label">
Amount
<input
className="portal-input"
type="number"
min="0.01"
step="0.01"
max={Number(account.balance || 0)}
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
Available balance: ${formatMoney(account.balance)}
</small>
</label>
<label className="form-label">
Notes
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
placeholder="Add any information about this withdrawal"
/>
</label>
{requestStatus && (
<div
className={`request-notice ${
requestStatus.toLowerCase().includes("successfully") ||
requestStatus.toLowerCase().includes("pending bank review")
? "success-notice"
: "error-notice"
}`}
>
<p>{requestStatus}</p>
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
  
<section className="portal-section" style={{ marginTop: "24px" }}>
<div className="section-heading">
<div>
<span className="section-label">
WITHDRAWAL ACTIVITY
</span>
<h2>Recent Withdrawal Requests</h2>
</div>
</div>
{withdrawalLoading ? (
<div className="empty-state">Loading withdrawal requests...</div>
) : withdrawalRequests.length === 0 ? (
<div className="empty-state">
<div className="empty-icon">↓</div>
<strong>No Withdrawal Requests</strong>
<p>Your submitted withdrawal requests will appear here.</p>
</div>
) : (
<div className="transaction-list-professional">
{withdrawalRequests.map((withdrawal) => (
<div
className="transaction-row"
key={withdrawal.id}
>
<div>
<strong>
Cash Withdrawal Request
</strong>
<small>
{formatDate(withdrawal.created_at)}
</small>
</div>
<div style={{ textAlign: "right" }}>
<strong>
${formatMoney(withdrawal.amount)}
</strong>
<small style={{ display: "block", textTransform: "capitalize" }}>
{withdrawal.status || "pending"}
</small>
</div>
</div>
))}
</div>
)}
</section>
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
`}
</style>
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
{transferReceipt.currency || "USD"} {formatMoney(transferReceipt.amount)}
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
<span>Recipient Bank</span>
<strong>
{transferReceipt.bankName || "Recipient Bank"}
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
.transfer-form-grid {
display: grid;
grid-template-columns: repeat(2, minmax(0, 1fr));
gap: 16px;
}
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
/* =========================================================
MIDATLANTIC FEDERAL BANK — MODERN CUSTOMER PORTAL THEME
Visual refresh only: existing dashboard functionality remains intact.
========================================================= */
:global(body) {
background: #f3f6fb;
}
:global(*) {
box-sizing: border-box;
}
.portal-shell {
min-height: 100vh;
background:
radial-gradient(circle at 80% 0%, rgba(34, 91, 160, 0.08), transparent 30%),
linear-gradient(180deg, #f7f9fc 0%, #eef3f9 100%);
color: #14213d;
}
.portal-header {
position: sticky;
top: 0;
z-index: 80;
min-height: 76px;
padding: 0 34px;
background: rgba(255, 255, 255, 0.94);
border-bottom: 1px solid #e4eaf2;
box-shadow: 0 8px 28px rgba(20, 33, 61, 0.055);
backdrop-filter: blur(16px);
}
.portal-header,
.portal-header-right {
display: flex;
align-items: center;
}
.portal-header {
justify-content: space-between;
gap: 24px;
}
.portal-brand {
display: flex;
align-items: center;
gap: 13px;
color: #123b72;
}
.portal-logo,
.portal-brand > .portal-logo {
width: 44px;
height: 44px;
display: grid;
place-items: center;
flex: 0 0 44px;
border-radius: 13px;
background: linear-gradient(145deg, #123b72, #1d5a9e);
color: #fff;
font-size: 20px;
font-weight: 900;
box-shadow: 0 10px 22px rgba(18, 59, 114, 0.22);
}
.portal-brand-text {
display: flex;
flex-direction: column;
gap: 2px;
}
.portal-brand-text strong {
font-size: 15px;
letter-spacing: 0.045em;
line-height: 1.15;
}
.portal-brand-text span {
color: #7b879a;
font-size: 9px;
font-weight: 800;
letter-spacing: 0.18em;
}
.portal-online {
display: inline-flex;
align-items: center;
gap: 8px;
margin-right: 8px;
padding: 8px 11px;
border: 1px solid #dcefe5;
border-radius: 999px;
background: #f2fbf6;
color: #18794e;
font-size: 11px;
font-weight: 800;
}
.online-dot,
.chat-online-dot,
.chat-header-dot {
width: 8px;
height: 8px;
border-radius: 50%;
background: #1aa56f;
box-shadow: 0 0 0 4px rgba(26, 165, 111, 0.1);
}
.header-signout {
border: 1px solid #dbe3ed;
border-radius: 10px;
padding: 9px 13px;
background: #fff;
color: #31445f;
font-size: 12px;
font-weight: 800;
cursor: pointer;
transition: 0.2s ease;
}
.header-signout:hover {
border-color: #b8c8db;
background: #f7faff;
transform: translateY(-1px);
}
.page-body {
width: min(100% - 48px, 1240px);
margin: 0 auto;
padding: 38px 0 70px;
}
.welcome-section {
position: relative;
overflow: hidden;
margin-bottom: 26px;
padding: 32px;
border-radius: 24px;
background: linear-gradient(135deg, #10396e 0%, #165b9d 58%, #2478bd 100%);
color: #fff;
box-shadow: 0 22px 55px rgba(16, 57, 110, 0.18);
}
.welcome-section::after {
content: "";
position: absolute;
width: 280px;
height: 280px;
right: -90px;
top: -130px;
border: 1px solid rgba(255,255,255,.16);
border-radius: 50%;
box-shadow: 0 0 0 35px rgba(255,255,255,.035), 0 0 0 75px rgba(255,255,255,.025);
}
.welcome-section h1,
.welcome-section h2 {
position: relative;
z-index: 1;
margin: 0;
color: #fff;
font-size: clamp(25px, 3vw, 36px);
letter-spacing: -0.035em;
}
.welcome-section p {
position: relative;
z-index: 1;
max-width: 680px;
margin: 9px 0 0;
color: rgba(255,255,255,.78);
line-height: 1.65;
}
.section-label,
.page-heading .section-label {
color: #5d6d84;
font-size: 10px;
font-weight: 900;
letter-spacing: .16em;
text-transform: uppercase;
}
.page-heading {
margin-bottom: 22px;
}
.page-heading h1 {
margin: 5px 0 0;
color: #12233f;
font-size: clamp(25px, 3vw, 34px);
letter-spacing: -.035em;
}
.page-heading p {
margin: 8px 0 0;
color: #69778b;
line-height: 1.6;
}
.portal-section,
.portal-page-section,
.support-grid-professional,
.card-service-panel,
.card-order-panel,
.portal-page {
border: 1px solid #e1e8f1;
border-radius: 20px;
background: rgba(255,255,255,.96);
box-shadow: 0 12px 36px rgba(30, 52, 80, .06);
}
.portal-section,
.portal-page-section {
padding: 24px;
}
.section-heading {
margin-bottom: 17px;
color: #1b2f4c;
font-size: 16px;
font-weight: 850;
letter-spacing: -.01em;
}
.balance-card-professional {
position: relative;
overflow: hidden;
padding: 28px;
border-radius: 22px;
background: linear-gradient(135deg, #0d376d 0%, #174f8b 60%, #216fa9 100%);
color: #fff;
box-shadow: 0 18px 45px rgba(13,55,109,.2);
}
.balance-card-professional::before {
content: "";
position: absolute;
width: 240px;
height: 240px;
right: -100px;
bottom: -130px;
border: 1px solid rgba(255,255,255,.13);
border-radius: 50%;
box-shadow: 0 0 0 35px rgba(255,255,255,.035), 0 0 0 70px rgba(255,255,255,.025);
}
.balance-main {
position: relative;
z-index: 1;
}
.balance-main .label,
.balance-main span,
.balance-status {
color: rgba(255,255,255,.74);
}
.balance-main strong {
display: block;
margin-top: 7px;
color: #fff;
font-size: clamp(31px, 4vw, 46px);
letter-spacing: -.045em;
line-height: 1;
}
.balance-status {
margin-top: 14px;
font-size: 12px;
font-weight: 700;
}
.quick-action-grid {
display: grid;
grid-template-columns: repeat(4, minmax(0,1fr));
gap: 13px;
}
.quick-action {
min-height: 112px;
padding: 18px;
border: 1px solid #e0e7ef;
border-radius: 16px;
background: #fff;
color: #1b2f4c;
text-align: left;
cursor: pointer;
transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}
.quick-action:hover {
transform: translateY(-3px);
border-color: #bdd0e6;
box-shadow: 0 13px 28px rgba(31, 57, 89, .09);
}
.action-icon {
width: 38px;
height: 38px;
display: grid;
place-items: center;
margin-bottom: 13px;
border-radius: 11px;
background: #edf5fd;
color: #18558e;
font-weight: 900;
}
.quick-action strong {
display: block;
font-size: 13px;
}
.quick-action span:not(.action-icon) {
display: block;
margin-top: 5px;
color: #77859a;
font-size: 11px;
line-height: 1.4;
}
.two-column {
display: grid;
grid-template-columns: minmax(0, 1.15fr) minmax(300px, .85fr);
gap: 22px;
}
.transaction-list-professional {
overflow: hidden;
border: 1px solid #e4eaf2;
border-radius: 15px;
}
.transaction-row {
display: flex;
align-items: center;
justify-content: space-between;
gap: 18px;
padding: 16px 17px;
background: #fff;
border-bottom: 1px solid #edf1f5;
}
.transaction-row:last-child { border-bottom: 0; }
.transaction-row:hover { background: #fbfcfe; }
.transaction-row strong { color: #203550; font-size: 13px; }
.transaction-row small,
.detail-subtext { color: #8490a1; font-size: 11px; }
.active-text { color: #168052 !important; font-weight: 800; }
.status-badge {
display: inline-flex;
align-items: center;
justify-content: center;
min-height: 27px;
padding: 5px 9px;
border-radius: 999px;
background: #edf8f2;
color: #18784e;
font-size: 10px;
font-weight: 900;
text-transform: uppercase;
letter-spacing: .04em;
}
.pending-card,
.request-notice,
.security-box,
.success-notice,
.error-notice {
border-radius: 14px;
}
.security-box {
padding: 17px;
border: 1px solid #dbe8f5;
background: #f5f9fe;
color: #4b5e76;
}
.security-box strong { color: #173f72; }
.portal-input,
.portal-textarea,
select.portal-input {
width: 100%;
min-height: 47px;
margin-top: 7px;
padding: 12px 14px;
border: 1px solid #d7e0ea;
border-radius: 11px;
background: #fff;
color: #172b46;
font: inherit;
outline: none;
transition: .2s ease;
}
.portal-textarea { min-height: 105px; resize: vertical; }
.portal-input:focus,
.portal-textarea:focus {
border-color: #2a6ca7;
box-shadow: 0 0 0 4px rgba(42,108,167,.1);
}
.form-label {
display: block;
margin-bottom: 15px;
color: #344861;
font-size: 12px;
font-weight: 800;
}
.portal-button,
.secondary-portal-button,
.secondary-action {
min-height: 46px;
border-radius: 11px;
padding: 11px 17px;
font-size: 12px;
font-weight: 850;
cursor: pointer;
transition: .2s ease;
}
.portal-button {
border: 1px solid #123e75;
background: linear-gradient(135deg,#123b72,#1d619e);
color: #fff;
box-shadow: 0 8px 20px rgba(18,59,114,.16);
}
.portal-button:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 11px 25px rgba(18,59,114,.21); }
.portal-button:disabled { opacity: .55; cursor: not-allowed; }
.secondary-portal-button,
.secondary-action {
border: 1px solid #d8e1eb;
background: #fff;
color: #30465f;
}
.secondary-portal-button:hover,
.secondary-action:hover { background: #f7faff; border-color: #bfcfe0; }
.account-number-row {
display: flex;
align-items: center;
justify-content: space-between;
gap: 15px;
padding: 15px 0;
border-bottom: 1px solid #edf1f5;
}
.account-number-value { color: #193657; font-weight: 850; letter-spacing: .05em; }
.account-number-eye { border: 0; background: transparent; color: #2c6495; cursor: pointer; font-weight: 800; }
.profile-header {
display: flex;
align-items: center;
gap: 16px;
padding-bottom: 22px;
margin-bottom: 20px;
border-bottom: 1px solid #e8edf3;
}
.profile-avatar,
.profile-avatar-image {
width: 76px !important;
height: 76px !important;
border: 4px solid #fff;
box-shadow: 0 7px 22px rgba(31,56,85,.13);
background: linear-gradient(135deg,#dcecff,#b9d6f1);
color: #174e87;
font-size: 25px;
font-weight: 900;
}
.profile-header h2 { margin: 0; color: #172c48; letter-spacing: -.025em; }
.profile-header p { margin: 4px 0 0; color: #7c8899; font-size: 12px; }
.profile-section-title {
margin: 25px 0 7px;
color: #173f72;
font-size: 11px;
font-weight: 900;
letter-spacing: .12em;
text-transform: uppercase;
}
.detail-row,
.settings-row {
padding: 13px 0;
border-bottom: 1px solid #edf1f5;
}
.card-service-header {
display: flex;
align-items: flex-start;
justify-content: space-between;
gap: 20px;
margin-bottom: 20px;
}
.customer-bank-card {
position: relative;
overflow: hidden;
min-height: 215px;
padding: 25px;
border-radius: 22px;
background: linear-gradient(135deg,#172f53 0%,#123e75 48%,#1f669c 100%);
color: #fff;
box-shadow: 0 20px 40px rgba(18,62,117,.22);
}
.customer-bank-card::after {
content: "";
position: absolute;
width: 250px;
height: 250px;
right: -100px;
top: -120px;
border: 1px solid rgba(255,255,255,.15);
border-radius: 50%;
}
.bank-card-topline,
.bank-card-bottom { position: relative; z-index: 1; display:flex; justify-content:space-between; gap:16px; }
.bank-card-chip { width: 42px; height: 31px; border-radius: 7px; background: linear-gradient(135deg,#c9d1da,#f0f3f6); margin: 28px 0 20px; }
.bank-card-number { font-size: 20px; letter-spacing: .16em; font-weight: 700; }
.bank-card-bottom { margin-top: 24px; align-items: flex-end; font-size: 10px; text-transform: uppercase; letter-spacing:.08em; }
.card-empty-panel,
.card-order-panel {
padding: 22px;
}
.card-orders-list { display: grid; gap: 10px; margin-top: 18px; }
.chat-button-text { font-weight: 800; }
.live-chat-button {
position: fixed !important;
right: 25px !important;
bottom: 24px !important;
z-index: 90 !important;
display: inline-flex !important;
align-items: center !important;
gap: 9px !important;
min-height: 52px !important;
padding: 0 18px !important;
border: 0 !important;
border-radius: 999px !important;
background: #123e75 !important;
color: #fff !important;
box-shadow: 0 14px 32px rgba(18,62,117,.27) !important;
}
.live-chat-window {
border: 1px solid #dce4ed !important;
border-radius: 20px !important;
box-shadow: 0 25px 65px rgba(17,39,66,.2) !important;
overflow: hidden;
}
.chat-header { background: linear-gradient(135deg,#123b72,#1b619c) !important; color:#fff !important; }
.chat-body { background: #f7f9fc !important; }
.chat-input-area { background:#fff !important; border-top:1px solid #e5eaf0 !important; }
.transfer-modal,
.transfer-receipt {
border: 1px solid #e0e6ee;
box-shadow: 0 35px 100px rgba(8,28,52,.34);
}
.transfer-modal-brand .transfer-receipt-logo,
.receipt-top .transfer-receipt-logo { background: linear-gradient(135deg,#123b72,#1e649f); }
.empty-state {
padding: 32px 20px;
border: 1px dashed #d8e1eb;
border-radius: 15px;
background: #fafcff;
text-align: center;
}
.empty-icon { font-size: 26px; margin-bottom: 7px; }
@media (max-width: 980px) {
.page-body { width: min(100% - 32px, 900px); }
.quick-action-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
.two-column { grid-template-columns: 1fr; }
}
@media (max-width: 700px) {
.portal-header { min-height: 68px; padding: 0 15px; }
.portal-brand-text span { display:none; }
.portal-online { display:none; }
.header-signout { padding:8px 10px; }
.page-body { width: min(100% - 22px, 680px); padding-top: 22px; }
.welcome-section { padding: 23px 20px; border-radius: 18px; }
.portal-section, .portal-page-section, .portal-page, .support-grid-professional, .card-service-panel, .card-order-panel { padding: 17px; border-radius: 16px; }
.quick-action-grid { grid-template-columns: 1fr 1fr; gap: 9px; }
.quick-action { min-height: 102px; padding: 14px; }
.transaction-row { align-items:flex-start; padding:14px 13px; }
.transaction-row > :last-child { text-align:right; }
.transfer-form-grid { grid-template-columns:1fr; }
.live-chat-button { right:14px !important; bottom:14px !important; min-height:48px !important; padding:0 15px !important; }
}
@media (max-width: 700px) { .transfer-form-grid { grid-template-columns: 1fr; } }
`}
</style>
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
