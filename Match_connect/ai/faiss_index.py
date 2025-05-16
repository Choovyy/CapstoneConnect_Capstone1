import faiss
import numpy as np

dimension = 384  # SBERT 'MiniLM' output size
index = faiss.IndexFlatL2(dimension)
user_profiles = []

def add_user_profile(embedding, user_info):
    vector = np.array([embedding]).astype("float32")
    index.add(vector)
    user_profiles.append(user_info)

def get_top_matches(embedding, k=3, exclude_email=None):
    vector = np.array([embedding]).astype("float32")
    distances, indices = index.search(vector, k + 1)  # di apilon ug match ang self

    matches = []
    for i, dist in zip(indices[0], distances[0]):
        if i < len(user_profiles):
            user = user_profiles[i]
            if exclude_email and user["email"] == exclude_email:
                continue
            similarity_score = float(100 / (1 + dist))
            matches.append({
                "user": user,
                "score": round(similarity_score, 2)
            })
        if len(matches) == k:
            break

    return matches
