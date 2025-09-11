import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Send, 
  X, 
  Paperclip, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Smile
} from "lucide-react";
import { useGmailAccounts } from "@/hooks/useGmailAccounts";
import { useToast } from "@/components/ui/use-toast";

interface EmailComposerProps {
  onClose: () => void;
  replyTo?: {
    recipient: string;
    subject: string;
    originalEmail?: any;
  };
}

const EmailComposer = ({ onClose, replyTo }: EmailComposerProps) => {
  const { accounts } = useGmailAccounts();
  const { toast } = useToast();
  
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [to, setTo] = useState(replyTo?.recipient || "");
  const [subject, setSubject] = useState(
    replyTo?.subject ? `Re: ${replyTo.subject}` : ""
  );
  const [body, setBody] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!selectedAccount || !to || !subject || !body) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    try {
      // TODO: Implement actual email sending via edge function
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate sending
      
      toast({
        title: "Email Sent!",
        description: `Your email has been sent successfully from ${selectedAccount}`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Failed to Send",
        description: "There was an error sending your email",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const formatToolbarButton = (Icon: any, action: string) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0"
      onClick={() => {
        // TODO: Implement rich text formatting
        console.log(`Format action: ${action}`);
      }}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-floating">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {replyTo ? 'Reply to Email' : 'Compose New Email'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* From Account Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">From</label>
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger>
              <SelectValue placeholder="Select Gmail account to send from" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.email_address}>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={account.is_active ? "secondary" : "outline"} 
                      className="text-xs"
                    >
                      {account.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <span>{account.email_address}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* To Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">To</label>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => setShowCcBcc(!showCcBcc)}
            >
              {showCcBcc ? "Hide" : "Add"} CC/BCC
            </Button>
          </div>
          <Input
            placeholder="Recipients (separate multiple with commas)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        {/* CC/BCC Fields */}
        {showCcBcc && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">CC</label>
              <Input
                placeholder="CC recipients"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">BCC</label>
              <Input
                placeholder="BCC recipients"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Subject */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Subject</label>
          <Input
            placeholder="Email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Formatting Toolbar */}
        <div className="border rounded-lg p-2 bg-muted/30">
          <div className="flex items-center space-x-1">
            {formatToolbarButton(Bold, "bold")}
            {formatToolbarButton(Italic, "italic")}
            {formatToolbarButton(Underline, "underline")}
            <div className="w-px h-4 bg-border mx-2" />
            {formatToolbarButton(AlignLeft, "alignLeft")}
            {formatToolbarButton(AlignCenter, "alignCenter")}
            {formatToolbarButton(AlignRight, "alignRight")}
            <div className="w-px h-4 bg-border mx-2" />
            {formatToolbarButton(Paperclip, "attachment")}
            {formatToolbarButton(ImageIcon, "image")}
            {formatToolbarButton(Smile, "emoji")}
          </div>
        </div>

        {/* Body */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Message</label>
          <Textarea
            placeholder="Write your email message here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[300px] resize-y"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Paperclip className="h-4 w-4 mr-2" />
              Attach Files
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="email" 
              onClick={handleSend}
              disabled={sending}
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailComposer;