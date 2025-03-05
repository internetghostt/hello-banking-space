
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import TestimonialSection from "@/components/TestimonialSection";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "NeoBank | Banking for the modern world";
    
    // Check if user is already logged in
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <NavBar />
      <main>
        <HeroSection />
        <FeatureSection />
        <TestimonialSection />
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-center mb-8">Ready to get started?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
              className="px-8"
            >
              Log in to Your Account
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                alert("Demo Credentials:\n\nAdmin: admin@bank.com / admin123\nUser: Any email & password combination");
              }}
              className="px-8"
            >
              View Demo Credentials
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            For demo purposes: Admin login is admin@bank.com / admin123
          </p>
        </div>
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
