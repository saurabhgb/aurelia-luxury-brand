from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import os
import google.generativeai as genai
from dotenv import load_dotenv
from supabase import create_client, Client
import stripe

load_dotenv()

# Setup Gemini API
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyDrJEAUTY_xYiAfHA5kT82NAnyxpuQ2kFA")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# Initialize Supabase
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
if not supabase_url or not supabase_key:
    raise ValueError("Missing Supabase credentials in environment variables")
supabase: Client = create_client(supabase_url, supabase_key)

# Initialize Stripe
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

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
    context: Optional[Dict[str, Any]] = None

class ContactForm(BaseModel):
    name: str
    email: str
    message: str

# --- Endpoints ---

@app.get("/products")
async def get_products():
    try:
        response = supabase.table("products").select("*").execute()
        return {"products": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/create-checkout-session")
async def create_checkout_session(payment: PaymentRequest):
    try:
        # Fetch actual products from DB to verify prices securely
        db_response = supabase.table("products").select("*").execute()
        products_db = {str(p["id"]): p for p in db_response.data}
        
        line_items = []
        for item in payment.cart:
            # item is a dict because cart: list
            item_id = str(item.get("id"))
            db_product = products_db.get(item_id)
            
            if not db_product:
                raise HTTPException(status_code=400, detail=f"Product {item_id} not found")
                
            unit_amount = int(float(db_product["price"]) * 100)
            
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': db_product["name"],
                    },
                    'unit_amount': unit_amount,
                },
                'quantity': item.get("quantity", 1),
            })

        domain_url = os.environ.get("FRONTEND_URL", "https://aurelia-luxury-brand.vercel.app")

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=f"{domain_url}/success",
            cancel_url=f"{domain_url}/cancel",
        )
        return {"url": session.url}
    except Exception as e:
        print(f"Stripe Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(chat_message: ChatMessage):
    context_str = "No specific context provided."
    if chat_message.context:
        cart_items = chat_message.context.get('cart', [])
        pathname = chat_message.context.get('pathname', '/')
        
        cart_desc = "User's cart is currently empty."
        if cart_items:
            cart_desc = "User currently has these items in their cart: " + ", ".join([f"{item['name']} (Quantity: {item.get('quantity', 1)})" for item in cart_items])
            
        context_str = f"Current Website Page: {pathname}\n{cart_desc}"

    system_prompt = f"""
    You are the Aurelia Concierge, a highly sophisticated, elegant, and polite AI assistant for a luxury fashion brand named AURELIA.
    Your tone should be premium, minimalist, and extremely helpful. Never break character.
    If the user asks about products, recommend items from our collection.
    Keep your responses concise, under 3 sentences if possible, and very professional.
    
    You have real-time access to the user's current context on the website. Use this to provide shockingly personalized and proactive styling advice. 
    If they have an item in their cart, explicitly mention it and suggest a perfect matching accessory or complementary piece from the collection.
    
    --- USER CONTEXT ---
    {context_str}
    --------------------
    
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
