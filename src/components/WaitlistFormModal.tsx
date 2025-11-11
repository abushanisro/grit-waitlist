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
import { CheckCircle2, Linkedin, Sparkles } from "lucide-react";
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

    try {
      setLoading(true);

      // Add to waitlist (no auth required)
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            email: email.trim(),
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
          toast.error("You're already on the waitlist!");
        } else {
          console.error("Waitlist error:", error);
          toast.error("Failed to join waitlist. Please try again.");
        }
        return;
      }

      // Show success state with celebration
      setSubmitted(true);
      toast.success("🎉 Welcome to GRIT! You're on the waitlist!", {
        duration: 5000,
        description: "We'll notify you when we launch. Get ready to build your sales career!",
      });
    } catch (error) {
      console.error("Error joining waitlist:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
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
            {/* Celebration Icon */}
            <div className="relative mb-3 sm:mb-4">
              <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 animate-bounce" />
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              🎉 You're on the list! 🎉
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Thank you for joining GRIT, <span className="font-semibold text-foreground">{fullName.split(' ')[0]}</span>!
            </p>

            <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 w-full">
              <p className="text-xs sm:text-sm font-medium">
                🚀 We're excited to help you build your sales career. You'll be among the first to know when we launch!
              </p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full py-5 sm:py-6 text-sm sm:text-base bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              Continue Exploring
            </Button>

            <p className="text-xs text-muted-foreground mt-3 sm:mt-4 flex items-center gap-1">
              Made with <span className="text-red-500">♥</span> GRIT
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <div className="flex flex-col items-center mb-3 sm:mb-4">
          <img src={gritLogo} alt="GRIT" className="h-10 sm:h-12 mb-3 sm:mb-4" />
          <DialogHeader className="text-center space-y-1 sm:space-y-2">
            <DialogTitle className="text-xl sm:text-2xl font-bold">Waitlist Signup</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Join the future of sales career development
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email" className="text-xs sm:text-sm font-medium">
              Email<span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m.scott@paper.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>

          {/* Full Name Field */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="fullName" className="text-xs sm:text-sm font-medium">
              Full Name<span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Michael Scott"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>

          {/* Phone Number Field */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="phone" className="text-xs sm:text-sm font-medium">
              Phone Number <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>

          {/* Why do you want to use GRIT? */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="reason" className="text-xs sm:text-sm font-medium">
              Are you a recruiter or salesperson? <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Tell us a bit about yourself and why you want to join Grit..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full min-h-[70px] sm:min-h-[80px] resize-none text-sm sm:text-base"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || oauthLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-5 sm:py-6 rounded-lg text-sm sm:text-base mt-2"
          >
            {loading ? "Joining..." : "Submit"}
          </Button>

          {/* Divider */}
          <div className="relative py-2 sm:py-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
              <span className="bg-background px-2 sm:px-3 text-muted-foreground font-medium">Or sign in with</span>
            </div>
          </div>

          {/* OAuth Login Buttons */}
          <div className="space-y-2 sm:space-y-3">
            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || oauthLoading}
              className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-sm hover:shadow"
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
              className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#0A66C2] hover:bg-[#004182] text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-sm hover:shadow"
            >
              <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>{oauthLoading ? "Signing in..." : "Sign in with LinkedIn"}</span>
            </button>
          </div>

          {/* Privacy Notice */}
          <p className="text-[10px] sm:text-xs text-center text-muted-foreground pt-2">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
