const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const generatePolicyResponse = async (prompt: string, _history: { role: string; content: string }[]) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const res = await fetch(`${BACKEND_URL}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      return "The request timed out after 2 minutes. The backend may be starting up — please try again.";
    }
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return "Could not reach the DocIntel backend. Please make sure the backend server is running on port 8000.";
    }
    const msg = error instanceof Error ? error.message : String(error);
    return `Error: ${msg}. Please try again.`;
  } finally {
    clearTimeout(timeout);
  }
};

export const fetchHistory = async (user_id: number = 1) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/history?user_id=${user_id}`);
    if (!res.ok) throw new Error("Failed to fetch history");
    return await res.json();
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
};

export const deleteHistory = async (history_id: number, user_id: number = 1) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/history/${history_id}?user_id=${user_id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete history");
    return await res.json();
  } catch (error) {
    console.error("Error deleting history item:", error);
    throw error;
  }
};
