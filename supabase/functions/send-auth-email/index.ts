import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailPayload {
  user: {
    email: string;
    user_metadata?: {
      full_name?: string;
    };
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

const generateConfirmationEmail = (
  confirmationUrl: string,
  userName?: string
): string => {
  const currentYear = new Date().getFullYear();
  const displayName = userName || "there";

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Confirm your email – Hacker's Unity</title>
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
        <h1>Confirm your email address</h1>
        <p>
          Hi ${displayName},<br/><br/>
          Thank you for joining <strong>Hacker's Unity</strong> — a community built for
          developers, innovators, and technology enthusiasts.
        </p>
        <p>
          Please confirm your email address to activate your account and stay informed
          about hackathons, workshops, and community initiatives.
        </p>
        <a href="${confirmationUrl}" class="button">
          Confirm Email
        </a>
        <div class="divider"></div>
        <p>
          If you did not create an account with Hacker's Unity, you can safely ignore
          this email.
        </p>
        <div class="footer">
          © ${currentYear} Hacker's Unity<br />
          Building India's next generation of technologists
        </div>
      </div>
    </div>
  </body>
</html>`;
};

const generatePasswordResetEmail = (
  resetUrl: string,
  userName?: string
): string => {
  const currentYear = new Date().getFullYear();
  const displayName = userName || "there";

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset your password – Hacker's Unity</title>
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
        <h1>Reset your password</h1>
        <p>
          Hi ${displayName},<br/><br/>
          We received a request to reset your password for your <strong>Hacker's Unity</strong> account.
        </p>
        <p>
          Click the button below to set a new password.
        </p>
        <a href="${resetUrl}" class="button">
          Reset Password
        </a>
        <div class="divider"></div>
        <p>
          If you did not request a password reset, you can safely ignore this email.
          Your password will remain unchanged.
        </p>
        <div class="footer">
          © ${currentYear} Hacker's Unity<br />
          Building India's next generation of technologists
        </div>
      </div>
    </div>
  </body>
</html>`;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.text();
    console.log("Received auth email webhook");

    // Parse the webhook payload
    let data: AuthEmailPayload;
    
    // Check if there's a webhook secret for verification
    const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET");
    
    if (hookSecret) {
      const headers = Object.fromEntries(req.headers);
      const wh = new Webhook(hookSecret);
      data = wh.verify(payload, headers) as AuthEmailPayload;
    } else {
      data = JSON.parse(payload);
    }

    const { user, email_data } = data;
    const { token_hash, redirect_to, email_action_type, site_url } = email_data;

    console.log(`Processing ${email_action_type} email for: ${user.email}`);

    // Build the confirmation/action URL
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || site_url;
    const actionUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

    const userName = user.user_metadata?.full_name;
    let subject: string;
    let html: string;

    // Generate appropriate email based on action type
    switch (email_action_type) {
      case "signup":
      case "email_change":
        subject = "Confirm your email – Hacker's Unity";
        html = generateConfirmationEmail(actionUrl, userName);
        break;
      case "recovery":
        subject = "Reset your password – Hacker's Unity";
        html = generatePasswordResetEmail(actionUrl, userName);
        break;
      case "magiclink":
        subject = "Your login link – Hacker's Unity";
        html = generateConfirmationEmail(actionUrl, userName);
        break;
      default:
        subject = "Action required – Hacker's Unity";
        html = generateConfirmationEmail(actionUrl, userName);
    }

    // Send email via Resend
    // Note: Use your verified domain email, or "onboarding@resend.dev" for testing
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "Hacker's Unity <onboarding@resend.dev>";
    
    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: [user.email],
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-auth-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: {
          http_code: error.code || 500,
          message: error.message 
        }
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
