import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, BookOpen, Sparkles, ExternalLink, Copy, CheckCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import GuestLimitModal from "@/components/GuestLimitModal";
import { generatePolicyResponse } from "@/services/gemini";

type SearchResult = {
  question: string;
  answer: string;
  sources: string[];
};

/* ── Confetti Effect ── */
const Confetti = () => {
  const [pieces, setPieces] = useState<{ id: number; left: number; color: string; delay: number; size: number }[]>([]);
  useEffect(() => {
    const colors = ["hsl(var(--sienna))", "hsl(var(--accent))", "hsl(var(--gold))", "hsl(var(--primary))", "hsl(var(--olive))"];
    const newPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      size: Math.random() * 8 + 6,
    }));
    setPieces(newPieces);
    const timer = setTimeout(() => setPieces([]), 4000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            width: p.size,
            height: p.size,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </>
  );
};

/* ── Animated loading bar ── */
const LoadingBar = () => (
  <div className="w-full overflow-hidden rounded-full bg-muted mt-4">
    <div className="loader-bar w-full" />
  </div>
);

/* ── Loading state with live timer ── */
const LoadingState = () => {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const msgs = [
    { max: 10, text: "Contacting backend..." },
    { max: 40, text: "Fetching live policy data..." },
    { max: Infinity, text: "Generating sourced answer..." },
  ];
  const msg = msgs.find((m) => secs < m.max)!.text;

  return (
    <div className="mt-10 flex flex-col items-center gap-4 page-enter">
      <div className="relative">
        <BookOpen className="h-12 w-12 text-accent" />
        {/* orbiting ring */}
        <span className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping" />
      </div>
      <p className="text-muted-foreground font-sans text-sm font-medium">{msg}</p>
      <p className="text-xs text-muted-foreground/60 font-sans">{secs}s elapsed · typically 30–90s</p>
      <LoadingBar />
      <div className="flex gap-1.5 mt-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-accent/60"
            style={{ animation: `typing-pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
};

const SAMPLE_QUESTIONS = [
  "What is the NEP 2020 policy on multilingual education?",
  "What are AICTE's latest guidelines on online degree programs?",
  "How does UGC regulate deemed universities?",
];

const Search = () => {
  const { isAuthenticated, canQuery, incrementGuestQuery, guestQueries } = useAuth();
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAsk = async (q?: string) => {
    const queryText = q || question;
    if (!queryText.trim()) return;

    if (!canQuery) {
      setShowLimitModal(true);
      return;
    }

    setIsLoading(true);
    setResult(null);

    const answer = await generatePolicyResponse(queryText, []);

    const response: SearchResult = {
      question: queryText,
      answer,
      sources: [
        "https://www.ugc.gov.in/pdfnews/3631340_UGC-Guidelines.pdf",
        "https://www.aicte-india.org/bureau/approval-process",
      ],
    };

    const isError =
      answer.startsWith("Error:") ||
      answer.startsWith("Could not reach") ||
      answer.startsWith("The request timed out");

    if (!isError) {
      const stored = JSON.parse(localStorage.getItem("docintel-history") || "[]");
      stored.unshift({
        id: Date.now().toString(),
        question: queryText,
        answer: response.answer,
        sources: response.sources,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("docintel-history", JSON.stringify(stored.slice(0, 50)));
      setShowConfetti(true);
    }

    if (!isAuthenticated) incrementGuestQuery();
    setResult(response);
    setIsLoading(false);
    setQuestion("");

    // Scroll to result smoothly
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-12 md:py-20 max-w-3xl page-enter">
      {showConfetti && <Confetti />}
      <GuestLimitModal open={showLimitModal} onClose={() => setShowLimitModal(false)} />

      {/* Header */}
      <div className="text-center mb-10">
        <p className="kicker-text mb-2">Search Policies</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary">
          Policy <span className="accent-italic">Intelligence</span>
        </h1>
        <p className="mt-3 text-muted-foreground font-sans text-sm">
          Ask about UGC, AICTE, or Ministry of Education policies in plain language.
          {!isAuthenticated && (
            <span className="block mt-1 text-accent font-medium">
              Guest mode — {Math.max(0, 3 - guestQueries)} queries remaining
            </span>
          )}
        </p>
      </div>

      {/* Input card */}
      <div className="search-card bg-card border rounded-xl p-6 shadow-sm">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., What are the UGC guidelines for autonomous colleges?"
          className="min-h-[110px] bg-background border-input font-body text-base resize-none transition-all duration-200 focus:shadow-inner"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAsk();
            }
          }}
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-muted-foreground font-sans">
            {question.length > 0 ? `${question.length} chars` : "Press Enter to send"}
          </span>
          <Button
            onClick={() => handleAsk()}
            disabled={isLoading || !question.trim()}
            className="bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans font-semibold gap-2 btn-lift"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Ask DocIntel
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Sample questions */}
      {!result && !isLoading && (
        <div className="mt-8">
          <p className="text-sm font-sans text-muted-foreground mb-3 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-accent" />
            Try a sample question
          </p>
          <div className="flex flex-col gap-2">
            {SAMPLE_QUESTIONS.map((sq, i) => (
              <button
                key={sq}
                onClick={() => { setQuestion(sq); handleAsk(sq); }}
                className="sample-q-item text-left px-5 py-3.5 border rounded-lg bg-background text-sm text-foreground font-sans"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className="text-accent font-bold mr-2">→</span>{sq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && <LoadingState />}

      {/* Answer */}
      {result && (
        <div ref={resultRef} className="mt-10 result-card bg-card border rounded-xl p-8 shadow-sm tilt-card">
          {/* Top accent gradient */}
          <div className="h-1.5 -mx-8 -mt-8 mb-6 rounded-t-xl bg-gradient-to-r from-primary via-accent to-gold" />
          
          {/* Question header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="kicker-text mb-1">Your Question</p>
              <p className="font-display text-lg font-semibold text-primary bounce-in">{result.question}</p>
            </div>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 p-2 rounded-md border border-border hover:bg-secondary transition-all duration-300 text-muted-foreground hover:text-primary hover:scale-110"
              title="Copy answer"
            >
              {copied ? <CheckCheck className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          <div className="accent-line" />

          <div>
            <p className="kicker-text mb-3">DocIntel Response</p>
            <div className="prose prose-sm max-w-none text-foreground font-body space-y-1">
              {result.answer.split("\n").map((line, i) => {
                if (line.includes("Summary:") || line.includes("Key Points:"))
                  return <h4 key={i} className="font-display font-semibold text-primary mt-4 mb-1">{line.replace(/[*]/g, "")}</h4>;
                if (line.match(/^\d+\./)) return <p key={i} className="ml-4 mb-1">{line}</p>;
                if (line.trim() === "") return <br key={i} />;
                return <p key={i} className="mb-1">{line}</p>;
              })}
            </div>
          </div>

          {/* Sources */}
          {result.sources.length > 0 && (
            <div className="mt-6 pt-5 border-t">
              <p className="kicker-text mb-3">Sources</p>
              <div className="space-y-2">
                {result.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors font-sans group"
                  >
                    <ExternalLink className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                    <span className="underline underline-offset-4">{src}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Ask another */}
          <div className="mt-6 pt-4 border-t text-right">
            <button
              onClick={() => { setResult(null); setQuestion(""); }}
              className="text-sm font-sans text-muted-foreground hover:text-primary transition-colors"
            >
              ← Ask another question
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
