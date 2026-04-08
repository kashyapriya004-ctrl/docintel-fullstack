import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Trash2, ChevronDown, ExternalLink, Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { Link } from "react-router-dom";

const HISTORY_KEY = "docintel-history";

type HistoryEntry = {
  id: string;
  question: string;
  answer: string;
  sources?: string[];
  timestamp: string;
};

const History = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      setHistory(stored ? JSON.parse(stored) : []);
    } catch {
      setHistory([]);
    }
  }, [isAuthenticated, navigate]);

  const deleteEntry = (id: string) => {
    const updated = history.filter((e) => e.id !== id);
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container py-12 md:py-20 max-w-3xl page-enter relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-20 right-[-60px] opacity-[0.03] hidden md:block">
        <BookOpen className="h-64 w-64 text-primary" />
      </div>

      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteEntry(deleteTarget)}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-10 slide-from-left">
        <div>
          <p className="kicker-text mb-2">Your Queries</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary">
            Search <span className="accent-italic">History</span>
          </h1>
        </div>
        {history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearHistory}
            className="font-sans text-muted-foreground gap-1.5 hover:text-destructive hover:border-destructive/50 transition-all duration-300 hover:-translate-y-0.5 btn-lift"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear All
          </Button>
        )}
      </div>

      {/* Empty state */}
      {history.length === 0 ? (
        <div className="text-center py-24 page-enter">
          <div className="relative inline-block mb-5">
            <Clock className="h-14 w-14 text-muted-foreground/30 mx-auto" />
            <span className="absolute inset-0 rounded-full border-2 border-muted-foreground/20 animate-ping" />
          </div>
          <p className="text-muted-foreground font-sans mb-6">
            No queries yet. Ask DocIntel AI a question to get started.
          </p>
          <Button asChild size="sm" className="bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans gap-2 btn-lift magnetic-btn">
            <Link to="/search">
              <Search className="h-4 w-4" />
              Ask a question
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((entry, i) => (
            <div
              key={entry.id}
              className="history-card relative bg-card border rounded-xl overflow-hidden tilt-card"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {/* Top accent strip */}
              <div className="h-1 bg-gradient-to-r from-primary via-accent to-gold" />

              <div className="p-6">
                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(entry.id); }}
                  className="absolute top-5 right-5 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-110"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Question row */}
                <button
                  onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                  className="text-left w-full pr-8 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-display font-semibold text-primary group-hover:text-accent transition-colors duration-300">
                      {entry.question}
                    </p>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-500 ${
                        expanded === entry.id ? "rotate-180 text-accent" : ""
                      }`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-sans mt-1 block">
                    {new Date(entry.timestamp).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </button>

                {/* Expanded answer */}
                {expanded === entry.id && (
                  <div className="expand-answer mt-5 pt-5 border-t">
                    <div className="prose prose-sm max-w-none text-foreground font-body whitespace-pre-line text-sm leading-relaxed">
                      {entry.answer.replace(/\*\*/g, "")}
                    </div>

                    {entry.sources && entry.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="kicker-text mb-2">Sources</p>
                        <div className="space-y-1.5">
                          {entry.sources.map((src, j) => (
                            <a
                              key={j}
                              href={src}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs text-primary hover:text-accent transition-colors font-sans group"
                            >
                              <ExternalLink className="h-3 w-3 group-hover:scale-110 transition-transform" />
                              <span className="underline underline-offset-4 truncate">{src}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
