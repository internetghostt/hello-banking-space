
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserAccount, Transaction } from "@/types/user";
import { DatabaseService } from "@/services/databaseService";

interface WithdrawalFormProps {
  userData: UserAccount;
  setUserData: React.Dispatch<React.SetStateAction<UserAccount | null>>;
  onClose: () => void;
}

const WithdrawalForm = ({ userData, setUserData, onClose }: WithdrawalFormProps) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleWithdrawal = async () => {
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
    
    setIsProcessing(true);
    
    try {
      // Create transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "withdrawal",
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        description: "Withdrawal"
      };
      
      // Add transaction to database
      const success = await DatabaseService.addTransaction(userData.id, newTransaction);
      
      if (success) {
        // Get the updated user data
        const updatedUserData = await DatabaseService.getUserById(userData.id);
        
        if (updatedUserData) {
          setUserData(updatedUserData);
          
          setWithdrawalAmount("");
          onClose();
          
          toast({
            title: "Withdrawal successful",
            description: `$${amount.toFixed(2)} has been withdrawn from your account`,
          });
        } else {
          throw new Error("Failed to get updated user data");
        }
      } else {
        throw new Error("Failed to process withdrawal");
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast({
        title: "Withdrawal failed",
        description: "An error occurred processing your withdrawal",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
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
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleWithdrawal} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Withdraw"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalForm;
