// State
// Define the product database as an array of objects.
// In a real app, this data would come from a backend database (like SQL).
let products = [
    // Each object represents one product with properties like ID, name, price, and hex color for the 3D model.
    { id: 1, name: 'Classic White T-Shirt', price: 29.99, category: 'Tops', emoji: '👕', stock: 15, description: 'Comfortable cotton t-shirt', color: 0xffffff },
    { id: 2, name: 'Blue Denim Jeans', price: 79.99, category: 'Bottoms', emoji: '👖', stock: 10, description: 'Classic fit denim jeans', color: 0x4169e1 },
    { id: 3, name: 'Summer Dress', price: 89.99, category: 'Dresses', emoji: '👗', stock: 8, description: 'Floral pattern summer dress', color: 0xff69b4 },
    { id: 4, name: 'Leather Jacket', price: 199.99, category: 'Outerwear', emoji: '🧥', stock: 5, description: 'Genuine leather jacket', color: 0x2f1b0c },
    { id: 5, name: 'Running Shoes', price: 119.99, category: 'Footwear', emoji: '👟', stock: 12, description: 'Comfortable running shoes', color: 0xff4500 },
    { id: 6, name: 'Wool Sweater', price: 69.99, category: 'Tops', emoji: '🧶', stock: 20, description: 'Warm wool sweater', color: 0x8b4513 },
];

let cart = []; // Initialize an empty array to hold items the user wants to buy.
let currentUser = null; // Variable to store logged-in user data. Null means "Guest".
let currentView = 'shop'; // Tracks which screen is currently visible (Shop, Cart, etc.).
let selectedCategory = 'All'; // Tracks the current filter for the product list.
const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear']; // Fixed list of category names.

// Object storing valid login credentials.
// This simulates a database of users. 'admin' has special privileges.
const users = {
    admin: { username: 'admin', password: 'admin123', role: 'admin' },
    user: { username: 'user', password: 'user123', role: 'customer' }
};

// Three.js scene management
const scenes = {}; // Object to store active 3D scenes so we can reference them later.

