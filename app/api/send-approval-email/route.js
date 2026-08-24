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
        { error: "Customer email is required." },
        { status: 400 }
      );
    }

    if (!accountNumber) {
      return NextResponse.json(
        { error: "Customer account number is required." },
        { status: 400 }
      );
    }

    const signInUrl =
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://mid-atlantic-federal-bank-7m2m.vercel.app"}/login`;

    const msg = {
      to: email,

      from: {
        email: "midfb@outlook.com",
        name: "MidAtlantic Federal Bank",
      },

      replyTo: "midfb@outlook.com",

      subject: "Your Registration Has Been Approved",

      html: `
        <div style="
          margin:0;
          padding:40px 20px;
          background:#f4f7fb;
          font-family:Arial,Helvetica,sans-serif;
        ">

          <div style="
            max-width:600px;
            margin:0 auto;
            background:#ffffff;
            border-radius:12px;
            overflow:hidden;
            border:1px solid #e5e7eb;
          ">

            <div style="
              background:#0f2a44;
              padding:28px 30px;
              text-align:center;
            ">
              <h1 style="
                margin:0;
                color:#ffffff;
                font-size:24px;
              ">
                MidAtlantic Federal Bank
              </h1>

              <p style="
                margin:8px 0 0;
                color:#dbe7f3;
                font-size:14px;
              ">
                Customer Account Services
              </p>
            </div>

            <div style="padding:32px 30px;">

              <h2 style="
                margin:0 0 18px;
                color:#172033;
                font-size:22px;
              ">
                Registration Approved
              </h2>

              <p style="
                color:#374151;
                font-size:16px;
                line-height:1.6;
              ">
                Hello ${fullName || "Customer"},
              </p>

              <p style="
                color:#374151;
                font-size:16px;
                line-height:1.6;
              ">
                Your registration has been approved. Your customer
                account is now ready for you to access.
              </p>

              <div style="
                margin:25px 0;
                padding:20px;
                background:#f8fafc;
                border:1px solid #dbe3ec;
                border-radius:8px;
              ">

                <p style="
                  margin:0 0 8px;
                  color:#6b7280;
                  font-size:13px;
                ">
                  ACCOUNT NUMBER
                </p>

                <p style="
  margin:0;
  color:#172033;
  font-size:22px;
  font-weight:bold;
  letter-spacing:1px;
">
  <span style="color:#172033;">
    ${accountNumber}
  </span>
</p>

              </div>

              <div style="text-align:center; margin:30px 0;">

                <a
                  href="${signInUrl}"
                  style="
                    display:inline-block;
                    padding:14px 28px;
                    background:#0f2a44;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:7px;
                    font-size:16px;
                    font-weight:bold;
                  "
                >
                  Sign In to Your Account
                </a>

              </div>

              <p style="
                color:#6b7280;
                font-size:13px;
                line-height:1.5;
              ">
                If you did not create this account, please contact
                customer support.
              </p>

            </div>

            <div style="
              padding:20px 30px;
              background:#f8fafc;
              border-top:1px solid #e5e7eb;
              text-align:center;
            ">

              <p style="
                margin:0;
                color:#6b7280;
                font-size:12px;
              ">
                MidAtlantic Federal Bank
              </p>

            </div>

          </div>

        </div>
      `,
    };

    const response = await sgMail.send(msg);

    console.log(
      "SENDGRID SUCCESS:",
      response[0]?.statusCode
    );

    return NextResponse.json({
      success: true,
      message: "Registration email sent.",
    });
  } catch (error) {
    console.error(
      "SENDGRID ERROR:",
      error?.response?.body || error?.message
    );

    return NextResponse.json(
      {
        error:
          error?.response?.body?.errors?.[0]?.message ||
          error?.message ||
          "Unable to send registration email.",
      },
      { status: 500 }
    );
  }
}
