"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    address: "",
    postalCode: "",
    accountType: "Checking",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSignup(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const fullName =
      `${form.firstName} ${form.lastName}`.trim();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      setLoading(false);
      return;
    }

    if (!form.gender) {
      setError("Please select your gender.");
      setLoading(false);
      return;
    }

    try {
      const {
        data,
        error: signupError,
      } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            full_name: fullName,
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            date_of_birth: form.dateOfBirth,
            gender: form.gender,
            phone: form.phone.trim(),
            country: form.country.trim(),
            state: form.state.trim(),
            city: form.city.trim(),
            address: form.address.trim(),
            postal_code: form.postalCode.trim(),
            account_type: form.accountType,
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

      const { error: profileError } =
        await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            full_name: fullName,
            role: "customer",
            approval_status: "pending",

            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            date_of_birth: form.dateOfBirth,
            gender: form.gender,
            phone: form.phone.trim(),
            country: form.country.trim(),
            state: form.state.trim(),
            city: form.city.trim(),
            address: form.address.trim(),
            postal_code: form.postalCode.trim(),
            account_type: form.accountType,
          });

      if (profileError) {
        console.error(
          "PROFILE ERROR:",
          profileError
        );

        setError(
          "Your account was created, but your customer profile could not be completed. Please contact support."
        );

        setLoading(false);
        return;
      }

      setMessage(
        "Your account has been created successfully and is awaiting approval."
      );

      setForm({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        email: "",
        phone: "",
        country: "",
        state: "",
        city: "",
        address: "",
        postalCode: "",
        accountType: "Checking",
        password: "",
        confirmPassword: "",
      });

      setLoading(false);
    } catch (err) {
      console.error("SIGNUP ERROR:", err);

      setError(
        "Something went wrong while creating your account. Please try again."
      );

      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card signup-card">

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

        {/* HEADING */}

        <div className="auth-heading">
          <span className="account-label">
            CUSTOMER ACCOUNT
          </span>

          <h1>Open Your Account</h1>

          <p>
            Complete the information below to create your
            customer account.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {message && (
          <div className="auth-success">
            {message}
          </div>
        )}

        <form onSubmit={handleSignup}>

          {/* =========================
              PERSONAL INFORMATION
          ========================== */}

          <div className="signup-section">
            <div className="signup-section-heading">
              <span>01</span>

              <div>
                <h2>Personal Information</h2>

                <p>
                  Tell us a little about yourself.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <label>
                First Name

                <input
                  type="text"
                  value={form.firstName}
                  onChange={(event) =>
                    updateField(
                      "firstName",
                      event.target.value
                    )
                  }
                  placeholder="Enter first name"
                  autoComplete="given-name"
                  required
                />
              </label>

              <label>
                Last Name

                <input
                  type="text"
                  value={form.lastName}
                  onChange={(event) =>
                    updateField(
                      "lastName",
                      event.target.value
                    )
                  }
                  placeholder="Enter last name"
                  autoComplete="family-name"
                  required
                />
              </label>

              <label>
                Date of Birth

                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(event) =>
                    updateField(
                      "dateOfBirth",
                      event.target.value
                    )
                  }
                  autoComplete="bday"
                  required
                />
              </label>

              <div className="gender-field">
                <span className="field-title">
                  Gender
                </span>

                <div className="gender-options">

                  <label className="gender-option">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={
                        form.gender === "Male"
                      }
                      onChange={(event) =>
                        updateField(
                          "gender",
                          event.target.value
                        )
                      }
                    />

                    <span>Male</span>
                  </label>

                  <label className="gender-option">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={
                        form.gender === "Female"
                      }
                      onChange={(event) =>
                        updateField(
                          "gender",
                          event.target.value
                        )
                      }
                    />

                    <span>Female</span>
                  </label>

                </div>
              </div>

            </div>
          </div>

          {/* =========================
              CONTACT INFORMATION
          ========================== */}

          <div className="signup-section">
            <div className="signup-section-heading">
              <span>02</span>

              <div>
                <h2>Contact Information</h2>

                <p>
                  Provide your contact details.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <label>
                Email Address

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                Phone Number

                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value
                    )
                  }
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  required
                />
              </label>

            </div>
          </div>

          {/* =========================
              RESIDENTIAL ADDRESS
          ========================== */}

          <div className="signup-section">
            <div className="signup-section-heading">
              <span>03</span>

              <div>
                <h2>Residential Address</h2>

                <p>
                  Enter your current residential
                  information.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <label>
                Country

                <input
                  type="text"
                  value={form.country}
                  onChange={(event) =>
                    updateField(
                      "country",
                      event.target.value
                    )
                  }
                  placeholder="Enter country"
                  autoComplete="country-name"
                  required
                />
              </label>

              <label>
                State / Province

                <input
                  type="text"
                  value={form.state}
                  onChange={(event) =>
                    updateField(
                      "state",
                      event.target.value
                    )
                  }
                  placeholder="Enter state or province"
                  autoComplete="address-level1"
                  required
                />
              </label>

              <label>
                City

                <input
                  type="text"
                  value={form.city}
                  onChange={(event) =>
                    updateField(
                      "city",
                      event.target.value
                    )
                  }
                  placeholder="Enter city"
                  autoComplete="address-level2"
                  required
                />
              </label>

              <label>
                ZIP / Postal Code

                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(event) =>
                    updateField(
                      "postalCode",
                      event.target.value
                    )
                  }
                  placeholder="Enter ZIP or postal code"
                  autoComplete="postal-code"
                  required
                />
              </label>

              <label className="full-width-field">
                Street Address

                <input
                  type="text"
                  value={form.address}
                  onChange={(event) =>
                    updateField(
                      "address",
                      event.target.value
                    )
                  }
                  placeholder="Enter street address"
                  autoComplete="street-address"
                  required
                />
              </label>

            </div>
          </div>

          {/* =========================
              ACCOUNT INFORMATION
          ========================== */}

          <div className="signup-section">
            <div className="signup-section-heading">
              <span>04</span>

              <div>
                <h2>Account Information</h2>

                <p>
                  Choose the account type you would like
                  to request.
                </p>
              </div>
            </div>

            <label>
              Account Type

              <select
                value={form.accountType}
                onChange={(event) =>
                  updateField(
                    "accountType",
                    event.target.value
                  )
                }
              >
                <option value="Checking">
                  Checking Account
                </option>

                <option value="Savings">
                  Savings Account
                </option>
              </select>
            </label>
          </div>

          {/* =========================
              LOGIN CREDENTIALS
          ========================== */}

          <div className="signup-section">
            <div className="signup-section-heading">
              <span>05</span>

              <div>
                <h2>Create Your Login</h2>

                <p>
                  Create the password you will use to sign
                  in to your customer portal.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <label>
                Password

                <div className="password-field">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={form.password}
                    onChange={(event) =>
                      updateField(
                        "password",
                        event.target.value
                      )
                    }
                    placeholder="Create a password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <small className="field-help">
                  Use at least 6 characters.
                </small>
              </label>

              <label>
                Confirm Password

                <div className="password-field">
                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={form.confirmPassword}
                    onChange={(event) =>
                      updateField(
                        "confirmPassword",
                        event.target.value
                      )
                    }
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </label>

            </div>
          </div>

          {/* TERMS */}

          <div className="signup-agreement">
            <p>
              By creating an account, you confirm that the
              information provided is accurate and agree to
              the applicable account terms and privacy
              practices.
            </p>
          </div>

          {/* SUBMIT */}

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
