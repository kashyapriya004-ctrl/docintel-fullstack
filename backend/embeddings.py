import os
import numpy as np
from google import genai

def _get_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is missing.")
    return genai.Client(api_key=api_key)

def create_embeddings(chunks):
    """Generate normalized embeddings for a list of text chunks using Gemini."""
    if not chunks:
        return np.array([])
    client = _get_client()
    result = client.models.embed_content(
        model='gemini-embedding-2-preview',
        contents=chunks,
    )
    return np.array([emb.values for emb in result.embeddings])

def semantic_search(query, chunks, embeddings):
    """Find the top 5 most relevant chunks to a given query."""
    if not chunks or len(embeddings) == 0:
        return []
        
    client = _get_client()
    query_result = client.models.embed_content(
        model='gemini-embedding-2-preview',
        contents=query,
    )
    query_embedding = np.array(query_result.embeddings[0].values)
    
    similarities = []
    for emb in embeddings:
        similarity = np.dot(query_embedding, emb)
        similarities.append(similarity)
    
    # Get top 5 indices, sorted largest first
    top_indices = np.argsort(similarities)[-5:][::-1]
    
    return [chunks[i] for i in top_indices]
