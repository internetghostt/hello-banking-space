
import React from "react";
import { UserAccount } from "@/types/user";

interface AccountOverviewProps {
  userData: UserAccount;
}

const AccountOverview = ({ userData }: AccountOverviewProps) => {
  return (
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
  );
};

export default AccountOverview;
