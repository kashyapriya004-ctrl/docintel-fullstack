import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, BookOpen, Sparkles, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import GuestLimitModal from "@/components/GuestLimitModal";
import { generatePolicyResponse } from "@/services/gemini";

type SearchResult = {
  question: string;
  answer: string;
  sources: string[];
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
      answer: answer,
      sources: [
        "https://www.ugc.gov.in/pdfnews/3631340_UGC-Guidelines.pdf",
        "https://www.aicte-india.org/bureau/approval-process",
      ],
    };

    // Save to history only if authenticated
    if (isAuthenticated) {
      const history = JSON.parse(localStorage.getItem("docintel-history") || "[]");
      history.unshift({
        id: Date.now().toString(),
        question: queryText,
        answer: response.answer,
        sources: response.sources,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("docintel-history", JSON.stringify(history.slice(0, 50)));
    } else {
      incrementGuestQuery();
    }

    setResult(response);
    setIsLoading(false);
    setQuestion("");
  };

  return (
    <div className="container py-12 md:py-20 max-w-3xl">
      <GuestLimitModal open={showLimitModal} onClose={() => setShowLimitModal(false)} />

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

      {/* Input */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., What are the UGC guidelines for autonomous colleges?"
          className="min-h-[100px] bg-background border-input font-body text-base resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAsk();
            }
          }}
        />
        <div className="flex justify-end mt-4">
          <Button
            onClick={() => handleAsk()}
            disabled={isLoading || !question.trim()}
            className="bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans font-semibold gap-2"
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
            <Sparkles className="h-4 w-4 text-gold" />
            Try a sample question
          </p>
          <div className="flex flex-col gap-2">
            {SAMPLE_QUESTIONS.map((sq) => (
              <button
                key={sq}
                onClick={() => { setQuestion(sq); handleAsk(sq); }}
                className="text-left px-4 py-3 border rounded-md bg-background hover:bg-secondary transition-colors text-sm text-foreground font-sans"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="mt-10 flex flex-col items-center gap-3 animate-pulse-gentle">
          <BookOpen className="h-10 w-10 text-accent" />
          <p className="text-muted-foreground font-sans text-sm">Searching policy documents...</p>
        </div>
      )}

      {/* Answer */}
      {result && (
        <div className="mt-10 bg-card border rounded-lg p-8 animate-fade-in-up">
          <p className="kicker-text mb-2">Your Question</p>
          <p className="font-display text-lg font-semibold text-primary mb-6">{result.question}</p>
          <div className="border-t pt-6">
            <p className="kicker-text mb-3">DocIntel Response</p>
            <div className="prose prose-sm max-w-none text-foreground font-body space-y-1">
              {result.answer.split("\n").map((line, i) => {
                if (line.includes("Summary:") || line.includes("Key Points:")) {
                  return <h4 key={i} className="font-display font-semibold text-primary mt-4 mb-1">{line.replace(/[*]/g, "")}</h4>;
                }
                if (line.match(/^\d+\./)) return <p key={i} className="ml-4 mb-1">{line}</p>;
                if (line.trim() === "") return <br key={i} />;
                return <p key={i} className="mb-1">{line}</p>;
              })}
            </div>

            {/* Sources */}
            {result.sources.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <p className="kicker-text mb-2">Sources</p>
                <div className="space-y-2">
                  {result.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors font-sans"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {src}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
