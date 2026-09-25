// POS Logic
let posCart = [];
let activeCategoryId = null; // Default to first dynamically
let currentPOSOrderType = 'Dine-in';

document.addEventListener('DOMContentLoaded', () => {
    window.Store.subscribe((state) => {
        if(document.getElementById('view-pos').classList.contains('active')){
            renderPOSCategories(state);
            renderPOSProducts(state);
        }
    });

    // We also need to listen for view changes to initialize properly if needed
    document.querySelectorAll('.nav-item[data-target="view-pos"]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!activeCategoryId && window.Store.state.categories.length > 0) {
                activeCategoryId = window.Store.state.categories[0].id;
            }
            renderPOSCategories(window.Store.state);
            renderPOSProducts(window.Store.state);
            renderPOSCart();
            renderPOSDynamicForm();
        });
    });
    
    // Initial dynamic form render just in case
    renderPOSDynamicForm();
});

function renderPOSCategories(state) {
    const container = document.getElementById('pos-categories-container');
    if (!container) return;
    
    container.innerHTML = state.categories.map(c => `
        <button class="pos-category-btn ${activeCategoryId === c.id ? 'active' : ''}" onclick="setPOSCategory('${c.id}')">
            ${c.name}
        </button>
    `).join('');
}

window.setPOSCategory = function(id) {
    activeCategoryId = id;
    renderPOSCategories(window.Store.state);
    renderPOSProducts(window.Store.state);
};

function renderPOSProducts(state) {
    const container = document.getElementById('pos-products-container');
    if (!container) return;
    
    if ((!activeCategoryId || !state.categories.find(c => c.id === activeCategoryId)) && state.categories.length > 0) {
        activeCategoryId = state.categories[0].id;
        setTimeout(() => renderPOSCategories(state), 0);
    }
    
    const activeCategory = state.categories.find(c => c.id === activeCategoryId);
    const products = state.products.filter(p => p.categoryId === activeCategoryId);
    const showDesc = activeCategory && activeCategory.name === 'Combos';
    
    container.innerHTML = products.map(p => `
        <div class="pos-product-card${showDesc ? '' : ' compact'}" onclick="addToPOSCartOptions('${p.id}')">
            <span class="pos-status badge ${p.status === 'Available' ? 'badge-success' : 'badge-warning'}">${p.status}</span>
            <div class="pos-img-wrap">
                <img src="${p.image || ''}" alt="${p.name}" loading="lazy" decoding="async">
            </div>
            <div class="pos-content">
                <div class="pos-content-top">
                    <h3 class="pos-name">${p.name}</h3>
                    ${showDesc ? `<p class="pos-desc">${p.desc || 'A delicious choice.'}</p>` : ''}
                </div>
                <div class="pos-footer">
                    <span class="pos-price">${state.restaurant.currency} ${p.price}</span>
                    <button class="pos-add-btn">+ Add</button>
                </div>
            </div>
        </div>
    `).join('');
}

