(function(){document.addEventListener('load',function(e){if(e.target.tagName==='IMG'){e.target.classList.add('is-loaded');}},true);document.addEventListener('error',function(e){if(e.target.tagName==='IMG'){e.target.classList.add('is-loaded');}},true);document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('img').forEach(function(img){if(img.complete)img.classList.add('is-loaded');});});})();
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard Initialized');
    
    // Subscribe to state changes
    window.Store.subscribe((state) => {
        renderHeader(state);
        updateSidebarBadges(state);
    });

    // Initial render
    window.Store.notify();

    // Periodically re-render to update elapsed timers (KDS & Orders)
    setInterval(() => {
        window.Store.notify();
    }, 60000);

    // Note: hdm_orders storage sync is handled centrally in data.js (window.addEventListener 'storage').
    // No duplicate listener here.

    // Desktop Preference Modal Logic
    if (window.innerWidth <= 1024 && !sessionStorage.getItem('desktop_pref_shown')) {
        const prefModal = document.getElementById('desktop-pref-modal');
        if (prefModal) {
            prefModal.style.display = 'flex';
            sessionStorage.setItem('desktop_pref_shown', 'true');
        }
    }

    // Mobile Sidebar Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('app-sidebar');
    const collapseBtn = document.getElementById('sidebar-collapse-btn');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    if (collapseBtn && sidebar) {
        // Load persisted state
        if (localStorage.getItem('sidebar_collapsed') === 'true') {
            sidebar.classList.add('collapsed');
        }
        collapseBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebar_collapsed', sidebar.classList.contains('collapsed'));
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });

    // View Switching Logic
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const views = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            views.forEach(view => view.classList.remove('active'));
            
            // Add active class to clicked
            item.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top when switching tabs
            const targetId = item.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.add('active');
                
                // Explicitly open first tab by default for modules with inner tabs
                const firstTab = targetView.querySelector('.inner-tab');
                if (firstTab) {
                    firstTab.click();
                }
            }
            
            // Close mobile sidebar if open
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Inner Tabs Logic (Universal)
    document.querySelectorAll('.inner-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const targetId = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            
            // Find parent view to scope the active class toggling
            const parentView = tab.closest('.view-section');
            if (parentView && targetContent) {
                // Remove active from sibling tabs in same view
                parentView.querySelectorAll('.inner-tab').forEach(t => t.classList.remove('active'));
                parentView.querySelectorAll('.inv-tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active to clicked tab and corresponding content
                tab.classList.add('active');
                targetContent.classList.add('active');
            }
        });
    });
});

function renderHeader(state) {
    const branchSelector = document.getElementById('header-branch-selector');
    if (branchSelector) {
        // Only update if not already focused/active to prevent interrupting user
        if (document.activeElement !== branchSelector) {
            branchSelector.innerHTML = state.branches.map(function(b) {
                return '<option value="' + b.name + '"' + (state.currentBranch === b.name ? ' selected' : '') + '>' + b.name + '</option>';
            }).join('');
            
            branchSelector.onchange = (e) => {
                // Reset selector visually
                e.target.value = state.currentBranch;
                // Require authentication by opening the modal
                if (typeof openBranchSwitchModal === 'function') {
                    openBranchSwitchModal();
                }
            };
        }
    }

    // Update Notifications Badge
    const notifBadge = document.getElementById('notif-badge');
    if (notifBadge && state.orders) {
        const unreadCount = state.orders.filter(o => o.kitchenStatus === 'New' || o.status === 'New').length;
        if (unreadCount > 0) {
            notifBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            notifBadge.style.display = 'flex';
        } else {
            notifBadge.style.display = 'none';
        }
    }
}



// --- GLOBAL TOAST NOTIFICATIONS ---
window.showToast = function(message, type = 'success') {
    // Aliased to the unified notification system for backward compatibility
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, '', type);
    }
};

// ==========================================================================
// Sidebar Badges & Dots
// ==========================================================================
function updateSidebarBadges(state) {
    if (!state || !state.orders) return;

    const newOrdersCount = state.orders.filter(function(o) { return o.status === 'New'; }).length;
    const bOrders = document.getElementById('badge-orders');
    if (bOrders) {
        bOrders.textContent = newOrdersCount > 99 ? '99+' : newOrdersCount;
        bOrders.classList.toggle('hidden', newOrdersCount === 0);
    }

    const pendingRes = (state.reservations || []).filter(function(r) { return r.status === 'Pending'; }).length;
    const bRes = document.getElementById('badge-reservations');
    if (bRes) {
        bRes.textContent = pendingRes > 99 ? '99+' : pendingRes;
        bRes.classList.toggle('hidden', pendingRes === 0);
    }

    const activeDeliveries = state.orders.filter(function(o) { return o.type === 'Delivery' && (o.status === 'Out for Delivery' || o.status === 'Dispatched'); }).length;
    const bDel = document.getElementById('badge-delivery');
    if (bDel) {
        bDel.textContent = activeDeliveries > 99 ? '99+' : activeDeliveries;
        bDel.classList.toggle('hidden', activeDeliveries === 0);
    }

    const activeKitchen = state.orders.filter(function(o) { return o.kitchenStatus === 'New' || o.kitchenStatus === 'Preparing'; }).length;
    const dotKds = document.getElementById('dot-kds');
    if (dotKds) dotKds.classList.toggle('hidden', activeKitchen === 0);

    const hasLowStock = (state.inventory || []).some(function(i) { return i.status === 'Low' || i.status === 'Critical'; });
    const dotInv = document.getElementById('dot-inventory');
    if (dotInv) dotInv.classList.toggle('hidden', !hasLowStock);
}


