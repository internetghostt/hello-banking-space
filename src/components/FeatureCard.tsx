
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
        "bg-white rounded-sm shadow-sm p-6 text-left hover:shadow-md transition-all",
        className
      )}
      style={{ animationDelay: delay }}
    >
      <div className="bg-boa-darkBlue/10 w-12 h-12 rounded-sm flex items-center justify-center mb-5">
        <Icon className="text-boa-darkBlue" size={24} />
      </div>
      <h3 className="text-lg font-semibold mb-3 text-boa-darkBlue">{title}</h3>
      <p className="text-boa-darkGrey text-sm">{description}</p>
      <a href="#" className="text-boa-lightBlue text-sm mt-4 inline-block hover:underline">Learn more</a>
    </div>
  );
};

export default FeatureCard;
