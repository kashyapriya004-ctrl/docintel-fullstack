// Azure backend URL — called DIRECTLY to avoid Vercel's 30-second proxy timeout
// (Vercel rewrites have a 30s max; scraping + embeddings + AI takes ~60-90s)
const AZURE_BACKEND = import.meta.env.VITE_BACKEND_URL ||
  "https://docintel-backend-2026-e6hmfbgyhxg3ewfq.southeastasia-01.azurewebsites.net";

export const generatePolicyResponse = async (prompt: string, _history: { role: string, content: string }[]) => {
  const controller = new AbortController();
  // 120 second timeout to allow for cold start + scraping + AI generation
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const res = await fetch(`${AZURE_BACKEND}/api/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: prompt, user_id: 1 }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
      throw new Error(err.detail || `API error: ${res.status}`);
    }

    const data = await res.json();
    return data.answer || "No response generated.";
  } catch (error: unknown) {
    console.error("Error generating policy response:", error);
    if (error instanceof DOMException && error.name === "AbortError") {
      return "The request timed out after 2 minutes. The backend may be starting up — please try again in a few seconds.";
    }
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return "Could not reach the DocIntel backend. The server may be starting up (cold start can take ~30s). Please wait a moment and try again.";
    }
    const msg = error instanceof Error ? error.message : String(error);
    return `Error: ${msg}. Please try again.`;
  } finally {
    clearTimeout(timeout);
  }
};



export const fetchHistory = async (user_id: number = 1) => {
  try {
    const res = await fetch(`/api/history?user_id=${user_id}`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return await res.json();
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
};

export const deleteHistory = async (history_id: number, user_id: number = 1) => {
  try {
    const res = await fetch(`/api/history/${history_id}?user_id=${user_id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete history');
    return await res.json();
  } catch (error) {
    console.error("Error deleting history item:", error);
    throw error;
  }
};

