
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserAccount } from "@/types/user";
import { DatabaseService } from "@/services/databaseService";

interface TransferFormProps {
  userData: UserAccount;
  setUserData: React.Dispatch<React.SetStateAction<UserAccount | null>>;
  onClose: () => void;
}

const TransferForm = ({ userData, setUserData, onClose }: TransferFormProps) => {
  const [transferAmount, setTransferAmount] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const { toast } = useToast();

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
      onClose();
      
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleTransfer}>
            Transfer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransferForm;
