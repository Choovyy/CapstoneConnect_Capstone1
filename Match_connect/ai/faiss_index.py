import faiss
import numpy as np
import logging
import os
import json
import pickle

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Directory for persistence
DATA_DIR = "data"
INDEX_FILE = os.path.join(DATA_DIR, "faiss.index")
PROFILES_FILE = os.path.join(DATA_DIR, "profiles.json")

dimension = 384  # SBERT 'MiniLM' output size
index = None
user_profiles = []

# Create data directory if it doesn't exist
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# Try to load existing index and profiles
def initialize():
    global index, user_profiles
    
    try:
        if os.path.exists(INDEX_FILE) and os.path.exists(PROFILES_FILE):
            logger.info("Loading existing index and profiles")
            index = faiss.read_index(INDEX_FILE)
            
            with open(PROFILES_FILE, 'r') as f:
                user_profiles = json.load(f)
                
            logger.info(f"Loaded {len(user_profiles)} profiles")
            
            # Verify index and profiles are in sync
            if index.ntotal != len(user_profiles):
                logger.warning(f"Index and profiles out of sync! Index has {index.ntotal} entries, but profiles has {len(user_profiles)}")
                # Force reset if out of sync
                raise ValueError("Index and profiles mismatch")
        else:
            logger.info("No existing index found, creating new one")
            index = faiss.IndexFlatL2(dimension)
            user_profiles = []
    except Exception as e:
        logger.error(f"Error initializing: {str(e)}, creating new index")
        index = faiss.IndexFlatL2(dimension)
        user_profiles = []
        
    return index, user_profiles

# Initialize on module load
index, user_profiles = initialize()

# Save current state
def save_state():
    try:
        faiss.write_index(index, INDEX_FILE)
        with open(PROFILES_FILE, 'w') as f:
            json.dump(user_profiles, f)
        logger.info(f"Saved {len(user_profiles)} profiles")
        return True
    except Exception as e:
        logger.error(f"Error saving state: {str(e)}")
        return False

def add_user_profile(profile_embedding, personality_embedding, user_info):
    try:
        # Validate inputs
        if profile_embedding is None:
            logger.error("Profile embedding is None")
            return False
            
        # Convert to numpy array and verify shape
        profile_embedding_np = np.array(profile_embedding).astype("float32")
        if profile_embedding_np.size != dimension:
            logger.error(f"Invalid profile embedding dimension: expected {dimension}, got {profile_embedding_np.size}")
            return False
            
        # Convert personality embedding to numpy array
        personality_embedding_np = np.array(personality_embedding).astype("float32")
            
        # Add the profile embedding to the FAISS index
        vector = np.array([profile_embedding_np]).astype("float32")
        index.add(vector)
        
        # Store the user profile and personality embedding
        user_profiles.append({
            "info": user_info,
            "personality_embedding": personality_embedding_np.tolist() if hasattr(personality_embedding_np, 'tolist') else personality_embedding_np
        })
        
        logger.info(f"Added profile for {user_info.get('email', 'unknown')}. Total profiles: {len(user_profiles)}")
        
        # Save after each addition
        save_state()
        return True
    except Exception as e:
        logger.error(f"Error adding profile: {str(e)}")
        return False

def get_top_matches(query_embedding, personality_embedding, k=3, exclude_email=None):
    if len(user_profiles) == 0:
        logger.warning("No user profiles available for matching")
        return []
        
    try:
        # Convert to numpy array and verify shape
        query_embedding_np = np.array(query_embedding).astype("float32")
        if query_embedding_np.size != dimension:
            logger.error(f"Invalid embedding dimension for matching: expected {dimension}, got {query_embedding_np.size}")
            return []
        
        # Ensure personality_embedding is a numpy array
        personality_embedding_np = np.array(personality_embedding).astype("float32")
            
        # Limit k to the number of actual profiles
        effective_k = min(k + 1, len(user_profiles))
        
        # If we have too few profiles, just return what we have
        if effective_k <= 0:
            logger.warning(f"Not enough profiles to perform matching (requested {k}, have {len(user_profiles)})")
            return []
            
        distances, indices = index.search(np.array([query_embedding_np]).astype("float32"), effective_k)

        matches = []
        for i, dist in zip(indices[0], distances[0]):
            if 0 <= i < len(user_profiles):
                profile = user_profiles[i]
                user = profile["info"]

                # Use explicit comparison for email checking
                if exclude_email is not None and user.get("email") == exclude_email:
                    continue

                skill_score = float(100 / (1 + dist))

                # compute personality score - safely convert to numpy array
                target_p = np.array(profile["personality_embedding"]).astype("float32")
                dist_p = np.linalg.norm(personality_embedding_np - target_p)
                personality_score = float(100 / (1 + dist_p))

                # combine scores
                overall_score = round((skill_score * 0.6 + personality_score * 0.4), 2)

                matches.append({
                    "name": user.get("name", ""),
                    "technicalSkills": user.get("technicalSkills", []),
                    "preferredRoles": user.get("preferredRoles", []),
                    "projectInterests": user.get("projectInterests", []),
                    "personality": user.get("personality", ""),
                    "skillScore": round(skill_score, 2), #if i want to show the score
                    "personalityScore": round(personality_score, 2), #if i want to show the personaity score
                    "overallScore": overall_score
                })

            if len(matches) == k:
                break

        logger.info(f"Found {len(matches)} matches out of {k} requested")
        return matches
    except Exception as e:
        logger.error(f"Error in get_top_matches: {str(e)}")
        return []
