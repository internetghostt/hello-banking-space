import React, { useState } from "react";
import { ArrowUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserAccount, Transaction } from "@/types/user";
import { DatabaseService } from "@/services/databaseService";

interface AccountActionsProps {
  userData: UserAccount;
  setUserData: React.Dispatch<React.SetStateAction<UserAccount | null>>;
}

const AccountActions = ({ userData, setUserData }: AccountActionsProps) => {
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const { toast } = useToast();

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
    
    // Create transaction
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
    
    // Update user data in database
    DatabaseService.updateUser(updatedUserData);
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
    
    if (recipientAccount === userData.accountNumber) {
      toast({
        title: "Invalid recipient",
        description: "You cannot transfer funds to yourself",
        variant: "destructive",
      });
      return;
    }
    
    // First verify recipient exists
    const users = DatabaseService.getUsers();
    const recipient = users.find(user => user.accountNumber === recipientAccount);
    
    if (!recipient) {
      toast({
        title: "Recipient not found",
        description: "The account number does not exist in our system",
        variant: "destructive",
      });
      return;
    }
    
    // Perform transfer using the database service
    const transferSuccess = DatabaseService.transferFunds(
      userData.id,
      recipientAccount,
      amount,
      `Transfer to account ${recipientAccount}`
    );
    
    if (transferSuccess) {
      // Get the updated user data
      const updatedUser = DatabaseService.getUserById(userData.id);
      if (updatedUser) {
        setUserData(updatedUser);
      }
      
      setTransferAmount("");
      setRecipientAccount("");
      setShowTransferForm(false);
      
      toast({
        title: "Transfer successful",
        description: `$${amount.toFixed(2)} has been transferred to account ${recipientAccount}`,
      });
    } else {
      toast({
        title: "Transfer failed",
        description: "An error occurred during the transfer. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
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
            <ArrowUp size={16} className="mr-2" />
            <span>Withdraw Funds</span>
          </Button>
          <Button 
            variant="outline" 
            className="border-green-200 hover:bg-green-50"
            disabled={userData?.status === 'frozen'}
            onClick={() => setShowTransferForm(true)}
          >
            <Send size={16} className="mr-2" />
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Account Number</label>
                <input
                  type="text"
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., ACC12345678"
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
  );
};

export default AccountActions;
