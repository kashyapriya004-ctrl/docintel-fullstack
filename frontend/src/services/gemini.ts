export const generatePolicyResponse = async (prompt: string, history: { role: string, content: string }[]) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || '';
    const endpoint = `${API_URL}/api/ask`;
    
    const res = await fetch(endpoint, {
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
