/* ============================================================
   HVAC NEXUS MOBILE — app.js
   Routing, navigation, offline sync queue
   ============================================================ */

'use strict';

// ── State ──────────────────────────────────────────────────
var APP = {
  currentPage: 'home',
  pageHistory: [],
  isOnline: navigator.onLine,
  syncQueue: [],
  currentProject: null,
  currentUser: null
};

// ── Offline / Online Detection ─────────────────────────────
window.addEventListener('online',  function() { APP.isOnline = true;  updateSyncIndicator(); processSyncQueue(); showSyncToast(); });
window.addEventListener('offline', function() { APP.isOnline = false; updateSyncIndicator(); showOfflineToast(); });

function updateSyncIndicator() {
  var dot = document.getElementById('sync-indicator');
  if (!dot) return;
  dot.className = 'sync-dot ' + (APP.isOnline ? 'online' : 'offline');
  dot.title = APP.isOnline ? 'Online' : 'Offline';
}

function showOfflineToast() {
  var t = document.getElementById('offline-toast');
  if (!t) return;
  t.classList.remove('hidden');
  setTimeout(function() { t.classList.add('hidden'); }, 4000);
}

function showSyncToast() {
  if (APP.syncQueue.length === 0) return;
  var t = document.getElementById('sync-toast');
  if (!t) return;
  t.classList.remove('hidden');
  setTimeout(function() { t.classList.add('hidden'); }, 3000);
}

// ── Sync Queue ─────────────────────────────────────────────
// Operations queued while offline are stored in localStorage
// and replayed when connectivity returns.

var SYNC_KEY = 'hvacnexus_mobile_syncqueue';

function loadSyncQueue() {
  try {
    APP.syncQueue = JSON.parse(localStorage.getItem(SYNC_KEY) || '[]');
  } catch(e) {
    APP.syncQueue = [];
  }
}

function saveSyncQueue() {
  try {
    localStorage.setItem(SYNC_KEY, JSON.stringify(APP.syncQueue));
  } catch(e) {}
}

// Add an operation to the sync queue (called by modules when offline save occurs)
function queueSync(operation) {
  // operation: { table, action, data, id, timestamp }
  operation.timestamp = Date.now();
  APP.syncQueue.push(operation);
  saveSyncQueue();
}

// Process all queued operations against Supabase
async function processSyncQueue() {
  if (!APP.isOnline || APP.syncQueue.length === 0) return;

  var dot = document.getElementById('sync-indicator');
  if (dot) { dot.className = 'sync-dot syncing'; dot.title = 'Syncing…'; }

  var failed = [];

  for (var i = 0; i < APP.syncQueue.length; i++) {
    var op = APP.syncQueue[i];
    try {
      if (op.action === 'upsert') {
        var res = await dbReady.then(function() {
          return window._supabase.from(op.table).upsert(op.data);
        });
        if (res.error) throw res.error;
      } else if (op.action === 'delete') {
        var res2 = await dbReady.then(function() {
          return window._supabase.from(op.table).delete().eq('id', op.id);
        });
        if (res2.error) throw res2.error;
      }
    } catch(e) {
      console.warn('[SyncQueue] Failed op:', op, e);
      failed.push(op);
    }
  }

  APP.syncQueue = failed;
  saveSyncQueue();

  if (dot) {
    dot.className = 'sync-dot online';
    dot.title = 'Online';
  }
}

// ── Navigation ─────────────────────────────────────────────
var PAGE_CONFIG = {
  home:         { title: 'HVAC Nexus', sub: '',            nav: 'home' },
  technical:    { title: 'Technical',  sub: '',            nav: 'technical' },
  quality:      { title: 'Quality',    sub: '',            nav: 'quality' },
  commissioning:{ title: 'Commissioning', sub: '',         nav: 'commissioning' },
  procurement:  { title: 'Procurement',sub: '',            nav: 'procurement' },
  // Sub-pages
  drawings:     { title: 'Drawings',   sub: 'Technical',   nav: 'technical' },
  equipment:    { title: 'Equipment',  sub: 'Technical',   nav: 'technical' },
  techsubs:     { title: 'Tech Submissions', sub: 'Technical', nav: 'technical' },
  specs:        { title: 'Specifications', sub: 'Technical', nav: 'technical' },
  itps:         { title: 'ITPs',       sub: 'Quality',     nav: 'quality' },
  passivefire:  { title: 'Passive Fire', sub: 'Quality',   nav: 'quality' },
  defects:      { title: 'Defects',    sub: 'Quality',     nav: 'quality' },
  ncr:          { title: 'NCR',        sub: 'Quality',     nav: 'quality' },
  precx:        { title: 'Pre-Cx Checklist', sub: 'Commissioning', nav: 'commissioning' },
  cxtracker:    { title: 'Cx Tracker', sub: 'Commissioning', nav: 'commissioning' },
  procschedule: { title: 'Procurement Schedule', sub: 'Procurement', nav: 'procurement' },
  pos:          { title: 'Purchase Orders', sub: 'Procurement', nav: 'procurement' }
};

