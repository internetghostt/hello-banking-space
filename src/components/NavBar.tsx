
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-10 py-4",
        isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">NB</span>
          </div>
          <span className={cn(
            "font-display font-semibold text-lg transition-colors duration-300",
            isScrolled ? "text-foreground" : "text-foreground"
          )}>
            NeoBank
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {["Home", "Features", "Pricing", "Testimonials"].map((item, i) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-primary relative group",
                isScrolled ? "text-foreground/80" : "text-foreground/90"
              )}
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Log in
          </Button>
          <Button className="bg-primary text-white hover:bg-primary/90 transition-all">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
