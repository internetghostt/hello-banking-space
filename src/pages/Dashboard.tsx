
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, User, LogOut } from "lucide-react";

interface UserData {
  email: string;
  role: string;
  balance?: number;
  accountStatus?: 'active' | 'frozen';
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const userString = localStorage.getItem("user");
    if (!userString) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userString);
    
    // Mock fetch user data
    setTimeout(() => {
      setUserData({
        ...user,
        balance: 5000.00,
        accountStatus: 'active'
      });
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
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
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <span className="text-primary font-bold text-sm">NB</span>
            </div>
            <span className="font-bold text-xl">NeoBank</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User size={18} />
              <span>{userData?.email}</span>
            </div>
            <Button 
              variant="outline" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome to Your Dashboard</h1>
        
        {/* Account status alert */}
        {userData?.accountStatus === 'frozen' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Your account is currently frozen. Please contact customer support for assistance.</p>
          </div>
        )}
        
        {/* Account overview */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Account Overview</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Current Balance</p>
                <p className="text-3xl font-bold">${userData?.balance?.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-2">Available for withdrawal</p>
              </div>
              
              <div className="flex-1 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Account Status</p>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${userData?.accountStatus === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <p className="text-xl font-semibold capitalize">{userData?.accountStatus}</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">Last updated: Today</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent transactions */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <ArrowDown className="text-green-600" size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Deposit</p>
                    <p className="text-sm text-gray-500">May 26, 2023</p>
                  </div>
                </div>
                <p className="text-green-600 font-medium">+$250.00</p>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <ArrowUp className="text-red-600" size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Withdrawal</p>
                    <p className="text-sm text-gray-500">May 25, 2023</p>
                  </div>
                </div>
                <p className="text-red-600 font-medium">-$120.00</p>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ArrowUp className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Bill Payment</p>
                    <p className="text-sm text-gray-500">May 23, 2023</p>
                  </div>
                </div>
                <p className="text-red-600 font-medium">-$85.50</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
