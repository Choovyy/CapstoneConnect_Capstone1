from fastapi import FastAPI, Request, HTTPException
from ai.embedding import generate_embedding
from ai.faiss_index import add_user_profile, get_top_matches
import logging

#Buhata sa ni una
# Step 1: venv\Scripts\activate

# Step 2: ayaw kalimot install sa dependencies // pip install -r requirements.txt
# Step 3: uvicorn app:app --reload // to run the server

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()
@app.get("/")
async def root():
    return {"message": "Welcome to our Match Connect python backend!. Use /add_profile to add a profile and /match to find matches."}

@app.get("/status")
async def get_status():
    from ai.faiss_index import index, user_profiles
    
    try:
        status = {
            "indexSize": index.ntotal,
            "profilesCount": len(user_profiles),
            "isHealthy": index.ntotal == len(user_profiles)
        }
        return status
    except Exception as e:
        error_msg = f"Error getting status: {str(e)}"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@app.post("/add_profile")
async def add_profile(request: Request):
    try:
        data = await request.json()
        
        # Log received data (excluding sensitive information)
        logger.info(f"Received add_profile request for: {data.get('email', 'unknown')}")
        
        # Validate required fields
        required_fields = ['email', 'name', 'technicalSkills', 'preferredRoles', 'projectInterests']
        for field in required_fields:
            if field not in data or data[field] is None:
                error_msg = f"Missing required field: {field}"
                logger.error(error_msg)
                raise HTTPException(status_code=400, detail=error_msg)
        
        # Create embedding
        profile_text = f"{data['technicalSkills']} {data['preferredRoles']} {data['projectInterests']}"
        embedding = generate_embedding(profile_text)
        
        if embedding is None:
            error_msg = "Failed to generate embedding"
            logger.error(error_msg)
            raise HTTPException(status_code=500, detail=error_msg)

        user_info = {
            "email": data["email"],
            "name": data["name"],
            "technicalSkills": data["technicalSkills"],
            "preferredRoles": data["preferredRoles"],
            "projectInterests": data["projectInterests"]
        }

        success = add_user_profile(embedding, user_info)
        if not success:
            error_msg = "Failed to add user profile to index"
            logger.error(error_msg)
            raise HTTPException(status_code=500, detail=error_msg)
            
        logger.info(f"Successfully added profile for: {data.get('email', 'unknown')}")
        return {"message": "Profile added"}
        
    except Exception as e:
        error_msg = f"Error in add_profile: {str(e)}"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@app.post("/match")
async def match_profile(request: Request):
    try:
        data = await request.json()
        
        # Log received data (excluding sensitive information)
        logger.info(f"Received match request" + (f" excluding: {data.get('email')}" if data.get('email') else ""))
        
        # Validate required fields
        required_fields = ['technicalSkills', 'preferredRoles', 'projectInterests']
        for field in required_fields:
            if field not in data or data[field] is None:
                error_msg = f"Missing required field: {field}"
                logger.error(error_msg)
                raise HTTPException(status_code=400, detail=error_msg)
                
        # Create embedding
        query_text = f"{data['technicalSkills']} {data['preferredRoles']} {data['projectInterests']}"
        embedding = generate_embedding(query_text)
        
        if embedding is None:
            error_msg = "Failed to generate embedding"
            logger.error(error_msg)
            raise HTTPException(status_code=500, detail=error_msg)
            
        exclude_email = data.get("email")  # Safe way to access optional field
        
        matches = get_top_matches(embedding, exclude_email=exclude_email)
        logger.info(f"Found {len(matches)} matches")
        
        return {"matches": matches}
        
    except Exception as e:
        error_msg = f"Error in match: {str(e)}"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

