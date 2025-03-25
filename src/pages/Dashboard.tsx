
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAccount } from "@/types/user";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AccountOverview from "@/components/dashboard/AccountOverview";
import AccountActions from "@/components/dashboard/AccountActions";
import TransactionsList from "@/components/dashboard/TransactionsList";
import { DatabaseService } from "@/services/databaseService";

const Dashboard = () => {
  const [userData, setUserData] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Check if user is logged in
        const currentUser = DatabaseService.getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }
        
        // Get the latest user data from database
        const latestUserData = await DatabaseService.getUserById(currentUser.id);
        
        if (latestUserData) {
          // Ensure account number exists
          if (!latestUserData.accountNumber) {
            const accountNumber = `ACC${Math.floor(100000000 + Math.random() * 900000000)}`;
            const updatedUser = {
              ...latestUserData,
              accountNumber
            };
            
            await DatabaseService.updateUser(updatedUser);
            setUserData(updatedUser);
          } else {
            setUserData(latestUserData);
          }
        } else {
          // Create account number for new user
          const accountNumber = `ACC${Math.floor(100000000 + Math.random() * 900000000)}`;
          
          const newUserData = {
            ...currentUser,
            accountNumber,
            balance: currentUser.balance || 0,
            status: currentUser.status || 'active',
            transactions: currentUser.transactions || []
          };
          
          await DatabaseService.createUser(newUserData);
          setUserData(newUserData);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate]);

  // Function to update the user data in both state and database
  const updateUserData = async (updatedUser: UserAccount) => {
    try {
      setUserData(updatedUser);
      await DatabaseService.updateUser(updatedUser);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
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
          <DashboardHeader userEmail={userData.email} userName={userData.name} />
          
          <main className="max-w-7xl mx-auto p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-6">
              {userData.name ? `Welcome, ${userData.name}` : 'Welcome to Your Dashboard'}
            </h1>
            
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
