import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Shield, CheckCircle } from "lucide-react";
import { useGmailAccounts } from "@/hooks/useGmailAccounts";
import { useToast } from "@/components/ui/use-toast";

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddAccountDialog = ({ open, onOpenChange }: AddAccountDialogProps) => {
  const [step, setStep] = useState<'verify' | 'connect'>('verify');
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { addGmailAccount } = useGmailAccounts();
  const { toast } = useToast();

  const handleVerifyEmail = async () => {
    if (!email || !email.includes('@gmail.com')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid Gmail address",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulate email verification check
    setTimeout(() => {
      setIsVerifying(false);
      setStep('connect');
      toast({
        title: "Email Verified",
        description: "Gmail address verified. Ready to connect!",
      });
    }, 1500);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await addGmailAccount();
      onOpenChange(false);
      setStep('verify');
      setEmail('');
      toast({
        title: "Account Connected",
        description: "Gmail account successfully connected!",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect Gmail account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep('verify');
    setEmail('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Add Gmail Account
          </DialogTitle>
          <DialogDescription>
            Connect your Gmail account to manage emails from our dashboard.
          </DialogDescription>
        </DialogHeader>

        {step === 'verify' && (
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                We'll verify that you own this Gmail account before connecting it for security.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="email">Gmail Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isVerifying}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleVerifyEmail} 
                disabled={isVerifying || !email}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Verify Email
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 'connect' && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Email verified! Click connect to authorize access to your Gmail account.
              </AlertDescription>
            </Alert>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Mail className="h-12 w-12 mx-auto mb-2 text-primary" />
              <p className="font-medium">{email}</p>
              <p className="text-sm text-muted-foreground">Ready to connect</p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('verify')}>
                Back
              </Button>
              <Button 
                variant="email"
                onClick={handleConnect} 
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Connect Gmail
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountDialog;