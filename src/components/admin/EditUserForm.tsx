
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserAccount } from "@/types/user";

interface EditUserFormProps {
  userId: string;
  users: UserAccount[];
  onEditUser: (userId: string, name: string, email: string, password: string) => void;
  onCancel: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ userId, users, onEditUser, onCancel }) => {
  const [editUser, setEditUser] = useState({ name: "", email: "", password: "" });
  const { toast } = useToast();

  useEffect(() => {
    // Find the user to edit
    const userToEdit = users.find(user => user.id === userId);
    if (userToEdit) {
      setEditUser({
        name: userToEdit.name || "",
        email: userToEdit.email,
        password: ""
      });
    }
  }, [userId, users]);

  const handleSubmit = () => {
    if (!editUser.name || !editUser.email) {
      toast({
        title: "Invalid input",
        description: "Please provide both name and email",
        variant: "destructive",
      });
      return;
    }

    onEditUser(userId, editUser.name, editUser.email, editUser.password);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 p-6">
      <h2 className="text-lg font-medium mb-4">Edit User</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="John Doe"
          />
        </div>
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
