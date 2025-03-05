
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserAccount } from "@/types/user";

interface EditUserFormProps {
  userId: string;
  users: UserAccount[];
  onEditUser: (userId: string, email: string, password: string) => void;
  onCancel: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ userId, users, onEditUser, onCancel }) => {
  const [editUser, setEditUser] = useState<{ email: string; password: string }>({ email: "", password: "" });
  const { toast } = useToast();

  useEffect(() => {
    const userToEdit = users.find(user => user.id === userId);
    if (userToEdit) {
      setEditUser({ 
        email: userToEdit.email, 
        password: "" // Don't populate the password field for security
      });
    }
  }, [userId, users]);

  const handleSubmit = () => {
    if (!editUser.email) {
      toast({
        title: "Invalid input",
        description: "Email cannot be empty",
        variant: "destructive",
      });
      return;
    }

    onEditUser(userId, editUser.email, editUser.password);
  };

  return (
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
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditUserForm;
