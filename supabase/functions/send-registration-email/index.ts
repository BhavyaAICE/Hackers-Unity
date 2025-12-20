import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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

    const emailBody = {
      from: "Hackers Unity <onboarding@resend.dev>",
      to: [to],
      subject: `Registration Confirmed - ${eventTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #00D9FF 0%, #A855F7 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .header h1 { color: white; margin: 0; font-size: 24px; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .message { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Registration Confirmed!</h1>
              </div>
              <div class="content">
                <div class="message">
                  <p>Dear ${userName},</p>
                  <p>Thank you for registering for <strong>${eventType} - ${eventTitle}</strong>.</p>
                  <p>We will send the session details soon!</p>
                  <p style="margin-top: 30px;">Regards,<br><strong>Team Hacker's Unity</strong></p>
                </div>
              </div>
              <div class="footer">
                <p>&copy; 2025 Hacker's Unity. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Dear ${userName},\n\nThank you for registering for ${eventType} - ${eventTitle}.\n\nWe will send the session details soon!\n\nRegards,\nTeam Hacker's Unity`,
    };

    console.log("Sending email with body:", emailBody);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
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
