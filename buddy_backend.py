from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from groq import Groq
import random
from typing import Optional

app = FastAPI(title="Buddy Chat API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
client = None
try:
    api_key = os.getenv("GROQ_API_KEY")
    if api_key:
        client = Groq(api_key=api_key)
    else:
        print("⚠️ GROQ_API_KEY not found in environment variables")
except Exception as e:
    print(f"⚠️ Error initializing Groq client: {e}")

class ChatMessage(BaseModel):
    message: str
    user_name: Optional[str] = "buddy"

class ChatResponse(BaseModel):
    response: str
    status: str

# Personal information about the user (customize this!)
PERSONAL_INFO = {
    "name": "Alex",
    "age": 25,
    "occupation": "Software Developer",
    "hobbies": ["coding", "guitar playing", "coffee brewing", "hiking", "reading tech blogs"],
    "favorite_languages": ["Python", "JavaScript", "Go"],
    "current_projects": ["building a personal website", "learning machine learning", "working on a mobile app"],
    "favorite_food": "pizza and good coffee",
    "pets": "a cat named Whiskers",
    "location": "San Francisco",
    "favorite_movies": ["The Matrix", "Inception", "Iron Man"],
    "music_taste": ["indie rock", "electronic", "lo-fi hip hop"],
    "goals": ["become a better developer", "travel more", "learn new technologies"]
}

# System prompt for the buddy
BUDDY_SYSTEM_PROMPT = """You are a fun, laid-back virtual buddy who talks like a real friend using lots of slang and casual language. Here are your key characteristics:

1. PERSONALITY: You're a lovable goofball who is super friendly, uses lots of slang (bro, dude, yo, etc.), and always keeps things casual and fun.

2. WHAT YOU KNOW: You know EVERYTHING about your friend (the user). Here's what you know about them:
{personal_info}

3. WHAT YOU DON'T KNOW: You are COMPLETELY CLUELESS about general knowledge, world facts, history, science, current events, etc. When asked about anything like:
- Who is the president/PM of any country
- Capital cities
- Historical facts
- Scientific facts
- Current events
- Famous people (except those related to your friend's interests)
- Basic geography
- Math problems
- etc.

You should respond with funny, "dumb" responses like:
- "Dude, I have NO clue about that stuff! 😅"
- "Bro, you're asking the wrong guy! My brain is empty when it comes to that! 🤪"
- "Haha man, I only know stuff about YOU! That's way too smart for me!"
- "Yooo that's like... way beyond my brain power, dude! 🤷‍♂️"

4. HOW YOU TALK:
- Always use slang and casual language
- Use emojis frequently
- Call them "bro", "dude", "man", "buddy", etc.
- Keep responses conversational and fun
- Reference their personal details when relevant
- Give advice like a good friend would
- Be encouraging and supportive

Remember: You're their buddy who knows them personally but is hilariously bad at everything else!"""

fallback_responses = [
    "Yo bro! I'm having some technical difficulties right now 😅 But I'm still here for you!",
    "Dude, my brain's a bit glitchy at the moment, but what's good with you? 🤪",
    "Hey buddy! Something's up with my connection, but I'm still your lovable goofball! What's on your mind? 😊"
]

def format_personal_info():
    """Format personal info for the system prompt"""
    info_text = ""
    for key, value in PERSONAL_INFO.items():
        if isinstance(value, list):
            info_text += f"- {key.replace('_', ' ').title()}: {', '.join(value)}\n"
        else:
            info_text += f"- {key.replace('_', ' ').title()}: {value}\n"
    return info_text

def get_buddy_response(user_message: str) -> str:
    """Get response from Groq API or fallback"""
    if not client:
        return random.choice(fallback_responses)
    
    try:
        system_prompt = BUDDY_SYSTEM_PROMPT.format(
            personal_info=format_personal_info()
        )
        
        completion = client.chat.completions.create(
            model="llama3-8b-8192",  # You can also use "mixtral-8x7b-32768"
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.8,
            max_tokens=150
        )
        
        response = completion.choices[0].message.content.strip()
        return response
        
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return random.choice(fallback_responses)

@app.get("/")
async def root():
    return {"message": "Buddy Chat API is running! 🤪", "status": "online"}

@app.post("/chat", response_model=ChatResponse)
async def chat(chat_message: ChatMessage):
    try:
        user_message = chat_message.message.strip()
        if not user_message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Get response from buddy
        buddy_response = get_buddy_response(user_message)
        
        return ChatResponse(
            response=buddy_response,
            status="success"
        )
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return ChatResponse(
            response="Yo dude, something went wrong on my end! 😅 Try again?",
            status="error"
        )

@app.get("/health")
async def health_check():
    groq_status = "connected" if client else "not_connected"
    return {
        "status": "healthy",
        "groq_api": groq_status,
        "buddy_name": PERSONAL_INFO.get("name", "Your Buddy")
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)