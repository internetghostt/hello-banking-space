
import React from "react";
import { ArrowDown, ArrowUp, Send, ChevronRight } from "lucide-react";
import { Transaction } from "@/types/user";

interface TransactionsListProps {
  transactions?: Transaction[];
}

const TransactionsList = ({ transactions }: TransactionsListProps) => {
  return (
    <div className="bg-white rounded-sm shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-base font-semibold text-left text-boa-darkBlue">Account Activity</h2>
        <a href="#" className="text-sm text-boa-lightBlue flex items-center hover:underline">
          See all transactions <ChevronRight size={14} className="ml-1" />
        </a>
      </div>
      <div className="p-0">
        {transactions && transactions.length > 0 ? (
          <div>
            {transactions.slice().reverse().slice(0, 5).map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'deposit' ? 'bg-green-100' : 
                    transaction.type === 'withdrawal' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {transaction.type === 'deposit' ? (
                      <ArrowDown className="text-green-600" size={16} />
                    ) : transaction.type === 'withdrawal' ? (
                      <ArrowUp className="text-red-600" size={16} />
                    ) : (
                      <Send className="text-blue-600" size={16} />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-boa-textGrey">
                      {transaction.type === 'deposit' ? 'Deposit' : 
                       transaction.type === 'withdrawal' ? 'Withdrawal' : 
                       `Transfer to ${transaction.recipientAccount}`}
                    </p>
                    <p className="text-xs text-boa-darkGrey">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-boa-darkGrey">
                    Posted
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-boa-darkGrey bg-gray-50">No transactions to show</div>
        )}
      </div>
    </div>
  );
};

export default TransactionsList;
