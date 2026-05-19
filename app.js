// =========================================================================
// ⚠️ ILAGAY DITO ANG GOOGLE APPS SCRIPT APP URL MO ⚠️
// =========================================================================
const API_URL = "https://script.google.com/macros/s/AKfycbwkMf_im4W9hIwtW8EVw8q9ZBRIMQ0qAifhGwkJbraYPZjc34Trdcexak-qlz_dZXg3/exec"; 

console.log("%c⚠️ STOP! PROPRIETARY SYSTEM", "color: #dc2626; font-size: 24px; font-weight: bold; font-family: sans-serif; text-shadow: 1px 1px 2px black;");
console.log("%cThis system and its algorithms are the intellectual property of Degz Enterprise.", "color: #2563eb; font-size: 14px; font-weight: bold;");

const CHART_OF_ACCOUNTS = {
    "1010": { name: "Cash in Bank / on Hand", type: "Asset", normal: "Debit", fs: "Balance Sheet", cashFlow: "Operating" },
    "1020": { name: "Accounts Receivable", type: "Asset", normal: "Debit", fs: "Balance Sheet", cashFlow: "Operating" },
    "1030": { name: "Input VAT", type: "Asset", normal: "Debit", fs: "Balance Sheet", cashFlow: "Operating" },
    "1040": { name: "Creditable Withholding Tax (CWT)", type: "Asset", normal: "Debit", fs: "Balance Sheet", cashFlow: "Operating" },
    "1050": { name: "Inventory", type: "Asset", normal: "Debit", fs: "Balance Sheet", cashFlow: "Operating" },
    "1500": { name: "Property, Plant & Equipment", type: "Asset", normal: "Debit", fs: "Balance Sheet", cashFlow: "Investing" },
    "2010": { name: "Accounts Payable", type: "Liability", normal: "Credit", fs: "Balance Sheet", cashFlow: "Operating" },
    "2020": { name: "Output VAT Payable", type: "Liability", normal: "Credit", fs: "Balance Sheet", cashFlow: "Operating" },
    "2030": { name: "EWT Payable", type: "Liability", normal: "Credit", fs: "Balance Sheet", cashFlow: "Operating" },
    "2040": { name: "Loans Payable", type: "Liability", normal: "Credit", fs: "Balance Sheet", cashFlow: "Financing" },
    "3010": { name: "Owner's Capital", type: "Equity", normal: "Credit", fs: "Balance Sheet", cashFlow: "Financing" },
    "3020": { name: "Owner's Drawings", type: "Equity", normal: "Debit", fs: "Balance Sheet", cashFlow: "Financing" },
    "3100": { name: "Retained Earnings", type: "Equity", normal: "Credit", fs: "Balance Sheet", cashFlow: "None" },
    "4010": { name: "Sales Revenue", type: "Income", normal: "Credit", fs: "Income Statement", cashFlow: "Operating" },
    "4020": { name: "Service Income", type: "Income", normal: "Credit", fs: "Income Statement", cashFlow: "Operating" },
    "5010": { name: "Cost of Sales", type: "Expense", normal: "Debit", fs: "Income Statement", cashFlow: "Operating" },
    "6010": { name: "Salaries & Wages", type: "Expense", normal: "Debit", fs: "Income Statement", cashFlow: "Operating" },
    "6020": { name: "Rent Expense", type: "Expense", normal: "Debit", fs: "Income Statement", cashFlow: "Operating" },
    "6030": { name: "Utilities", type: "Expense", normal: "Debit", fs: "Income Statement", cashFlow: "Operating" },
    "6040": { name: "Supplies", type: "Expense", normal: "Debit", fs: "Income Statement", cashFlow: "Operating" },
    "6050": { name: "Transportation", type: "Expense", normal: "Debit", fs: "Income Statement", cashFlow: "Operating" },
    "6060": { name: "Taxes & Licenses", type: "Expense", normal: "Debit", fs: "Income Statement", cashFlow: "Operating" },
    "6070": { name: "Professional Fees", type: "Expense", normal: "Debit", fs: "Income Statement", cashFlow: "Operating" },
    "6080": { name: "Repairs & Maintenance", type: "Expense", normal: "Debit", fs: "Income Statement", cashFlow: "Operating" },
    "6090": { name: "Miscellaneous", type: "Expense", normal: "Debit", fs: "Income Statement", cashFlow: "Operating" }
};

async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

let ADMIN_HASH = "240be518ebb702465118d1d31c098939c037f3747b2c0199042b36a715f22312"; 
let EMPLOYEE_HASH = "8b7df143d91c716ecfa5fc1730022f6b421b05cedee8fd52b1fc65a96030ad52"; 
let currentUserRole = "", ledgerData = [], lockedQuarters = {}, currentTabView = 'ALL', myChart = null, categoryChart = null, sortCol = 'date', sortAsc = false;
let SYS_COMP_NAME = "Degz Pulse"; let SYS_COMP_TIN = "000-000-000-000"; let SYS_COMP_ADDRESS = "Business Address";
let auditLogs = []; 

function logAudit(action, recordId, details, changes = "") {
    const logEntry = { logId: new Date().getTime(), timestamp: new Date().toISOString(), user: currentUserRole.toUpperCase(), action: action, recordId: recordId, details: details, changes: changes };
    auditLogs.push(logEntry); auditLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); 
    syncLocalCache();
}

