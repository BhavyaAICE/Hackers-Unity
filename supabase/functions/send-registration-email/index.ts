/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  to: string;
  userName: string;
  eventType: string;
  eventTitle: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { to, userName, eventType, eventTitle }: EmailRequest = await req.json();

    console.log("Email request received:", { to, userName, eventType, eventTitle });

    if (!to || !userName || !userName.trim() || !eventType || !eventTitle) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not found in environment");
      return new Response(
        JSON.stringify({ error: "Email service not configured. RESEND_API_KEY not found." }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("API Key found, proceeding with email send");

    const currentYear = new Date().getFullYear();
    const eventUrl = "https://hackersunity.org";

    const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Registration Confirmed – Hacker's Unity</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #000000;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        color: #ffffff;
      }

      .container {
        max-width: 560px;
        margin: 0 auto;
        padding: 40px 20px;
      }

      .card {
        background-color: #0a0a0a;
        border-radius: 14px;
        padding: 40px 32px;
        border: 1px solid #1f1f1f;
        text-align: center;
      }

      .logo img {
        width: 120px;
        margin-bottom: 28px;
      }

      h1 {
        font-size: 22px;
        margin-bottom: 16px;
        font-weight: 600;
        color: #ffffff;
      }

      p {
        font-size: 15px;
        line-height: 1.7;
        color: #cfcfcf;
        margin-bottom: 22px;
      }

      .highlight {
        color: #ffffff;
        font-weight: 600;
      }

      .button {
        display: inline-block;
        background-color: #ffffff;
        color: #000000 !important;
        text-decoration: none;
        padding: 14px 34px;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
        margin-top: 10px;
      }

      .divider {
        height: 1px;
        background-color: #1f1f1f;
        margin: 30px 0;
      }

      .footer {
        font-size: 13px;
        color: #9a9a9a;
        line-height: 1.6;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="card">

        <div class="logo">
          <img
            src="https://raw.githubusercontent.com/BhavyaAICE/Hackers-Unity/main/src/assets/hackers-unity-logo.png"
            alt="Hacker's Unity Logo"
          />
        </div>

        <h1>You're Registered 🎉</h1>

        <p>Hi <span class="highlight">${userName}</span>,</p>

        <p>
          You have successfully registered for the
          <span class="highlight">${eventType} – ${eventTitle}</span>.
        </p>

        <p>
          We'll be sharing important updates, schedules, and joining details
          with you soon. Stay tuned!
        </p>

        <a href="${eventUrl}" class="button">
          View Event Details
        </a>

        <div class="divider"></div>

        <p>
          If you didn't register for this event, you can safely ignore this email.
        </p>

        <div class="footer">
          © ${currentYear} Hacker's Unity<br />
          Building India's next generation of technologists
        </div>

      </div>
    </div>
  </body>
</html>`;

    const emailBody = {
      from: "Hackers Unity <onboarding@resend.dev>",
      to: [to],
      subject: `Registration Confirmed - ${eventTitle}`,
      html: htmlContent,
    };

    console.log("Sending email with body:", emailBody);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + resendApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailBody),
    });

    const responseText = await response.text();
    console.log("Resend response status:", response.status);
    console.log("Resend response text:", responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { raw: responseText };
    }

    if (!response.ok) {
      console.error("Resend API error:", responseData);
      return new Response(
        JSON.stringify({ 
          error: "Failed to send email", 
          status: response.status,
          details: responseData 
        }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("Email sent successfully:", responseData);
    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully", data: responseData }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in email function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error instanceof Error ? error.message : String(error) 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
