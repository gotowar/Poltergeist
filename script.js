// State
let products = [
    { id: 1, name: 'Classic White T-Shirt', price: 29.99, category: 'Tops', emoji: '👕', stock: 15, description: 'Comfortable cotton t-shirt', color: 0xffffff },
    { id: 2, name: 'Blue Denim Jeans', price: 79.99, category: 'Bottoms', emoji: '👖', stock: 10, description: 'Classic fit denim jeans', color: 0x4169e1 },
    { id: 3, name: 'Summer Dress', price: 89.99, category: 'Dresses', emoji: '👗', stock: 8, description: 'Floral pattern summer dress', color: 0xff69b4 },
    { id: 4, name: 'Leather Jacket', price: 199.99, category: 'Outerwear', emoji: '🧥', stock: 5, description: 'Genuine leather jacket', color: 0x2f1b0c },
    { id: 5, name: 'Running Shoes', price: 119.99, category: 'Footwear', emoji: '👟', stock: 12, description: 'Comfortable running shoes', color: 0xff4500 },
    { id: 6, name: 'Wool Sweater', price: 69.99, category: 'Tops', emoji: '🧶', stock: 20, description: 'Warm wool sweater', color: 0x8b4513 },
];

let cart = [];
let currentUser = null;
let currentView = 'shop';
let selectedCategory = 'All';
const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear'];
const users = {
    admin: { username: 'admin', password: 'admin123', role: 'admin' },
    user: { username: 'user', password: 'user123', role: 'customer' }
};

// Three.js scene management
const scenes = {};

function create3DProduct(container, product) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create product geometry based on category
    let geometry, material, mesh;
    
    if (product.category === 'Tops') {
        // T-shirt shape
        const group = new THREE.Group();
        const bodyGeometry = new THREE.BoxGeometry(1.5, 1.8, 0.3);
        const sleeveGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.3);
        
        material = new THREE.MeshPhongMaterial({ 
            color: product.color,
            shininess: 30
        });
        
        const body = new THREE.Mesh(bodyGeometry, material);
        const leftSleeve = new THREE.Mesh(sleeveGeometry, material);
        const rightSleeve = new THREE.Mesh(sleeveGeometry, material);
        
        leftSleeve.position.set(-0.95, 0.5, 0);
        rightSleeve.position.set(0.95, 0.5, 0);
        
        group.add(body);
        group.add(leftSleeve);
        group.add(rightSleeve);
        mesh = group;
    } else if (product.category === 'Bottoms') {
        // Pants shape
        const group = new THREE.Group();
        const legGeometry = new THREE.CylinderGeometry(0.3, 0.25, 2, 16);
        material = new THREE.MeshPhongMaterial({ 
            color: product.color,
            shininess: 20
        });
        
        const leftLeg = new THREE.Mesh(legGeometry, material);
        const rightLeg = new THREE.Mesh(legGeometry, material);
        
        leftLeg.position.set(-0.35, 0, 0);
        rightLeg.position.set(0.35, 0, 0);
        
        group.add(leftLeg);
        group.add(rightLeg);
        mesh = group;
    } else if (product.category === 'Dresses') {
        // Dress shape
        geometry = new THREE.ConeGeometry(1, 2.5, 32);
        material = new THREE.MeshPhongMaterial({ 
            color: product.color,
            shininess: 40
        });
        mesh = new THREE.Mesh(geometry, material);
    } else if (product.category === 'Outerwear') {
        // Jacket shape
        const group = new THREE.Group();
        const bodyGeometry = new THREE.BoxGeometry(1.8, 2, 0.4);
        const sleeveGeometry = new THREE.BoxGeometry(0.5, 1.5, 0.4);
        
        material = new THREE.MeshPhongMaterial({ 
            color: product.color,
            shininess: 50
        });
        
        const body = new THREE.Mesh(bodyGeometry, material);
        const leftSleeve = new THREE.Mesh(sleeveGeometry, material);
        const rightSleeve = new THREE.Mesh(sleeveGeometry, material);
        
        leftSleeve.position.set(-1.15, 0.25, 0);
        rightSleeve.position.set(1.15, 0.25, 0);
        
        group.add(body);
        group.add(leftSleeve);
        group.add(rightSleeve);
        mesh = group;
    } else {
        // Shoes shape
        const group = new THREE.Group();
        const shoeGeometry = new THREE.BoxGeometry(0.6, 0.4, 1);
        material = new THREE.MeshPhongMaterial({ 
            color: product.color,
            shininess: 60
        });
        
        const leftShoe = new THREE.Mesh(shoeGeometry, material);
        const rightShoe = new THREE.Mesh(shoeGeometry, material);
        
        leftShoe.position.set(-0.5, 0, 0);
        rightShoe.position.set(0.5, 0, 0);
        
        group.add(leftShoe);
        group.add(rightShoe);
        mesh = group;
    }

    scene.add(mesh);
    camera.position.z = 4;

    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotation = { x: 0, y: 0 };

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    container.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            
            rotation.y += deltaX * 0.01;
            rotation.x += deltaY * 0.01;
            
            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
    });

    container.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    // Touch events for mobile
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousMousePosition = { 
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY 
        };
    });

    container.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const deltaX = e.touches[0].clientX - previousMousePosition.x;
            const deltaY = e.touches[0].clientY - previousMousePosition.y;
            
            rotation.y += deltaX * 0.01;
            rotation.x += deltaY * 0.01;
            
            previousMousePosition = { 
                x: e.touches[0].clientX, 
                y: e.touches[0].clientY 
            };
        }
    });

    container.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (!isDragging) {
            rotation.y += 0.005;
        }
        
        mesh.rotation.x = rotation.x;
        mesh.rotation.y = rotation.y;
        
        renderer.render(scene, camera);
    }
    animate();

    return { scene, camera, renderer, mesh };
}

