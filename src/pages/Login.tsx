
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to the appropriate dashboard
    if (isAuthenticated) {
      console.log("User already authenticated, redirecting", user);
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, navigate, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return; // Form validation will handle this
    }
    
    console.log("Submitting login form with:", email);
    const success = await login(email, password);
    
    if (success) {
      console.log("Login successful, redirecting based on role");
      // Redirect based on user role
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // For demo purposes, let's pre-fill the login form with admin credentials
  const fillAdminCredentials = () => {
    setEmail("admin@bank.com");
    setPassword("admin123");
  };

  const fillUserCredentials = () => {
    setEmail("user@bank.com");
    setPassword("user123");
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
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
          
          <Button type="submit" className="w-full">
            Log in
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 mb-1">
              Don't have an account? Contact an administrator.
            </p>
            <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="font-medium mb-1">Demo Accounts:</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded transition-colors"
                >
                  Fill Admin
                </button>
                <button
                  type="button"
                  onClick={fillUserCredentials}
                  className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 rounded transition-colors"
                >
                  Fill User
                </button>
              </div>
              <p className="mt-2">Admin: admin@bank.com / admin123</p>
              <p>User: user@bank.com / user123</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
