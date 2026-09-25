// Customer CRM, Loyalty & Marketing Logic (Phase 6)

document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic for Loyalty
    const loyTabs = document.querySelectorAll('#view-loyalty .inner-tab');
    const loyContents = document.querySelectorAll('#view-loyalty .inv-tab-content');

    loyTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            loyTabs.forEach(t => t.classList.remove('active'));
            loyContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Subscriptions
    window.Store.subscribe((state) => {
        if(document.getElementById('view-customers').classList.contains('active')){
            renderCustomers(state);
        }
        if(document.getElementById('view-loyalty').classList.contains('active')){
            renderLoyalty(state);
            renderReviews(state);
        }
        if(document.getElementById('view-marketing').classList.contains('active')){
            renderMarketing(state);
        }
    });

    // Initial render on click
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = btn.getAttribute('data-target');
            if (target === 'view-customers') renderCustomers(window.Store.state);
            if (target === 'view-loyalty') {
                renderLoyalty(window.Store.state);
                renderReviews(window.Store.state);
            }
            if (target === 'view-marketing') renderMarketing(window.Store.state);
        });
    });

    // Customer Segment Filter
    const filter = document.getElementById('crm-segment-filter');
    if(filter) {
        filter.addEventListener('change', () => {
            renderCustomers(window.Store.state);
        });
    }
});

// --- CUSTOMERS (CRM) ---
function renderCustomers(state) {
    const tbody = document.getElementById('crm-customers-body');
    if (!tbody) return;

    const filterVal = document.getElementById('crm-segment-filter') ? document.getElementById('crm-segment-filter').value : 'All';
    let filtered = state.crm;
    
    if (filterVal !== 'All') {
        filtered = filtered.filter(c => c.segment === filterVal);
    }

    tbody.innerHTML = filtered.map(c => {
        let segmentClass = 'badge-info';
        if(c.segment === 'VIP') segmentClass = 'badge-success';
        if(c.segment === 'At-Risk') segmentClass = 'badge-danger';
        if(c.segment === 'New') segmentClass = 'badge-warning';

        const avgOrder = c.orders > 0 ? Math.round(c.lifetimeSpend / c.orders) : 0;

        return `
        <tr onclick="openCustomerProfile('${c.id}')" style="cursor:pointer;">
            <td style="font-weight: 500;">${c.name}</td>
            <td>${c.phone}</td>
            <td>${c.orders}</td>
            <td>Rs. ${avgOrder.toLocaleString()}</td>
            <td style="font-weight: 600;">Rs. ${c.lifetimeSpend.toLocaleString()}</td>
            <td><span class="badge ${segmentClass}">${c.segment}</span></td>
            <td style="color: var(--clr-text-secondary); font-size: 0.85rem;">${c.lastOrder}</td>
            <td><button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Profile</button></td>
        </tr>
    `}).join('');
}

