// KDS (Kitchen Display System) Logic

document.addEventListener('DOMContentLoaded', () => {
    window.Store.subscribe((state) => {
        if(document.getElementById('view-kds').classList.contains('active')){
            renderKDSBoard(state);
        }
    });

    // We also need to listen for view changes to initialize properly if needed
    document.querySelectorAll('.nav-item[data-target="view-kds"]').forEach(btn => {
        btn.addEventListener('click', () => {
            renderKDSBoard(window.Store.state);
        });
    });

    const stationFilter = document.getElementById('kds-station-filter');
    if (stationFilter) {
        stationFilter.addEventListener('change', () => {
            renderKDSBoard(window.Store.state);
        });
    }
});

function renderKDSBoard(state) {
    const colNew = document.querySelector('#kds-col-new .kds-column-body');
    const colPrep = document.querySelector('#kds-col-preparing .kds-column-body');
    const colReady = document.querySelector('#kds-col-ready .kds-column-body');
    const colCompleted = document.querySelector('#kds-col-completed .kds-column-body');
    
    if (!colNew || !colPrep || !colReady) return;

    colNew.innerHTML = '';
    colPrep.innerHTML = '';
    colReady.innerHTML = '';
    if (colCompleted) colCompleted.innerHTML = '';

    let newCount = 0;
    let prepCount = 0;
    let readyCount = 0;
    let compCount = 0;

    const kdsOrders = window.getBranchFilteredOrders(state).filter(o => ['New', 'Preparing', 'Ready', 'Completed'].includes(window.Store.getKitchenStatus(o)));

    kdsOrders.forEach(order => {
        const card = document.createElement('div');
        
        let kStatus = window.Store.getKitchenStatus(order);
        
        let statusClass = '';
        let nextAction = '';
        
        if (kStatus === 'New') {
            statusClass = 'new';
            nextAction = `
                <div style="display:flex; gap:0.25rem; margin-top: 0.5rem;">
                    <button class="btn btn-warning" style="flex:1; font-size: 0.75rem; padding: 0.25rem 0.4rem;" onclick="window.Store.updateOrderStatus('${order.id}', 'Preparing')">Start</button>
                </div>
            `;
            newCount++;
        } else if (kStatus === 'Preparing') {
            statusClass = 'preparing';
            nextAction = `<button class="btn btn-success" style="width:100%; font-size: 0.75rem; padding: 0.25rem 0.4rem; margin-top: 0.5rem;" onclick="window.Store.updateOrderStatus('${order.id}', 'Ready')">Mark Ready</button>`;
            prepCount++;
        } else if (kStatus === 'Ready') {
            statusClass = 'ready';
            nextAction = `<button class="btn btn-outline" style="width:100%; font-size: 0.75rem; padding: 0.25rem 0.4rem; margin-top: 0.5rem;" onclick="window.Store.updateOrderStatus('${order.id}', 'Completed')">Clear</button>`;
            readyCount++;
        } else if (kStatus === 'Completed') {
            statusClass = 'completed';
            compCount++;
        }

        if (kStatus === 'Completed' && !colCompleted) return;

        let itemsHtml = '';
        let hasVisibleItems = false;
        if (order.items && order.items.length > 0) {
            itemsHtml = order.items.map(i => {
                const product = state.products ? state.products.find(p => p.id === i.id) : null;
                
                // Station Filtering
                let matchesFilter = true;
                const filterVal = document.getElementById('kds-station-filter')?.value || 'all';
                if (filterVal !== 'all' && product) {
                    matchesFilter = false;
                    if (product.categoryId === 'c1') matchesFilter = true; // Combos show everywhere
                    if (filterVal === 'hot' && ['c2', 'c3', 'c4', 'c5'].includes(product.categoryId)) matchesFilter = true;
                    if (filterVal === 'cold' && ['c7', 'c8'].includes(product.categoryId)) matchesFilter = true;
                    if (filterVal === 'grill' && product.categoryId === 'c2') matchesFilter = true;
                    if (filterVal === 'drinks' && product.categoryId === 'c6') matchesFilter = true;
                }
                
                if (!matchesFilter) return '';
                hasVisibleItems = true;

                const imgHtml = (product && product.image) 
                    ? `<img src="${product.image}" alt="${i.name}" style="width: 28px; height: 28px; border-radius: 4px; object-fit: cover;">` 
                    : `<div style="width: 28px; height: 28px; border-radius: 4px; background: var(--clr-bg-app); display: flex; align-items: center; justify-content: center;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3z"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>`;
                return `
                <div style="display:flex; align-items: flex-start; gap: 0.5rem; font-size:0.85rem; margin-bottom:0.5rem; border-bottom: 1px dashed var(--clr-border); padding-bottom: 0.35rem;">
                    ${imgHtml}
                    <div style="display: flex; gap: 0.3rem; flex: 1;">
                        <strong style="font-size: 0.9rem; min-width: 18px; margin-top: 1px;">${i.qty}x</strong>
                        <div style="flex: 1; line-height: 1.2;">
                            <div style="font-weight: 600; color: var(--clr-text-primary); margin-top: 1px;">${i.name}</div>
                            ${i.variant ? `<div style="font-size: 0.75rem; color: var(--clr-text-secondary); margin-top: 0.15rem; font-weight: 500;">${i.variant}</div>` : ''}
                        </div>
                    </div>
                </div>`;
            }).join('');
        } else {
            hasVisibleItems = true;
            itemsHtml = `<div style="font-size:0.85rem; padding-bottom: 0.35rem; border-bottom: 1px dashed var(--clr-border);">1x Custom Order Items</div>`;
        }
        
        // Hide entire order if no items match the current station filter
        if (!hasVisibleItems) {
            if (kStatus === 'New') newCount--;
            else if (kStatus === 'Preparing') prepCount--;
            else if (kStatus === 'Ready') readyCount--;
            else if (kStatus === 'Completed') compCount--;
            return;
        }

        const typeColor = order.type === 'Dine-in' ? 'var(--clr-info)' : (order.type === 'Delivery' ? 'var(--clr-primary)' : 'var(--clr-warning)');
        
        let orderDate = Date.now();
        if (order.time) {
            let parts = order.time.match(/(\d+):(\d+)\s+(AM|PM)/i);
            if (parts) {
                let hours = parseInt(parts[1], 10);
                let minutes = parseInt(parts[2], 10);
                let modifier = parts[3].toUpperCase();
                if (hours === 12) hours = 0;
                if (modifier === 'PM') hours += 12;
                let d = new Date();
                d.setHours(hours, minutes, 0, 0);
                if (d.getTime() > Date.now() + 60000) {
                    d.setDate(d.getDate() - 1); // roll back one day if time is in the future
                }
                orderDate = d.getTime();
            }
        }
        
        const elapsed = Math.floor((Date.now() - orderDate) / 60000) || 1; 
        const isCritical = elapsed >= 10 && kStatus !== 'Completed';
        const urgencyStyle = isCritical ? 'border-color: var(--clr-danger); background: rgba(239,68,68,0.04);' : elapsed >= 5 && kStatus !== 'Completed' ? 'border-color: var(--clr-warning); background: rgba(245,158,11,0.04);' : '';
        
        // CRM Lookup for VIP status
        const crmCustomer = state.crm ? state.crm.find(c => c.name === order.customer || c.phone === order.phone) : null;
        const isVIP = crmCustomer && crmCustomer.segment === 'VIP';
        const priorityBadge = isVIP ? `<span style="font-size: 0.75rem; font-weight: 700; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px; background: rgba(139, 92, 246, 0.15); padding: 0.2rem 0.5rem; border-radius: 4px;">VIP</span>` : (isCritical ? `<span style="font-size: 0.75rem; font-weight: 700; color: var(--clr-danger); text-transform: uppercase; letter-spacing: 0.5px; background: var(--clr-danger-bg); padding: 0.2rem 0.5rem; border-radius: 4px;">URGENT</span>` : '');

        card.className = `kds-card ${statusClass}`;
        card.setAttribute('style', urgencyStyle);
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                    <h3 style="margin: 0; font-size: 1.3rem; font-weight: 800; color: var(--clr-text-primary);">#${order.id}</h3>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <span style="font-size: 0.75rem; font-weight: 700; color: ${typeColor}; text-transform: uppercase; letter-spacing: 0.5px; background: ${typeColor}15; padding: 0.2rem 0.5rem; border-radius: 4px;">${order.type}</span>
                        ${priorityBadge}
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem;">
                    <span style="font-size:0.75rem; color:${elapsed>=10?'var(--clr-danger)':elapsed>=5?'var(--clr-warning)':'var(--clr-text-primary)'}; font-weight:600; padding:0.2rem 0.4rem; border-radius:4px; ${elapsed>=10?'background:var(--clr-danger-bg);':elapsed>=5?'background:rgba(245,158,11,0.1);':''}">${elapsed} min</span>
                    <span style="font-size: 0.7rem; color: var(--clr-text-secondary); font-weight: 600;">${order.time}</span>
                </div>
            </div>
            
            <div style="font-size: 0.85rem; color: var(--clr-text-secondary); font-weight: 500; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 2px solid var(--clr-border);">
                <strong style="color: var(--clr-text-primary);">Customer:</strong> ${order.customer}
            </div>
            
            <div style="margin-bottom: 1rem; flex: 1;">
                ${itemsHtml}
                ${order.notes ? `
                <div style="margin-top: 0.75rem; padding: 0.75rem; background: var(--clr-warning-bg); border-left: 3px solid var(--clr-warning); border-radius: 4px;">
                    <strong style="color: var(--clr-warning); font-size: 0.75rem; text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Special Instructions</strong>
                    <span style="color: var(--clr-text-primary); font-size: 0.9rem; font-weight: 500;">${order.notes}</span>
                </div>` : ''}
            </div>
            
            <div style="margin-top: auto; display: flex; align-items: center; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid var(--clr-border);">
                <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 0.65rem; text-transform: uppercase; font-weight: 700; color: var(--clr-text-muted);">Status</span>
                    <span style="font-size: 0.9rem; font-weight: 700; color: var(--clr-text-primary);">${order.kitchenStatus}</span>
                </div>
                <div style="width: 100%; max-width: 140px;">${nextAction}</div>
            </div>
        `;

        if (kStatus === 'New') colNew.prepend(card);
        else if (kStatus === 'Preparing') colPrep.prepend(card);
        else if (kStatus === 'Ready') colReady.prepend(card);
        else if (kStatus === 'Completed' && colCompleted) colCompleted.prepend(card);
    });

    // Update counts
    document.querySelector('#kds-col-new .kds-column-header span').textContent = newCount;
    document.querySelector('#kds-col-preparing .kds-column-header span').textContent = prepCount;
    document.querySelector('#kds-col-ready .kds-column-header span').textContent = readyCount;
    if (colCompleted) document.querySelector('#kds-col-completed .kds-column-header span').textContent = compCount;
}

/* ==========================================================================
   KDS Full View Toggle (Phase 6)
   ========================================================================== */
window.toggleKDSFullView = function() {
    const sidebar = document.getElementById('app-sidebar');
    const header = document.querySelector('.app-header');
    
    if (!sidebar || !header) return;

    if (document.body.classList.contains('kiosk-mode')) {
        document.body.classList.remove('kiosk-mode');
        sidebar.style.display = '';
        header.style.display = '';
        document.querySelector('.app-main').style.marginLeft = '';
        document.querySelector('.app-main').style.paddingTop = '';
    } else {
        document.body.classList.add('kiosk-mode');
        sidebar.style.display = 'none';
        header.style.display = 'none';
        document.querySelector('.app-main').style.marginLeft = '0';
        document.querySelector('.app-main').style.paddingTop = '1rem';
    }
};

window.toggleKDSSound = function(btn) {
    const isOn = btn.textContent.includes('On');
    btn.innerHTML = isOn ? 
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.3rem;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg> Sound Off' :
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.3rem;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Sound On';
};
