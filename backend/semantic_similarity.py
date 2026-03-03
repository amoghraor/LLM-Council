# backend/semantic_similarity.py
import numpy as np
from typing import List
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

_model = None

def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    return _model

def calculate_batch_cosine_similarity(texts: List[str]) -> np.ndarray:
    embeddings = get_model().encode(texts, convert_to_numpy=True)
    return cosine_similarity(embeddings).astype(float)  # convert to native float

def get_relevance_scores(responses: List[str], query: str) -> List[float]:
    query_emb = get_model().encode([query], convert_to_numpy=True)
    resp_embs = get_model().encode(responses, convert_to_numpy=True)
    return [float(x) for x in cosine_similarity(query_emb, resp_embs)[0]]  # native floats