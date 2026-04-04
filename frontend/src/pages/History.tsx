import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

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
    // Read from localStorage — this is where Search.tsx writes every query
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
    <div className="container py-12 md:py-20 max-w-3xl">
      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteEntry(deleteTarget)}
      />

      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="kicker-text mb-2">Your Queries</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary">
            Search <span className="accent-italic">History</span>
          </h1>
        </div>
        {history.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearHistory} className="font-sans text-muted-foreground gap-1.5">
            <Trash2 className="h-3.5 w-3.5" />
            Clear All
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20">
          <Clock className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground font-sans">No queries yet. Ask DocIntel AI a question to get started.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="relative bg-card border rounded-lg p-6 hover:shadow-sm transition-all"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(entry.id);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <button
                onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                className="text-left w-full pr-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="font-display font-semibold text-primary">{entry.question}</p>
                  <span className="text-xs text-muted-foreground font-sans whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
                {expanded === entry.id && (
                  <div className="mt-4 pt-4 border-t text-sm text-foreground font-body whitespace-pre-line animate-fade-in-up">
                    {entry.answer.replace(/\*\*/g, "")}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