window.openCustomerProfile = function(id) {
    const state = window.Store.state;
    const c = state.crm.find(x => x.id === id);
    if (!c) return;

    const panel = document.getElementById('customer-profile-panel');
    const content = document.getElementById('cp-content');
    if (!panel || !content) return;
    
    panel.style.display = 'block';

    const avgOrder = c.orders > 0 ? Math.round(c.lifetimeSpend / c.orders) : 0;
    
    // Generate mock timeline based on lastOrder
    const timelineHtml = `
        <div style="margin-top: 1.5rem;">
            <div style="font-size:0.85rem; color:var(--clr-text-secondary); margin-bottom:1rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Customer Journey</div>
            <div style="position:relative; padding-left:1rem; border-left:2px solid var(--clr-border);">
                <!-- Event 1 -->
                <div style="position:relative; margin-bottom:1rem;">
                    <div style="position:absolute; left:-1.45rem; top:0.2rem; width:12px; height:12px; border-radius:50%; background:var(--clr-primary); border:2px solid var(--clr-bg-panel);"></div>
                    <div style="font-size:0.85rem; font-weight:600;">Last Order (${c.lastOrder})</div>
                    <div style="font-size:0.8rem; color:var(--clr-text-secondary);">Ordered via App - Rs. ${avgOrder}</div>
                </div>
                <!-- Event 2 -->
                <div style="position:relative; margin-bottom:1rem;">
                    <div style="position:absolute; left:-1.45rem; top:0.2rem; width:12px; height:12px; border-radius:50%; background:var(--clr-success); border:2px solid var(--clr-bg-panel);"></div>
                    <div style="font-size:0.85rem; font-weight:600;">Feedback Left</div>
                    <div style="font-size:0.8rem; color:var(--clr-text-secondary);">Rated 5 stars for food quality.</div>
                </div>
                <!-- Event 3 -->
                <div style="position:relative;">
                    <div style="position:absolute; left:-1.45rem; top:0.2rem; width:12px; height:12px; border-radius:50%; background:var(--clr-text-muted); border:2px solid var(--clr-bg-panel);"></div>
                    <div style="font-size:0.85rem; font-weight:600;">Account Created</div>
                    <div style="font-size:0.8rem; color:var(--clr-text-secondary);">Joined Urban Flame Kitchen.</div>
                </div>
            </div>
        </div>
    `;

    content.innerHTML = `
        <div style="text-align:center; margin-bottom:1.5rem;">
            <div style="width:64px; height:64px; border-radius:50%; background:var(--clr-primary); color:white; display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:700; margin:0 auto 0.5rem auto;">${c.name.charAt(0)}</div>
            <h3 style="margin:0;">${c.name}</h3>
            <p style="color:var(--clr-text-secondary); margin:0;">${c.phone}</p>
        </div>
        
        <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
            <div style="flex:1; background:var(--clr-bg-app); padding:0.75rem; border-radius:8px; text-align:center;">
                <div style="font-size:0.75rem; color:var(--clr-text-secondary);">Orders</div>
                <div style="font-weight:700; font-size:1.1rem;">${c.orders}</div>
            </div>
            <div style="flex:1; background:var(--clr-bg-app); padding:0.75rem; border-radius:8px; text-align:center;">
                <div style="font-size:0.75rem; color:var(--clr-text-secondary);">Avg Order</div>
                <div style="font-weight:700; font-size:1.1rem;">Rs. ${avgOrder}</div>
            </div>
        </div>
        
        <div style="margin-bottom:1rem;">
            <div style="font-size:0.85rem; color:var(--clr-text-secondary); margin-bottom:0.25rem;">Lifetime Spend</div>
            <div style="font-weight:700; font-size:1.2rem;">Rs. ${c.lifetimeSpend.toLocaleString()}</div>
        </div>
        
        <div style="margin-bottom:1rem;">
            <div style="font-size:0.85rem; color:var(--clr-text-secondary); margin-bottom:0.25rem;">Segment</div>
            <span class="badge ${c.segment==='VIP'?'badge-success':(c.segment==='At-Risk'?'badge-danger':'badge-info')}">${c.segment}</span>
        </div>
        
        ${timelineHtml}
        
        <div style="display:flex; gap:0.5rem; margin-top:2rem;">
            <button class="btn btn-primary" style="flex:1;">Send Offer</button>
            <button class="btn btn-outline" style="flex:1;" onclick="closeCustomerProfile()">Close</button>
        </div>
    `;
};

window.closeCustomerProfile = function() {
    document.getElementById('customer-profile-panel').style.display = 'none';
};

// --- LOYALTY ---
function renderLoyalty(state) {
    const tbody = document.getElementById('loyalty-members-body');
    if (!tbody) return;

    // Filter to only those with points
    const members = state.crm.filter(c => c.points > 0).sort((a,b) => b.points - a.points);

    tbody.innerHTML = members.map(m => {
        let tierColor = 'var(--clr-text-primary)';
        if(m.tier === 'Gold') tierColor = '#D4AF37';
        if(m.tier === 'Silver') tierColor = '#C0C0C0';
        if(m.tier === 'Bronze') tierColor = '#CD7F32';

        return `
        <tr>
            <td style="font-weight: 500;">${m.name}</td>
            <td style="font-weight: 700; color: ${tierColor};">${m.tier}</td>
            <td style="font-weight: 600;">${m.points.toLocaleString()}</td>
            <td>Rs. ${(m.points * 0.5).toLocaleString()}</td> <!-- Simulating value -->
        </tr>
    `}).join('');
}

