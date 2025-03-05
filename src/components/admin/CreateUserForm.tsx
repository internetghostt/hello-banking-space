
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface CreateUserFormProps {
  onCreateUser: (email: string, password: string) => void;
  onCancel: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onCreateUser, onCancel }) => {
  const [newUser, setNewUser] = useState({ email: "", password: "" });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!newUser.email || !newUser.password) {
      toast({
        title: "Invalid input",
        description: "Please provide both email and password",
        variant: "destructive",
      });
      return;
    }

    onCreateUser(newUser.email, newUser.password);
    setNewUser({ email: "", password: "" });
  };

  return (
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
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserForm;
