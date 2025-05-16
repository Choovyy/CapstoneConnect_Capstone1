from fastapi import FastAPI, Request
from ai.embedding import generate_embedding
from ai.faiss_index import add_user_profile, get_top_matches

#venv\Scripts\activate
# uvicorn app:app --reload // to run the server
# if first time running, install the dependencies using pip install -r requirements.txt

app = FastAPI()
@app.get("/")
async def root():
    return {"message": "Welcome to our Match Connect python backend!. Use /add_profile to add a profile and /match to find matches."}

@app.post("/add_profile")
async def add_profile(request: Request):
    data = await request.json()
    profile_text = f"{data['skills']} {data['roles']} {data['interests']}"
    embedding = generate_embedding(profile_text)

    user_info = {
        "email": data["email"],
        "name": data["name"],
        "skills": data["skills"],
        "roles": data["roles"],
        "interests": data["interests"]
    }

    add_user_profile(embedding, user_info)
    return {"message": "Profile added"}

@app.post("/match")
async def match_profile(request: Request):
    data = await request.json()
    query_text = f"{data['skills']} {data['roles']} {data['interests']}"
    embedding = generate_embedding(query_text)
    matches = get_top_matches(embedding, exclude_email=data["email"]) # para di ma apil ang same ug email
    return {"matches": matches}
