import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/hackers-unity-logo.png";

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      // Check for error in URL params (Supabase redirects with error params)
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      
      if (error) {
        setStatus("error");
        setMessage(errorDescription || "Email confirmation failed. Please try again.");
        return;
      }

      // Check for token_hash and type in URL (Supabase confirmation link format)
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (tokenHash && type) {
        try {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as "email" | "signup" | "recovery" | "invite",
          });

          if (verifyError) {
            setStatus("error");
            setMessage(verifyError.message || "Failed to confirm email. The link may have expired.");
            return;
          }

          setStatus("success");
          setMessage("Your email has been confirmed successfully!");
          setTimeout(() => navigate("/"), 3000);
          return;
        } catch (err) {
          setStatus("error");
          setMessage("An unexpected error occurred. Please try again.");
          return;
        }
      }

      // Check hash fragment for access token (alternative Supabase redirect format)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        try {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            setStatus("error");
            setMessage(sessionError.message || "Failed to confirm email.");
            return;
          }

          setStatus("success");
          setMessage("Your email has been confirmed successfully!");
          setTimeout(() => navigate("/"), 3000);
          return;
        } catch (err) {
          setStatus("error");
          setMessage("An unexpected error occurred. Please try again.");
          return;
        }
      }

      // Check if user is already authenticated (session already set by Supabase)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setStatus("success");
        setMessage("Your email has been confirmed successfully!");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      // No valid confirmation data found
      setStatus("error");
      setMessage("Invalid confirmation link. Please request a new confirmation email.");
    };

    handleEmailConfirmation();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="absolute top-8 left-8">
        <button onClick={() => navigate("/")} className="hover:opacity-80 transition">
          <img src={logo} alt="Hacker's Unity" className="h-12 w-auto" />
        </button>
      </div>

      <div className="max-w-md w-full text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <h1 className="text-2xl font-bold">Confirming your email...</h1>
            <p className="text-muted-foreground">Please wait while we verify your email address.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold">Email Confirmed!</h1>
            <p className="text-muted-foreground">{message}</p>
            <p className="text-sm text-muted-foreground">Redirecting to home page in 3 seconds...</p>
            <Button onClick={() => navigate("/")} variant="outline" className="mt-4">
              Go to Home Now
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold">Confirmation Failed</h1>
            <p className="text-muted-foreground">{message}</p>
            <div className="flex flex-col gap-3 mt-6">
              <Button onClick={() => navigate("/register")} className="w-full">
                Try Registering Again
              </Button>
              <Button onClick={() => navigate("/login")} variant="outline" className="w-full">
                Back to Login
              </Button>
            </div>
          </div>
        )}
      </div>

      <footer className="absolute bottom-6 text-center text-sm text-muted-foreground">
        <p>© 2025 Copyright: Hacker's Unity</p>
      </footer>
    </div>
  );
};

export default ConfirmEmail;
