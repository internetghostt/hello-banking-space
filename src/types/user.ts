
export interface UserAccount {
  id: string;
  email: string;
  password?: string;
  balance: number;
  status: 'active' | 'frozen';
  role: 'user' | 'admin';
  createdAt: string;
}
