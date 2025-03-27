
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"admin" | "user">;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ["admin", "user"] 
}) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      navigate("/login");
    } else if (isAuthenticated && user) {
      // Check if user has the required role
      if (!allowedRoles.includes(user.role)) {
        console.log(`User role ${user.role} not in allowed roles:`, allowedRoles);
        // Redirect based on role
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        console.log(`User has allowed role: ${user.role}`);
      }
    }
  }, [isAuthenticated, user, navigate, allowedRoles]);

  // If not authenticated, render nothing
  if (!isAuthenticated) {
    return null;
  }

  // If user is authenticated and has the right role, render children
  return <>{children}</>;
};

export default ProtectedRoute;
