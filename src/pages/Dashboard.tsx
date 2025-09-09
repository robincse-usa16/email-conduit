import { useState } from "react";
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
import AnimatedCard from "@/components/AnimatedCard";
import dashboardImage from "@/assets/dashboard-preview.jpg";

const Dashboard = () => {
  const [accounts] = useState([
    {
      id: 1,
      email: "john.doe@gmail.com",
      status: "active",
      unread: 15,
      sent: 45,
      drafts: 3,
      lastSync: "2 minutes ago"
    },
    {
      id: 2,
      email: "jane.smith@gmail.com", 
      status: "active",
      unread: 8,
      sent: 23,
      drafts: 1,
      lastSync: "5 minutes ago"
    },
    {
      id: 3,
      email: "business@company.com",
      status: "syncing",
      unread: 32,
      sent: 78,
      drafts: 7,
      lastSync: "Syncing..."
    },
    {
      id: 4,
      email: "support@startup.com",
      status: "error",
      unread: 0,
      sent: 12,
      drafts: 0,
      lastSync: "Failed"
    }
  ]);

  const stats = [
    { title: "Total Accounts", value: "4", icon: Users, color: "text-primary" },
    { title: "Unread Emails", value: "55", icon: Mail, color: "text-accent" },
    { title: "Sent Today", value: "158", icon: Send, color: "text-success" },
    { title: "Drafts", value: "11", icon: Archive, color: "text-warning" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>;
      case "syncing":
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          Syncing
        </Badge>;
      case "error":
        return <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Error
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16">
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
                Manage all your Gmail accounts from one powerful interface
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="email" size="sm">
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
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync All
                </Button>
              </div>
              
              <div className="space-y-4">
                {accounts.map((account, index) => (
                  <AnimatedCard key={account.id} delay={index * 100}>
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full gradient-primary">
                          <Mail className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{account.email}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Last sync: {account.lastSync}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(account.status)}
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 px-6 pb-6 pt-2 border-t border-border">
                      <div className="text-center">
                        <div className="text-xl font-bold text-accent">{account.unread}</div>
                        <div className="text-xs text-muted-foreground">Unread</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-success">{account.sent}</div>
                        <div className="text-xs text-muted-foreground">Sent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-warning">{account.drafts}</div>
                        <div className="text-xs text-muted-foreground">Drafts</div>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
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
        </div>
      </section>
    </div>
  );
};

export default Dashboard;