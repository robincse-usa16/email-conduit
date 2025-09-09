import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  hover?: boolean;
  float?: boolean;
}

const AnimatedCard = ({ 
  children, 
  delay = 0, 
  className, 
  hover = true, 
  float = false 
}: AnimatedCardProps) => {
  return (
    <div
      className={cn(
        "email-card animate-fade-in-up",
        hover && "hover:shadow-floating hover:-translate-y-2",
        float && "floating-animation",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;