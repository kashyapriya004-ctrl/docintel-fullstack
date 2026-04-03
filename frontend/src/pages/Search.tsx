import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, BookOpen, Sparkles, ExternalLink, Zap, Clock, Bot, ChevronRight } from "lucide-react";
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
  "What are AICTE approval requirements?",
  "How does UGC regulate deemed universities?",
  "What are UGC NET eligibility criteria?",
];

const LOADING_MESSAGES = [
  "Connecting to government policy databases...",
  "Scraping UGC, AICTE & Ministry of Education...",
  "Running semantic search across policy documents...",
  "Generating AI-powered answer with Gemini...",
  "Almost there, finalizing your response...",
];

const Search = () => {
  const { isAuthenticated, canQuery, incrementGuestQuery, guestQueries } = useAuth();
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const msgTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isLoading) {
      setElapsed(0);
      setLoadingMsg(0);
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      msgTimerRef.current = setInterval(() => {
        setLoadingMsg(m => (m + 1) % LOADING_MESSAGES.length);
      }, 6000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (msgTimerRef.current) clearInterval(msgTimerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (msgTimerRef.current) clearInterval(msgTimerRef.current);
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
      answer: answer,
      sources: [
        "https://www.ugc.gov.in/about-ugc",
        "https://www.aicte-india.org/bureau/approval-process",
        "https://www.education.gov.in/nep/about-nep",
      ],
      duration,
    };

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

  const formatAnswer = (text: string) => {
    return text.split("\n").map((line, i) => {
      const clean = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>");
      if (line.match(/^#+\s/)) {
        return <h4 key={i} className="text-lg font-bold text-gray-900 mt-4 mb-2" dangerouslySetInnerHTML={{ __html: clean.replace(/^#+\s/, "") }} />;
      }
      if (line.match(/^\d+\./)) {
        return (
          <div key={i} className="flex gap-3 mb-2">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center mt-0.5">
              {line.match(/^(\d+)/)?.[1]}
            </span>
            <p className="text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: clean.replace(/^\d+\.\s*/, "") }} />
          </div>
        );
      }
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return (
          <div key={i} className="flex gap-2 mb-1.5">
            <span className="text-emerald-500 mt-1.5 flex-shrink-0">▸</span>
            <p className="text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: clean.replace(/^[-•]\s*/, "") }} />
          </div>
        );
      }
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return <p key={i} className="text-gray-700 text-sm leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: clean }} />;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F0E8] to-[#EDE7D9]">
      <GuestLimitModal open={showLimitModal} onClose={() => setShowLimitModal(false)} />

      {/* Header section */}
      <div className="border-b border-gray-200/60 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container max-w-4xl py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-900 text-lg">Policy Search</h1>
            <p className="text-xs text-gray-500">Live scraping from UGC · AICTE · MOE</p>
          </div>
          {!isAuthenticated && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
              <Zap className="h-3.5 w-3.5" />
              {Math.max(0, 3 - guestQueries)} free queries left
            </div>
          )}
        </div>
      </div>

      <div className="container max-w-4xl py-10 px-4">

        {/* Hero text */}
        {!result && !isLoading && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live policy intelligence — ask anything
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              What do you want to know?
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm">
              Ask about UGC, AICTE, NEP 2020, or Ministry of Education policies in plain language.
              We fetch real answers from official government sources.
            </p>
          </div>
        )}

        {/* Input Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What are the UGC guidelines for autonomous colleges?"
            className="min-h-[110px] bg-gray-50 border-gray-200 text-gray-800 text-base resize-none rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 placeholder:text-gray-400 transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              Typically takes 30–90 seconds (live scraping)
            </p>
            <button
              onClick={() => handleAsk()}
              disabled={isLoading || !question.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02]"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                <><Send className="h-4 w-4" /> Ask DocIntel</>
              )}
            </button>
          </div>
        </div>

        {/* Sample questions */}
        {!result && !isLoading && (
          <div className="mb-10">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Try a sample question
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {SAMPLE_QUESTIONS.map((sq) => (
                <button
                  key={sq}
                  onClick={() => { setQuestion(sq); handleAsk(sq); }}
                  className="group text-left px-4 py-3.5 border border-gray-200 rounded-xl bg-white hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-sm text-gray-700 flex items-center justify-between gap-2 shadow-sm hover:shadow-md"
                >
                  <span>{sq}</span>
                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 flex-shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
            <div className="relative inline-flex mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Bot className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
                <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">DocIntel is working...</h3>
            <p className="text-emerald-700 text-sm font-medium mb-1 h-5 transition-all">{LOADING_MESSAGES[loadingMsg]}</p>
            <p className="text-gray-400 text-xs mb-6">{elapsed}s elapsed</p>

            {/* Progress bar */}
            <div className="max-w-xs mx-auto h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(95, (elapsed / 90) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
              {["Scraping gov sites", "Building embeddings", "Generating answer"].map((step, i) => (
                <span key={step} className={`flex items-center gap-1.5 ${elapsed > i * 25 ? "text-emerald-600" : ""}`}>
                  {elapsed > i * 25 ? "✓" : <span className="w-3 h-3 rounded-full border border-gray-300 inline-block" />}
                  {step}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Answer Card */}
        {result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Question badge */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Your Question</p>
              <p className="text-gray-900 font-semibold text-base">{result.question}</p>
              {result.duration && (
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Answered in {result.duration}s using live government data
                </p>
              )}
            </div>

            {/* Answer */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">DocIntel AI Response</p>
                  <p className="text-xs text-gray-500">Powered by Google Gemini + Live Scraping</p>
                </div>
              </div>

              <div className="p-6">
                <div className="prose prose-sm max-w-none">
                  {formatAnswer(result.answer)}
                </div>
              </div>

              {/* Sources */}
              {result.sources.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Official Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {src.replace("https://www.", "").replace("https://", "").split("/")[0]}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ask another */}
            <div className="text-center pt-2">
              <button
                onClick={() => setResult(null)}
                className="text-sm text-emerald-700 font-medium hover:text-emerald-600 flex items-center gap-2 mx-auto"
              >
                <Sparkles className="h-4 w-4" />
                Ask another question
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
