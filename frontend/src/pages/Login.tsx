import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
// @ts-ignore
import { LogIn, Mail, Lock, Eye, EyeOff, BookOpen, Sparkles } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/search");
    } else {
      setError(result.error || "Login failed.");
    }
  };

  return (
    <div className="container py-16 md:py-24 max-w-md page-enter relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      {/* Decorative ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="orb orb-1" style={{ width: '400px', height: '400px', top: '10%', left: '-10%', opacity: 0.2 }} />
        <div className="orb orb-2" style={{ width: '300px', height: '300px', bottom: '10%', right: '-10%', opacity: 0.15 }} />
      </div>

      {/* Decorative floating icon */}
      <div className="absolute top-10 right-[-20px] opacity-10 hidden md:block z-0 animate-pulse">
        <Sparkles className="h-48 w-48 text-gold" />
      </div>
      <div className="absolute bottom-10 left-[-30px] opacity-5 hidden md:block z-0 animate-bounce" style={{ animationDuration: '8s' }}>
        <BookOpen className="h-32 w-32 text-accent" />
      </div>

      <div className="text-center mb-10 slide-from-top relative z-10">
        <p className="kicker-text mb-2">Welcome Back</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary">
          Sign In to <span className="accent-italic">DocIntel</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground font-sans px-4">
          Access your personalized query history and unlimited accurate searches.
        </p>
      </div>

      <div className="auth-card bg-card/85 backdrop-blur-xl border border-white/20 rounded-2xl p-8 md:p-10 shadow-2xl relative z-10 transition-all duration-500 hover:shadow-primary/5">
        {/* Top accent gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-primary via-accent to-gold" />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 font-sans border border-destructive/20 animate-fade-in-up shake flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-destructive flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-2.5 form-field group/field">
            <label className="text-[12px] uppercase tracking-wider font-sans font-bold text-muted-foreground group-focus-within/field:text-primary transition-colors">
              Email Address
            </label>
            <div className="relative group/input hover:shadow-inner rounded-md transition-shadow">
              <div className="absolute left-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-md bg-muted/60 flex items-center justify-center transition-all duration-300 group-focus-within/input:bg-primary/10">
                <Mail className="h-4 w-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
              </div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="pl-12 h-11 bg-background/50 border-input transition-all duration-300 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-[15px]"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2.5 form-field group/field">
            <div className="flex items-center justify-between">
              <label className="text-[12px] uppercase tracking-wider font-sans font-bold text-muted-foreground group-focus-within/field:text-primary transition-colors">
                Password
              </label>
            </div>
            <div className="relative group/input hover:shadow-inner rounded-md transition-shadow">
              <div className="absolute left-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-md bg-muted/60 flex items-center justify-center transition-all duration-300 group-focus-within/input:bg-primary/10">
                <Lock className="h-4 w-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
              </div>
              <Input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-12 pr-12 h-11 bg-background/50 border-input transition-all duration-300 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-[15px] tracking-wide"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-md hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-200"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-4 bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans text-base font-semibold gap-2 btn-lift magnetic-btn shadow-lg shadow-sienna/20 relative overflow-hidden group/btn"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              {loading ? (
                <span className="flex items-center gap-2">
                  Authenticating
                  <span className="typing-cursor h-4 w-2" />
                </span>
              ) : (
                "Secure Sign In"
              )}
            </span>
          </Button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground font-sans">
            New to DocIntel?{" "}
            <Link to="/signup" className="text-primary font-bold hover:text-accent hover:underline underline-offset-4 transition-all duration-300 inline-block hover:-translate-y-0.5">
              Create an account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