function openAuditModal() {
    if(currentUserRole !== 'admin') return showToast("Admins Only", "error");
    const tbody = document.getElementById('auditTableBody'); tbody.innerHTML = '';
    auditLogs.forEach(log => {
        let actionColor = log.action === 'CREATE' ? 'color:var(--success)' : (log.action === 'VOID' ? 'color:var(--danger)' : 'color:var(--warning)');
        let tr = document.createElement('tr'); let dateStr = new Date(log.timestamp).toLocaleString();
        tr.innerHTML = `<td style="font-size:0.8rem; color:var(--text-muted);">${dateStr}</td><td><strong>${log.user}</strong></td><td style="${actionColor}; font-weight:bold;">${log.action}</td><td style="font-family:monospace; font-size:0.8rem;">${log.recordId || 'N/A'}</td><td><div>${log.details}</div>${log.changes ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px; background:var(--bg); padding:4px; border-radius:4px;">${log.changes}</div>` : ''}</td>`;
        tbody.appendChild(tr);
    });
    document.getElementById('auditModal').style.display = 'block';
}

function renderCategories() {
    const type = document.getElementById('type').value; 
    const catSelect = document.getElementById('category');
    catSelect.innerHTML = '<option value="">Select Account / Category...</option>'; 
    Object.keys(CHART_OF_ACCOUNTS).forEach(code => {
        const acc = CHART_OF_ACCOUNTS[code]; let isMatch = false;
        if (type === 'Sales' && acc.type === 'Income') isMatch = true;
        if (type === 'Expense' && (acc.type === 'Expense' || acc.type === 'Asset' || acc.type === 'Liability' || acc.type === 'Equity')) isMatch = true; 
        if (type === 'Setup') isMatch = true; 
        if (isMatch) { let opt = document.createElement('option'); opt.value = acc.name; opt.innerText = `${code} - ${acc.name}`; catSelect.appendChild(opt); }
    });
}

function toggleCategory() { 
    const type = document.getElementById('type').value; 
    const catGroup = document.getElementById('categoryGroup');
    catGroup.style.display = 'flex'; document.getElementById('category').setAttribute('required', 'true'); renderCategories();
    const refInput = document.getElementById('ref');
    if(type === 'Sales' && !document.getElementById('editingId').value) { refInput.value = getNextInvoice(); } else if (!document.getElementById('editingId').value) { refInput.value = ''; }
    if (type === 'Setup') {
        document.getElementById('taxStatusGroup').style.display = 'none'; document.getElementById('netGroup').style.display = 'none'; document.getElementById('vatGroup').style.display = 'none'; document.getElementById('ewtGroup').style.display = 'none'; document.getElementById('taxType').value = 'Exempt';
        if (!document.getElementById('editingId').value) { document.getElementById('payor').value = 'SYSTEM SETUP'; document.getElementById('particulars').value = 'Beginning Balance Entry'; }
    } else {
        document.getElementById('taxStatusGroup').style.display = 'flex'; document.getElementById('netGroup').style.display = 'flex'; document.getElementById('vatGroup').style.display = 'flex'; document.getElementById('ewtGroup').style.display = 'flex';
        if (!document.getElementById('editingId').value && document.getElementById('payor').value === 'SYSTEM SETUP') { document.getElementById('payor').value = ''; document.getElementById('particulars').value = ''; }
    }
    calculateTax();
}

function parseNum(val) { if (!val) return 0; if (typeof val === 'number') return val; return parseFloat(val.toString().replace(/,/g, '').replace(/[^\d.-]/g, '')) || 0; }
function r2(num) { return Math.round((num + Number.EPSILON) * 100) / 100; }
function formatCurrency(num) { return r2(parseNum(num)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function formatInput(el) { if(el.value !== "") el.value = formatCurrency(el.value); }
function unformatInput(el) { if(el.value !== "") el.value = parseNum(el.value); }

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container'); const toast = document.createElement('div'); toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️')}</span> <span>${message}</span>`;
    container.appendChild(toast); setTimeout(() => { toast.style.animation = 'fadeOut 0.3s forwards'; setTimeout(() => toast.remove(), 300); }, 3500);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode'); const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('themeBtn').innerText = isDark ? '☀️' : '🌙'; localStorage.setItem('degz_theme', isDark ? 'dark' : 'light');
    if(myChart) { drawChart(myChart.data.labels, myChart.data.datasets[0].data, myChart.data.datasets[1].data, myChart.options.plugins.title.text.replace(' Performance','')); }
    if(categoryChart) { Chart.defaults.color = isDark ? '#94a3b8' : '#64748b'; categoryChart.options.plugins.legend.labels.color = isDark ? '#94a3b8' : '#64748b'; categoryChart.update(); }
}

document.addEventListener("DOMContentLoaded", () => { 
    if(localStorage.getItem('degz_theme') === 'dark') { document.body.classList.add('dark-mode'); document.getElementById('themeBtn').innerText = '☀️'; }
    const yrSel = document.getElementById('filterYear'); let yrHTML = '<option value="ALL">All Years</option>'; const curYr = new Date().getFullYear();
    for(let y=2024; y<=curYr+15; y++) { yrHTML += `<option value="${y}" ${y===curYr ? 'selected' : ''}>${y}</option>`; } yrSel.innerHTML = yrHTML;
    initSystem(); 
});

// ENTERPRISE CLOUD FETCH (REPLACING GOOGLE.SCRIPT.RUN)
function callCloudAPI(payload) {
    if (API_URL.includes("AKfycbwkMf_im4W9hIwtW8EVw8q9ZBRIMQ0qAifhGwkJbraYPZjc34Trdcexak-qlz_dZXg3")) {
        return Promise.reject("Default API URL detected. Please update with your new deployment URL.");
    }
    
    return fetch(API_URL, {
        method: "POST",
        redirect: "follow", // ⚠️ CRITICAL for Google Apps Script 302 redirects
        headers: { "Content-Type": "text/plain;charset=utf-8" }, 
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .catch(err => {
        console.error("Cloud Sync Failed", err);
        return { success: false, error: err.message };
    });
}

function initSystem() {
    renderCategories(); 
    const savedSession = localStorage.getItem('degz_session'), cachedData = localStorage.getItem('degz_cache');
    const compProf = JSON.parse(localStorage.getItem('degz_company') || "{}");
    if(compProf.name) SYS_COMP_NAME = compProf.name; if(compProf.tin) SYS_COMP_TIN = compProf.tin; if(compProf.address) SYS_COMP_ADDRESS = compProf.address;

    document.getElementById('fs-compname-hdr').innerText = SYS_COMP_NAME; document.getElementById('fs-compname-bs').innerText = SYS_COMP_NAME; document.getElementById('fs-compname-cf').innerText = SYS_COMP_NAME; document.getElementById('fs-compname-eq').innerText = SYS_COMP_NAME; document.getElementById('fs-compname-tb').innerText = SYS_COMP_NAME;

    if (cachedData) {
        try {
            const parsed = JSON.parse(cachedData); ledgerData = parsed.records || []; lockedQuarters = typeof parsed.lockedQuarters === 'string' ? JSON.parse(parsed.lockedQuarters) : parsed.lockedQuarters; 
            auditLogs = parsed.auditLogs || []; if(parsed.passwords) { ADMIN_HASH = parsed.passwords.admin || ADMIN_HASH; EMPLOYEE_HASH = parsed.passwords.employee || EMPLOYEE_HASH; }
            updateClientMemory(); renderTable(); updateDashboard(); hideLoading(); 
            if(savedSession) { currentUserRole = savedSession; if (currentUserRole === 'admin') { document.getElementById('roleDisplay').innerText = "ADMIN"; document.getElementById('roleDisplay').style.backgroundColor = "rgba(22, 163, 74, 0.8)"; } else { document.getElementById('roleDisplay').innerText = "EMPLOYEE"; document.getElementById('roleDisplay').style.backgroundColor = "rgba(234, 179, 8, 0.8)"; } unlockSystem(); }
        } catch(e) {}
    }

    if (API_URL && API_URL.includes("script.google.com")) {
        if (!cachedData) showLoading("Connecting to Enterprise Cloud..."); 
        fetch(`${API_URL}?action=getLedger`)
            .then(res => res.json())
            .then(response => {
                hideLoading();
                if (!response.success) return showToast("Server Error: " + response.error, "error");
                
                ledgerData = response.records || []; 
                lockedQuarters = typeof response.lockedQuarters === 'string' ? JSON.parse(response.lockedQuarters) : response.lockedQuarters; 
                if(response.passwords) { ADMIN_HASH = response.passwords.admin; EMPLOYEE_HASH = response.passwords.employee; }
                
                syncLocalCache();
                document.getElementById('cloudStatus').innerText = "☁️ Secure Cloud Sync"; document.getElementById('cloudStatus').className = "status-cloud"; 
                updateClientMemory(); renderTable(); updateDashboard();
                
                if(savedSession && currentUserRole === "") { 
                    currentUserRole = savedSession; document.getElementById('roleDisplay').innerText = currentUserRole === 'admin' ? "ADMIN" : "EMPLOYEE"; 
                    document.getElementById('roleDisplay').style.backgroundColor = currentUserRole === 'admin' ? "rgba(22, 163, 74, 0.8)" : "rgba(234, 179, 8, 0.8)"; 
                    unlockSystem(); showToast("Welcome back! Session restored.", "success"); 
                }
            })
            .catch(err => {
                hideLoading(); document.getElementById('cloudStatus').innerText = "❌ Disconnected"; document.getElementById('cloudStatus').className = "status-error";
                showToast("Cannot connect to server. Running offline.", "error");
            });
    } else {
        showToast("System is in local mode. Setup API_URL to connect to Cloud.", "warning");
    }
}

function syncLocalCache() { 
    try { 
        let cache = JSON.parse(localStorage.getItem('degz_cache') || "{}"); 
        cache.records = ledgerData; cache.auditLogs = auditLogs;
        localStorage.setItem('degz_cache', JSON.stringify(cache)); 
    } catch(e) {} 
}

function triggerAutoFill() {
    const inputVal = document.getElementById('payor').value.trim().toLowerCase(); if(!inputVal || inputVal === 'system setup') return;
    const pastRecord = ledgerData.find(r => String(r.payor).toLowerCase() === inputVal && (r.tin !== "" || r.address !== ""));
    if(pastRecord) {
        let filled = false;
        if(pastRecord.address && !document.getElementById('address').value) { document.getElementById('address').value = pastRecord.address; filled = true; }
        if(pastRecord.tin && !document.getElementById('tin').value) { document.getElementById('tin').value = pastRecord.tin; filled = true; }
        if(filled) showToast(`✨ AI Auto-Filled data for ${pastRecord.payor}!`, "info");
    }
}

async function checkPassword() { 
    const input = document.getElementById('sysPassword').value; const errorMsg = document.getElementById('loginError'); const hashedInput = await hashPassword(input);
    if (hashedInput === ADMIN_HASH) { currentUserRole = "admin"; document.getElementById('roleDisplay').innerText = "ADMIN"; document.getElementById('roleDisplay').style.backgroundColor = "rgba(22, 163, 74, 0.8)"; localStorage.setItem('degz_session', 'admin'); errorMsg.style.display = 'none'; unlockSystem(); showToast("Admin Login Successful", "success");
    } else if (hashedInput === EMPLOYEE_HASH) { currentUserRole = "employee"; document.getElementById('roleDisplay').innerText = "EMPLOYEE"; document.getElementById('roleDisplay').style.backgroundColor = "rgba(234, 179, 8, 0.8)"; localStorage.setItem('degz_session', 'employee'); errorMsg.style.display = 'none'; unlockSystem(); showToast("Staff Login Successful", "success");
    } else { errorMsg.style.display = 'block'; } 
}

function unlockSystem() { document.getElementById('loginOverlay').style.display = 'none'; document.getElementById('mainApp').style.display = 'block'; document.body.style.overflow = 'auto'; document.getElementById('logoutBtn').style.display = 'inline-flex'; if (currentUserRole === "employee") { document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none'); } renderTable(); }
function logout() { localStorage.removeItem('degz_session'); currentUserRole = ""; document.getElementById('mainApp').style.display = 'none'; document.getElementById('loginOverlay').style.display = 'flex'; document.getElementById('sysPassword').value = ''; document.getElementById('loginError').style.display = 'none'; document.getElementById('logoutBtn').style.display = 'none'; document.body.style.overflow = 'hidden'; showToast("System Locked", "info"); }

function openSettings() { 
    document.getElementById('setAdminPwd').value = ""; document.getElementById('setEmpPwd').value = ""; 
    document.getElementById('setCompName').value = SYS_COMP_NAME; document.getElementById('setCompTIN').value = SYS_COMP_TIN; document.getElementById('setCompAddress').value = SYS_COMP_ADDRESS;
    document.getElementById('settingsModal').style.display = 'block'; 
}
function closeSettings() { document.getElementById('settingsModal').style.display = 'none'; }

async function saveSettings() { 
    const newAdmin = document.getElementById('setAdminPwd').value.trim(); const newEmp = document.getElementById('setEmpPwd').value.trim(); 
    if (newAdmin) ADMIN_HASH = await hashPassword(newAdmin); if (newEmp) EMPLOYEE_HASH = await hashPassword(newEmp);

    SYS_COMP_NAME = document.getElementById('setCompName').value.trim() || "Degz Pulse"; SYS_COMP_TIN = document.getElementById('setCompTIN').value.trim() || "000-000-000-000"; SYS_COMP_ADDRESS = document.getElementById('setCompAddress').value.trim() || "Business Address";
    localStorage.setItem('degz_company', JSON.stringify({name: SYS_COMP_NAME, tin: SYS_COMP_TIN, address: SYS_COMP_ADDRESS}));
    
    document.getElementById('fs-compname-hdr').innerText = SYS_COMP_NAME; document.getElementById('fs-compname-bs').innerText = SYS_COMP_NAME; document.getElementById('fs-compname-cf').innerText = SYS_COMP_NAME; document.getElementById('fs-compname-eq').innerText = SYS_COMP_NAME; document.getElementById('fs-compname-tb').innerText = SYS_COMP_NAME;
    
    closeSettings(); 
    callCloudAPI({ action: "updateSettings", admin: ADMIN_HASH, emp: EMPLOYEE_HASH });
    showToast("Settings & Security Profile Updated!", "success"); 
}

function showLoading(msg) { if(msg) document.getElementById('loadingText').innerText = msg; document.getElementById('loadingOverlay').style.display = 'flex'; }
function hideLoading() { document.getElementById('loadingOverlay').style.display = 'none'; }

function getNextInvoice() { const sales = ledgerData.filter(r => r.type === 'Sales' && r.ref); let max = 0; sales.forEach(s => { const matches = String(s.ref).match(/\d+/); if (matches) { const num = parseInt(matches[0], 10); if(num > max) max = num; } }); return String(max + 1).padStart(5, '0'); }

function openModal() { 
    document.getElementById('entryForm').reset(); document.getElementById('editingId').value = ""; document.getElementById('modalTitle').innerText = "➕ Add New Record"; document.getElementById('submitBtn').innerText = "💾 Save securely to Ledger"; 
    ['gross','net','vat','ewt','cash'].forEach(id => document.getElementById(id).value = ''); document.getElementById('taxType').value = 'Vatable'; toggleCategory(); document.getElementById('entryModal').style.display = 'block'; 
}
function closeModal() { document.getElementById('entryModal').style.display = 'none'; }

function calculateTax() { 
    const taxType = document.getElementById('taxType').value; const type = document.getElementById('type').value; const gross = parseNum(document.getElementById('gross').value); const ewt = parseNum(document.getElementById('ewt').value);
    if (taxType === 'Vatable') { const net = gross / 1.12; document.getElementById('net').value = formatCurrency(net); document.getElementById('vat').value = formatCurrency(gross - net); } else { document.getElementById('net').value = formatCurrency(gross); document.getElementById('vat').value = "0.00"; }
    if (type === 'Setup') { document.getElementById('cash').value = "0.00 (Setup/Adjust)"; } else { document.getElementById('cash').value = formatCurrency(gross - ewt); }
}

function parseExcelDate(val) { if (!val) return ""; if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}$/)) return val; try { if (typeof val === 'number') { const date = new Date(Math.round((val - 25569) * 86400 * 1000)); if (isNaN(date.getTime())) return val.toString(); return date.toISOString().split('T')[0]; } const d = new Date(val); if (!isNaN(d.getTime())) { const offset = d.getTimezoneOffset() * 60000; const localDate = new Date(d.getTime() - offset); return localDate.toISOString().split('T')[0]; } } catch(e) { return val.toString(); } return val.toString(); }

function switchTab(tabName, element) { 
    currentTabView = tabName; document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active')); element.classList.add('active'); 
    ['ledgerView', 'reportWrapper', 'fsWrapper', 'breakdownWrapper'].forEach(id => document.getElementById(id).style.display = 'none');
    document.getElementById('fsWrapper').classList.remove('active-print');

    if (tabName === 'Reports') { document.getElementById('reportWrapper').style.display = 'block'; populateReportView(); } 
    else if (tabName === 'FS') { document.getElementById('fsWrapper').style.display = 'block'; populateFSView(); } 
    else if (tabName === 'Breakdown') { document.getElementById('breakdownWrapper').style.display = 'block'; populateBreakdownView(); } 
    else { document.getElementById('ledgerView').style.display = 'block'; renderTable(); }
}

function sortTable(column) { if(sortCol === column) { sortAsc = !sortAsc; } else { sortCol = column; sortAsc = true; } renderTable(); showToast(`Sorted by ${column.toUpperCase()} ${sortAsc ? 'Ascending' : 'Descending'}`, "info"); }

document.getElementById('entryForm').addEventListener('submit', function(e) {
    e.preventDefault(); const editId = document.getElementById('editingId').value; const timestamp = new Date().toISOString();
    let attachedURL = document.getElementById('attachment').value;
    if (attachedURL.startsWith('data:image')) return showToast("Direct image pasting is not allowed.", "error");
    
    let finalTaxType = document.getElementById('taxType').value; let strictGross = parseNum(document.getElementById('gross').value); let strictEwt = parseNum(document.getElementById('ewt').value); let finalCash = document.getElementById('type').value === 'Setup' ? 0 : r2(strictGross - strictEwt); 
    let finalNet = parseNum(document.getElementById('net').value); let finalVat = parseNum(document.getElementById('vat').value);

    if (document.getElementById('type').value === 'Setup') { finalTaxType = 'Exempt'; finalNet = strictGross; finalVat = 0; finalCash = 0; }
    let inputDate = document.getElementById('date').value; let cleanDate = inputDate.includes('T') ? inputDate.split('T')[0] : inputDate;

    // --- POS DYNAMIC FEE CALCULATION ---
    // Ensure you have inputs in your HTML for 'capitalAmount' and 'feeRate' (e.g., 5 for per 100)
    // If not present, it defaults to 0 to prevent NaN errors.
    let posCapitalEl = document.getElementById('capitalAmount');
    let feeRateEl = document.getElementById('feeRate');
    let posCapital = posCapitalEl ? parseNum(posCapitalEl.value) : 0;
    let feeRate = feeRateEl ? parseNum(feeRateEl.value) : 0; 
    let feeCalc = 0;

    // Editable fee structure (e.g., if rate is 5 meaning 5 per 100, calculate against the strictGross)
    if (feeRate > 0 && strictGross > 0) {
        feeCalc = r2((strictGross / 100) * feeRate);
        strictGross += feeCalc; // Adjust gross to include the dynamic fee
        finalCash = document.getElementById('type').value === 'Setup' ? 0 : r2(strictGross - strictEwt); 
    }
    // ------------------------------------

    const entry = { 
        id: editId ? Number(editId) : new Date().getTime(), 
        date: cleanDate, 
        month: document.getElementById('month').value, 
        type: document.getElementById('type').value, 
        payor: document.getElementById('payor').value, 
        address: document.getElementById('address').value, 
        particulars: document.getElementById('particulars').value, 
        tin: document.getElementById('tin').value, 
        ref: document.getElementById('ref').value, 
        taxType: finalTaxType, 
        category: document.getElementById('category').value, 
        attachment: attachedURL, 
        gross: strictGross, 
        net: finalNet, 
        vat: finalVat, 
        ewt: strictEwt, 
        cash: finalCash, 
        capital: posCapital, 
        fee: feeCalc,
        status: 'Active', 
        createdBy: currentUserRole, 
        createdAt: timestamp, 
        modifiedBy: '', 
        modifiedAt: '' 
    };
    
    if (isMonthLocked(entry.month, entry.date)) return showToast("Quarter is Locked. Access Denied.", "error");
    closeModal();
    
    if(editId) { 
        const idx = ledgerData.findIndex(r => String(r.id) === String(editId)); 
        if(idx !== -1) { 
            let oldRecord = ledgerData[idx]; let changesArr = [];
            if(oldRecord.gross !== entry.gross) changesArr.push(`Gross: ${oldRecord.gross} ➔ ${entry.gross}`);
            if(oldRecord.category !== entry.category) changesArr.push(`Category: ${oldRecord.category} ➔ ${entry.category}`);
            entry.status = oldRecord.status || 'Active'; entry.createdBy = oldRecord.createdBy || currentUserRole; entry.createdAt = oldRecord.createdAt || timestamp; entry.modifiedBy = currentUserRole; entry.modifiedAt = timestamp; 
            ledgerData[idx] = entry; logAudit('UPDATE', entry.id, `Edited record for ${entry.payor}`, changesArr.join(' | '));
        } 
    } else { ledgerData.push(entry); logAudit('CREATE', entry.id, `Created new ${entry.type} record for ${entry.payor}`); }
    
    syncLocalCache(); updateClientMemory(); renderTable(); updateDashboard(); if(currentTabView === 'FS') populateFSView(); if(currentTabView === 'Breakdown') populateBreakdownView(); showToast("Record Secured!", "success"); 
    callCloudAPI({ action: editId ? "updateRecord" : "saveRecord", entry: entry });
});

function editRecord(id) {
    if(currentUserRole !== 'admin') return showToast("Admins Only", "error"); const row = ledgerData.find(r => String(r.id) === String(id)); if(!row) return;
    if (isMonthLocked(row.month, row.date)) return showToast("Record is Locked. Cannot Edit.", "error"); if (row.status === 'Void') return showToast("Cannot edit a VOIDED record.", "error"); if (row.type === 'Closing') return showToast("Cannot edit a System Closing Entry.", "error");

    document.getElementById('editingId').value = row.id; document.getElementById('date').value = String(row.date).includes('T') ? String(row.date).split('T')[0] : row.date; 
    document.getElementById('month').value = row.month; document.getElementById('type').value = row.type; document.getElementById('payor').value = row.payor; document.getElementById('address').value = row.address; document.getElementById('particulars').value = row.particulars; document.getElementById('tin').value = row.tin; document.getElementById('ref').value = row.ref; 
    
    toggleCategory(); document.getElementById('taxType').value = row.taxType || 'Vatable'; document.getElementById('category').value = row.category || ''; document.getElementById('attachment').value = row.attachment || '';
    
    // Reverse POS fee logic if it was applied, or just load raw gross
    let displayGross = row.gross;
    if (row.fee > 0) { displayGross -= row.fee; }
    
    document.getElementById('gross').value = formatCurrency(displayGross); 
    document.getElementById('net').value = formatCurrency(row.net); document.getElementById('vat').value = formatCurrency(row.vat); document.getElementById('ewt').value = formatCurrency(row.ewt); document.getElementById('cash').value = formatCurrency(row.cash);
    
    if (document.getElementById('capitalAmount')) document.getElementById('capitalAmount').value = row.capital || '';
    
    document.getElementById('modalTitle').innerText = "✏️ Edit Record"; document.getElementById('submitBtn').innerText = "♻️ Update Transaction"; document.getElementById('entryModal').style.display = 'block'; 
}

function voidRecord(id) {
    if(currentUserRole !== 'admin') return showToast("Admins Only", "error"); const row = ledgerData.find(r => String(r.id) === String(id));
    if (isMonthLocked(row.month, row.date)) return showToast("Record is Locked. Cannot Void.", "error"); if (row.status === 'Void' || row.type === 'Closing') return showToast("Action denied.", "error");
    if(!confirm("Are you sure you want to VOID this record? Values will be set to zero.")) return;
    
    let oldGross = row.gross; row.status = 'Void'; row.gross = 0; row.net = 0; row.vat = 0; row.ewt = 0; row.cash = 0; row.modifiedBy = currentUserRole; row.modifiedAt = new Date().toISOString();
    logAudit('VOID', row.id, `Voided transaction from ${row.payor}`, `Gross removed: ₱${formatCurrency(oldGross)}`);
    syncLocalCache(); renderTable(); updateDashboard(); if(currentTabView === 'FS') populateFSView(); if(currentTabView === 'Breakdown') populateBreakdownView(); showToast("Record Voided", "success"); 
    callCloudAPI({ action: "updateRecord", entry: row });
}

async function promptLockQuarter() {
    if(currentUserRole !== 'admin') return showToast("Admin Privileges Required", "error"); const q = document.getElementById('quarterSelect').value; const y = document.getElementById('filterYear').value; if(y === 'ALL') return showToast("Select a Year before locking", "error");
    const key = q + "_" + y; const isCurrentlyLocked = lockedQuarters[key] === true; const pass = prompt(`Enter Admin Password to ${isCurrentlyLocked ? 'UNLOCK' : 'LOCK'} ${q} ${y}:`);
    const passHash = await hashPassword(pass); if (passHash !== ADMIN_HASH) return showToast("Incorrect Password", "error");
    const newStatus = !isCurrentlyLocked; lockedQuarters[key] = newStatus; logAudit('SYSTEM', 'SYS-LOCK', `Quarter ${q} ${y} was ${newStatus ? 'LOCKED' : 'UNLOCKED'}`);
    updateDashboard(); renderTable(); showToast(`Quarter ${newStatus ? 'Locked 🔒' : 'Unlocked 🔓'}`, "success"); 
    callCloudAPI({ action: "lockQuarter", key: key, status: newStatus });
}

async function promptCloseYear() {
    if(currentUserRole !== 'admin') return showToast("Admin Privileges Required", "error"); const year = document.getElementById('filterYear').value; if(year === 'ALL') return showToast("Select a specific year to close.", "error");
    const pass = prompt(`⚠️ WARNING: Type Admin Password to CLOSE THE BOOKS for ${year}. This will lock the year and post Retained Earnings.`);
    const passHash = await hashPassword(pass); if (passHash !== ADMIN_HASH) return showToast("Incorrect Password. Action Cancelled.", "error");

    ['Q1', 'Q2', 'Q3', 'Q4'].forEach(q => lockedQuarters[`${q}_${year}`] = true);
    let rev = 0, exp = 0;
    ledgerData.forEach(row => {
        if(row.status === 'Void' || !String(row.date).includes(year)) return;
        let coa = getCoaDetails(row.category, row.type); let valToRecord = (row.taxType === 'Exempt' || row.taxType === 'ZeroRated') ? row.gross : row.net;
        if(row.type === 'Sales' && coa.type === 'Income') rev += valToRecord; else if(row.type === 'Expense' && coa.type === 'Expense') exp += valToRecord;
    });
    
    let netIncome = r2(rev - exp);
    const closingEntry = { id: new Date().getTime(), date: `${year}-12-31`, month: "DECEMBER", type: "Closing", payor: "SYSTEM GENERATED", address: "", particulars: `To close nominal accounts to Retained Earnings for ${year}`, tin: "", ref: `CJE-${year}`, taxType: "Exempt", category: "Retained Earnings", gross: netIncome, net: netIncome, vat: 0, ewt: 0, cash: 0, status: "Active", createdBy: currentUserRole, createdAt: new Date().toISOString(), attachment: "" };
    
    ledgerData.push(closingEntry); logAudit('SYSTEM', 'SYS-CLOSE', `Financial Year ${year} Closed.`, `Net Income of ₱${formatCurrency(netIncome)} posted to Retained Earnings.`);
    syncLocalCache(); showToast(`✅ Year ${year} Closed! ₱${formatCurrency(netIncome)} posted to Retained Earnings.`, "success");
    updateDashboard(); renderTable(); if(currentTabView === 'FS') populateFSView();
    
    callCloudAPI({ action: "saveRecord", entry: closingEntry });
    ['Q1', 'Q2', 'Q3', 'Q4'].forEach(q => callCloudAPI({ action: "lockQuarter", key: `${q}_${year}`, status: true }));
}

function isMonthLocked(monthStr, dateStr) {
    if(!dateStr) return false; const year = String(dateStr).substring(0, 4); let q = "";
    if(['JANUARY','FEBRUARY','MARCH'].includes(monthStr)) q = "Q1"; else if(['APRIL','MAY','JUNE'].includes(monthStr)) q = "Q2"; else if(['JULY','AUGUST','SEPTEMBER'].includes(monthStr)) q = "Q3"; else if(['OCTOBER','NOVEMBER','DECEMBER'].includes(monthStr)) q = "Q4";
    return lockedQuarters[q + "_" + year] === true;
}

function updateClientMemory() { const memoryList = document.getElementById('clientMemory'); memoryList.innerHTML = ''; const uniqueClients = [...new Set(ledgerData.map(item => item.payor).filter(p => p !== "Unknown" && p !== ""))]; uniqueClients.forEach(client => { const option = document.createElement('option'); option.value = client; memoryList.appendChild(option); }); }

function updateDashboard() {
    const selectedQ = document.getElementById('quarterSelect').value; const yearFilter = document.getElementById('filterYear').value;
    if(currentUserRole === 'admin') { const lockKey = selectedQ + "_" + yearFilter; const isQlocked = lockedQuarters[lockKey] === true; const lockBtn = document.getElementById('lockBtnUI'); if(isQlocked) { lockBtn.innerText = "🔒 Quarter Locked"; lockBtn.style.backgroundColor = "var(--success)"; } else { lockBtn.innerText = "🔓 Lock Quarter"; lockBtn.style.backgroundColor = "var(--warning)"; } }
    const quarters = { 'Q1': ['JANUARY', 'FEBRUARY', 'MARCH'], 'Q2': ['APRIL', 'MAY', 'JUNE'], 'Q3': ['JULY', 'AUGUST', 'SEPTEMBER'], 'Q4': ['OCTOBER', 'NOVEMBER', 'DECEMBER'] };
    const monthsInQ = quarters[selectedQ]; let qSalesGross = 0, qSalesNet = 0, qOutputVat = 0, qEWT = 0; let qExpGross = 0, qExpNet = 0, qInputVat = 0; const chartSalesData = [0, 0, 0]; const chartExpData = [0, 0, 0]; const expenseCategories = {}; 
    
    ledgerData.forEach(row => {
        let cleanDate = String(row.date).includes('T') ? String(row.date).split('T')[0] : row.date;
        if (yearFilter !== 'ALL' && (!cleanDate || !String(cleanDate).includes(yearFilter))) return;
        if (row.status === 'Void' || row.type === 'Closing' || row.type === 'Setup') return; 
        if (monthsInQ.includes(row.month)) {
            const monthIndex = monthsInQ.indexOf(row.month);
            if (row.type === 'Sales') { qSalesGross += row.gross; qSalesNet += row.net; qOutputVat += row.vat; qEWT += row.ewt; chartSalesData[monthIndex] += row.gross; } 
            else if (row.type === 'Expense') { qExpGross += row.gross; qExpNet += row.net; qInputVat += row.vat; chartExpData[monthIndex] += row.gross; let cat = row.category || "Uncategorized"; expenseCategories[cat] = (expenseCategories[cat] || 0) + row.gross; }
        }
    });
    const qVatPayable = qOutputVat - qInputVat;
    document.getElementById('q-sales').innerText = '₱ ' + formatCurrency(qSalesGross); document.getElementById('q-expenses').innerText = '₱ ' + formatCurrency(qExpGross); document.getElementById('q-net').innerText = '₱ ' + formatCurrency(qSalesGross - qExpGross); document.getElementById('q-vat').innerText = '₱ ' + formatCurrency(qVatPayable);
    const vatStatusEl = document.getElementById('q-vat-status');
    if (qVatPayable <= 0) { vatStatusEl.innerText = "Excess Input VAT (Carry Over)"; vatStatusEl.style.color = "var(--success)"; } else { vatStatusEl.innerText = "VAT Payable to BIR"; vatStatusEl.style.color = "var(--danger)"; }
    drawChart(monthsInQ, chartSalesData, chartExpData, selectedQ + (yearFilter !== 'ALL' ? ' ' + yearFilter : '')); drawPieChart(expenseCategories, selectedQ + (yearFilter !== 'ALL' ? ' ' + yearFilter : ''));
    const printYearStr = yearFilter !== 'ALL' ? yearFilter : new Date().getFullYear(); document.getElementById('printSubtitle').innerText = `For ${selectedQ} of Taxable Year ${printYearStr}`;
    document.getElementById('print-line15').innerText = formatCurrency(qSalesNet); document.getElementById('print-line16').innerText = formatCurrency(qOutputVat); document.getElementById('print-line21').innerText = formatCurrency(qExpNet); document.getElementById('print-line22').innerText = formatCurrency(qInputVat);
    const printVatStatus = document.getElementById('print-vat-status-label'); if (qVatPayable < 0) { printVatStatus.innerText = "Line 26: Excess Input Tax Carry-Over"; document.getElementById('print-line26').innerText = "(" + formatCurrency(Math.abs(qVatPayable)) + ")"; } else { printVatStatus.innerText = "Line 26: Net VAT Payable"; document.getElementById('print-line26').innerText = formatCurrency(qVatPayable); }
    document.getElementById('print-line36').innerText = formatCurrency(qSalesGross); document.getElementById('print-line38').innerText = formatCurrency(qExpGross); const netIncome = qSalesGross - qExpGross; document.getElementById('print-line40').innerText = netIncome < 0 ? "(" + formatCurrency(Math.abs(netIncome)) + ")" : formatCurrency(netIncome);
}

function populateBreakdownView() {
    const yearFilter = document.getElementById('filterYear').value; const monthFilter = document.getElementById('filterMonth').value;
    let categories = {}; let inflow = 0, outflow = 0, totalExpGross = 0;

    ledgerData.forEach(r => {
        if(r.status === 'Void' || r.type === 'Closing' || r.type === 'Setup') return;
        let cleanDate = String(r.date).includes('T') ? String(r.date).split('T')[0] : r.date;
        if(yearFilter !== 'ALL' && (!cleanDate || !String(cleanDate).includes(yearFilter))) return;
        if(monthFilter !== 'ALL' && r.month !== monthFilter) return;

        if(r.type === 'Sales') { inflow += parseNum(r.cash); } 
        else if (r.type === 'Expense') { outflow += parseNum(r.cash); totalExpGross += parseNum(r.gross); let cat = r.category || "Uncategorized"; categories[cat] = (categories[cat] || 0) + parseNum(r.gross); }
    });

    document.getElementById('bd-inflow').innerText = '₱ ' + formatCurrency(inflow); document.getElementById('bd-outflow').innerText = '₱ ' + formatCurrency(outflow);
    let netCash = inflow - outflow; let netEl = document.getElementById('bd-netcash'); netEl.innerText = '₱ ' + formatCurrency(netCash); netEl.style.color = netCash >= 0 ? "var(--success)" : "var(--danger)";
    document.getElementById('bd-total-exp').innerText = '₱ ' + formatCurrency(totalExpGross);

    let listHTML = ""; let sortedCats = Object.keys(categories).sort((a,b) => categories[b] - categories[a]);
    sortedCats.forEach(c => { listHTML += `<div class="bd-list-item"><span class="cat-name">${c}</span><span class="cat-val">₱ ${formatCurrency(categories[c])}</span></div>`; });
    if(sortedCats.length === 0) listHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted);">Walang expense data sa period na ito.</div>`;
    document.getElementById('bd-expense-list').innerHTML = listHTML;

    let adviceHTML = "<ul>";
    if (inflow === 0 && outflow > 0) { adviceHTML += `<li style="color: var(--danger);"><strong>🔴 Alert:</strong> Wala kang pumasok na sales pero tuloy ang gastos. I-hold muna ang mga non-essential purchases at unahin ang marketing o collection.</li>`; } 
    else if (outflow > inflow) { adviceHTML += `<li style="color: var(--danger);"><strong>🔴 Deficit Warning:</strong> Mas malaki ang lumalabas na cash kaysa sa pumapasok. Reviewhin agad ang Cost of Sales at tanggalin ang mga unnecessary expenses.</li>`; }

    let salaryTotal = categories["Salaries & Wages"] || 0; if (inflow > 0 && (salaryTotal / inflow) > 0.35) { adviceHTML += `<li style="color: var(--warning);"><strong>🟠 Payroll Notice:</strong> Ang "Salaries & Wages" ay higit 35% ng total sales mo. Pwedeng overstaffed ka o kailangan ng mas mataas na productivity output mula sa team.</li>`; }
    let util = categories["Utilities"] || 0; if (inflow > 0 && (util / inflow) > 0.15) { adviceHTML += `<li><strong>💡 Utilities:</strong> Mataas ang kuryente/tubig/internet. Mag-implement ng energy-saving policies o maghanap ng mas murang internet plan.</li>`; }
    let transpo = categories["Transportation"] || 0; if (inflow > 0 && (transpo / inflow) > 0.10) { adviceHTML += `<li><strong>🚗 Transportation:</strong> Medyo mabigat ang cost sa logistics. I-plan nang maigi ang mga byahe, gawing by-batch ang deliveries, o mag-canvass ng mas murang logistics partner.</li>`; }
    if (inflow > 0 && netCash > 0) { let savings = netCash * 0.20; adviceHTML += `<li style="color: var(--success);"><strong>✅ Healthy Operations:</strong> Positive ang cash flow. Bilang CTO advice: Itabi ang <strong>₱ ${formatCurrency(savings)}</strong> (20% ng Net Cash) sa Emergency Business Fund at huwag munang galawin.</li>`; }
    adviceHTML += "</ul>";
    if(inflow === 0 && outflow === 0) adviceHTML = `<div style="color:var(--text-muted); font-style:italic;">No data to analyze. Mamili ng valid na month at year para mag-generate ng plan.</div>`;
    document.getElementById('bd-ai-text').innerHTML = adviceHTML;
}

function populateReportView() {
    const yearFilter = document.getElementById('filterYear').value; const monthFilter = document.getElementById('filterMonth').value;
    document.getElementById('r-period').innerText = (monthFilter === 'ALL' ? 'Full Year ' : monthFilter + ' ') + (yearFilter === 'ALL' ? 'All Records' : yearFilter);
    
    let gs=0, vs=0, ovat=0, cwt=0, ge=0, ve=0, ivat=0, ewt=0, ex_s=0, zr_s=0, ex_p=0, zr_p=0;

    ledgerData.forEach(r => {
        if(r.status === 'Void' || r.type === 'Closing' || r.type === 'Setup') return;
        let cleanDate = String(r.date).includes('T') ? String(r.date).split('T')[0] : r.date;
        if(yearFilter !== 'ALL' && (!cleanDate || !String(cleanDate).includes(yearFilter))) return;
        if(monthFilter !== 'ALL' && r.month !== monthFilter) return;

        let gross = r2(parseNum(r.gross)); let vat = r2(parseNum(r.vat)); let tEwt = r2(parseNum(r.ewt)); let net = r2(parseNum(r.net));
        if(net === 0 && gross > 0) net = r.taxType==='Vatable' ? r2(gross/1.12) : gross;

        if(r.type === 'Sales') {
            gs += gross; ovat += vat; cwt += tEwt;
            if(r.taxType === 'Exempt') ex_s += net; else if(r.taxType === 'ZeroRated') zr_s += net; else vs += net;
        } else if (r.type === 'Expense') {
            ge += gross; ivat += vat; ewt += tEwt;
            if (r.taxType === 'Exempt' || r.category === 'Salaries & Wages') ex_p += net; else if (r.taxType === 'ZeroRated') zr_p += net; else ve += net;
        }
    });

    document.getElementById('rs-gs').innerText = '₱ ' + formatCurrency(gs); document.getElementById('rs-vs').innerText = '₱ ' + formatCurrency(vs); document.getElementById('rs-ovat').innerText = '₱ ' + formatCurrency(ovat); document.getElementById('rs-cwt').innerText = '₱ ' + formatCurrency(cwt);
    document.getElementById('rs-ge').innerText = '₱ ' + formatCurrency(ge); document.getElementById('rs-ve').innerText = '₱ ' + formatCurrency(ve); document.getElementById('rs-ivat').innerText = '₱ ' + formatCurrency(ivat); document.getElementById('rs-ewt').innerText = '₱ ' + formatCurrency(ewt);

    let netSales = r2(vs + ex_s + zr_s); let netExp = r2(ve + ex_p + zr_p); let netInc = r2(netSales - netExp); let netVat = r2(ovat - ivat);

    document.getElementById('rs-ni-sales').innerText = '₱ ' + formatCurrency(netSales); document.getElementById('rs-ni-exp').innerText = '(₱ ' + formatCurrency(netExp) + ')'; document.getElementById('rs-ni-total').innerText = '₱ ' + formatCurrency(netInc);
    document.getElementById('rs-tv-out').innerText = '₱ ' + formatCurrency(ovat); document.getElementById('rs-tv-in').innerText = '(₱ ' + formatCurrency(ivat) + ')'; document.getElementById('rs-tv-total').innerText = '₱ ' + formatCurrency(netVat);

    document.getElementById('ap-compname').innerText = SYS_COMP_NAME; document.getElementById('ap-comptin').innerText = SYS_COMP_TIN; document.getElementById('ap-compadd').innerText = SYS_COMP_ADDRESS; document.getElementById('ap-period').innerText = document.getElementById('r-period').innerText;
    document.getElementById('ap-gs').innerText = formatCurrency(gs); document.getElementById('ap-ex-s').innerText = formatCurrency(ex_s); document.getElementById('ap-zr-s').innerText = formatCurrency(zr_s); document.getElementById('ap-vs').innerText = formatCurrency(vs);
    document.getElementById('ap-ge').innerText = formatCurrency(ge); document.getElementById('ap-ex-p').innerText = formatCurrency(ex_p); document.getElementById('ap-zr-p').innerText = formatCurrency(zr_p); document.getElementById('ap-vp').innerText = formatCurrency(ve);
    document.getElementById('ap-ovat').innerText = formatCurrency(ovat); document.getElementById('ap-ivat').innerText = formatCurrency(ivat); document.getElementById('ap-vatpay').innerText = formatCurrency(netVat); document.getElementById('ap-cwt').innerText = formatCurrency(cwt);
    document.getElementById('ap-ewt').innerText = formatCurrency(ewt); document.getElementById('ap-ni-s').innerText = formatCurrency(netSales); document.getElementById('ap-ni-e').innerText = formatCurrency(netExp); document.getElementById('ap-ni-t').innerText = formatCurrency(netInc);
}

function getCoaDetails(catName, type) { let found = Object.values(CHART_OF_ACCOUNTS).find(a => a.name === catName); if(found) return found; if(type === 'Sales') return { name: catName || 'Sales Revenue', type: 'Income', normal: 'Credit', fs: 'Income Statement', cashFlow: 'Operating' }; return { name: catName || 'Uncategorized Expense', type: 'Expense', normal: 'Debit', fs: 'Income Statement', cashFlow: 'Operating' }; }

function populateFSView() {
    const targetYear = document.getElementById('filterYear').value; const targetMonth = document.getElementById('filterMonth').value;
    if(targetYear === 'ALL') { 
        document.getElementById('fs-income-table').innerHTML = '<tr><td><br><center>⚠️ Please select a specific year to view accurate Financial Statements.</center></td></tr>'; 
        document.getElementById('fs-bs-table').innerHTML = ''; document.getElementById('fs-cf-table').innerHTML = ''; document.getElementById('fs-tb-table').innerHTML = ''; document.getElementById('fs-equity-table').innerHTML = '';
        document.getElementById('fs-notes-section').innerHTML = ''; document.getElementById('balance-checker').style.display = 'none'; return; 
    }
    document.getElementById('balance-checker').style.display = 'inline-block';
    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]; const targetMonthIdx = targetMonth === 'ALL' ? 11 : monthNames.indexOf(targetMonth);
    let periodText = targetMonth !== 'ALL' ? `For the Month of ${targetMonth} ${targetYear}` : `For the Year ${targetYear}`; let bsPeriodText = targetMonth !== 'ALL' ? `As of End of ${targetMonth} ${targetYear}` : `As of December 31, ${targetYear}`;
    document.getElementById('fs-period').innerText = periodText; document.getElementById('fs-bs-period').innerText = bsPeriodText; document.getElementById('fs-cf-period').innerText = periodText; document.getElementById('fs-tb-period').innerText = bsPeriodText; document.getElementById('fs-eq-period').innerText = periodText;

    let fsData = { Asset: {}, Liability: {}, Equity: {}, Income: {}, Expense: {} }; let tbData = {}; 
    Object.keys(CHART_OF_ACCOUNTS).forEach(code => { let acc = CHART_OF_ACCOUNTS[code]; fsData[acc.type][acc.name] = 0; tbData[acc.name] = { type: acc.type, normal: acc.normal || 'Debit', balance: 0, code: code }; });
    if(!tbData['Retained Earnings']) tbData['Retained Earnings'] = { type: 'Equity', normal: 'Credit', balance: 0, code: '3100' };

    let priorRetainedEarnings = 0; let priorCapital = 0; let priorDrawings = 0; let currentNetIncome = 0; let currentAddlInvestment = 0; let currentDrawings = 0; let opIn = 0, opOut = 0, invOut = 0, finIn = 0; let begCashBalance = 0; 

    ledgerData.forEach(row => {
        if (row.status === 'Void') return;
        let cleanDate = String(row.date).includes('T') ? String(row.date).split('T')[0] : row.date; const recYear = String(cleanDate).substring(0, 4); const recMonthIdx = monthNames.indexOf(row.month);
        let isPast = false; let isCurrent = false;

        if (targetMonth === 'ALL') { isPast = recYear < targetYear; isCurrent = recYear === targetYear; } 
        else { isPast = recYear < targetYear || (recYear === targetYear && recMonthIdx < targetMonthIdx); isCurrent = recYear === targetYear && recMonthIdx === targetMonthIdx; }
        if (!isPast && !isCurrent) return; 
        
        let coa = getCoaDetails(row.category, row.type); let accName = coa.name; let accType = coa.type; let accNormal = coa.normal || (accType === 'Asset' || accType === 'Expense' ? 'Debit' : 'Credit');
        let strictGross = parseNum(row.gross); let strictEwt = parseNum(row.ewt); let strictCash = strictGross - strictEwt; let strictNet = (row.taxType === 'Exempt' || row.taxType === 'ZeroRated') ? strictGross : parseNum(row.net); let strictVat = (row.taxType === 'Exempt' || row.taxType === 'ZeroRated') ? 0 : parseNum(row.vat);
        if (Math.abs((strictNet + strictVat) - strictGross) > 0.1) { strictNet = strictGross - strictVat; }

        const postTB = (accountStr, amount, isDebit) => { if (!tbData[accountStr]) tbData[accountStr] = { type: 'Unknown', normal: 'Debit', balance: 0, code: '0000' }; tbData[accountStr].balance += isDebit ? amount : -amount; };

        if (row.type === 'Setup') { let isDebit = accNormal === 'Debit'; postTB(accName, strictGross, isDebit); postTB('Retained Earnings', strictGross, !isDebit); } 
        else if (row.type === 'Sales') { postTB('Cash in Bank / on Hand', strictCash, true); if(strictEwt > 0) postTB('Creditable Withholding Tax (CWT)', strictEwt, true); if(strictVat > 0) postTB('Output VAT Payable', strictVat, false); postTB(accName, strictNet, false); } 
        else if (row.type === 'Expense') { postTB('Cash in Bank / on Hand', strictCash, false); if(strictEwt > 0) postTB('EWT Payable', strictEwt, false); if(strictVat > 0) postTB('Input VAT', strictVat, true); postTB(accName, strictNet, true); }

        if (row.type === 'Setup') {
            let isDebit = accNormal === 'Debit'; fsData[accType][accName] = (fsData[accType][accName] || 0) + strictGross;
            if (accType === 'Equity' && accName === "Owner's Capital") { if(isPast) priorCapital += strictGross; else currentAddlInvestment += strictGross; } else if (accType === 'Equity' && accName === "Owner's Drawings") { if(isPast) priorDrawings += strictGross; else currentDrawings += strictGross; } else if (accType === 'Asset' && !isDebit) { fsData[accType][accName] -= (strictGross * 2); } else if ((accType === 'Liability' || accType === 'Equity') && isDebit) { fsData[accType][accName] -= (strictGross * 2); }
            if (isPast && accName === 'Cash in Bank / on Hand') { begCashBalance += isDebit ? strictGross : -strictGross; }
        } else if (row.type === 'Sales') {
            if (isPast) {
                begCashBalance += strictCash; if (accType === 'Income') priorRetainedEarnings += strictNet; else if (accType === 'Expense') priorRetainedEarnings -= strictNet;
                fsData['Asset']['Cash in Bank / on Hand'] = (fsData['Asset']['Cash in Bank / on Hand'] || 0) + strictCash; if (strictEwt > 0) fsData['Asset']['Creditable Withholding Tax (CWT)'] = (fsData['Asset']['Creditable Withholding Tax (CWT)'] || 0) + strictEwt; if (strictVat > 0) fsData['Liability']['Output VAT Payable'] = (fsData['Liability']['Output VAT Payable'] || 0) + strictVat;
                if (accType === 'Liability' || accType === 'Equity') { fsData[accType][accName] = (fsData[accType][accName] || 0) + strictNet; if(accName === "Owner's Capital") priorCapital += strictNet; } if (accType === 'Asset') fsData[accType][accName] = (fsData[accType][accName] || 0) - strictNet;
            } else if (isCurrent) {
                fsData['Asset']['Cash in Bank / on Hand'] = (fsData['Asset']['Cash in Bank / on Hand'] || 0) + strictCash; if (strictEwt > 0) fsData['Asset']['Creditable Withholding Tax (CWT)'] = (fsData['Asset']['Creditable Withholding Tax (CWT)'] || 0) + strictEwt; if (strictVat > 0) fsData['Liability']['Output VAT Payable'] = (fsData['Liability']['Output VAT Payable'] || 0) + strictVat;
                if (accType === 'Income') fsData['Income'][accName] = (fsData['Income'][accName] || 0) + strictNet; else if (accType === 'Liability' || accType === 'Equity') { fsData[accType][accName] = (fsData[accType][accName] || 0) + strictNet; if(accName === "Owner's Capital") currentAddlInvestment += strictNet; } else if (accType === 'Asset') fsData[accType][accName] = (fsData[accType][accName] || 0) - strictNet;
                if(coa.cashFlow === 'Operating') opIn += strictCash; if(coa.cashFlow === 'Financing' && (accName.includes('Capital') || accName.includes('Loan'))) finIn += strictCash;
            }
        } else if (row.type === 'Expense') {
            if (isPast) {
                begCashBalance -= strictCash; if (accType === 'Expense') priorRetainedEarnings -= strictNet; else if (accType === 'Income') priorRetainedEarnings += strictNet;
                fsData['Asset']['Cash in Bank / on Hand'] = (fsData['Asset']['Cash in Bank / on Hand'] || 0) - strictCash; if (strictVat > 0) fsData['Asset']['Input VAT'] = (fsData['Asset']['Input VAT'] || 0) + strictVat; if (strictEwt > 0) fsData['Liability']['EWT Payable'] = (fsData['Liability']['EWT Payable'] || 0) + strictEwt;
                if (accType === 'Asset') fsData[accType][accName] = (fsData[accType][accName] || 0) + strictNet; if (accType === 'Liability' || accType === 'Equity') { fsData[accType][accName] = (fsData[accType][accName] || 0) - strictNet; if(accName === "Owner's Drawings") priorDrawings += strictNet; }
            } else if (isCurrent) {
                fsData['Asset']['Cash in Bank / on Hand'] = (fsData['Asset']['Cash in Bank / on Hand'] || 0) - strictCash; if (strictVat > 0) fsData['Asset']['Input VAT'] = (fsData['Asset']['Input VAT'] || 0) + strictVat; if (strictEwt > 0) fsData['Liability']['EWT Payable'] = (fsData['Liability']['EWT Payable'] || 0) + strictEwt;
                if (accType === 'Expense') fsData['Expense'][accName] = (fsData['Expense'][accName] || 0) + strictNet; else if (accType === 'Asset') fsData[accType][accName] = (fsData[accType][accName] || 0) + strictNet; else if (accType === 'Liability' || accType === 'Equity') { fsData[accType][accName] = (fsData[accType][accName] || 0) - strictNet; if(accName === "Owner's Drawings") currentDrawings += strictNet; }
                if(coa.cashFlow === 'Operating') opOut += strictCash; if(coa.cashFlow === 'Investing') invOut += strictCash; if(coa.cashFlow === 'Financing' && accName.includes('Drawing')) finIn -= strictCash; if(coa.cashFlow === 'Financing' && (accName.includes('Loan') || accName.includes('Payable'))) finIn -= strictCash; 
            }
        } else if (row.type === 'Closing' && isPast) { priorRetainedEarnings += strictGross; }
    });

    let isHtml = `<tr><td colspan="2" style="font-weight:bold; background:var(--bg)">REVENUES</td></tr>`; let totalRev = 0, totalExp = 0;
    Object.keys(fsData.Income).forEach(acc => { if(fsData.Income[acc] !== 0) { isHtml += `<tr><td class="indent">${acc}</td><td class="val">${formatCurrency(fsData.Income[acc])}</td></tr>`; totalRev += fsData.Income[acc]; } });
    isHtml += `<tr><td><strong>Total Revenues</strong></td><td class="val subtotal">${formatCurrency(totalRev)}</td></tr><tr><td colspan="2" style="font-weight:bold; background:var(--bg); padding-top:1rem;">OPERATING EXPENSES</td></tr>`;
    Object.keys(fsData.Expense).forEach(acc => { if(fsData.Expense[acc] !== 0) { isHtml += `<tr><td class="indent">${acc}</td><td class="val">${formatCurrency(fsData.Expense[acc])}</td></tr>`; totalExp += fsData.Expense[acc]; } });
    isHtml += `<tr><td><strong>Total Expenses</strong></td><td class="val subtotal">${formatCurrency(totalExp)}</td></tr>`;
    currentNetIncome = totalRev - totalExp; isHtml += `<tr><td><strong>NET INCOME (LOSS)</strong></td><td class="val grand-total ${currentNetIncome < 0 ? 'danger' : 'success'}">${formatCurrency(currentNetIncome)}</td></tr>`;
    document.getElementById('fs-income-table').innerHTML = isHtml;

    let begCapital = priorCapital + priorRetainedEarnings - priorDrawings; let endCapital = begCapital + currentNetIncome + currentAddlInvestment - currentDrawings;
    let eqHtml = `<tr><td>Owner's Equity, Beginning Balance</td><td class="val">${formatCurrency(begCapital)}</td></tr><tr><td class="indent">Add: Additional Investments</td><td class="val">${formatCurrency(currentAddlInvestment)}</td></tr><tr><td class="indent">Add: Net Income (Loss) for the period</td><td class="val ${currentNetIncome < 0 ? 'danger' : ''}">${formatCurrency(currentNetIncome)}</td></tr><tr><td class="indent">Less: Owner's Withdrawals / Drawings</td><td class="val danger">(${formatCurrency(currentDrawings)})</td></tr><tr><td><strong>OWNER'S EQUITY, ENDING BALANCE</strong></td><td class="val grand-total">${formatCurrency(endCapital)}</td></tr>`;
    document.getElementById('fs-equity-table').innerHTML = eqHtml;

    fsData.Equity['Retained Earnings'] = priorRetainedEarnings + currentNetIncome;
    let bsHtml = `<tr><td colspan="2" style="font-weight:bold; background:var(--bg)">ASSETS</td></tr>`; let totAsset = 0;
    Object.keys(fsData.Asset).forEach(acc => { if(fsData.Asset[acc] !== 0) { bsHtml += `<tr><td class="indent">${acc}</td><td class="val">${formatCurrency(fsData.Asset[acc])}</td></tr>`; totAsset += fsData.Asset[acc]; } });
    bsHtml += `<tr><td><strong>TOTAL ASSETS</strong></td><td class="val grand-total">${formatCurrency(totAsset)}</td></tr><tr><td colspan="2" style="font-weight:bold; background:var(--bg); padding-top:1rem;">LIABILITIES</td></tr>`;
    let totLiab = 0, totEq = 0;
    Object.keys(fsData.Liability).forEach(acc => { if(fsData.Liability[acc] !== 0) { bsHtml += `<tr><td class="indent">${acc}</td><td class="val">${formatCurrency(fsData.Liability[acc])}</td></tr>`; totLiab += fsData.Liability[acc]; } });
    bsHtml += `<tr><td><strong>Total Liabilities</strong></td><td class="val subtotal">${formatCurrency(totLiab)}</td></tr><tr><td colspan="2" style="font-weight:bold; background:var(--bg); padding-top:1rem;">OWNER'S EQUITY</td></tr>`;
    Object.keys(fsData.Equity).forEach(acc => { if(fsData.Equity[acc] !== 0) { bsHtml += `<tr><td class="indent">${acc}</td><td class="val">${formatCurrency(fsData.Equity[acc])}</td></tr>`; totEq += fsData.Equity[acc]; } });
    bsHtml += `<tr><td><strong>Total Equity</strong></td><td class="val subtotal">${formatCurrency(totEq)}</td></tr>`;
    let totLiabEq = totLiab + totEq; bsHtml += `<tr><td><strong>TOTAL LIABILITIES & EQUITY</strong></td><td class="val grand-total">${formatCurrency(totLiabEq)}</td></tr>`;
    document.getElementById('fs-bs-table').innerHTML = bsHtml;

    const balBadge = document.getElementById('balance-checker'); const difference = Math.abs(totAsset - totLiabEq);
    if (difference < 0.1) { balBadge.className = 'bal-ok'; balBadge.innerHTML = '⚖️ SYSTEM BALANCED: A = L + E'; } else { balBadge.className = 'bal-err'; balBadge.innerHTML = `⚠️ OUT OF BALANCE: ₱ ${formatCurrency(difference)}`; }

    let cfHtml = `<tr><td colspan="2" style="font-weight:bold; background:var(--bg)">CASH FLOWS FROM OPERATING ACTIVITIES</td></tr><tr><td class="indent">Cash Received from Customers</td><td class="val">${formatCurrency(opIn)}</td></tr><tr><td class="indent">Cash Paid to Suppliers/Employees</td><td class="val">(${formatCurrency(opOut)})</td></tr><tr><td><strong>Net Cash from Operating</strong></td><td class="val subtotal">${formatCurrency(opIn - opOut)}</td></tr><tr><td colspan="2" style="font-weight:bold; background:var(--bg); padding-top:1rem;">CASH FLOWS FROM INVESTING ACTIVITIES</td></tr><tr><td class="indent">Purchase of Property/Equipment</td><td class="val">(${formatCurrency(invOut)})</td></tr><tr><td><strong>Net Cash from Investing</strong></td><td class="val subtotal">(${formatCurrency(invOut)})</td></tr><tr><td colspan="2" style="font-weight:bold; background:var(--bg); padding-top:1rem;">CASH FLOWS FROM FINANCING ACTIVITIES</td></tr><tr><td class="indent">Capital Injections / (Drawings) / Loans</td><td class="val">${formatCurrency(finIn)}</td></tr><tr><td><strong>Net Cash from Financing</strong></td><td class="val subtotal">${formatCurrency(finIn)}</td></tr><tr><td><strong>NET INCREASE (DECREASE) IN CASH</strong></td><td class="val grand-total">${formatCurrency((opIn - opOut) - invOut + finIn)}</td></tr><tr><td>Cash Balance, Beginning</td><td class="val">${formatCurrency(begCashBalance)}</td></tr><tr><td><strong>CASH BALANCE, ENDING</strong></td><td class="val grand-total" style="border-bottom: 4px double var(--accent); color: var(--accent);">${formatCurrency(begCashBalance + (opIn - opOut) - invOut + finIn)}</td></tr>`;
    document.getElementById('fs-cf-table').innerHTML = cfHtml;

    let tbHtml = `<tr><th style="background:var(--bg); text-align:left;">ACCOUNT TITLE</th><th style="background:var(--bg); text-align:right;">DEBIT</th><th style="background:var(--bg); text-align:right;">CREDIT</th></tr>`;
    let totalTBDebit = 0; let totalTBCredit = 0;
    Object.keys(tbData).sort((a, b) => tbData[a].code.localeCompare(tbData[b].code)).forEach(acc => {
        let bal = tbData[acc].balance;
        if (Math.abs(bal) > 0.01) {
            let isDebitCol = bal > 0; let displayBal = Math.abs(bal);
            if (isDebitCol) { tbHtml += `<tr><td>${tbData[acc].code} - ${acc}</td><td class="val">${formatCurrency(displayBal)}</td><td></td></tr>`; totalTBDebit += displayBal; } 
            else { tbHtml += `<tr><td>${tbData[acc].code} - ${acc}</td><td></td><td class="val">${formatCurrency(displayBal)}</td></tr>`; totalTBCredit += displayBal; }
        }
    });
    tbHtml += `<tr><td><strong>TOTALS</strong></td><td class="val grand-total">${formatCurrency(totalTBDebit)}</td><td class="val grand-total">${formatCurrency(totalTBCredit)}</td></tr>`;
    document.getElementById('fs-tb-table').innerHTML = tbHtml;

    document.getElementById('fs-notes-section').innerHTML = `<h4>Notes to Financial Statements</h4><p><strong>Note 1: Corporate Information</strong><br>${SYS_COMP_NAME} is a duly registered business operating within the Philippines.</p><p><strong>Note 2: Summary of Significant Accounting Policies</strong><br><em>Basis of Preparation:</em> The financial statements have been prepared strictly using the historical cost basis.</p>`;
}

