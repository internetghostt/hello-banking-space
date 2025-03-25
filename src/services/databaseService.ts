
import { UserAccount, Transaction } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";

// This service abstracts database operations using Supabase
export class DatabaseService {
  private static CURRENT_USER_KEY = "currentUser";

  // USER OPERATIONS
  static async getUsers(): Promise<UserAccount[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        console.error("Error fetching users:", error);
        return [];
      }
      
      return data.map(this.mapDbUserToUserAccount);
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  }

  private static mapDbUserToUserAccount(dbUser: any): UserAccount {
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      accountNumber: dbUser.account_number,
      password: dbUser.password, // Note: In production, passwords should not be returned
      balance: parseFloat(dbUser.balance) || 0,
      status: dbUser.status as 'active' | 'frozen',
      role: dbUser.role as 'user' | 'admin',
      createdAt: dbUser.created_at.split('T')[0],
      transactions: []
    };
  }

  private static mapDbTransactionToTransaction(dbTransaction: any): Transaction {
    return {
      id: dbTransaction.id,
      type: dbTransaction.type as 'deposit' | 'withdrawal' | 'transfer',
      amount: parseFloat(dbTransaction.amount),
      recipientAccount: dbTransaction.recipient_account,
      date: new Date(dbTransaction.date).toISOString().split('T')[0],
      description: dbTransaction.description
    };
  }

  static async saveUsers(users: UserAccount[]): Promise<void> {
    // In Supabase, we update users individually
    // This method is kept for API compatibility
    try {
      for (const user of users) {
        await this.updateUser(user);
      }
    } catch (error) {
      console.error("Error saving users:", error);
    }
  }

  static getCurrentUser(): UserAccount | null {
    try {
      const user = localStorage.getItem(this.CURRENT_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  static saveCurrentUser(user: UserAccount | null): void {
    try {
      if (user) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.CURRENT_USER_KEY);
      }
    } catch (error) {
      console.error("Error saving current user:", error);
    }
  }

  static async getUserByEmail(email: string): Promise<UserAccount | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error || !data) {
        console.error("Error getting user by email:", error);
        return null;
      }
      
      const user = this.mapDbUserToUserAccount(data);
      
      // Get transactions for this user
      const transactions = await this.getUserTransactions(user.id);
      user.transactions = transactions;
      
      return user;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return null;
    }
  }

  static async getUserById(id: string): Promise<UserAccount | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        console.error("Error getting user by ID:", error);
        return null;
      }
      
      const user = this.mapDbUserToUserAccount(data);
      
      // Get transactions for this user
      const transactions = await this.getUserTransactions(id);
      user.transactions = transactions;
      
      return user;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return null;
    }
  }

  static async getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
      
      if (error) {
        console.error("Error getting user transactions:", error);
        return [];
      }
      
      return data.map(this.mapDbTransactionToTransaction);
    } catch (error) {
      console.error("Error getting user transactions:", error);
      return [];
    }
  }

  static async createUser(user: UserAccount): Promise<UserAccount> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          name: user.name,
          account_number: user.accountNumber,
          password: user.password,
          balance: user.balance,
          status: user.status,
          role: user.role,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating user:", error);
        return user;
      }
      
      return this.mapDbUserToUserAccount(data);
    } catch (error) {
      console.error("Error creating user:", error);
      return user;
    }
  }

  static async updateUser(updatedUser: UserAccount): Promise<UserAccount> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          email: updatedUser.email,
          name: updatedUser.name,
          account_number: updatedUser.accountNumber,
          password: updatedUser.password,
          balance: updatedUser.balance,
          status: updatedUser.status,
          role: updatedUser.role
        })
        .eq('id', updatedUser.id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating user:", error);
        return updatedUser;
      }
      
      // Also update current user if it's the same user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === updatedUser.id) {
        this.saveCurrentUser(updatedUser);
      }
      
      return this.mapDbUserToUserAccount(data);
    } catch (error) {
      console.error("Error updating user:", error);
      return updatedUser;
    }
  }

  static async deleteUser(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) {
        console.error("Error deleting user:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  // TRANSACTION OPERATIONS
  static async addTransaction(userId: string, transaction: Transaction): Promise<boolean> {
    try {
      // Get current user
      const user = await this.getUserById(userId);
      if (!user) return false;
      
      // Calculate new balance
      const newBalance = transaction.type === 'deposit' 
        ? user.balance + transaction.amount
        : user.balance - transaction.amount;
      
      // Start by inserting the transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: transaction.type,
          amount: transaction.amount,
          recipient_account: transaction.recipientAccount,
          date: new Date().toISOString(),
          description: transaction.description
        });
      
      if (transactionError) {
        console.error("Error adding transaction:", transactionError);
        return false;
      }
      
      // Then update the user's balance
      const { error: userError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', userId);
      
      if (userError) {
        console.error("Error updating user balance:", userError);
        return false;
      }
      
      // Update current user if it's the same user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.balance = newBalance;
        currentUser.transactions = [transaction, ...(currentUser.transactions || [])];
        this.saveCurrentUser(currentUser);
      }
      
      return true;
    } catch (error) {
      console.error("Error adding transaction:", error);
      return false;
    }
  }

  // This method handles transfers between accounts
  static async transferFunds(
    senderId: string, 
    recipientAccountNumber: string, 
    amount: number, 
    description: string
  ): Promise<boolean> {
    try {
      // Get sender
      const sender = await this.getUserById(senderId);
      if (!sender) return false;
      
      // Get recipient
      const { data: recipientData, error: recipientError } = await supabase
        .from('users')
        .select('*')
        .eq('account_number', recipientAccountNumber)
        .single();
      
      if (recipientError || !recipientData) {
        console.error("Error finding recipient:", recipientError);
        return false;
      }
      
      const recipient = this.mapDbUserToUserAccount(recipientData);
      
      // Create sender transaction
      const { error: senderTransactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: senderId,
          type: 'transfer',
          amount: amount,
          recipient_account: recipientAccountNumber,
          date: new Date().toISOString(),
          description: description || `Transfer to account ${recipientAccountNumber}`
        });
      
      if (senderTransactionError) {
        console.error("Error creating sender transaction:", senderTransactionError);
        return false;
      }
      
      // Create recipient transaction
      const { error: recipientTransactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: recipient.id,
          type: 'deposit',
          amount: amount,
          date: new Date().toISOString(),
          description: `Transfer from account ${sender.accountNumber || 'Unknown'}`
        });
      
      if (recipientTransactionError) {
        console.error("Error creating recipient transaction:", recipientTransactionError);
        return false;
      }
      
      // Update sender balance
      const { error: senderBalanceError } = await supabase
        .from('users')
        .update({ balance: sender.balance - amount })
        .eq('id', senderId);
      
      if (senderBalanceError) {
        console.error("Error updating sender balance:", senderBalanceError);
        return false;
      }
      
      // Update recipient balance
      const { error: recipientBalanceError } = await supabase
        .from('users')
        .update({ balance: recipient.balance + amount })
        .eq('id', recipient.id);
      
      if (recipientBalanceError) {
        console.error("Error updating recipient balance:", recipientBalanceError);
        return false;
      }
      
      // Update current user if it's the sender
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === senderId) {
        currentUser.balance -= amount;
        const senderTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'transfer',
          amount: amount,
          recipientAccount: recipientAccountNumber,
          date: new Date().toISOString().split('T')[0],
          description: description || `Transfer to account ${recipientAccountNumber}`
        };
        currentUser.transactions = [senderTransaction, ...(currentUser.transactions || [])];
        this.saveCurrentUser(currentUser);
      }
      
      return true;
    } catch (error) {
      console.error("Error transferring funds:", error);
      return false;
    }
  }
}
