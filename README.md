🤪 Buddy Chat - Your Lovable Goofball Virtual Friend
A fun chat application where you can talk to your virtual buddy who knows everything about you but is hilariously clueless about general knowledge!
🎯 Features

Personalized Chat: Your buddy knows all about your hobbies, interests, and life details
Slang-Heavy Responses: Talks like a real friend with lots of "bro", "dude", and casual language
Lovable Goofball: Completely clueless about general knowledge - will give funny responses instead of real facts
Real-time Chat: Smooth chat experience with typing indicators
Groq AI Integration: Powered by Groq's fast LLM API
Responsive Design: Works great on desktop and mobile
Demo Mode: Works offline with pre-programmed responses if API is unavailable

🏗️ Tech Stack
Frontend:

React 18
CSS3 with modern animations
Responsive design

Backend:

Python FastAPI
Groq API integration
CORS enabled for frontend communication

🚀 Quick Start
Prerequisites

Python 3.8+
Node.js 16+
Groq API Key (get one at console.groq.com)

1. Clone the Repository
bashgit clone https://github.com/yourusername/buddy-chat.git
cd buddy-chat
2. Backend Setup
bash# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env and add your Groq API key
# GROQ_API_KEY=your_actual_api_key_here
3. Frontend Setup
bash# Navigate to frontend directory (open new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env if needed (API URL is set to localhost:8000 by default)
4. Customize Your Buddy
Edit the PERSONAL_INFO dictionary in backend/main.py to tell your buddy about yourself:
pythonPERSONAL_INFO = {
    "name": "Your Name",
    "age": 25,
    "occupation": "Your Job",
    "hobbies": ["coding", "gaming", "music"],
    "favorite_languages": ["Python", "JavaScript"],
    # Add more personal details...
}
5. Run the Application
Start Backend (Terminal 1):
bashcd backend
python main.py
# Or use: uvicorn main:app --reload
Start Frontend (Terminal 2):
bashcd frontend
npm start
Visit http://localhost:3000 to chat with your buddy! 🎉
🎮 How to Use

Say Hi: Start with a greeting - your buddy will respond enthusiastically!
Ask Personal Questions: Try "What are my hobbies?" or "What should I do today?"
Test General Knowledge: Ask "Who is the president?" - watch your buddy hilariously fail!
Get Advice: Your buddy gives great friend-to-friend advice about your interests
Have Fun: Chat naturally - your buddy remembers everything about you!

🎨 Example Interactions
Personal Questions ✅

User: "What are my hobbies?"
Buddy: "Oh snap, I know this one! You're into coding and you love working on cool projects! Plus you're always down for some good music! 🎵"

General Knowledge Questions 😂

User: "Who is the president of France?"
Buddy: "Uhhhh... dude I have NO clue! 😅 My brain is like totally empty when it comes to that stuff!"

Friendly Advice 💡

User: "What should I do today?"
Buddy: "Dude, you should totally work on that coding project you've been putting off! Or maybe grab some pizza first... priorities, ya know? 🍕"
🙏 Acknowledgments

Groq for the amazing AI API
FastAPI for the awesome backend framework
React for the frontend framework


Have fun chatting with your buddy! 🤪✨
Remember: Your buddy is intentionally clueless about general knowledge - that's the fun part! He's your personal friend who only cares about YOU and your life. Ask him about world facts and watch the hilarious responses! 😂

#output

https://github.com/user-attachments/assets/74b2bb4f-f559-41f5-8115-5647a0674807



![Screenshot 2025-06-10 091645](https://github.com/user-attachments/assets/95b51590-f989-4ba5-8853-65196af47a89)