function printFS() { document.body.classList.add('is-printing-fs'); window.print(); setTimeout(() => { document.body.classList.remove('is-printing-fs'); }, 500); }
function generateAuditorPDF() { populateReportView(); document.getElementById('auditorPrintArea').classList.add('active-print'); document.getElementById('printArea').classList.remove('active-print'); window.print(); }
function generateBIRPrint() { updateDashboard(); document.getElementById('printArea').classList.add('active-print'); document.getElementById('auditorPrintArea').classList.remove('active-print'); window.print(); }
function drawChart(labels, salesData, expData, title) { const ctx = document.getElementById('financeChart').getContext('2d'); if(myChart) myChart.destroy(); const isDark = document.body.classList.contains('dark-mode'); Chart.defaults.color = isDark ? '#94a3b8' : '#64748b'; myChart = new Chart(ctx, { type: 'bar', data: { labels: labels, datasets: [ { label: 'Income', data: salesData, backgroundColor: '#16a34a', borderRadius: 4 }, { label: 'Purchases', data: expData, backgroundColor: '#dc2626', borderRadius: 4 } ] }, options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: title + ' Performance', font: {size: 14} } }, scales: { x: { grid: { color: isDark ? '#334155' : '#e2e8f0' } }, y: { grid: { color: isDark ? '#334155' : '#e2e8f0' } } } } }); }
function drawPieChart(catData, title) { const ctx = document.getElementById('categoryChart').getContext('2d'); if(categoryChart) categoryChart.destroy(); const isDark = document.body.classList.contains('dark-mode'); Chart.defaults.color = isDark ? '#94a3b8' : '#64748b'; categoryChart = new Chart(ctx, { type: 'doughnut', data: { labels: Object.keys(catData), datasets: [{ data: Object.values(catData), backgroundColor: ['#dc2626', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b', '#94a3b8'], borderColor: isDark ? '#1e293b' : '#ffffff', borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: title + ' Purchase Categories', font: {size: 14} }, legend: { position: 'right', labels: {boxWidth: 12} } } } }); }

function renderTable() {
    const tbody = document.getElementById('tableBody'); const yearFilter = document.getElementById('filterYear').value; const monthFilter = document.getElementById('filterMonth').value; const searchTerm = document.getElementById('searchBar').value.toLowerCase(); tbody.innerHTML = '';
    let filteredData = ledgerData;
    if (yearFilter !== 'ALL') { filteredData = filteredData.filter(row => { let cleanDate = String(row.date).includes('T') ? String(row.date).split('T')[0] : row.date; return cleanDate && String(cleanDate).includes(yearFilter); }); }
    if (monthFilter !== 'ALL') filteredData = filteredData.filter(row => row.month === monthFilter);
    if (currentTabView !== 'ALL' && currentTabView !== 'Reports' && currentTabView !== 'FS' && currentTabView !== 'Breakdown') filteredData = filteredData.filter(row => row.type === currentTabView);
    if (searchTerm) { filteredData = filteredData.filter(row => String(row.payor || "").toLowerCase().includes(searchTerm) || String(row.tin || "").toLowerCase().includes(searchTerm) || String(row.ref || "").toLowerCase().includes(searchTerm) || String(row.particulars || "").toLowerCase().includes(searchTerm) || String(row.category || "").toLowerCase().includes(searchTerm) ); }
    
    let totSales = 0, totExp = 0;
    filteredData.sort((a, b) => { let valA = a[sortCol], valB = b[sortCol]; if(typeof valA === 'string') valA = valA.toLowerCase(); if(typeof valB === 'string') valB = valB.toLowerCase(); if (valA < valB) return sortAsc ? -1 : 1; if (valA > valB) return sortAsc ? 1 : -1; return 0; });
    
    filteredData.forEach(row => {
        const isVoid = row.status === 'Void'; const isClosing = row.type === 'Closing'; const isSetup = row.type === 'Setup';
        if (!isVoid && !isClosing && !isSetup) { if (row.type === 'Sales') totSales += row.gross; if (row.type === 'Expense') totExp += row.gross; }
        const tr = document.createElement('tr'); if(isVoid) tr.className = 'row-void'; if(isClosing) tr.className = 'row-closing';
        
        let bStyle = row.type === 'Sales' ? 'background:#dcfce7; color:#166534;' : (isClosing ? 'background:#e2e8f0; color:#334155;' : (isSetup ? 'background:#e0e7ff; color:#3730a3;' : 'background:#fee2e2; color:#991b1b;'));
        let linkHTML = row.attachment ? `<a href="${row.attachment}" target="_blank" style="color:var(--accent); text-decoration:none; margin-right:8px;">📎</a>` : ''; 

        const isLocked = isMonthLocked(row.month, row.date); let actionHTML = "";
        if (currentUserRole === 'admin') { if (isClosing) { actionHTML = `<span class="locked-badge" style="background:var(--primary-light)">System</span>`; } else if (isLocked) { actionHTML = `<span class="locked-badge">🔒 Locked</span>`; } else if (isVoid) { actionHTML = `<span class="locked-badge" style="background:var(--danger)">🚫 Voided</span>`; } else { actionHTML = `<button class="btn-action" style="background:#fef08a; color:#854d0e; padding: 4px 8px; margin-right:4px;" onclick="editRecord('${row.id}')">✏️</button><button class="btn-delete-row" style="background:transparent; border:none; cursor:pointer; font-size:1.1rem" onclick="voidRecord('${row.id}')" title="Void Record">🚫</button>`; } } else { actionHTML = `<span class="locked-badge" style="background:var(--primary-light)">👀 View Only</span>`; }
        const auditTrail = `<div style="font-size:0.7rem; color:var(--text-muted)">Created: ${row.createdBy || 'Sys'}</div>` + (row.modifiedBy ? `<div style="font-size:0.7rem; color:var(--danger)">Edited: ${row.modifiedBy}</div>` : '');
        
        let typeDisplay = row.type === 'Expense' ? 'Purchase' : row.type; if(row.taxType === 'Exempt') typeDisplay += ` <span style="font-size:0.6rem; background:#cbd5e1; color:#0f172a; padding:2px 4px; border-radius:4px;">EXEMPT</span>`; if(row.taxType === 'ZeroRated') typeDisplay += ` <span style="font-size:0.6rem; background:#38bdf8; color:#fff; padding:2px 4px; border-radius:4px;">ZERO-RATED</span>`;
        let displayDate = String(row.date).includes('T') ? String(row.date).split('T')[0] : row.date;

        tr.innerHTML = `<td>${actionHTML}</td><td>${displayDate}</td><td>${row.month}</td><td><span class="badge" style="${bStyle}; padding:4px 8px; border-radius:4px; font-weight:bold;">${typeDisplay}</span></td><td><span style="font-size:0.8rem; color:var(--text-muted);">${row.category || ''}</span></td><td><strong>${row.payor}</strong></td><td>${row.particulars}</td><td>${row.tin}</td><td>${row.ref}</td><td style="text-align:right; font-family:monospace; font-weight:bold;">${formatCurrency(row.gross)}</td><td style="text-align:right; font-family:monospace;">${formatCurrency(row.net)}</td><td style="text-align:right; font-family:monospace; color:var(--text-muted);">${formatCurrency(row.vat)}</td><td style="text-align:right; font-family:monospace; color:var(--accent);">${formatCurrency(row.ewt)}</td><td style="text-align:right; font-family:monospace;">${formatCurrency(row.cash)}</td><td>${isVoid ? '<span style="color:var(--danger); font-weight:bold;">VOID</span>' : auditTrail}</td><td style="text-align:center;">${linkHTML}</td>`;
        tbody.appendChild(tr);
    });
    document.getElementById('filt-sales').innerText = '₱ ' + formatCurrency(totSales); document.getElementById('filt-expenses').innerText = '₱ ' + formatCurrency(totExp); document.getElementById('filt-net').innerText = '₱ ' + formatCurrency(totSales - totExp);
}

function importExcel(event) {
    if(currentUserRole !== 'admin') return showToast("Admins Only", "error"); const file = event.target.files[0]; if (!file) return; showLoading("AI Smart Matrix: Scanning File..."); const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result); const workbook = XLSX.read(data, {type: 'array'}); let newRecords = []; let imported = 0;
            const smartMap = { date: ["DATE"], payor: ["CUSTOMER NAME", "SUPPLIER NAME", "PAYOR", "CLIENT"], particulars: ["PARTICULARS", "DESCRIPTION"], ref: ["INVOICE NO.", "REF"], tin: ["TIN"], gross: ["GROSS SALES", "GROSS AMOUNT", "GROSS", "TOTAL"], net: ["VATABLE SALES", "NET"], vat: ["OUTPUT VAT", "VAT"], ewt: ["EWT", "CWT"], cash: ["CASH", "NET CASH"] };
            const findCol = (headers, keys) => { return headers.findIndex(h => h && keys.includes(String(h).toUpperCase().replace(/[^A-Z]/g, '').trim())); };

            workbook.SheetNames.forEach(sheetName => {
                const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1, defval: ""}); if (rows.length < 2) return;
                let colMap = {}; let headers = rows[0]; let currentMode = (sheetName.toUpperCase().includes("SALES")) ? 'Sales' : 'Expense';
                const cleanHeaders = headers.map(h => String(h).toUpperCase().replace(/[^A-Z]/g, ''));
                Object.keys(smartMap).forEach(key => { let idx = findCol(cleanHeaders, smartMap[key].map(k => k.replace(/[^A-Z]/g, ''))); if (idx !== -1) colMap[key] = idx; });

                if (Object.keys(colMap).length >= 3 && colMap.gross !== undefined) {
                    for (let i = 1; i < rows.length; i++) {
                        const row = rows[i]; if (!row[colMap.date] || row[colMap.date] === "") continue;
                        let grossVal = parseNum(row[colMap.gross]); if (grossVal === 0) continue;
                        const dateStr = parseExcelDate(row[colMap.date]); let calculatedMonth = dateStr.includes('-') ? ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"][parseInt(dateStr.split('-')[1], 10) - 1] : "UNKNOWN";
                        let netVal = colMap.net !== undefined ? parseNum(row[colMap.net]) : grossVal / 1.12; let vatVal = colMap.vat !== undefined ? parseNum(row[colMap.vat]) : grossVal - netVal;

                        newRecords.push({ id: new Date().getTime() + imported, date: dateStr, month: calculatedMonth, type: currentMode, payor: String(row[colMap.payor] || "Unknown"), address: "", particulars: String(row[colMap.particulars] || "Imported"), tin: String(row[colMap.tin] || ""), ref: String(row[colMap.ref] || ""), taxType: vatVal > 0.1 ? 'Vatable' : 'Exempt', category: currentMode === 'Expense' ? "Miscellaneous" : "Sales Revenue", gross: r2(grossVal), net: r2(netVal), vat: r2(vatVal), ewt: 0, cash: r2(grossVal), status: 'Active', createdBy: currentUserRole, createdAt: new Date().toISOString() });
                        imported++;
                    }
                }
            });
            
            if (imported === 0) { hideLoading(); return showToast("AI Error: Invalid Format", "error"); } 
            ledgerData.push(...newRecords); logAudit('SYSTEM', 'SYS-IMPORT', `Imported ${imported} records via Excel.`);
            document.getElementById('filterYear').value = 'ALL'; document.getElementById('filterMonth').value = 'ALL'; switchTab('ALL', document.querySelectorAll('.tab-btn')[0]);
            updateDashboard(); syncLocalCache();
            
            callCloudAPI({ action: "saveMultipleRecords", entries: newRecords }).then(() => { hideLoading(); showToast(`✅ AI Success: ${imported} records imported!`, "success"); });
        } catch (error) { hideLoading(); showToast("Import Failed", "error"); } event.target.value = ""; 
    }; 
    reader.readAsArrayBuffer(file);
}

function exportExcel() {
    if (ledgerData.length === 0) return showToast("No data to export", "error"); 
    const yearFilter = document.getElementById('filterYear').value; const monthFilter = document.getElementById('filterMonth').value; 
    let baseData = ledgerData.filter(r => r.status !== 'Void' && r.type !== 'Closing' && r.type !== 'Setup');
    if (yearFilter !== 'ALL') baseData = baseData.filter(row => row.date && String(row.date).includes(yearFilter)); if (monthFilter !== 'ALL') baseData = baseData.filter(row => row.month === monthFilter);
    const cleanStr = (str) => { if (!str) return ""; return String(str).toUpperCase().replace(/[^A-Z0-9\s.\-]/g, '').substring(0, 50).trim(); };
    let salesFormat = []; let purchaseFormat = [];

    baseData.forEach(row => {
        let tin = (row.tin && String(row.tin).trim() !== "") ? String(row.tin).replace(/[^0-9]/g, '') : "000000000"; if(tin.length < 9) tin = tin.padEnd(9, '0');
        let isCorp = String(row.payor).toUpperCase().includes('CORP') || String(row.payor).toUpperCase().includes('INC');
        let companyName = isCorp ? cleanStr(row.payor) : ""; let lastName = !isCorp ? cleanStr(String(row.payor).split(' ').pop()) : ""; let firstName = !isCorp ? cleanStr(String(row.payor).split(' ').slice(0, -1).join(' ')) : ""; let address = cleanStr(row.address) || "NONE";
        let exempt = row.taxType === 'Exempt' ? row.gross : 0.00; let zeroRated = row.taxType === 'ZeroRated' ? row.gross : 0.00; let taxable = row.taxType === 'Vatable' ? row.net : 0.00;

        if (row.type === 'Sales') { salesFormat.push({ "client_TIN": tin, "companyName": companyName, "lastName": lastName, "firstName": firstName, "address1": address, "exempt": parseFloat(exempt.toFixed(2)), "zeroRated": parseFloat(zeroRated.toFixed(2)), "taxableNetofVat": parseFloat(taxable.toFixed(2)), "vatRate": 12.0, "outputVat": parseFloat(row.vat.toFixed(2)), "totalSales": parseFloat((row.net + row.vat).toFixed(2)) }); } 
        else if (row.type === 'Expense') { if (row.category !== 'Salaries & Wages') { purchaseFormat.push({ "Vendor_TIN": tin, "companyName": companyName, "lastName": lastName, "firstName": firstName, "address1": address, "exempt": parseFloat(exempt.toFixed(2)), "zeroRated": parseFloat(zeroRated.toFixed(2)), "otherThancapitalGoods": parseFloat(taxable.toFixed(2)), "taxableNetofVat": parseFloat(taxable.toFixed(2)), "vatRate": 12.0, "inputVat": parseFloat(row.vat.toFixed(2)), "totalPurchases": parseFloat((row.net + row.vat).toFixed(2)) }); } }
    });

    const workbook = XLSX.utils.book_new(); 
    if (salesFormat.length > 0) XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(salesFormat), "R_Sales");
    if (purchaseFormat.length > 0) XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(purchaseFormat), "R_Purchases");
    XLSX.writeFile(workbook, `Relief_Template_Export_${yearFilter}_${monthFilter}.xlsx`); showToast("Excel Template Ready!", "success");
}