function appNav(page, params) {
  params = params || {};

  // Push to history
  if (APP.currentPage !== page) {
    APP.pageHistory.push(APP.currentPage);
  }

  APP.currentPage = page;

  var cfg = PAGE_CONFIG[page] || { title: page, sub: '', nav: page };

  // Update header
  document.getElementById('header-main').textContent = cfg.title;
  document.getElementById('header-sub').textContent = cfg.sub || (APP.currentProject ? APP.currentProject.name : '');

  // Show/hide back button
  var backBtn = document.getElementById('back-btn');
  var isTopLevel = ['home','technical','quality','commissioning','procurement'].indexOf(page) !== -1;
  backBtn.classList.toggle('hidden', isTopLevel || APP.pageHistory.length === 0);

  // Update bottom nav active state
  document.querySelectorAll('.nav-item').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.page === cfg.nav);
  });

  // Render page
  renderPage(page, params);
}

function appGoBack() {
  if (APP.pageHistory.length > 0) {
    var prev = APP.pageHistory.pop();
    // Don't push to history again
    APP.currentPage = prev;
    var cfg = PAGE_CONFIG[prev] || { title: prev, sub: '', nav: prev };
    document.getElementById('header-main').textContent = cfg.title;
    document.getElementById('header-sub').textContent = cfg.sub || (APP.currentProject ? APP.currentProject.name : '');
    var isTopLevel = ['home','technical','quality','commissioning','procurement'].indexOf(prev) !== -1;
    document.getElementById('back-btn').classList.toggle('hidden', isTopLevel || APP.pageHistory.length === 0);
    document.querySelectorAll('.nav-item').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.page === cfg.nav);
    });
    renderPage(prev, {});
  }
}

// ── Page Renderer ──────────────────────────────────────────
function renderPage(page, params) {
  var main = document.getElementById('app-main');
  main.innerHTML = '<div class="spinner"></div>';

  // Small delay so spinner shows on fast renders
  setTimeout(function() {
    switch(page) {
      case 'home':         renderHome(main); break;
      case 'technical':    renderTechnical(main); break;
      case 'quality':      renderQuality(main); break;
      case 'commissioning':renderCommissioning(main); break;
      case 'procurement':  renderProcurement(main); break;
      case 'drawings':     renderDrawingsModule(main); break;
      case 'equipment':    renderEquipmentModule(main); break;
      // Sub-pages (stubs — will be built per module)
      default:
        renderComingSoon(main, page);
    }
  }, 80);
}

