
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAccount } from "@/types/user";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AccountOverview from "@/components/dashboard/AccountOverview";
import AccountActions from "@/components/dashboard/AccountActions";
import TransactionsList from "@/components/dashboard/TransactionsList";

const Dashboard = () => {
  const [userData, setUserData] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userString = localStorage.getItem("user");
    if (!userString) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userString);
    
    // Get the latest user data from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUser = users.find((u: UserAccount) => u.email === user.email);
    
    if (currentUser) {
      // Ensure account number exists
      if (!currentUser.accountNumber) {
        currentUser.accountNumber = `ACC${Math.floor(100000000 + Math.random() * 900000000)}`;
        
        // Update the users array
        const updatedUsers = users.map((u: UserAccount) => 
          u.email === currentUser.email ? currentUser : u
        );
        
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        localStorage.setItem("user", JSON.stringify(currentUser));
      }
      
      setUserData(currentUser);
    } else {
      // Create account number for new user
      const accountNumber = `ACC${Math.floor(100000000 + Math.random() * 900000000)}`;
      
      const newUserData = {
        ...user,
        accountNumber,
        balance: user.balance || 0,
        status: user.status || 'active',
        transactions: user.transactions || []
      };
      
      // We need to add this user to the users array to persist transactions
      const updatedUsers = [...users, newUserData];
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("user", JSON.stringify(newUserData));
      
      setUserData(newUserData);
    }
    
    setIsLoading(false);
  }, [navigate]);

  // Function to update the user data in both state and localStorage
  const updateUserData = (updatedUser: UserAccount) => {
    setUserData(updatedUser);
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u: UserAccount) => 
      u.id === updatedUser.id ? updatedUser : u
    );
    
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {userData && (
        <>
          <DashboardHeader userEmail={userData.email} />
          
          <main className="max-w-7xl mx-auto p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-6">Welcome to Your Dashboard</h1>
            
            {/* Account status alert */}
            {userData.status === 'frozen' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p className="font-medium">Your account is currently frozen. Please contact customer support for assistance.</p>
              </div>
            )}
            
            <AccountOverview userData={userData} />
            <AccountActions userData={userData} setUserData={updateUserData} />
            <TransactionsList transactions={userData.transactions} />
          </main>
        </>
      )}
    </div>
  );
};

export default Dashboard;