window.addToPOSCartOptions = function(productId) {
    const product = window.Store.state.products.find(p => p.id === productId);
    if (!product || product.status !== 'Available') return;

    const category = window.Store.state.categories.find(c => c.id === product.categoryId);
    let optionsHtml = '';
    
    if (category.name === 'Pizzas') {
        optionsHtml = `
            <div style="margin-bottom: 1rem;">
                <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">Size</label>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <label style="display: flex; align-items: center; gap: 0.25rem;"><input type="radio" name="pos-size" value="Small" checked> Small</label>
                    <label style="display: flex; align-items: center; gap: 0.25rem;"><input type="radio" name="pos-size" value="Regular"> Regular (+Rs. 250)</label>
                    <label style="display: flex; align-items: center; gap: 0.25rem;"><input type="radio" name="pos-size" value="Large"> Large (+Rs. 500)</label>
                </div>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">Add-ons</label>
                <label style="display: flex; align-items: center; gap: 0.25rem;"><input type="checkbox" name="pos-addon" value="Extra Cheese"> Extra Cheese (+Rs. 150)</label>
            </div>
        `;
    } else if (category.name === 'Drinks') {
        optionsHtml = `
            <div style="margin-bottom: 1rem;">
                <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">Size</label>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <label style="display: flex; align-items: center; gap: 0.25rem;"><input type="radio" name="pos-size" value="Regular" checked> Regular</label>
                    <label style="display: flex; align-items: center; gap: 0.25rem;"><input type="radio" name="pos-size" value="1 Liter"> 1 Liter (+Rs. 100)</label>
                    <label style="display: flex; align-items: center; gap: 0.25rem;"><input type="radio" name="pos-size" value="1.5 Liters"> 1.5 Liters (+Rs. 150)</label>
                </div>
            </div>
        `;
    } else if (category.name === 'Burgers' || category.name === 'Fries' || category.name === 'Rolls') {
        optionsHtml = `
            <div style="margin-bottom: 1rem;">
                <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">Meal Option</label>
                <div style="display: flex; gap: 0.5rem; flex-direction: column;">
                    <label style="display: flex; align-items: center; gap: 0.25rem;"><input type="radio" name="pos-meal" value="Ala Carte" checked> Ala Carte (Item Only)</label>
                    <label style="display: flex; align-items: center; gap: 0.25rem;"><input type="radio" name="pos-meal" value="Meal"> Make it a Meal (+ Drink & Fries, +Rs. 300)</label>
                </div>
            </div>
        `;
    } else {
        addToPOSCart(productId, '');
        return;
    }

    const overlay = document.getElementById('generic-modal-overlay');
    const title = document.getElementById('generic-modal-title');
    const body = document.getElementById('generic-modal-body');
    const saveBtn = document.getElementById('generic-modal-save');
    
    if (!overlay || !title || !body || !saveBtn) return;
    
    title.textContent = `Customize: ${product.name}`;
    body.innerHTML = optionsHtml;
    
    saveBtn.textContent = 'Add to Cart';
    saveBtn.style.display = 'block';
    
    const oldOnclick = saveBtn.onclick;
    saveBtn.onclick = () => {
        let variantString = '';
        
        const sizeOption = document.querySelector('input[name="pos-size"]:checked');
        if (sizeOption && sizeOption.value !== 'Small' && sizeOption.value !== 'Regular (Drink)') variantString += sizeOption.value + ' | ';
        
        const mealOption = document.querySelector('input[name="pos-meal"]:checked');
        if (mealOption && mealOption.value !== 'Ala Carte') variantString += 'Meal | ';
        
        const addons = document.querySelectorAll('input[name="pos-addon"]:checked');
        addons.forEach(a => variantString += `${a.value} | `);

        variantString = variantString.replace(/ \| $/, '');
        addToPOSCart(productId, variantString);
        overlay.style.display = 'none';
        saveBtn.onclick = oldOnclick;
        saveBtn.textContent = 'Save';
    };
    
    const closeBtn = document.querySelector('#generic-modal-overlay .btn-outline');
    const oldCloseClick = closeBtn.onclick;
    closeBtn.onclick = () => {
        saveBtn.onclick = oldOnclick;
        saveBtn.textContent = 'Save';
        if (oldCloseClick) oldCloseClick();
        else overlay.style.display = 'none';
        closeBtn.onclick = oldCloseClick;
    };
    
    overlay.style.display = 'flex';
};

window.addToPOSCart = function(productId, variant = '') {
    const product = window.Store.state.products.find(p => p.id === productId);
    if (!product || product.status !== 'Available') return;

    const cartId = productId + (variant ? `-${variant.replace(/[^a-zA-Z0-9]/g, '')}` : '');
    const existing = posCart.find(i => i.cartId === cartId);
    
    if (existing) {
        existing.qty++;
    } else {
        let extraPrice = 0;
        if (variant.includes('Large')) extraPrice += 500;
        else if (variant.includes('Regular')) extraPrice += 250; // For pizza
        if (variant.includes('1 Liter')) extraPrice += 100;
        if (variant.includes('1.5 Liters')) extraPrice += 150;
        if (variant.includes('Extra Cheese')) extraPrice += 150;
        if (variant.includes('Meal')) extraPrice += 300;

        posCart.push({
            id: product.id,
            cartId: cartId,
            name: product.name,
            variant: variant,
            price: product.price + extraPrice,
            qty: 1
        });
    }
    renderPOSCart();
};