// ── Home Page ──────────────────────────────────────────────
async function renderHome(main) {
  var user = APP.currentUser || { name: 'Guest' };
  var hour = new Date().getHours();
  var greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Load projects from Supabase
  var projects = [];
  try {
    await dbReady;
    var companyId = dbGetCompanyId() || localStorage.getItem('hvacnexus_company_id');
    if (companyId) {
      // Ensure session is active before querying
      var sessionRes = await window._supabase.auth.getSession();
      if (!sessionRes.data || !sessionRes.data.session) {
        window.location.href = 'login.html';
        return;
      }
      var res = await window._supabase
        .from('projects')
        .select('data')
        .eq('company_id', companyId);
      if (res.data && res.data.length > 0) {
        // Find the row with project_num === '__projects__'
        var row = res.data.find(function(r) { return r.data && Array.isArray(r.data); });
        if (row) {
          projects = row.data.map(function(p) {
            return { id: p.id, name: p.name, code: p.num || p.code || '' };
          });
        }
      } else {
        console.warn('[Home] projects query error:', res.error);
      }
    }
  } catch(e) {
    console.warn('[Home] Failed to load projects:', e);
  }

  // If only one project, auto-select it
  if (projects.length === 1 && !APP.currentProject) {
    APP.currentProject = projects[0];
    localStorage.setItem('hvacnexus_current_project', JSON.stringify(projects[0]));
  }

  var proj = APP.currentProject;

  var html = '<div class="page">'
    + '<div class="home-greeting">'
    +   '<h1>' + greeting + ', ' + (user.name ? user.name.split(' ')[0] : 'there') + '</h1>'
    +   '<p>' + new Date().toLocaleDateString('en-AU', {weekday:'long',day:'numeric',month:'long'}) + '</p>'
    + '</div>';

  // Project banner or picker
  if (proj) {
    html += '<div class="project-banner" onclick="showProjectPicker()" style="cursor:pointer">'
      +   '<div class="project-banner-label">Active Project <span style="opacity:0.6;font-size:10px;margin-left:6px">TAP TO CHANGE</span></div>'
      +   '<div class="project-banner-name">' + proj.name + '</div>'
      +   '<div class="project-banner-id">' + (proj.code || '') + '</div>'
      + '</div>';
  } else {
    html += '<div class="project-banner" onclick="showProjectPicker()" style="cursor:pointer;border-color:rgba(245,158,11,0.4);background:linear-gradient(135deg,#2a1f0a 0%,#1a1200 100%)">'
      +   '<div class="project-banner-label" style="color:#F59E0B">No Project Selected</div>'
      +   '<div class="project-banner-name" style="font-size:15px;color:var(--text-secondary)">Tap to select a project</div>'
      + '</div>';
  }

  // Quick access (only if project selected)
  if (proj) {
    html += '<div class="section-header"><span class="section-title">Quick Access</span></div>'

      + '<div class="module-item" onclick="appNav(\'itps\')">'
      +   '<div class="module-icon" style="background:rgba(34,197,94,0.15)">'
      +     '<svg viewBox="0 0 24 24" fill="none" stroke="#4ADE80" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'
      +   '</div>'
      +   '<span class="module-label">ITPs</span>'
      +   '<span class="module-badge badge-edit">Edit</span>'
      +   '<svg class="card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>'
      + '</div>'

      + '<div class="module-item" onclick="appNav(\'defects\')">'
      +   '<div class="module-icon" style="background:rgba(239,68,68,0.15)">'
      +     '<svg viewBox="0 0 24 24" fill="none" stroke="#F87171" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
      +   '</div>'
      +   '<span class="module-label">Defects</span>'
      +   '<span class="module-badge badge-edit">Edit</span>'
      +   '<svg class="card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>'
      + '</div>'

      + '<div class="module-item" onclick="appNav(\'precx\')">'
      +   '<div class="module-icon" style="background:rgba(167,139,250,0.15)">'
      +     '<svg viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>'
      +   '</div>'
      +   '<span class="module-label">Pre-Cx Checklist</span>'
      +   '<span class="module-badge badge-edit">Edit</span>'
      +   '<svg class="card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>'
      + '</div>'

      + '<div class="module-item" onclick="appNav(\'drawings\')">'
      +   '<div class="module-icon" style="background:rgba(59,130,246,0.15)">'
      +     '<svg viewBox="0 0 24 24" fill="none" stroke="#60A5FA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
      +   '</div>'
      +   '<span class="module-label">Drawings</span>'
      +   '<span class="module-badge badge-edit">Edit</span>'
      +   '<svg class="card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>'
      + '</div>';
  }

  html += '</div>';
  main.innerHTML = html;

  // Store projects list for picker
  APP._projects = projects;
}

