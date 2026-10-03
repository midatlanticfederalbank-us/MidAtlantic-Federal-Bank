import Link from "next/link";

function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 12H19M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 3L19 6V11C19 15.5 16.1 19.4 12 21C7.9 19.4 5 15.5 5 11V6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 12L11 14L15 10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3 10H21"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7 15H11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TransferIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 7H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15 3L19 7L15 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 17H5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 13L5 17L9 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 19V5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 19H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 15L11 11L14 13L19 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 21V8L12 4L20 8V21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M2 21H22"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 10V13M12 10V13M16 10V13M8 16V19M12 16V19M16 16V19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" fill="#0f766e" />
      <path
        d="M8 12L10.7 14.5L16 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="home-page">

      <style>{`
        .home-page {
          --navy: #071a33;
          --navy-2: #0b2547;
          --blue: #145da0;
          --blue-2: #1d73c9;
          --teal: #0f766e;
          --gold: #c99a2e;
          --cream: #f7f9fc;
          --ink: #142033;
          --muted: #617084;
          --line: #e5eaf1;
          min-height: 100vh;
          background: #ffffff;
          color: var(--ink);
          overflow-x: hidden;
        }

        .home-page * {
          box-sizing: border-box;
        }

        .home-page a {
          color: inherit;
          text-decoration: none;
        }

        /* ================================
           TOP BAR
        ================================= */

        .home-page .topbar {
          background: var(--navy);
          color: #dfe9f5;
          min-height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 24px;
          font-size: 12px;
          letter-spacing: .01em;
        }

        .home-page .topbar-inner {
          width: 100%;
          max-width: 1240px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .home-page .topbar-left,
        .home-page .topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .home-page .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #45d39b;
          box-shadow: 0 0 0 4px rgba(69,211,155,.12);
        }

        /* ================================
           HEADER
        ================================= */

        .home-page .header {
          background: rgba(255,255,255,.97);
          border-bottom: 1px solid var(--line);
          position: sticky;
          top: 0;
          z-index: 30;
          backdrop-filter: blur(14px);
        }

        .home-page .nav {
          max-width: 1240px;
          min-height: 78px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .home-page .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 250px;
        }

        .home-page .brand-mark {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          background: linear-gradient(145deg, #0d396c, #0a2342);
          display: grid;
          place-items: center;
          color: white;
          box-shadow: 0 8px 20px rgba(7,26,51,.16);
          position: relative;
          overflow: hidden;
        }

        .home-page .brand-mark:after {
          content: "";
          position: absolute;
          width: 28px;
          height: 28px;
          border: 1px solid rgba(255,255,255,.3);
          transform: rotate(45deg);
        }

        .home-page .brand-mark span {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: .08em;
          position: relative;
          z-index: 1;
        }

        .home-page .brand-name {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: .075em;
          color: var(--navy);
          line-height: 1.25;
        }

        .home-page .brand-sub {
          margin-top: 3px;
          font-size: 10px;
          color: #78869a;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .home-page .nav-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 27px;
          flex: 1;
        }

        .home-page .nav-link {
          font-size: 13px;
          font-weight: 650;
          color: #4b5b70;
          transition: color .2s ease;
        }

        .home-page .nav-link:hover {
          color: var(--blue);
        }

        .home-page .nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* ================================
           BUTTONS
        ================================= */

        .home-page .button {
          min-height: 43px;
          padding: 0 18px;
          border-radius: 9px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-size: 13px;
          font-weight: 750;
          transition:
            transform .2s ease,
            box-shadow .2s ease,
            background .2s ease;
          cursor: pointer;
          border: 1px solid transparent;
        }

        .home-page .button:hover {
          transform: translateY(-1px);
        }

        .home-page .button-outline {
          border-color: #ccd5e1;
          background: white;
          color: var(--navy);
        }

        .home-page .button-outline:hover {
          border-color: #aebdce;
          box-shadow: 0 7px 18px rgba(7,26,51,.07);
        }

        .home-page .button-primary {
          background: var(--navy);
          color: white;
          box-shadow: 0 8px 18px rgba(7,26,51,.16);
        }

        .home-page .button-primary:hover {
          background: #0d2a4e;
          box-shadow: 0 10px 23px rgba(7,26,51,.22);
        }

        .home-page .button-blue {
          background: var(--blue);
          color: white;
          box-shadow: 0 9px 20px rgba(20,93,160,.18);
        }

        .home-page .button-blue:hover {
          background: #104f89;
        }

        /* ================================
           HERO
        ================================= */

        .home-page .hero {
          position: relative;
          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(45,117,190,.14),
              transparent 33%
            ),
            linear-gradient(
              135deg,
              #f8fbff 0%,
              #eef5fb 55%,
              #f9fbfd 100%
            );
          border-bottom: 1px solid var(--line);
        }

        .home-page .hero-inner {
          max-width: 1240px;
          margin: 0 auto;
          min-height: 575px;
          padding: 76px 24px 70px;
          display: grid;
          grid-template-columns:
            minmax(0, 1.08fr)
            minmax(390px, .92fr);
          gap: 70px;
          align-items: center;
        }

        .home-page .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: var(--blue);
          background: rgba(20,93,160,.07);
          border: 1px solid rgba(20,93,160,.13);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .home-page .hero h1 {
          margin: 20px 0 20px;
          max-width: 700px;
          color: var(--navy);
          font-size: clamp(40px, 5vw, 65px);
          line-height: 1.04;
          letter-spacing: -.045em;
          font-weight: 820;
        }

        .home-page .hero h1 em {
          color: var(--blue);
          font-style: normal;
        }

        .home-page .hero-copy {
          max-width: 610px;
          color: #607087;
          font-size: 17px;
          line-height: 1.75;
          margin: 0;
        }

        .home-page .hero-buttons {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 30px;
        }

        .home-page .hero-note {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 22px;
          color: #758397;
          font-size: 12px;
        }

        .home-page .hero-note svg {
          color: var(--teal);
        }

        /* ================================
           HERO CARD
        ================================= */

        .home-page .hero-visual {
          position: relative;
          min-height: 430px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .home-page .hero-card {
          width: min(100%, 430px);
          height: 270px;
          border-radius: 22px;
          padding: 28px;
          color: white;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 85% 18%,
              rgba(79,150,216,.4),
              transparent 27%
            ),
            linear-gradient(
              140deg,
              #0c2b50,
              #071a33 65%,
              #102f53
            );
          box-shadow: 0 28px 60px rgba(7,26,51,.23);
          transform: rotate(2deg);
        }

        .home-page .hero-card:before {
          content: "";
          position: absolute;
          width: 250px;
          height: 250px;
          right: -110px;
          top: -120px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.13);
          box-shadow:
            0 0 0 28px rgba(255,255,255,.025),
            0 0 0 58px rgba(255,255,255,.018);
        }

        .home-page .hero-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          z-index: 1;
        }

        .home-page .hero-card-bank {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .09em;
        }

        .home-page .hero-card-chip {
          width: 39px;
          height: 30px;
          border-radius: 7px;
          background: linear-gradient(135deg, #e6d19a, #a9843d);
          position: relative;
        }

        .home-page .hero-card-chip:after {
          content: "";
          position: absolute;
          inset: 6px;
          border: 1px solid rgba(80,60,20,.45);
          border-radius: 4px;
        }

        .home-page .hero-card-number {
          margin-top: 64px;
          font-size: 18px;
          letter-spacing: .2em;
          color: #f2f5f9;
          position: relative;
          z-index: 1;
        }

        .home-page .hero-card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 26px;
          position: relative;
          z-index: 1;
        }

        .home-page .card-label {
          color: rgba(255,255,255,.52);
          font-size: 8px;
          letter-spacing: .13em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .home-page .card-value {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .05em;
        }

        .home-page .card-mark {
          font-size: 16px;
          font-weight: 850;
          letter-spacing: -.04em;
        }

        .home-page .floating-balance {
          position: absolute;
          left: 0;
          bottom: 16px;
          width: 205px;
          padding: 17px;
          border-radius: 15px;
          background: rgba(255,255,255,.96);
          border: 1px solid rgba(221,229,239,.95);
          box-shadow: 0 18px 40px rgba(7,26,51,.14);
        }

        .home-page .balance-label {
          color: #8290a2;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .08em;
          font-weight: 750;
        }

        .home-page .balance-value {
          margin-top: 5px;
          color: var(--navy);
          font-size: 22px;
          font-weight: 820;
          letter-spacing: -.03em;
        }

        .home-page .balance-status {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 7px;
          color: #0f766e;
          font-size: 10px;
          font-weight: 750;
        }

        .home-page .mini-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #26a878;
        }

        .home-page .floating-security {
          position: absolute;
          right: 4px;
          top: 15px;
          width: 185px;
          padding: 15px;
          border-radius: 15px;
          background: rgba(255,255,255,.96);
          border: 1px solid rgba(221,229,239,.95);
          box-shadow: 0 18px 40px rgba(7,26,51,.12);
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .home-page .security-icon {
          width: 39px;
          height: 39px;
          border-radius: 11px;
          background: #e9f6f3;
          color: var(--teal);
          display: grid;
          place-items: center;
          flex: 0 0 auto;
        }

        .home-page .floating-security strong {
          display: block;
          font-size: 11px;
          color: var(--navy);
        }

        .home-page .floating-security span {
          display: block;
          margin-top: 3px;
          font-size: 9px;
          color: #7d8998;
        }

        /* ================================
           TRUST STRIP
        ================================= */

        .home-page .trust-strip {
          background: white;
          border-bottom: 1px solid var(--line);
        }

        .home-page .trust-inner {
          max-width: 1240px;
          min-height: 88px;
          padding: 20px 24px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1fr;
          gap: 24px;
          align-items: center;
        }

        .home-page .trust-intro {
          color: var(--navy);
          font-size: 12px;
          font-weight: 800;
          line-height: 1.45;
        }

        .home-page .trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #5f6e81;
          font-size: 11px;
          font-weight: 700;
        }

        .home-page .trust-icon {
          color: var(--blue);
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #eef5fb;
        }

        /* ================================
           GENERAL SECTIONS
        ================================= */

        .home-page .section {
          padding: 92px 24px;
        }

        .home-page .section-inner {
          max-width: 1240px;
          margin: 0 auto;
        }

        .home-page .section-heading {
          max-width: 720px;
          margin-bottom: 45px;
        }

        .home-page .section-kicker {
          color: var(--blue);
          font-size: 11px;
          font-weight: 850;
          letter-spacing: .11em;
          text-transform: uppercase;
        }

        .home-page .section-heading h2 {
          margin: 11px 0 12px;
          color: var(--navy);
          font-size: clamp(30px, 4vw, 43px);
          line-height: 1.1;
          letter-spacing: -.035em;
        }

        .home-page .section-heading p {
          color: var(--muted);
          font-size: 15px;
          line-height: 1.7;
          margin: 0;
        }

        /* ================================
           SERVICES
        ================================= */

        .home-page .services {
          background: #fbfcfe;
        }

        .home-page .service-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 17px;
        }

        .home-page .service-card {
          background: white;
          border: 1px solid var(--line);
          border-radius: 15px;
          padding: 25px 23px;
          min-height: 235px;
          transition:
            transform .22s ease,
            box-shadow .22s ease,
            border-color .22s ease;
        }

        .home-page .service-card:hover {
          transform: translateY(-4px);
          border-color: #cbd8e7;
          box-shadow: 0 16px 36px rgba(7,26,51,.08);
        }

        .home-page .service-icon {
          width: 48px;
          height: 48px;
          border-radius: 13px;
          background: #edf5fb;
          color: var(--blue);
          display: grid;
          place-items: center;
          margin-bottom: 24px;
        }

        .home-page .service-card h3 {
          margin: 0 0 9px;
          color: var(--navy);
          font-size: 16px;
        }

        .home-page .service-card p {
          margin: 0;
          color: #718096;
          font-size: 12px;
          line-height: 1.65;
        }

        .home-page .service-link {
          margin-top: 18px;
          color: var(--blue);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
        }

        /* ================================
           DIGITAL BANKING
        ================================= */

        .home-page .split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .home-page .feature-panel {
          min-height: 440px;
          border-radius: 22px;
          background:
            linear-gradient(
              135deg,
              rgba(7,26,51,.94),
              rgba(13,54,91,.96)
            ),
            #071a33;
          color: white;
          padding: 40px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 22px 50px rgba(7,26,51,.16);
        }

        .home-page .feature-panel:before {
          content: "";
          position: absolute;
          width: 350px;
          height: 350px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 50%;
          right: -130px;
          top: -150px;
          box-shadow:
            0 0 0 40px rgba(255,255,255,.025),
            0 0 0 90px rgba(255,255,255,.018);
        }

        .home-page .feature-panel .panel-label {
          position: relative;
          z-index: 1;
          color: #8ec3f2;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .home-page .feature-panel h3 {
          position: relative;
          z-index: 1;
          margin: 13px 0 12px;
          max-width: 460px;
          font-size: 34px;
          line-height: 1.1;
          letter-spacing: -.035em;
        }

        .home-page .feature-panel p {
          position: relative;
          z-index: 1;
          color: #b9c9da;
          font-size: 13px;
          line-height: 1.7;
          max-width: 450px;
        }

        .home-page .account-preview {
          position: absolute;
          z-index: 1;
          left: 40px;
          right: 40px;
          bottom: 35px;
          border-radius: 15px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);
          padding: 18px;
          backdrop-filter: blur(8px);
        }

        .home-page .preview-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #bdcada;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: .09em;
        }

        .home-page .preview-balance {
          margin-top: 8px;
          font-size: 28px;
          font-weight: 800;
        }

        .home-page .preview-line {
          height: 1px;
          background: rgba(255,255,255,.1);
          margin: 15px 0;
        }

        .home-page .preview-bottom {
          display: flex;
          justify-content: space-between;
          color: #aebfd1;
          font-size: 9px;
        }

        .home-page .feature-list {
          margin: 30px 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 18px;
        }

        .home-page .feature-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #526277;
          font-size: 13px;
          line-height: 1.6;
        }

        .home-page .feature-list strong {
          display: block;
          color: var(--navy);
          margin-bottom: 2px;
          font-size: 14px;
        }

        /* ================================
           SECURITY
        ================================= */

        .home-page .security-section {
          background: #f6f9fc;
        }

        .home-page .security-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .home-page .security-card {
          background: white;
          border: 1px solid var(--line);
          border-radius: 15px;
          padding: 28px;
        }

        .home-page .security-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          color: var(--teal);
          background: #eaf7f4;
          margin-bottom: 21px;
        }

        .home-page .security-card h3 {
          color: var(--navy);
          font-size: 15px;
          margin: 0 0 8px;
        }

        .home-page .security-card p {
          color: #718096;
          font-size: 12px;
          line-height: 1.7;
          margin: 0;
        }

        /* ================================
           FINANCIAL GOALS
        ================================= */

        .home-page .goals-section {
          padding-bottom: 100px;
        }

        .home-page .goals-card {
          border-radius: 22px;
          padding: 48px;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(66,134,194,.18),
              transparent 28%
            ),
            linear-gradient(
              120deg,
              #071a33,
              #0b2b4f
            );
          color: white;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 50px;
          box-shadow: 0 24px 55px rgba(7,26,51,.15);
        }

        .home-page .goals-card .section-kicker {
          color: #8fc7f6;
        }

        .home-page .goals-card h2 {
          color: white;
          margin: 10px 0;
          font-size: 34px;
          line-height: 1.12;
          letter-spacing: -.035em;
        }

        .home-page .goals-card p {
          color: #b8c9da;
          max-width: 620px;
          font-size: 13px;
          line-height: 1.7;
          margin: 0;
        }

        .home-page .goals-button {
          white-space: nowrap;
          background: white;
          color: var(--navy);
          padding: 14px 19px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        /* ================================
           NEWS
        ================================= */

        .home-page .news {
          background: #fbfcfe;
        }

        .home-page .news-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .home-page .news-card {
          background: white;
          border: 1px solid var(--line);
          border-radius: 15px;
          overflow: hidden;
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .home-page .news-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 32px rgba(7,26,51,.09);
        }

        .home-page .news-image {
          height: 175px;
          position: relative;
          overflow: hidden;
          background: #0b2547;
        }

        .home-page .news-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .4s ease;
        }

        .home-page .news-card:hover .news-image img {
          transform: scale(1.05);
        }

        .home-page .news-image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to bottom,
              rgba(7,26,51,.02),
              rgba(7,26,51,.5)
            );
          pointer-events: none;
        }

        .home-page .news-category {
          position: absolute;
          left: 17px;
          top: 17px;
          z-index: 2;
          color: white;
          background: rgba(7,26,51,.72);
          border: 1px solid rgba(255,255,255,.18);
          backdrop-filter: blur(6px);
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .home-page .news-body {
          padding: 22px;
        }

        .home-page .news-date {
          color: #8996a7;
          font-size: 10px;
          font-weight: 700;
        }

        .home-page .news-card h3 {
          color: var(--navy);
          margin: 8px 0 9px;
          font-size: 15px;
          line-height: 1.35;
        }

        .home-page .news-card p {
          color: #718096;
          font-size: 11px;
          line-height: 1.65;
          margin: 0;
        }

        .home-page .news-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--blue);
          font-size: 11px;
          font-weight: 800;
          margin-top: 17px;
        }

        .home-page .news-link:hover {
          color: #0d4b7f;
        }

        /* ================================
           FOOTER
        ================================= */

        .home-page .footer {
          background: #06162b;
          color: #aebdcd;
          padding: 62px 24px 28px;
        }

        .home-page .footer-inner {
          max-width: 1240px;
          margin: 0 auto;
        }

        .home-page .footer-top {
          display: grid;
          grid-template-columns: 1.7fr repeat(3, 1fr);
          gap: 50px;
          padding-bottom: 45px;
          border-bottom: 1px solid rgba(255,255,255,.09);
        }

        .home-page .footer-brand {
          max-width: 300px;
        }

        .home-page .footer-brand .brand-name {
          color: white;
        }

        .home-page .footer-brand p {
          margin: 17px 0 0;
          color: #8496aa;
          font-size: 11px;
          line-height: 1.75;
        }

        .home-page .footer-column h4 {
          margin: 0 0 15px;
          color: white;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .09em;
        }

        .home-page .footer-column a {
          display: block;
          color: #8fa1b5;
          font-size: 11px;
          margin: 10px 0;
        }

        .home-page .footer-column a:hover {
          color: white;
        }

        .home-page .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding-top: 24px;
          color: #71859b;
          font-size: 10px;
        }

        .home-page .footer-bottom-links {
          display: flex;
          gap: 18px;
        }

        .home-page .footer-bottom-links a:hover {
          color: white;
        }

        /* ================================
           RESPONSIVE
        ================================= */

        @media (max-width: 1050px) {
          .home-page .nav-links {
            gap: 16px;
          }

          .home-page .hero-inner {
            gap: 35px;
          }

          .home-page .service-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .home-page .footer-top {
            grid-template-columns: 1.5fr 1fr 1fr;
          }
        }

        @media (max-width: 820px) {
          .home-page .topbar-right {
            display: none;
          }

          .home-page .nav {
            min-height: 70px;
          }

          .home-page .nav-links {
            display: none;
          }

          .home-page .brand {
            min-width: 0;
          }

          .home-page .nav-actions .button-outline {
            display: none;
          }

          .home-page .hero-inner {
            grid-template-columns: 1fr;
            padding-top: 55px;
          }

          .home-page .hero-visual {
            min-height: 390px;
          }

          .home-page .split {
            grid-template-columns: 1fr;
            gap: 45px;
          }

          .home-page .security-grid {
            grid-template-columns: 1fr;
          }

          .home-page .goals-card {
            grid-template-columns: 1fr;
          }

          .home-page .news-grid {
            grid-template-columns: 1fr;
          }

          .home-page .footer-top {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 560px) {
          .home-page .topbar {
            font-size: 10px;
          }

          .home-page .nav {
            padding: 0 16px;
          }

          .home-page .brand-name {
            font-size: 11px;
          }

          .home-page .brand-sub {
            font-size: 8px;
          }

          .home-page .brand-mark {
            width: 39px;
            height: 39px;
            border-radius: 10px;
          }

          .home-page .nav-actions .button-primary {
            min-height: 39px;
            padding: 0 13px;
            font-size: 11px;
          }

          .home-page .hero-inner {
            padding: 43px 17px 52px;
          }

          .home-page .hero h1 {
            font-size: 39px;
          }

          .home-page .hero-copy {
            font-size: 14px;
          }

          .home-page .hero-card {
            height: 235px;
            padding: 23px;
          }

          .home-page .hero-card-number {
            margin-top: 48px;
            font-size: 14px;
          }

          .home-page .floating-balance {
            left: -4px;
            bottom: 4px;
            width: 174px;
          }

          .home-page .floating-security {
            right: -3px;
            top: 5px;
            width: 166px;
          }

          .home-page .trust-inner {
            grid-template-columns: 1fr 1fr;
            padding: 20px 17px;
          }

          .home-page .trust-intro {
            grid-column: 1 / -1;
          }

          .home-page .section {
            padding: 65px 17px;
          }

          .home-page .service-grid {
            grid-template-columns: 1fr;
          }

          .home-page .feature-panel {
            padding: 29px;
            min-height: 430px;
          }

          .home-page .feature-panel h3 {
            font-size: 28px;
          }

          .home-page .account-preview {
            left: 29px;
            right: 29px;
            bottom: 29px;
          }

          .home-page .goals-card {
            padding: 30px;
          }

          .home-page .goals-card h2 {
            font-size: 27px;
          }

          .home-page .news-image {
            height: 190px;
          }

          .home-page .footer {
            padding-left: 17px;
            padding-right: 17px;
          }

          .home-page .footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 32px 22px;
          }

          .home-page .footer-brand {
            grid-column: 1 / -1;
          }

          .home-page .footer-bottom {
            align-items: flex-start;
            flex-direction: column;
          }

          .home-page .footer-bottom-links {
            flex-wrap: wrap;
          }
        }
      `}</style>

      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <div className="topbar">
        <div className="topbar-inner">

          <div className="topbar-left">
            <span className="status-dot" />
            <span>
              Secure online banking is available 24 hours a day.
            </span>
          </div>

          <div className="topbar-right">
            <span>Member Services</span>
            <span>•</span>
            <span>Customer Support</span>
          </div>

        </div>
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="header">
        <nav className="nav">

          <Link
            href="/"
            className="brand"
            aria-label="MidAtlantic Federal Bank home"
          >
            <div className="brand-mark">
              <span>MF</span>
            </div>

            <div>
              <div className="brand-name">
                MIDATLANTIC FEDERAL BANK
              </div>

              <div className="brand-sub">
                Banking with confidence
              </div>
            </div>
          </Link>

          <div className="nav-links">

            <Link href="/" className="nav-link">
              Home
            </Link>

            <Link href="/about" className="nav-link">
              About
            </Link>

            <Link href="/services" className="nav-link">
              Services
            </Link>

            <Link href="/loans" className="nav-link">
              Loans
            </Link>

            <Link href="/news" className="nav-link">
              News
            </Link>

            <Link href="/contact" className="nav-link">
              Contact
            </Link>

          </div>

          <div className="nav-actions">

            <Link
              href="/login"
              className="button button-outline"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="button button-primary"
            >
              Open Account
              <ArrowRight />
            </Link>

          </div>

        </nav>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="hero">
        <div className="hero-inner">

          <div>

            <div className="eyebrow">
              <ShieldIcon />
              Banking built around you
            </div>

            <h1>
              Your money.
              <br />
              Your future.
              <br />
              <em>Your bank.</em>
            </h1>

            <p className="hero-copy">
              A modern banking experience designed to make everyday
              money management simple, secure, and accessible —
              wherever life takes you.
            </p>

            <div className="hero-buttons">

              <Link
                href="/signup"
                className="button button-blue"
              >
                Open an Account
                <ArrowRight />
              </Link>

              <Link
                href="/login"
                className="button button-outline"
              >
                Access Online Banking
              </Link>

            </div>

            <div className="hero-note">
              <LockIcon />
              Secure access • Protected account information • 24/7 online access
            </div>

          </div>

          {/* HERO BANK CARD */}

          <div
            className="hero-visual"
            aria-hidden="true"
          >

            <div className="hero-card">

              <div className="hero-card-top">

                <div className="hero-card-bank">
                  MIDATLANTIC
                  <br />
                  FEDERAL BANK
                </div>

                <div className="hero-card-chip" />

              </div>

              <div className="hero-card-number">
                •••• &nbsp; •••• &nbsp; •••• &nbsp; 4821
              </div>

              <div className="hero-card-bottom">

                <div>
                  <div className="card-label">
                    Cardholder
                  </div>

                  <div className="card-value">
                    MIDATLANTIC CUSTOMER
                  </div>
                </div>

                <div>
                  <div className="card-label">
                    Valid thru
                  </div>

                  <div className="card-value">
                    •• / ••
                  </div>
                </div>

                <div className="card-mark">
                  MF
                </div>

              </div>

            </div>

            <div className="floating-security">

              <div className="security-icon">
                <ShieldIcon />
              </div>

              <div>
                <strong>
                  Secure banking
                </strong>

                <span>
                  Protection at every step
                </span>
              </div>

            </div>

            <div className="floating-balance">

              <div className="balance-label">
                Online banking
              </div>

              <div className="balance-value">
                Ready when you are
              </div>

              <div className="balance-status">
                <span className="mini-dot" />
                Account access available
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          TRUST STRIP
      ====================================================== */}

      <section className="trust-strip">
        <div className="trust-inner">

          <div className="trust-intro">
            Banking designed for confidence,
            <br />
            convenience, and control.
          </div>

          <div className="trust-item">
            <div className="trust-icon">
              <ShieldIcon />
            </div>
            Secure banking
          </div>

          <div className="trust-item">
            <div className="trust-icon">
              <LockIcon />
            </div>
            Protected access
          </div>

          <div className="trust-item">
            <div className="trust-icon">
              <TransferIcon />
            </div>
            Convenient transfers
          </div>

        </div>
      </section>

      {/* =====================================================
          BANKING SERVICES
      ====================================================== */}

      <section className="section services">

        <div className="section-inner">

          <div className="section-heading">

            <div className="section-kicker">
              Banking services
            </div>

            <h2>
              Everything you need, in one place.
            </h2>

            <p>
              From everyday banking to cards, transfers,
              lending, and digital account management, we make
              it easier to stay in control of your finances.
            </p>

          </div>

          <div className="service-grid">

            <div className="service-card">

              <div className="service-icon">
                <BuildingIcon />
              </div>

              <h3>
                Checking Accounts
              </h3>

              <p>
                Manage everyday spending with convenient access
                to your account and digital banking tools.
              </p>

              <Link
                href="/services"
                className="service-link"
              >
                Explore checking
                <ArrowRight />
              </Link>

            </div>

            <div className="service-card">

              <div className="service-icon">
                <CardIcon />
              </div>

              <h3>
                Debit &amp; Cards
              </h3>

              <p>
                Access your card information securely and manage
                your banking experience from your dashboard.
              </p>

              <Link
                href="/services"
                className="service-link"
              >
                View card services
                <ArrowRight />
              </Link>

            </div>

            <div className="service-card">

              <div className="service-icon">
                <TransferIcon />
              </div>

              <h3>
                Transfers
              </h3>

              <p>
                Move money conveniently with supported local,
                wire, and external bank transfer services.
              </p>

              <Link
                href="/services"
                className="service-link"
              >
                Explore transfers
                <ArrowRight />
              </Link>

            </div>

            <div className="service-card">

              <div className="service-icon">
                <ChartIcon />
              </div>

              <h3>
                Loans &amp; Financing
              </h3>

              <p>
                Explore financing options designed to support
                important personal and financial goals.
              </p>

              <Link
                href="/loans"
                className="service-link"
              >
                Explore lending
                <ArrowRight />
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          DIGITAL BANKING
      ====================================================== */}

      <section className="section">

        <div className="section-inner">

          <div className="split">

            <div className="feature-panel">

              <div className="panel-label">
                Digital banking
              </div>

              <h3>
                A clearer view of your money starts here.
              </h3>

              <p>
                Sign in to manage your account, review activity,
                manage cards, request services, and send supported
                transfers from one secure dashboard.
              </p>

              <div className="account-preview">

                <div className="preview-top">
                  <span>
                    Account overview
                  </span>

                  <span>
                    Active
                  </span>
                </div>

                <div className="preview-balance">
                  $ ————
                </div>

                <div className="preview-line" />

                <div className="preview-bottom">
                  <span>
                    Available balance
                  </span>

                  <span>
                    Online
                  </span>
                </div>

              </div>

            </div>

            <div>

              <div className="section-kicker">
                Built for everyday banking
              </div>

              <div
                className="section-heading"
                style={{ marginBottom: 0 }}
              >

                <h2>
                  Simple tools. Clear information.
                  Secure access.
                </h2>

                <p>
                  Your banking experience should not feel
                  complicated. Our digital platform puts the
                  tools you use most within easy reach.
                </p>

              </div>

              <ul className="feature-list">

                <li>
                  <CheckIcon />

                  <div>
                    <strong>
                      Account visibility
                    </strong>

                    Review your account information and recent
                    activity from one dashboard.
                  </div>
                </li>

                <li>
                  <CheckIcon />

                  <div>
                    <strong>
                      Convenient money movement
                    </strong>

                    Access supported transfer and payment
                    services without unnecessary steps.
                  </div>
                </li>

                <li>
                  <CheckIcon />

                  <div>
                    <strong>
                      Card management
                    </strong>

                    View supported card information and submit
                    card service requests securely.
                  </div>
                </li>

                <li>
                  <CheckIcon />

                  <div>
                    <strong>
                      Account security
                    </strong>

                    Built-in account protections help keep
                    your banking information private and secure.
                  </div>
                </li>

              </ul>

              <div style={{ marginTop: 29 }}>

                <Link
                  href="/login"
                  className="button button-primary"
                >
                  Sign In to Online Banking
                  <ArrowRight />
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          SECURITY
      ====================================================== */}

      <section className="section security-section">

        <div className="section-inner">

          <div className="section-heading">

            <div className="section-kicker">
              Security first
            </div>

            <h2>
              Your trust matters to us.
            </h2>

            <p>
              Banking is personal. We take account access and
              the protection of your information seriously.
            </p>

          </div>

          <div className="security-grid">

            <div className="security-card">

              <div className="security-card-icon">
                <ShieldIcon />
              </div>

              <h3>
                Secure account access
              </h3>

              <p>
                Access your banking dashboard through authenticated
                online banking and protected account sessions.
              </p>

            </div>

            <div className="security-card">

              <div className="security-card-icon">
                <LockIcon />
              </div>

              <h3>
                Privacy-focused design
              </h3>

              <p>
                Sensitive account and card information is handled
                with a focus on limiting unnecessary exposure.
              </p>

            </div>

            <div className="security-card">

              <div className="security-card-icon">
                <TransferIcon />
              </div>

              <h3>
                Protected transactions
              </h3>

              <p>
                Supported transfer services are processed through
                secure transaction workflows designed to protect
                account activity.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FINANCIAL GOALS
      ====================================================== */}

      <section className="section goals-section">

        <div className="section-inner">

          <div className="goals-card">

            <div>

              <div className="section-kicker">
                Your financial journey
              </div>

              <h2>
                Wherever you're headed,
                we're here to help.
              </h2>

              <p>
                Whether you're managing everyday expenses,
                planning ahead, or exploring financing,
                MidAtlantic Federal Bank gives you tools
                to help manage your financial life with confidence.
              </p>

            </div>

            <Link
              href="/signup"
              className="goals-button"
            >
              Get Started
              <ArrowRight />
            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          NEWS
          REAL IMAGES RESTORED
      ====================================================== */}

      <section className="section news">

        <div className="section-inner">

          <div
            className="section-heading"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 25,
              maxWidth: "none",
            }}
          >

            <div>

              <div className="section-kicker">
                From the bank
              </div>

              <h2 style={{ marginBottom: 0 }}>
                Latest updates
              </h2>

            </div>

            <Link
              href="/news"
              className="news-link"
            >
              View all news
              <ArrowRight />
            </Link>

          </div>

          <div className="news-grid">

            {/* ============================================
                NEWS CARD 1
            ============================================= */}

            <article className="news-card">

              <div className="news-image">

                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85"
                  alt="Business professionals discussing financial information"
                />

                <div className="news-image-overlay" />

                <div className="news-category">
                  Banking
                </div>

              </div>

              <div className="news-body">

                <div className="news-date">
                  Banking information
                </div>

                <h3>
                  Making digital banking easier to navigate
                </h3>

                <p>
                  Discover the tools available through your online
                  banking experience and manage your accounts with
                  greater convenience.
                </p>

                <Link
                  href="/news"
                  className="news-link"
                >
                  Read more
                  <ArrowRight />
                </Link>

              </div>

            </article>

            {/* ============================================
                NEWS CARD 2
            ============================================= */}

            <article className="news-card">

              <div className="news-image">

                <img
                  src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1000&q=85"
                  alt="Financial markets and international business"
                />

                <div className="news-image-overlay" />

                <div className="news-category">
                  Markets
                </div>

              </div>

              <div className="news-body">

                <div className="news-date">
                  Market information
                </div>

                <h3>
                  Understanding today's changing financial landscape
                </h3>

                <p>
                  Stay informed about developments that can affect
                  businesses, consumers, and the wider financial
                  environment.
                </p>

                <Link
                  href="/news"
                  className="news-link"
                >
                  Read more
                  <ArrowRight />
                </Link>

              </div>

            </article>

            {/* ============================================
                NEWS CARD 3
            ============================================= */}

            <article className="news-card">

              <div className="news-image">

                <img
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=85"
                  alt="Secure digital banking on a mobile device"
                />

                <div className="news-image-overlay" />

                <div className="news-category">
                  Security
                </div>

              </div>

              <div className="news-body">

                <div className="news-date">
                  Security information
                </div>

                <h3>
                  Keeping your online banking information protected
                </h3>

                <p>
                  Learn practical ways to protect your account,
                  login information, and personal banking details
                  when using digital services.
                </p>

                <Link
                  href="/news"
                  className="news-link"
                >
                  Read more
                  <ArrowRight />
                </Link>

              </div>

            </article>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">

        <div className="footer-inner">

          <div className="footer-top">

            <div className="footer-brand">

              <div className="brand">

                <div className="brand-mark">
                  <span>MF</span>
                </div>

                <div>

                  <div className="brand-name">
                    MIDATLANTIC FEDERAL BANK
                  </div>

                  <div className="brand-sub">
                    Banking with confidence
                  </div>

                </div>

              </div>

              <p>
                Modern banking services built around secure
                access, convenient tools, and a clear digital
                experience.
              </p>

            </div>

            <div className="footer-column">

              <h4>
                Banking
              </h4>

              <Link href="/services">
                Services
              </Link>

              <Link href="/loans">
                Loans
              </Link>

              <Link href="/news">
                News
              </Link>

              <Link href="/contact">
                Contact
              </Link>

            </div>

            <div className="footer-column">

              <h4>
                Account
              </h4>

              <Link href="/login">
                Sign In
              </Link>

              <Link href="/signup">
                Open Account
              </Link>

              <Link href="/dashboard">
                Online Banking
              </Link>

            </div>

            <div className="footer-column">

              <h4>
                Information
              </h4>

              <Link href="/about">
                About Us
              </Link>

              <Link href="/contact">
                Customer Support
              </Link>

              <Link href="/news">
                Bank Updates
              </Link>

            </div>

          </div>

          <div className="footer-bottom">

            <div>
              © {new Date().getFullYear()} MidAtlantic Federal Bank.
              All rights reserved.
            </div>

            <div className="footer-bottom-links">

              <Link href="/contact">
                Privacy
              </Link>

              <Link href="/contact">
                Security
              </Link>

              <Link href="/contact">
                Terms
              </Link>

            </div>

          </div>

        </div>

      </footer>

    </main>
  );
}
