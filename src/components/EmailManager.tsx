import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Mail, 
  Search, 
  Star, 
  Archive, 
  Trash2, 
  Reply, 
  ReplyAll, 
  Forward,
  Filter,
  Inbox,
  Send,
  Eye,
  EyeOff,
  MoreVertical,
  PenTool,
  RefreshCw
} from "lucide-react";
// Force rebuild to clear Vite cache
import { useGmailAccounts } from "@/hooks/useGmailAccounts";
import EmailViewer from "@/components/EmailViewer";
import EmailComposer from "@/components/EmailComposer";
import AnimatedCard from "@/components/AnimatedCard";

interface EmailManagerProps {
  selectedAccountId?: string | null;
  onBack?: () => void;
}

const EmailManager = ({ selectedAccountId, onBack }: EmailManagerProps = {}) => {
  // Gmail email management interface
  const { 
    accounts, 
    emails, 
    loading, 
    syncing, 
    fetchEmails, 
    syncAccount 
  } = useGmailAccounts();
  
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>(selectedAccountId || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showComposer, setShowComposer] = useState(false);
  const [replyData, setReplyData] = useState<any>(null);

  useEffect(() => {
    if (selectedAccount !== "all") {
      fetchEmails(selectedAccount);
    } else {
      fetchEmails();
    }
  }, [selectedAccount]);

  const filteredEmails = emails.filter(email => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.body_preview.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    let matchesType = true;
    switch (filterType) {
      case "unread":
        matchesType = !email.is_read;
        break;
      case "starred":
        matchesType = email.is_starred;
        break;
      case "important":
        matchesType = email.is_important;
        break;
      default:
        matchesType = true;
    }

    return matchesSearch && matchesType;
  });

  const handleReply = (email: any) => {
    setReplyData({
      recipient: email.sender.split('<')[1]?.replace('>', '') || email.sender,
      subject: email.subject,
      originalEmail: email
    });
    setShowComposer(true);
  };

  const handleCompose = () => {
    setReplyData(null);
    setShowComposer(true);
  };

  const getAccountEmailCount = (accountId: string) => {
    return emails.filter(e => e.gmail_account_id === accountId).length;
  };

  const getEmailTimeAgo = (dateString: string) => {
    const now = new Date();
    const emailDate = new Date(dateString);
    const diffInHours = (now.getTime() - emailDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return emailDate.toLocaleDateString();
  };

  if (showComposer) {
    return (
      <div className="min-h-screen bg-background p-4">
        <EmailComposer 
          onClose={() => setShowComposer(false)} 
          replyTo={replyData}
        />
      </div>
    );
  }

  if (selectedEmail) {
    return (
      <EmailViewer 
        email={selectedEmail} 
        onBack={() => setSelectedEmail(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Email <span className="gradient-hero bg-clip-text text-transparent">Manager</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage all your emails from connected Gmail accounts
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {onBack && (
                <Button variant="outline" size="sm" onClick={onBack}>
                  <Inbox className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                disabled={syncing}
                onClick={() => accounts.forEach(acc => syncAccount(acc.id))}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync All'}
              </Button>
              <Button variant="email" onClick={handleCompose}>
                <PenTool className="h-4 w-4 mr-2" />
                Compose Email
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Account Filter */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Filter by Account</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts ({emails.length})</SelectItem>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.email_address} ({getAccountEmailCount(account.id)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Quick Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Quick Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={filterType === "all" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilterType("all")}
                >
                  <Inbox className="h-4 w-4 mr-2" />
                  All Emails ({emails.length})
                </Button>
                <Button
                  variant={filterType === "unread" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilterType("unread")}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Unread ({emails.filter(e => !e.is_read).length})
                </Button>
                <Button
                  variant={filterType === "starred" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilterType("starred")}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Starred ({emails.filter(e => e.is_starred).length})
                </Button>
                <Button
                  variant={filterType === "important" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilterType("important")}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Important ({emails.filter(e => e.is_important).length})
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Email List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>
                    Emails ({filteredEmails.length})
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading emails...</p>
                  </div>
                ) : filteredEmails.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No emails found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? "Try adjusting your search criteria" : "No emails match the selected filter"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredEmails.map((email, index) => (
                      <AnimatedCard key={email.id} delay={index * 50}>
                        <div 
                          className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/30 ${
                            !email.is_read ? 'bg-primary/5 border-primary/20' : 'border-border'
                          }`}
                          onClick={() => setSelectedEmail(email)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className={`font-medium truncate ${!email.is_read ? 'font-bold' : ''}`}>
                                  {email.sender.split('<')[0].trim()}
                                </span>
                                <div className="flex items-center space-x-1">
                                  {email.is_starred && (
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  )}
                                  {email.is_important && (
                                    <Badge variant="outline" className="text-xs px-1">
                                      Important
                                    </Badge>
                                  )}
                                  {!email.is_read && (
                                    <div className="h-2 w-2 bg-primary rounded-full" />
                                  )}
                                </div>
                              </div>
                              <h4 className={`text-sm mb-1 truncate ${!email.is_read ? 'font-semibold' : ''}`}>
                                {email.subject}
                              </h4>
                              <p className="text-xs text-muted-foreground truncate">
                                {email.body_preview}
                              </p>
                            </div>
                            <div className="text-xs text-muted-foreground ml-4 flex flex-col items-end space-y-1">
                              <span>{getEmailTimeAgo(email.received_at)}</span>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReply(email);
                                  }}
                                >
                                  <Reply className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO: Archive email
                                  }}
                                >
                                  <Archive className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AnimatedCard>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailManager;