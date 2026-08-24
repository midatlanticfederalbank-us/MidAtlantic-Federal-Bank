"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="auth-page">
      <div className="auth-card">

        {/* BANK BRANDING */}

        <div className="auth-brand">
          <div className="bank-mark">M</div>

          <div>
            <div className="bank-name">
              MIDATLANTIC FEDERAL BANK
            </div>

            <div className="bank-subtitle">
              CUSTOMER BANKING PORTAL
            </div>
          </div>
        </div>

        {/* LOGIN HEADING */}

        <div className="auth-heading">
          <span className="account-label">
            CUSTOMER ACCOUNT
          </span>

          <h1>Welcome Back</h1>

          <p>
            Sign in securely to access your customer account.
          </p>
        </div>

        {/* ERROR MESSAGE */}

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}

        <form onSubmit={handleLogin}>

          <label>
            Email Address

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email address"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        {/* ACCOUNT LINKS */}

        <div className="auth-links">

          <p>
            Don't have an account?{" "}
            <a href="/signup">
              Create an Account
            </a>
          </p>

          <a
            className="back-home"
            href="/"
          >
            ← Back to Home
          </a>

        </div>

      </div>
    </main>
  );
}
