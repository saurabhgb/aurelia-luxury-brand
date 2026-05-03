const API_BASE = 'http://127.0.0.1:8000';

// Global State
let products = [];
let cart = JSON.parse(localStorage.getItem('aurelia_cart')) || [];

// DOM Elements
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    setupScrollEffects();
    setupChat();
    
    // Page specific initialization
    if (document.getElementById('product-grid')) {
        fetchProducts();
    }
    
    if (document.getElementById('checkout-items')) {
        renderCheckout();
    }
    
    if (document.getElementById('contact-form')) {
        setupContactForm();
    }
});

// --- Scroll Effects & Animations ---
function setupScrollEffects() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// --- Product Fetching ---
async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const data = await response.json();
        products = data.products;
        renderProducts();
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card fade-in';
        card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button class="btn btn-outline" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- Cart Logic ---
function addToCart(productId) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        // Find product details
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push({ ...product, quantity: 1 });
        }
    }
    saveCart();
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    
    // If on checkout page, re-render
    if (document.getElementById('checkout-items')) {
        renderCheckout();
    }
}

function saveCart() {
    localStorage.setItem('aurelia_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.quantity;
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(div);
            });
        }
        
        if (cartTotalElement) {
            cartTotalElement.textContent = `$${total.toFixed(2)}`;
        }
    }
}

function openCart() {
    if (cartDrawer) cartDrawer.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('show');
}

function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('show');
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// --- Checkout Page Logic ---
function renderCheckout() {
    const checkoutContainer = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    checkoutContainer.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        checkoutContainer.innerHTML = '<p>Your cart is empty. Please return to the shop.</p>';
        checkoutTotal.textContent = '$0.00';
        document.getElementById('pay-btn').disabled = true;
        return;
    }
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'checkout-item fade-in';
        div.innerHTML = `
            <div style="display: flex; gap: 20px; align-items: center;">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity}</p>
                </div>
            </div>
            <div>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        `;
        checkoutContainer.appendChild(div);
    });
    
    checkoutTotal.textContent = `$${total.toFixed(2)}`;
    
    // Setup Pay button
    const payBtn = document.getElementById('pay-btn');
    payBtn.onclick = async () => {
        payBtn.textContent = 'Processing...';
        payBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_BASE}/process-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart: cart, total: total })
            });
            const result = await response.json();
            
            document.getElementById('checkout-msg').textContent = result.message;
            cart = [];
            saveCart();
            renderCheckout();
            
        } catch (error) {
            document.getElementById('checkout-msg').textContent = 'Payment failed. Please try again.';
            payBtn.textContent = 'Complete Purchase';
            payBtn.disabled = false;
        }
    };
}

// --- Contact Form Logic ---
function setupContactForm() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const msgDiv = document.getElementById('contact-msg');
        
        btn.textContent = 'Sending...';
        btn.disabled = true;
        
        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        try {
            const response = await fetch(`${API_BASE}/contact-submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            msgDiv.textContent = result.message;
            msgDiv.style.color = 'var(--color-gold)';
            form.reset();
        } catch (error) {
            msgDiv.textContent = 'Error sending message.';
            msgDiv.style.color = 'red';
        } finally {
            btn.textContent = 'Send Message';
            btn.disabled = false;
        }
    });
}

// --- Chat System Logic ---
function setupChat() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input-field');
    const sendChatBtn = document.getElementById('send-chat');
    const messagesContainer = document.getElementById('chat-messages');

    if (!chatToggle) return;

    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.textContent = text;
        messagesContainer.appendChild(userMsg);
        
        chatInput.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Show typing indicator
        const typingMsg = document.createElement('div');
        typingMsg.className = 'message bot typing';
        typingMsg.textContent = '...';
        messagesContainer.appendChild(typingMsg);

        try {
            const response = await fetch(`${API_BASE}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            
            messagesContainer.removeChild(typingMsg);
            
            const botMsg = document.createElement('div');
            botMsg.className = 'message bot';
            botMsg.textContent = data.reply;
            messagesContainer.appendChild(botMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            messagesContainer.removeChild(typingMsg);
        }
    }

    sendChatBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}
