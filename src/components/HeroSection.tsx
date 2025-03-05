
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight, CreditCard, Shield, Smartphone } from "lucide-react";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 to-transparent -z-10" />
      
      {/* Decorative elements */}
      <div className="absolute top-32 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl -z-10" />
      
      <div className="container px-6 md:px-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          <div className="text-left space-y-8 max-w-xl">
            <div className="space-y-2">
              <div 
                className={`inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}
              >
                <span className="mr-2">Next generation banking</span>
                <ChevronRight size={16} />
              </div>
              
              <h1 
                className={`text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-balance transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}
              >
                Banking made <span className="text-primary">simple</span> for everyone
              </h1>
              
              <p 
                className={`text-lg text-muted-foreground mt-6 text-balance transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}
              >
                Experience banking that understands you. Powerful features, no complexity, and designed with your financial success in mind.
              </p>
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
              <Button size="lg" className="rounded-lg bg-primary hover:bg-primary/90 text-white px-6">
                Open an Account
                <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-lg border-2">
                Learn More
              </Button>
            </div>
            
            <div className={`pt-8 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-sm text-muted-foreground mb-4">Trusted by thousands worldwide</p>
              <div className="flex flex-wrap gap-6 items-center">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 bg-muted/80 rounded-md w-16 md:w-24" />
                ))}
              </div>
            </div>
          </div>
          
          <div className={`relative transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="relative">
              {/* Card mockup */}
              <div className="w-full max-w-md mx-auto">
                <div className="glass rounded-2xl p-6 shadow-lg transform rotate-1 hover:rotate-0 transition-all duration-500 hover:shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-sm">NB</span>
                      </div>
                      <span className="font-medium">NeoBank</span>
                    </div>
                    <div className="w-12 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-md" />
                  </div>
                  
                  <div className="mb-8 font-mono text-lg tracking-wider">
                    •••• •••• •••• 4289
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Card Holder</p>
                      <p className="font-medium">J. Smith</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Expires</p>
                      <p className="font-medium">09/26</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Feature tags surrounding card */}
              <div className="absolute -top-6 -left-4 glass py-2 px-4 rounded-full shadow-sm flex items-center gap-2 text-sm font-medium animate-fade-in animation-delay-700">
                <Shield size={16} className="text-primary" />
                <span>Secure</span>
              </div>
              
              <div className="absolute -bottom-4 -right-4 glass py-2 px-4 rounded-full shadow-sm flex items-center gap-2 text-sm font-medium animate-fade-in animation-delay-500">
                <CreditCard size={16} className="text-primary" />
                <span>Virtual Cards</span>
              </div>
              
              <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 glass py-2 px-4 rounded-full shadow-sm flex items-center gap-2 text-sm font-medium animate-fade-in animation-delay-300">
                <Smartphone size={16} className="text-primary" />
                <span>Mobile App</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
