
import { UserAccount, Transaction } from "@/types/user";

// This service abstracts database operations
// Currently implemented with localStorage, but can be replaced with actual DB calls
export class DatabaseService {
  // USER OPERATIONS
  static getUsers(): UserAccount[] {
    try {
      const users = localStorage.getItem("users");
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  }

  static saveUsers(users: UserAccount[]): void {
    try {
      localStorage.setItem("users", JSON.stringify(users));
    } catch (error) {
      console.error("Error saving users:", error);
    }
  }

  static getCurrentUser(): UserAccount | null {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  static saveCurrentUser(user: UserAccount | null): void {
    try {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error saving current user:", error);
    }
  }

  static getUserByEmail(email: string): UserAccount | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  static getUserById(id: string): UserAccount | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  static createUser(user: UserAccount): UserAccount {
    const users = this.getUsers();
    const newUsers = [...users, user];
    this.saveUsers(newUsers);
    return user;
  }

  static updateUser(updatedUser: UserAccount): UserAccount {
    const users = this.getUsers();
    const newUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    this.saveUsers(newUsers);
    
    // Also update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === updatedUser.id) {
      this.saveCurrentUser(updatedUser);
    }
    
    return updatedUser;
  }

  static deleteUser(userId: string): boolean {
    const users = this.getUsers();
    const newUsers = users.filter(user => user.id !== userId);
    this.saveUsers(newUsers);
    return users.length !== newUsers.length;
  }

  // TRANSACTION OPERATIONS
  static addTransaction(userId: string, transaction: Transaction): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;

    const updatedUser = {
      ...user,
      transactions: [...(user.transactions || []), transaction],
      balance: transaction.type === 'deposit' 
        ? user.balance + transaction.amount
        : user.balance - transaction.amount
    };

    return !!this.updateUser(updatedUser);
  }

  // This method handles transfers between accounts
  static transferFunds(
    senderId: string, 
    recipientAccountNumber: string, 
    amount: number, 
    description: string
  ): boolean {
    // Get sender
    const sender = this.getUserById(senderId);
    if (!sender) return false;
    
    // Get recipient
    const users = this.getUsers();
    const recipient = users.find(u => u.accountNumber === recipientAccountNumber);
    if (!recipient) return false;
    
    // Create transactions
    const senderTransaction: Transaction = {
      id: Date.now().toString(),
      type: "transfer",
      amount: amount,
      recipientAccount: recipientAccountNumber,
      date: new Date().toISOString().split('T')[0],
      description: description || `Transfer to account ${recipientAccountNumber}`
    };
    
    const recipientTransaction: Transaction = {
      id: (Date.now() + 1).toString(),
      type: "deposit",
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      description: `Transfer from account ${sender.accountNumber || 'Unknown'}`
    };
    
    // Update sender
    const updatedSender = {
      ...sender,
      balance: sender.balance - amount,
      transactions: [...(sender.transactions || []), senderTransaction]
    };
    
    // Update recipient
    const updatedRecipient = {
      ...recipient,
      balance: recipient.balance + amount,
      transactions: [...(recipient.transactions || []), recipientTransaction]
    };
    
    // Save both updates
    const updatedUsers = users.map(user => {
      if (user.id === sender.id) return updatedSender;
      if (user.id === recipient.id) return updatedRecipient;
      return user;
    });
    
    this.saveUsers(updatedUsers);
    
    // If sender is the current user, update that too
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === sender.id) {
      this.saveCurrentUser(updatedSender);
    }
    
    return true;
  }
}
