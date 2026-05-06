/* ============================================================
   HVAC NEXUS MOBILE — material-receiving.js
   Material receiving — field receiving of goods with photos
   Loaded on demand by app.js router
   ============================================================ */
'use strict';

(function() {

// ── CSS ────────────────────────────────────────────────────
if (!document.getElementById('mr-css')) {
  var st = document.createElement('style');
  st.id = 'mr-css';
  st.textContent = [
    '.mr-search{position:relative;margin-bottom:14px}',
    '.mr-search svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-tertiary);pointer-events:none;width:18px;height:18px}',
    '.mr-search input{width:100%;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:11px 12px 11px 40px;font-size:15px;font-family:var(--font);color:var(--text-primary);outline:none;-webkit-appearance:none}',
    '.mr-search input:focus{border-color:var(--accent)}',
    '.mr-section-hdr{display:flex;align-items:center;justify-content:space-between;margin:18px 0 10px;font-size:11px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.8px}',
    '.mr-supp-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;margin-bottom:10px;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:border-color 0.15s}',
    '.mr-supp-card:active{background:var(--bg-elevated)}',
    '.mr-supp-name{font-size:15px;font-weight:600;color:var(--text-primary);margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;gap:10px}',
    '.mr-supp-meta{font-size:12px;color:var(--text-secondary);display:flex;gap:14px;flex-wrap:wrap}',
    '.mr-supp-out{font-size:11px;font-weight:700;background:var(--accent-dim);color:var(--accent);padding:3px 8px;border-radius:20px;flex-shrink:0}',
    '.mr-supp-out.zero{background:rgba(34,197,94,0.15);color:#22C55E}',
    '.mr-rcpt-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:12px 14px;margin-bottom:8px;cursor:pointer;-webkit-tap-highlight-color:transparent}',
    '.mr-rcpt-card:active{background:var(--bg-elevated)}',
    '.mr-rcpt-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;gap:10px}',
    '.mr-rcpt-supp{font-size:14px;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.mr-rcpt-date{font-size:11px;color:var(--text-secondary);font-family:var(--font-mono);flex-shrink:0}',
    '.mr-rcpt-meta{display:flex;gap:10px;font-size:12px;color:var(--text-secondary);align-items:center}',
    '.mr-rcpt-meta .b{display:inline-flex;align-items:center;gap:4px}',
    '.mr-rcpt-dmg{color:#F87171;font-weight:600}',
    /* Receive flow */
    '.mr-step{padding:14px 0}',
    '.mr-step-title{font-size:18px;font-weight:700;color:var(--text-primary);margin-bottom:4px}',
    '.mr-step-sub{font-size:13px;color:var(--text-secondary);margin-bottom:16px}',
    '.mr-item{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:12px;margin-bottom:8px;display:flex;align-items:flex-start;gap:12px;cursor:pointer;-webkit-tap-highlight-color:transparent}',
    '.mr-item:active{background:var(--bg-elevated)}',
    '.mr-item.sel{border-color:var(--accent);background:var(--accent-dim)}',
    '.mr-item-cb{width:22px;height:22px;border:2px solid var(--border);border-radius:6px;flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;background:var(--bg-card)}',
    '.mr-item.sel .mr-item-cb{background:var(--accent);border-color:var(--accent)}',
    '.mr-item.sel .mr-item-cb svg{display:block}',
    '.mr-item-cb svg{width:14px;height:14px;color:#fff;display:none}',
    '.mr-item-info{flex:1;min-width:0}',
    '.mr-item-eq{font-size:14px;font-weight:600;color:var(--text-primary);font-family:var(--font-mono);margin-bottom:3px}',
    '.mr-item-loc{font-size:13px;color:var(--text-primary);margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.mr-item-mfg{font-size:11px;color:var(--text-secondary);font-family:var(--font-mono)}',
    '.mr-item-dmg{margin-top:8px;display:none;align-items:center;gap:6px;font-size:12px;color:#F87171;font-weight:500;cursor:pointer;-webkit-tap-highlight-color:transparent;padding:4px 0}',
    '.mr-item.sel .mr-item-dmg{display:flex}',
    '.mr-item-dmg-cb{width:18px;height:18px;border:1.5px solid #F87171;border-radius:4px;display:flex;align-items:center;justify-content:center}',
    '.mr-item-dmg.on .mr-item-dmg-cb{background:#F87171}',
    '.mr-item-dmg svg{width:11px;height:11px;color:#fff;display:none}',
    '.mr-item-dmg.on svg{display:block}',
    '.mr-photo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px}',
    '.mr-photo-tile{aspect-ratio:1;background:var(--bg-input);border:1px dashed var(--border);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--text-tertiary);cursor:pointer;-webkit-tap-highlight-color:transparent;position:relative;overflow:hidden}',
    '.mr-photo-tile.add svg{width:24px;height:24px}',
    '.mr-photo-tile img{width:100%;height:100%;object-fit:cover}',
    '.mr-photo-x{position:absolute;top:4px;right:4px;width:22px;height:22px;border-radius:50%;background:rgba(0,0,0,0.6);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;border:none;cursor:pointer}',
    '.mr-fab-bar{position:sticky;bottom:0;left:0;right:0;background:var(--bg);border-top:1px solid var(--border);padding:10px 16px calc(10px + env(safe-area-inset-bottom,0px));margin:0 -16px -16px;display:flex;gap:10px;z-index:5}',
    '.mr-fab-bar .btn{flex:1}',
    /* Empty state */
    '.mr-empty{padding:40px 20px;text-align:center;color:var(--text-tertiary)}',
    '.mr-empty svg{width:48px;height:48px;margin-bottom:14px;opacity:0.4}',
    '.mr-empty p{font-size:14px;line-height:1.5}',
    /* Sort/filter bar */
    '.mr-tools{display:flex;gap:8px;margin-bottom:12px;align-items:center}',
    '.mr-tool-btn{flex:1;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:9px 12px;font-size:13px;font-weight:500;color:var(--text-primary);cursor:pointer;-webkit-tap-highlight-color:transparent;display:flex;align-items:center;justify-content:center;gap:6px;font-family:var(--font)}',
    '.mr-tool-btn:active{background:var(--bg-elevated)}',
    '.mr-tool-btn.has-filter{background:var(--accent-dim);border-color:var(--accent);color:var(--accent)}',
    '.mr-tool-btn svg{width:14px;height:14px}',
    '.mr-tool-badge{background:var(--accent);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;min-width:18px;text-align:center}',
    /* Bottom sheet */
    '#mr-sheet-ov{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:400;display:none;align-items:flex-end}',
    '#mr-sheet-ov.open{display:flex}',
    '.mr-sheet{background:var(--bg-card);border-radius:20px 20px 0 0;width:100%;max-height:75vh;overflow-y:auto;padding:8px 0 calc(20px + env(safe-area-inset-bottom,0px));animation:sheetUp 0.25s ease}',
    '.mr-sheet-hdr{padding:14px 20px 10px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border)}',
    '.mr-sheet-title{font-size:15px;font-weight:700;color:var(--text-primary)}',
    '.mr-sheet-close{width:32px;height:32px;border-radius:50%;background:var(--bg-elevated);border:none;cursor:pointer;font-size:20px;color:var(--text-secondary);display:flex;align-items:center;justify-content:center}',
    '.mr-sheet-row{padding:14px 20px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;border-bottom:1px solid var(--border);-webkit-tap-highlight-color:transparent}',
    '.mr-sheet-row:active{background:var(--bg-elevated)}',
    '.mr-sheet-row-label{font-size:14px;color:var(--text-primary);flex:1}',
    '.mr-sheet-row .check{width:22px;height:22px;border-radius:50%;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0}',
    '.mr-sheet-row.on .check{background:var(--accent);border-color:var(--accent)}',
    '.mr-sheet-row.on .check svg{display:block}',
    '.mr-sheet-row .check svg{width:12px;height:12px;color:#fff;display:none}',
    '.mr-sheet-section{padding:12px 20px 6px;font-size:11px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.8px;background:var(--bg-elevated);border-bottom:1px solid var(--border)}',
    '.mr-sheet-actions{padding:14px 20px;display:flex;gap:10px;border-top:1px solid var(--border);position:sticky;bottom:0;background:var(--bg-card)}'
  ].join('');
  document.head.appendChild(st);
}

// ── State ──────────────────────────────────────────────────
var _items = [];        // procurement items
var _receipts = [];     // material receipts
var _equipLookup = {};  // equipId -> equipment metadata
var _pNum = null;
var _supplier = null;   // active supplier in receive flow
var _selected = new Set();
var _damaged = new Set();
var _photos = [];       // {url, name, dataUrl}
var _docketImg = null;  // {url, name, dataUrl}
var _userName = '';
var _sortBy = 'outstanding';  // outstanding | equipId | location | type
var _filterStatus = 'all';    // all | due | received
var _filterTypes = new Set(); // empty = all types
var _filterLocations = new Set(); // empty = all locations

// ── Helpers ────────────────────────────────────────────────
function todayISO() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function fmtDate(s) {
  if (!s) return '—';
  var p = String(s).split('-');
  if (p.length !== 3) return s;
  return p[2] + '/' + p[1] + '/' + p[0];
}
function nid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
}
function escH(s) {
  return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Load / Save ────────────────────────────────────────────
async function _loadAll() {
  var proj = window.dbGetCurrentProject();
  if (!proj) return false;
  _pNum = proj.code || proj.num || proj.id;
  var co = localStorage.getItem('hvacnexus_company_id');
  await window.dbReady;

  // Procurement items
  try {
    var pRes = await window._supabase.from('procurement').select('data')
      .eq('company_id', co).eq('project_num', _pNum).maybeSingle();
    var pData = pRes.data && pRes.data.data;
    if (Array.isArray(pData)) _items = pData;
    else if (pData && Array.isArray(pData.items)) _items = pData.items;
    else _items = [];
  } catch(e) { _items = []; }

  // Equipment lookup
  try {
    var eqRes = await window._supabase.from('equipment').select('data')
      .eq('company_id', co).eq('project_num', _pNum).maybeSingle();
    var eqRaw = eqRes.data && eqRes.data.data;
    _equipLookup = _buildEquipLookup(eqRaw);
  } catch(e) { _equipLookup = {}; }

  // Existing receipts
  try {
    var rRes = await window._supabase.from('material_receipts').select('data')
      .eq('company_id', co).eq('project_num', _pNum).maybeSingle();
    _receipts = (rRes.data && Array.isArray(rRes.data.data)) ? rRes.data.data : [];
  } catch(e) { _receipts = []; }

  // User name
  var u = window.dbGetCurrentUser();
  _userName = (u && u.name) || (u && u.email) || 'Site User';

  return true;
}

function _buildEquipLookup(eqRaw) {
  var lookup = {};
  if (!eqRaw || !Array.isArray(eqRaw.tabs)) return lookup;
  eqRaw.tabs.forEach(function(tab) {
    if (!tab || !Array.isArray(tab.revisions)) return;
    // Use last published revision
    var rev = null;
    for (var i = tab.revisions.length - 1; i >= 0; i--) {
      if (tab.revisions[i].published) { rev = tab.revisions[i]; break; }
    }
    if (!rev || !Array.isArray(rev.rows)) return;
    rev.rows.forEach(function(row) {
      var id = row.tag || row.id;
      if (!id) return;
      lookup[id] = {
        equipType: tab.name || row.type || '',
        location: row.location || row.area || '',
        subLocation: row.subLocation || row.zone || '',
        manufacturer: row.manufacturer || '',
        model: row.model || ''
      };
    });
  });
  return lookup;
}

async function _saveReceipts() {
  var co = localStorage.getItem('hvacnexus_company_id');
  await window.dbReady;
  return await window._supabase.from('material_receipts').upsert(
    { project_num: _pNum, company_id: co, data: _receipts },
    { onConflict: 'project_num' }
  );
}

async function _saveProcurement() {
  var co = localStorage.getItem('hvacnexus_company_id');
  await window.dbReady;
  // Preserve any wrapper structure if it exists
  try {
    var existing = await window._supabase.from('procurement').select('data')
      .eq('company_id', co).eq('project_num', _pNum).maybeSingle();
    var wrap = existing.data && existing.data.data;
    var payload;
    if (wrap && typeof wrap === 'object' && !Array.isArray(wrap)) {
      payload = Object.assign({}, wrap, { items: _items });
    } else {
      payload = _items;
    }
    return await window._supabase.from('procurement').upsert(
      { project_num: _pNum, company_id: co, data: payload },
      { onConflict: 'project_num' }
    );
  } catch(e) {
    return await window._supabase.from('procurement').upsert(
      { project_num: _pNum, company_id: co, data: _items },
      { onConflict: 'project_num' }
    );
  }
}

// ── Suppliers list ─────────────────────────────────────────
function _getSuppliers() {
  var map = {};
  _items.forEach(function(it) {
    var name = (it.manufacturer || '').trim();
    if (!name) return;
    if (!map[name]) map[name] = { name: name, items: 0, outstanding: 0 };
    map[name].items++;
    var qty = parseInt(it.qty, 10) || 1;
    var del = parseInt(it.qtyDelivered, 10) || 0;
    if (del < qty) map[name].outstanding += (qty - del);
  });
  return Object.keys(map).sort().map(function(k) { return map[k]; });
}

function _enrichItem(item) {
  var eq = _equipLookup[item.equipId] || {};
  return {
    equipId: item.equipId || '',
    location: eq.subLocation || eq.location || item.location || '',
    manufacturer: eq.manufacturer || item.manufacturer || '',
    model: eq.model || item.model || '',
    equipType: eq.equipType || item.equipType || ''
  };
}

// ── Render List Page ───────────────────────────────────────
window.renderMaterialReceivingPage = async function(container) {
  container.innerHTML = '<div class="page"><div class="spinner"></div></div>';
  var ok = await _loadAll();
  if (!ok) {
    container.innerHTML = '<div class="page"><div class="empty-state"><p>Select a project first.</p></div></div>';
    return;
  }
  _renderListPage(container);
};

function _renderListPage(container) {
  var suppliers = _getSuppliers();
  var withOut = suppliers.filter(function(s) { return s.outstanding > 0; });
  var noOut = suppliers.filter(function(s) { return s.outstanding === 0; });

  var html = '<div class="page">';

  // Search
  html += '<div class="mr-search">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
    + '<input type="search" placeholder="Search supplier..." id="mr-q" oninput="mrFilter()">'
    + '</div>';

  // Suppliers with outstanding
  if (withOut.length > 0) {
    html += '<div class="mr-section-hdr"><span>Awaiting Delivery</span><span style="color:var(--accent);font-weight:700">' + withOut.length + '</span></div>';
    withOut.forEach(function(s) {
      html += _supplierCard(s);
    });
  }

  // Recent receipts
  if (_receipts.length > 0) {
    var recent = _receipts.slice().sort(function(a,b){return (b.createdAt||'').localeCompare(a.createdAt||'');}).slice(0, 8);
    html += '<div class="mr-section-hdr"><span>Recent Receipts</span><span style="color:var(--text-tertiary)">' + _receipts.length + ' total</span></div>';
    recent.forEach(function(r) {
      html += _receiptCard(r);
    });
  }

  // All other suppliers
  if (noOut.length > 0) {
    html += '<div class="mr-section-hdr"><span>Other Suppliers</span><span style="color:var(--text-tertiary)">' + noOut.length + '</span></div>';
    noOut.forEach(function(s) {
      html += _supplierCard(s);
    });
  }

  if (suppliers.length === 0) {
    html += '<div class="mr-empty">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 16h6M19 13v6"/><rect x="2" y="4" width="13" height="16" rx="2"/><path d="M2 8h13"/></svg>'
      + '<p>No suppliers found.<br>Add procurement items in the desktop app.</p>'
      + '</div>';
  }

  html += '</div>';
  container.innerHTML = html;
}

function _supplierCard(s) {
  var outClass = s.outstanding > 0 ? '' : ' zero';
  var outText = s.outstanding > 0 ? (s.outstanding + ' due') : 'All received';
  return '<div class="mr-supp-card" data-supp="' + escH(s.name) + '" onclick="mrOpenReceive(this.dataset.supp)">'
    + '<div class="mr-supp-name"><span>' + escH(s.name) + '</span><span class="mr-supp-out' + outClass + '">' + outText + '</span></div>'
    + '<div class="mr-supp-meta"><span>' + s.items + ' item' + (s.items===1?'':'s') + '</span></div>'
    + '</div>';
}

function _receiptCard(r) {
  var dmgHtml = r.damagedCount > 0 ? '<span class="mr-rcpt-dmg b">⚠ ' + r.damagedCount + '</span>' : '';
  return '<div class="mr-rcpt-card" data-id="' + r.id + '" onclick="mrViewReceipt(this.dataset.id)">'
    + '<div class="mr-rcpt-top">'
    +   '<div class="mr-rcpt-supp">' + escH(r.supplier || 'Unknown') + '</div>'
    +   '<div class="mr-rcpt-date">' + fmtDate(r.deliveryDate) + '</div>'
    + '</div>'
    + '<div class="mr-rcpt-meta">'
    +   '<span class="b">' + (r.itemCount || 0) + ' item' + (r.itemCount===1?'':'s') + '</span>'
    +   (r.docketNumber ? '<span class="b">📋 ' + escH(r.docketNumber) + '</span>' : '')
    +   (r.photos && r.photos.length ? '<span class="b">📷 ' + r.photos.length + '</span>' : '')
    +   dmgHtml
    + '</div>'
    + '</div>';
}

window.mrFilter = function() {
  var q = (document.getElementById('mr-q').value || '').toLowerCase();
  document.querySelectorAll('.mr-supp-card,.mr-rcpt-card').forEach(function(c) {
    c.style.display = c.textContent.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
  });
};

// ── Receive flow ───────────────────────────────────────────
window.mrOpenReceive = function(supplier) {
  _supplier = supplier;
  _selected = new Set();
  _damaged = new Set();
  _photos = [];
  _docketImg = null;

  var container = document.getElementById('app-main');
  if (!container) return;

  // Reset filters when opening a new supplier
  _sortBy = 'outstanding';
  _filterStatus = 'all';
  _filterTypes = new Set();
  _filterLocations = new Set();

  var allSupplierItems = _items.filter(function(it) {
    return (it.manufacturer || '').trim() === supplier && it.equipId;
  });
  // Store on window for sort/filter to access
  window._mrAllItems = allSupplierItems;

  var html = '<div class="page">';

  // Header with back
  html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:6px">'
    + '<button onclick="appNav(\'materialReceiving\')" style="width:36px;height:36px;border:none;background:var(--bg-card);border-radius:8px;color:var(--text-primary);cursor:pointer;display:flex;align-items:center;justify-content:center">'
    + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>'
    + '</button>'
    + '<div style="flex:1;min-width:0">'
    +   '<div class="mr-step-title" style="margin:0">Receive from</div>'
    +   '<div style="font-size:14px;color:var(--accent);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escH(supplier) + '</div>'
    + '</div>'
    + '</div>';

  // Delivery details
  html += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;margin-top:14px;margin-bottom:14px">';
  html += '<div class="form-group" style="margin-bottom:12px"><label class="form-label">Delivery Date</label>'
    + '<input type="date" id="mr-date" class="form-input" value="' + todayISO() + '"></div>';
  html += '<div class="form-group" style="margin-bottom:12px"><label class="form-label">Docket Number (optional)</label>'
    + '<input type="text" id="mr-docket" class="form-input" placeholder="e.g. DEL-001234"></div>';
  html += '<div class="form-group" style="margin-bottom:0"><label class="form-label">Notes (optional)</label>'
    + '<textarea id="mr-notes" class="form-input" rows="2" placeholder="Any delivery notes..."></textarea></div>';
  html += '</div>';

  // Photos
  html += '<div class="mr-section-hdr"><span>Photos & Docket</span><span style="color:var(--text-tertiary);font-size:10px">Tap to add</span></div>';
  html += '<div class="mr-photo-grid" id="mr-photos">';
  html += '<div class="mr-photo-tile add" onclick="mrAddPhoto()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>';
  html += '</div>';
  html += '<input type="file" id="mr-photo-input" accept="image/*" capture="environment" style="display:none" onchange="mrPhotoSelected(event)">';

  // Items section header with count
  html += '<div class="mr-section-hdr"><span>Items</span><span id="mr-sel-count" style="color:var(--accent);font-weight:700">0 selected</span></div>';

  // Sort + Filter bar
  html += '<div class="mr-tools">'
    + '<button class="mr-tool-btn" id="mr-sort-btn" onclick="mrOpenSortSheet()">'
    +   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/></svg>'
    +   '<span id="mr-sort-label">Outstanding first</span>'
    + '</button>'
    + '<button class="mr-tool-btn" id="mr-filter-btn" onclick="mrOpenFilterSheet()">'
    +   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>'
    +   '<span>Filter</span>'
    +   '<span class="mr-tool-badge" id="mr-filter-badge" style="display:none">0</span>'
    + '</button>'
    + '</div>';

  // Items list container
  html += '<div id="mr-items-list"></div>';

  // Save bar
  html += '<div class="mr-fab-bar">'
    + '<button class="btn btn-secondary" onclick="appNav(\'materialReceiving\')">Cancel</button>'
    + '<button class="btn btn-primary" id="mr-save-btn" onclick="mrSaveReceipt()">Receive Goods</button>'
    + '</div>';

  html += '</div>';
  container.innerHTML = html;

  // Initial render of items
  _renderItemsList();
};

// ── Render filtered/sorted items ──────────────────────────
function _renderItemsList() {
  var listEl = document.getElementById('mr-items-list');
  if (!listEl) return;

  var items = (window._mrAllItems || []).slice();

  // Apply filters
  items = items.filter(function(it) {
    var enr = _enrichItem(it);
    var qty = parseInt(it.qty,10)||1;
    var del = parseInt(it.qtyDelivered,10)||0;
    var outstanding = qty - del > 0;
    if (_filterStatus === 'due' && !outstanding) return false;
    if (_filterStatus === 'received' && outstanding) return false;
    if (_filterTypes.size > 0 && !_filterTypes.has(enr.equipType || '')) return false;
    if (_filterLocations.size > 0 && !_filterLocations.has(enr.location || '')) return false;
    return true;
  });

  // Apply sort
  items.sort(function(a, b) {
    var ea = _enrichItem(a), eb = _enrichItem(b);
    if (_sortBy === 'outstanding') {
      var aOut = ((parseInt(a.qty,10)||1) - (parseInt(a.qtyDelivered,10)||0)) > 0 ? 0 : 1;
      var bOut = ((parseInt(b.qty,10)||1) - (parseInt(b.qtyDelivered,10)||0)) > 0 ? 0 : 1;
      if (aOut !== bOut) return aOut - bOut;
      return (a.equipId||'').localeCompare(b.equipId||'');
    }
    if (_sortBy === 'equipId') return (a.equipId||'').localeCompare(b.equipId||'');
    if (_sortBy === 'location') return (ea.location||'').localeCompare(eb.location||'');
    if (_sortBy === 'type') return (ea.equipType||'').localeCompare(eb.equipType||'');
    return 0;
  });

  // Update sort label
  var sortLabels = {
    outstanding: 'Outstanding first',
    equipId: 'Equipment ID',
    location: 'Location',
    type: 'Type'
  };
  var sortEl = document.getElementById('mr-sort-label');
  if (sortEl) sortEl.textContent = sortLabels[_sortBy] || 'Sort';

  // Update filter badge + highlight
  var filterCount = (_filterStatus !== 'all' ? 1 : 0) + _filterTypes.size + _filterLocations.size;
  var filterBtn = document.getElementById('mr-filter-btn');
  var filterBadge = document.getElementById('mr-filter-badge');
  if (filterBtn) filterBtn.classList.toggle('has-filter', filterCount > 0);
  if (filterBadge) {
    if (filterCount > 0) {
      filterBadge.style.display = '';
      filterBadge.textContent = filterCount;
    } else {
      filterBadge.style.display = 'none';
    }
  }

  // Render items
  if (items.length === 0) {
    listEl.innerHTML = '<div class="mr-empty"><p>No items match your filters.</p></div>';
    return;
  }

  var html = '';
  items.forEach(function(it) {
    var enr = _enrichItem(it);
    var qty = parseInt(it.qty,10)||1;
    var del = parseInt(it.qtyDelivered,10)||0;
    var outstanding = qty - del;
    var statusBadge = outstanding > 0
      ? '<span style="font-size:10px;font-weight:600;background:var(--accent-dim);color:var(--accent);padding:2px 6px;border-radius:10px;margin-left:6px">DUE</span>'
      : '<span style="font-size:10px;font-weight:600;background:rgba(34,197,94,0.15);color:#22C55E;padding:2px 6px;border-radius:10px;margin-left:6px">RECEIVED</span>';
    var sel = _selected.has(it.id);
    var dmg = _damaged.has(it.id);
    html += '<div class="mr-item' + (sel ? ' sel' : '') + '" data-id="' + escH(it.id) + '" onclick="mrToggleItem(this.dataset.id)">'
      + '<div class="mr-item-cb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>'
      + '<div class="mr-item-info">'
      +   '<div class="mr-item-eq">' + escH(enr.equipId) + statusBadge + '</div>'
      +   (enr.location ? '<div class="mr-item-loc">' + escH(enr.location) + '</div>' : '')
      +   (enr.equipType ? '<div class="mr-item-mfg">' + escH(enr.equipType) + (enr.model ? ' · ' + escH(enr.model) : '') + '</div>' : (enr.model ? '<div class="mr-item-mfg">' + escH(enr.model) + '</div>' : ''))
      +   '<div class="mr-item-dmg' + (dmg ? ' on' : '') + '" data-id="' + escH(it.id) + '" onclick="event.stopPropagation();mrToggleDmg(this.dataset.id)">'
      +     '<div class="mr-item-dmg-cb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>'
      +     '<span>Mark as damaged</span>'
      +   '</div>'
      + '</div>'
      + '</div>';
  });
  listEl.innerHTML = html;
}

// ── Sort sheet ─────────────────────────────────────────────
window.mrOpenSortSheet = function() {
  var opts = [
    { v: 'outstanding', l: 'Outstanding first' },
    { v: 'equipId',     l: 'Equipment ID' },
    { v: 'location',    l: 'Location' },
    { v: 'type',        l: 'Equipment Type' }
  ];

  var html = '<div class="mr-sheet">'
    + '<div class="mr-sheet-hdr"><span class="mr-sheet-title">Sort by</span>'
    + '<button class="mr-sheet-close" onclick="mrCloseSheet()">×</button></div>';
  opts.forEach(function(o) {
    var on = _sortBy === o.v;
    html += '<div class="mr-sheet-row' + (on ? ' on' : '') + '" onclick="mrApplySort(\'' + o.v + '\')">'
      + '<span class="mr-sheet-row-label">' + o.l + '</span>'
      + '<div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>'
      + '</div>';
  });
  html += '</div>';

  _showSheet(html);
};

window.mrApplySort = function(v) {
  _sortBy = v;
  mrCloseSheet();
  _renderItemsList();
};

// ── Filter sheet ───────────────────────────────────────────
window.mrOpenFilterSheet = function() {
  var items = window._mrAllItems || [];

  // Collect unique types and locations
  var types = {}, locations = {};
  items.forEach(function(it) {
    var enr = _enrichItem(it);
    if (enr.equipType) types[enr.equipType] = (types[enr.equipType] || 0) + 1;
    if (enr.location) locations[enr.location] = (locations[enr.location] || 0) + 1;
  });
  var typeKeys = Object.keys(types).sort();
  var locKeys = Object.keys(locations).sort();

  var html = '<div class="mr-sheet">'
    + '<div class="mr-sheet-hdr"><span class="mr-sheet-title">Filter</span>'
    + '<button class="mr-sheet-close" onclick="mrCloseSheet()">×</button></div>';

  // Status
  html += '<div class="mr-sheet-section">Status</div>';
  ['all','due','received'].forEach(function(s) {
    var labels = { all: 'All items', due: 'Outstanding only', received: 'Received only' };
    var on = _filterStatus === s;
    html += '<div class="mr-sheet-row' + (on ? ' on' : '') + '" onclick="mrApplyFilterStatus(\'' + s + '\')">'
      + '<span class="mr-sheet-row-label">' + labels[s] + '</span>'
      + '<div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>'
      + '</div>';
  });

  // Equipment Types
  if (typeKeys.length > 0) {
    html += '<div class="mr-sheet-section">Equipment Type</div>';
    typeKeys.forEach(function(t) {
      var on = _filterTypes.has(t);
      html += '<div class="mr-sheet-row' + (on ? ' on' : '') + '" onclick="mrToggleFilterType(\'' + t.replace(/\\/g,'\\\\').replace(/'/g,"\\'") + '\')">'
        + '<span class="mr-sheet-row-label">' + escH(t) + ' <span style="color:var(--text-tertiary);font-size:12px">(' + types[t] + ')</span></span>'
        + '<div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>'
        + '</div>';
    });
  }

  // Locations
  if (locKeys.length > 0) {
    html += '<div class="mr-sheet-section">Location</div>';
    locKeys.forEach(function(l) {
      var on = _filterLocations.has(l);
      html += '<div class="mr-sheet-row' + (on ? ' on' : '') + '" onclick="mrToggleFilterLoc(\'' + l.replace(/\\/g,'\\\\').replace(/'/g,"\\'") + '\')">'
        + '<span class="mr-sheet-row-label">' + escH(l) + ' <span style="color:var(--text-tertiary);font-size:12px">(' + locations[l] + ')</span></span>'
        + '<div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>'
        + '</div>';
    });
  }

  html += '<div class="mr-sheet-actions">'
    + '<button class="btn btn-secondary" style="flex:1" onclick="mrClearFilters()">Clear all</button>'
    + '<button class="btn btn-primary" style="flex:1" onclick="mrCloseSheet()">Apply</button>'
    + '</div>';

  html += '</div>';
  _showSheet(html);
};

window.mrApplyFilterStatus = function(s) {
  _filterStatus = s;
  // Re-open sheet to refresh
  mrOpenFilterSheet();
};

window.mrToggleFilterType = function(t) {
  if (_filterTypes.has(t)) _filterTypes.delete(t);
  else _filterTypes.add(t);
  mrOpenFilterSheet();
};

window.mrToggleFilterLoc = function(l) {
  if (_filterLocations.has(l)) _filterLocations.delete(l);
  else _filterLocations.add(l);
  mrOpenFilterSheet();
};

window.mrClearFilters = function() {
  _filterStatus = 'all';
  _filterTypes = new Set();
  _filterLocations = new Set();
  mrCloseSheet();
};

window.mrCloseSheet = function() {
  var ov = document.getElementById('mr-sheet-ov');
  if (ov) ov.classList.remove('open');
  _renderItemsList();
};

function _showSheet(html) {
  var ov = document.getElementById('mr-sheet-ov');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'mr-sheet-ov';
    ov.addEventListener('click', function(e) {
      if (e.target === ov) mrCloseSheet();
    });
    document.body.appendChild(ov);
  }
  ov.innerHTML = html;
  ov.classList.add('open');
}

window.mrToggleItem = function(id) {
  if (_selected.has(id)) {
    _selected.delete(id);
    _damaged.delete(id);
  } else {
    _selected.add(id);
  }
  var el = document.querySelector('.mr-item[data-id="' + id + '"]');
  if (el) el.classList.toggle('sel', _selected.has(id));
  document.getElementById('mr-sel-count').textContent = _selected.size + ' selected';
};

window.mrToggleDmg = function(id) {
  if (_damaged.has(id)) _damaged.delete(id);
  else _damaged.add(id);
  var el = document.querySelector('.mr-item-dmg[data-id="' + id + '"]');
  if (el) el.classList.toggle('on', _damaged.has(id));
};

// ── Photos ─────────────────────────────────────────────────
window.mrAddPhoto = function() {
  document.getElementById('mr-photo-input').click();
};

window.mrPhotoSelected = function(e) {
  var file = e.target.files && e.target.files[0];
  if (!file) return;
  e.target.value = ''; // reset
  _compressImage(file, function(blob, dataUrl) {
    var photo = { name: file.name, dataUrl: dataUrl, blob: blob, uploading: true };
    _photos.push(photo);
    _renderPhotos();
    // Upload to Supabase Storage
    _uploadPhoto(photo);
  });
};

function _compressImage(file, cb) {
  var reader = new FileReader();
  reader.onload = function(ev) {
    var img = new Image();
    img.onload = function() {
      var maxDim = 1600;
      var w = img.width, h = img.height;
      if (w > h) {
        if (w > maxDim) { h = h * maxDim / w; w = maxDim; }
      } else {
        if (h > maxDim) { w = w * maxDim / h; h = maxDim; }
      }
      var canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      canvas.toBlob(function(blob) {
        var url = canvas.toDataURL('image/jpeg', 0.82);
        cb(blob, url);
      }, 'image/jpeg', 0.82);
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

async function _uploadPhoto(photo) {
  try {
    await window.dbReady;
    var path = 'receipts/' + _pNum + '/' + Date.now() + '-' + Math.random().toString(36).slice(2,7) + '.jpg';
    var up = await window._supabase.storage.from('receipts').upload(path, photo.blob, {
      contentType: 'image/jpeg', upsert: false
    });
    if (up.error) throw up.error;
    var pub = window._supabase.storage.from('receipts').getPublicUrl(path);
    photo.url = pub.data.publicUrl;
    photo.uploading = false;
  } catch(e) {
    photo.uploading = false;
    photo.error = true;
    console.warn('[MR] photo upload failed:', e);
  }
  _renderPhotos();
}

function _renderPhotos() {
  var grid = document.getElementById('mr-photos');
  if (!grid) return;
  var html = '';
  _photos.forEach(function(p, i) {
    var overlay = p.uploading ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center"><div style="width:18px;height:18px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite"></div></div>' : '';
    html += '<div class="mr-photo-tile">'
      + '<img src="' + p.dataUrl + '">'
      + overlay
      + '<button class="mr-photo-x" onclick="mrRemovePhoto(' + i + ')">×</button>'
      + '</div>';
  });
  html += '<div class="mr-photo-tile add" onclick="mrAddPhoto()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>';
  grid.innerHTML = html;
}

window.mrRemovePhoto = function(i) {
  _photos.splice(i, 1);
  _renderPhotos();
};

// ── Save Receipt ───────────────────────────────────────────
window.mrSaveReceipt = async function() {
  if (_selected.size === 0) {
    alert('Select at least one item.');
    return;
  }
  var date = document.getElementById('mr-date').value;
  if (!date) {
    alert('Delivery date is required.');
    return;
  }
  var stillUploading = _photos.some(function(p) { return p.uploading; });
  if (stillUploading) {
    alert('Wait for photos to finish uploading.');
    return;
  }

  var btn = document.getElementById('mr-save-btn');
  btn.disabled = true;
  btn.textContent = 'Saving…';

  try {
    var docket = (document.getElementById('mr-docket').value || '').trim();
    var notes = (document.getElementById('mr-notes').value || '').trim();
    var receiptItems = [];
    var dmgCount = 0;

    Array.from(_selected).forEach(function(itemId) {
      var it = _items.find(function(x) { return x.id === itemId; });
      if (!it) return;
      var dmg = _damaged.has(itemId);
      if (dmg) dmgCount++;
      var qty = parseInt(it.qty, 10) || 1;
      var alreadyDel = parseInt(it.qtyDelivered, 10) || 0;
      var receivingNow = Math.max(qty - alreadyDel, 1);
      receiptItems.push({
        equipId: it.equipId,
        itemId: it.id,
        receivedQty: receivingNow,
        condition: dmg ? 'Damaged' : 'OK',
        notes: ''
      });
    });

    var receipt = {
      id: 'rcpt_' + nid(),
      supplier: _supplier,
      poId: null,
      deliveryDate: date,
      receivedBy: _userName,
      docketNumber: docket,
      docketUrl: null,
      docketName: null,
      photos: _photos.filter(function(p) { return p.url; }).map(function(p) {
        return { url: p.url, name: p.name };
      }),
      items: receiptItems,
      itemCount: receiptItems.length,
      damagedCount: dmgCount,
      notes: notes,
      createdAt: new Date().toISOString()
    };
    _receipts.push(receipt);

    // Update procurement schedule items
    receiptItems.forEach(function(ri) {
      var it = _items.find(function(x) { return x.id === ri.itemId; });
      if (!it) return;
      var qty = parseInt(it.qty, 10) || 1;
      var del = (parseInt(it.qtyDelivered, 10) || 0) + ri.receivedQty;
      it.qtyDelivered = Math.min(del, qty);
      if (!it.deliveryDate || it.deliveryDate < date) it.deliveryDate = date;
      if (it.qtyDelivered >= qty) it.status = 'Delivered';
      else if (it.status === 'Not ordered' || it.status === 'Ordered') it.status = 'Ordered';
    });

    await _saveReceipts();
    await _saveProcurement();

    // Back to list
    appNav('materialReceiving');
  } catch(e) {
    console.error('[MR save]', e);
    alert('Save failed: ' + (e.message || 'unknown error'));
    btn.disabled = false;
    btn.textContent = 'Receive Goods';
  }
};

// ── View Receipt ───────────────────────────────────────────
window.mrViewReceipt = function(id) {
  var r = _receipts.find(function(x) { return x.id === id; });
  if (!r) return;

  var container = document.getElementById('app-main');
  if (!container) return;

  var html = '<div class="page">';

  html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:6px">'
    + '<button onclick="appNav(\'materialReceiving\')" style="width:36px;height:36px;border:none;background:var(--bg-card);border-radius:8px;color:var(--text-primary);cursor:pointer;display:flex;align-items:center;justify-content:center">'
    + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>'
    + '</button>'
    + '<div style="flex:1;min-width:0">'
    +   '<div class="mr-step-title" style="margin:0">Receipt</div>'
    +   '<div style="font-size:14px;color:var(--accent);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escH(r.supplier || '') + '</div>'
    + '</div>'
    + '</div>';

  html += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;margin-top:14px;margin-bottom:14px">';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">';
  html += '<div><div style="font-size:10px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:3px">Date</div><div style="font-size:14px;font-weight:600">' + fmtDate(r.deliveryDate) + '</div></div>';
  html += '<div><div style="font-size:10px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:3px">By</div><div style="font-size:14px;font-weight:600">' + escH(r.receivedBy || '—') + '</div></div>';
  if (r.docketNumber) html += '<div style="grid-column:1/-1"><div style="font-size:10px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:3px">Docket</div><div style="font-size:14px;font-weight:600;font-family:var(--font-mono)">' + escH(r.docketNumber) + '</div></div>';
  html += '</div>';
  if (r.notes) html += '<div style="border-top:1px solid var(--border);padding-top:10px;font-size:13px;color:var(--text-secondary)">' + escH(r.notes) + '</div>';
  html += '</div>';

  // Photos
  if (r.photos && r.photos.length > 0) {
    html += '<div class="mr-section-hdr"><span>Photos</span><span style="color:var(--text-tertiary)">' + r.photos.length + '</span></div>';
    html += '<div class="mr-photo-grid">';
    r.photos.forEach(function(p) {
      html += '<a href="' + escH(p.url) + '" target="_blank" class="mr-photo-tile"><img src="' + escH(p.url) + '"></a>';
    });
    html += '</div>';
  }

  // Items
  html += '<div class="mr-section-hdr"><span>Items</span><span style="color:var(--accent);font-weight:700">' + (r.itemCount || 0) + '</span></div>';
  (r.items || []).forEach(function(ri) {
    var it = _items.find(function(x) { return x.id === ri.itemId; }) || {};
    var enr = _enrichItem(it);
    var dmg = ri.condition === 'Damaged';
    html += '<div class="mr-item" style="cursor:default">';
    html += '<div class="mr-item-info">';
    html += '<div class="mr-item-eq">' + escH(ri.equipId) + (dmg ? '<span style="font-size:10px;font-weight:600;background:rgba(239,68,68,0.15);color:#F87171;padding:2px 6px;border-radius:10px;margin-left:6px">DAMAGED</span>' : '') + '</div>';
    if (enr.location) html += '<div class="mr-item-loc">📍 ' + escH(enr.location) + '</div>';
    if (enr.model) html += '<div class="mr-item-mfg">' + escH(enr.model) + '</div>';
    html += '</div></div>';
  });

  // Delete button
  html += '<div style="margin-top:24px"><button class="btn btn-danger" style="width:100%" onclick="mrDeleteReceipt(\'' + r.id + '\')">Delete Receipt</button></div>';

  html += '</div>';
  container.innerHTML = html;
};

window.mrDeleteReceipt = async function(id) {
  if (!confirm('Delete this receipt? This will reverse the delivered quantities.')) return;
  var r = _receipts.find(function(x) { return x.id === id; });
  if (!r) return;
  // Reverse delivered quantities
  (r.items || []).forEach(function(ri) {
    var it = _items.find(function(x) { return x.id === ri.itemId; });
    if (!it) return;
    var del = (parseInt(it.qtyDelivered, 10) || 0) - (ri.receivedQty || 0);
    it.qtyDelivered = Math.max(0, del);
    var qty = parseInt(it.qty, 10) || 1;
    if (it.qtyDelivered === 0) {
      it.status = 'Ordered';
      it.deliveryDate = '';
    } else if (it.qtyDelivered < qty) {
      it.status = 'Ordered';
    }
  });
  _receipts = _receipts.filter(function(x) { return x.id !== id; });
  try {
    await _saveReceipts();
    await _saveProcurement();
    appNav('materialReceiving');
  } catch(e) {
    alert('Delete failed.');
  }
};

})();
