import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Send, 
  Inbox, 
  Archive, 
  Plus, 
  Settings, 
  BarChart3, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useGmailAccounts } from "@/hooks/useGmailAccounts";
import AnimatedCard from "@/components/AnimatedCard";
import EmailViewer from "@/components/EmailViewer";
import ProtectedRoute from "@/components/ProtectedRoute";
import dashboardImage from "@/assets/dashboard-preview.jpg";

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    accounts, 
    emails, 
    loading, 
    syncing, 
    addGmailAccount, 
    syncAccount, 
    fetchEmails 
  } = useGmailAccounts();
  
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  useEffect(() => {
    if (selectedAccount) {
      fetchEmails(selectedAccount);
    }
  }, [selectedAccount]);

  const stats = [
    { title: "Total Accounts", value: accounts.length.toString(), icon: Users, color: "text-primary" },
    { title: "Unread Emails", value: emails.filter(e => !e.is_read).length.toString(), icon: Mail, color: "text-accent" },
    { title: "Total Emails", value: emails.length.toString(), icon: Send, color: "text-success" },
    { title: "Starred", value: emails.filter(e => e.is_starred).length.toString(), icon: Archive, color: "text-warning" }
  ];

  const getStatusBadge = (account: any) => {
    const isRecent = new Date(account.last_sync) > new Date(Date.now() - 5 * 60 * 1000); // 5 minutes
    
    if (account.is_active && isRecent) {
      return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>;
    } else if (account.is_active) {
      return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
        <Clock className="h-3 w-3 mr-1" />
        Idle
      </Badge>;
    } else {
      return <Badge variant="destructive">
        <AlertCircle className="h-3 w-3 mr-1" />
        Inactive
      </Badge>;
    }
  };

  const getAccountStats = (accountId: string) => {
    const accountEmails = emails.filter(e => e.gmail_account_id === accountId);
    return {
      unread: accountEmails.filter(e => !e.is_read).length,
      total: accountEmails.length,
      starred: accountEmails.filter(e => e.is_starred).length
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pt-16">
        {selectedEmail ? (
          <div className="container mx-auto px-4 py-8">
            <EmailViewer 
              email={selectedEmail} 
              onBack={() => setSelectedEmail(null)} 
            />
          </div>
        ) : (
          <>
            {/* Header */}
            <section className="py-8 border-b border-border">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">
                      Gmail{" "}
                      <span className="gradient-hero bg-clip-text text-transparent">
                        Dashboard
                      </span>
                    </h1>
                    <p className="text-muted-foreground">
                      Welcome back, {user?.email}! Manage all your Gmail accounts from one interface.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button 
                      variant="email" 
                      size="sm"
                      onClick={addGmailAccount}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Account
                    </Button>
                  </div>
                </div>
              </div>  
            </section>

      {/* Stats Cards */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <AnimatedCard key={index} delay={index * 100}>
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full gradient-primary">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Accounts List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Connected Accounts</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={syncing}
                  onClick={() => accounts.forEach(acc => syncAccount(acc.id))}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync All'}
                </Button>
              </div>
              
              {accounts.length === 0 ? (
                <AnimatedCard>
                  <div className="text-center p-12">
                    <Mail className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Gmail Accounts Connected</h3>
                    <p className="text-muted-foreground mb-6">
                      Connect your first Gmail account to start managing your emails
                    </p>
                    <Button variant="email" onClick={addGmailAccount}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Gmail Account
                    </Button>
                  </div>
                </AnimatedCard>
              ) : (
                <div className="space-y-4">
                  {accounts.map((account, index) => {
                    const stats = getAccountStats(account.id);
                    return (
                      <AnimatedCard key={account.id} delay={index * 100}>
                        <div className="flex items-center justify-between p-6">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-full gradient-primary">
                              <Mail className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{account.email_address}</h3>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>Last sync: {new Date(account.last_sync).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            {getStatusBadge(account)}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedAccount(account.id);
                                fetchEmails(account.id);
                              }}
                            >
                              View Emails
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={syncing}
                              onClick={() => syncAccount(account.id)}
                            >
                              {syncing ? 'Syncing...' : 'Sync'}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 px-6 pb-6 pt-2 border-t border-border">
                          <div className="text-center">
                            <div className="text-xl font-bold text-accent">{stats.unread}</div>
                            <div className="text-xs text-muted-foreground">Unread</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-success">{stats.total}</div>
                            <div className="text-xs text-muted-foreground">Total</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-warning">{stats.starred}</div>
                            <div className="text-xs text-muted-foreground">Starred</div>
                          </div>
                        </div>
                      </AnimatedCard>
                    );
                  })}
                </div>
              )}

              {/* Emails List */}
              {selectedAccount && emails.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Recent Emails</h3>
                  <div className="space-y-2">
                    {emails.slice(0, 10).map((email, index) => (
                      <AnimatedCard key={email.id} delay={index * 50}>
                        <div 
                          className="p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                          onClick={() => setSelectedEmail(email)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className={`font-medium ${!email.is_read ? 'font-bold' : ''}`}>
                                  {email.sender.split('<')[0].trim()}
                                </span>
                                {email.is_starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                              </div>
                              <h4 className={`text-sm mb-1 ${!email.is_read ? 'font-semibold' : ''}`}>
                                {email.subject}
                              </h4>
                              <p className="text-xs text-muted-foreground truncate">
                                {email.body_preview}
                              </p>
                            </div>
                            <div className="text-xs text-muted-foreground ml-4">
                              {new Date(email.received_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </AnimatedCard>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <AnimatedCard delay={400}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Inbox className="h-4 w-4 mr-2" />
                    Unified Inbox
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Send className="h-4 w-4 mr-2" />
                    Compose Email
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Archive className="h-4 w-4 mr-2" />
                    Bulk Operations
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </AnimatedCard>

              {/* Dashboard Preview */}
              <AnimatedCard delay={500}>
                <CardHeader>
                  <CardTitle>Dashboard Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={dashboardImage} 
                    alt="Dashboard Preview" 
                    className="rounded-lg w-full h-auto mb-4"
                  />
                  <p className="text-sm text-muted-foreground mb-4">
                    Get insights into your email patterns and productivity metrics
                  </p>
                  <Button variant="email" size="sm" className="w-full">
                    View Analytics
                  </Button>
                </CardContent>
              </AnimatedCard>
            </div>
          </div>
        </section>
      </>
    )}
  </div>
</ProtectedRoute>
  );
};

export default Dashboard;