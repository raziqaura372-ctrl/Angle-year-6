import uuid
import re
import math
from typing import List, Dict, Any, Tuple, Set, Optional
from datasketch import MinHash, MinHashLSH
from rapidfuzz import fuzz
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.services.extraction import normalize_text, is_quoted_sentence, is_bibliography_section

def generate_shingles(text: str, n: int = 5) -> List[str]:
    words = re.findall(r"\w+", normalize_text(text))
    if len(words) < n:
        return [" ".join(words)] if words else []
    return [" ".join(words[i:i+n]) for i in range(len(words) - n + 1)]

def compute_minhash(text: str, num_perm: int = 128) -> MinHash:
    mh = MinHash(num_perm=num_perm)
    shingles = generate_shingles(text, n=5)
    for s in shingles:
        mh.update(s.encode("utf-8"))
    return mh

def longest_common_substring(s1: str, s2: str) -> str:
    if not s1 or not s2:
        return ""
    w1, w2 = s1.split(), s2.split()
    m, n = len(w1), len(w2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    max_len = 0
    end_pos = 0

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if w1[i - 1] == w2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
                if dp[i][j] > max_len:
                    max_len = dp[i][j]
                    end_pos = i

    if max_len == 0:
        return ""
    return " ".join(w1[end_pos - max_len:end_pos])

class DetectionPipeline:
    def __init__(self, threshold_lsh: float = 0.2, num_perm: int = 128):
        self.num_perm = num_perm
        self.lsh = MinHashLSH(threshold=threshold_lsh, num_perm=num_perm)
        self.doc_store: Dict[str, Dict[str, Any]] = {}

    def index_document(self, doc_id: str, title: str, text: str, source_type: str, url: str = None, author: str = None, paragraphs: List[Dict[str, Any]] = None):
        mh = compute_minhash(text, num_perm=self.num_perm)
        self.lsh.insert(doc_id, mh)
        self.doc_store[doc_id] = {
            "id": doc_id,
            "title": title,
            "text": text,
            "source_type": source_type,
            "url": url,
            "author": author,
            "paragraphs": paragraphs or [{"index": 0, "page": 1, "text": text}],
            "minhash": mh
        }

    def analyze_submission(
        self,
        submission_text: str,
        paragraphs: List[Dict[str, Any]],
        settings_exclude_quotes: bool = True,
        settings_exclude_bib: bool = True,
        min_match_words: int = 5,
        excluded_phrases: List[str] = None
    ) -> Tuple[float, float, float, float, float, List[Dict[str, Any]]]:
        if not submission_text or not submission_text.strip():
            return 0.0, 0.0, 0.0, 0.0, 0.0, []

        excluded_phrases_norm = [normalize_text(p) for p in (excluded_phrases or []) if p.strip()]

        sub_mh = compute_minhash(submission_text, num_perm=self.num_perm)
        candidates = self.lsh.query(sub_mh)
        if not candidates and len(self.doc_store) <= 50:
            candidates = list(self.doc_store.keys())

        matches: List[Dict[str, Any]] = []
        in_bibliography = False

        for para in paragraphs:
            para_text = para["text"]
            para_norm = normalize_text(para_text)
            para_index = para["index"]
            page_num = para.get("page", 1)

            if is_bibliography_section(para_text):
                in_bibliography = True

            is_bib_excluded = settings_exclude_bib and in_bibliography
            is_quote_excluded = settings_exclude_quotes and is_quoted_sentence(para_text)

            is_phrase_excluded = False
            for ex_p in excluded_phrases_norm:
                if ex_p and ex_p in para_norm:
                    is_phrase_excluded = True
                    break

            for cand_id in candidates:
                cand = self.doc_store[cand_id]
                cand_text = cand["text"]

                lcs = longest_common_substring(para_norm, normalize_text(cand_text))
                lcs_words = len(lcs.split()) if lcs else 0

                fuzzy_ratio = fuzz.partial_ratio(para_norm, normalize_text(cand_text))

                if lcs_words >= min_match_words or fuzzy_ratio > 80:
                    matched_snippet = lcs if lcs_words >= min_match_words else para_text[:150]

                    para_word_count = len(para_norm.split()) or 1
                    match_percentage = min(100.0, (lcs_words / para_word_count) * 100.0 if lcs_words > 0 else fuzzy_ratio)

                    exclusion_reason = None
                    is_excluded = False

                    if is_bib_excluded:
                        is_excluded = True
                        exclusion_reason = "Bibliography section"
                    elif is_quote_excluded:
                        is_excluded = True
                        exclusion_reason = "Quoted text"
                    elif is_phrase_excluded:
                        is_excluded = True
                        exclusion_reason = "Excluded phrase/template"
                    elif lcs_words < min_match_words:
                        is_excluded = True
                        exclusion_reason = f"Match under {min_match_words} words"

                    matches.append({
                        "match_id": str(uuid.uuid4()),
                        "source_id": cand_id,
                        "source_title": cand["title"],
                        "source_type": cand["source_type"],
                        "source_url": cand["url"],
                        "author": cand["author"],
                        "similarity_percentage": round(match_percentage, 2),
                        "submitted_text": para_text,
                        "matched_text": matched_snippet,
                        "start_paragraph": para_index,
                        "end_paragraph": para_index,
                        "page_number": page_num,
                        "is_excluded": is_excluded,
                        "exclusion_reason": exclusion_reason
                    })

        total_paras = len(paragraphs) or 1
        active_matches = [m for m in matches if not m["is_excluded"]]

        matched_para_indices = set(m["start_paragraph"] for m in active_matches)
        overall_similarity = round(min(100.0, (len(matched_para_indices) / total_paras) * 100.0), 2)

        repo_paras = set(m["start_paragraph"] for m in active_matches if m["source_type"] in ["repository", "lecturer_template"])
        web_paras = set(m["start_paragraph"] for m in active_matches if m["source_type"] == "web")
        oa_paras = set(m["start_paragraph"] for m in active_matches if m["source_type"].startswith("open_access"))
        peer_paras = set(m["start_paragraph"] for m in active_matches if m["source_type"] == "peer")

        repo_sim = round(min(100.0, (len(repo_paras) / total_paras) * 100.0), 2)
        web_sim = round(min(100.0, (len(web_paras) / total_paras) * 100.0), 2)
        oa_sim = round(min(100.0, (len(oa_paras) / total_paras) * 100.0), 2)
        peer_sim = round(min(100.0, (len(peer_paras) / total_paras) * 100.0), 2)

        return overall_similarity, repo_sim, web_sim, oa_sim, peer_sim, matches

def build_peer_similarity_matrix(submissions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not submissions or len(submissions) < 2:
        return []

    texts = [s["clean_text"] for s in submissions]
    vectorizer = TfidfVectorizer().fit_transform(texts)
    cosine_sim = cosine_similarity(vectorizer, vectorizer)

    matrix = []
    for i in range(len(submissions)):
        for j in range(i + 1, len(submissions)):
            matrix.append({
                "student1_id": submissions[i]["student_id"],
                "student1_name": submissions[i]["student_name"],
                "student2_id": submissions[j]["student_id"],
                "student2_name": submissions[j]["student_name"],
                "similarity_percentage": round(float(cosine_sim[i][j]) * 100.0, 2)
            })
    return matrix
