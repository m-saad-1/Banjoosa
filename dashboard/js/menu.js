// Menu Management Logic

document.addEventListener('DOMContentLoaded', () => {
    window.Store.subscribe((state) => {
        if(document.getElementById('view-menu').classList.contains('active')){
            renderMenuProducts(state);
            populateMenuCategories(state);
        }
    });

    document.querySelectorAll('.nav-item[data-target="view-menu"]').forEach(btn => {
        btn.addEventListener('click', () => {
            renderMenuProducts(window.Store.state);
            populateMenuCategories(window.Store.state);
        });
    });
});

function populateMenuCategories(state) {
    const filter = document.getElementById('menu-category-filter');
    if (!filter) return;
    
    if (filter.options.length <= 1) { // Only populate if empty (except for 'All')
        const opts = state.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        filter.innerHTML = `<option value="All">All Categories</option>${opts}`;
    }
}

function renderMenuProducts(state) {
    const tbody = document.getElementById('menu-products-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    state.products.forEach(p => {
        const cat = state.categories.find(c => c.id === p.categoryId);
        const catName = cat ? cat.name : 'Uncategorized';
        
        let statusClass = p.status === 'Available' ? 'badge-success' : 'badge-warning';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 500;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img loading="lazy" decoding="async" src="${p.image}" alt="${p.name}" style="width: 36px; height: 36px; object-fit: cover; border-radius: 6px; flex-shrink: 0; background: #f0f0f0; border: 1px solid var(--clr-border);">
                    <span>${p.name}</span>
                </div>
            </td>
            <td>${catName}</td>
            <td>${state.restaurant.currency} ${p.price}</td>
            <td><span style="font-size: 0.8rem; color: var(--clr-text-secondary);">All Branches / Always</span></td>
            <td><span class="badge ${statusClass}">${p.status}</span></td>
            <td>
                <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="openGenericModal('product', '${p.id}')">Edit</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
