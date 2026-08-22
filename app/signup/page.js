"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.next_public_supabase_url,
  process.env.next_public_supabase_anon_key
);

export default function Signup() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Account created. Please check your email to confirm your account."
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="real-badge">REAL ACCOUNT</span>

        <h1>Create Your Account</h1>

        <p>Create your customer account securely.</p>

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
            {loading ? "Creating Account..." : "Create Account"}
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
