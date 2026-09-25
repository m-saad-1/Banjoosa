// ==========================================================================
// Notifications & Toast System
// ==========================================================================

// --- GLOBAL TOAST NOTIFICATIONS ---
window.showToast = function(message, type = 'success') {
    // Aliased to the unified notification system for backward compatibility
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, '', type);
    }
};

// --- RICH TOAST NOTIFICATIONS ---
window.showNotification = function(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const notif = document.createElement('div');
    notif.className = `toast-notification ${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
        iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'error') {
        iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else if (type === 'warning') {
        iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else {
        iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    notif.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(notif);

    // Trigger animation
    requestAnimationFrame(() => {
        notif.classList.add('show');
    });

    // Remove after 5 seconds
    setTimeout(() => {
        notif.classList.remove('show');
        notif.classList.add('hide');
        setTimeout(() => {
            if (container.contains(notif)) {
                container.removeChild(notif);
            }
        }, 400); // Wait for transition
    }, 5000);
};

// Demo notifications sequence
window.triggerDemoNotifications = function() {
    const demos = [
        { title: "New Online Order", msg: "Order #10486 received via website (Rs. 1,850).", type: "info", delay: 1000 },
        { title: "Table Reservation", msg: "Ahmed Khan booked Table 4 for 8:00 PM.", type: "success", delay: 5000 },
        { title: "Low Stock Alert", msg: "Chicken Breast is running critically low (5kg).", type: "error", delay: 9000 },
        { title: "Rider Update", msg: "Ali Raza has completed delivery for Order #10480.", type: "success", delay: 13000 },
        { title: "New Review", msg: "★★★★★ 'Best pizza in town!' - Sara A.", type: "info", delay: 17000 },
        { title: "Payment Received", msg: "Rs. 3,450 received via Card for Order #10484.", type: "success", delay: 21000 }
    ];

    demos.forEach(demo => {
        setTimeout(() => {
            window.showNotification(demo.title, demo.msg, demo.type);
        }, demo.delay);
    });
};

// ==========================================================================
// Live Header Notification Bar (Infinite Loop)
// ==========================================================================
window.runLiveNotificationBar = function() {
    const notifBar = document.getElementById('live-notification-bar');
    const notifIcon = document.getElementById('live-notif-icon');
    const notifText = document.getElementById('live-notif-text');
    if (!notifBar || !notifIcon || !notifText) return;

    const demoNotifs = [
        { icon: "🛍️", text: "New Order #10486 (Website)" },
        { icon: "📅", text: "Reservation: Table 4 at 8:00 PM" },
        { icon: "⚠️", text: "Low Stock: Chicken Breast" },
        { icon: "🛵", text: "Ali Raza delivered Order #10480" },
        { icon: "⭐", text: "New 5-star review received" },
        { icon: "💳", text: "Payment Rs. 3,450 received" }
    ];

    let currentIndex = 0;

    function showNext() {
        const notif = demoNotifs[currentIndex];
        notifIcon.textContent = notif.icon;
        notifText.textContent = notif.text;
        
        // Slide down into view
        notifBar.style.top = '10px';
        
        // Hold for a few seconds
        setTimeout(() => {
            // Slide back up
            notifBar.style.top = '-60px';
            
            // Wait before showing the next one
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % demoNotifs.length;
                showNext();
            }, 1500);
        }, 3500);
    }

    // Start loop
    setTimeout(showNext, 2000);
};

document.addEventListener('DOMContentLoaded', () => {
    window.runLiveNotificationBar();
});
