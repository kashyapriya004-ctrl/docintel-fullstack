import { BookOpen } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-card py-12">
    <div className="container">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-sienna" />
          <span className="font-display text-lg font-bold text-primary">
            DocIntel <span className="accent-italic">AI</span>
          </span>
        </div>
        <p className="text-sm text-muted-foreground font-sans">
          Your smart companion for understanding education policies.
        </p>
        <p className="text-xs text-muted-foreground font-sans">
          © {new Date().getFullYear()} DocIntel AI. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
