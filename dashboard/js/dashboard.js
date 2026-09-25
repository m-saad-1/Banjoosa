document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Charts
    initSalesChart();
    initChannelChart();

    // Subscribe to state changes to update widgets
    window.Store.subscribe((state) => {
        updateKPIs(state);
        renderRecentOrders(state);
        if (typeof renderSimpleRecentOrders === 'function') renderSimpleRecentOrders(state);
        if (typeof updateChannelChartData === 'function') updateChannelChartData(state);
    });

    // Initial render
    updateKPIs(window.Store.state);
    renderRecentOrders(window.Store.state);
    if (typeof renderSimpleRecentOrders === 'function') renderSimpleRecentOrders(window.Store.state);
    setTimeout(() => { if (typeof updateChannelChartData === 'function') updateChannelChartData(window.Store.state); }, 100);

    // Note: elapsed time badges are updated by orders.js setInterval + app.js Store.notify() every 60s.
    // No separate interval needed here.
});

function updateKPIs(state) {
    let revenue = 0;
    let orderCount = 0;
    let pendingCount = 0;
    let activeDeliveries = 0;

    let targetOrders = window.getBranchFilteredOrders(state);

    targetOrders.forEach(o => {
        revenue += o.total;
        orderCount++;
        if (o.status === 'New' || o.status === 'Preparing') {
            pendingCount++;
        }
        if (o.status === 'Out for Delivery') {
            activeDeliveries++;
        }
    });

    const aov = orderCount > 0 ? (revenue / orderCount) : 0;

    // New Customers: use state value if available, otherwise fixed demo value
    const newCustomers = (state.newCustomersToday != null) ? state.newCustomersToday : 14;

    document.getElementById('kpi-revenue').textContent = `${state.restaurant.currency} ${revenue.toLocaleString()}`;
    document.getElementById('kpi-orders').textContent = orderCount;
    document.getElementById('kpi-aov').textContent = `${state.restaurant.currency} ${Math.round(aov).toLocaleString()}`;
    document.getElementById('kpi-pending').textContent = pendingCount;
    document.getElementById('kpi-active-deliveries').textContent = activeDeliveries;
    document.getElementById('kpi-new-customers').textContent = newCustomers;

    // Simple Dashboard KPIs
    const elSimpleNew = document.getElementById('simple-kpi-new');
    if (elSimpleNew) elSimpleNew.textContent = targetOrders.filter(o => o.status === 'New').length;
    
    const elSimplePreparing = document.getElementById('simple-kpi-preparing');
    if (elSimplePreparing) elSimplePreparing.textContent = targetOrders.filter(o => o.status === 'Preparing').length;
    
    const elSimpleOut = document.getElementById('simple-kpi-out');
    if (elSimpleOut) elSimpleOut.textContent = activeDeliveries;
    
    const elSimpleSales = document.getElementById('simple-kpi-sales');
    if (elSimpleSales) elSimpleSales.textContent = state.restaurant.currency + " " + revenue.toLocaleString();
}

function renderSimpleRecentOrders(state) {
    const tbody = document.getElementById('simple-recent-orders-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let targetOrders = window.getBranchFilteredOrders(state);
    const sorted = typeof window.sortDashboardOrders === 'function' ? window.sortDashboardOrders(targetOrders) : targetOrders.slice().reverse();
    const recent = sorted.slice(0, 10);
    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--clr-text-muted);">No recent orders available.</td></tr>';
        return;
    }
    
    recent.forEach(order => {
        const tr = document.createElement('tr');
        let statusClass = 'badge-info';
        if (order.status === 'Completed' || order.status === 'Delivered') statusClass = 'badge-success';
        if (order.status === 'Cancelled' || order.status === 'Refunded') statusClass = 'badge-danger';
        if (order.status === 'Preparing') statusClass = 'badge-warning';

        let typeBadge = 'badge-info';
        if (order.type === 'Pickup' || order.type === 'Takeaway') typeBadge = 'badge-warning';
        if (order.type === 'Dine-in') typeBadge = 'badge-success';
        
        let timeDisplay = '';
        if (order._elapsed !== undefined && !['Completed', 'Delivered', 'Cancelled', 'Refunded'].includes(order.status)) {
             let color = order._elapsed >= 30 ? 'var(--clr-danger)' : order._elapsed >= 15 ? 'var(--clr-warning)' : 'var(--clr-text-secondary)';
             timeDisplay = `<div style="font-size: 0.75rem; color: ${color}; font-weight: 600;">${order.time} (${order._elapsed} min ago)</div>`;
        } else {
             timeDisplay = `<div style="font-size: 0.75rem; color: var(--clr-text-secondary);">${order.time || ''}</div>`;
        }
        
        let itemsCount = 1;
        if (order.items && order.items.length > 0) {
            itemsCount = order.items.reduce((sum, item) => sum + (item.qty || 1), 0);
        }

        tr.innerHTML = `
            <td>
                #${order.id}
                ${timeDisplay}
            </td>
            <td>${order.customer}</td>
            <td><span class="badge ${typeBadge}">${order.type}</span></td>
            <td>${itemsCount} items</td>
            <td>${state.restaurant.currency} ${order.total.toLocaleString()}</td>
            <td><span class="badge ${statusClass}">${order.status}</span></td>
        `;
        tr.style.cursor = 'pointer';
        tr.onclick = () => {
            if (typeof openOrderDetailModal === 'function') {
                openOrderDetailModal(order.id);
            }
        };
        tbody.appendChild(tr);
    });
}