window.removeFromPOSCart = function(cartId) {
    posCart = posCart.filter(i => i.cartId !== cartId);
    renderPOSCart();
};

window.clearPOSCart = function() {
    posCart = [];
    renderPOSCart();
};

function renderPOSCart() {
    const container = document.getElementById('pos-cart-items-container');
    const subtotalEl = document.getElementById('pos-subtotal');
    const taxEl = document.getElementById('pos-tax');
    const totalEl = document.getElementById('pos-total');
    const state = window.Store.state;
    
    if (!container) return;

    if (posCart.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: var(--clr-text-muted); margin-top: 2rem;">Cart is empty</div>';
        subtotalEl.textContent = 'Rs. 0';
        taxEl.textContent = 'Rs. 0';
        totalEl.textContent = 'Rs. 0';
        return;
    }

    container.innerHTML = posCart.map(item => {
        const product = state.products.find(p => p.id === item.id);
        const imageHtml = product && product.image ? `<img loading="lazy" decoding="async" src="${product.image}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px; flex-shrink: 0;" alt="">` : `<div style="width: 48px; height: 48px; background: var(--clr-bg-app); border-radius: 6px; flex-shrink: 0;"></div>`;
        
        let sizeHtml = '';
        let modifiersHtml = '';
        if (item.variant) {
            // Very basic heuristic to separate size vs modifiers if they are comma separated
            let parts = item.variant.split(',').map(s => s.trim());
            // Usually first part might be size if it contains 'Small', 'Medium', 'Large', 'Liters'
            let sizeParts = parts.filter(p => p.includes('Small') || p.includes('Medium') || p.includes('Large') || p.includes('Liters') || p.includes('Regular'));
            let modParts = parts.filter(p => !sizeParts.includes(p));
            
            if (sizeParts.length > 0) sizeHtml = `<div style="font-size: 0.75rem; color: var(--clr-text-secondary); margin-top: 2px;">Size: ${sizeParts.join(', ')}</div>`;
            if (modParts.length > 0) modifiersHtml = `<div style="font-size: 0.75rem; color: var(--clr-text-secondary); margin-top: 2px;">Adds: ${modParts.join(', ')}</div>`;
            
            if (!sizeHtml && !modifiersHtml) {
                modifiersHtml = `<div style="font-size: 0.75rem; color: var(--clr-text-secondary); margin-top: 2px;">${item.variant}</div>`;
            }
        }

        return `
        <div class="pos-cart-item" style="display: flex; gap: 0.75rem; align-items: flex-start; padding-bottom: 1rem; margin-bottom: 1rem; border-bottom: 1px dashed var(--clr-border);">
            ${imageHtml}
            <div style="flex:1;">
                <div style="font-weight: 600; font-size: 0.95rem; color: var(--clr-text-primary);">${item.name}</div>
                ${sizeHtml}
                ${modifiersHtml}
                <div style="font-weight: 500; color: var(--clr-text-primary); font-size: 0.8rem; margin-top: 0.4rem;">${state.restaurant.currency} ${item.price} <span style="color: var(--clr-text-secondary);">x ${item.qty}</span></div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
                <div style="font-weight: 700; font-size: 1rem; color: var(--clr-primary); white-space: nowrap;">
                    ${state.restaurant.currency} ${(item.price * item.qty).toLocaleString()}
                </div>
                <button class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; border-color: var(--clr-danger); color: var(--clr-danger); background: var(--clr-danger-bg);" onclick="removeFromPOSCart('${item.cartId}')">Remove</button>
            </div>
        </div>
    `}).join('');

    const subtotal = posCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = Math.round(subtotal * state.restaurant.taxRate);
    const discount = window.currentPOSDiscount || 0;
    const total = subtotal + tax - discount;

    subtotalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
    taxEl.textContent = `Rs. ${tax.toLocaleString()}`;
    const discountEl = document.getElementById('pos-discount');
    if (discountEl) discountEl.textContent = `Rs. ${discount.toLocaleString()}`;
    totalEl.textContent = `Rs. ${total.toLocaleString()}`;
}

