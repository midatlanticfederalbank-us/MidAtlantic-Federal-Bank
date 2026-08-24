"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const {
      data,
      error: signupError,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Unable to create the account.");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        full_name: fullName,
        role: "customer",
        approval_status: "pending",
      });

    if (profileError) {
      console.error("PROFILE ERROR:", profileError);

      setError(
        "Your account was created, but your customer profile could not be completed."
      );

      setLoading(false);
      return;
    }

    setMessage(
      "Your account has been created successfully and is awaiting approval."
    );

    setFullName("");
    setEmail("");
    setPassword("");
    setLoading(false);
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

        {/* SIGNUP HEADING */}

        <div className="auth-heading">
          <span className="account-label">
            CUSTOMER ACCOUNT
          </span>

          <h1>Open Your Account</h1>

          <p>
            Create your customer account securely.
          </p>
        </div>

        {/* ERROR MESSAGE */}

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="auth-success">
            {message}
          </div>
        )}

        {/* SIGNUP FORM */}

        <form onSubmit={handleSignup}>

          <label>
            Full Name

            <input
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          </label>

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
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* ACCOUNT LINKS */}

        <div className="auth-links">

          <p>
            Already have an account?{" "}
            <a href="/login">
              Sign In
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
