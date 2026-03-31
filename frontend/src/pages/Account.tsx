import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Mail, GraduationCap, LogOut } from "lucide-react";

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="container py-16 md:py-24 max-w-lg">
      <div className="text-center mb-8">
        <p className="kicker-text mb-2">Your Profile</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary">
          Account <span className="accent-italic">Details</span>
        </h1>
      </div>

      <div className="bg-card border rounded-lg p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-background rounded-md border">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs font-sans text-muted-foreground">Full Name</p>
              <p className="font-sans font-medium text-foreground">{user.fullName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-background rounded-md border">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs font-sans text-muted-foreground">Email</p>
              <p className="font-sans font-medium text-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-background rounded-md border">
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs font-sans text-muted-foreground">Role</p>
              <p className="font-sans font-medium text-foreground">{user.role}</p>
            </div>
          </div>
        </div>

        <Button onClick={handleLogout} variant="outline" className="w-full font-sans gap-2 text-destructive hover:text-destructive">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Account;
