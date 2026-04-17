import os
import time
from google import genai
from google.genai import types

def generate_answer(query: str, _unused_context: list[str]) -> str:
    """
    DocIntel Expert Knowledge Engine.
    Operates in Pure Knowledge mode (no slow scraping) for 100% reliability.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return "System Configuration Error: API Key missing."

    client = genai.Client(api_key=api_key)
    
    system_instruction = """You are DocIntel AI, the authoritative expert for Indian Education Policies and Institutional Guidelines.
You are specialized in the National Education Policy (NEP) 2020, UGC guidelines, AICTE regulations, and Ministry of Education (MoE) initiatives.

STRICT INSTRUCTIONS:
1. Provide comprehensive, factual, and latest information about Indian education only.
2. Maintain a scholarly, direct, and authoritative tone.
3. NEVER mention that you are an AI or that you have limitations in "context".
4. If a query is NOT about Indian education (e.g., medical advice, global politics), politely but firmly state that you specialize only in Indian education policies.
5. Use clear paragraphs and bullet points (•) for readability.
6. Provide specific dates, percentage targets, and institutional names (e.g., GER targets for 2035, NIPUN Bharat, Academic Bank of Credits).
7. END your response with a brief italicized insight titled "*Educational Foresight*".
"""

    prompt = f"Provide a detailed expert response to the following query regarding Indian education policy: {query}"

    models = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-flash-latest']
    
    for model_name in models:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction
                )
            )
            ans = response.text
            
            refusal_check = ["cannot answer", "do not have", "no information", "not possible", "unable to provide"]
            if any(phrase in ans.lower() for phrase in refusal_check):
                res = client.models.generate_content(
                    model=model_name,
                    contents=f"GIVE FACTS ONLY: {query}. Do not apologize.",
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction
                    )
                )
                return res.text
            
            return ans
            
        except Exception as e:
            err = str(e)
            if '429' in err or 'quota' in err.lower() or '503' in err:
                time.sleep(1)
                continue
            return f"Service Error: {err}"

    return "All AI reasoning pipelines are currently congested. Please retry your query in 30 seconds."