
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { User, LogOut, UserPlus, Lock, Plus, Pencil, Trash2 } from "lucide-react";

interface UserAccount {
  id: string;
  email: string;
  password?: string;
  balance: number;
  status: 'active' | 'frozen';
  role: 'user' | 'admin';
  createdAt: string;
}

// Mock user data without passwords for initial display
const mockUsers: UserAccount[] = [
  {
    id: "1",
    email: "johndoe@example.com",
    balance: 5240.50,
    status: 'active',
    role: 'user',
    createdAt: "2023-01-15"
  },
  {
    id: "2",
    email: "janedoe@example.com",
    balance: 12750.75,
    status: 'active',
    role: 'user',
    createdAt: "2023-02-20"
  },
  {
    id: "3",
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
  const [showAddBalanceForm, setShowAddBalanceForm] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ email: "", password: "" });
  const [editUser, setEditUser] = useState<{ email: string; password: string }>({ email: "", password: "" });
  const [balanceToAdd, setBalanceToAdd] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is logged in
    const userString = localStorage.getItem("user");
    if (!userString) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userString);
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
      const parsedUsers = JSON.parse(storedUsers);
      setUsers(parsedUsers);
    } else {
      // Initialize with mock users and store in localStorage
      const usersWithPasswords = mockUsers.map(user => ({
        ...user,
        password: `default${user.id}` // Set a default password for mock users
      }));
      localStorage.setItem("users", JSON.stringify(usersWithPasswords));
      setUsers(usersWithPasswords);
    }
    
    setIsLoading(false);
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  const handleToggleAccountStatus = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'frozen' : 'active';
        
        toast({
          title: `Account ${newStatus}`,
          description: `${user.email}'s account has been ${newStatus}`,
        });
        
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

  const handleAddBalance = (userId: string) => {
    if (!balanceToAdd || isNaN(Number(balanceToAdd)) || Number(balanceToAdd) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive amount",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const amount = Number(balanceToAdd);
        const newBalance = user.balance + amount;
        
        toast({
          title: "Balance added",
          description: `$${amount.toFixed(2)} has been added to ${user.email}'s account`,
        });
        
        return {
          ...user,
          balance: newBalance
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setShowAddBalanceForm(null);
    setBalanceToAdd("");
  };

  const handleCreateUser = () => {
    if (!newUser.email || !newUser.password) {
      toast({
        title: "Invalid input",
        description: "Please provide both email and password",
        variant: "destructive",
      });
      return;
    }

    // Check if user already exists
    if (users.some(user => user.email === newUser.email)) {
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
      email: newUser.email,
      password: newUser.password,
      balance: 0,
      status: 'active',
      role: 'user',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedUsers = [...users, newAccount];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    toast({
      title: "Account created",
      description: `New account for ${newUser.email} has been created successfully`,
    });
    
    setNewUser({ email: "", password: "" });
    setShowCreateForm(false);
  };

  // Edit user function
  const handleEditUser = (userId: string) => {
    if (!editUser.email) {
      toast({
        title: "Invalid input",
        description: "Email cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists but not from the same user
    if (users.some(user => user.email === editUser.email && user.id !== userId)) {
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
          email: editUser.email,
        };
        
        // Only update password if a new one was provided
        if (editUser.password) {
          updatedUser.password = editUser.password;
        }
        
        toast({
          title: "Account updated",
          description: `${user.email}'s account has been updated successfully`,
        });
        
        return updatedUser;
      }
      return user;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setShowEditForm(null);
    setEditUser({ email: "", password: "" });
  };

  // Delete user function
  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    if (!userToDelete) return;
    
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    toast({
      title: "Account deleted",
      description: `${userToDelete.email}'s account has been deleted successfully`,
    });
  };

  // Set up edit form for a user
  const setupEditForm = (userId: string) => {
    const userToEdit = users.find(user => user.id === userId);
    if (userToEdit) {
      setEditUser({ 
        email: userToEdit.email, 
        password: "" // Don't populate the password field for security
      });
      setShowEditForm(userId);
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
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <span className="text-primary font-bold text-sm">NB</span>
            </div>
            <span className="font-bold text-xl">NeoBank Admin</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User size={18} />
              <span>Administrator</span>
            </div>
            <Button 
              variant="outline" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
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
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 p-6">
            <h2 className="text-lg font-medium mb-4">Create New User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser}>
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Edit user form */}
        {showEditForm && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 p-6">
            <h2 className="text-lg font-medium mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  value={editUser.password}
                  onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowEditForm(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleEditUser(showEditForm)}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* User accounts table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">User Accounts</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created On
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${user.balance.toFixed(2)}</div>
                        {showAddBalanceForm === user.id ? (
                          <div className="mt-2 flex items-center space-x-2">
                            <input
                              type="number"
                              value={balanceToAdd}
                              onChange={(e) => setBalanceToAdd(e.target.value)}
                              className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                              placeholder="Amount"
                              min="0"
                              step="0.01"
                            />
                            <button
                              onClick={() => handleAddBalance(user.id)}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 hover:bg-green-200"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => setShowAddBalanceForm(null)}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800 hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => setShowAddBalanceForm(user.id)}
                          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200"
                        >
                          <Plus size={14} className="mr-1" />
                          Add Funds
                        </button>
                        <button
                          onClick={() => handleToggleAccountStatus(user.id)}
                          className={`inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded ${
                            user.status === 'active'
                              ? 'text-amber-700 bg-amber-100 hover:bg-amber-200'
                              : 'text-green-700 bg-green-100 hover:bg-green-200'
                          }`}
                        >
                          <Lock size={14} className="mr-1" />
                          {user.status === 'active' ? 'Freeze' : 'Unfreeze'}
                        </button>
                        <button
                          onClick={() => setupEditForm(user.id)}
                          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          <Pencil size={14} className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
