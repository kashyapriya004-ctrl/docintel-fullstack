import numpy as np
from sentence_transformers import SentenceTransformer

# Load local embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

def create_embeddings(chunks):
    """Generate normalized embeddings for a list of text chunks."""
    embeddings = model.encode(chunks, normalize_embeddings=True)
    return embeddings

def semantic_search(query, chunks, embeddings):
    """Find the top 5 most relevant chunks to a given query."""
    query_embedding = model.encode([query], normalize_embeddings=True)[0]
    
    similarities = []
    for emb in embeddings:
        similarity = np.dot(query_embedding, emb)
        similarities.append(similarity)
    
    # Get top 5 indices, sorted largest first
    top_indices = np.argsort(similarities)[-5:][::-1]
    
    return [chunks[i] for i in top_indices]
