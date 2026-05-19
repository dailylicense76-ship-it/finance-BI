:root { --primary: #0f172a; --primary-light: #1e293b; --accent: #2563eb; --success: #16a34a; --danger: #dc2626; --warning: #eab308; --bg: #f8fafc; --card-bg: #ffffff; --border: #e2e8f0; --text-main: #334155; --text-muted: #64748b; --input-bg: #ffffff; }
body.dark-mode { --primary: #f8fafc; --primary-light: #0f172a; --accent: #3b82f6; --bg: #0f172a; --card-bg: #1e293b; --border: #334155; --text-main: #f8fafc; --text-muted: #94a3b8; --input-bg: #0f172a; }
* { box-sizing: border-box; font-family: 'Inter', -apple-system, sans-serif; transition: background-color 0.3s, color 0.3s; }
body { margin: 0; padding: 0; background-color: var(--bg); color: var(--text-main); overflow: hidden; } 
.app-view { display: block; height: 100vh; overflow-y: auto;}
header { background-color: #0f172a; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); }
.container { max-width: 1600px; margin: 2rem auto; padding: 0 2rem; }
.dashboard-header { font-size: 1.1rem; font-weight: bold; color: var(--primary); margin-bottom: 1rem; border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;}
.dashboard-grid { display: grid; grid-template-columns: 1fr 1.5fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
@media (max-width: 1200px) { .dashboard-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 800px) { .dashboard-grid { grid-template-columns: 1fr; } }
.dashboard-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.card { background-color: var(--card-bg); padding: 1.5rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid var(--border); }
.card.bir-summary { border-left: 4px solid var(--accent); }
.card h3 { margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--text-muted); text-transform: uppercase; }
.card .amount { font-size: 1.5rem; font-weight: 700; color: var(--text-main); }
.card .sub-text { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; }
.chart-container { background: var(--card-bg); padding: 1rem; border-radius: 10px; border: 1px solid var(--border); box-shadow: 0 4px 6px rgba(0,0,0,0.05); height: 300px; position: relative;}
.modal { display: none; position: fixed; z-index: 2000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); backdrop-filter: blur(5px); overflow-y: auto;}
.modal-content { background-color: var(--card-bg); margin: 5% auto; padding: 2rem; width: 90%; max-width: 900px; border-radius: 12px; position: relative; box-shadow: 0 25px 50px rgba(0,0,0,0.25); animation: zoomIn 0.3s; border: 1px solid var(--border);}
@keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.close-btn { position: absolute; right: 20px; top: 15px; font-size: 28px; cursor: pointer; color: var(--text-muted); transition: 0.2s; }
.close-btn:hover { color: var(--danger); }
#loginOverlay { position: fixed; width: 100%; height: 100%; top: 0; left: 0; background: var(--primary-light); z-index: 3000; display: flex; align-items: center; justify-content: center; flex-direction: column; }
.login-box { background: var(--card-bg); padding: 2.5rem; border-radius: 12px; text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.4); width: 350px; border: 1px solid var(--border); }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; }
.form-group label { font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem; text-transform: uppercase; color: var(--text-muted); }
.form-group input, .form-group select { padding: 0.625rem; border: 1px solid var(--border); border-radius: 6px; background: var(--input-bg); color: var(--text-main); }
.form-group input:focus { border-color: var(--accent); outline: none; }
.form-group input[readonly] { background: #e2e8f0; cursor: not-allowed; }
.currency-input { text-align: right; font-family: monospace; font-size: 1rem !important; font-weight: bold; color: var(--accent) !important; }
.btn-submit { grid-column: 1 / -1; background-color: var(--accent); color: white; padding: 0.875rem; border: none; border-radius: 6px; font-weight: 600; font-size: 1rem; cursor: pointer; margin-top: 1rem; transition: 0.2s; }
.btn-submit:hover { opacity: 0.9; transform: translateY(-1px); }
.tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 2px solid var(--border); padding-bottom: 0px; align-items: center; flex-wrap: wrap;}
.tab-btn { background: none; border: none; padding: 0.75rem 1.5rem; font-size: 1rem; font-weight: 600; color: var(--text-muted); cursor: pointer; border-bottom: 3px solid transparent; }
.tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
.tab-report { background: #0f172a; color: white !important; border-radius: 6px 6px 0 0; border: none; margin-left: auto; padding: 0.75rem 2rem;}
.tab-fs { background: #0ea5e9; color: white !important; border-radius: 6px 6px 0 0; border: none; padding: 0.75rem 1.5rem; margin-left: 5px;}
.tab-bd { background: #8b5cf6; color: white !important; border-radius: 6px 6px 0 0; border: none; padding: 0.75rem 1.5rem; margin-left: 5px;}
.table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; background: var(--card-bg); padding: 1rem; border-radius: 10px; border: 1px solid var(--border); flex-wrap: wrap; gap: 1rem; }
.search-box { padding: 0.5rem; border: 1px solid var(--border); border-radius: 6px; min-width: 150px; font-weight: bold; background: var(--input-bg); color: var(--text-main); }
.btn-action { padding: 0.5rem 1rem; border-radius: 6px; border: none; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; transition: 0.2s;}
.btn-action:hover { opacity: 0.8; }
.btn-new { background-color: var(--accent); color: white; font-size: 1rem; padding: 0.6rem 1.2rem; }
.btn-print { background-color: #475569; color: white; }
.btn-theme { background-color: transparent; color: white; font-size: 1.2rem; border: 1px solid rgba(255,255,255,0.2); }
.btn-lock { background-color: var(--warning); color: white; }
.btn-close-year { background-color: var(--danger); color: white; }
.locked-badge { background-color: var(--text-muted); color: white; font-size: 0.75rem; padding: 4px 8px; border-radius: 4px; display: inline-block;}
.role-badge { font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 12px; background: rgba(255,255,255,0.2); margin-left: 10px; vertical-align: middle; }
.mini-summary-container { display: flex; gap: 1rem; margin-bottom: 1rem; }
.mini-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; flex: 1; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; }
.mini-card-title { font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;}
.mini-card-value { font-size: 1.2rem; font-weight: bold; color: var(--text-main); }
.table-wrapper { background: var(--card-bg); border-radius: 10px; border: 1px solid var(--border); overflow-x: auto; max-height: 600px; overflow-y: auto;}
table { width: 100%; border-collapse: collapse; min-width: 1800px; }
th, td { padding: 0.875rem 1rem; border-bottom: 1px solid var(--border); font-size: 0.875rem; white-space: nowrap; }
th { background-color: var(--primary-light); color: white; text-align: left; position: sticky; top: 0; z-index: 10; cursor: pointer; user-select: none; }
th:hover { background-color: var(--accent); }
.row-void { background-color: #fef2f2; color: #ef4444; text-decoration: line-through; }
.row-void td { opacity: 0.6; }
.row-closing { background-color: #f1f5f9; font-style: italic; }
.row-closing td { color: #64748b; }
#toast-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
.toast { padding: 15px 25px; border-radius: 8px; color: white; font-weight: bold; box-shadow: 0 10px 15px rgba(0,0,0,0.2); animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; display: flex; align-items: center; gap: 10px;}
.toast.success { background: #16a34a; border-left: 5px solid #14532d; }
.toast.error { background: #dc2626; border-left: 5px solid #7f1d1d; }
.toast.info { background: #2563eb; border-left: 5px solid #1e3a8a; }
@keyframes slideUp { from { opacity: 0; transform: translateY(50px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes fadeOut { to { opacity: 0; transform: translateY(-20px); } }
#loadingOverlay { display: none; position: fixed; width: 100%; height: 100%; top: 0; left: 0; background: rgba(15, 23, 42, 0.9); z-index: 4000; text-align: center; justify-content: center; font-size: 1.5rem; font-weight: bold; color: white; flex-direction: column; align-items: center; backdrop-filter: blur(5px); }
.spinner { border: 6px solid rgba(255,255,255,0.1); border-top: 6px solid var(--accent); border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite; margin-bottom: 20px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
#cloudStatus { font-size: 0.8rem; padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: bold; }
.status-cloud { background-color: #dcfce7; color: #166534; }
.status-local { background-color: #fef08a; color: #854d0e; }
.status-error { background-color: #fee2e2; color: #991b1b; }

#reportWrapper, #breakdownWrapper { display: none; background: var(--card-bg); border-radius: 10px; border: 1px solid var(--border); padding: 2rem; min-height: 400px; }
.report-summary-box { background: var(--primary-light); color: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;}
.report-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
.r-stat { background: var(--bg); border: 1px solid var(--border); padding: 1rem; border-radius: 8px; text-align: center; }
.r-stat h4 { margin: 0 0 5px 0; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; }
.r-stat span { font-size: 1.4rem; font-weight: bold; color: var(--text-main); }

/* --- ADDED FS & AUDITOR CSS --- */
#fsWrapper { display: none; background: var(--card-bg); border-radius: 10px; border: 1px solid var(--border); padding: 2rem; min-height: 400px; position: relative;}
.fs-header { text-align: center; margin-bottom: 2rem; border-bottom: 2px solid var(--border); padding-bottom: 1rem; }
.fs-header h2 { margin: 0; font-size: 1.5rem; text-transform: uppercase; }
.fs-header p { margin: 5px 0 0 0; color: var(--text-muted); }
.fs-section { margin-bottom: 3rem; }
.fs-section h3 { background: var(--primary-light); color: white; padding: 0.5rem 1rem; border-radius: 4px; font-size: 1rem; margin: 0 0 1rem 0; }
.fs-table { width: 100%; min-width: auto; border-collapse: collapse; margin-bottom: 1rem; }
.fs-table td { padding: 0.5rem 1rem; border-bottom: 1px solid var(--border); font-size: 0.95rem; }
.fs-table th { background: var(--bg); color: var(--text-main); font-weight: bold; padding: 0.75rem 1rem; border-bottom: 2px solid var(--border); }
.fs-table .indent { padding-left: 2rem; color: var(--text-muted); }
.fs-table .val { text-align: right; font-family: monospace; font-weight: bold; width: 25%; }
.fs-table .subtotal { font-weight: bold; border-top: 1px solid var(--text-main); }
.fs-table .grand-total { font-weight: bold; font-size: 1.1rem; border-top: 2px solid var(--text-main); border-bottom: 4px double var(--text-main); color: var(--accent); }
.fs-table .grand-total.danger { color: var(--danger); }
.fs-table .grand-total.success { color: var(--success); }

/* Validation Badge */
#balance-checker { position: absolute; top: 20px; right: 20px; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 1rem; z-index: 100; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: none; }
.bal-ok { background: #dcfce7; color: #166534; border: 1px solid #16a34a; }
.bal-err { background: #fee2e2; color: #991b1b; border: 1px solid #dc2626; animation: pulse 2s infinite; }
@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }

.notes-fs { background: #f8fafc; border-left: 4px solid var(--accent); padding: 1.5rem; border-radius: 0 8px 8px 0; font-size: 0.9rem; line-height: 1.6; }
.notes-fs h4 { margin-top: 0; color: var(--primary); text-transform: uppercase; }

#printArea, #auditorPrintArea { display: none; }

.watermark-bg {
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 8rem; font-weight: 900; color: rgba(100, 116, 139, 0.03); 
    z-index: 0; pointer-events: none; white-space: nowrap; user-select: none;
}
.copyright-footer {
    position: fixed; bottom: 0; left: 0; width: 100%; background: #0f172a; color: #64748b;
    text-align: center; padding: 6px; font-size: 0.7rem; z-index: 5000;
    border-top: 1px solid #1e293b; letter-spacing: 0.5px;
}
.copyright-footer span { color: #38bdf8; font-weight: bold; }

/* --- BREAKDOWN CSS --- */
.bd-list-item { display: flex; justify-content: space-between; padding: 12px 15px; border-bottom: 1px solid var(--border); font-size: 1rem; }
.bd-list-item:nth-child(even) { background: var(--bg); }
.bd-list-item span.cat-name { font-weight: 600; color: var(--text-main); }
.bd-list-item span.cat-val { font-family: monospace; font-weight: bold; color: var(--danger); font-size: 1.1rem; }
.ai-recommendation { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; }
body.dark-mode .ai-recommendation { background: rgba(22, 163, 74, 0.1); border-color: #14532d; }
.ai-recommendation h3 { color: #16a34a; margin-top: 0; display: flex; align-items: center; gap: 10px; }
.ai-recommendation ul { padding-left: 20px; margin-bottom: 0; }
.ai-recommendation li { margin-bottom: 10px; font-size: 0.95rem; line-height: 1.5; }

/* --- PRINT CSS RULES FOR FS PORTRAIT & BIR --- */
@media print {
    @page { size: portrait; margin: 0.5in; }
    body { background: white !important; color: black !important; overflow: visible !important; }
    
    .app-view, header, #loginOverlay, #entryModal, #settingsModal, #auditModal, #birProfileModal, #validatorModal, #loadingOverlay, #toast-container { display: none !important; }
    
    #printArea.active-print, #auditorPrintArea.active-print { display: block !important; padding: 20px; font-family: 'Times New Roman', Times, serif; }
    
    body.is-printing-fs .app-view { display: block !important; height: auto !important; overflow: visible !important; background: white !important; }
    body.is-printing-fs header, body.is-printing-fs .dashboard-header, body.is-printing-fs .dashboard-grid, 
    body.is-printing-fs .table-toolbar, body.is-printing-fs .tabs, body.is-printing-fs #ledgerView, 
    body.is-printing-fs #reportWrapper, body.is-printing-fs #breakdownWrapper, body.is-printing-fs #printArea, body.is-printing-fs #auditorPrintArea, 
    body.is-printing-fs .btn-print, body.is-printing-fs #balance-checker { display: none !important; }
    
    body.is-printing-fs #mainApp { display: block !important; }
    body.is-printing-fs .container { max-width: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
    body.is-printing-fs #fsWrapper { display: block !important; border: none !important; padding: 0 !important; margin: 0 !important; box-shadow: none !important; }
    
    body.is-printing-fs .fs-table { border-collapse: collapse; width: 100%; font-size: 11pt; color: black !important; }
    body.is-printing-fs .fs-table td, body.is-printing-fs .fs-table th { color: black !important; border-bottom: 1px solid #ccc; padding: 6px 4px; }
    body.is-printing-fs .fs-header { margin-top: 10px !important; margin-bottom: 15px !important; page-break-inside: avoid; }
    body.is-printing-fs .fs-section { page-break-inside: avoid; }
    
    .print-page-break { page-break-before: always; margin-top: 0.5in !important; }

    table { min-width: auto !important; width: 100% !important; }
    .watermark-bg { color: rgba(0, 0, 0, 0.04); font-size: 6rem; z-index: -1; }
    .copyright-footer { display: block !important; position: fixed; bottom: 0; background: white; color: black; border-top: 1px solid #ccc; font-size: 8px; }
    
    .print-title { text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 5px; text-transform: uppercase; }
    .print-subtitle { text-align: center; font-size: 12px; margin-bottom: 30px; }
    .bir-box { border: 2px solid black; padding: 15px; margin-bottom: 20px; }
    .bir-box-title { font-weight: bold; font-size: 16px; border-bottom: 1px solid black; padding-bottom: 5px; margin-bottom: 10px; background-color: #f0f0f0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .bir-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
    .bir-label { width: 70%; }
    .bir-value { width: 30%; text-align: right; font-family: monospace; font-size: 14px; font-weight: bold; border-bottom: 1px dashed #ccc; }
    
    .auditor-header { text-align: center; border-bottom: 2px solid black; padding-bottom: 15px; margin-bottom: 20px; }
    .auditor-header h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
    .auditor-header p { margin: 5px 0 0 0; font-size: 14px; color: #333; }
    .auditor-section { margin-bottom: 25px; }
    .auditor-section h2 { font-size: 16px; background: #e2e8f0 !important; padding: 8px; margin: 0 0 10px 0; border: 1px solid #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    
    .auditor-table { width: 100%; border-collapse: collapse; font-size: 14px; table-layout: fixed; }
    .auditor-table td { padding: 8px; border-bottom: 1px solid #ccc; color: black !important; }
    .auditor-table td:first-child { width: 70%; }
    .auditor-table td.val { width: 30%; text-align: right; font-family: monospace; font-weight: bold; color: black !important; }
    
    .auditor-table .total-row td { border-top: 2px solid black; border-bottom: 4px double black; font-weight: bold; font-size: 16px; padding: 12px 8px; }
    .auditor-signatures { margin-top: 50px; display: flex; justify-content: space-between; }
    .auditor-sig-box { width: 40%; text-align: center; border-top: 1px solid black; padding-top: 5px; font-size: 14px; }
}

/* ========================================================
   DEGZ PULSE - UNIVERSAL AUTO-FIT OVERRIDES 
   (Fluid responsive overrides for Mobile to 32" TV)
   ======================================================== */
html { font-size: clamp(12px, 0.8vw + 10px, 24px); }
.container { max-width: 100% !important; width: 100%; margin: 1rem auto; padding: 0 clamp(1rem, 2vw, 3rem); box-sizing: border-box; }
.dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 450px), 1fr)); gap: 1.5rem; margin-bottom: 2rem; align-items: start; }
.dashboard-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 1rem; height: 100%; }
.chart-container { height: clamp(300px, 30vh, 500px); width: 100%; }
.table-wrapper { width: 100%; max-height: clamp(400px, 60vh, 800px); }
.modal-content { padding: clamp(1.5rem, 3vw, 2.5rem); width: 95%; max-width: 1200px; }
.form-grid { display: grid !important; grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr)); }
.mini-summary-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 1rem; margin-bottom: 1rem; }
.table-toolbar { flex-wrap: wrap; padding: clamp(0.5rem, 1vw, 1rem); }
