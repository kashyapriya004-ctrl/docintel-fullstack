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
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-sienna" />
          <span className="font-display text-xl font-bold text-primary">
            DocIntel <span className="accent-italic">AI</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-sans text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.to) ? "text-primary border-b-2 border-sienna pb-0.5" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button asChild variant="ghost" size="sm" className="font-sans gap-2">
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
              <Button asChild size="sm" className="bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans font-semibold">
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-primary" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 pb-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 font-sans text-sm font-medium ${
                isActive(link.to) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t pt-3 mt-2 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link to="/account" onClick={() => setMobileOpen(false)} className="py-2 font-sans text-sm text-primary font-medium">
                Account
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="py-2 font-sans text-sm text-muted-foreground">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="py-2 font-sans text-sm text-primary font-medium">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
