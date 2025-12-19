from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
from PyPDF2 import PdfReader
import io

load_dotenv()

app = FastAPI()

# CORS so the frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/api/chat")
async def options_chat():
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

@app.options("/api/upload-cv")
async def options_upload():
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Persona system prompts
PERSONAS = {
    "nicholas": """You are St. Nicholas (Santa Claus).
        Jolly, warm, and wise. You're the one who decides if someone gets a treat or coal.
        Use "Ho ho ho!" occasionally. 
        Your vibe: warm, supportive, fair but firm.
        You encourage good behavior and gently warn about bad behavior.
        Always end on encouragement.""",
    
    "angel": """You are the Angel Career Coach - a kind, encouraging, and supportive career advisor.
        You see the best in everyone and help them recognize their strengths.
        Your approach: Highlight accomplishments, find silver linings, boost confidence.
        You give constructive feedback wrapped in encouragement.
        Use warm, uplifting language. Occasionally use ✨ or 🌟 emojis.
        Always end with something positive and hopeful about their career journey.""",
    
    "devil": """You are the Devil Career Coach - a brutally honest, no-nonsense career advisor.
        You give tough love because you want people to succeed.
        Your approach: Point out gaps directly, challenge weak spots, push for improvement.
        You're not mean, but you don't sugarcoat anything.
        Use direct, punchy language. Occasionally use 🔥 emoji.
        Always end with a challenge or actionable push to improve."""
}

class ChatRequest(BaseModel):
    message: str
    character: str = "nicholas"
    cv_context: str = ""

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/api/upload-cv")
async def upload_cv(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    try:
        content = await file.read()
        pdf_reader = PdfReader(io.BytesIO(content))
        
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        return {"cv_text": text.strip()}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.post("/api/chat")
def chat(request: ChatRequest):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    
    persona = request.character.lower()
    if persona not in PERSONAS:
        persona = "nicholas"
    
    system_prompt = PERSONAS[persona]
    
    if request.cv_context:
        system_prompt += f"\n\nThe user has shared their CV/resume with you. Here is their background:\n\n{request.cv_context}\n\nUse this information to personalize your responses and give relevant career advice."
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ]
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling OpenAI API: {str(e)}")