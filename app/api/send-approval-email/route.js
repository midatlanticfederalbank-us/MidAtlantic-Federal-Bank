import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(request) {
  try {
    const {
      email,
      fullName,
      customerNumber,
    } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Customer email is required." },
        { status: 400 }
      );
    }

    const { data, error } =
      await resend.emails.send({
        from: "Resend <onboarding@resend.dev>",
        to: [email],
        subject: "Registration Approved",
        html: `
          <h2>Your registration has been approved.</h2>

          <p>
            <strong>Customer Number:</strong>
            ${customerNumber || "Not assigned"}
          </p>

          <p>
            You can now sign in to your account dashboard.
          </p>
        `,
      });

    if (error) {
      console.error("RESEND ERROR:", error);

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
    console.error("SERVER ERROR:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to send registration email.",
      },
      { status: 500 }
    );
  }
}
