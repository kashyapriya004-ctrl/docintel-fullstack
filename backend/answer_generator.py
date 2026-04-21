import os
from google import genai
from google.genai import types

EDUCATION_KEYWORDS = [
    # Education terms
    "education", "university", "college", "school", "policy", "academic", "degree", "course",
    "admission", "exam", "examination", "student", "faculty", "teacher", "professor",
    "research", "scholarship", "grant", "fellowship", "curriculum", "syllabus",
    
    # Regulatory bodies
    "ugc", "aicte", "mhrd", "ministry of education", "moe", "ncte", "nios",
    
    # Policies
    "nep", "nep 2020", "nep2020", "national education policy", "rte", "rti",
    
    # Exams
    "net", "set", "slet", "jrf", "srf", "cat", "mat", "jee", "neet", "gate",
    "clat", "xat", "snap", "cmat",
    
    # Institutions
    "iit", "iim", "nit", "iiit", "nit", "bits", ".bits pilani", "jnu", "du",
    "bhu", "jamia", "amu", "anna university", "vtu", "rtu",
    
    # Academic

    "phd", "postgraduate", "undergraduate", "diploma", "certificate", "bped", "med",
    "btech", "mtech", "bca", "mca", "bba", "mba", "mbbs", "bds",
    
    # Other education terms
    "ger", "nirf", "naac", "nba", "accreditation", "credit system", "grade", "cgpa",
    "semester", "trimester", "hostel", "library", "lab", "assignment", "project",
    "internship", "placement", "placement", "tpo", "career", "job", "salary",
    
    # Government schemes
    "swayam", "diksha", "pm evida", "national scholarship portal", "nsp", "pmay",
    "midday meal", "udise", "shagun", "dbt", "direct benefit transfer",
    
    # Specific topics
    "gross enrolment ratio", "ger", "dropout", "literacy", "alphabe", "numeracy", 
    "foundational literacy", "fln", "nipun bharat", "mission",
    "heci", "academic bank of credits", "abc", "multiple entry exit",
    "vocational education", "skill development", "maharatna", "navratna",
    "central university", "state university", "deemed university", "private university",
]

def is_education_related(query: str) -> bool:
    """Check if query is related to Indian education."""
    query_lower = query.lower()
    for keyword in EDUCATION_KEYWORDS:
        if keyword in query_lower:
            return True
    return False

def generate_answer(query: str, _unused_context: list[str]) -> str:
    """DocIntel AI - ChatGPT for Indian Education Policies."""
    
    # Check if education related
    if not is_education_related(query):
        return """I can only provide information relevant to Indian Education policies, guidelines, and regulations.

This includes:
• NEP 2020, UGC, AICTE, Ministry of Education
• University & College admissions, exams, policies
• Government education schemes
• Academic regulations and guidelines

Please ask your question related to Indian education system."""
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return "System Error: API key not configured."
    
    client = genai.Client(api_key=api_key)
    
    system_instruction = """You are DocIntel AI, an expert assistant for Indian Education Policies and Guidelines.

PERSONALITY:
- Helpful, conversational, like ChatGPT
- Knowledgeable about Indian education system
- Clear and concise responses

SCOPE:
- ONLY answer education-related questions about India
- Topics: NEP 2020, UGC, AICTE, universities, colleges, exams, scholarships, policies

If question is NOT about Indian education, politely redirect:
"I can only provide information relevant to Indian Education policies and guidelines."

RESPONSE STYLE:
- Use clean, simple language
- No markdown formatting
- Break into short paragraphs
- END with a helpful insight tip"""

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=f"Question: {query}",
            config=types.GenerateContentConfig(
                system_instruction=system_instruction
            )
        )
        return response.text
    except Exception as e:
        err = str(e)
        if "leaked" in err.lower() or "403" in err:
            return "API key error. Please contact admin."
        if "429" in err or "quota" in err.lower():
            return "Service is busy. Please retry in 30 seconds."
        return f"Error: {err[:80]}"