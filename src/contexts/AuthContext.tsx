
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
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
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
          // Fetch latest user data from the database
          const latestUserData = await DatabaseService.getUserById(storedUser.id);
          if (latestUserData) {
            console.log("Setting user from database:", latestUserData);
            setUser(latestUserData);
          } else {
            console.log("Setting user from stored data:", storedUser);
            setUser(storedUser);
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
        // Clear potentially corrupted user data
        DatabaseService.saveCurrentUser(null);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Attempting login with:", email);
    
    try {
      // Check for user in database
      const user = await DatabaseService.getUserByEmail(email);
      
      if (user && user.password === password) {
        console.log("Login successful for:", email);
        
        setUser(user);
        DatabaseService.saveCurrentUser(user);
        
        toast({
          title: "Login successful",
          description: user.role === 'admin' ? "Welcome to the admin dashboard" : "Welcome to your account",
        });
        
        return true;
      } 
      
      // If we reach here, the credentials are invalid
      console.log("Invalid credentials for:", email);
      
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      
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
