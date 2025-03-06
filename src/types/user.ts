
export interface UserAccount {
  id: string;
  email: string;
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
  recipientEmail?: string;
  date: string;
  description?: string;
}
