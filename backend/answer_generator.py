import os
from google import genai

def generate_answer(query: str, context_results: list[str]) -> str:
    """Uses Gemini to generate an answer based strictly on the retrieved context."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return "Error: GEMINI_API_KEY environment variable is missing."

    client = genai.Client(api_key=api_key)
    
    context_text = "\n\n".join(context_results)
    
    prompt = f"""
You are DocIntel AI, an expert specialized in Indian Education Policies and Digital Jurisprudence.
Your task is to generate a comprehensive, accurate response based ONLY on the provided context below.

USER QUERY:
{query}

CONTEXT:
{context_text}

INSTRUCTIONS:
1. Use a structured, academic format with numbered points if applicable.
2. Provide precise insights. Do NOT invent or hallucinate policies.
3. If the context does not contain the answer, state: "Based on the retrieved policy documents, I cannot provide an answer."
4. Include a "Scholarly Marginalia" (a brief, italicized insight or cross-reference) at the end of your response.
"""
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text
    except Exception as e:
        return f"Error generating answer: {str(e)}"
