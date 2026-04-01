export const generatePolicyResponse = async (prompt: string, history: { role: string, content: string }[]) => {
  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: prompt, user_id: 1 })
    });
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    return data.answer || "No response generated.";
  } catch (error) {
    console.error("Error generating policy response:", error);
    return "I apologize, but I am unable to connect to the policy database at the moment. Please try again later.";
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

