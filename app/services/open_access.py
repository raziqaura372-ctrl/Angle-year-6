import requests
import xml.etree.ElementTree as ET
import logging
from typing import List, Dict, Any
from app.config import settings

logger = logging.getLogger(__name__)

def search_crossref(query: str, num_results: int = 3) -> List[Dict[str, Any]]:
    if not settings.ENABLE_CROSSREF or not query.strip():
        return []
    url = "https://api.crossref.org/works"
    params = {"query": query, "rows": num_results}
    headers = {"User-Agent": "VeriDraftPlagiarismChecker/1.0 (mailto:admin@veridraft.edu)"}
    try:
        resp = requests.get(url, params=params, headers=headers, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            items = data.get("message", {}).get("items", [])
            results = []
            for item in items:
                title = item.get("title", ["Untitled"])[0] if item.get("title") else "Untitled"
                link = item.get("URL", "")
                authors = ", ".join([f"{a.get('given', '')} {a.get('family', '')}".strip() for a in item.get("author", [])])
                abstract = item.get("abstract", "")
                results.append({
                    "title": title,
                    "url": link,
                    "author": authors or "Unknown",
                    "snippet": abstract[:300] if abstract else title,
                    "source_type": "open_access_crossref"
                })
            return results
    except Exception as e:
        logger.warning(f"Crossref search failed: {e}")
    return []

def search_arxiv(query: str, num_results: int = 3) -> List[Dict[str, Any]]:
    if not settings.ENABLE_ARXIV or not query.strip():
        return []
    url = "http://export.arxiv.org/api/query"
    params = {"search_query": f"all:{query}", "max_results": num_results}
    try:
        resp = requests.get(url, params=params, timeout=5)
        if resp.status_code == 200:
            root = ET.fromstring(resp.text)
            ns = {"atom": "http://www.w3.org/2005/Atom"}
            results = []
            for entry in root.findall("atom:entry", ns):
                title = entry.find("atom:title", ns).text.strip() if entry.find("atom:title", ns) is not None else "Untitled"
                link = entry.find("atom:id", ns).text.strip() if entry.find("atom:id", ns) is not None else ""
                summary = entry.find("atom:summary", ns).text.strip() if entry.find("atom:summary", ns) is not None else ""
                results.append({
                    "title": title,
                    "url": link,
                    "author": "arXiv Contributor",
                    "snippet": summary[:300],
                    "source_type": "open_access_arxiv"
                })
            return results
    except Exception as e:
        logger.warning(f"arXiv search failed: {e}")
    return []

def search_wikipedia(query: str, num_results: int = 3) -> List[Dict[str, Any]]:
    if not settings.ENABLE_WIKIPEDIA or not query.strip():
        return []
    url = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "format": "json",
        "srlimit": num_results
    }
    try:
        resp = requests.get(url, params=params, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            search_items = data.get("query", {}).get("search", [])
            results = []
            for item in search_items:
                title = item.get("title", "")
                snippet = item.get("snippet", "").replace('<span class="searchmatch">', '').replace('</span>', '')
                page_url = f"https://en.wikipedia.org/wiki/{title.replace(' ', '_')}"
                results.append({
                    "title": f"Wikipedia: {title}",
                    "url": page_url,
                    "author": "Wikipedia Editors",
                    "snippet": snippet,
                    "source_type": "open_access_wikipedia"
                })
            return results
    except Exception as e:
        logger.warning(f"Wikipedia search failed: {e}")
    return []
