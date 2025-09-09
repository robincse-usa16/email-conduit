import { Mail, Send, Inbox, Archive, Star } from "lucide-react";
import AnimatedCard from "./AnimatedCard";
import { Button } from "@/components/ui/button";

interface EmailCardProps {
  title: string;
  description: string;
  icon: "mail" | "send" | "inbox" | "archive" | "star";
  delay?: number;
  stats?: {
    label: string;
    value: string;
  };
}

const EmailCard = ({ title, description, icon, delay = 0, stats }: EmailCardProps) => {
  const iconMap = {
    mail: Mail,
    send: Send,
    inbox: Inbox,
    archive: Archive,
    star: Star,
  };

  const Icon = iconMap[icon];

  return (
    <AnimatedCard delay={delay} className="text-center group">
      <div className="mb-4 flex justify-center">
        <div className="p-4 rounded-full gradient-primary inline-flex email-bounce group-hover:animate-pulse-glow">
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      
      {stats && (
        <div className="bg-secondary/50 rounded-lg p-3 mb-4">
          <div className="text-2xl font-bold text-primary">{stats.value}</div>
          <div className="text-sm text-muted-foreground">{stats.label}</div>
        </div>
      )}
      
      <Button variant="outline" size="sm" className="hover:shadow-email transition-smooth">
        Learn More
      </Button>
    </AnimatedCard>
  );
};

export default EmailCard;