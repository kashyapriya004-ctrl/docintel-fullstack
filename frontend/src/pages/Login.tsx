import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, Mail, Lock, Eye, EyeOff, BookOpen } from "lucide-react";

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
    <div className="container py-16 md:py-28 max-w-md page-enter relative overflow-hidden">
      {/* Decorative floating icon */}
      <div className="absolute top-20 right-[-40px] opacity-5 hidden md:block">
        <BookOpen className="h-48 w-48 text-primary" />
      </div>
      <div className="absolute bottom-20 left-[-30px] opacity-5 hidden md:block">
        <BookOpen className="h-32 w-32 text-accent" />
      </div>

      <div className="text-center mb-8 slide-from-left">
        <p className="kicker-text mb-2">Welcome Back</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary">
          Sign In to <span className="accent-italic">DocIntel</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-sans">
          Access your search history and unlimited queries.
        </p>
      </div>

      <div className="auth-card bg-card border rounded-xl p-8 shadow-sm relative z-10">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r from-primary via-accent to-gold" />
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div
              className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 font-sans border border-destructive/20 animate-fade-in-up shake"
            >
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-2 form-field">
            <label className="text-sm font-sans font-medium text-foreground">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2 form-field">
            <label className="text-sm font-sans font-medium text-foreground">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans font-semibold gap-2 btn-lift magnetic-btn"
          >
            <LogIn className="h-4 w-4" />
            {loading ? (
              <span className="flex items-center gap-2">
                Signing in
                <span className="typing-cursor" />
              </span>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-sans">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 font-sans font-medium hover:bg-muted/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            onClick={() => navigate("/search")}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground font-sans">
            New here?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline underline-offset-4 transition-colors">
              Create an account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
