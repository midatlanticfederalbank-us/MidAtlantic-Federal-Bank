"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "PASSWORD_RECOVERY" && session) {
        setReady(true);
        return;
      }

      if (session) {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setReady(Boolean(session));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function updatePassword(event) {
    event.preventDefault();

    setStatus("");
    setError("");

    const password = newPassword.trim();
    const confirmation = confirmPassword.trim();

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmation) {
      setError("The new passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(
        updateError.message ||
          "Your password could not be updated. Please request a new reset link."
      );
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setStatus(
      "Your password has been updated successfully. You can now sign in with your new password."
    );

    setTimeout(() => {
      window.location.href = "/login";
    }, 1800);
  }

  return (
    <main className="auth-page password-recovery-page">
      <div className="auth-card password-recovery-card">
        <div className="auth-heading">
          <span className="section-label">ACCOUNT SECURITY</span>
          <h1>Create New Password</h1>
          <p>
            Set a new password for your MIDATLANTIC FEDERAL BANK account.
          </p>
        </div>

        {!ready ? (
          <div className="auth-success" role="status">
            Checking your password-reset link...
            <br />
            If you reached this page without using a reset email, request a
            new reset link.
          </div>
        ) : (
          <form onSubmit={updatePassword} className="auth-form">
            <label htmlFor="reset-new-password">New Password</label>
            <input
              id="reset-new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Enter your new password"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={loading}
            />

            <label htmlFor="reset-confirm-password">
              Confirm New Password
            </label>
            <input
              id="reset-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              minLength={8}
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
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        <div className="password-recovery-links">
          <a href="/login">Back to Login</a>
          <span>•</span>
          <a href="/forgot-password">Request another link</a>
        </div>
      </div>
    </main>
  );
}
