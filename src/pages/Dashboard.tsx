
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, User, LogOut, Send } from "lucide-react";
import { UserAccount, Transaction } from "@/types/user";

const Dashboard = () => {
  const [userData, setUserData] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
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
    
    // Get the latest user data from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUser = users.find((u: UserAccount) => u.email === user.email);
    
    if (currentUser) {
      setUserData(currentUser);
    } else {
      setUserData({
        ...user,
        balance: user.balance || 0,
        status: user.status || 'active',
        transactions: user.transactions || []
      });
    }
    
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  const handleWithdrawal = () => {
    if (!userData) return;
    
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than zero",
        variant: "destructive",
      });
      return;
    }
    
    if (amount > userData.balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }
    
    // Update user data
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "withdrawal",
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      description: "Withdrawal"
    };
    
    const updatedUserData = {
      ...userData,
      balance: userData.balance - amount,
      transactions: [...(userData.transactions || []), newTransaction]
    };
    
    // Update in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((user: UserAccount) => 
      user.id === userData.id ? updatedUserData : user
    );
    
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    
    setUserData(updatedUserData);
    setWithdrawalAmount("");
    setShowWithdrawalForm(false);
    
    toast({
      title: "Withdrawal successful",
      description: `$${amount.toFixed(2)} has been withdrawn from your account`,
    });
  };

  const handleTransfer = () => {
    if (!userData) return;
    
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than zero",
        variant: "destructive",
      });
      return;
    }
    
    if (amount > userData.balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this transfer",
        variant: "destructive",
      });
      return;
    }
    
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const recipient = users.find((user: UserAccount) => user.email === recipientEmail);
    
    if (!recipient) {
      toast({
        title: "Recipient not found",
        description: "The recipient email does not exist in our system",
        variant: "destructive",
      });
      return;
    }
    
    if (recipient.email === userData.email) {
      toast({
        title: "Invalid recipient",
        description: "You cannot transfer funds to yourself",
        variant: "destructive",
      });
      return;
    }
    
    // Update sender data
    const senderTransaction: Transaction = {
      id: Date.now().toString(),
      type: "transfer",
      amount: amount,
      recipientEmail: recipientEmail,
      date: new Date().toISOString().split('T')[0],
      description: `Transfer to ${recipientEmail}`
    };
    
    const updatedUserData = {
      ...userData,
      balance: userData.balance - amount,
      transactions: [...(userData.transactions || []), senderTransaction]
    };
    
    // Update recipient data
    const recipientTransaction: Transaction = {
      id: (Date.now() + 1).toString(),
      type: "deposit",
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      description: `Transfer from ${userData.email}`
    };
    
    const updatedRecipient = {
      ...recipient,
      balance: recipient.balance + amount,
      transactions: [...(recipient.transactions || []), recipientTransaction]
    };
    
    // Update in localStorage
    const updatedUsers = users.map((user: UserAccount) => {
      if (user.id === userData.id) return updatedUserData;
      if (user.id === recipient.id) return updatedRecipient;
      return user;
    });
    
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    
    setUserData(updatedUserData);
    setTransferAmount("");
    setRecipientEmail("");
    setShowTransferForm(false);
    
    toast({
      title: "Transfer successful",
      description: `$${amount.toFixed(2)} has been transferred to ${recipientEmail}`,
    });
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
        {userData?.status === 'frozen' && (
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
                  <span className={`w-3 h-3 rounded-full ${userData?.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <p className="text-xl font-semibold capitalize">{userData?.status}</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">Last updated: Today</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* User actions */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Account Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                className="border-blue-200 hover:bg-blue-50"
                disabled={userData?.status === 'frozen'}
                onClick={() => setShowWithdrawalForm(true)}
              >
                <ArrowUp size={16} />
                <span>Withdraw Funds</span>
              </Button>
              <Button 
                variant="outline" 
                className="border-green-200 hover:bg-green-50"
                disabled={userData?.status === 'frozen'}
                onClick={() => setShowTransferForm(true)}
              >
                <Send size={16} />
                <span>Transfer Funds</span>
              </Button>
            </div>
            
            {/* Withdrawal Form */}
            {showWithdrawalForm && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium mb-3">Withdraw Funds</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                    <input
                      type="number"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowWithdrawalForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleWithdrawal}>
                      Withdraw
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Transfer Form */}
            {showTransferForm && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium mb-3">Transfer Funds</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="recipient@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowTransferForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleTransfer}>
                      Transfer
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Recent Transactions</h2>
            {userData?.transactions && userData.transactions.length > 0 ? (
              <div className="space-y-4">
                {userData.transactions.slice().reverse().slice(0, 5).map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'deposit' ? 'bg-green-100' : 
                        transaction.type === 'withdrawal' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {transaction.type === 'deposit' ? (
                          <ArrowDown className="text-green-600" size={18} />
                        ) : transaction.type === 'withdrawal' ? (
                          <ArrowUp className="text-red-600" size={18} />
                        ) : (
                          <Send className="text-blue-600" size={18} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.type === 'deposit' ? 'Deposit' : 
                           transaction.type === 'withdrawal' ? 'Withdrawal' : 
                           `Transfer to ${transaction.recipientEmail}`}
                        </p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <p className={`font-medium ${
                      transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">No transactions yet</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
