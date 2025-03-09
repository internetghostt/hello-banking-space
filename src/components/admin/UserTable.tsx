
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Lock } from "lucide-react";
import { UserAccount } from "@/types/user";

interface UserTableProps {
  users: UserAccount[];
  onToggleStatus: (userId: string) => void;
  onAddBalance: (userId: string, amount: string) => void;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  onToggleStatus, 
  onAddBalance, 
  onEdit, 
  onDelete 
}) => {
  const [showAddBalanceForm, setShowAddBalanceForm] = useState<string | null>(null);
  const [balanceToAdd, setBalanceToAdd] = useState("");

  const handleAddBalanceClick = (userId: string) => {
    setShowAddBalanceForm(userId);
    setBalanceToAdd("");
  };

  const handleAddBalanceSubmit = (userId: string) => {
    onAddBalance(userId, balanceToAdd);
    setShowAddBalanceForm(null);
    setBalanceToAdd("");
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-4">User Accounts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created On
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.name && (
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    )}
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${user.balance.toFixed(2)}</div>
                    {showAddBalanceForm === user.id ? (
                      <div className="mt-2 flex items-center space-x-2">
                        <input
                          type="number"
                          value={balanceToAdd}
                          onChange={(e) => setBalanceToAdd(e.target.value)}
                          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Amount"
                          min="0"
                          step="0.01"
                        />
                        <button
                          onClick={() => handleAddBalanceSubmit(user.id)}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 hover:bg-green-200"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setShowAddBalanceForm(null)}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800 hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleAddBalanceClick(user.id)}
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Funds
                    </button>
                    <button
                      onClick={() => onToggleStatus(user.id)}
                      className={`inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded ${
                        user.status === 'active'
                          ? 'text-amber-700 bg-amber-100 hover:bg-amber-200'
                          : 'text-green-700 bg-green-100 hover:bg-green-200'
                      }`}
                    >
                      <Lock size={14} className="mr-1" />
                      {user.status === 'active' ? 'Freeze' : 'Unfreeze'}
                    </button>
                    <button
                      onClick={() => onEdit(user.id)}
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      <Pencil size={14} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
