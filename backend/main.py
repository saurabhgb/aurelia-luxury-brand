from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import asyncio
import os
import google.generativeai as genai

# Setup Gemini API
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyDrJEAUTY_xYiAfHA5kT82NAnyxpuQ2kFA")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

app = FastAPI(title="Aurelia API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---

class CartItem(BaseModel):
    id: int
    quantity: int

class PaymentRequest(BaseModel):
    cart: List[CartItem]
    total: float

class ChatMessage(BaseModel):
    message: str

class ContactForm(BaseModel):
    name: str
    email: str
    message: str

# --- Mock Data ---

PRODUCTS = [
    {
        "id": 1,
        "name": "The Obsidian Blazer",
        "price": 1250.00,
        "image": "assets/obsidian_blazer.png"
    },
    {
        "id": 2,
        "name": "Champagne Silk Slip Dress",
        "price": 890.00,
        "image": "assets/champagne_silk_dress.png"
    },
    {
        "id": 3,
        "name": "Aurelia Gold Cuff",
        "price": 450.00,
        "image": "assets/gold_cuff_bracelet.png"
    },
    {
        "id": 4,
        "name": "Noir Leather Tote",
        "price": 1600.00,
        "image": "assets/leather_tote_bag.png"
    }
]

# --- Endpoints ---

@app.get("/products")
async def get_products():
    return {"products": PRODUCTS}

@app.post("/process-payment")
async def process_payment(payment: PaymentRequest):
    # Simulate payment processing delay
    await asyncio.sleep(2)
    return {"status": "success", "message": "Payment Successful. Thank you for shopping with Aurelia."}

@app.post("/chat")
async def chat(chat_message: ChatMessage):
    system_prompt = """
    You are the Aurelia Concierge, a highly sophisticated, elegant, and polite AI assistant for a luxury fashion brand named AURELIA.
    Your tone should be premium, minimalist, and extremely helpful. Never break character.
    If the user asks about products, recommend items from our collection: The Obsidian Blazer ($1250), Champagne Silk Slip Dress ($890), Aurelia Gold Cuff ($450), Noir Leather Tote ($1600).
    Keep your responses concise, under 3 sentences if possible, and very professional.
    
    User message: 
    """
    try:
        response = model.generate_content(system_prompt + chat_message.message)
        reply = response.text.strip()
        return {"reply": reply}
    except Exception as e:
        print(f"Gemini Error: {e}")
        return {"reply": "I apologize, but our concierge service is currently experiencing high volume. Please try again in a moment."}


@app.post("/contact-submit")
async def contact_submit(form: ContactForm):
    # In a real app, this would send an email or save to a database
    return {"status": "success", "message": f"Thank you, {form.name}. Your inquiry has been received by our client services team."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