// ── Project Picker Modal ───────────────────────────────────
function showProjectPicker() {
  var projects = APP._projects || [];

  // Build modal
  var overlay = document.createElement('div');
  overlay.id = 'proj-picker-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:500;display:flex;align-items:flex-end;';
  overlay.onclick = function(e) { if (e.target === overlay) closeProjPicker(); };

  var sheet = document.createElement('div');
  sheet.style.cssText = 'background:var(--bg-card);border-radius:20px 20px 0 0;width:100%;max-height:70vh;overflow-y:auto;padding-bottom:env(safe-area-inset-bottom,0px);animation:sheetUp 0.25s ease;';

  var html = '<div style="padding:16px 20px 8px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">'
    + '<span style="font-size:16px;font-weight:700;color:var(--text-primary)">Select Project</span>'
    + '<button onclick="closeProjPicker()" style="width:32px;height:32px;border-radius:50%;background:var(--bg-elevated);color:var(--text-secondary);font-size:18px;display:flex;align-items:center;justify-content:center">×</button>'
    + '</div>';

  if (projects.length === 0) {
    html += '<div class="empty-state" style="padding:40px 20px"><p>No projects found.<br>Create a project in the desktop app first.</p></div>';
  } else {
    projects.forEach(function(p) {
      var isActive = APP.currentProject && APP.currentProject.id === p.id;
      html += '<div onclick="selectProject(\'' + p.id + '\',\'' + p.name.replace(/'/g, "\\'") + '\',\'' + (p.code||'').replace(/'/g, "\\'") + '\')" '
        + 'style="padding:16px 20px;display:flex;align-items:center;gap:14px;cursor:pointer;border-bottom:1px solid var(--border);' + (isActive ? 'background:var(--accent-dim)' : '') + '">'
        + '<div style="width:40px;height:40px;border-radius:10px;background:' + (isActive ? 'var(--accent-dim)' : 'var(--bg-elevated)') + ';display:flex;align-items:center;justify-content:center;flex-shrink:0">'
        +   '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="' + (isActive ? '#60A5FA' : 'var(--text-secondary)') + '" stroke-width="1.8" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>'
        + '</div>'
        + '<div style="flex:1;min-width:0">'
        +   '<div style="font-size:15px;font-weight:600;color:' + (isActive ? 'var(--accent)' : 'var(--text-primary)') + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + p.name + '</div>'
        +   '<div style="font-size:12px;color:var(--text-secondary);font-family:var(--font-mono)">' + (p.code || '') + '</div>'
        + '</div>'
        + (isActive ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' : '')
        + '</div>';
    });
  }

  sheet.innerHTML = html;
  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
}

function closeProjPicker() {
  var el = document.getElementById('proj-picker-overlay');
  if (el) el.remove();
}

function selectProject(id, name, code) {
  APP.currentProject = { id: id, name: name, code: code };
  localStorage.setItem('hvacnexus_current_project', JSON.stringify(APP.currentProject));
  closeProjPicker();
  appNav('home');
}

// Add sheet animation
var _sheetStyle = document.createElement('style');
_sheetStyle.textContent = '@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }';
document.head.appendChild(_sheetStyle);

// ── Technical Page ─────────────────────────────────────────
function renderTechnical(main) {
  main.innerHTML = '<div class="page">'
    + '<div class="section-header"><span class="section-title">Technical</span></div>'

    + makeModuleItem('drawings',    '#60A5FA', 'rgba(59,130,246,0.15)',  drawingsIcon(),  'Drawings',           'Edit')
    + makeModuleItem('equipment',   '#34D399', 'rgba(52,211,153,0.15)',  equipIcon(),     'Equipment Schedules','View')
    + makeModuleItem('techsubs',    '#FBBF24', 'rgba(251,191,36,0.15)',  techsubsIcon(),  'Tech Submissions',   'View')
    + makeModuleItem('specs',       '#F472B6', 'rgba(244,114,182,0.15)', specsIcon(),     'Specifications',     'View')

    + '</div>';
}

// ── Quality Page ───────────────────────────────────────────
function renderQuality(main) {
  main.innerHTML = '<div class="page">'
    + '<div class="section-header"><span class="section-title">Quality</span></div>'

    + makeModuleItem('itps',        '#4ADE80', 'rgba(34,197,94,0.15)',   itpsIcon(),      'ITPs',               'Edit')
    + makeModuleItem('defects',     '#F87171', 'rgba(239,68,68,0.15)',   defectsIcon(),   'Defects',            'Edit')
    + makeModuleItem('passivefire', '#FB923C', 'rgba(251,146,60,0.15)',  pfireIcon(),     'Passive Fire',       'View')
    + makeModuleItem('ncr',         '#E879F9', 'rgba(232,121,249,0.15)', ncrIcon(),       'NCR',                'View')

    + '</div>';
}

// ── Commissioning Page ─────────────────────────────────────
function renderCommissioning(main) {
  main.innerHTML = '<div class="page">'
    + '<div class="section-header"><span class="section-title">Commissioning</span></div>'

    + makeModuleItem('precx',       '#A78BFA', 'rgba(167,139,250,0.15)', precxIcon(),     'Pre-Cx Checklist',   'Edit')
    + makeModuleItem('cxtracker',   '#38BDF8', 'rgba(56,189,248,0.15)',  cxtrackerIcon(), 'Commissioning Tracker','Edit')

    + '</div>';
}

// ── Procurement Page ───────────────────────────────────────
function renderProcurement(main) {
  main.innerHTML = '<div class="page">'
    + '<div class="section-header"><span class="section-title">Procurement</span></div>'

    + makeModuleItem('procschedule','#FBBF24', 'rgba(251,191,36,0.15)',  procIcon(),      'Procurement Schedule','View')
    + makeModuleItem('pos',         '#60A5FA', 'rgba(59,130,246,0.15)',  posIcon(),       'Purchase Orders',    'View')

    + '</div>';
}

// ── Drawings Module ───────────────────────────────────────
var _drawingsLoaded = false;
function renderDrawingsModule(main) {
  if (!_drawingsLoaded) {
    _drawingsLoaded = true;
    var s = document.createElement('script');
    s.src = 'drawings.html';
    // Load via fetch+eval to get the script from the HTML file
  }
  // Use iframe-less approach: load script tag from drawings.html
  loadModuleScript('drawings.html', function() {
    if (window.renderDrawingsPage) renderDrawingsPage(main);
    else renderComingSoon(main, 'drawings');
  });
}

// ── Equipment Module ───────────────────────────────────────
var _equipmentLoaded = false;
function renderEquipmentModule(main) {
  loadModuleScript('equipment.html', function() {
    if (window.renderEquipmentPage) renderEquipmentPage(main);
    else renderComingSoon(main, 'equipment');
  });
}

// ── Module Script Loader ───────────────────────────────────
// Fetches an HTML module file, extracts and executes its <script> tags,
// then calls the callback. Caches so scripts only execute once.
var _loadedModules = {};
function loadModuleScript(url, callback) {
  if (_loadedModules[url]) {
    callback();
    return;
  }
  fetch(url)
    .then(function(r) { return r.text(); })
    .then(function(html) {
      // Extract all <script> tags that don't have src
      var scripts = [];
      var re = /<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi;
      var m;
      while ((m = re.exec(html)) !== null) {
        scripts.push(m[1]);
      }
      // Also extract linked CSS and append to head
      var styleRe = /<style[^>]*>([\s\S]*?)<\/style>/gi;
      var sm;
      while ((sm = styleRe.exec(html)) !== null) {
        var styleEl = document.createElement('style');
        styleEl.textContent = sm[1];
        document.head.appendChild(styleEl);
      }
      // Execute scripts
      scripts.forEach(function(code) {
        try { new Function(code)(); } catch(e) { console.warn('[ModuleLoader]', url, e); }
      });
      _loadedModules[url] = true;
      callback();
    })
    .catch(function(e) {
      console.warn('[ModuleLoader] Failed to load:', url, e);
      callback();
    });
}

// ── Coming Soon Stub ───────────────────────────────────────
function renderComingSoon(main, page) {
  main.innerHTML = '<div class="page">'
    + '<div class="empty-state">'
    +   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    +   '<p>This module is coming soon.<br>Check back in a future update.</p>'
    + '</div>'
    + '</div>';
}

// ── Module Item Helper ─────────────────────────────────────
function makeModuleItem(page, iconColor, iconBg, iconSvg, label, mode) {
  var badgeClass = mode === 'Edit' ? 'badge-edit' : 'badge-view';
  return '<div class="module-item" onclick="appNav(\'' + page + '\')">'
    + '<div class="module-icon" style="background:' + iconBg + '">'
    +   '<svg viewBox="0 0 24 24" fill="none" stroke="' + iconColor + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + iconSvg + '</svg>'
    + '</div>'
    + '<span class="module-label">' + label + '</span>'
    + '<span class="module-badge ' + badgeClass + '">' + mode + '</span>'
    + '<svg class="card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>'
    + '</div>';
}

// ── SVG Icon Helpers ───────────────────────────────────────
function drawingsIcon()   { return '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'; }
function equipIcon()      { return '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>'; }
function techsubsIcon()   { return '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'; }
function specsIcon()      { return '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'; }
function itpsIcon()       { return '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'; }
function defectsIcon()    { return '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'; }
function pfireIcon()      { return '<path d="M12 2c0 6-8 8-8 14a8 8 0 0 0 16 0c0-6-8-8-8-14z"/><path d="M12 12c0 3-3 4-3 7a3 3 0 0 0 6 0c0-3-3-4-3-7z"/>'; }
function ncrIcon()        { return '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'; }
function precxIcon()      { return '<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/>'; }
function cxtrackerIcon()  { return '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'; }
function procIcon()       { return '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>'; }
function posIcon()        { return '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>'; }

// ── Session / Project ──────────────────────────────────────
function loadSession() {
  try {
    var proj = localStorage.getItem('hvacnexus_current_project');
    if (proj) APP.currentProject = JSON.parse(proj);
    var user = localStorage.getItem('hvacnexus_current_user');
    if (user) APP.currentUser = JSON.parse(user);
  } catch(e) {}
}

// ── Service Worker Registration ────────────────────────────
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function(reg) {
      console.log('[SW] Registered:', reg.scope);
    }).catch(function(err) {
      console.warn('[SW] Registration failed:', err);
    });
  }
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  loadSession();
  loadSyncQueue();
  updateSyncIndicator();
  registerSW();
  appNav('home');
});