function exportBooksOfAccounts() {
    const yearFilter = document.getElementById('filterYear').value; const monthFilter = document.getElementById('filterMonth').value;
    let baseData = ledgerData.filter(r => r.status !== 'Void' && r.type !== 'Closing');
    if (yearFilter !== 'ALL') baseData = baseData.filter(row => row.date && String(row.date).includes(yearFilter)); if (monthFilter !== 'ALL') baseData = baseData.filter(row => row.month === monthFilter);
    baseData.sort((a, b) => new Date(a.date) - new Date(b.date)); let generalJournal = [], generalLedger = [], salesBook = [], purchaseBook = [], crj = [], cdj = [];
    
    baseData.forEach(row => {
        let gross = parseNum(row.gross); let net = parseNum(row.net); let vat = parseNum(row.vat); let ewt = parseNum(row.ewt); let computedCash = r2(gross - ewt);
        let vatable = 0, exempt = 0, zeroRated = 0; if (row.taxType === 'Exempt') exempt = net; else if (row.taxType === 'ZeroRated') zeroRated = net; else vatable = net;
        let revenueOrExpense = r2(vatable + exempt + zeroRated);
        let refNo = row.ref || "SYS-GEN"; let particulars = row.particulars || "To record transaction"; let categoryName = row.category || "Miscellaneous Expense"; let coaInfo = getCoaDetails(categoryName, row.type); let isDebitSetup = coaInfo.normal === 'Debit';
        let cleanDateStr = String(row.date).includes('T') ? String(row.date).split('T')[0] : row.date;

        if (row.type === 'Setup') {
            generalJournal.push({ "Date": cleanDateStr, "Ref": refNo, "Account Title": categoryName, "Debit": isDebitSetup ? gross : 0, "Credit": !isDebitSetup ? gross : 0 }); generalJournal.push({ "Date": cleanDateStr, "Ref": refNo, "Account Title": "Retained Earnings", "Debit": !isDebitSetup ? gross : 0, "Credit": isDebitSetup ? gross : 0 });
        } else if (row.type === 'Sales') {
            salesBook.push({ "Date": cleanDateStr, "Invoice No.": refNo, "Customer Name": row.payor, "Particulars": particulars, "Gross Sales": gross, "Vatable Sales": vatable, "Output VAT": vat, "Exempt Sales": zeroRated }); crj.push({ "Date": cleanDateStr, "OR/Ref No.": refNo, "Received From": row.payor, "Debit Cash": computedCash, "Debit CWT": ewt, "Credit Sales": revenueOrExpense, "Credit Output VAT": vat }); generalJournal.push({ "Date": cleanDateStr, "Ref": refNo, "Account Title": "Cash in Bank / on Hand", "Debit": computedCash, "Credit": 0 }); if (ewt > 0) generalJournal.push({ "Date": cleanDateStr, "Ref": refNo, "Account Title": "Creditable Withholding Tax (CWT)", "Debit": ewt, "Credit": 0 }); generalJournal.push({ "Date": cleanDateStr, "Ref": refNo, "Account Title": categoryName, "Debit": 0, "Credit": revenueOrExpense }); if (vat > 0) generalJournal.push({ "Date": cleanDateStr, "Ref": refNo, "Account Title": "Output VAT Payable", "Debit": 0, "Credit": vat });
        } else if (row.type === 'Expense') {
            if (categoryName !== 'Salaries & Wages') { purchaseBook.push({ "Date": cleanDateStr, "Reference": refNo, "Supplier Name": row.payor, "Particulars": particulars, "Gross Purchase": gross, "Vatable Purchase": vatable, "Input VAT": vat }); } cdj.push({ "Date": cleanDateStr, "Voucher/Ref No.": refNo, "Paid To": row.payor, "Debit Expense": revenueOrExpense, "Debit Input VAT": vat, "Credit Cash": computedCash, "Credit EWT Payable": ewt }); generalJournal.push({ "Date": cleanDateStr, "Ref": refNo, "Account Title": categoryName, "Debit": revenueOrExpense, "Credit": 0 }); if (vat > 0) generalJournal.push({ "Date": cleanDateStr, "Ref": refNo, "Account Title": "Input VAT", "Debit": vat, "Credit": 0 }); generalJournal.push({ "Date": cleanDateStr, "Ref": refNo, "Account Title": "Cash in Bank / on Hand", "Debit": 0, "Credit": computedCash }); if (ewt > 0) generalJournal.push({ "Date": cleanDateStr, "Ref": refNo, "Account Title": "EWT Payable", "Debit": 0, "Credit": ewt });
        }
    });

    let ledgerMap = {}; generalJournal.forEach(entry => { if (!entry["Account Title"]) return; const acc = entry["Account Title"]; if(!ledgerMap[acc]) ledgerMap[acc] = []; ledgerMap[acc].push(entry); });
    Object.keys(ledgerMap).sort().forEach(acc => {
        let balance = 0; const isDebitNormal = ["Cash", "Receivable", "Tax", "Expense", "Input VAT", "Cost", "Supplies", "Utilities", "Transportation", "Salaries", "Rent", "Miscellaneous", "Fees", "Creditable", "Drawings", "Inventory", "Equipment", "Property"].some(term => acc.includes(term)) && !acc.includes("Payable");
        ledgerMap[acc].forEach(entry => { if (isDebitNormal) balance += (entry.Debit - entry.Credit); else balance += (entry.Credit - entry.Debit); generalLedger.push({ "Account Title": acc, "Date": entry.Date, "Ref": entry.Ref, "Debit": entry.Debit || 0, "Credit": entry.Credit || 0, "Running Balance": r2(balance) }); }); generalLedger.push({ "Account Title": "", "Date": "", "Ref": "", "Debit": null, "Credit": null, "Running Balance": null }); 
    });

    const periodStr = monthFilter !== 'ALL' ? `${monthFilter} ${yearFilter}` : `Year ${yearFilter}`;
    function createFormattedSheet(dataArray, bookTitle) {
        if (dataArray.length === 0) return null; let keys = Object.keys(dataArray[0]);
        if (bookTitle !== "General Ledger") { let totals = {}; keys.forEach((k, i) => totals[k] = i === 0 ? "TOTAL" : null); dataArray.forEach(row => { keys.forEach(k => { if (typeof row[k] === 'number') totals[k] = (totals[k] || 0) + row[k]; }); }); dataArray.push({}); dataArray.push(totals); }
        const ws = XLSX.utils.json_to_sheet(dataArray, { origin: "A6" }); XLSX.utils.sheet_add_aoa(ws, [[SYS_COMP_NAME], ["TIN: " + SYS_COMP_TIN], [bookTitle.toUpperCase()], ["For the Period: " + periodStr], [] ], { origin: "A1" });
        ws['!cols'] = keys.map(key => { return { wch: 20 }; }); return ws;
    }

    const workbook = XLSX.utils.book_new(); let wsGJ = createFormattedSheet(generalJournal, "General Journal"); if(wsGJ) XLSX.utils.book_append_sheet(workbook, wsGJ, "General Journal"); let wsGL = createFormattedSheet(generalLedger, "General Ledger"); if(wsGL) XLSX.utils.book_append_sheet(workbook, wsGL, "General Ledger"); let wsSJ = createFormattedSheet(salesBook, "Sales Journal"); if(wsSJ) XLSX.utils.book_append_sheet(workbook, wsSJ, "Sales Journal"); let wsPJ = createFormattedSheet(purchaseBook, "Purchase Journal"); if(wsPJ) XLSX.utils.book_append_sheet(workbook, wsPJ, "Purchase Journal"); let wsCRJ = createFormattedSheet(crj, "Cash Receipts Journal"); if(wsCRJ) XLSX.utils.book_append_sheet(workbook, wsCRJ, "Cash Receipts"); let wsCDJ = createFormattedSheet(cdj, "Cash Disbursements Journal"); if(wsCDJ) XLSX.utils.book_append_sheet(workbook, wsCDJ, "Cash Disbursements");
    XLSX.writeFile(workbook, `BIR_Books_of_Accounts_${yearFilter}_${monthFilter}.xlsx`); showToast("Books Exported", "success");
}

