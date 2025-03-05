
import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

interface AdminHeaderProps {
  handleLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ handleLogout }) => {
  return (
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
  );
};

export default AdminHeader;
