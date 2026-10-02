"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendResetEmail(event) {
    event.preventDefault();

    setStatus("");
    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter the email address associated with your account.");
      return;
    }

    setLoading(true);

    const redirectUrl = `${window.location.origin}/reset-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      cleanEmail,
      {
        redirectTo: redirectUrl,
      }
    );

    setLoading(false);

    if (resetError) {
      setError(
        resetError.message ||
          "We could not send the password reset email. Please try again."
      );
      return;
    }

    setStatus(
      "If an account exists for that email address, a password reset link has been sent. Please check your inbox and spam folder."
    );
  }

  return (
    <main className="auth-page password-recovery-page">
      <div className="auth-card password-recovery-card">
        <div className="auth-heading">
          <span className="section-label">ACCOUNT SECURITY</span>
          <h1>Forgot Password?</h1>
          <p>
            Enter your email address and we will send you a secure link to
            create a new password.
          </p>
        </div>

        <form onSubmit={sendResetEmail} className="auth-form">
          <label htmlFor="recovery-email">Email Address</label>
          <input
            id="recovery-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={loading}
          />

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          {status && (
            <div className="auth-success" role="status">
              {status}
            </div>
          )}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="password-recovery-links">
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </main>
  );
}