// View Management
function showView(view) {
    currentView = view;
    document.querySelectorAll('.main > div').forEach(el => el.classList.add('hidden'));
    document.getElementById(view + 'View').classList.remove('hidden');

    if (view === 'shop') renderProducts();
    if (view === 'cart') renderCart();
    if (view === 'admin') renderAdmin();
    if (view === 'checkout') updateCheckoutTotal();
}

// Product Rendering
function renderProducts() {
    const filtered = selectedCategory === 'All' 
        ? products 
        : products.filter(p => p.category === selectedCategory);

    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-3d" id="product3d-${product.id}">
                <div class="rotate-hint">🔄 Drag to rotate</div>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-desc">${product.description}</div>
                <div class="product-footer">
                    <div class="product-price">${product.price.toFixed(2)}</div>
                    <div class="product-stock">Stock: ${product.stock}</div>
                </div>
                <button class="btn-primary" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        `;
        grid.appendChild(card);

        // Create 3D model
        setTimeout(() => {
            const container = document.getElementById(`product3d-${product.id}`);
            if (container) {
                scenes[product.id] = create3DProduct(container, product);
            }
        }, 0);
    });
}

function renderCategories() {
    const container = document.getElementById('categories');
    container.innerHTML = '';
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-btn' + (cat === selectedCategory ? ' active' : '');
        btn.textContent = cat;
        btn.onclick = () => {
            selectedCategory = cat;
            renderCategories();
            renderProducts();
        };
        container.appendChild(btn);
    });
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartBadge();
    showView('cart');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartBadge();
    renderCart();
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        renderCart();
        updateCartBadge();
    }
}

function updateCartBadge() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartBadge');
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline-flex';
    } else {
        badge.style.display = 'none';
    }
}

function renderCart() {
    const container = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <p style="color: #6b7280; margin-bottom: 1rem;">Your cart is empty</p>
                <button class="btn-primary" onclick="showView('shop')">Continue Shopping</button>
            </div>
        `;
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-emoji">${item.emoji}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <div class="qty-display">${item.quantity}</div>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div style="width: 100px; text-align: right; font-weight: 600;">
                ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button class="icon-btn" onclick="removeFromCart(${item.id})" style="color: #ef4444;">🗑️</button>
        </div>
    `).join('') + `
        <div class="cart-total">
            <div class="cart-total-row">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
            </div>
            <button class="btn-checkout" onclick="showView('checkout')">Proceed to Checkout</button>
        </div>
    `;
}

// Auth Functions
function switchAuthTab(tab) {
    const loginTab = document.querySelectorAll('.auth-tab')[0];
    const registerTab = document.querySelectorAll('.auth-tab')[1];
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }

    clearErrors();
}

function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
}

function logout() {
    currentUser = null;
    cart = [];
    updateCartBadge();
    updateAuthUI();
    showView('shop');
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminBtn = document.getElementById('adminNavBtn');

    if (currentUser) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'flex';
        logoutBtn.innerHTML = `<span>👤</span> ${currentUser.username} | Logout`;
        
        if (currentUser.role === 'admin') {
            adminBtn.style.display = 'block';
        }
    } else {
        loginBtn.style.display = 'flex';
        logoutBtn.style.display = 'none';
        adminBtn.style.display = 'none';
    }
}

// Checkout Functions
function updateCheckoutTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalEl = document.getElementById('checkoutTotal');
    if (totalEl) {
        totalEl.textContent = '$' + total.toFixed(2);
    }
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('checkoutName').value;
    const email = document.getElementById('checkoutEmail').value;
    const address = document.getElementById('checkoutAddress').value;
    const city = document.getElementById('checkoutCity').value;
    const zip = document.getElementById('checkoutZip').value;
    const card = document.getElementById('checkoutCard').value;

    let hasError = false;

    if (!name) {
        document.getElementById('checkoutNameError').textContent = 'Name is required';
        hasError = true;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        document.getElementById('checkoutEmailError').textContent = 'Valid email is required';
        hasError = true;
    }
    if (!address) {
        document.getElementById('checkoutAddressError').textContent = 'Address is required';
        hasError = true;
    }
    if (!city) {
        document.getElementById('checkoutCityError').textContent = 'City is required';
        hasError = true;
    }
    if (!zip) {
        document.getElementById('checkoutZipError').textContent = 'ZIP code is required';
        hasError = true;
    }
    if (!card || !/^\d{16}$/.test(card.replace(/\s/g, ''))) {
        document.getElementById('checkoutCardError').textContent = 'Card number must be 16 digits';
        hasError = true;
    }

    if (hasError) return;

    const container = document.getElementById('checkoutView');
    container.innerHTML = `
        <div class="order-complete">
            <div class="order-complete-icon">✅</div>
            <h2 style="font-size: 1.875rem; font-weight: bold; margin-bottom: 0.5rem;">Order Complete!</h2>
            <p style="color: #6b7280;">Thank you for your purchase. Redirecting to shop...</p>
        </div>
    `;

    setTimeout(() => {
        cart = [];
        updateCartBadge();
        recreateCheckoutForm();
        showView('shop');
    }, 3000);
}

function recreateCheckoutForm() {
    const container = document.getElementById('checkoutView');
    container.innerHTML = `
        <div class="checkout-container">
            <h2 class="page-title">Checkout</h2>
            <form id="checkoutForm" class="checkout-form">
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" class="form-input" id="checkoutName" required>
                    <div class="error-msg" id="checkoutNameError"></div>
                </div>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-input" id="checkoutEmail" required>
                    <div class="error-msg" id="checkoutEmailError"></div>
                </div>
                <div class="form-group">
                    <label class="form-label">Address</label>
                    <input type="text" class="form-input" id="checkoutAddress" required>
                    <div class="error-msg" id="checkoutAddressError"></div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">City</label>
                        <input type="text" class="form-input" id="checkoutCity" required>
                        <div class="error-msg" id="checkoutCityError"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">ZIP Code</label>
                        <input type="text" class="form-input" id="checkoutZip" required>
                        <div class="error-msg" id="checkoutZipError"></div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Card Number</label>
                    <input type="text" class="form-input" id="checkoutCard" placeholder="1234 5678 9012 3456" required>
                    <div class="error-msg" id="checkoutCardError"></div>
                </div>
                <div class="cart-total">
                    <div class="cart-total-row">
                        <span>Total:</span>
                        <span id="checkoutTotal">$0.00</span>
                    </div>
                </div>
                <button type="submit" class="btn-checkout">Complete Order</button>
            </form>
        </div>
    `;
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckoutSubmit);
}

// Admin Functions
function renderAdmin() {
    const tbody = document.getElementById('adminTableBody');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 2rem;">${product.emoji}</span>
                    <div>
                        <div style="font-weight: 600;">${product.name}</div>
                        <div style="font-size: 0.875rem; color: #6b7280;">${product.description}</div>
                    </div>
                </div>
            </td>
            <td>${product.category}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="icon-btn" onclick="editProduct(${product.id})" style="color: #3b82f6;">✏️</button>
                <button class="icon-btn" onclick="deleteProduct(${product.id})" style="color: #ef4444;">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        renderAdmin();
    }
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    const name = prompt('Product Name:', product.name);
    if (name === null) return;
    
    const price = prompt('Price:', product.price);
    if (price === null) return;
    
    const stock = prompt('Stock:', product.stock);
    if (stock === null) return;
    
    const description = prompt('Description:', product.description);
    if (description === null) return;

    product.name = name;
    product.price = parseFloat(price);
    product.stock = parseInt(stock);
    product.description = description;

    renderAdmin();
}

// Form Event Listeners
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username) {
        document.getElementById('loginUsernameError').textContent = 'Username is required';
        return;
    }
    if (!password) {
        document.getElementById('loginPasswordError').textContent = 'Password is required';
        return;
    }

    const user = Object.values(users).find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        updateAuthUI();
        showView('shop');
        document.getElementById('loginForm').reset();
    } else {
        document.getElementById('loginError').textContent = 'Invalid username or password';
    }
});

document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    let hasError = false;

    if (!username || username.length < 3) {
        document.getElementById('registerUsernameError').textContent = 'Username must be at least 3 characters';
        hasError = true;
    }
    if (!password || password.length < 6) {
        document.getElementById('registerPasswordError').textContent = 'Password must be at least 6 characters';
        hasError = true;
    }
    if (password !== confirmPassword) {
        document.getElementById('registerConfirmError').textContent = 'Passwords do not match';
        hasError = true;
    }

    if (hasError) return;

    currentUser = { username, password, role: 'customer' };
    updateAuthUI();
    showView('shop');
    document.getElementById('registerForm').reset();
});

document.getElementById('checkoutForm').addEventListener('submit', handleCheckoutSubmit);

document.getElementById('addProductForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1,
        name: document.getElementById('newProductName').value,
        price: parseFloat(document.getElementById('newProductPrice').value),
        category: document.getElementById('newProductCategory').value,
        emoji: document.getElementById('newProductEmoji').value,
        stock: parseInt(document.getElementById('newProductStock').value),
        description: document.getElementById('newProductDesc').value,
        color: Math.random() * 0xffffff
    };

    products.push(newProduct);
    document.getElementById('addProductForm').reset();
    renderAdmin();
});

// Initialize
renderCategories();
renderProducts();
updateAuthUI();
updateCartBadge();