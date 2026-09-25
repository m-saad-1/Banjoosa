// settings.js � Dashboard Settings Logic
// Extracted from inline scripts in index.html for maintainability.

// -------------------------------------------------------
// 1. Business Information
// -------------------------------------------------------
window.saveBusinessInfo = function() {
    const name     = (document.getElementById('biz-name')     || {}).value || '';
    const currency = (document.getElementById('biz-currency') || {}).value || 'Rs.';
    const tax      = (document.getElementById('biz-tax')      || {}).value || '16';

    const info = { name, currency, tax };
    localStorage.setItem('bigbites_business_info', JSON.stringify(info));

    // Apply to live UI
    window.applyBusinessInfo(info);

    // Propagate to Store if loaded
    if (window.Store && window.Store.state && window.Store.state.restaurant) {
        window.Store.state.restaurant.name     = name;
        window.Store.state.restaurant.currency = currency;
        window.Store.state.restaurant.taxRate  = parseFloat(tax) / 100;
        window.Store.notify();
    }

    if (typeof showToast === 'function') showToast('Settings saved!', 'success');
};

window.applyBusinessInfo = function(info) {
    if (!info || !info.name) return;

    // Sidebar brand text
    document.querySelectorAll('.sidebar-brand-text, .brand span').forEach(el => {
        el.textContent = info.name;
    });

    // Simple-mode header title (if present)
    const headerTitle = document.querySelector('.header-title-simple');
    if (headerTitle) headerTitle.textContent = info.name;

    // Page title
    document.title = info.name + ' � Dashboard';
};

// -------------------------------------------------------
// 2. Dashboard Mode (Simple / Advanced)
// -------------------------------------------------------
window.switchDashboardMode = function(mode) {
    localStorage.setItem('bigbites_dashboard_mode', mode);
    if (mode === 'simple') {
        document.body.classList.add('simple-mode');
    } else {
        document.body.classList.remove('simple-mode');
    }
};

// -------------------------------------------------------
// 3. Boot: Restore persisted settings on DOMContentLoaded
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

    // --- Restore Business Info ---
    try {
        const saved = localStorage.getItem('bigbites_business_info');
        if (saved) {
            const info = JSON.parse(saved);
            const nameEl     = document.getElementById('biz-name');
            const currencyEl = document.getElementById('biz-currency');
            const taxEl      = document.getElementById('biz-tax');

            if (nameEl     && info.name)     nameEl.value     = info.name;
            if (currencyEl && info.currency) currencyEl.value = info.currency;
            if (taxEl      && info.tax)      taxEl.value      = info.tax;

            window.applyBusinessInfo(info);

            // Sync to Store if already initialized
            if (window.Store && window.Store.state && window.Store.state.restaurant) {
                window.Store.state.restaurant.name     = info.name;
                window.Store.state.restaurant.currency = info.currency;
                window.Store.state.restaurant.taxRate  = parseFloat(info.tax) / 100;
            }
        }
    } catch (e) { console.error('Error restoring business info', e); }

    // --- Restore Dashboard Mode select state ---
    const mode = localStorage.getItem('bigbites_dashboard_mode') || 'simple';
    const modeSelect = document.getElementById('dashboard-mode-select');
    if (modeSelect) modeSelect.value = mode;
    // body.simple-mode class already applied by inline <body> script � do not re-apply
});
