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

// Mock user data without passwords for initial display
const mockUsers: UserAccount[] = [
  {
    id: "1",
    name: "John Doe",
    email: "johndoe@example.com",
    balance: 5240.50,
    status: 'active',
    role: 'user',
    createdAt: "2023-01-15"
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "janedoe@example.com",
    balance: 12750.75,
    status: 'active',
    role: 'user',
    createdAt: "2023-02-20"
  },
  {
    id: "3",
    name: "Mike Smith",
    email: "mike@example.com",
    balance: 840.25,
    status: 'frozen',
    role: 'user',
    createdAt: "2023-03-10"
  }
];

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
    
    // Check if users exist in localStorage
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      // Use stored users
      console.log("Loading users from localStorage");
      const parsedUsers = JSON.parse(storedUsers);
      setUsers(parsedUsers);
    } else {
      // Initialize with mock users and store in localStorage
      console.log("Initializing users with mock data");
      const usersWithPasswords = mockUsers.map(user => ({
        ...user,
        password: `default${user.id}` // Set a default password for mock users
      }));
      localStorage.setItem("users", JSON.stringify(usersWithPasswords));
      setUsers(usersWithPasswords);
    }
    
    setIsLoading(false);
  }, [navigate, toast, user]);

  const handleLogout = () => {
    logout();
  };

  const handleToggleAccountStatus = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const newStatus: 'active' | 'frozen' = user.status === 'active' ? 'frozen' : 'active';
        
        toast({
          title: `Account ${newStatus}`,
          description: `${user.email}'s account has been ${newStatus}`,
        });
        
        // If this user is logged in, update their status in localStorage
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
          const parsedUser = JSON.parse(loggedInUser);
          if (parsedUser.id === userId) {
            const updatedLoggedInUser = {...parsedUser, status: newStatus};
            localStorage.setItem("user", JSON.stringify(updatedLoggedInUser));
          }
        }
        
        return {
          ...user,
          status: newStatus
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleAddBalance = (userId: string, amount: string) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive amount",
        variant: "destructive",
      });
      return;
    }

    const amountValue = Number(amount);
    
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const newBalance = user.balance + amountValue;
        
        toast({
          title: "Balance added",
          description: `$${amountValue.toFixed(2)} has been added to ${user.email}'s account`,
        });
        
        // Add a transaction record
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'deposit',
          amount: amountValue,
          date: new Date().toISOString().split('T')[0],
          description: 'Deposit by admin'
        };
        
        // If this user is logged in, update their balance in localStorage
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
          const parsedUser = JSON.parse(loggedInUser);
          if (parsedUser.id === userId) {
            const updatedLoggedInUser = {
              ...parsedUser, 
              balance: newBalance,
              transactions: [...(parsedUser.transactions || []), newTransaction]
            };
            localStorage.setItem("user", JSON.stringify(updatedLoggedInUser));
          }
        }
        
        return {
          ...user,
          balance: newBalance,
          transactions: [...(user.transactions || []), newTransaction]
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleCreateUser = (name: string, email: string, password: string) => {
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      toast({
        title: "User already exists",
        description: "A user with this email already exists",
        variant: "destructive",
      });
      return;
    }

    const newId = (Math.max(...users.map(u => Number(u.id))) + 1).toString();
    
    const newAccount: UserAccount = {
      id: newId,
      name: name,
      email: email,
      password: password,
      balance: 0,
      status: 'active',
      role: 'user',
      createdAt: new Date().toISOString().split('T')[0],
      transactions: []
    };
    
    const updatedUsers = [...users, newAccount];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    toast({
      title: "Account created",
      description: `New account for ${name} (${email}) has been created successfully`,
    });
    
    setShowCreateForm(false);
  };

  const handleEditUser = (userId: string, name: string, email: string, password: string) => {
    // Check if email already exists but not from the same user
    if (users.some(user => user.email === email && user.id !== userId)) {
      toast({
        title: "Email already exists",
        description: "Another user with this email already exists",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const updatedUser = {
          ...user,
          name: name,
          email: email,
        };
        
        // Only update password if a new one was provided
        if (password) {
          updatedUser.password = password;
        }
        
        // If this user is logged in, update their email in localStorage
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
          const parsedUser = JSON.parse(loggedInUser);
          if (parsedUser.id === userId) {
            const updatedLoggedInUser = {...parsedUser, name: name, email: email};
            if (password) {
              updatedLoggedInUser.password = password;
            }
            localStorage.setItem("user", JSON.stringify(updatedLoggedInUser));
          }
        }
        
        toast({
          title: "Account updated",
          description: `${user.name || user.email}'s account has been updated successfully`,
        });
        
        return updatedUser;
      }
      return user;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setShowEditForm(null);
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    if (!userToDelete) return;
    
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    // Check if the deleted user is currently logged in
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      if (parsedUser.id === userId) {
        // Remove the user from localStorage
        localStorage.removeItem("user");
      }
    }
    
    toast({
      title: "Account deleted",
      description: `${userToDelete.email}'s account has been deleted successfully`,
    });
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
        
        {/* Create user form */}
        {showCreateForm && (
          <CreateUserForm 
            onCreateUser={handleCreateUser}
            onCancel={() => setShowCreateForm(false)}
          />
        )}
        
        {/* Edit user form */}
        {showEditForm && (
          <EditUserForm 
            userId={showEditForm}
            users={users}
            onEditUser={handleEditUser}
            onCancel={() => setShowEditForm(null)}
          />
        )}
        
        {/* User accounts table */}
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
