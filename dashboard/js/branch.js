// ==========================================================================
// Branch Switch Modal
// ==========================================================================
const BRANCH_PINS = { 'b1': '1234' };
let activeBranchId = 'b1';

window.openBranchSwitchModal = function() {
    const overlay = document.getElementById('branch-switch-modal');
    if (!overlay) return;
    const select = document.getElementById('bsm-branch-select');
    const state = window.Store.state;
    if (select && state.branches) {
        select.innerHTML = state.branches
            .filter(function(b) { return b.id !== activeBranchId; })
            .map(function(b) { return '<option value="' + b.id + '">' + b.name + '</option>'; })
            .join('');
        if (!select.options.length) {
            showToast('Only one branch is configured.', 'info');
            return;
        }
    }
    const pinInput = document.getElementById('bsm-pin');
    const errEl = document.getElementById('bsm-error');
    if (pinInput) pinInput.value = '';
    if (errEl) errEl.style.display = 'none';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function() { if (pinInput) pinInput.focus(); }, 100);
};

window.closeBranchSwitchModal = function() {
    const overlay = document.getElementById('branch-switch-modal');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
};

window.confirmBranchSwitch = function() {
    const select = document.getElementById('bsm-branch-select');
    const pinInput = document.getElementById('bsm-pin');
    const errEl = document.getElementById('bsm-error');
    if (!select || !pinInput) return;
    const selectedId = select.value;
    const enteredPin = pinInput.value.trim();
    const correctPin = BRANCH_PINS[selectedId];
    if (enteredPin === correctPin) {
        activeBranchId = selectedId;
        const branch = window.Store.state.branches.find(function(b) { return b.id === selectedId; });
        if (branch) {
            window.Store.setBranch(branch.name);
            const nameEl = document.getElementById('ct-active-branch-name');
            if (nameEl) nameEl.textContent = branch.name;
            showToast('Switched to ' + branch.name, 'success');
        }
        closeBranchSwitchModal();
    } else {
        if (errEl) { errEl.style.display = 'block'; errEl.textContent = 'Incorrect PIN. Please try again.'; }
        if (pinInput) {
            pinInput.value = '';
            pinInput.focus();
            pinInput.style.borderColor = 'var(--clr-danger)';
            setTimeout(function() { pinInput.style.borderColor = ''; }, 1500);
        }
    }
};
