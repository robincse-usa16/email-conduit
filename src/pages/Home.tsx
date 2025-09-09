import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Send, Inbox, Users, Shield, Zap } from "lucide-react";
import EmailCard from "@/components/EmailCard";
import AnimatedCard from "@/components/AnimatedCard";
import heroImage from "@/assets/hero-email.jpg";

const Home = () => {
  const features = [
    {
      title: "Multiple Accounts",
      description: "Manage unlimited Gmail accounts from one powerful dashboard",
      icon: "mail" as const,
      delay: 100,
      stats: { label: "Active Accounts", value: "50+" }
    },
    {
      title: "Smart Sending",
      description: "Send emails efficiently across all your connected accounts",
      icon: "send" as const,
      delay: 200,
      stats: { label: "Emails Sent", value: "10K+" }
    },
    {
      title: "Unified Inbox",
      description: "See all your emails in one organized, beautiful interface",
      icon: "inbox" as const,
      delay: 300,
      stats: { label: "Messages", value: "25K+" }
    },
    {
      title: "Archive & Organize",
      description: "Keep your emails organized with smart categorization",
      icon: "archive" as const,
      delay: 400,
      stats: { label: "Organized", value: "99%" }
    },
    {
      title: "Priority Management",
      description: "Never miss important emails with intelligent prioritization",
      icon: "star" as const,
      delay: 500,
      stats: { label: "Priority", value: "100%" }
    },
    {
      title: "Bulk Operations",
      description: "Perform actions across multiple accounts simultaneously",
      icon: "mail" as const,
      delay: 600,
      stats: { label: "Efficiency", value: "5x" }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Manage Multiple{" "}
                <span className="gradient-hero bg-clip-text text-transparent">
                  Gmail Accounts
                </span>{" "}
                Effortlessly
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Streamline your email workflow with our powerful multi-account Gmail management platform. 
                Send, receive, and organize emails across all your accounts from one beautiful dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/dashboard" className="flex items-center space-x-2">
                    <span>Get Started</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            
            <div className="animate-slide-in-right">
              <img 
                src={heroImage} 
                alt="Gmail Management Platform" 
                className="rounded-2xl shadow-floating w-full h-auto floating-animation"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Powerful Features for{" "}
              <span className="gradient-primary bg-clip-text text-transparent">
                Email Management
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage multiple Gmail accounts efficiently and professionally
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <EmailCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                delay={feature.delay}
                stats={feature.stats}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, label: "Active Users", value: "10,000+" },
              { icon: Mail, label: "Emails Managed", value: "1M+" },
              { icon: Shield, label: "Security Rating", value: "99.9%" },
              { icon: Zap, label: "Performance", value: "Lightning Fast" }
            ].map((stat, index) => (
              <AnimatedCard key={index} delay={index * 100} className="text-center">
                <stat.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Email Workflow?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust MultiMail for their email management needs
          </p>
          <Button variant="secondary" size="xl" asChild>
            <Link to="/login" className="flex items-center space-x-2 mx-auto w-fit">
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;