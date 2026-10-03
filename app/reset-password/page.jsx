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

  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function prepareRecoverySession() {
      try {
        setChecking(true);
        setError("");

        /*
         * Supabase recovery links can contain authentication
         * information in the URL hash.
         *
         * We listen for PASSWORD_RECOVERY first, then check
         * whether a session already exists.
         */

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (!mounted) return;

          console.log("AUTH EVENT:", event);

          if (event === "PASSWORD_RECOVERY" && session) {
            setReady(true);
            setChecking(false);
            return;
          }

          if (session) {
            setReady(true);
            setChecking(false);
          }
        });

        /*
         * Give Supabase a moment to process the recovery
         * information contained in the URL.
         */
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (!mounted) {
          subscription.unsubscribe();
          return;
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!mounted) {
          subscription.unsubscribe();
          return;
        }

        if (sessionError) {
          console.error("RECOVERY SESSION ERROR:", sessionError);

          setError(
            "We could not verify your password-reset link. Please request a new reset link."
          );

          setReady(false);
          setChecking(false);
          subscription.unsubscribe();
          return;
        }

        if (session) {
          setReady(true);
          setChecking(false);
        } else {
          setReady(false);
          setChecking(false);

          setError(
            "This password-reset link is invalid or has expired. Please request a new reset link."
          );
        }

        subscription.unsubscribe();
      } catch (err) {
        console.error("PASSWORD RECOVERY ERROR:", err);

        if (!mounted) return;

        setReady(false);
        setChecking(false);

        setError(
          "We could not verify your password-reset link. Please request a new reset link."
        );
      }
    }

    prepareRecoverySession();

    return () => {
      mounted = false;
    };
  }, []);

  async function updatePassword(event) {
    event.preventDefault();

    setStatus("");
    setError("");

    const password = newPassword;
    const confirmation = confirmPassword;

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmation) {
      setError("The new passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error(
          "Your password-reset session is no longer valid. Please request a new reset link."
        );
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw new Error(
          updateError.message ||
            "Your password could not be updated. Please request a new reset link."
        );
      }

      setNewPassword("");
      setConfirmPassword("");

      setStatus(
        "Your password has been updated successfully. You can now sign in with your new password."
      );

      /*
       * Sign out the recovery session before returning
       * the customer to the login page.
       */
      await supabase.auth.signOut();

      setTimeout(() => {
        window.location.href = "/login";
      }, 1800);
    } catch (err) {
      console.error("UPDATE PASSWORD ERROR:", err);

      setError(
        err?.message ||
          "Your password could not be updated. Please request a new reset link."
      );
    } finally {
      setLoading(false);
    }
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

        {checking ? (
          <div className="auth-success" role="status">
            Checking your password-reset link...
          </div>
        ) : !ready ? (
          <div>
            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <div style={{ marginTop: "16px" }}>
              <a
                href="/forgot-password"
                className="auth-submit"
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Request New Reset Link
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={updatePassword} className="auth-form">
            <label htmlFor="reset-new-password">
              New Password
            </label>

            <input
              id="reset-new-password"
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
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
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
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

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        <div className="password-recovery-links">
          <a href="/login">Back to Login</a>

          <span>•</span>

          <a href="/forgot-password">
            Request another link
          </a>
        </div>
      </div>
    </main>
  );
}
