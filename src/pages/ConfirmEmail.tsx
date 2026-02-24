import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/hackers-unity-logo.png";

// With JWT-based auth, email confirmation is handled differently.
// This page now just shows a success message and redirects to login.
const ConfirmEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check for error in URL params
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      setMessage(searchParams.get("error_description") || "Email confirmation failed. Please try again.");
      return;
    }

    // With the new JWT-based auth, simply redirect to login after a moment.
    // The backend handles email verification internally.
    setStatus("success");
    setMessage("Your email has been confirmed! Please log in to continue.");
    setTimeout(() => navigate("/login"), 3000);
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
            <h1 className="text-2xl font-bold">Processing...</h1>
            <p className="text-muted-foreground">Please wait a moment.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold">Email Confirmed!</h1>
            <p className="text-muted-foreground">{message}</p>
            <p className="text-sm text-muted-foreground">Redirecting to login in 3 seconds...</p>
            <Button onClick={() => navigate("/login")} variant="outline" className="mt-4">
              Go to Login Now
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="w-16 h-16 text-red-500 mx-auto text-5xl">⚠️</div>
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
