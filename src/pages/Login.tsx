
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple mock authentication
    setTimeout(() => {
      if (email === "admin@bank.com" && password === "admin123") {
        localStorage.setItem("user", JSON.stringify({ role: "admin", email }));
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        navigate("/admin");
      } else if (email && password) {
        localStorage.setItem("user", JSON.stringify({ role: "user", email }));
        toast({
          title: "Login successful",
          description: "Welcome to your account",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-primary p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
              <span className="text-primary font-bold text-lg">NB</span>
            </div>
          </div>
          <h1 className="text-white text-center text-2xl font-bold">NeoBank Login</h1>
        </div>
        
        <form onSubmit={handleLogin} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="youremail@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account? Contact an administrator.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