// Function to create and render a 3D object inside a specific HTML container.
function create3DProduct(container, product) {
    const scene = new THREE.Scene(); // Create a new 3D world (Scene).
    // Create a camera: 75 FOV, Aspect Ratio matches container, Near clip 0.1, Far clip 1000.
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    // Create the renderer (the painter). 'alpha: true' makes the background transparent.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight); // Set render size to match HTML box.
    renderer.setClearColor(0x000000, 0); // Set background color to transparent (opacity 0).
    container.appendChild(renderer.domElement); // Inject the <canvas> element into the HTML page.

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Add soft global light.
    scene.add(ambientLight); // Add light to the world.
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Add a strong directional light (like the sun).
    directionalLight.position.set(5, 5, 5); // Position the light source.
    scene.add(directionalLight); // Add directional light to world.

    // Create product geometry based on category
    let geometry, material, mesh; // Variables to hold the shape, color, and final object.
    
    // Logic to decide which 3D shape to build based on the product category.
    if (product.category === 'Tops') {
        // T-shirt shape logic
        const group = new THREE.Group(); // Create a group to hold multiple shapes (body + sleeves).
        const bodyGeometry = new THREE.BoxGeometry(1.5, 1.8, 0.3); // Main torso box.
        const sleeveGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.3); // Sleeve box.
        
        // Material determines how light hits the object. We use the product's hex color.
        material = new THREE.MeshPhongMaterial({ 
            color: product.color,
            shininess: 30 // Makes it slightly shiny/reflective.
        });
        
        const body = new THREE.Mesh(bodyGeometry, material); // Create the torso mesh.
        const leftSleeve = new THREE.Mesh(sleeveGeometry, material); // Create left sleeve.
        const rightSleeve = new THREE.Mesh(sleeveGeometry, material); // Create right sleeve.
        
        leftSleeve.position.set(-0.95, 0.5, 0); // Move sleeve to the left.
        rightSleeve.position.set(0.95, 0.5, 0); // Move sleeve to the right.
        
        group.add(body); // Add torso to group.
        group.add(leftSleeve); // Add left sleeve to group.
        group.add(rightSleeve); // Add right sleeve to group.
        mesh = group; // The final object is the group.
    } else if (product.category === 'Bottoms') {
        // Pants shape logic
        const group = new THREE.Group();
        const legGeometry = new THREE.CylinderGeometry(0.3, 0.25, 2, 16); // Cylinder for legs.
        material = new THREE.MeshPhongMaterial({ 
            color: product.color,
            shininess: 20
        });
        
        const leftLeg = new THREE.Mesh(legGeometry, material);
        const rightLeg = new THREE.Mesh(legGeometry, material);
        
        leftLeg.position.set(-0.35, 0, 0); // Position left leg.
        rightLeg.position.set(0.35, 0, 0); // Position right leg.
        
        group.add(leftLeg);
        group.add(rightLeg);
        mesh = group;
    } else if (product.category === 'Dresses') {
        // Dress shape logic
        geometry = new THREE.ConeGeometry(1, 2.5, 32); // Simple cone shape.
        material = new THREE.MeshPhongMaterial({ 
            color: product.color,
            shininess: 40
        });
        mesh = new THREE.Mesh(geometry, material); // Create mesh from cone geometry.
    } else if (product.category === 'Outerwear') {
        // Jacket shape logic (similar to Tops but larger/bulkier)
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
        
        group.add(body, leftSleeve, rightSleeve);
        mesh = group;
    } else {
        // Shoes shape (Fallback for Footwear/Others)
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

    scene.add(mesh); // Add the created 3D object to the scene.
    camera.position.z = 4; // Move the camera back 4 units so we can see the object.

    // Mouse interaction variables
    let isDragging = false; // Is the user currently clicking and holding?
    let previousMousePosition = { x: 0, y: 0 }; // Where was the mouse last frame?
    let rotation = { x: 0, y: 0 }; // Current rotation of the object.

    // Event Listener: When mouse button is pressed down inside the container.
    container.addEventListener('mousedown', (e) => {
        isDragging = true; // Enable dragging mode.
        previousMousePosition = { x: e.clientX, y: e.clientY }; // Record start position.
    });

    // Event Listener: When mouse moves inside the container.
    container.addEventListener('mousemove', (e) => {
        if (isDragging) { // Only rotate if the button is held down.
            const deltaX = e.clientX - previousMousePosition.x; // How far X moved.
            const deltaY = e.clientY - previousMousePosition.y; // How far Y moved.
            
            rotation.y += deltaX * 0.01; // Apply rotation to Y axis (spin left/right).
            rotation.x += deltaY * 0.01; // Apply rotation to X axis (spin up/down).
            
            previousMousePosition = { x: e.clientX, y: e.clientY }; // Update last position.
        }
    });

    // Event Listener: When mouse button is released.
    container.addEventListener('mouseup', () => {
        isDragging = false; // Stop dragging.
    });

    // Event Listener: When mouse leaves the 3D box area.
    container.addEventListener('mouseleave', () => {
        isDragging = false; // Stop dragging (prevents getting stuck in drag mode).
    });

    // Touch events for mobile (Duplicate logic of mouse events but for touch screens)
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

    // Animation loop: This function runs 60 times per second.
    function animate() {
        requestAnimationFrame(animate); // Schedule the next frame.
        
        if (!isDragging) {
            rotation.y += 0.005; // Auto-rotate the object slightly if user isn't interacting.
        }
        
        mesh.rotation.x = rotation.x; // Apply calculated X rotation to mesh.
        mesh.rotation.y = rotation.y; // Apply calculated Y rotation to mesh.
        
        renderer.render(scene, camera); // Draw the scene to the canvas.
    }
    animate(); // Start the loop.

    return { scene, camera, renderer, mesh }; // Return objects in case we need to modify them later.
}

// View Management Logic (SPA - Single Page Application)
function showView(view) {
    currentView = view; // Update state variable.
    // Select all main view containers and add 'hidden' class (display: none).
    document.querySelectorAll('.main > div').forEach(el => el.classList.add('hidden'));
    // Select the specific requested view and remove 'hidden' class (making it visible).
    document.getElementById(view + 'View').classList.remove('hidden');

    // Trigger specific rendering functions based on which view was opened.
    if (view === 'shop') renderProducts();
    if (view === 'cart') renderCart();
    if (view === 'admin') renderAdmin();
    if (view === 'checkout') updateCheckoutTotal();
}

// Product Rendering Logic
function renderProducts() {
    // Filter the products array based on the global 'selectedCategory' variable.
    const filtered = selectedCategory === 'All' 
        ? products // If 'All', use full array.
        : products.filter(p => p.category === selectedCategory); // Else, keep matches.

    const grid = document.getElementById('productsGrid'); // Get the HTML container.
    grid.innerHTML = ''; // Clear existing content (prevents duplicates).

    // Loop through filtered products and create HTML for each.
    filtered.forEach(product => {
        const card = document.createElement('div'); // Create new div.
        card.className = 'product-card'; // Add CSS class.
        // Use Template Literal (backticks) to inject HTML string.
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
        grid.appendChild(card); // Add card to the grid.

        // Initialize 3D model. We use setTimeout(..., 0) to ensure the HTML element 
        // exists in the DOM before we try to attach the 3D renderer to it.
        setTimeout(() => {
            const container = document.getElementById(`product3d-${product.id}`);
            if (container) {
                scenes[product.id] = create3DProduct(container, product);
            }
        }, 0);
    });
}

