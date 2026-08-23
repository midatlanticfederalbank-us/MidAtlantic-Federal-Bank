"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Signup() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!name || !email || !password) {
      setLoading(false);
      setMessage("Please complete all required fields.");
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        setLoading(false);
        setMessage(error.message);
        return;
      }

      setLoading(false);

      setMessage(
        "Account created. Please check your email to confirm your account."
      );

      event.currentTarget.reset();
    } catch (error) {
      console.error("SIGNUP ERROR:", error);

      setLoading(false);

      setMessage(
        error?.message ||
          "Unable to create your account."
      );
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="real-badge">
          REAL ACCOUNT
        </span>

        <h1>Create Your Account</h1>

        <p>
          Create your customer account securely.
        </p>

        <form onSubmit={handleSignup}>
          <label>
            Full Name

            <input
              type="text"
              name="name"
              placeholder="Your name"
              required
            />
          </label>

          <label>
            Email Address

            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              minLength={8}
              required
            />
          </label>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {message && <p>{message}</p>}

        <p>
          Already have an account?{" "}
          <a href="/login">Sign in</a>
        </p>
      </section>
    </main>
  );
}
