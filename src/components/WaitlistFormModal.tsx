import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import gritLogo from "@/assets/grit-logo.png";
import { supabase, signInWithGoogle, signInWithLinkedIn } from "@/lib/supabase";
import { toast } from "sonner";
import { Linkedin } from "lucide-react";
import confetti from "canvas-confetti";

interface WaitlistFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitlistFormModal = ({ isOpen, onClose }: WaitlistFormModalProps) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Celebration confetti effect
  const celebrate = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  // Trigger celebration when submitted
  useEffect(() => {
    if (submitted) {
      celebrate();
    }
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !fullName) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      // Add to waitlist (no auth required)
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            email: email.trim().toLowerCase(),
            name: fullName.trim(),
            phone: phone.trim() || null,
            reason: reason.trim() || null,
            status: 'pending',
            provider: 'email',
          },
        ]);

      if (error) {
        if (error.code === '23505') {
          // Duplicate email
          toast.error("You're already on the waitlist!", {
            description: "We'll notify you when we launch!",
          });
        } else {
          console.error("Waitlist error:", error);
          toast.error("Failed to join waitlist. Please try again.");
        }
        setLoading(false);
        return;
      }

      // Show success state with celebration
      setSubmitted(true);
      toast.success("Welcome to GRIT!", {
        duration: 5000,
        description: "You're on the waitlist! We'll notify you when we launch.",
      });
    } catch (error) {
      console.error("Error joining waitlist:", error);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setOauthLoading(true);
      await signInWithGoogle();
      // Supabase will redirect to Google OAuth page
      // After successful auth, user will be redirected back and auto-added to waitlist
      onClose();
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(error.message || "Failed to sign in with Google");
      setOauthLoading(false);
    }
  };

  const handleLinkedInLogin = async () => {
    try {
      setOauthLoading(true);
      await signInWithLinkedIn();
      // Supabase will redirect to LinkedIn OAuth page
      // After successful auth, user will be redirected back and auto-added to waitlist
      onClose();
    } catch (error: any) {
      console.error("LinkedIn login error:", error);
      toast.error(error.message || "Failed to sign in with LinkedIn");
      setOauthLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setFullName("");
    setPhone("");
    setReason("");
    setSubmitted(false);
    onClose();
  };

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 px-2 sm:px-4 text-center relative">
            {/* Celebration - GRIT Logo */}
            <div className="relative mb-3 sm:mb-4">
              <div className="relative p-4 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full">
                <img
                  src={gritLogo}
                  alt="GRIT"
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-primary">
              🎉 Thank You! 🎉
            </h2>

            <p className="text-base sm:text-lg text-foreground font-semibold mb-2">
              Welcome, <span className="text-primary">{fullName.split(' ')[0]}</span>!
            </p>

            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              You're now on the waitlist
            </p>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 sm:p-5 mb-4 sm:mb-6 w-full">
              <p className="text-sm sm:text-base font-medium mb-2">
                We're excited to have you!
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                You'll be among the first to know when we launch. Get ready to build your sales career!
              </p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full py-5 sm:py-6 text-sm sm:text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
            >
              Continue Exploring
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-7" aria-describedby="waitlist-description">
        <div className="flex flex-col items-center text-center mb-4 sm:mb-5">
          <img src={gritLogo} alt="GRIT Logo" className="h-12 sm:h-14 mb-4 sm:mb-5" />
          <DialogHeader className="space-y-2 sm:space-y-2.5">
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-center">Join the Waitlist</DialogTitle>
            <DialogDescription id="waitlist-description" className="text-sm sm:text-base text-muted-foreground text-center">
              Be among the first to experience the future of sales career development
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base font-medium flex items-center gap-1">
              Email<span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading || oauthLoading}
              className="w-full h-11 sm:h-12 text-base transition-all focus:scale-[1.01]"
              aria-describedby="email-hint"
              aria-invalid={email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())}
            />
            <p id="email-hint" className="text-xs text-muted-foreground sr-only">
              Enter a valid email address
            </p>
          </div>

          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm sm:text-base font-medium flex items-center gap-1">
              Full Name<span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Input
              id="fullName"
              name="name"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              disabled={loading || oauthLoading}
              className="w-full h-11 sm:h-12 text-base transition-all focus:scale-[1.01]"
              minLength={2}
              aria-describedby="name-hint"
            />
            <p id="name-hint" className="text-xs text-muted-foreground sr-only">
              Enter your full name
            </p>
          </div>

          {/* Phone Number Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm sm:text-base font-medium flex items-center gap-2">
              Phone Number
              <span className="text-muted-foreground text-xs font-normal">(optional)</span>
            </Label>
            <Input
              id="phone"
              name="tel"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              disabled={loading || oauthLoading}
              className="w-full h-11 sm:h-12 text-base transition-all focus:scale-[1.01]"
              aria-describedby="phone-hint"
            />
            <p id="phone-hint" className="text-xs text-muted-foreground">
              We'll only use this for important updates
            </p>
          </div>

          {/* Role/Reason Field */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm sm:text-base font-medium flex items-center gap-2">
              Are you a recruiter or salesperson?
              <span className="text-muted-foreground text-xs font-normal">(optional)</span>
            </Label>
            <Textarea
              id="reason"
              name="reason"
              placeholder="Tell us about yourself and what you're looking for..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading || oauthLoading}
              className="w-full min-h-[80px] sm:min-h-[90px] resize-none text-base transition-all focus:scale-[1.01]"
              maxLength={500}
              aria-describedby="reason-hint"
            />
            <p id="reason-hint" className="text-xs text-muted-foreground text-right">
              {reason.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || oauthLoading}
            className="w-full min-h-[48px] bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground font-semibold py-3 sm:py-3.5 rounded-lg text-base sm:text-lg mt-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Joining...
              </span>
            ) : (
              "Join Waitlist"
            )}
          </Button>

          {/* Divider */}
          <div className="relative py-3 sm:py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm uppercase">
              <span className="bg-background px-3 sm:px-4 text-muted-foreground font-medium">Or continue with</span>
            </div>
          </div>

          {/* OAuth Login Buttons */}
          <div className="space-y-3">
            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || oauthLoading}
              aria-label="Sign in with Google"
              className="w-full min-h-[48px] flex items-center justify-center gap-3 px-5 py-3 bg-white hover:bg-gray-50 active:scale-[0.98] text-gray-700 font-medium rounded-lg border border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-sm hover:shadow-md"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>{oauthLoading ? "Signing in..." : "Sign in with Google"}</span>
            </button>

            {/* LinkedIn Sign In */}
            <button
              type="button"
              onClick={handleLinkedInLogin}
              disabled={loading || oauthLoading}
              aria-label="Sign in with LinkedIn"
              className="w-full min-h-[48px] flex items-center justify-center gap-3 px-5 py-3 bg-[#0A66C2] hover:bg-[#004182] active:scale-[0.98] text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-sm hover:shadow-md"
            >
              {oauthLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Linkedin className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span>Continue with LinkedIn</span>
                </>
              )}
            </button>
          </div>

          {/* Privacy Notice */}
          <p className="text-xs sm:text-sm text-center text-muted-foreground pt-3 leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary hover:underline focus:underline focus:outline-none">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-primary hover:underline focus:underline focus:outline-none">Privacy Policy</a>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