// Function to render the category filter buttons.
function renderCategories() {
    const container = document.getElementById('categories');
    container.innerHTML = ''; // Clear buttons.
    
    categories.forEach(cat => {
        const btn = document.createElement('button'); // Create button.
        // Add 'active' class if this is the currently selected category (for styling).
        btn.className = 'category-btn' + (cat === selectedCategory ? ' active' : '');
        btn.textContent = cat;
        // On click: update state, re-render buttons (to move active class), re-render grid.
        btn.onclick = () => {
            selectedCategory = cat;
            renderCategories();
            renderProducts();
        };
        container.appendChild(btn); // Add to page.
    });
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId); // Find product data.
    const existing = cart.find(item => item.id === productId); // Check if already in cart.
    
    if (existing) {
        existing.quantity++; // If in cart, just increase number.
    } else {
        cart.push({ ...product, quantity: 1 }); // If new, add object with qty 1.
    }
    
    updateCartBadge(); // Update red number on header.
    showView('cart'); // Switch view to cart.
}

function removeFromCart(productId) {
    // Filter keeps all items EXCEPTS the one with the matching ID.
    cart = cart.filter(item => item.id !== productId);
    updateCartBadge();
    renderCart(); // Refresh cart UI.
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        // Update quantity, but Math.max ensures it never goes below 1.
        item.quantity = Math.max(1, item.quantity + delta);
        renderCart();
        updateCartBadge();
    }
}

function updateCartBadge() {
    // Reduce sums up all quantities in the cart array.
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartBadge');
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline-flex'; // Show badge.
    } else {
        badge.style.display = 'none'; // Hide badge if empty.
    }
}

