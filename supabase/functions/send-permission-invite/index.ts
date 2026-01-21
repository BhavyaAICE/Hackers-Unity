import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PermissionInviteRequest {
  email: string;
  permissions: {
    can_view_dashboard: boolean;
    can_manage_events: boolean;
    can_manage_hackathons: boolean;
    can_view_registrations: boolean;
    can_export_data: boolean;
    can_manage_sponsors: boolean;
    can_manage_testimonials: boolean;
    can_manage_content: boolean;
    can_manage_achievements: boolean;
    can_view_contact_queries: boolean;
    can_manage_users: boolean;
  };
  invitedByName: string;
}

async function sendEmail(to: string, subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Hacker's Unity <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return response.json();
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user is an admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Invalid authorization token");
    }

    // Check if user is admin
    const { data: isAdmin } = await supabase.rpc('is_admin', { _user_id: user.id });
    if (!isAdmin) {
      throw new Error("Unauthorized: Only super admins can invite users");
    }

    const { email, permissions, invitedByName }: PermissionInviteRequest = await req.json();

    // Validate email
    if (!email || !email.includes("@")) {
      throw new Error("Invalid email address");
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("user_profiles")
      .select("id, full_name")
      .eq("email", email)
      .maybeSingle();

    // Generate invite token
    const inviteToken = crypto.randomUUID();

    // Create or update admin_permissions record
    const { error: permError } = await supabase
      .from("admin_permissions")
      .upsert({
        email,
        user_id: existingUser?.id || null,
        invite_token: inviteToken,
        invited_by: user.id,
        is_active: true,
        ...permissions,
      }, {
        onConflict: 'email'
      });

    if (permError) {
      console.error("Error saving permissions:", permError);
      throw new Error("Failed to save permissions");
    }

    // Build permissions list for email
    const permissionsList: string[] = [];
    if (permissions.can_view_dashboard) permissionsList.push("View Dashboard");
    if (permissions.can_manage_events) permissionsList.push("Manage Events");
    if (permissions.can_manage_hackathons) permissionsList.push("Manage Hackathons");
    if (permissions.can_view_registrations) permissionsList.push("View Registrations");
    if (permissions.can_export_data) permissionsList.push("Export Data");
    if (permissions.can_manage_sponsors) permissionsList.push("Manage Sponsors");
    if (permissions.can_manage_testimonials) permissionsList.push("Manage Testimonials");
    if (permissions.can_manage_content) permissionsList.push("Manage Content");
    if (permissions.can_manage_achievements) permissionsList.push("Manage Achievements");
    if (permissions.can_view_contact_queries) permissionsList.push("View Contact Queries");
    if (permissions.can_manage_users) permissionsList.push("Manage Users");

    const permissionsHtml = permissionsList.map(p => `<li>${p}</li>`).join("");

    // Determine email content based on whether user exists
    const appUrl = "https://hackersunity.tech";
    const isNewUser = !existingUser;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Access Granted - Hacker's Unity</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0b;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                      🎉 Admin Access Granted!
                    </h1>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                      Hello${existingUser?.full_name ? ` ${existingUser.full_name}` : ''},
                    </p>
                    
                    <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                      <strong style="color: #a78bfa;">${invitedByName}</strong> has granted you admin access to the Hacker's Unity platform.
                    </p>
                    
                    <div style="background: rgba(167, 139, 250, 0.1); border: 1px solid rgba(167, 139, 250, 0.3); border-radius: 12px; padding: 24px; margin: 24px 0;">
                      <h3 style="color: #a78bfa; margin: 0 0 16px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
                        Your Permissions
                      </h3>
                      <ul style="color: #e2e8f0; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
                        ${permissionsHtml}
                      </ul>
                    </div>
                    
                    ${isNewUser ? `
                    <div style="background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
                      <p style="color: #fbbf24; font-size: 14px; margin: 0;">
                        <strong>📝 Note:</strong> You'll need to create an account first to access the admin panel. Use this email address (${email}) when signing up.
                      </p>
                    </div>
                    ` : ''}
                    
                    <div style="text-align: center; margin: 32px 0;">
                      <a href="${appUrl}${isNewUser ? '/register' : '/admin'}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px 0 rgba(139, 92, 246, 0.4);">
                        ${isNewUser ? 'Create Account' : 'Access Admin Panel'}
                      </a>
                    </div>
                    
                    <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">
                      If you didn't expect this email, you can safely ignore it.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 40px; background: rgba(0, 0, 0, 0.2); text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                    <p style="color: #64748b; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} Hacker's Unity. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Send email
    const emailResponse = await sendEmail(
      email,
      "🎉 Admin Access Granted - Hacker's Unity",
      emailHtml
    );

    console.log("Permission invite email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        isNewUser,
        message: isNewUser 
          ? "Invitation sent! User will need to create an account first." 
          : "Permissions updated! User can access the admin panel now."
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-permission-invite function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
