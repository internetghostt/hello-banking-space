
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import CreateUserForm from "@/components/admin/CreateUserForm";
import EditUserForm from "@/components/admin/EditUserForm";
import UserTable from "@/components/admin/UserTable";
import { UserAccount, Transaction } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { DatabaseService } from "@/services/databaseService";

const Admin = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Check if admin is logged in
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      toast({
        title: "Access denied",
        description: "You don't have permission to access the admin dashboard",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }
    
    const fetchUsers = async () => {
      try {
        console.log("Fetching users from database");
        const dbUsers = await DatabaseService.getUsers();
        if (dbUsers && dbUsers.length > 0) {
          console.log("Users fetched successfully:", dbUsers.length);
          setUsers(dbUsers);
        } else {
          console.log("No users found in database");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users from database",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [navigate, toast, user]);

  const handleLogout = () => {
    logout();
  };

  const handleToggleAccountStatus = async (userId: string) => {
    try {
      const userToUpdate = users.find(user => user.id === userId);
      if (!userToUpdate) return;
      
      const newStatus: 'active' | 'frozen' = userToUpdate.status === 'active' ? 'frozen' : 'active';
      
      const updatedUser = { ...userToUpdate, status: newStatus };
      await DatabaseService.updateUser(updatedUser);
      
      // Update the UI
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      );
      
      setUsers(updatedUsers);
      
      toast({
        title: `Account ${newStatus}`,
        description: `${userToUpdate.email}'s account has been ${newStatus}`,
      });
    } catch (error) {
      console.error("Error toggling account status:", error);
      toast({
        title: "Error",
        description: "Failed to update account status",
        variant: "destructive",
      });
    }
  };

  const handleAddBalance = async (userId: string, amount: string) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const amountValue = Number(amount);
      const userToUpdate = users.find(user => user.id === userId);
      if (!userToUpdate) return;
      
      // Add a transaction record
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount: amountValue,
        date: new Date().toISOString().split('T')[0],
        description: 'Deposit by admin'
      };
      
      // Add transaction to database
      const success = await DatabaseService.addTransaction(userId, newTransaction);
      
      if (success) {
        // Get the updated user data
        const updatedUser = await DatabaseService.getUserById(userId);
        
        if (updatedUser) {
          // Update the UI
          const updatedUsers = users.map(user => 
            user.id === userId ? updatedUser : user
          );
          
          setUsers(updatedUsers);
          
          toast({
            title: "Balance added",
            description: `$${amountValue.toFixed(2)} has been added to ${userToUpdate.email}'s account`,
          });
        }
      } else {
        throw new Error("Failed to add transaction");
      }
    } catch (error) {
      console.error("Error adding balance:", error);
      toast({
        title: "Error",
        description: "Failed to add balance",
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = async (name: string, email: string, password: string) => {
    try {
      // Check if user already exists
      const existingUser = await DatabaseService.getUserByEmail(email);
      if (existingUser) {
        toast({
          title: "User already exists",
          description: "A user with this email already exists",
          variant: "destructive",
        });
        return;
      }
      
      const accountNumber = `ACC${Math.floor(100000000 + Math.random() * 900000000)}`;
      
      const newAccount: UserAccount = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        accountNumber: accountNumber,
        balance: 0,
        status: 'active',
        role: 'user',
        createdAt: new Date().toISOString().split('T')[0],
        transactions: []
      };
      
      // Create user in database
      const createdUser = await DatabaseService.createUser(newAccount);
      
      // Update the UI
      setUsers([...users, createdUser]);
      
      toast({
        title: "Account created",
        description: `New account for ${name} (${email}) has been created successfully`,
      });
      
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async (userId: string, name: string, email: string, password: string) => {
    try {
      // Check if email already exists but not from the same user
      if (email) {
        const existingUser = await DatabaseService.getUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          toast({
            title: "Email already exists",
            description: "Another user with this email already exists",
            variant: "destructive",
          });
          return;
        }
      }
      
      const userToUpdate = users.find(user => user.id === userId);
      if (!userToUpdate) return;
      
      const updatedUser = {
        ...userToUpdate,
        name: name,
        email: email,
        ...(password ? { password } : {})
      };
      
      // Update user in database
      await DatabaseService.updateUser(updatedUser);
      
      // Update the UI
      const updatedUsers = users.map(user => 
        user.id === userId ? updatedUser : user
      );
      
      setUsers(updatedUsers);
      
      toast({
        title: "Account updated",
        description: `${userToUpdate.name || userToUpdate.email}'s account has been updated successfully`,
      });
      
      setShowEditForm(null);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const userToDelete = users.find(user => user.id === userId);
      if (!userToDelete) return;
      
      // Delete user from database
      const success = await DatabaseService.deleteUser(userId);
      
      if (success) {
        // Update the UI
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        
        toast({
          title: "Account deleted",
          description: `${userToDelete.email}'s account has been deleted successfully`,
        });
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader handleLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => setShowCreateForm(true)}>
            <UserPlus size={18} className="mr-2" />
            Create User
          </Button>
        </div>
        
        {showCreateForm && (
          <CreateUserForm 
            onCreateUser={handleCreateUser}
            onCancel={() => setShowCreateForm(false)}
          />
        )}
        
        {showEditForm && (
          <EditUserForm 
            userId={showEditForm}
            users={users}
            onEditUser={handleEditUser}
            onCancel={() => setShowEditForm(null)}
          />
        )}
        
        <UserTable 
          users={users}
          onToggleStatus={handleToggleAccountStatus}
          onAddBalance={handleAddBalance}
          onEdit={(userId) => setShowEditForm(userId)}
          onDelete={handleDeleteUser}
        />
      </main>
    </div>
  );
};

export default Admin;
