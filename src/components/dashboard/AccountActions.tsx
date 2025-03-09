
import React, { useState } from "react";
import { ArrowUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAccount } from "@/types/user";
import WithdrawalForm from "./WithdrawalForm";
import TransferForm from "./TransferForm";

interface AccountActionsProps {
  userData: UserAccount;
  setUserData: React.Dispatch<React.SetStateAction<UserAccount | null>>;
}

const AccountActions = ({ userData, setUserData }: AccountActionsProps) => {
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);

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
          <WithdrawalForm 
            userData={userData}
            setUserData={setUserData}
            onClose={() => setShowWithdrawalForm(false)}
          />
        )}
        
        {/* Transfer Form */}
        {showTransferForm && (
          <TransferForm
            userData={userData}
            setUserData={setUserData}
            onClose={() => setShowTransferForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AccountActions;
