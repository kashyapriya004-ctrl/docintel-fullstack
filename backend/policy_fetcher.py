import asyncio
import httpx
import json
import os
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import logging

# Setup basic logging for the fetcher
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("policy_fetcher")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

OFFICIAL_SOURCES = {
    "UGC": "https://www.ugc.gov.in/",
    "AICTE": "https://www.aicte-india.org/",
    "MOE": "https://www.education.gov.in/"
}

MAX_PAGES_PER_SITE = 5
TIMEOUT = 30.0  # Seconds per request

class PolicyCrawler:
    def __init__(self, max_pages=MAX_PAGES_PER_SITE):
        self.max_pages = max_pages
        self.visited = set()
        self.client = httpx.AsyncClient(headers=HEADERS, timeout=TIMEOUT, follow_redirects=True)

    async def close(self):
        await self.client.aclose()

    def clean_text(self, text):
        """
        Cleans extracted text by removing common clutter and short segments.
        """
        lines = text.split("\n")
        clean_lines = []
        
        blacklist_keywords = [
            "Follow Us", "Twitter", "Facebook", "Instagram",
            "LinkedIn", "Skip to", "Screen Reader",
            "Text Size", "Contact Us", "Copyright", "All Rights Reserved"
        ]

        for line in lines:
            line = line.strip()
            # Filter out very short lines or lines containing navigation clutter
            if len(line) < 50:
                continue
            if any(word.lower() in line.lower() for word in blacklist_keywords):
                continue
            clean_lines.append(line)

        return "\n".join(clean_lines)

    async def fetch_html(self, url):
        try:
            logger.info(f"Fetching: {url}")
            # Use a HEAD request first to check the content type (optional optimization)
            # or just check the response headers after the GET.
            response = await self.client.get(url)
            response.raise_for_status()
            
            # Check if content is HTML
            content_type = response.headers.get("Content-Type", "").lower()
            if "text/html" not in content_type:
                logger.info(f"Skipping non-HTML content: {url} ({content_type})")
                return ""
                
            return response.text
        except Exception as e:
            logger.error(f"Failed to fetch {url}: {e}")
            return ""

    def extract_internal_links(self, base_url, soup):
        links = set()
        domain = urlparse(base_url).netloc
        
        # Extensions to skip to save bandwidth and time
        SKIP_EXTENSIONS = {
            ".pdf", ".jpg", ".jpeg", ".png", ".gif", ".svg", ".zip", 
            ".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt", ".mp4"
        }

        for a in soup.find_all("a", href=True):
            full_url = urljoin(base_url, a["href"])
            parsed = urlparse(full_url)
            
            # Basic sanity checks
            if parsed.netloc == domain and parsed.scheme in ["http", "https"]:
                # Extension check
                path = parsed.path.lower()
                if any(path.endswith(ext) for ext in SKIP_EXTENSIONS):
                    continue
                    
                # Strip fragments
                clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
                links.add(clean_url)

        return list(links)

    async def crawl_site(self, name, base_url):
        visited_in_site = set()
        to_visit = [base_url]
        collected_data = []

        while to_visit and len(visited_in_site) < self.max_pages:
            url = to_visit.pop(0)

            if url in self.visited or url in visited_in_site:
                continue

            html = await self.fetch_html(url)
            if not html:
                continue

            soup = BeautifulSoup(html, "lxml")

            # Remove non-content tags
            for tag in soup(["script", "style", "noscript", "header", "footer", "nav"]):
                tag.decompose()

            text = soup.get_text(separator="\n")
            cleaned = self.clean_text(text)
            
            if cleaned:
                collected_data.append({
                    "url": url,
                    "content": cleaned
                })

            visited_in_site.add(url)
            self.visited.add(url)

            new_links = self.extract_internal_links(base_url, soup)
            for link in new_links:
                if link not in self.visited and link not in visited_in_site:
                    to_visit.append(link)

        return collected_data

async def fetch_and_save_all_policies():
    crawler = PolicyCrawler()
    all_data = {}
    
    try:
        for name, url in OFFICIAL_SOURCES.items():
            logger.info(f"Starting crawl for {name}...")
            site_data = await crawler.crawl_site(name, url)
            all_data[name] = site_data

        # Save to data directory
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        data_dir = os.path.join(base_dir, "data")
        os.makedirs(data_dir, exist_ok=True)
        
        output_path = os.path.join(data_dir, "crawled_policies.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(all_data, f, indent=4, ensure_ascii=False)
            
        logger.info(f"Crawl complete. Data saved to {output_path}")
        return all_data

    finally:
        await crawler.close()

if __name__ == "__main__":
    # Quick test run
    asyncio.run(fetch_and_save_all_policies())
