
import React, { useState } from "react";
import { ArrowUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserAccount, Transaction } from "@/types/user";

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
    const recipient = users.find((user: UserAccount) => user.accountNumber === recipientAccount);
    
    if (!recipient) {
      toast({
        title: "Recipient not found",
        description: "The account number does not exist in our system",
        variant: "destructive",
      });
      return;
    }
    
    if (recipient.accountNumber === userData.accountNumber) {
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
      recipientAccount: recipientAccount,
      date: new Date().toISOString().split('T')[0],
      description: `Transfer to account ${recipientAccount}`
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
      description: `Transfer from account ${userData.accountNumber || 'Unknown'}`
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
    setRecipientAccount("");
    setShowTransferForm(false);
    
    toast({
      title: "Transfer successful",
      description: `$${amount.toFixed(2)} has been transferred to account ${recipientAccount}`,
    });
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