// --- REVIEWS ---
function renderReviews(state) {
    const tbody = document.getElementById('loyalty-reviews-body');
    if (!tbody) return;

    tbody.innerHTML = state.reviews.map(r => `
        <tr>
            <td style="font-weight: 600;">${r.rating} <span style="color: var(--clr-warning);">★</span></td>
            <td style="font-weight: 500;">${r.customer}</td>
            <td style="font-size: 0.9rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${r.comment}">"${r.comment}"</td>
            <td><span class="badge badge-info">${r.orderItem}</span></td>
            <td style="color: var(--clr-text-secondary); font-size: 0.85rem;">${r.date}</td>
            <td><span class="badge ${r.status === 'Published' ? 'badge-success' : 'badge-warning'}">${r.status}</span></td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Reply</button>
                    ${r.status === 'Pending' ? `<button class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="publishReview('${r.id}')">Publish</button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// --- MARKETING ---
function renderMarketing(state) {
    const tbody = document.getElementById('marketing-campaigns-body');
    if (!tbody) return;

    tbody.innerHTML = state.campaigns.map(c => {
        let roi = ((c.revenue - 5000) / 5000 * 100).toFixed(0); // Dummy calc
        let roiColor = roi > 100 ? 'var(--clr-success)' : 'var(--clr-warning)';
        
        return `
        <tr>
            <td style="font-weight: 600;">${c.name}</td>
            <td>${c.channel}</td>
            <td>All Customers</td>
            <td><span class="badge ${c.status === 'Active' ? 'badge-success' : 'badge-warning'}">${c.status}</span></td>
            <td>${c.conversions}</td>
            <td style="font-weight: 700;">Rs. ${c.revenue.toLocaleString()}</td>
            <td style="font-weight: 700; color: ${roiColor};">${roi}%</td>
            <td>
                <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Pause</button>
            </td>
        </tr>
    `}).join('');
}

// --- CAMPAIGN SIMULATION ---
window.publishReview = function(reviewId) {
    const state = window.Store.state;
    const review = state.reviews.find(r => r.id === reviewId);
    if(review) {
        review.status = 'Published';
        showToast('Review published to website', 'success');
        window.Store.notify();
    }
};

window.openCampaignModal = function() {
    document.getElementById('generic-modal-title').textContent = `Create Marketing Campaign`;
    document.getElementById('generic-modal-body').innerHTML = `
        <div style="margin-bottom: 1rem;">
            <label style="font-size: 0.85rem; font-weight: 600;">Campaign Name</label>
            <input type="text" id="camp-name" placeholder="e.g. Weekend Flash Sale" style="width: 100%; padding: 0.5rem; background: var(--clr-bg-app); border: 1px solid var(--clr-border); border-radius: 4px; color: var(--clr-text-primary);">
        </div>
        
        <div style="display:flex; gap:1rem; margin-bottom:1rem;">
            <div style="flex:1;">
                <label style="font-size: 0.85rem; font-weight: 600;">Target Audience</label>
                <select id="camp-audience" style="width: 100%; padding: 0.5rem; background: var(--clr-bg-app); border: 1px solid var(--clr-border); border-radius: 4px; color: var(--clr-text-primary);">
                    <option value="All">All Customers</option>
                    <option value="VIP">VIP Segment</option>
                    <option value="At-Risk">At-Risk Segment</option>
                    <option value="New">New Customers</option>
                </select>
            </div>
            <div style="flex:1;">
                <label style="font-size: 0.85rem; font-weight: 600;">Channel</label>
                <select id="camp-channel" style="width: 100%; padding: 0.5rem; background: var(--clr-bg-app); border: 1px solid var(--clr-border); border-radius: 4px; color: var(--clr-text-primary);">
                    <option value="SMS">SMS</option>
                    <option value="Email">Email</option>
                    <option value="Push Notification">App Push Notification</option>
                </select>
            </div>
        </div>
        
        <div style="margin-bottom: 1rem;">
            <label style="font-size: 0.85rem; font-weight: 600;">Launch Schedule</label>
            <input type="datetime-local" id="camp-schedule" style="width: 100%; padding: 0.5rem; background: var(--clr-bg-app); border: 1px solid var(--clr-border); border-radius: 4px; color: var(--clr-text-primary);">
        </div>
        
        <div style="margin-bottom: 1rem;">
            <label style="font-size: 0.85rem; font-weight: 600;">Message / Offer Content</label>
            <textarea id="camp-content" rows="4" placeholder="Enter your promotional message here..." style="width: 100%; padding: 0.5rem; background: var(--clr-bg-app); border: 1px solid var(--clr-border); border-radius: 4px; color: var(--clr-text-primary);"></textarea>
        </div>
    `;
    
    document.getElementById('generic-modal-save').textContent = 'Launch Campaign';
    document.getElementById('generic-modal-save').onclick = () => {
        const name = document.getElementById('camp-name').value;
        const channel = document.getElementById('camp-channel').value;
        
        if (!name) {
            showToast('Please enter a campaign name', 'warning');
            return;
        }
        
        // Add to state
        window.Store.state.campaigns.unshift({
            id: 'c' + Date.now(),
            name: name,
            channel: channel,
            status: 'Scheduled',
            conversions: 0,
            revenue: 0
        });
        
        showToast(`Campaign "${name}" scheduled successfully via ${channel}.`, 'success');
        window.Store.notify();
        closeGenericModal();
    };
    document.getElementById('generic-modal-overlay').style.display = 'flex';
};