window.setPOSOrderType = function(type, btnElement) {
    currentPOSOrderType = type;
    document.querySelectorAll('.pos-type-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    renderPOSDynamicForm();
};

window.renderPOSDynamicForm = function() {
    const container = document.getElementById('pos-dynamic-form');
    if (!container) return;
    
    let html = '';
    if (currentPOSOrderType === 'Dine-in') {
        html = `
            <input type="text" id="pos-table" class="pos-input" placeholder="Table Number (e.g. T-04)" style="width:100%; margin-bottom: 0.5rem;">
            <div style="display:flex; gap:0.5rem;">
                <input type="number" id="pos-guests" class="pos-input" placeholder="Guests" min="1" max="20" style="flex:1;">
                <input type="text" id="pos-waiter" class="pos-input" placeholder="Waiter Name" style="flex:1;">
            </div>
        `;
    } else if (currentPOSOrderType === 'Takeaway') {
        html = `
            <input type="text" id="pos-field-customer" class="pos-input" placeholder="Customer Name">
            <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="pos-field-phone" class="pos-input" placeholder="Phone" style="flex:1;">
                <select id="pos-field-pickup" class="pos-input" style="width:100px;">
                    <option value="ASAP">ASAP</option>
                    <option value="30 mins">30 mins</option>
                </select>
            </div>
        `;
    } else if (currentPOSOrderType === 'Delivery') {
        html = `
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input type="text" id="pos-field-customer" class="pos-input" placeholder="Customer" style="flex:1;">
                <input type="text" id="pos-field-phone" class="pos-input" placeholder="Phone" style="width:120px;">
            </div>
            <input type="text" id="pos-field-address" class="pos-input" placeholder="Delivery Address" style="margin-bottom: 0.5rem;">
            <input type="text" id="pos-area" class="pos-input" placeholder="Area/Zone (e.g. )" style="width:100%; margin-bottom: 0.5rem;">
            <div style="display:flex; gap:0.5rem;">
                <input type="text" id="pos-delivery-fee" class="pos-input" placeholder="Delivery Fee (Rs.)" style="flex:1;">
                <input type="text" id="pos-instructions" class="pos-input" placeholder="Delivery Instructions" style="flex:1;">
            </div>
        `;
    }
    container.innerHTML = html;
};

window.submitPOSOrder = function() {
    if (posCart.length === 0) {
        showToast("Cart is empty!", "error");
        return;
    }

    const state = window.Store.state;
    const subtotal = posCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let total = subtotal + Math.round(subtotal * state.restaurant.taxRate);
    
    // Extract dynamic fields based on type
    let dynamicData = {};
    if (currentPOSOrderType === 'Dine-in') {
        dynamicData.tableId = document.getElementById('pos-field-table')?.value;
        dynamicData.guests = document.getElementById('pos-field-guests')?.value || 1;
        dynamicData.waiter = document.getElementById('pos-field-waiter')?.value;
        dynamicData.customer = "Table " + dynamicData.tableId;
    } else if (currentPOSOrderType === 'Takeaway') {
        dynamicData.customer = document.getElementById('pos-field-customer')?.value || 'Walk-in';
        dynamicData.phone = document.getElementById('pos-field-phone')?.value;
        dynamicData.pickupTime = document.getElementById('pos-field-pickup')?.value;
    } else if (currentPOSOrderType === 'Delivery') {
        dynamicData.customer = document.getElementById('pos-field-customer')?.value || 'Walk-in';
        dynamicData.phone = document.getElementById('pos-field-phone')?.value;
        dynamicData.address = document.getElementById('pos-field-address')?.value;
        dynamicData.zone = document.getElementById('pos-field-zone')?.value;
        dynamicData.deliveryFee = dynamicData.zone === 'Zone A' ? 150 : 250;
        total += dynamicData.deliveryFee;
    }

    const newOrder = {
        id: (10500 + state.orders.length).toString(),
        timestamp: Date.now(),
        customer: dynamicData.customer,
        type: currentPOSOrderType,
        source: 'POS',
        branchId: "b1",
        total: total,
        paymentStatus: currentPOSOrderType === 'Dine-in' ? "Unpaid" : "Paid", // Example assumption
        kitchenStatus: "New",
        deliveryStatus: currentPOSOrderType === 'Delivery' ? "Pending" : "N/A",
        status: "New",
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        items: [...posCart],
        ...dynamicData
    };

    // Add to Store (This simulates a backend POST)
    state.orders.push(newOrder);
    window.Store.notify(); // Triggers UI updates across all views

    showToast(`Order #${newOrder.id} (${currentPOSOrderType}) submitted successfully!`, "success");
    clearPOSCart();
};

/* ==========================================================================
   Kitchen Confirmation Modal (Phase 4)
   ========================================================================== */
window.openKitchenConfirmModal = function() {
    if (posCart.length === 0) {
        showToast("Cart is empty!", "error");
        return;
    }
    const state = window.Store.state;
    const subtotal = posCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = Math.round(subtotal * state.restaurant.taxRate);
    let total = subtotal + tax;

    let orderInfoHTML = `
        <div class="km-order-info">
            <div><span>Type:</span> <strong style="color:var(--clr-primary);">${currentPOSOrderType}</strong></div>
    `;
    
    if (currentPOSOrderType === 'Dine-in') {
        const table = document.getElementById('pos-field-table')?.value || 'N/A';
        const waiter = document.getElementById('pos-field-waiter')?.value || 'N/A';
        orderInfoHTML += `<div><span>Table:</span> <strong>${table}</strong></div><div><span>Waiter:</span> <strong>${waiter}</strong></div>`;
    } else {
        const customer = document.getElementById('pos-field-customer')?.value || 'Walk-in';
        orderInfoHTML += `<div><span>Customer:</span> <strong>${customer}</strong></div>`;
        if (currentPOSOrderType === 'Delivery') {
            const deliveryFee = document.getElementById('pos-field-zone')?.value === 'Zone A' ? 150 : 250;
            total += deliveryFee;
            orderInfoHTML += `<div><span>Delivery Fee:</span> <strong>${state.restaurant.currency} ${deliveryFee}</strong></div>`;
        }
    }
    orderInfoHTML += `</div>`;

    const itemsHTML = posCart.map(item => `
        <div class="km-item-row">
            <div class="km-item-qty">${item.qty}x</div>
            <div class="km-item-details">
                <div class="km-item-name">${item.name}</div>
                ${item.variant ? `<div class="km-item-variant">${item.variant.name}</div>` : ''}
                ${item.addons && item.addons.length > 0 ? `<div class="km-item-variant">+ ${item.addons.map(a => a.name).join(', ')}</div>` : ''}
                ${item.notes ? `<div class="km-item-variant" style="color:var(--clr-warning);"><i>Note: ${item.notes}</i></div>` : ''}
            </div>
            <div class="km-item-price">${state.restaurant.currency} ${item.price * item.qty}</div>
        </div>
    `).join('');

    const body = document.getElementById('kitchen-modal-body');
    body.innerHTML = `
        <div class="km-section-title">Order Details</div>
        ${orderInfoHTML}
        
        <div class="km-section-title">Items to Prepare</div>
        <div class="km-items-list">
            ${itemsHTML}
        </div>
        
        <div class="km-total-row">
            <span>Total Payable:</span>
            <span>${state.restaurant.currency} ${total}</span>
        </div>
    `;

    document.getElementById('kitchen-confirm-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
};

window.closeKitchenConfirmModal = function() {
    document.getElementById('kitchen-confirm-modal').classList.remove('open');
    document.body.style.overflow = '';
};

window.confirmSendToKitchen = function() {
    closeKitchenConfirmModal();
    window.submitPOSOrder();
};

/* ==========================================================================
   Phase 2: POS Payment/Checkout Flow
   ========================================================================== */
window.openPOSPaymentModal = function() {
    if (posCart.length === 0) {
        showToast("Cart is empty!", "error");
        return;
    }
    const state = window.Store.state;
    const subtotal = posCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = Math.round(subtotal * state.restaurant.taxRate);
    let total = subtotal + tax - (window.currentPOSDiscount || 0);
    
    // Delivery fee check
    if (currentPOSOrderType === 'Delivery') {
        const zone = document.getElementById('pos-field-zone')?.value;
        const deliveryFee = zone === 'Zone A' ? 150 : 250;
        total += deliveryFee;
    }

    document.getElementById('generic-modal-title').textContent = `Checkout`;
    document.getElementById('generic-modal-body').innerHTML = `
        <div style="font-size: 1.25rem; font-weight: 700; text-align: center; margin-bottom: 1.5rem; color: var(--clr-primary);">
            Total Due: ${state.restaurant.currency} ${total.toLocaleString()}
        </div>
        
        <div style="margin-bottom: 1rem;">
            <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">Select Payment Method</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border: 1px solid var(--clr-border); border-radius: 6px; cursor: pointer;">
                    <input type="radio" name="pos-pay-method" value="Cash" checked onchange="toggleCashInput(true)">
                    <span>💵 Cash</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border: 1px solid var(--clr-border); border-radius: 6px; cursor: pointer;">
                    <input type="radio" name="pos-pay-method" value="Card" onchange="toggleCashInput(false)">
                    <span>💳 Credit/Debit Card</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border: 1px solid var(--clr-border); border-radius: 6px; cursor: pointer;">
                    <input type="radio" name="pos-pay-method" value="Wallet" onchange="toggleCashInput(false)">
                    <span>📱 JazzCash/EasyPaisa</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border: 1px solid var(--clr-border); border-radius: 6px; cursor: pointer;">
                    <input type="radio" name="pos-pay-method" value="Later" onchange="toggleCashInput(false)">
                    <span>⏳ Pay Later</span>
                </label>
            </div>
        </div>
        
        <div id="cash-input-group" style="margin-bottom: 1.5rem;">
            <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">Amount Tendered</label>
            <input type="number" id="pos-cash-tendered" value="${total}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--clr-border); border-radius: 6px; font-size: 1.1rem; font-weight: 600; background: var(--clr-bg-app); color: var(--clr-text-primary);" oninput="updatePOSChange(${total})">
            <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
                <span style="font-size: 0.85rem; color: var(--clr-text-secondary);">Change Due:</span>
                <strong id="pos-cash-change" style="color: var(--clr-success); font-size: 1.1rem;">${state.restaurant.currency} 0</strong>
            </div>
        </div>
    `;

    document.getElementById('generic-modal-save').textContent = 'Process Payment';
    document.getElementById('generic-modal-save').onclick = () => { processPOSPayment(total); };
    document.getElementById('generic-modal-overlay').style.display = 'flex';
};

window.toggleCashInput = function(show) {
    document.getElementById('cash-input-group').style.display = show ? 'block' : 'none';
};

window.updatePOSChange = function(total) {
    const tendered = parseFloat(document.getElementById('pos-cash-tendered').value) || 0;
    const change = Math.max(0, tendered - total);
    document.getElementById('pos-cash-change').textContent = `${window.Store.state.restaurant.currency} ${change.toLocaleString()}`;
};

window.processPOSPayment = function(total) {
    const methodElement = document.querySelector('input[name="pos-pay-method"]:checked');
    const method = methodElement ? methodElement.value : 'Cash';
    
    // Temporarily attach payment info to window to be used by submitPOSOrder
    window.currentPOSPaymentMethod = method;
    window.currentPOSPaymentStatus = method === 'Later' ? 'Unpaid' : 'Paid';
    
    // Submit order
    window.submitPOSOrder();
    closeGenericModal();
    
    // Reset temporary variables
    window.currentPOSDiscount = 0;
    window.currentPOSPaymentMethod = null;
    window.currentPOSPaymentStatus = null;
    renderPOSCart();
};

window.openApplyDiscountModal = function() {
    if (posCart.length === 0) { showToast("Cart is empty!", "error"); return; }
    
    document.getElementById('generic-modal-title').textContent = 'Apply Discount';
    document.getElementById('generic-modal-body').innerHTML = `
        <div style="margin-bottom: 1rem;">
            <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">Discount Type</label>
            <select id="pos-discount-type" style="width: 100%; padding: 0.75rem; border: 1px solid var(--clr-border); border-radius: 6px; background: var(--clr-bg-app); color: var(--clr-text-primary);">
                <option value="amount">Fixed Amount (Rs.)</option>
                <option value="percentage">Percentage (%)</option>
            </select>
        </div>
        <div style="margin-bottom: 1rem;">
            <label style="font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">Discount Value</label>
            <input type="number" id="pos-discount-val" style="width: 100%; padding: 0.75rem; border: 1px solid var(--clr-border); border-radius: 6px; background: var(--clr-bg-app); color: var(--clr-text-primary);" placeholder="e.g. 500 or 10">
        </div>
    `;
    document.getElementById('generic-modal-save').textContent = 'Apply';
    document.getElementById('generic-modal-save').onclick = () => { applyPOSDiscount(); };
    document.getElementById('generic-modal-overlay').style.display = 'flex';
};

window.applyPOSDiscount = function() {
    const type = document.getElementById('pos-discount-type').value;
    const val = parseFloat(document.getElementById('pos-discount-val').value) || 0;
    
    const subtotal = posCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let discount = 0;
    
    if (type === 'amount') {
        discount = val;
    } else {
        discount = Math.round(subtotal * (val / 100));
    }
    
    if (discount > subtotal) {
        showToast("Discount cannot exceed subtotal", "error");
        return;
    }
    
    window.currentPOSDiscount = discount;
    showToast(`Discount of Rs. ${discount} applied.`, "success");
    closeGenericModal();
    renderPOSCart();
};

window.openSplitBillModalPOS = function() {
    if (posCart.length === 0) { showToast("Cart is empty!", "error"); return; }
    const subtotal = posCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = Math.round(subtotal * window.Store.state.restaurant.taxRate);
    const total = subtotal + tax - (window.currentPOSDiscount || 0);
    
    // Inject into generic modal
    document.getElementById('generic-modal-title').textContent = `Split Bill (POS)`;
    document.getElementById('generic-modal-body').innerHTML = `
        <p style="color:var(--clr-text-secondary); margin-bottom:1rem;">Total: <strong>Rs. ${total.toLocaleString()}</strong></p>
        <div>
            <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:0.5rem;">Split by number of people</label>
            <input type="number" id="split-count-pos" min="2" max="20" value="2" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:6px; background:var(--clr-bg-app); color:var(--clr-text-primary);" oninput="updateSplitPreviewPOS(${total})">
        </div>
        <div id="split-preview-pos" style="margin-top:1rem; padding:1rem; background:var(--clr-bg-app); border-radius:8px; text-align:center; font-size:1.1rem; font-weight:700; color:var(--clr-primary);">
            Rs. ${Math.round(total / 2).toLocaleString()} per person
        </div>
    `;
    document.getElementById('generic-modal-save').textContent = 'Print Split Bills';
    document.getElementById('generic-modal-save').onclick = () => { showToast('Split bills printed!', 'success'); closeGenericModal(); };
    document.getElementById('generic-modal-overlay').style.display = 'flex';
};

window.updateSplitPreviewPOS = function(total) {
    const count = parseInt(document.getElementById('split-count-pos').value) || 2;
    document.getElementById('split-preview-pos').textContent = `Rs. ${Math.round(total / count).toLocaleString()} per person`;
};
