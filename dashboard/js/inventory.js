// Inventory & Supply Chain Logic

document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic
    const tabs = document.querySelectorAll('.inner-tab');
    const contents = document.querySelectorAll('.inv-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Subscriptions
    window.Store.subscribe((state) => {
        if(document.getElementById('view-inventory').classList.contains('active')){
            renderInventory(state);
        }
    });

    document.querySelectorAll('.nav-item[data-target="view-inventory"]').forEach(btn => {
        btn.addEventListener('click', () => {
            renderInventory(window.Store.state);
        });
    });
});

function renderInventory(state) {
    renderStock(state);
    renderRecipes(state);
    renderSuppliers(state);
    renderWaste(state);
}

function renderStock(state) {
    const tbody = document.getElementById('inv-stock-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    state.inventory.forEach(item => {
        let statusClass = 'badge-success';
        let statusText = 'In Stock';
        
        if (item.qty <= item.minQty) {
            statusClass = 'badge-warning';
            statusText = 'Low Stock';
        }
        if (item.qty === 0) {
            statusClass = 'badge-danger';
            statusText = 'Out of Stock';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 500;">${item.name}</td>
            <td style="color: var(--clr-text-secondary); font-size: 0.85rem;">${item.sku}</td>
            <td style="font-weight: 600;">${item.qty} ${item.unit}</td>
            <td>Rs. ${item.cost} / ${item.unit}</td>
            <td><span class="badge ${statusClass}">${statusText}</span></td>
            <td><button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="openStockAdjustModal('${item.id}')">Adjust</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderRecipes(state) {
    const tbody = document.getElementById('inv-recipe-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    state.recipes.forEach(recipe => {
        const tr = document.createElement('tr');
        
        const fcPercent = ((recipe.cost / recipe.price) * 100).toFixed(1);
        let fcClass = fcPercent > 35 ? 'color: var(--clr-danger);' : 'color: var(--clr-success);';

        tr.innerHTML = `
            <td style="font-weight: 600;">${recipe.name}</td>
            <td style="font-size: 0.85rem; color: var(--clr-text-secondary);">
                ${recipe.ingredients.join('<br>')}
            </td>
            <td>Rs. ${recipe.cost.toLocaleString()}</td>
            <td>Rs. ${recipe.price.toLocaleString()}</td>
            <td style="font-weight: 700; ${fcClass}">${fcPercent}%</td>
            <td><button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="openRecipeEditModal('${recipe.productId}')">Edit Recipe</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderSuppliers(state) {
    const tbody = document.getElementById('inv-supplier-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    state.suppliers.forEach(supplier => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 600;">${supplier.name}</td>
            <td>${supplier.contact}</td>
            <td style="font-size: 0.85rem;">${supplier.categories}</td>
            <td style="color: ${supplier.balance > 0 ? 'var(--clr-danger)' : 'var(--clr-success)'}; font-weight: 600;">
                Rs. ${supplier.balance.toLocaleString()}
            </td>
            <td style="font-size: 0.85rem; color: var(--clr-text-secondary);">${supplier.lastDelivery}</td>
            <td style="font-size: 0.85rem; font-weight: 500;">${supplier.recentPOs}</td>
            <td><span class="badge ${supplier.status === 'Active' ? 'badge-success' : 'badge-danger'}">${supplier.status}</span></td>
            <td><button class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="openSupplierPOModal('${supplier.id}')">Add PO</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderWaste(state) {
    const tbody = document.getElementById('inv-waste-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    state.waste.forEach(log => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-size: 0.85rem;">${log.date}</td>
            <td style="font-weight: 500;">${log.item}</td>
            <td>${log.qty}</td>
            <td style="color: var(--clr-text-secondary); font-size: 0.85rem;">${log.reason}</td>
            <td style="color: var(--clr-danger); font-weight: 600;">Rs. ${log.value}</td>
            <td style="font-size: 0.85rem;">${log.loggedBy}</td>
            <td><span class="badge ${log.status === 'Reviewed' ? 'badge-success' : 'badge-warning'}">${log.status}</span></td>
            <td><button class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Details</button></td>
        `;
        tbody.appendChild(tr);
    });
}

/* ==========================================================================
   Phase 4: Inventory Management Modals
   ========================================================================== */

window.openStockAdjustModal = function(itemId) {
    const item = window.Store.state.inventory.find(i => i.id === itemId);
    if (!item) return;
    
    document.getElementById('generic-modal-title').textContent = `Adjust Stock - ${item.name}`;
    document.getElementById('generic-modal-body').innerHTML = `
        <div style="margin-bottom: 1rem;">
            <label style="font-size: 0.85rem; font-weight: 600;">Current Qty (${item.unit})</label>
            <input type="text" value="${item.qty}" disabled style="width: 100%; padding: 0.5rem; background: var(--clr-bg-app); border: 1px solid var(--clr-border); border-radius: 4px;">
        </div>
        <div style="margin-bottom: 1rem;">
            <label style="font-size: 0.85rem; font-weight: 600;">New Qty</label>
            <input type="number" id="adj-qty" value="${item.qty}" style="width: 100%; padding: 0.5rem; background: var(--clr-bg-app); border: 1px solid var(--clr-border); border-radius: 4px; color: var(--clr-text-primary);">
        </div>
        <div style="margin-bottom: 1rem;">
            <label style="font-size: 0.85rem; font-weight: 600;">Reason</label>
            <select id="adj-reason" style="width: 100%; padding: 0.5rem; background: var(--clr-bg-app); border: 1px solid var(--clr-border); border-radius: 4px; color: var(--clr-text-primary);">
                <option>New Delivery Received</option>
                <option>Physical Count Correction</option>
                <option>Waste / Spoilage</option>
            </select>
        </div>
    `;
    
    document.getElementById('generic-modal-save').textContent = 'Save Adjustment';
    document.getElementById('generic-modal-save').onclick = () => {
        item.qty = parseFloat(document.getElementById('adj-qty').value) || 0;
        showToast(`Stock adjusted for ${item.name}`, 'success');
        window.Store.notify();
        closeGenericModal();
    };
    document.getElementById('generic-modal-overlay').style.display = 'flex';
};

window.openRecipeEditModal = function(productId) {
    const recipe = window.Store.state.recipes.find(r => r.productId === productId);
    if (!recipe) return;
    
    document.getElementById('generic-modal-title').textContent = `Edit Recipe - ${recipe.name}`;
    document.getElementById('generic-modal-body').innerHTML = `
        <div style="margin-bottom: 1rem;">
            <label style="font-size: 0.85rem; font-weight: 600;">Ingredients</label>
            <textarea id="rec-ingredients" rows="4" style="width: 100%; padding: 0.5rem; background: var(--clr-bg-app); border: 1px solid var(--clr-border); border-radius: 4px; color: var(--clr-text-primary);">${recipe.ingredients.join('\n')}</textarea>
        </div>
        <div style="display:flex; gap:1rem; margin-bottom: 1rem;">
            <div style="flex:1;">
                <label style="font-size: 0.85rem; font-weight: 600;">Cost (Rs.)</label>
                <input type="number" id="rec-cost" value="${recipe.cost}" style="width: 100%; padding: 0.5rem; background: var(--clr-bg-app); border: 1px solid var(--clr-border); border-radius: 4px; color: var(--clr-text-primary);">
            </div>
            <div style="flex:1;">
                <label style="font-size: 0.85rem; font-weight: 600;">Sale Price (Rs.)</label>
                <input type="number" id="rec-price" value="${recipe.price}" style="width: 100%; padding: 0.5rem; background: var(--clr-bg-app); border: 1px solid var(--clr-border); border-radius: 4px; color: var(--clr-text-primary);">
            </div>
        </div>
        <div style="font-size:0.85rem; color:var(--clr-info);">Updating this will recalculate Food Cost % dynamically.</div>
    `;
    
    document.getElementById('generic-modal-save').textContent = 'Save Recipe';
    document.getElementById('generic-modal-save').onclick = () => {
        recipe.ingredients = document.getElementById('rec-ingredients').value.split('\n').map(s => s.trim()).filter(Boolean);
        recipe.cost = parseFloat(document.getElementById('rec-cost').value) || 0;
        recipe.price = parseFloat(document.getElementById('rec-price').value) || 0;
        
        // Also update product catalog price
        const prod = window.Store.state.products.find(p => p.id === productId);
        if (prod) prod.price = recipe.price;
        
        showToast(`Recipe updated for ${recipe.name}`, 'success');
        window.Store.notify();
        closeGenericModal();
    };
    document.getElementById('generic-modal-overlay').style.display = 'flex';
};

window.openSupplierPOModal = function(supplierId) {
    const supplier = window.Store.state.suppliers.find(s => s.id === supplierId);
    if (!supplier) return;
    
    document.getElementById('generic-modal-title').textContent = `Create PO - ${supplier.name}`;
    document.getElementById('generic-modal-body').innerHTML = `
        <div style="margin-bottom: 1rem;">
            <label style="font-size: 0.85rem; font-weight: 600;">Items to Order</label>
            <textarea placeholder="e.g. 50kg Chicken Breast\n200x Burger Buns" rows="3" style="width: 100%; padding: 0.5rem; background: var(--clr-bg-app); border: 1px solid var(--clr-border); border-radius: 4px; color: var(--clr-text-primary);"></textarea>
        </div>
        <div style="margin-bottom: 1rem;">
            <label style="font-size: 0.85rem; font-weight: 600;">Expected Delivery Date</label>
            <input type="date" style="width: 100%; padding: 0.5rem; background: var(--clr-bg-app); border: 1px solid var(--clr-border); border-radius: 4px; color: var(--clr-text-primary);">
        </div>
        <div style="margin-bottom: 1rem;">
            <label style="font-size: 0.85rem; font-weight: 600;">Estimated Amount (Rs.)</label>
            <input type="number" placeholder="0" style="width: 100%; padding: 0.5rem; background: var(--clr-bg-app); border: 1px solid var(--clr-border); border-radius: 4px; color: var(--clr-text-primary);">
        </div>
    `;
    
    document.getElementById('generic-modal-save').textContent = 'Generate PO';
    document.getElementById('generic-modal-save').onclick = () => {
        showToast(`Purchase Order generated and sent to ${supplier.name}`, 'success');
        supplier.recentPOs = `#PO-${Math.floor(1000 + Math.random() * 9000)}`;
        window.Store.notify();
        closeGenericModal();
    };
    document.getElementById('generic-modal-overlay').style.display = 'flex';
};
