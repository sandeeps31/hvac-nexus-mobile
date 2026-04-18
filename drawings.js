/* ============================================================
   HVAC NEXUS MOBILE — drawings.js
   Drawings list + native iframe PDF viewer with pin overlay
   ============================================================ */
'use strict';

(function() {

// ── CSS ────────────────────────────────────────────────────
if (!document.getElementById('dwg-css')) {
  var st = document.createElement('style');
  st.id = 'dwg-css';
  st.textContent = [
    '.dwg-sb{position:relative;margin-bottom:14px}',
    '.dwg-sb svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-tertiary);pointer-events:none;width:18px;height:18px}',
    '.dwg-si{width:100%;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:11px 12px 11px 40px;font-size:15px;font-family:var(--font);color:var(--text-primary);outline:none;-webkit-appearance:none}',
    '.dwg-si:focus{border-color:var(--accent)}',
    '.dwg-si::placeholder{color:var(--text-tertiary)}',
    '.disc-group{margin-bottom:8px}',
    '.disc-hdr{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);cursor:pointer;-webkit-tap-highlight-color:transparent}',
    '.disc-hdr.open{border-radius:var(--radius-md) var(--radius-md) 0 0;border-bottom:none}',
    '.disc-title{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600;color:var(--text-primary)}',
    '.disc-count{font-size:11px;font-weight:600;background:var(--accent-dim);color:var(--accent);padding:2px 8px;border-radius:20px}',
    '.disc-chev{color:var(--text-tertiary);transition:transform 0.2s}',
    '.disc-hdr.open .disc-chev{transform:rotate(180deg)}',
    '.disc-body{display:none;background:var(--bg-card);border:1px solid var(--border);border-top:none;border-radius:0 0 var(--radius-md) var(--radius-md);overflow:hidden}',
    '.disc-body.open{display:block}',
    '.dwg-row{display:flex;align-items:center;padding:12px 14px;border-bottom:1px solid var(--border);gap:12px;cursor:pointer;-webkit-tap-highlight-color:transparent}',
    '.dwg-row:last-child{border-bottom:none}',
    '.dwg-row:active{background:var(--bg-elevated)}',
    '.dwg-num{font-size:12px;font-weight:600;color:var(--text-secondary);font-family:var(--font-mono);min-width:80px;flex-shrink:0}',
    '.dwg-info{flex:1;min-width:0}',
    '.dwg-name{font-size:14px;font-weight:500;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px}',
    '.dwg-meta{font-size:11px;color:var(--text-tertiary);display:flex;gap:8px}',
    '.dwg-st{font-size:10px;font-weight:700;padding:3px 7px;border-radius:4px;letter-spacing:0.3px;flex-shrink:0}',
    '.st-ifr{background:#FEF3C7;color:#92400E}',
    '.st-ifa{background:#DBEAFE;color:#1E40AF}',
    '.st-ifc{background:#D1FAE5;color:#065F46}',
    '.st-ab{background:#EDE9FE;color:#4C1D95}',
    /* Viewer */
    '#dwg-vwr{position:fixed;inset:0;background:#111;z-index:200;display:none;flex-direction:column}',
    '#dwg-vwr.open{display:flex}',
    '.vhdr{height:52px;background:#0f0f1a;display:flex;align-items:center;padding:0 8px;gap:8px;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,0.08)}',
    '.vtitle{flex:1;min-width:0}',
    '.vtitle .t1{font-size:13px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.vtitle .t2{font-size:11px;color:rgba(255,255,255,0.5)}',
    '.vbtn{width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;background:rgba(255,255,255,0.08);border:none;cursor:pointer}',
    '.vbtn:active{opacity:0.7}',
    '.vbtn svg{width:20px;height:20px}',
    '#dwg-wrap{flex:1;position:relative;overflow:hidden;background:#fff}',
    '#dwg-frm{position:absolute;inset:0;width:100%;height:100%;border:none}',
    '#dwg-pin-layer{position:absolute;inset:0;pointer-events:none;z-index:10}',
    '#dwg-tap-layer{position:absolute;inset:0;z-index:20;pointer-events:none}',
    '#dwg-tap-layer.active{pointer-events:all;cursor:crosshair}',
    '#dwg-no-pdf{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);gap:12px;z-index:5}',
    '#dwg-no-pdf svg{width:48px;height:48px}',
    '#dwg-no-pdf p{font-size:14px}',
    '.vtb{height:60px;background:#0f0f1a;display:flex;align-items:center;justify-content:space-around;flex-shrink:0;border-top:1px solid rgba(255,255,255,0.08);padding-bottom:env(safe-area-inset-bottom,0px)}',
    '.vtbtn{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 10px;border-radius:8px;color:rgba(255,255,255,0.4);font-size:10px;font-weight:500;-webkit-tap-highlight-color:transparent;border:none;background:none;font-family:var(--font);cursor:pointer}',
    '.vtbtn svg{width:22px;height:22px}',
    '.vtbtn.on{color:#fff;background:rgba(255,255,255,0.1)}',
    '.vtbtn.def{color:#EF4444}',
    '.vtbtn.itp{color:#22C55E}',
    '.vtbtn.fir{color:#F97316}',
    /* Pins */
    '.dpm{position:absolute;width:30px;height:30px;border-radius:50% 50% 50% 0;transform:translate(-50%,-100%) rotate(-45deg);display:flex;align-items:center;justify-content:center;pointer-events:all;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.5)}',
    '.dpm span{transform:rotate(45deg);font-size:9px;font-weight:700;color:#fff}',
    '.dpm.d{background:#EF4444}',
    '.dpm.i{background:#22C55E}',
    '.dpm.f{background:#F97316}',
    /* Pin sheet */
    '#dps-ov{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:400;display:none;align-items:flex-end}',
    '.dps-sht{background:var(--bg-card);border-radius:20px 20px 0 0;width:100%;padding:20px 20px calc(20px + env(safe-area-inset-bottom,0px));animation:sheetUp 0.25s ease}',
    '.dps-sht h3{font-size:17px;font-weight:700;color:var(--text-primary);margin-bottom:16px}',
    '#dpd-ov{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:400;display:none;align-items:flex-end}',
    '.dpd-sht{background:var(--bg-card);border-radius:20px 20px 0 0;width:100%;max-height:70vh;overflow-y:auto;padding:20px 20px calc(20px + env(safe-area-inset-bottom,0px));animation:sheetUp 0.25s ease}',
    '.dpd-lbl{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-tertiary);margin-bottom:4px}',
    '.dpd-val{font-size:14px;color:var(--text-primary);margin-bottom:12px}',
    '.pref{font-size:13px;font-weight:700;font-family:var(--font-mono)}',
    '.pref.d{color:#EF4444}.pref.i{color:#22C55E}.pref.f{color:#F97316}'
  ].join('');
  document.head.appendChild(st);
}

// ── Inject DOM once ────────────────────────────────────────
if (!document.getElementById('dwg-vwr')) {
  // Viewer
  var vwr = document.createElement('div');
  vwr.id = 'dwg-vwr';
  vwr.innerHTML =
    '<div class="vhdr">'
    + '<button class="vbtn" id="dvwr-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg></button>'
    + '<div class="vtitle"><div class="t1" id="dvwr-num">—</div><div class="t2" id="dvwr-name">—</div></div>'
    + '</div>'
    + '<div id="dwg-wrap">'
    +   '<iframe id="dwg-frm" allowfullscreen></iframe>'
    +   '<div id="dwg-pin-layer"></div>'
    +   '<div id="dwg-tap-layer"></div>'
    +   '<div id="dwg-no-pdf"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><p>No PDF attached</p></div>'
    + '</div>'
    + '<div class="vtb">'
    +   '<button class="vtbtn on" id="vtb-pan" data-tool="pan"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 11V6a2 2 0 0 0-4 0v0a2 2 0 0 0-4 0v0a2 2 0 0 0-4 0v10a2 2 0 0 0 2 2h6.5a2 2 0 0 1 2 2 2 2 0 0 0 2-2v-6.5"/></svg>Pan</button>'
    +   '<button class="vtbtn" id="vtb-defect" data-tool="defect"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Defect</button>'
    +   '<button class="vtbtn" id="vtb-itp" data-tool="itp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>ITP</button>'
    +   '<button class="vtbtn" id="vtb-fire" data-tool="fire"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2c0 6-8 8-8 14a8 8 0 0 0 16 0c0-6-8-8-8-14z"/></svg>Fire</button>'
    + '</div>';
  document.body.appendChild(vwr);

  // Pin add sheet
  var ps = document.createElement('div');
  ps.id = 'dps-ov';
  ps.innerHTML = '<div class="dps-sht">'
    + '<h3 id="dps-title">Add Pin</h3>'
    + '<div class="form-group"><label class="form-label">Description</label><textarea id="dps-desc" class="form-input" rows="3" placeholder="Describe the issue..."></textarea></div>'
    + '<div class="form-group"><label class="form-label">Location / Reference</label><input id="dps-loc" class="form-input" type="text" placeholder="e.g. Level 3, Grid C4"></div>'
    + '<div class="form-group"><label class="form-label">Status</label><select id="dps-st" class="form-input"><option>Open</option><option>In Progress</option><option>Closed</option></select></div>'
    + '<div style="display:flex;gap:10px;margin-top:16px"><button class="btn btn-secondary" style="flex:1" id="dps-cancel">Cancel</button><button class="btn btn-primary" style="flex:1" id="dps-save">Save Pin</button></div>'
    + '</div>';
  document.body.appendChild(ps);

  // Pin detail sheet
  var pd = document.createElement('div');
  pd.id = 'dpd-ov';
  pd.innerHTML = '<div class="dpd-sht" id="dpd-body"></div>';
  document.body.appendChild(pd);

  // Wire toolbar buttons
  document.querySelectorAll('.vtbtn').forEach(function(btn) {
    btn.addEventListener('click', function() { dwgSetTool(btn.dataset.tool); });
  });

  // Wire back button
  document.getElementById('dvwr-back').addEventListener('click', function() {
    document.getElementById('dwg-vwr').classList.remove('open');
    document.getElementById('dwg-frm').src = '';
    _cur = null;
  });

  // Wire pin save/cancel
  document.getElementById('dps-save').addEventListener('click', function() { _savePin(); });
  document.getElementById('dps-cancel').addEventListener('click', function() {
    document.getElementById('dps-ov').style.display = 'none';
    _pc = null;
  });
  document.getElementById('dps-ov').addEventListener('click', function(e) {
    if (e.target === this) { this.style.display = 'none'; _pc = null; }
  });
  document.getElementById('dpd-ov').addEventListener('click', function(e) {
    if (e.target === this) this.style.display = 'none';
  });

  // Wire tap layer for pin placement
  var tl = document.getElementById('dwg-tap-layer');
  tl.addEventListener('click', function(e) {
    if (_tool === 'pan') return;
    var r = tl.getBoundingClientRect();
    _pc = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    _openPinSheet(_tool);
  });
  tl.addEventListener('touchend', function(e) {
    if (_tool === 'pan' || e.changedTouches.length !== 1) return;
    var t = e.changedTouches[0];
    var r = tl.getBoundingClientRect();
    _pc = { x: (t.clientX - r.left) / r.width, y: (t.clientY - r.top) / r.height };
    _openPinSheet(_tool);
  });
}

// ── State ──────────────────────────────────────────────────
var _drawings = [];
var _cur = null;
var _tool = 'pan';
var _pc = null;

// ── Load / Save ────────────────────────────────────────────
async function _load() {
  var proj = window.dbGetCurrentProject();
  if (!proj) return [];
  try {
    await window.dbReady;
    var co = localStorage.getItem('hvacnexus_company_id');
    var pn = proj.code || proj.num || proj.id;
    var res = await window._supabase.from('drawings').select('data')
      .eq('company_id', co).eq('project_num', pn).maybeSingle();
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    if (res.data && res.data.data) return res.data.data;
  } catch(e) { console.warn('[Drawings]', e); }
  return [];
}

async function _save() {
  var proj = window.dbGetCurrentProject();
  if (!proj) return;
  try {
    var co = localStorage.getItem('hvacnexus_company_id');
    var pn = proj.code || proj.num || proj.id;
    await window.dbReady;
    await window._supabase.from('drawings').upsert(
      { project_num: pn, company_id: co, data: _drawings },
      { onConflict: 'project_num' }
    );
  } catch(e) { console.warn('[Drawings save]', e); }
}

// ── Render List ────────────────────────────────────────────
window.renderDrawingsPage = async function(container) {
  container.innerHTML = '<div class="page"><div class="spinner"></div></div>';
  _drawings = await _load();

  // Group: discipline > area
  var groups = {};
  _drawings.forEach(function(d) {
    if (d.obsolete) return;
    var disc = d.discipline || 'Uncategorised';
    var area = d.area || d.subcat || '';
    if (!groups[disc]) groups[disc] = { _n: 0 };
    if (!groups[disc][area]) groups[disc][area] = [];
    groups[disc][area].push(d);
    groups[disc]._n++;
  });
  var discKeys = Object.keys(groups);

  var html = '<div class="page">';
  html += '<div class="dwg-sb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
    + '<input class="dwg-si" id="dwg-sq" placeholder="Search drawings..." oninput="dwgSearch()" type="search"></div>';

  html += '<div class="filter-row" id="dwg-fp">'
    + '<button class="pill-tab active" data-disc="" onclick="dwgFilt(this.dataset.disc)">All</button>';
  discKeys.forEach(function(k) {
    html += '<button class="pill-tab" data-disc="' + k + '" onclick="dwgFilt(this.dataset.disc)">' + k + '</button>';
  });
  html += '</div><div id="dwg-lst">';

  if (discKeys.length === 0) {
    html += '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">'
      + '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>'
      + '<polyline points="14 2 14 8 20 8"/></svg>'
      + '<p>No drawings found.<br>Add drawings in the desktop app.</p></div>';
  } else {
    discKeys.forEach(function(disc, i) {
      var id = 'dg' + i;
      var total = groups[disc]._n;
      var exp = i === 0;
      var areaKeys = Object.keys(groups[disc]).filter(function(k) { return k !== '_n'; });
      var multiArea = areaKeys.length > 1 || (areaKeys.length === 1 && areaKeys[0] !== '');

      html += '<div class="disc-group" data-disc="' + disc + '">';
      html += '<div class="disc-hdr' + (exp ? ' open' : '') + '" onclick="dwgToggle(\'' + id + '\')" id="' + id + 'h">';
      html += '<div class="disc-title"><span>' + disc + '</span><span class="disc-count">' + total + '</span></div>';
      html += '<svg class="disc-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>';
      html += '</div><div class="disc-body' + (exp ? ' open' : '') + '" id="' + id + 'b">';

      areaKeys.forEach(function(area) {
        if (multiArea && area) {
          html += '<div style="padding:6px 14px;font-size:11px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.8px;background:var(--bg-elevated);border-bottom:1px solid var(--border)">' + area + '</div>';
        }
        groups[disc][area].forEach(function(d) {
          var sc = { IFR:'st-ifr', IFA:'st-ifa', IFC:'st-ifc', 'As-Builts':'st-ab', AB:'st-ab' }[d.status] || 'st-ifr';
          var pins = (d.pins || []).length;
          html += '<div class="dwg-row" data-id="' + d.id + '" onclick="dwgOpen(this.dataset.id)">';
          html += '<div class="dwg-num">' + (d.num || '—') + '</div>';
          html += '<div class="dwg-info">';
          html += '<div class="dwg-name">' + (d.name || d.title || 'Untitled') + '</div>';
          html += '<div class="dwg-meta"><span>Rev ' + (d.rev || '—') + '</span>';
          if (pins > 0) html += '<span>📍 ' + pins + '</span>';
          html += '</div></div>';
          html += '<span class="dwg-st ' + sc + '">' + (d.status || '—') + '</span>';
          html += '</div>';
        });
      });
      html += '</div></div>';
    });
  }
  html += '</div></div>';
  container.innerHTML = html;
};

window.dwgToggle = function(id) {
  var h = document.getElementById(id + 'h'), b = document.getElementById(id + 'b');
  if (h) h.classList.toggle('open');
  if (b) b.classList.toggle('open');
};
window.dwgFilt = function(disc) {
  document.querySelectorAll('#dwg-fp .pill-tab').forEach(function(b) {
    b.classList.toggle('active', b.dataset.disc === disc);
  });
  document.querySelectorAll('.disc-group').forEach(function(g) {
    g.style.display = (!disc || g.dataset.disc === disc) ? '' : 'none';
  });
};
window.dwgSearch = function() {
  var q = (document.getElementById('dwg-sq').value || '').toLowerCase();
  document.querySelectorAll('.dwg-row').forEach(function(r) {
    r.style.display = r.textContent.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
  });
};

// ── Viewer ─────────────────────────────────────────────────
window.dwgOpen = function(id) {
  var d = _drawings.find(function(x) { return x.id === id; });
  if (!d) return;
  _cur = d;
  document.getElementById('dvwr-num').textContent = d.num || '—';
  document.getElementById('dvwr-name').textContent = d.name || d.title || 'Untitled';
  document.getElementById('dwg-vwr').classList.add('open');
  dwgSetTool('pan');

  var frm = document.getElementById('dwg-frm');
  var noP = document.getElementById('dwg-no-pdf');

  if (d.pdfUrl) {
    noP.style.display = 'none';
    frm.style.display = 'block';
    frm.src = d.pdfUrl;
  } else {
    frm.style.display = 'none';
    noP.style.display = 'flex';
  }
  _renderPins();
};

function dwgSetTool(tool) {
  _tool = tool;
  document.querySelectorAll('.vtbtn').forEach(function(b) {
    b.className = 'vtbtn';
    if (b.dataset.tool === tool) {
      b.classList.add('on');
      if (tool === 'defect') b.classList.add('def');
      if (tool === 'itp') b.classList.add('itp');
      if (tool === 'fire') b.classList.add('fir');
    }
  });
  var tl = document.getElementById('dwg-tap-layer');
  if (tl) tl.classList.toggle('active', tool !== 'pan');
}
window.dwgSetTool = dwgSetTool;

// ── Pins ───────────────────────────────────────────────────
function _renderPins() {
  var wrap = document.getElementById('dwg-wrap');
  if (!wrap || !_cur) return;
  wrap.querySelectorAll('.dpm').forEach(function(el) { el.remove(); });
  (_cur.pins || []).forEach(function(pin) {
    var el = document.createElement('div');
    el.className = 'dpm ' + pin.type.charAt(0);
    el.style.left = (pin.x * 100) + '%';
    el.style.top = (pin.y * 100) + '%';
    el.style.zIndex = '25';
    el.innerHTML = '<span>' + (pin.ref || '') + '</span>';
    el.addEventListener('click', function(e) { e.stopPropagation(); _showPin(pin); });
    wrap.appendChild(el);
  });
}

function _nextRef(type) {
  var p = { defect: 'DEF', itp: 'ITP', fire: 'FIR' }[type] || 'PIN';
  var mx = 0;
  _drawings.forEach(function(d) {
    (d.pins || []).forEach(function(pin) {
      if (pin.type === type) {
        var n = parseInt((pin.ref || '').replace(p + '-', '')) || 0;
        if (n > mx) mx = n;
      }
    });
  });
  return p + '-' + String(mx + 1).padStart(3, '0');
}

function _openPinSheet(tool) {
  var titles = { defect: 'Add Defect', itp: 'Add ITP Pin', fire: 'Add Fire Pin' };
  document.getElementById('dps-title').textContent = titles[tool] || 'Add Pin';
  document.getElementById('dps-desc').value = '';
  document.getElementById('dps-loc').value = '';
  document.getElementById('dps-st').value = 'Open';
  document.getElementById('dps-ov').style.display = 'flex';
}

function _savePin() {
  if (!_cur || !_pc) return;
  var desc = document.getElementById('dps-desc').value.trim();
  if (!desc) { alert('Please enter a description.'); return; }
  var pin = {
    id: 'pin-' + Date.now(),
    type: _tool,
    ref: _nextRef(_tool),
    x: _pc.x, y: _pc.y,
    desc: desc,
    location: document.getElementById('dps-loc').value.trim(),
    status: document.getElementById('dps-st').value,
    created: new Date().toISOString().split('T')[0]
  };
  if (!_cur.pins) _cur.pins = [];
  _cur.pins.push(pin);
  _save();
  document.getElementById('dps-ov').style.display = 'none';
  _pc = null;
  dwgSetTool('pan');
  _renderPins();
}

function _showPin(pin) {
  var tl = { defect:'Defect', itp:'ITP', fire:'Fire' }[pin.type] || pin.type;
  var sc = pin.status === 'Closed' ? 'done' : pin.status === 'In Progress' ? 'progress' : 'open';
  document.getElementById('dpd-body').innerHTML =
    '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px">'
    + '<div><div class="pref ' + pin.type.charAt(0) + '">' + pin.ref + '</div>'
    + '<div style="font-size:13px;color:var(--text-secondary);margin-top:2px">' + tl + '</div></div>'
    + '<button onclick="document.getElementById(\'dpd-ov\').style.display=\'none\'" '
    + 'style="width:32px;height:32px;border-radius:50%;background:var(--bg-elevated);border:none;cursor:pointer;font-size:20px;color:var(--text-secondary)">×</button>'
    + '</div>'
    + '<div class="dpd-lbl">Description</div><div class="dpd-val">' + (pin.desc || '—') + '</div>'
    + (pin.location ? '<div class="dpd-lbl">Location</div><div class="dpd-val">' + pin.location + '</div>' : '')
    + '<div class="dpd-lbl">Status</div><div class="dpd-val"><span class="status status-' + sc + '">' + pin.status + '</span></div>'
    + '<div class="dpd-lbl">Created</div><div class="dpd-val">' + (pin.created || '—') + '</div>'
    + '<div style="margin-top:16px"><button class="btn btn-danger" style="width:100%" '
    + 'onclick="dwgDelPin(\'' + pin.id + '\')">Delete Pin</button></div>';
  document.getElementById('dpd-ov').style.display = 'flex';
}

window.dwgDelPin = function(id) {
  if (!_cur) return;
  _cur.pins = (_cur.pins || []).filter(function(p) { return p.id !== id; });
  _save();
  document.getElementById('dpd-ov').style.display = 'none';
  _renderPins();
};

})();
