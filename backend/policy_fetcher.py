import requests
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# Specific known policy pages — fetched in parallel, not crawled
# Prioritise pages with actual policy text, not navigation/admin pages
POLICY_URLS = {
    "NEP_2020_About":     "https://www.education.gov.in/nep/about-nep",
    "NEP_2020_Highlights":"https://www.education.gov.in/hi/nep2020",
    "MOE_Schemes":        "https://www.education.gov.in/school-education",
    "UGC_About":          "https://www.ugc.gov.in/about-ugc",
    "UGC_Functions":      "https://www.ugc.gov.in/functions",
    "UGC_NET":            "https://www.ugc.gov.in/ugcnet",
    "AICTE_About":        "https://www.aicte-india.org/about/aicte",
    "AICTE_Approval":     "https://www.aicte-india.org/bureau/approval-process",
    "AICTE_Functions":    "https://www.aicte-india.org/about/functions",
}

TIMEOUT_PER_URL = 8  # seconds — strict per-URL timeout


def clean_text(text: str) -> str:
    blacklist = [
        "Follow Us", "Twitter", "Facebook", "Instagram",
        "LinkedIn", "Skip to", "Screen Reader", "Text Size",
        "Contact Us", "Cookie", "JavaScript", "©"
    ]
    lines = text.split("\n")
    clean = []
    for line in lines:
        line = line.strip()
        if len(line) < 40:
            continue
        if any(word in line for word in blacklist):
            continue
        clean.append(line)
    return "\n".join(clean[:200])  # Max 200 lines per page


def fetch_single_url(name: str, url: str) -> tuple[str, str]:
    """Fetch a single URL and return (name, cleaned_text). Never raises."""
    try:
        if url.endswith(".pdf"):
            # Skip PDFs — can't parse them without extra libs
            return name, ""
        response = requests.get(url, headers=HEADERS, timeout=TIMEOUT_PER_URL)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "lxml")
        for tag in soup(["script", "style", "noscript", "nav", "footer", "header"]):
            tag.decompose()
        text = soup.get_text(separator="\n")
        return name, clean_text(text)
    except Exception as e:
        print(f"[policy_fetcher] Failed to fetch {name} ({url}): {e}")
        return name, ""


def fetch_all_policies() -> dict:
    """
    Fetch all policy pages IN PARALLEL with strict timeouts.
    Total time: ~8-10 seconds max (not 3 minutes like sequential crawling).
    """
    results = {}

    with ThreadPoolExecutor(max_workers=len(POLICY_URLS)) as executor:
        futures = {
            executor.submit(fetch_single_url, name, url): name
            for name, url in POLICY_URLS.items()
        }
        for future in as_completed(futures, timeout=10):
            try:
                name, text = future.result()
                if text:
                    results[name] = text
                    print(f"[policy_fetcher] ✓ {name}: {len(text)} chars")
            except Exception as e:
                print(f"[policy_fetcher] Future error: {e}")

    if not results:
        # Fallback if ALL scrapes fail (e.g., network blocked on Azure)
        print("[policy_fetcher] All scrapes failed — using fallback corpus")
        results["fallback"] = """
National Education Policy 2020 (NEP 2020): Approved by Union Cabinet of India on 29 July 2020.
Replaces 1986 policy. Introduces 5+3+3+4 curricular structure. Emphasizes mother tongue instruction
till Grade 5. Coding from Grade 6. Vocational education from Grade 6. 4-year multidisciplinary
undergraduate programs with multiple exit options (certificate 1yr, diploma 2yr, degree 3yr,
research 4yr). Targets 100% GER in school by 2030, 50% GER in higher education by 2035.
UGC (University Grants Commission): Statutory body under UGC Act 1956. Funds and regulates
universities. UGC NET determines eligibility for assistant professor posts and JRF.
AICTE (All India Council for Technical Education): Regulates technical education. Approval
mandatory for engineering, management, pharmacy, architecture programs. Process involves
application on AICTE portal, infrastructure verification, expert inspection, and intake approval.
Ministry of Education: Runs Samagra Shiksha, PM POSHAN, DIKSHA, NIPUN Bharat, SWAYAM,
SWAYAM PRABHA, NIRF, PM e-VIDYA. Implements NEP 2020 across all states.
RTE Act 2009 mandates free education for children aged 6-14.
        """

    return results
