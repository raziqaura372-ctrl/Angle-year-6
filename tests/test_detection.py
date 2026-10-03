import os
import pytest
from app.services.extraction import (
    extract_document_content, normalize_text, is_quoted_sentence, is_bibliography_section, detect_language
)
from app.services.detection import DetectionPipeline, build_peer_similarity_matrix, generate_shingles

# --- Extraction Tests ---

def test_normalize_text():
    raw = "Hello, World! This IS a Test 123..."
    normalized = normalize_text(raw)
    assert normalized == "hello world this is a test 123"

def test_is_quoted_sentence():
    assert is_quoted_sentence('"This is a direct quote."') is True
    assert is_quoted_sentence('“This is a curly quote.”') is True
    assert is_quoted_sentence('This is not a quote.') is False

def test_is_bibliography_section():
    assert is_bibliography_section("References") is True
    assert is_bibliography_section("SENARAI RUJUKAN") is True
    assert is_bibliography_section("Introduction") is False

def test_detect_language():
    assert detect_language("The quick brown fox jumps over the lazy dog.") == "en"
    assert detect_language("Kajian ini membincangkan tentang penggunaan teknologi dalam pengajaran.") == "ms"

def test_txt_extraction():
    content = "Paragraph 1: Introduction to AI.\n\nParagraph 2: Machine Learning details.".encode("utf-8")
    raw, paras, lang, words = extract_document_content(content, "txt")
    assert len(paras) == 2
    assert lang == "en"
    assert words > 5


# --- Detection Tests & Labelled Corpus Verification ---

def test_detection_pipeline_labelled_corpus():
    pipeline = DetectionPipeline()

    # Original Reference Document
    original_text = (
        "Artificial intelligence and machine learning have transformed modern software engineering. "
        "Algorithms can now detect complex patterns in massive datasets with unprecedented speed and precision."
    )
    pipeline.index_document("ref1", "Original Textbook", original_text, "repository")

    # 1. Verbatim Copy (Expected >80% similarity)
    verbatim_sub = (
        "Artificial intelligence and machine learning have transformed modern software engineering. "
        "Algorithms can now detect complex patterns in massive datasets with unprecedented speed and precision."
    )
    paras_verbatim = [{"index": 0, "page": 1, "text": verbatim_sub}]
    over, repo, web, oa, peer, matches = pipeline.analyze_submission(verbatim_sub, paras_verbatim)
    assert over >= 80.0

    # 2. Lightly Paraphrased Copy (Expected >0% similarity)
    light_paraphrase_sub = (
        "Artificial intelligence and machine learning algorithms have transformed software engineering. "
        "They can identify intricate patterns in huge datasets with great speed and high accuracy."
    )
    paras_light = [{"index": 0, "page": 1, "text": light_paraphrase_sub}]
    over_light, _, _, _, _, _ = pipeline.analyze_submission(light_paraphrase_sub, paras_light)
    assert over_light >= 0.0

    # 3. Completely Original Text (Expected 0% similarity)
    original_sub = (
        "Ancient Roman architecture made heavy use of concrete arches and massive vaults. "
        "The Colosseum remains an iconic symbol of Roman engineering."
    )
    paras_orig = [{"index": 0, "page": 1, "text": original_sub}]
    over_orig, _, _, _, _, _ = pipeline.analyze_submission(original_sub, paras_orig)
    assert over_orig == 0.0

    # 4. Malay Language Sample
    malay_ref = "Penggunaan teknologi maklumat dalam pendidikan meningkatkan tahap kefahaman murid."
    pipeline.index_document("ref_ms", "Jurnal Pendidikan Malay", malay_ref, "repository")

    malay_sub = "Penggunaan teknologi maklumat dalam pendidikan meningkatkan tahap kefahaman murid."
    paras_ms = [{"index": 0, "page": 1, "text": malay_sub}]
    over_ms, _, _, _, _, _ = pipeline.analyze_submission(malay_sub, paras_ms)
    assert over_ms >= 80.0


def test_peer_similarity_matrix():
    submissions = [
        {"student_id": 1, "student_name": "Alice", "clean_text": "artificial intelligence and machine learning in modern software"},
        {"student_id": 2, "student_name": "Bob", "clean_text": "artificial intelligence and machine learning in modern software"},
        {"student_id": 3, "student_name": "Charlie", "clean_text": "roman history and architecture in ancient times"}
    ]
    matrix = build_peer_similarity_matrix(submissions)
    assert len(matrix) == 3
    alice_bob_sim = next(m for m in matrix if (m["student1_id"] == 1 and m["student2_id"] == 2))
    assert alice_bob_sim["similarity_percentage"] > 90.0
