
export interface UserAccount {
  id: string;
  name?: string;  // Adding name field (optional for backward compatibility)
  email: string;
  accountNumber?: string;
  password?: string;
  balance: number;
  status: 'active' | 'frozen';
  role: 'user' | 'admin';
  createdAt: string;
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  recipientAccount?: string;
  date: string;
  description?: string;
}
