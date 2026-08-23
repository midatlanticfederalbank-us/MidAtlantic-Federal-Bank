import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
  try {
    const {
      email,
      fullName,
    } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Customer email is required." },
        { status: 400 }
      );
    }

    const msg = {
      to: email,
      from: {
        email: "midfb@outlook.com",
        name: "MidAtlantic Federal Bank",
      },
      replyTo: "midfb@outlook.com",
      subject: "Registration Approved",
      html: `
        <h2>Your registration has been approved.</h2>

        <p>
          Hello ${fullName || "Customer"},
        </p>

        <p>
          Your registration has been approved.
          You can now sign in to your account dashboard.
        </p>

        <p>
          This is a project/demo notification.
        </p>
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
