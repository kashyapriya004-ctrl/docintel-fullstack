import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
// @ts-ignore
import { User, Mail, GraduationCap, LogOut, BookOpen, Sparkles, ShieldCheck, Building, Save, X, Loader2 } from "lucide-react";

const Account = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    institution: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        role: user.role,
        institution: user.institution
      });
    }
  }, [user]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSave = async () => {
    setIsLoading(true);
    const result = await updateProfile(formData);
    setIsLoading(false);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName,
      role: user.role,
      institution: user.institution
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const roles = ["Student", "Researcher", "Professor", "Administrator", "Policy Maker", "Other"];

  return (
    <div className="container py-16 md:py-24 max-w-lg page-enter relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="orb orb-1" style={{ width: '400px', height: '400px', top: '10%', left: '-10%', opacity: 0.3 }} />
        <div className="orb orb-2" style={{ width: '300px', height: '300px', bottom: '10%', right: '-10%', opacity: 0.2 }} />
      </div>

      <div className="absolute top-10 right-[-20px] opacity-10 hidden md:block z-0 animate-pulse">
        <Sparkles className="h-48 w-48 text-gold" />
      </div>
      <div className="absolute bottom-10 left-[-30px] opacity-5 hidden md:block z-0 animate-bounce" style={{ animationDuration: '8s' }}>
        <BookOpen className="h-32 w-32 text-accent" />
      </div>

      <div className="text-center mb-10 slide-from-top relative z-10">
        <p className="kicker-text mb-2">Member Portal</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary">
          Your <span className="accent-italic">Profile</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground font-sans max-w-xs mx-auto">
          Manage your DocIntel account and academic information.
        </p>
      </div>

      <div className="auth-card bg-card/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 md:p-10 shadow-2xl relative z-10 transition-all duration-500 hover:shadow-primary/5">
        <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-primary via-accent to-gold" />
        
        <div className="flex items-center justify-center mb-10 mt-2">
          <div className="h-28 w-28 rounded-full bg-muted/50 shadow-inner flex items-center justify-center border-[6px] border-background relative group transition-transform duration-500 hover:scale-105">
            <User className="h-12 w-12 text-primary opacity-80 group-hover:text-accent transition-colors duration-300" />
            <div className="absolute bottom-1 right-1 h-6 w-6 bg-green-500 rounded-full border-[3px] border-background shadow-md flex items-center justify-center">
              <span className="h-2 w-2 bg-white rounded-full"></span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-4 p-4 bg-background/60 hover:bg-background rounded-xl border border-border/60 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-sans font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Full Name</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-transparent border-b border-primary/30 focus:border-primary outline-none pb-1 text-foreground"
                  placeholder="Enter your name"
                />
              ) : (
                <p className="font-sans font-semibold text-foreground text-[17px] tracking-tight">
                  {user.fullName || "Not set"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-background/60 hover:bg-background rounded-xl border border-border/60 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-accent/10">
              <Mail className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-sans font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Email Address</p>
              <p className="font-sans font-semibold text-foreground text-[17px] tracking-tight truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-background/60 hover:bg-background rounded-xl border border-border/60 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-gold/10">
              <GraduationCap className="h-6 w-6 text-gold" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-sans font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Current Role</p>
              {isEditing ? (
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-transparent border-b border-primary/30 focus:border-primary outline-none pb-1 text-foreground"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              ) : (
                <p className="font-sans font-semibold text-foreground text-[17px] tracking-tight">{user.role}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-background/60 hover:bg-background rounded-xl border border-border/60 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-blue-500/10">
              <Building className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-sans font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Institution</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full bg-transparent border-b border-primary/30 focus:border-primary outline-none pb-1 text-foreground"
                  placeholder="Your college/university"
                />
              ) : (
                <p className="font-sans font-semibold text-foreground text-[17px] tracking-tight">
                  {user.institution || "Not set"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-background/60 rounded-xl border border-border/60">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-green-500/10">
              <ShieldCheck className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-sans font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Account Status</p>
              <p className="font-sans font-semibold text-green-500 text-[17px] tracking-tight">
                {user.is_verified ? "Verified" : "Active"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          {isEditing ? (
            <>
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="flex-1 h-12 font-sans font-semibold gap-2 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
              <Button 
                onClick={handleCancel} 
                variant="outline"
                className="flex-1 h-12 font-sans font-semibold gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)} 
              variant="outline" 
              className="w-full h-12 font-sans font-semibold gap-2"
            >
              Edit Profile
            </Button>
          )}
        </div>

        <Button onClick={handleLogout} variant="outline" className="w-full h-12 font-sans font-semibold gap-2 border-destructive/20 text-destructive hover:bg-destructive hover:border-destructive hover:text-white transition-all duration-300 shadow-sm">
          <LogOut className="h-4 w-4" />
          Secure Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Account;