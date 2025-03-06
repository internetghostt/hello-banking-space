
export interface UserAccount {
  id: string;
  email: string;
  accountNumber?: string; // Adding account number field
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
  recipientAccount?: string; // Changed from recipientEmail to recipientAccount
  date: string;
  description?: string;
}
