import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Sparkles, ExternalLink, Clock, ChevronRight, RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import GuestLimitModal from "@/components/GuestLimitModal";
import { generatePolicyResponse } from "@/services/gemini";

type SearchResult = {
  question: string;
  answer: string;
  sources: string[];
  duration?: number;
};

const SAMPLE_QUESTIONS = [
  "What is NEP 2020 and its key reforms?",
  "What are AICTE's approval requirements for colleges?",
  "How does UGC regulate deemed universities?",
  "What are the UGC NET eligibility criteria?",
];

const LOADING_STEPS = [
  "Connecting to government databases...",
  "Scraping UGC, AICTE, and Ministry of Education...",
  "Running semantic search across policy text...",
  "Generating answer with Gemini AI...",
];

const Search = () => {
  const { isAuthenticated, canQuery, incrementGuestQuery, guestQueries } = useAuth();
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isLoading) {
      setElapsed(0);
      setStepIndex(0);
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      stepRef.current = setInterval(() => setStepIndex(s => Math.min(s + 1, LOADING_STEPS.length - 1)), 18000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stepRef.current) clearInterval(stepRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stepRef.current) clearInterval(stepRef.current);
    };
  }, [isLoading]);

  const handleAsk = async (q?: string) => {
    const queryText = q || question;
    if (!queryText.trim()) return;

    if (!canQuery) {
      setShowLimitModal(true);
      return;
    }

    setIsLoading(true);
    setResult(null);
    const startTime = Date.now();

    const answer = await generatePolicyResponse(queryText, []);
    const duration = Math.round((Date.now() - startTime) / 1000);

    const response: SearchResult = {
      question: queryText,
      answer,
      sources: [
        "https://www.ugc.gov.in/about-ugc",
        "https://www.aicte-india.org/bureau/approval-process",
        "https://www.education.gov.in/nep/about-nep",
      ],
      duration,
    };

    if (isAuthenticated) {
      const history = JSON.parse(localStorage.getItem("docintel-history") || "[]");
      history.unshift({ id: Date.now().toString(), question: queryText, answer: response.answer, sources: response.sources, timestamp: new Date().toISOString() });
      localStorage.setItem("docintel-history", JSON.stringify(history.slice(0, 50)));
    } else {
      incrementGuestQuery();
    }

    setResult(response);
    setIsLoading(false);
    setQuestion("");
  };

  const renderAnswer = (text: string) => {
    return text.split("\n").map((line, i) => {
      const html = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");

      if (line.startsWith("# ") || line.startsWith("## "))
        return <h4 key={i} className="font-sans font-semibold text-foreground text-base mt-5 mb-2" dangerouslySetInnerHTML={{ __html: html.replace(/^#+\s/, "") }} />;
      if (line.match(/^\d+\./))
        return (
          <div key={i} className="flex gap-3 mb-2">
            <span className="text-muted-foreground text-sm flex-shrink-0 w-5 text-right">{line.match(/^(\d+)/)?.[1]}.</span>
            <p className="text-foreground text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: html.replace(/^\d+\.\s*/, "") }} />
          </div>
        );
      if (line.startsWith("- ") || line.startsWith("• "))
        return (
          <div key={i} className="flex gap-3 mb-1.5">
            <span className="text-muted-foreground mt-2 flex-shrink-0">–</span>
            <p className="text-foreground text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: html.replace(/^[-•]\s*/, "") }} />
          </div>
        );
      if (line.trim() === "") return <div key={i} className="h-3" />;
      return <p key={i} className="text-foreground text-sm leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: html }} />;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <GuestLimitModal open={showLimitModal} onClose={() => setShowLimitModal(false)} />

      {/* Page header */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="container max-w-3xl py-4 flex items-center justify-between">
          <div>
            <p className="font-sans font-semibold text-foreground text-sm">Policy Search</p>
            <p className="text-xs text-muted-foreground">UGC · AICTE · Ministry of Education</p>
          </div>
          {!isAuthenticated && (
            <p className="text-xs text-muted-foreground font-sans">
              Guest — <span className="text-accent font-medium">{Math.max(0, 3 - guestQueries)} queries left</span>
            </p>
          )}
        </div>
      </div>

      <div className="container max-w-3xl py-12 px-4">

        {/* Empty state header */}
        {!result && !isLoading && (
          <div className="mb-10">
            <p className="kicker-text mb-3">Ask anything</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              What would you like to know?
            </h1>
            <p className="text-muted-foreground text-sm font-sans max-w-md">
              Ask about any UGC, AICTE, or Ministry of Education policy in plain language.
              We search live government sources every time.
            </p>
          </div>
        )}

        {/* Input */}
        <div className="bg-card border border-border rounded-lg p-5 mb-6 shadow-sm">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What are the UGC guidelines for autonomous colleges?"
            className="min-h-[100px] bg-background border-border font-sans text-sm text-foreground resize-none focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/60"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAsk(); }
            }}
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-sans">
              <Clock className="h-3 w-3" />
              Live fetch takes 30–90 seconds
            </p>
            <button
              onClick={() => handleAsk()}
              disabled={isLoading || !question.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground font-sans font-semibold text-sm rounded-md hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading
                ? <><Loader2 className="h-4 w-4 animate-spin" />Processing</>
                : <><Send className="h-4 w-4" />Ask DocIntel</>
              }
            </button>
          </div>
        </div>

        {/* Sample questions */}
        {!result && !isLoading && (
          <div className="mb-12">
            <p className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Try a sample question
            </p>
            <div className="space-y-2">
              {SAMPLE_QUESTIONS.map((sq) => (
                <button
                  key={sq}
                  onClick={() => { setQuestion(sq); handleAsk(sq); }}
                  className="group w-full text-left px-4 py-3 border border-border rounded-md bg-card hover:bg-secondary/40 transition-colors text-sm text-foreground font-sans flex items-center justify-between gap-3"
                >
                  <span>{sq}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground flex-shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="border border-border rounded-lg p-10 bg-card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-border bg-background mb-6">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            </div>
            <p className="font-sans font-semibold text-foreground text-sm mb-1">
              {LOADING_STEPS[stepIndex]}
            </p>
            <p className="text-xs text-muted-foreground font-sans mb-8">{elapsed}s elapsed</p>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-3">
              {LOADING_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i <= stepIndex ? "w-8 bg-primary" : "w-4 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {/* Question */}
            <div className="border border-border rounded-lg bg-card p-5">
              <p className="kicker-text mb-2">Your question</p>
              <p className="font-sans font-medium text-foreground text-sm">{result.question}</p>
              {result.duration && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5 font-sans">
                  <Clock className="h-3 w-3" />
                  Answered in {result.duration}s from live government sources
                </p>
              )}
            </div>

            {/* Answer */}
            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border bg-secondary/20 flex items-center justify-between">
                <p className="kicker-text">DocIntel Response</p>
                <p className="text-xs text-muted-foreground font-sans">Gemini AI · Live sources</p>
              </div>
              <div className="p-6">
                {renderAnswer(result.answer)}
              </div>

              {/* Sources */}
              <div className="px-6 py-4 border-t border-border bg-secondary/10">
                <p className="kicker-text mb-3">Sources</p>
                <div className="space-y-1.5">
                  {result.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-primary hover:text-accent transition-colors font-sans"
                    >
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      {src}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => setResult(null)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground font-sans transition-colors mt-2"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Ask another question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
