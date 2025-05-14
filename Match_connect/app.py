from fastapi import FastAPI, Request
from ai.embedding import generate_embedding
from ai.faiss_index import add_user_profile, get_top_matches

app = FastAPI()

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
    matches = get_top_matches(embedding)
    return {"matches": matches}
