
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
        <h2 className="text-lg font-semibold mb-4 text-left text-[#12326e]">Recent Transactions</h2>
        {transactions && transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.slice().reverse().slice(0, 5).map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'deposit' ? 'bg-[#e5f6ea]' : 
                    transaction.type === 'withdrawal' ? 'bg-[#fbe9e7]' : 'bg-[#e3f2fd]'
                  }`}>
                    {transaction.type === 'deposit' ? (
                      <ArrowDown className="text-[#0a7d41]" size={18} />
                    ) : transaction.type === 'withdrawal' ? (
                      <ArrowUp className="text-[#d32f2f]" size={18} />
                    ) : (
                      <Send className="text-[#1565c0]" size={18} />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[#333333]">
                      {transaction.type === 'deposit' ? 'Deposit' : 
                       transaction.type === 'withdrawal' ? 'Withdrawal' : 
                       `Transfer to ${transaction.recipientAccount}`}
                    </p>
                    <p className="text-sm text-[#6e6e6e]">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.type === 'deposit' ? 'text-[#0a7d41]' : 'text-[#d32f2f]'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-[#6e6e6e]">
                    Available
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-[#6e6e6e] bg-[#f9f9f9] rounded-lg">No transactions yet</div>
        )}
      </div>
    </div>
  );
};

export default TransactionsList;
