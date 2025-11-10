import { useState } from "react";
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
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

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
  const [submitted, setSubmitted] = useState(false);

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

      // Show success state
      setSubmitted(true);
      toast.success("Welcome to GRIT! 🎉");
    } catch (error) {
      console.error("Error joining waitlist:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">You're on the list!</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for joining GRIT, {fullName.split(' ')[0]}!
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
              <p className="text-sm">
                We're excited to help you build your sales career. You'll be among the first to know when we launch!
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Continue Exploring
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Made with GRIT
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center mb-4">
          <img src={gritLogo} alt="GRIT" className="h-12 mb-4" />
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold">Waitlist Signup</DialogTitle>
            <DialogDescription>
              Join the future of sales career development
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email<span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m.scott@paper.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Michael Scott"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Phone Number Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Why do you want to use GRIT? */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Are you a recruiter or salesperson?
            </Label>
            <Textarea
              id="reason"
              placeholder="Tell us a bit about yourself and why you want to join Grit..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full min-h-[80px] resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-lg"
          >
            {loading ? "Joining..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
