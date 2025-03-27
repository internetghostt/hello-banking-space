
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
          // Verify the user exists in Supabase
          const userData = await DatabaseService.getUserById(storedUser.id);
          if (userData) {
            console.log("User loaded from stored data:", userData);
            setUser(userData);
          } else {
            // User doesn't exist or session expired
            console.log("Stored user not found in database, clearing local storage");
            DatabaseService.saveCurrentUser(null);
          }
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
      // Check if user exists in Supabase database
      const user = await DatabaseService.getUserByEmail(email);
      
      if (!user) {
        console.log("User not found with email:", email);
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        
        setIsLoading(false);
        return false;
      }
      
      console.log("User found:", user.email, "Checking password...");
      
      // Simple password check (in a real app, would use proper authentication)
      if (user.password !== password) {
        console.log("Password incorrect for user:", email);
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        
        setIsLoading(false);
        return false;
      }
      
      console.log("Password correct for user:", email);
      
      // Don't expose password in the session
      const { password: _, ...userWithoutPassword } = user;
      
      setUser(userWithoutPassword);
      DatabaseService.saveCurrentUser(userWithoutPassword);
      
      toast({
        title: "Login successful",
        description: user.role === 'admin' ? "Welcome to the admin dashboard" : "Welcome to your account",
      });
      
      console.log("Login successful for:", email, "Role:", user.role);
      setIsLoading(false);
      return true;
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
