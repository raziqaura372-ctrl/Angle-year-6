import os
import re
import io
import logging
from typing import List, Dict, Any, Tuple
import pdfplumber
import docx
import odf.opendocument
from odf.text import P
import pytesseract
from PIL import Image
from langdetect import detect, DetectorFactory

DetectorFactory.seed = 0
logger = logging.getLogger(__name__)

ENGLISH_STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
    "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
    "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have",
    "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him",
    "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't",
    "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor",
    "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out",
    "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some",
    "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
    "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through",
    "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've",
    "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who",
    "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll",
    "you're", "you've", "your", "yours", "yourself", "yourselves"
}

MALAY_STOPWORDS = {
    "ada", "adalah", "adanya", "adapun", "agak", "agar", "akan", "akankah", "akhir", "akibat", "aku",
    "dalam", "dan", "dapat", "dari", "daripada", "dengan", "di", "dia", "ia", "ialah", "ini", "itu",
    "jika", "jikalau", "juga", "karena", "kerna", "kami", "kamu", "ke", "karena", "kelihatan", "kembali",
    "kemudian", "kepada", "ketiadaan", "kita", "maka", "mereka", "pada", "pada", "persoalan", "sebab",
    "sebagai", "sebagaimana", "seseorang", "seperti", "sudah", "supaya", "telah", "tentang", "tidak",
    "untuk", "yang"
}

def detect_language(text: str) -> str:
    if not text or len(text.strip()) < 10:
        return "en"
    try:
        lang = detect(text)
        if lang in ["ms", "id"]:
            return "ms"
        return "en"
    except Exception:
        return "en"

def extract_text_from_pdf(file_bytes: bytes) -> List[Dict[str, Any]]:
    paragraphs = []
    para_index = 0
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page_num, page in enumerate(pdf.pages, start=1):
                text = page.extract_text()
                if not text or len(text.strip()) < 30:
                    try:
                        im = page.to_image(resolution=200).original
                        ocr_text = pytesseract.image_to_string(im, lang="eng+msa")
                        if ocr_text and len(ocr_text.strip()) > len(text or ""):
                            text = ocr_text
                    except Exception as ocr_err:
                        logger.warning(f"OCR failed for page {page_num}: {ocr_err}")

                if text:
                    page_paras = [p.strip() for p in text.split("\n\n") if p.strip()]
                    if not page_paras:
                        page_paras = [p.strip() for p in text.split("\n") if p.strip()]

                    for p_text in page_paras:
                        paragraphs.append({
                            "index": para_index,
                            "page": page_num,
                            "text": p_text
                        })
                        para_index += 1
    except Exception as e:
        logger.error(f"Error parsing PDF: {e}")
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")

    return paragraphs

def extract_text_from_docx(file_bytes: bytes) -> List[Dict[str, Any]]:
    paragraphs = []
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        for index, p in enumerate(doc.paragraphs):
            text = p.text.strip()
            if text:
                paragraphs.append({
                    "index": len(paragraphs),
                    "page": 1,
                    "text": text
                })
    except Exception as e:
        logger.error(f"Error parsing DOCX: {e}")
        raise ValueError(f"Failed to extract text from DOCX: {str(e)}")
    return paragraphs

def extract_text_from_odt(file_bytes: bytes) -> List[Dict[str, Any]]:
    paragraphs = []
    try:
        doc = odf.opendocument.load(io.BytesIO(file_bytes))
        for p in doc.getElementsByType(P):
            text = "".join(node.data for node in p.childNodes if node.nodeType == node.TEXT_NODE).strip()
            if text:
                paragraphs.append({
                    "index": len(paragraphs),
                    "page": 1,
                    "text": text
                })
    except Exception as e:
        logger.error(f"Error parsing ODT: {e}")
        raise ValueError(f"Failed to extract text from ODT: {str(e)}")
    return paragraphs

def extract_text_from_txt(file_bytes: bytes) -> List[Dict[str, Any]]:
    paragraphs = []
    try:
        content = file_bytes.decode("utf-8", errors="ignore")
        if content.startswith("{\\rtf"):
            content = re.sub(r"\\[a-z0-9]+\b", "", content)
            content = re.sub(r"[{}]", "", content)

        raw_paras = [p.strip() for p in content.split("\n\n") if p.strip()]
        if not raw_paras:
            raw_paras = [p.strip() for p in content.split("\n") if p.strip()]

        for index, p_text in enumerate(raw_paras):
            paragraphs.append({
                "index": index,
                "page": 1,
                "text": p_text
            })
    except Exception as e:
        logger.error(f"Error parsing TXT: {e}")
        raise ValueError(f"Failed to extract text from TXT: {str(e)}")
    return paragraphs

def extract_document_content(file_bytes: bytes, file_extension: str) -> Tuple[str, List[Dict[str, Any]], str, int]:
    ext = file_extension.lower().lstrip(".")
    if ext == "pdf":
        paragraphs = extract_text_from_pdf(file_bytes)
    elif ext in ["docx", "doc"]:
        paragraphs = extract_text_from_docx(file_bytes)
    elif ext == "odt":
        paragraphs = extract_text_from_odt(file_bytes)
    elif ext in ["txt", "rtf"]:
        paragraphs = extract_text_from_txt(file_bytes)
    else:
        raise ValueError(f"Unsupported file format: .{ext}")

    raw_text = "\n\n".join([p["text"] for p in paragraphs])
    clean_text = normalize_text(raw_text)
    detected_lang = detect_language(raw_text)
    word_count = len(re.findall(r"\w+", raw_text))

    return raw_text, paragraphs, detected_lang, word_count

def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def is_quoted_sentence(text: str) -> bool:
    text_s = text.strip()
    return (text_s.startswith('"') and text_s.endswith('"')) or \
           (text_s.startswith('“') and text_s.endswith('”')) or \
           (text_s.startswith("'") and text_s.endswith("'"))

def is_bibliography_section(heading: str) -> bool:
    normalized = heading.strip().lower()
    bib_keywords = [
        "references", "bibliography", "works cited", "reference list",
        "rujukan", "senarai rujukan", "bibliografi"
    ]
    return any(kw in normalized for kw in bib_keywords)
