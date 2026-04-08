import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, Mail, Lock, User, GraduationCap, BookOpen, Sparkles } from "lucide-react";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) { setError("Please select a role."); return; }
    setError("");
    setLoading(true);
    const result = await signup({ fullName, email, password, role });
    setLoading(false);
    if (result.success) {
      navigate("/search");
    } else {
      setError(result.error || "Signup failed.");
    }
  };

  return (
    <div className="container py-16 md:py-24 max-w-md page-enter relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-24 left-[-50px] opacity-5 hidden md:block">
        <Sparkles className="h-40 w-40 text-gold" />
      </div>
      <div className="absolute bottom-32 right-[-40px] opacity-5 hidden md:block">
        <BookOpen className="h-36 w-36 text-primary" />
      </div>

      <div className="text-center mb-8 slide-from-right">
        <p className="kicker-text mb-2">Get Started</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary">
          Create Your <span className="accent-italic">DocIntel</span> Account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-sans">
          Unlock unlimited queries and search history.
        </p>
      </div>

      <div className="auth-card bg-card border rounded-xl p-8 shadow-sm relative z-10">
        {/* Top accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r from-gold via-accent to-primary" />
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 font-sans border border-destructive/20 animate-fade-in-up shake">
              {error}
            </div>
          )}

          <div className="space-y-2 form-field">
            <label className="text-sm font-sans font-medium text-foreground">Full Name</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/30 focus:border-primary" required />
            </div>
          </div>

          <div className="space-y-2 form-field">
            <label className="text-sm font-sans font-medium text-foreground">Role</label>
            <div className="relative group">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none group-focus-within:text-primary transition-colors" />
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/30 focus:border-primary">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Faculty">Faculty</SelectItem>
                  <SelectItem value="Researcher">Researcher</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 form-field">
            <label className="text-sm font-sans font-medium text-foreground">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/30 focus:border-primary" required />
            </div>
          </div>

          <div className="space-y-2 form-field">
            <label className="text-sm font-sans font-medium text-foreground">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/30 focus:border-primary" required minLength={6} />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans font-semibold gap-2 btn-lift magnetic-btn">
            <UserPlus className="h-4 w-4" />
            {loading ? (
              <span className="flex items-center gap-2">
                Creating account<span className="typing-cursor" />
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground font-sans">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline underline-offset-4 transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
