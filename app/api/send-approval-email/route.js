import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
  try {
    const {
      email,
      fullName,
      accountNumber,
    } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          error: "Customer email is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!accountNumber) {
      return NextResponse.json(
        {
          error: "Customer account number is required.",
        },
        {
          status: 400,
        }
      );
    }

    const signInUrl =
      `${
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://mid-atlantic-federal-bank-7m2m.vercel.app"
      }/login`;

    const customerName =
      fullName || "Customer";

    const msg = {
      to: email,

      from: {
        email: "midfb@outlook.com",
        name: "MidAtlantic Federal Bank",
      },

      replyTo: "midfb@outlook.com",

      subject: "Registration approved",

      text: `
Hello ${customerName},

Your registration has been approved.

Your customer account number is:

${accountNumber}

You can sign in to your account here:

${signInUrl}

If you did not create this account, please contact customer support.

MidAtlantic Federal Bank
Customer Account Services
      `.trim(),

      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration approved</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f4f7fb;
    font-family:Arial,Helvetica,sans-serif;
  "
>

  <div
    style="
      width:100%;
      padding:30px 0;
      background:#f4f7fb;
    "
  >

    <div
      style="
        max-width:600px;
        margin:0 auto;
        background:#ffffff;
        border:1px solid #e5e7eb;
      "
    >

      <!-- Header -->

      <div
        style="
          background:#0f2a44;
          padding:25px 20px;
          text-align:center;
        "
      >

        <h1
          style="
            margin:0;
            color:#ffffff;
            font-size:24px;
            font-weight:bold;
          "
        >
          MidAtlantic Federal Bank
        </h1>

        <p
          style="
            margin:8px 0 0;
            color:#dbe7f3;
            font-size:14px;
          "
        >
          Customer Account Services
        </p>

      </div>

      <!-- Content -->

      <div
        style="
          padding:30px;
        "
      >

        <h2
          style="
            margin:0 0 20px;
            color:#172033;
            font-size:22px;
          "
        >
          Registration approved
        </h2>

        <p
          style="
            margin:0 0 15px;
            color:#374151;
            font-size:16px;
            line-height:1.6;
          "
        >
          Hello ${customerName},
        </p>

        <p
          style="
            margin:0 0 20px;
            color:#374151;
            font-size:16px;
            line-height:1.6;
          "
        >
          Your registration has been approved.
          Your customer account is now ready to access.
        </p>

        <!-- Account number -->

        <div
          style="
            margin:25px 0;
            padding:20px;
            background:#f8fafc;
            border:1px solid #dbe3ec;
          "
        >

          <p
            style="
              margin:0 0 8px;
              color:#6b7280;
              font-size:13px;
              font-weight:bold;
            "
          >
            ACCOUNT NUMBER
          </p>

          <p
            style="
              margin:0;
              color:#172033;
              font-size:22px;
              font-weight:bold;
              letter-spacing:1px;
            "
          >
            ${accountNumber}
          </p>

        </div>

        <!-- Sign in -->

        <p
          style="
            margin:25px 0 10px;
            color:#374151;
            font-size:16px;
            line-height:1.6;
          "
        >
          You can sign in to your account here:
        </p>

        <p
          style="
            margin:0 0 25px;
          "
        >
          <a
            href="${signInUrl}"
            style="
              color:#0f2a44;
              font-size:16px;
              font-weight:bold;
            "
          >
            Sign in to your account
          </a>
        </p>

        <p
          style="
            margin:0;
            color:#6b7280;
            font-size:13px;
            line-height:1.5;
          "
        >
          If you did not create this account,
          please contact customer support.
        </p>

      </div>

      <!-- Footer -->

      <div
        style="
          padding:20px 30px;
          background:#f8fafc;
          border-top:1px solid #e5e7eb;
          text-align:center;
        "
      >

        <p
          style="
            margin:0;
            color:#6b7280;
            font-size:12px;
          "
        >
          MidAtlantic Federal Bank
        </p>

        <p
          style="
            margin:6px 0 0;
            color:#9ca3af;
            font-size:11px;
          "
        >
          Customer Account Services
        </p>

      </div>

    </div>

  </div>

</body>
</html>
      `,
    };

    const response = await sgMail.send(msg);

    console.log(
      "SENDGRID SUCCESS:",
      response[0]?.statusCode
    );

    return NextResponse.json(
      {
        success: true,
        message: "Registration email sent.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "SENDGRID ERROR:",
      error?.response?.body ||
        error?.message ||
        error
    );

    return NextResponse.json(
      {
        error:
          error?.response?.body?.errors?.[0]?.message ||
          error?.message ||
          "Unable to send registration email.",
      },
      {
        status: 500,
      }
    );
  }
}
