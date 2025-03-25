
import { UserAccount, Transaction } from "@/types/user";

// This service abstracts database operations
// Uses IndexedDB with localStorage fallback
export class DatabaseService {
  private static DB_NAME = "bankingApp";
  private static DB_VERSION = 1;
  private static USERS_STORE = "users";
  private static CURRENT_USER_KEY = "currentUser";

  private static async openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.warn("Your browser doesn't support IndexedDB. Falling back to localStorage.");
        reject(new Error("IndexedDB not supported"));
        return;
      }

      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = (event) => {
        console.error("Database error:", event);
        reject(new Error("Could not open database"));
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains(this.USERS_STORE)) {
          db.createObjectStore(this.USERS_STORE, { keyPath: "id" });
        }
      };
    });
  }

  // USER OPERATIONS
  static async getUsers(): Promise<UserAccount[]> {
    try {
      const db = await this.openDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.USERS_STORE, "readonly");
        const store = transaction.objectStore(this.USERS_STORE);
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (event) => {
          console.error("Error getting users from IndexedDB:", event);
          reject(new Error("Failed to get users"));
        };
      });
    } catch (error) {
      console.warn("Falling back to localStorage for getUsers");
      try {
        const users = localStorage.getItem("users");
        return users ? JSON.parse(users) : [];
      } catch (localStorageError) {
        console.error("Error getting users:", localStorageError);
        return [];
      }
    }
  }

  static async saveUsers(users: UserAccount[]): Promise<void> {
    try {
      const db = await this.openDatabase();
      const transaction = db.transaction(this.USERS_STORE, "readwrite");
      const store = transaction.objectStore(this.USERS_STORE);
      
      // Clear existing data
      store.clear();
      
      // Add all users
      users.forEach(user => {
        store.add(user);
      });
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
          resolve();
        };
        
        transaction.onerror = (event) => {
          console.error("Error saving users to IndexedDB:", event);
          reject(new Error("Failed to save users"));
        };
      });
    } catch (error) {
      console.warn("Falling back to localStorage for saveUsers");
      try {
        localStorage.setItem("users", JSON.stringify(users));
      } catch (localStorageError) {
        console.error("Error saving users:", localStorageError);
      }
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

  static async getUserByEmail(email: string): Promise<UserAccount | null> {
    const users = await this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  static async getUserById(id: string): Promise<UserAccount | null> {
    try {
      const db = await this.openDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.USERS_STORE, "readonly");
        const store = transaction.objectStore(this.USERS_STORE);
        const request = store.get(id);

        request.onsuccess = () => {
          resolve(request.result || null);
        };

        request.onerror = (event) => {
          console.error("Error getting user by ID from IndexedDB:", event);
          reject(new Error("Failed to get user by ID"));
        };
      });
    } catch (error) {
      console.warn("Falling back to localStorage for getUserById");
      const users = await this.getUsers();
      return users.find(user => user.id === id) || null;
    }
  }

  static async createUser(user: UserAccount): Promise<UserAccount> {
    try {
      const db = await this.openDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.USERS_STORE, "readwrite");
        const store = transaction.objectStore(this.USERS_STORE);
        const request = store.add(user);

        request.onsuccess = () => {
          resolve(user);
        };

        request.onerror = (event) => {
          console.error("Error creating user in IndexedDB:", event);
          reject(new Error("Failed to create user"));
        };
      });
    } catch (error) {
      console.warn("Falling back to localStorage for createUser");
      const users = await this.getUsers();
      const newUsers = [...users, user];
      await this.saveUsers(newUsers);
      return user;
    }
  }

  static async updateUser(updatedUser: UserAccount): Promise<UserAccount> {
    try {
      const db = await this.openDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.USERS_STORE, "readwrite");
        const store = transaction.objectStore(this.USERS_STORE);
        const request = store.put(updatedUser);

        request.onsuccess = () => {
          // Also update current user if it's the same user
          const currentUser = this.getCurrentUser();
          if (currentUser && currentUser.id === updatedUser.id) {
            this.saveCurrentUser(updatedUser);
          }
          resolve(updatedUser);
        };

        request.onerror = (event) => {
          console.error("Error updating user in IndexedDB:", event);
          reject(new Error("Failed to update user"));
        };
      });
    } catch (error) {
      console.warn("Falling back to localStorage for updateUser");
      const users = await this.getUsers();
      const newUsers = users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      );
      await this.saveUsers(newUsers);
      
      // Also update current user if it's the same user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === updatedUser.id) {
        this.saveCurrentUser(updatedUser);
      }
      
      return updatedUser;
    }
  }

  static async deleteUser(userId: string): Promise<boolean> {
    try {
      const db = await this.openDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.USERS_STORE, "readwrite");
        const store = transaction.objectStore(this.USERS_STORE);
        const request = store.delete(userId);

        request.onsuccess = () => {
          resolve(true);
        };

        request.onerror = (event) => {
          console.error("Error deleting user from IndexedDB:", event);
          reject(new Error("Failed to delete user"));
        };
      });
    } catch (error) {
      console.warn("Falling back to localStorage for deleteUser");
      const users = await this.getUsers();
      const newUsers = users.filter(user => user.id !== userId);
      await this.saveUsers(newUsers);
      return users.length !== newUsers.length;
    }
  }

  // TRANSACTION OPERATIONS
  static async addTransaction(userId: string, transaction: Transaction): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) return false;

    const updatedUser = {
      ...user,
      transactions: [...(user.transactions || []), transaction],
      balance: transaction.type === 'deposit' 
        ? user.balance + transaction.amount
        : user.balance - transaction.amount
    };

    return !!(await this.updateUser(updatedUser));
  }

  // This method handles transfers between accounts
  static async transferFunds(
    senderId: string, 
    recipientAccountNumber: string, 
    amount: number, 
    description: string
  ): Promise<boolean> {
    // Get sender
    const sender = await this.getUserById(senderId);
    if (!sender) return false;
    
    // Get recipient
    const users = await this.getUsers();
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
    
    try {
      const db = await this.openDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.USERS_STORE, "readwrite");
        const store = transaction.objectStore(this.USERS_STORE);
        
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
        store.put(updatedSender);
        store.put(updatedRecipient);
        
        transaction.oncomplete = () => {
          // If sender is the current user, update that too
          const currentUser = this.getCurrentUser();
          if (currentUser && currentUser.id === sender.id) {
            this.saveCurrentUser(updatedSender);
          }
          resolve(true);
        };
        
        transaction.onerror = (event) => {
          console.error("Error transferring funds in IndexedDB:", event);
          reject(new Error("Failed to transfer funds"));
        };
      });
    } catch (error) {
      console.warn("Falling back to localStorage for transferFunds");
      
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
      
      await this.saveUsers(updatedUsers);
      
      // If sender is the current user, update that too
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === sender.id) {
        this.saveCurrentUser(updatedSender);
      }
      
      return true;
    }
  }
}
