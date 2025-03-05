
import { useRef, useEffect, useState } from "react";
import FeatureCard from "./FeatureCard";
import { 
  CreditCard, 
  ArrowUpRight, 
  Shield, 
  Smartphone, 
  PiggyBank, 
  BellRing,
  Banknote
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FeatureSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100/20 rounded-full blur-3xl -z-10" />
      
      <div className="container px-6 md:px-10 mx-auto max-w-7xl">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            <span>Why choose us</span>
          </div>
          <h2 className={`text-3xl md:text-4xl font-display font-bold mb-6 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Banking features designed for modern life
          </h2>
          <p className={`text-lg text-muted-foreground text-balance transition-all duration-700 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            From everyday spending to saving for the future, we've built tools that simplify your financial life.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={CreditCard}
            title="Smart Cards"
            description="Physical and virtual cards with customizable limits and instant notifications for every transaction."
            delay="100ms"
          />
          
          <FeatureCard 
            icon={Smartphone}
            title="Mobile Banking"
            description="Manage your accounts, set savings goals, and track spending all from our intuitive mobile app."
            delay="200ms"
          />
          
          <FeatureCard 
            icon={Shield}
            title="Enhanced Security"
            description="Advanced encryption and biometric authentication keep your funds and personal data secure."
            delay="300ms"
          />
          
          <FeatureCard 
            icon={PiggyBank}
            title="Automated Savings"
            description="Set up rules that automatically move money to your savings based on your spending habits."
            delay="400ms"
          />
          
          <FeatureCard 
            icon={BellRing}
            title="Smart Notifications"
            description="Customizable alerts for spending patterns, upcoming bills, and financial milestones."
            delay="500ms"
          />
          
          <FeatureCard 
            icon={Banknote}
            title="Loans & Credit"
            description="Transparent lending options with competitive rates and personalized repayment plans."
            delay="600ms"
          />
        </div>
        
        <div className="mt-16 text-center">
          <Button className="rounded-lg group" variant="outline" size="lg">
            <span>View all features</span>
            <ArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
