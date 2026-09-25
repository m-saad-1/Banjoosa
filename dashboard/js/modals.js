// --- GENERIC MODAL LOGIC (Phase 3) ---
let currentModalContext = null;

window.openGenericModal = function(type, editId = null) {
    const overlay = document.getElementById('generic-modal-overlay');
    const title = document.getElementById('generic-modal-title');
    const body = document.getElementById('generic-modal-body');
    const saveBtn = document.getElementById('generic-modal-save');
    
    if (!overlay || !title || !body || !saveBtn) return;
    
    currentModalContext = { type, editId };
    body.innerHTML = '';
    
    let state = window.Store.state;
    let data = null;

    if (type === 'product') {
        title.textContent = editId ? 'Edit Product' : 'Add New Product';
        if (editId) data = state.products.find(p => p.id === editId);
        
        let categoryOptions = state.categories.map(c => `<option value="${c.id}" ${data && data.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('');
        
        body.innerHTML = `
            <input type="text" id="modal-p-name" placeholder="Product Name" value="${data ? data.name : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <textarea id="modal-p-desc" placeholder="Description" rows="2" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">${data ? (data.desc || '') : ''}</textarea>
            
            <div style="display: flex; gap: 0.5rem;">
                <input type="number" id="modal-p-price" placeholder="Price (Rs.)" value="${data ? data.price : ''}" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <input type="number" id="modal-p-orig-price" placeholder="Original Price" value="${data && data.originalPrice ? data.originalPrice : ''}" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            </div>
            
            <div style="display: flex; gap: 0.5rem;">
                <input type="number" id="modal-p-disc-price" placeholder="Discounted Price" value="${data && data.discountedPrice ? data.discountedPrice : ''}" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <input type="number" id="modal-p-discount" placeholder="Discount (%)" value="${data && data.discount ? data.discount : ''}" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            </div>

            <div style="display: flex; gap: 0.5rem;">
                <input type="number" id="modal-p-stock" placeholder="Stock Qty" value="${data && data.stock ? data.stock : ''}" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <input type="file" id="modal-p-image" accept="image/*" style="width:50%; padding:0.4rem; border:1px solid var(--clr-border); border-radius:4px;">
            </div>

            <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="modal-p-sizes" placeholder="Sizes (comma separated)" value="${data && data.sizes ? data.sizes : ''}" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <input type="text" id="modal-p-modifiers" placeholder="Modifiers (comma separated)" value="${data && data.modifiers ? data.modifiers : ''}" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            </div>

            <div style="display: flex; gap: 0.5rem;">
                <select id="modal-p-cat" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                    ${categoryOptions}
                </select>
                <select id="modal-p-status" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                    <option value="Available" ${data && data.status === 'Available' ? 'selected' : ''}>Available</option>
                    <option value="Low Stock" ${data && data.status === 'Low Stock' ? 'selected' : ''}>Low Stock</option>
                    <option value="Out of Stock" ${data && data.status === 'Out of Stock' ? 'selected' : ''}>Out of Stock</option>
                </select>
            </div>
            
            <input type="datetime-local" id="modal-p-deal-end" placeholder="Deal End Date/Time" value="${data && data.dealEnd ? data.dealEnd : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;" title="Deal End Date/Time">
        `;
    }
    else if (type === 'rider') {
        title.textContent = editId ? 'Edit Rider' : 'Add New Rider';
        if (editId) data = state.riders.find(r => r.id === editId);
        
        body.innerHTML = `
            <input type="text" id="modal-r-name" placeholder="Rider Name" value="${data ? data.name : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <input type="text" id="modal-r-phone" placeholder="Phone Number" value="${data && data.phone ? data.phone : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <input type="email" id="modal-r-email" placeholder="Email Address" value="${data && data.email ? data.email : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <input type="text" id="modal-r-address" placeholder="Home Address" value="${data && data.address ? data.address : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <div style="display: flex; gap: 0.5rem;">
                <select id="modal-r-vehicle" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                    <option value="Bike" ${data && data.vehicle === 'Bike' ? 'selected' : ''}>Bike</option>
                    <option value="Car" ${data && data.vehicle === 'Car' ? 'selected' : ''}>Car</option>
                </select>
                <input type="text" id="modal-r-vehiclenum" placeholder="Vehicle No." value="${data && data.vehicleNum ? data.vehicleNum : ''}" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            </div>
            <select id="modal-r-status" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <option value="Online" ${data && data.status === 'Online' ? 'selected' : ''}>Online</option>
                <option value="Offline" ${data && data.status === 'Offline' ? 'selected' : ''}>Offline</option>
            </select>
        `;
    }
    else if (type === 'branch') {
        title.textContent = editId ? 'Edit Branch' : 'Add New Branch';
        if (editId) data = state.branches.find(b => b.id === editId);
        
        body.innerHTML = `
            <input type="text" id="modal-b-name" placeholder="Branch Name" value="${data ? data.name : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <select id="modal-b-status" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <option value="Open" ${data && data.status === 'Open' ? 'selected' : ''}>Open</option>
                <option value="Busy" ${data && data.status === 'Busy' ? 'selected' : ''}>Busy</option>
                <option value="Closed" ${data && data.status === 'Closed' ? 'selected' : ''}>Closed</option>
            </select>
        `;
    }
    else if (type === 'employee') {
        title.textContent = editId ? 'Edit Employee' : 'Add Employee';
        if (editId) data = state.staff.find(e => e.id === editId);
        
        body.innerHTML = `
            <input type="text" id="modal-e-name" placeholder="Employee Name" value="${data ? data.name : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <input type="text" id="modal-e-role" placeholder="Role (e.g. Cashier, Chef)" value="${data ? data.role : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <input type="text" id="modal-e-shift" placeholder="Shift (e.g. 09:00 - 18:00)" value="${data ? data.shift : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <select id="modal-e-status" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <option value="Present" ${data && data.status === 'Present' ? 'selected' : ''}>Present</option>
                <option value="Late" ${data && data.status === 'Late' ? 'selected' : ''}>Late</option>
                <option value="Scheduled" ${data && data.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
            </select>
        `;
    }
    else if (type === 'receive-stock') {
        title.textContent = 'Receive Stock';
        let stockOptions = state.inventory.map(i => `<option value="${i.id}">${i.name} (${i.sku})</option>`).join('');
        body.innerHTML = `
            <select id="modal-stock-item" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
                ${stockOptions}
            </select>
            <input type="number" id="modal-stock-qty" placeholder="Quantity to Receive" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <input type="number" id="modal-stock-cost" placeholder="Total Cost (Rs.)" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
        `;
    }
    else if (type === 'supplier') {
        title.textContent = 'New Supplier';
        body.innerHTML = `
            <input type="text" id="modal-sup-name" placeholder="Supplier Name" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <input type="text" id="modal-sup-contact" placeholder="Contact Number" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <input type="text" id="modal-sup-cat" placeholder="Categories Supplied" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
        `;
    }
    else if (type === 'waste') {
        title.textContent = 'Record Waste';
        body.innerHTML = `
            <input type="text" id="modal-waste-item" placeholder="Item / Ingredient Name" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <input type="text" id="modal-waste-qty" placeholder="Quantity (e.g. 500g)" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <input type="text" id="modal-waste-reason" placeholder="Reason (e.g. Expired)" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <input type="number" id="modal-waste-value" placeholder="Estimated Value Lost (Rs.)" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
        `;
    }
    else if (type === 'booking') {
        title.textContent = 'New Booking';
        body.innerHTML = `
            <input type="text" id="modal-bk-customer" placeholder="Customer Name" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <input type="text" id="modal-bk-phone" placeholder="Phone Number" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <input type="datetime-local" id="modal-bk-date" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input type="number" id="modal-bk-guests" placeholder="Guests" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <select id="modal-bk-table" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                    ${state.tables.map(t => `<option value="${t.id}">${t.id} (Cap: ${t.capacity})</option>`).join('')}
                </select>
            </div>
            <select id="modal-bk-occasion" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
                <option value="">No Special Occasion</option>
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Business Meeting">Business Meeting</option>
            </select>
            <textarea id="modal-bk-notes" placeholder="Special Requests / Notes" rows="2" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;"></textarea>
        `;
    }
    else if (type === 'campaign') {
        title.textContent = 'Create Campaign';
        body.innerHTML = `
            <input type="text" id="modal-camp-name" placeholder="Campaign Name" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <select id="modal-camp-segment" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                    <option value="All">All Customers</option>
                    <option value="VIP">VIP</option>
                    <option value="At-Risk">At-Risk</option>
                    <option value="New">New</option>
                </select>
                <select id="modal-camp-channel" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                    <option value="SMS">SMS</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                </select>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <input type="number" id="modal-camp-budget" placeholder="Budget (Rs.)" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <input type="date" id="modal-camp-start" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            </div>
        `;
    }
    
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.closeGenericModal = function() {
    document.getElementById('generic-modal-overlay').style.display = 'none';
    document.body.style.overflow = '';
};

document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('generic-modal-save');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (!currentModalContext) return;
            const state = window.Store.state;
            const { type, editId } = currentModalContext;
            
            if (type === 'product') {
                const pName = document.getElementById('modal-p-name').value;
                const pDesc = document.getElementById('modal-p-desc').value;
                const pPrice = parseInt(document.getElementById('modal-p-price').value) || 0;
                const pOrigPrice = parseInt(document.getElementById('modal-p-orig-price').value) || null;
                const pDiscPrice = parseInt(document.getElementById('modal-p-disc-price').value) || null;
                const pDiscount = parseInt(document.getElementById('modal-p-discount').value) || null;
                const pStock = parseInt(document.getElementById('modal-p-stock').value) || null;
                const pSizes = document.getElementById('modal-p-sizes').value;
                const pModifiers = document.getElementById('modal-p-modifiers').value;
                const pDealEnd = document.getElementById('modal-p-deal-end').value;
                const pCat = document.getElementById('modal-p-cat').value;
                const pStatus = document.getElementById('modal-p-status').value;
                
                if (pName) {
                    if (editId) {
                        const product = state.products.find(p => p.id === editId);
                        if (product) {
                            product.name = pName; product.desc = pDesc; product.price = pPrice; 
                            product.originalPrice = pOrigPrice; product.discountedPrice = pDiscPrice;
                            product.discount = pDiscount; product.stock = pStock;
                            product.sizes = pSizes; product.modifiers = pModifiers;
                            product.dealEnd = pDealEnd; product.categoryId = pCat; product.status = pStatus;
                        }
                    } else {
                        state.products.push({
                            id: 'p' + Math.floor(Math.random() * 10000),
                            name: pName, desc: pDesc, price: pPrice, 
                            originalPrice: pOrigPrice, discountedPrice: pDiscPrice,
                            discount: pDiscount, stock: pStock,
                            sizes: pSizes, modifiers: pModifiers,
                            dealEnd: pDealEnd, categoryId: pCat, status: pStatus,
                            image: '../assets/images/burger-1.avif'
                        });
                    }
                }
            }
            else if (type === 'rider') {
                const rName = document.getElementById('modal-r-name').value;
                const rPhone = document.getElementById('modal-r-phone').value;
                const rEmail = document.getElementById('modal-r-email').value;
                const rAddress = document.getElementById('modal-r-address').value;
                const rVehicle = document.getElementById('modal-r-vehicle').value;
                const rVehicleNum = document.getElementById('modal-r-vehiclenum').value;
                const rStatus = document.getElementById('modal-r-status').value;
                if (rName) {
                    if (editId) {
                        const rider = state.riders.find(r => r.id === editId);
                        if (rider) { 
                            rider.name = rName; rider.phone = rPhone; rider.email = rEmail;
                            rider.address = rAddress; rider.vehicle = rVehicle; 
                            rider.vehicleNum = rVehicleNum; rider.status = rStatus; 
                        }
                    } else {
                        state.riders.push({ 
                            id: 'r' + Math.floor(Math.random()*10000), 
                            name: rName, phone: rPhone, email: rEmail, 
                            address: rAddress, vehicle: rVehicle, vehicleNum: rVehicleNum,
                            status: rStatus, activeDeliveries: 0, completedToday: 0 
                        });
                    }
                }
            }
            else if (type === 'branch') {
                const bName = document.getElementById('modal-b-name').value;
                const bStatus = document.getElementById('modal-b-status').value;
                if (bName) {
                    if (editId) {
                        const branch = state.branches.find(b => b.id === editId);
                        if (branch) { branch.name = bName; branch.status = bStatus; }
                    } else {
                        state.branches.push({ id: 'b' + Math.floor(Math.random()*10000), name: bName, status: bStatus, todayRevenue: 0 });
                    }
                }
            }
            else if (type === 'employee') {
                const eName = document.getElementById('modal-e-name').value;
                const eRole = document.getElementById('modal-e-role').value;
                const eShift = document.getElementById('modal-e-shift').value;
                const eStatus = document.getElementById('modal-e-status').value;
                if (eName) {
                    if (editId) {
                        const emp = state.staff.find(e => e.id === editId);
                        if (emp) { emp.name = eName; emp.role = eRole; emp.shift = eShift; emp.status = eStatus; }
                    } else {
                        state.staff.push({ id: 'e' + Math.floor(Math.random()*10000), name: eName, role: eRole, shift: eShift, status: eStatus });
                    }
                }
            }
            else if (type === 'receive-stock') {
                const itemId = document.getElementById('modal-stock-item').value;
                const qty = parseInt(document.getElementById('modal-stock-qty').value) || 0;
                if (itemId && qty > 0) {
                    const item = state.inventory.find(i => i.id === itemId);
                    if (item) item.qty += qty;
                }
            }
            else if (type === 'supplier') {
                const sName = document.getElementById('modal-sup-name').value;
                const sContact = document.getElementById('modal-sup-contact').value;
                const sCat = document.getElementById('modal-sup-cat').value;
                if (sName) {
                    state.suppliers.push({
                        id: 's' + Math.floor(Math.random()*10000),
                        name: sName, contact: sContact, categories: sCat, balance: 0, lastDelivery: 'Just now', recentPOs: 'N/A', status: 'Active'
                    });
                }
            }
            else if (type === 'waste') {
                const wItem = document.getElementById('modal-waste-item').value;
                const wQty = document.getElementById('modal-waste-qty').value;
                const wReason = document.getElementById('modal-waste-reason').value;
                const wValue = parseInt(document.getElementById('modal-waste-value').value) || 0;
                if (wItem) {
                    state.waste.push({
                        id: 'w' + Math.floor(Math.random()*10000),
                        date: 'Today', item: wItem, qty: wQty, reason: wReason, value: wValue, loggedBy: 'Admin', status: 'Pending'
                    });
                }
            }
            else if (type === 'booking') {
                const bkCust = document.getElementById('modal-bk-customer').value;
                const bkPhone = document.getElementById('modal-bk-phone').value;
                const bkDateRaw = document.getElementById('modal-bk-date').value;
                const bkGuests = parseInt(document.getElementById('modal-bk-guests').value) || 1;
                const bkTable = document.getElementById('modal-bk-table').value;
                const bkOccasion = document.getElementById('modal-bk-occasion').value;
                const bkNotes = document.getElementById('modal-bk-notes').value;
                
                if (bkCust && bkDateRaw) {
                    const dt = new Date(bkDateRaw);
                    const formatted = 'Today, ' + dt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    state.reservations.push({
                        id: 'res' + Math.floor(Math.random()*10000),
                        customer: bkCust, phone: bkPhone, datetime: formatted, guests: bkGuests, tableId: bkTable, status: 'Confirmed', occasion: bkOccasion, notes: bkNotes
                    });
                }
            }
            else if (type === 'campaign') {
                const cName = document.getElementById('modal-camp-name').value;
                const cSegment = document.getElementById('modal-camp-segment').value;
                const cChannel = document.getElementById('modal-camp-channel').value;
                
                if (cName) {
                    state.campaigns.unshift({
                        id: "cmp" + Math.floor(Math.random() * 1000),
                        name: cName + ` (${cSegment})`,
                        channel: cChannel,
                        status: "Active",
                        conversions: 0,
                        revenue: 0
                    });
                } else {
                    showToast("Please enter a campaign name.", "error");
                    return; // Prevent modal from closing if invalid
                }
            }
            
            window.Store.notify(); // re-render UI components globally
            closeGenericModal();
            showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} saved successfully!`, 'success');
        });
    }
});

// ==========================================================================
// About Panel Modal
// ==========================================================================
window.openAboutPanelModal = function() {
    const overlay = document.getElementById('about-panel-modal');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
};

window.closeAboutPanelModal = function() {
    const overlay = document.getElementById('about-panel-modal');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
};
