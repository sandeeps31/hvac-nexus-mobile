/* ============================================================
   HVAC NEXUS MOBILE — equipment.js
   Equipment schedule — read only
   Loaded on demand by app.js router
   ============================================================ */
'use strict';

(function() {

if (!document.getElementById('equip-css')) {
  var style = document.createElement('style');
  style.id = 'equip-css';
  style.textContent = [
    '.eq-tabs{display:flex;gap:8px;margin-bottom:16px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}',
    '.eq-tabs::-webkit-scrollbar{display:none}',
    '.eq-sb{position:relative;margin-bottom:14px}',
    '.eq-sb svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-tertiary);pointer-events:none;width:18px;height:18px}',
    '.eq-si{width:100%;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:11px 12px 11px 40px;font-size:15px;font-family:var(--font);color:var(--text-primary);outline:none;-webkit-appearance:none}',
    '.eq-si:focus{border-color:var(--accent)}',
    '.eq-si::placeholder{color:var(--text-tertiary)}',
    '.eq-rev{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:10px 14px;display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}',
    '.eq-rev-l{font-size:12px;color:var(--text-secondary);font-weight:500}',
    '.eq-rev-v{font-size:13px;font-weight:700;color:var(--accent);font-family:var(--font-mono)}',
    '.eq-ro{background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:var(--radius-md);padding:10px 14px;font-size:12px;color:#92400E;margin-bottom:14px;display:flex;align-items:center;gap:8px}',
    '.eq-ro svg{width:16px;height:16px;flex-shrink:0;color:#F59E0B}',
    '.eq-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);margin-bottom:10px;overflow:hidden;cursor:pointer;-webkit-tap-highlight-color:transparent}',
    '.eq-card:active{box-shadow:0 0 0 2px var(--accent)}',
    '.eq-ch{padding:12px 14px;display:flex;align-items:center;gap:12px}',
    '.eq-tag{font-size:12px;font-weight:700;font-family:var(--font-mono);color:var(--accent);background:var(--accent-dim);padding:4px 8px;border-radius:6px;flex-shrink:0;min-width:70px;text-align:center}',
    '.eq-info{flex:1;min-width:0}',
    '.eq-nm{font-size:14px;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px}',
    '.eq-sb2{font-size:12px;color:var(--text-secondary)}',
    '.eq-cv{color:var(--text-tertiary);transition:transform 0.2s;flex-shrink:0}',
    '.eq-card.exp .eq-cv{transform:rotate(180deg)}',
    '.eq-det{display:none;border-top:1px solid var(--border);padding:12px 14px;background:var(--bg-elevated)}',
    '.eq-card.exp .eq-det{display:block}',
    '.eq-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
    '.eq-fi{} .eq-fi.full{grid-column:1/-1}',
    '.eq-fl{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-tertiary);margin-bottom:3px}',
    '.eq-fv{font-size:13px;color:var(--text-primary);font-weight:500}'
  ].join('');
  document.head.appendChild(style);
}

var _eqData = null;
var _eqTab = 0;

async function _loadEquip() {
  var proj = window.dbGetCurrentProject();
  if (!proj) return null;
  try {
    await window.dbReady;
    var co = localStorage.getItem('hvacnexus_company_id');
    var pn = proj.code || proj.num || proj.id;
    var res = await window._supabase.from('equipment').select('data').eq('company_id', co).eq('project_num', pn).maybeSingle();
    if (res.data && res.data.data) return res.data.data;
  } catch(e) { console.warn('[Equipment]', e); }
  return null;
}

function _lastPub(tab) {
  if (!tab || !tab.revisions) return null;
  for (var i = tab.revisions.length - 1; i >= 0; i--) {
    if (tab.revisions[i].published) return i;
  }
  return null;
}

window.renderEquipmentPage = async function(container) {
  container.innerHTML = '<div class="page"><div class="spinner"></div></div>';
  _eqData = await _loadEquip();

  if (!_eqData || !_eqData.tabs || _eqData.tabs.length === 0) {
    container.innerHTML = '<div class="page"><div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg><p>No equipment schedules found.<br>Add equipment in the desktop app.</p></div></div>';
    return;
  }
  _eqTab = Math.min(_eqTab, _eqData.tabs.length - 1);
  _renderEquipTab(container);
};

function _renderEquipTab(container) {
  var tabs = _eqData.tabs;
  var tab = tabs[_eqTab];
  var ri = _lastPub(tab);
  var rows = (ri !== null && tab.revisions && tab.revisions[ri]) ? (tab.revisions[ri].rows || []) : [];

  var html = '<div class="page">';
  html += '<div class="eq-ro"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>View only — edit in the desktop app</div>';

  html += '<div class="eq-tabs">';
  tabs.forEach(function(t, i) {
    html += '<button class="pill-tab' + (i===_eqTab?' active':'') + '" onclick="eqSwitchTab('+i+')">' + (t.name||'Tab '+(i+1)) + '</button>';
  });
  html += '</div>';

  html += '<div class="eq-rev"><span class="eq-rev-l">Published Revision</span>';
  html += ri !== null && tab.revisions[ri]
    ? '<span class="eq-rev-v">' + (tab.revisions[ri].label || 'Rev '+ri) + '</span>'
    : '<span style="font-size:12px;color:var(--accent-amber);font-weight:600">No published revision</span>';
  html += '</div>';

  html += '<div class="eq-sb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input class="eq-si" id="eq-sq" placeholder="Search equipment…" oninput="eqSearch()" type="search"></div>';

  html += '<div id="eq-list">';
  if (rows.length === 0) {
    html += '<div class="empty-state" style="padding:40px 0"><p>No equipment in this revision.</p></div>';
  } else {
    rows.forEach(function(row, idx) {
      var fields = [];
      var skip = ['id','tag','name','description','type','model'];
      Object.keys(row).forEach(function(k) {
        if (skip.indexOf(k) !== -1) return;
        if (!row[k] && row[k] !== 0) return;
        fields.push({k:k, v:row[k]});
      });
      html += '<div class="eq-card" id="eqc-'+idx+'" onclick="eqToggle('+idx+')">'
        + '<div class="eq-ch"><div class="eq-tag">'+(row.tag||row.id||'—')+'</div>'
        + '<div class="eq-info"><div class="eq-nm">'+(row.name||row.description||'Unnamed')+'</div><div class="eq-sb2">'+(row.type||row.model||'')+'</div></div>'
        + '<svg class="eq-cv" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>'
        + '</div>';
      if (fields.length > 0) {
        html += '<div class="eq-det"><div class="eq-grid">';
        fields.forEach(function(f) {
          var full = String(f.v).length > 20;
          html += '<div class="eq-fi'+(full?' full':'')+'"><div class="eq-fl">'+f.k+'</div><div class="eq-fv">'+f.v+'</div></div>';
        });
        html += '</div></div>';
      }
      html += '</div>';
    });
  }
  html += '</div></div>';
  container.innerHTML = html;
}

window.eqToggle = function(idx) {
  var c = document.getElementById('eqc-'+idx);
  if (c) c.classList.toggle('exp');
};
window.eqSwitchTab = function(idx) {
  _eqTab = idx;
  var m = document.getElementById('app-main');
  if (m) _renderEquipTab(m);
};
window.eqSearch = function() {
  var q = (document.getElementById('eq-sq').value||'').toLowerCase();
  document.querySelectorAll('.eq-card').forEach(function(c) {
    c.style.display = c.textContent.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
  });
};

})();
