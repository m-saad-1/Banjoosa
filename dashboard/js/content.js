// Content & Media Management Logic

document.addEventListener('DOMContentLoaded', () => {
    // Initial Render of Content Data
    window.Store.subscribe((state) => {
        if(document.getElementById('view-content') && document.getElementById('view-content').classList.contains('active')){
            // Render logic can be placed here if it needs to sync with state changes
        }
    });

    // Populate initial mockup data if available or set defaults
    setTimeout(() => {
        contentRenderOffers();
        contentRenderGallery();
        contentLoadContact();
        contentLoadHours();
    }, 500);
});

/* --- Offer Banners --- */
let mockOffers = [
    { id: 'o1', url: '../assets/images/hero.avif', name: 'Hero Banner' },
    { id: 'o2', url: '../assets/images/offer-1.avif', name: 'Offer 1' },
    { id: 'o3', url: '../assets/images/offer-2.avif', name: 'Offer 2' }
];

function contentRenderOffers() {
    const grid = document.getElementById('ct-offers-grid');
    if (!grid) return;
    
    grid.innerHTML = mockOffers.map(offer => `
        <div class="content-media-card">
            <img src="${offer.url}" alt="${offer.name}" style="width:100%; height:140px; object-fit:cover; border-bottom:1px solid var(--clr-border); display:block;" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div style="display:none; width:100%; height:140px; background:var(--clr-bg-app); border-bottom:1px solid var(--clr-border); align-items:center; justify-content:center; color:var(--clr-text-muted);">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </div>
            <div class="content-media-card-body">
                <span title="${offer.name}">${offer.name}</span>
                <div class="content-media-actions">
                    <button onclick="contentDeleteOffer('${offer.id}')" class="btn-del">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

window.contentAddOffer = function(input) {
    if (input.files && input.files[0]) {
        // Mocking file upload
        const newOffer = {
            id: 'o' + Date.now(),
            url: URL.createObjectURL(input.files[0]),
            name: input.files[0].name
        };
        mockOffers.push(newOffer);
        contentRenderOffers();
        showToast("Offer image added successfully", "success");
    }
};

window.contentDeleteOffer = function(id) {
    mockOffers = mockOffers.filter(o => o.id !== id);
    contentRenderOffers();
    showToast("Offer image removed", "info");
};

/* --- Gallery Images --- */
const GALLERY_STORAGE_KEY = 'bigbites_gallery';

let mockGallery = (function() {
    const defaults = [
        { id: 'g1', url: '../assets/gallery/gallery-1.avif', name: 'Gallery Image 1' },
        { id: 'g2', url: '../assets/gallery/gallery-2.avif', name: 'Gallery Image 2' },
        { id: 'g3', url: '../assets/gallery/gallery-3.avif', name: 'Gallery Image 3' },
        { id: 'g4', url: '../assets/gallery/gallery-4.avif', name: 'Gallery Image 4' },
        { id: 'g5', url: '../assets/gallery/gallery-5.avif', name: 'Gallery Image 5' },
        { id: 'g6', url: '../assets/gallery/gallery-6.avif', name: 'Gallery Image 6' },
        { id: 'g7', url: '../assets/gallery/gallery-7.avif', name: 'Gallery Image 7' },
        { id: 'g8', url: '../assets/gallery/gallery-8.avif', name: 'Gallery Image 8' },
        { id: 'g9', url: '../assets/gallery/gallery-9.avif', name: 'Gallery Image 9' },
        { id: 'g10', url: '../assets/gallery/gallery-10.avif', name: 'Gallery Image 10' },
        { id: 'g11', url: '../assets/gallery/gallery-11.avif', name: 'Gallery Image 11' },
        { id: 'g12', url: '../assets/gallery/gallery-12.avif', name: 'Gallery Image 12' },
    ];
    
    const stored = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (stored) { 
        try { 
            let parsed = JSON.parse(stored);
            // Append missing defaults to ensure new images show up for existing users
            defaults.forEach(def => {
                if (!parsed.find(p => p.id === def.id)) {
                    parsed.push(def);
                }
            });
            localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(parsed));
            return parsed; 
        } catch(e) {} 
    }
    return defaults;
})();

function saveGalleryToStorage() {
    // Only save entries with relative paths (not blob: URLs which are session-only)
    const saveable = mockGallery.map(g => ({
        id: g.id, url: g.url.startsWith('blob:') ? '' : g.url, name: g.name
    })).filter(g => g.url);
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(saveable));
}

function contentRenderGallery() {
    const grid = document.getElementById('ct-gallery-grid');
    if (!grid) return;
    
    grid.innerHTML = mockGallery.map(img => `
        <div class="content-media-card">
            <img src="${img.url}" alt="${img.name}" style="width:100%; height:140px; object-fit:cover; border-bottom:1px solid var(--clr-border); display:block;" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div style="display:none; width:100%; height:140px; background:var(--clr-bg-app); border-bottom:1px solid var(--clr-border); align-items:center; justify-content:center; color:var(--clr-text-muted);">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </div>
            <div class="content-media-card-body">
                <span title="${img.name}">${img.name}</span>
                <div class="content-media-actions">
                    <button onclick="contentDeleteGallery('${img.id}')" class="btn-del">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

window.contentAddGallery = function(input) {
    if (input.files) {
        Array.from(input.files).forEach(file => {
            mockGallery.push({
                id: 'g' + Date.now() + Math.random(),
                url: URL.createObjectURL(file),
                name: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
            });
        });
        contentRenderGallery();
        saveGalleryToStorage();
        showToast(`${input.files.length} photo(s) added to gallery`, "success");
    }
};

window.contentDeleteGallery = function(id) {
    mockGallery = mockGallery.filter(g => g.id !== id);
    contentRenderGallery();
    saveGalleryToStorage();
    showToast("Gallery image removed", "info");
};

/* --- Contact Info --- */
let mockContact = {
    name: "bigbites Restaurant",
    phone: "+92 3002442483",
    email: "contact@bigbites.com",
    whatsapp: "+92 3002442483",
    address: "123 Food Street, Karachi, Pakistan",
    map: "https://maps.google.com/?q=karachi"
};

window.contentLoadContact = function() {
    document.getElementById('ct-name').value = mockContact.name;
    document.getElementById('ct-phone').value = mockContact.phone;
    document.getElementById('ct-email').value = mockContact.email;
    document.getElementById('ct-whatsapp').value = mockContact.whatsapp;
    document.getElementById('ct-address').value = mockContact.address;
    document.getElementById('ct-map').value = mockContact.map;
};

window.contentSaveContact = function() {
    mockContact = {
        name: document.getElementById('ct-name').value,
        phone: document.getElementById('ct-phone').value,
        email: document.getElementById('ct-email').value,
        whatsapp: document.getElementById('ct-whatsapp').value,
        address: document.getElementById('ct-address').value,
        map: document.getElementById('ct-map').value
    };
    showToast("Business contact info saved successfully", "success");
};

/* --- Opening Hours --- */
let mockHours = [
    { day: "Monday", open: "11:00", close: "23:00", closed: false },
    { day: "Tuesday", open: "11:00", close: "23:00", closed: false },
    { day: "Wednesday", open: "11:00", close: "23:00", closed: false },
    { day: "Thursday", open: "11:00", close: "23:00", closed: false },
    { day: "Friday", open: "14:00", close: "01:00", closed: false },
    { day: "Saturday", open: "11:00", close: "01:00", closed: false },
    { day: "Sunday", open: "11:00", close: "00:00", closed: false }
];

window.contentLoadHours = function() {
    const container = document.getElementById('ct-hours-rows');
    if (!container) return;

    container.innerHTML = mockHours.map((h, index) => `
        <div style="display:flex; align-items:center; gap:1rem; padding:0.75rem; background:var(--clr-bg-app); border:1px solid var(--clr-border); border-radius:8px;">
            <div style="width:100px; font-weight:600;">${h.day}</div>
            
            <div style="display:flex; align-items:center; gap:0.5rem; flex:1; opacity: ${h.closed ? '0.5' : '1'}; transition: opacity 0.2s;" id="hours-inputs-${index}">
                <input type="time" id="hr-open-${index}" value="${h.open}" style="padding:0.4rem; border:1px solid var(--clr-border); border-radius:5px;" ${h.closed ? 'disabled' : ''}>
                <span>to</span>
                <input type="time" id="hr-close-${index}" value="${h.close}" style="padding:0.4rem; border:1px solid var(--clr-border); border-radius:5px;" ${h.closed ? 'disabled' : ''}>
            </div>

            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer; font-size:0.85rem;">
                <input type="checkbox" id="hr-closed-${index}" ${h.closed ? 'checked' : ''} onchange="contentToggleDay(${index}, this.checked)">
                Closed
            </label>
        </div>
    `).join('');
};

window.contentToggleDay = function(index, isClosed) {
    const inputs = document.getElementById(`hours-inputs-${index}`);
    const openInput = document.getElementById(`hr-open-${index}`);
    const closeInput = document.getElementById(`hr-close-${index}`);
    
    if (isClosed) {
        inputs.style.opacity = '0.5';
        openInput.disabled = true;
        closeInput.disabled = true;
    } else {
        inputs.style.opacity = '1';
        openInput.disabled = false;
        closeInput.disabled = false;
    }
};

window.contentSaveHours = function() {
    mockHours = mockHours.map((h, index) => ({
        day: h.day,
        open: document.getElementById(`hr-open-${index}`).value,
        close: document.getElementById(`hr-close-${index}`).value,
        closed: document.getElementById(`hr-closed-${index}`).checked
    }));
    showToast("Opening hours saved successfully", "success");
};
