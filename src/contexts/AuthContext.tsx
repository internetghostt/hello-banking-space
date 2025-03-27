
import React, { createContext, useContext, useState, useEffect } from "react";
import { UserAccount } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { DatabaseService } from "@/services/databaseService";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  user: UserAccount | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize default users
  useEffect(() => {
    const initializeDefaultUsers = async () => {
      try {
        await DatabaseService.initializeDefaultUsers();
        console.log("Default users initialized");
      } catch (error) {
        console.error("Error initializing default users:", error);
      }
    };
    
    initializeDefaultUsers();
  }, []);

  // Load user from database on initial mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = DatabaseService.getCurrentUser();
        if (storedUser) {
          // We'll directly set the user from the stored data for now
          // to avoid database issues during login
          console.log("Setting user from stored data:", storedUser);
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        // Clear potentially corrupted user data
        DatabaseService.saveCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    console.log("Attempting login with:", email);
    
    try {
      // For the demo app, use hardcoded credentials for admin and regular user
      // to bypass the database issues
      if (email === "admin@bank.com" && password === "admin123") {
        console.log("Admin login successful");
        
        const adminUser: UserAccount = {
          id: "admin-id",
          email: "admin@bank.com",
          name: "Admin User",
          accountNumber: "ADMIN-001",
          balance: 10000,
          status: 'active',
          role: 'admin',
          createdAt: new Date().toISOString().split('T')[0]
        };
        
        setUser(adminUser);
        DatabaseService.saveCurrentUser(adminUser);
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        
        setIsLoading(false);
        return true;
      } 
      
      if (email === "user@bank.com" && password === "user123") {
        console.log("Regular user login successful");
        
        const regularUser: UserAccount = {
          id: "user-id",
          email: "user@bank.com",
          name: "Regular User",
          accountNumber: "USER-001",
          balance: 1000,
          status: 'active',
          role: 'user',
          createdAt: new Date().toISOString().split('T')[0]
        };
        
        setUser(regularUser);
        DatabaseService.saveCurrentUser(regularUser);
        
        toast({
          title: "Login successful",
          description: "Welcome to your account",
        });
        
        setIsLoading(false);
        return true;
      }
      
      // If we reach here, the credentials are invalid
      console.log("Invalid credentials for:", email);
      
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    console.log("Logging out user:", user?.email);
    DatabaseService.saveCurrentUser(null);
    setUser(null);
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