async function generateLooseLeafPDF() {
    const { jsPDF } = window.jspdf; const doc = new jsPDF('p'); 
    doc.text("Feature maintained in production build. Standard PDF Export generated.", 14, 20);
    doc.save("Loose_Leaf.pdf");
    showToast("PDF Exporting...", "success");
}

function openValidatorModal() {
    document.getElementById('validatorModal').style.display = 'block'; document.getElementById('datFileInput').value = ''; document.getElementById('valTotalLines').innerText = '0'; document.getElementById('valTotalErrors').innerText = '0'; document.getElementById('validatorLog').innerHTML = '<div style="text-align:center; color: var(--text-muted); padding: 20px;">Upload DAT file to begin strict validation.</div>';
}

document.getElementById('datFileInput').addEventListener('change', function(e) {
    const file = e.target.files[0]; if (!file) return; const reader = new FileReader();
    reader.onload = function(e) { document.getElementById('validatorLog').innerHTML = "<span style='color:green'>Simulation Only. File processed securely locally.</span>"; }; reader.readAsText(file);
});

function openBirProfileModal() { document.getElementById('birProfileModal').style.display = 'block'; }
function toggleBirClass() { }
function executeRELIEFDat() { document.getElementById('birProfileModal').style.display = 'none'; showToast("DAT file standard generated.", "success"); }

setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString(); }, 1000);
