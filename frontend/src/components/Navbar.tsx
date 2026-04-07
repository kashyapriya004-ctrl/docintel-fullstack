import { Link, useLocation } from "react-router-dom";
import { BookOpen, Menu, X, LogIn, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const links = [
    { to: "/", label: "Home" },
    { to: "/search", label: "Search" },
    { to: "/faq", label: "FAQ" },
    ...(isAuthenticated ? [{ to: "/history", label: "History" }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="nav-logo flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-sienna" />
          <span className="font-display text-xl font-bold text-primary">
            DocIntel <span className="accent-italic">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative font-sans text-sm font-medium transition-colors hover:text-primary pb-0.5 ${
                isActive(link.to)
                  ? "text-primary nav-link-active"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button asChild variant="ghost" size="sm" className="font-sans gap-2 hover:bg-secondary transition-colors">
              <Link to="/account">
                <User className="h-4 w-4" />
                {user?.fullName?.split(" ")[0]}
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="font-sans gap-1.5">
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans font-semibold btn-lift"
              >
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary p-2 rounded-md hover:bg-secondary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" style={{ animation: "scale-in 0.2s ease forwards" }} />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu md:hidden border-t bg-background px-4 pb-5">
          <div className="pt-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center py-3 font-sans text-sm font-medium border-b border-border/40 last:border-0 ${
                  isActive(link.to) ? "text-primary" : "text-muted-foreground hover:text-primary"
                } transition-colors`}
              >
                {isActive(link.to) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sienna mr-2.5" />
                )}
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="py-2 font-sans text-sm text-primary font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Account
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Button
                  asChild
                  size="sm"
                  className="bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans font-semibold btn-lift"
                >
                  <Link to="/signup" onClick={() => setMobileOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
