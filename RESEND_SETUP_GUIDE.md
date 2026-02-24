# Resend.com Email Setup Guide

## Overview
The email confirmation system is now fully implemented. When users register for events, they will automatically receive a confirmation email with the exact format you specified.

## What's Been Fixed

### 1. White Text Visibility Issue
- Fixed the privacy statement link color in the registration form
- Changed from green color to primary theme color for better visibility
- Background changed to use muted theme colors for consistent contrast

### 2. Admin Registrations Table Responsiveness
- Added horizontal scrolling for tablet and mobile devices
- Set minimum widths for all columns to prevent text wrapping
- Added whitespace-nowrap to prevent text from breaking
- Table will now properly scroll horizontally on smaller screens

### 3. Email Confirmation System
- Edge function deployed and ready to use
- Email template matches your requirements exactly

## Resend.com Setup Steps

### Step 1: Create Resend Account
1. Go to https://resend.com
2. Sign up for a free account
3. Verify your email address

### Step 2: Get Your API Key
1. Log in to your Resend dashboard
2. Navigate to "API Keys" in the left sidebar
3. Click "Create API Key"
4. Give it a name like "Hacker's Unity Production"
5. Select "Full Access" permissions
6. Copy the API key (you'll only see it once!)

### Step 3: Add Domain (Important!)
1. In Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter your domain: `hackersunity.in`
4. Follow the DNS verification steps:
   - Add the provided DNS records to your domain registrar
   - Wait for verification (usually 5-30 minutes)
5. Once verified, you can send emails from `noreply@hackersunity.in`

**Note**: Until your domain is verified, you can use Resend's test domain for testing:
- Emails will only be sent to your registered email address
- Change the "from" address in the edge function temporarily to: `onboarding@resend.dev`

### Step 4: Configure Supabase Secret
1. Go to your Supabase dashboard
2. Navigate to Project Settings > Edge Functions > Secrets
3. Click "Add Secret"
4. Name: `RESEND_API_KEY`
5. Value: Paste your Resend API key
6. Click "Save"

**IMPORTANT**: The secret name must be exactly `RESEND_API_KEY` (case-sensitive)

### Step 5: Test the Email System

1. Create a test event in your admin panel
2. Register for the event using your email
3. Check your inbox for the confirmation email

The email will look like this:
```
Subject: Registration Confirmed - [Event Title]

Dear [User Name],

Thank you for registering for [Event Type] - [Event Title].

We will send the session details soon!

Regards,
Team Hacker's Unity
```

## Email Template Details

The email includes:
- Professional HTML template with your brand colors
- Gradient header (cyan to purple)
- Clean, readable format
- Both HTML and plain text versions
- Mobile-responsive design

## Troubleshooting

### Email Not Sending?
1. Check Supabase Edge Function logs:
   - Go to Supabase Dashboard > Edge Functions
   - Click on "send-registration-email"
   - Check the logs for errors

2. Verify API Key:
   - Make sure `RESEND_API_KEY` is set in Supabase secrets
   - Check that the API key hasn't expired

3. Domain Verification:
   - Ensure your domain is verified in Resend
   - Or use `onboarding@resend.dev` for testing

### Testing Without Domain
If you want to test before domain verification:

1. In the edge function, temporarily change line 57:
   ```typescript
   from: "Hacker's Unity <onboarding@resend.dev>",
   ```

2. Emails will only be delivered to the email address registered with Resend

## Cost Information

Resend Free Tier includes:
- 3,000 emails per month
- 100 emails per day
- All features included

Paid plans start at $20/month for 50,000 emails.

## Security Notes

- Never commit your API key to version control
- The API key is stored securely in Supabase secrets
- Edge function uses JWT verification for security
- CORS headers are properly configured

## Next Steps

1. Set up your Resend account
2. Verify your domain
3. Add the API key to Supabase
4. Test with a registration
5. Monitor email delivery in Resend dashboard

## Support

If you encounter issues:
- Resend Documentation: https://resend.com/docs
- Resend Support: support@resend.com
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
