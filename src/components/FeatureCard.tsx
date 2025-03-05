
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: string;
  className?: string;
}

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay = "0ms",
  className 
}: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        "glass card-hover rounded-xl p-6 text-left opacity-0 animate-fade-up",
        className
      )}
      style={{ animationDelay: delay }}
    >
      <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-5">
        <Icon className="text-primary" size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
