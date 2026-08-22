"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminDashboard() {
  const [message, setMessage] = useState("Checking admin access...");

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) {
      setMessage("User error: " + userError.message);
      return;
    }

    if (!user) {
      setMessage("No user is signed in.");
      return;
    }

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileError) {
      setMessage(
        "Profile error: " + profileError.message
      );
      return;
    }

    if (!profile) {
      setMessage("No profile found.");
      return;
    }

    if (profile.role !== "admin") {
      setMessage(
        "This account is not admin. Current role: " +
          profile.role
      );
      return;
    }

    setMessage("Admin access confirmed.");
  }

  return (
    <main>
      <section className="auth-card">
        <span className="real-badge">ADMIN</span>

        <h1>Administrator Dashboard</h1>

        <p>{message}</p>
      </section>
    </main>
  );
}
