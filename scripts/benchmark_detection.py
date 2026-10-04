import time
import uuid
import random
from app.services.detection import DetectionPipeline

def generate_random_paragraph(num_words: int = 150) -> str:
    vocab = [
        "algorithm", "database", "neural", "network", "plagiarism", "detection", "minhash", "shingle",
        "vector", "matrix", "similarity", "learning", "model", "performance", "optimization", "academic",
        "integrity", "university", "publication", "corpus", "indexing", "retrieval", "document", "paragraph"
    ]
    return " ".join(random.choice(vocab) for _ in range(num_words))

def run_benchmark():
    print("=== VeriDraft Performance Benchmark ===")
    print("Target: 30-page document (~9,000 words) against 10,000 stored corpus documents in under 2 minutes.")

    pipeline = DetectionPipeline(threshold_lsh=0.2, num_perm=128)

    print("\n1. Indexing 10,000 synthetic corpus documents...")
    start_index = time.time()
    for i in range(10000):
        doc_id = f"corpus_{i}"
        text = generate_random_paragraph(num_words=100)
        pipeline.index_document(doc_id, f"Corpus Document #{i}", text, "repository")
        if (i + 1) % 2500 == 0:
            print(f"   Indexed {i + 1} / 10,000 documents...")
    index_duration = time.time() - start_index
    print(f"Indexing completed in {index_duration:.2f} seconds.")

    print("\n2. Generating 30-page test submission (~9,000 words)...")
    doc_paras = []
    full_text_paras = []
    for page in range(1, 31):
        for p in range(2): # 2 paragraphs per page
            para_text = generate_random_paragraph(num_words=150)
            doc_paras.append({
                "index": len(doc_paras),
                "page": page,
                "text": para_text
            })
            full_text_paras.append(para_text)

    submission_text = "\n\n".join(full_text_paras)

    print("\n3. Executing similarity analysis against 10,000 documents...")
    start_analysis = time.time()
    overall, repo, web, oa, peer, matches = pipeline.analyze_submission(
        submission_text=submission_text,
        paragraphs=doc_paras,
        settings_exclude_quotes=True,
        settings_exclude_bib=True,
        min_match_words=5
    )
    analysis_duration = time.time() - start_analysis

    print(f"\n=== Benchmark Results ===")
    print(f"Analysis Duration: {analysis_duration:.2f} seconds (Target: < 120 seconds)")
    print(f"Matches Found: {len(matches)}")
    print(f"Overall Similarity Calculated: {overall}%")

    if analysis_duration < 120.0:
        print("\nPERFORMANCE TARGET MET: Document analysed in under 2 minutes!")
    else:
        print("\nPERFORMANCE TARGET EXCEEDED.")

if __name__ == "__main__":
    run_benchmark()