function renderCart() {
    const container = document.getElementById('cartItems');
    
    // Empty State Check
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <p style="color: #6b7280; margin-bottom: 1rem;">Your cart is empty</p>
                <button class="btn-primary" onclick="showView('shop')">Continue Shopping</button>
            </div>
        `;
        return;
    }

    // Calculate Grand Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Map cart array to HTML strings and join them.
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
                ${(item.price * item.quantity).toFixed(2)} </div>
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

// Auth Functions (Login/Register/Logout)
function switchAuthTab(tab) {
    // Select elements
    const loginTab = document.querySelectorAll('.auth-tab')[0];
    const registerTab = document.querySelectorAll('.auth-tab')[1];
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Toggle classes based on which tab was clicked.
    if (tab === 'login') {
        loginTab.classList.add('active'); // Style active tab.
        registerTab.classList.remove('active');
        loginForm.classList.remove('hidden'); // Show login form.
        registerForm.classList.add('hidden'); // Hide register form.
    } else {
        // Opposite logic for Register tab.
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }

    clearErrors(); // Remove old error messages.
}

function clearErrors() {
    // Find all error divs and empty their text.
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
}

function logout() {
    currentUser = null; // Clear user session.
    cart = []; // Empty the cart for security/privacy.
    updateCartBadge();
    updateAuthUI(); // Update buttons (show Login instead of Logout).
    showView('shop'); // Go to home.
}

function updateAuthUI() {
    // Get navigation buttons.
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminBtn = document.getElementById('adminNavBtn');

    if (currentUser) {
        // User IS logged in.
        loginBtn.style.display = 'none'; // Hide Login button.
        logoutBtn.style.display = 'flex'; // Show Logout button.
        logoutBtn.innerHTML = `<span>👤</span> ${currentUser.username} | Logout`;
        
        // Check Role: Only show Admin Panel button if role is 'admin'.
        if (currentUser.role === 'admin') {
            adminBtn.style.display = 'block';
        }
    } else {
        // User is Guest.
        loginBtn.style.display = 'flex';
        logoutBtn.style.display = 'none';
        adminBtn.style.display = 'none';
    }
}

// Checkout Functions
function updateCheckoutTotal() {
    // Calculate total specifically for the checkout summary label.
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalEl = document.getElementById('checkoutTotal');
    if (totalEl) {
        totalEl.textContent = '$' + total.toFixed(2);
    }
}

function handleCheckoutSubmit(e) {
    e.preventDefault(); // Stop the form from reloading the page!
    clearErrors();

    // Get values from input fields.
    const name = document.getElementById('checkoutName').value;
    const email = document.getElementById('checkoutEmail').value;
    const address = document.getElementById('checkoutAddress').value;
    const city = document.getElementById('checkoutCity').value;
    const zip = document.getElementById('checkoutZip').value;
    const card = document.getElementById('checkoutCard').value;

    let hasError = false; // Flag to track if validation fails.

    // Validation Logic
    if (!name) {
        document.getElementById('checkoutNameError').textContent = 'Name is required';
        hasError = true;
    }
    // Regex checks for non-whitespace @ non-whitespace . non-whitespace
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
    // Regex checks for exactly 16 digits (ignoring spaces).
    if (!card || !/^\d{16}$/.test(card.replace(/\s/g, ''))) {
        document.getElementById('checkoutCardError').textContent = 'Card number must be 16 digits';
        hasError = true;
    }

    if (hasError) return; // Stop if there are errors.

    // Simulate Success: Replace form with Success Message.
    const container = document.getElementById('checkoutView');
    container.innerHTML = `
        <div class="order-complete">
            <div class="order-complete-icon">✅</div>
            <h2 style="font-size: 1.875rem; font-weight: bold; margin-bottom: 0.5rem;">Order Complete!</h2>
            <p style="color: #6b7280;">Thank you for your purchase. Redirecting to shop...</p>
        </div>
    `;

    // Wait 3000ms (3 seconds) then reset.
    setTimeout(() => {
        cart = []; // Clear cart.
        updateCartBadge();
        recreateCheckoutForm(); // Restore the original HTML form.
        showView('shop'); // Go back to shop.
    }, 3000);
}

function recreateCheckoutForm() {
    const container = document.getElementById('checkoutView');
    // Inject the original form HTML back into the DOM.
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
    // Re-attach the event listener because the old button was deleted.
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckoutSubmit);
}

// Admin Functions
function renderAdmin() {
    const tbody = document.getElementById('adminTableBody');
    // Map products to Table Rows.
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
        // Create a NEW array that excludes the item with the matching ID.
        products = products.filter(p => p.id !== id);
        renderAdmin(); // Refresh the table.
    }
}

function editProduct(id) {
    const product = products.find(p => p.id === id); // Find item.
    // Use prompt() for simple inputs (simpler than building a modal).
    const name = prompt('Product Name:', product.name);
    if (name === null) return; // Exit if user clicks Cancel.
    
    const price = prompt('Price:', product.price);
    if (price === null) return;
    
    const stock = prompt('Stock:', product.stock);
    if (stock === null) return;
    
    const description = prompt('Description:', product.description);
    if (description === null) return;

    // Update object properties.
    product.name = name;
    product.price = parseFloat(price); // Ensure it's a number.
    product.stock = parseInt(stock); // Ensure it's an integer.
    product.description = description;

    renderAdmin(); // Refresh table.
}

// Form Event Listeners (This code runs once when script loads)
// Attach Login Handler
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

    // Check credentials against the users object values.
    const user = Object.values(users).find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user; // Set Session.
        updateAuthUI();
        showView('shop');
        document.getElementById('loginForm').reset(); // Clear form fields.
    } else {
        document.getElementById('loginError').textContent = 'Invalid username or password';
    }
});

// Attach Register Handler
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    let hasError = false;

    // Validations
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

    // Create a new session (Note: Does not actually save to 'users' object persistently).
    currentUser = { username, password, role: 'customer' };
    updateAuthUI();
    showView('shop');
    document.getElementById('registerForm').reset();
});

// Attach Checkout Handler
document.getElementById('checkoutForm').addEventListener('submit', handleCheckoutSubmit);

// Attach Admin Add Product Handler
document.getElementById('addProductForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1, // Generate new ID (Highest ID + 1).
        name: document.getElementById('newProductName').value,
        price: parseFloat(document.getElementById('newProductPrice').value),
        category: document.getElementById('newProductCategory').value,
        emoji: document.getElementById('newProductEmoji').value,
        stock: parseInt(document.getElementById('newProductStock').value),
        description: document.getElementById('newProductDesc').value,
        color: Math.random() * 0xffffff // Assign random hex color for 3D model.
    };

    products.push(newProduct); // Add to global array.
    document.getElementById('addProductForm').reset();
    renderAdmin(); // Update admin table.
});

// Initialize App (Runs immediately on load)
renderCategories(); // Draw filter buttons.
renderProducts(); // Draw product grid.
updateAuthUI(); // Check login state.
updateCartBadge(); // Check cart state.