function renderRecentOrders(state) {
    const tbody = document.getElementById('recent-orders-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    let targetOrders = window.getBranchFilteredOrders(state);

    const recent = targetOrders.slice().reverse().slice(0, 5);
    
    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--clr-text-muted);">No recent orders available.</td></tr>';
        return;
    }
    
    recent.forEach(order => {
        const tr = document.createElement('tr');
        
        let statusClass = '';
        switch(order.status) {
            case 'New': statusClass = 'badge-status-new'; break;
            case 'Preparing': statusClass = 'badge-status-preparing'; break;
            case 'Ready': statusClass = 'badge-status-ready'; break;
            case 'Out for Delivery': statusClass = 'badge-info'; break;
            case 'Delivered': statusClass = 'badge-status-completed'; break;
            case 'Completed': statusClass = 'badge-status-completed'; break;
            case 'Cancelled': statusClass = 'badge-status-cancelled'; break;
            default: statusClass = 'badge-info';
        }

        // Determine table/area label based on order type
        let tableArea = '—';
        if (order.type === 'Dine-in' && order.table) {
            tableArea = `Table ${order.table}`;
        } else if (order.type === 'Delivery' && order.address) {
            tableArea = order.address.split(',')[0] || 'N/A';
        } else if (order.type === 'Takeaway') {
            tableArea = 'Takeaway';
        }

        tr.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.type}</td>
            <td><span class="badge" style="background: rgba(233,41,14,0.1); color: var(--clr-primary); font-size: 0.75rem;">${order.source || 'N/A'}</span></td>
            <td style="font-weight: 500;">${order.customer}</td>
            <td style="color: var(--clr-text-secondary); font-size: 0.85rem;">${tableArea}</td>
            <td>${state.restaurant.currency} ${order.total.toLocaleString()}</td>
            <td><span class="badge ${statusClass}">${order.status}</span></td>
            <td><button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="event.stopPropagation(); document.querySelector('.nav-item[data-target=\\'view-orders\\']').click(); setTimeout(() => openOrderDrawer('${order.id}'), 100)">View</button></td>
        `;
        tbody.appendChild(tr);
    });
}

let salesChartInstance = null;

function initSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    salesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Revenue (Rs.)',
                data: [120000, 190000, 150000, 210000, 280000, 320000, 290000],
                borderColor: '#E31B23',
                backgroundColor: 'rgba(233, 41, 14, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { borderDash: [2, 4], color: 'rgba(150, 150, 150, 0.15)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

let channelChartInstance = null;

function initChannelChart() {
    const ctx = document.getElementById('channelChart');
    if (!ctx) return;
    
    channelChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Website', 'POS', 'WhatsApp', 'Mobile App'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: ['#E31B23', '#10B981', '#111111', '#F59E0B'],
                borderWidth: 0,
                cutout: '75%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { usePointStyle: true, padding: 20, boxWidth: 8 }
                }
            }
        }
    });
}

function updateChannelChartData(state) {
    if (!channelChartInstance) return;
    
    let targetOrders = window.getBranchFilteredOrders(state);
    
    let website = 0, pos = 0, whatsapp = 0, app = 0;
    targetOrders.forEach(o => {
        if (o.source === 'Website') website++;
        else if (o.source === 'POS') pos++;
        else if (o.source === 'WhatsApp') whatsapp++;
        else if (o.source === 'Mobile App') app++;
        else pos++; // default to POS if missing source
    });
    
    // Handle empty state gracefully by putting a dummy value if needed, 
    // but actual numbers is better even if [0,0,0,0]
    channelChartInstance.data.datasets[0].data = [website, pos, whatsapp, app];
    channelChartInstance.update();
}

window.updateSalesChart = function(duration) {
    if (!salesChartInstance) return;
    
    let labels, data;
    if (duration === 'today') {
        labels = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
        data = [5000, 15000, 45000, 30000, 25000, 60000, 85000, 35000];
    } else if (duration === '30days') {
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        data = [850000, 920000, 880000, 1150000];
    } else if (duration === '3months') {
        labels = ['Month 1', 'Month 2', 'Month 3'];
        data = [3200000, 3750000, 4100000];
    } else if (duration === 'custom') {
        // Custom range: show a placeholder prompt (future implementation)
        showNotification('Custom Range', 'Custom date range picker coming soon.', 'info');
        return;
    } else {
        // 7 days (default)
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = [120000, 190000, 150000, 210000, 280000, 320000, 290000];
    }
    
    salesChartInstance.data.labels = labels;
    salesChartInstance.data.datasets[0].data = data;
    salesChartInstance.update();
};

// Dark Mode Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggles = document.querySelectorAll('.dark-mode-toggle');
    const isDarkMode = document.documentElement.classList.contains('dark-mode');
    
    darkModeToggles.forEach(toggle => {
        toggle.checked = isDarkMode;
        
        toggle.addEventListener('change', (e) => {
            const shouldBeDark = e.target.checked;
            if (shouldBeDark) {
                document.documentElement.classList.add('dark-mode');
                localStorage.setItem('bigbites_theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark-mode');
                localStorage.setItem('bigbites_theme', 'light');
            }
            // Sync all toggles
            darkModeToggles.forEach(t => { t.checked = shouldBeDark; });
        });
    });

    // Apply theme on load if it was set
    const savedTheme = localStorage.getItem('bigbites_theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark-mode');
        darkModeToggles.forEach(t => t.checked = false);
    } else if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        darkModeToggles.forEach(t => t.checked = true);
    }
});



