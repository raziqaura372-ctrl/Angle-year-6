import requests
import logging
from typing import List, Dict, Any, Optional, Tuple
from app.config import settings

logger = logging.getLogger(__name__)

class WebSearchAdapter:
    def search(self, query: str, num_results: int = 5) -> List[Dict[str, Any]]:
        raise NotImplementedError

class GoogleSearchAdapter(WebSearchAdapter):
    def __init__(self, api_key: str, cse_id: str):
        self.api_key = api_key
        self.cse_id = cse_id

    def search(self, query: str, num_results: int = 5) -> List[Dict[str, Any]]:
        if not self.api_key or not self.cse_id:
            return []
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            "key": self.api_key,
            "cx": self.cse_id,
            "q": query,
            "num": min(num_results, 10)
        }
        try:
            resp = requests.get(url, params=params, timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                results = []
                for item in data.get("items", []):
                    results.append({
                        "title": item.get("title"),
                        "url": item.get("link"),
                        "snippet": item.get("snippet", ""),
                        "source_type": "web"
                    })
                return results
        except Exception as e:
            logger.warning(f"Google search request failed: {e}")
        return []

class BingSearchAdapter(WebSearchAdapter):
    def __init__(self, api_key: str):
        self.api_key = api_key

    def search(self, query: str, num_results: int = 5) -> List[Dict[str, Any]]:
        if not self.api_key:
            return []
        url = "https://api.bing.microsoft.com/v7.0/search"
        headers = {"Ocp-Apim-Subscription-Key": self.api_key}
        params = {"q": query, "count": num_results}
        try:
            resp = requests.get(url, headers=headers, params=params, timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                results = []
                for item in data.get("webPages", {}).get("value", []):
                    results.append({
                        "title": item.get("name"),
                        "url": item.get("url"),
                        "snippet": item.get("snippet", ""),
                        "source_type": "web"
                    })
                return results
        except Exception as e:
            logger.warning(f"Bing search request failed: {e}")
        return []

def query_web_sources(query_text: str) -> Tuple[List[Dict[str, Any]], str]:
    google_key = settings.GOOGLE_SEARCH_API_KEY
    google_cx = settings.GOOGLE_CSE_ID
    bing_key = settings.BING_SEARCH_API_KEY

    results = []
    status_msg = "ok"

    if google_key and google_cx:
        adapter = GoogleSearchAdapter(google_key, google_cx)
        results = adapter.search(query_text)
    elif bing_key:
        adapter = BingSearchAdapter(bing_key)
        results = adapter.search(query_text)
    else:
        status_msg = "Web search skipped: No Google CSE or Bing API key configured in environment."
        logger.info(status_msg)

    return results, status_msg
