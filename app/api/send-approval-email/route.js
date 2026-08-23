import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(request) {
  console.log("APPROVAL EMAIL ROUTE CALLED");
  try {
    const {
      email,
      fullName,
      accountNumber,
      accountType,
    } = await request.json();

    if (
      !email ||
      !accountNumber ||
      !accountType
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required email information.",
        },
        { status: 400 }
      );
    }

    const { data, error } =
      await resend.emails.send({
        from:
          "Resend <onboarding@resend.dev>",
        to: [email],
        subject:
          "Your Account Registration Has Been Approved",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Your Account Registration Has Been Approved</h2>

            <p>
              Hello ${escapeHtml(
                fullName || "Customer"
              )},
            </p>

            <p>
              Congratulations. Your account
              registration has been approved.
            </p>

            <p>
              <strong>Account Number:</strong>
              ${escapeHtml(accountNumber)}
            </p>

            <p>
              <strong>Account Type:</strong>
              ${escapeHtml(accountType)}
            </p>

            <p>
              You can now sign in to your
              account dashboard.
            </p>

            <p>
              For your security, never share
              your password, PIN, verification
              codes, or other sensitive account
              information with anyone.
            </p>
          </div>
        `,
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to send email.",
      },
      { status: 500 }
    );
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
