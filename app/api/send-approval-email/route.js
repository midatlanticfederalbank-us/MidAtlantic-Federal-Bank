import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST() {
  try {
    console.log("RESEND TEST ROUTE CALLED");

    const { data, error } =
      await resend.emails.send({
        from: "Resend <onboarding@resend.dev>",
        to: ["midatlanticfederalbank@gmail.com"],
        subject: "Email System Test",
        html: `
          <h2>Email System Test</h2>
          <p>This is a development test of the website email system.</p>
          <p>If you received this message, the Resend connection is working.</p>
        `,
      });

    if (error) {
      console.error("RESEND ERROR:", error);

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log("RESEND SUCCESS:", data?.id);

    return NextResponse.json({
      success: true,
      id: data?.id,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Email test failed.",
      },
      { status: 500 }
    );
  }
}
