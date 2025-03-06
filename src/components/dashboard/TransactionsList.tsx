
import React from "react";
import { ArrowDown, ArrowUp, Send } from "lucide-react";
import { Transaction } from "@/types/user";

interface TransactionsListProps {
  transactions?: Transaction[];
}

const TransactionsList = ({ transactions }: TransactionsListProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-4">Recent Transactions</h2>
        {transactions && transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.slice().reverse().slice(0, 5).map(transaction => (
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
                       `Transfer to ${transaction.recipientAccount}`}
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
  );
};

export default TransactionsList;
