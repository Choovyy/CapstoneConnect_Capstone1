import faiss
import numpy as np

dimension = 384  # SBERT 'MiniLM' output size
index = faiss.IndexFlatL2(dimension)
user_profiles = []

def add_user_profile(embedding, user_info):
    vector = np.array([embedding]).astype("float32")
    index.add(vector)
    user_profiles.append(user_info)

def get_top_matches(embedding, k=3):
    vector = np.array([embedding]).astype("float32")
    distances, indices = index.search(vector, k)
    return [user_profiles[i] for i in indices[0] if i < len(user_profiles)]