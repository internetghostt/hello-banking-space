
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
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleTransfer = async () => {
    if (!userData) return;
    
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than zero",
        variant: "destructive",
      });
      return;
    }
    
    if (!recipient.trim()) {
      toast({
        title: "Missing recipient",
        description: "Please enter a recipient account number",
        variant: "destructive",
      });
      return;
    }
    
    if (recipient === userData.accountNumber) {
      toast({
        title: "Invalid recipient",
        description: "You cannot transfer to your own account",
        variant: "destructive",
      });
      return;
    }
    
    if (transferAmount > userData.balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this transfer",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process transfer in database
      const success = await DatabaseService.transferFunds(
        userData.id,
        recipient,
        transferAmount,
        description || `Transfer to account ${recipient}`
      );
      
      if (success) {
        // Get the updated user data
        const updatedUserData = await DatabaseService.getUserById(userData.id);
        
        if (updatedUserData) {
          setUserData(updatedUserData);
          
          setRecipient("");
          setAmount("");
          setDescription("");
          onClose();
          
          toast({
            title: "Transfer successful",
            description: `$${transferAmount.toFixed(2)} has been transferred to account ${recipient}`,
          });
        } else {
          throw new Error("Failed to get updated user data");
        }
      } else {
        throw new Error("Failed to process transfer");
      }
    } catch (error) {
      console.error("Transfer error:", error);
      let errorMessage = "An error occurred processing your transfer";
      
      // Check if it's an account not found error
      if ((error as any)?.message?.includes("recipient") || 
          (error as any)?.message?.includes("account not found")) {
        errorMessage = "Recipient account not found";
      }
      
      toast({
        title: "Transfer failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Account number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="0.00"
            min="0.01"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Transfer description"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleTransfer} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Transfer"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransferForm;
