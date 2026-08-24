"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="site-navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-brand">
          <span className="navbar-mark">M</span>

          <span>
            <strong>MIDATLANTIC FEDERAL BANK</strong>
            <small>Customer Banking Portal</small>
          </span>
        </a>

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open navigation"
        >
          ☰
        </button>

        <nav
          className={`navbar-links ${
            menuOpen ? "navbar-links-open" : ""
          }`}
        >
          <a href="/" onClick={() => setMenuOpen(false)}>
            Home
          </a>

          <a href="/support" onClick={() => setMenuOpen(false)}>
            Support
          </a>

          <a href="/news" onClick={() => setMenuOpen(false)}>
            News
          </a>

          {user ? (
            <>
              <a
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </a>

              <button
                className="navbar-signout"
                onClick={logout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </a>

              <a
                href="/signup"
                className="navbar-signup"
                onClick={() => setMenuOpen(false)}
              >
                Open Account
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
