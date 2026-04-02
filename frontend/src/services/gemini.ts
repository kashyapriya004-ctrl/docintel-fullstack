// Azure backend URL — called DIRECTLY to avoid Vercel's 30-second proxy timeout
// (Vercel rewrites have a 30s max; scraping + embeddings + AI takes ~60-90s)
const AZURE_BACKEND = "https://docintel-backend-2026-e6hmfbgyhxg3ewfq.southeastasia-01.azurewebsites.net";

export const generatePolicyResponse = async (prompt: string, history: { role: string, content: string }[]) => {
  try {
    const res = await fetch(`${AZURE_BACKEND}/api/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: prompt, user_id: 1 })
    });
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
      throw new Error(err.detail || `API error: ${res.status}`);
    }
    
    const data = await res.json();
    return data.answer || "No response generated.";
  } catch (error) {
    console.error("Error generating policy response:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return `Error: ${msg}. Please try again.`;
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

