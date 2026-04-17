/* ============================================================
   HVAC NEXUS MOBILE — drawings.js
   Drawings list + PDF viewer with pins
   Loaded on demand by app.js router
   ============================================================ */
'use strict';

(function() {

// ── Inject CSS once ────────────────────────────────────────
if (!document.getElementById('drawings-css')) {
  var style = document.createElement('style');
  style.id = 'drawings-css';
  style.textContent = [
    '.dwg-search-bar{position:relative;margin-bottom:14px}',
    '.dwg-search-bar svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-tertiary);pointer-events:none;width:18px;height:18px}',
    '.dwg-search-input{width:100%;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:11px 12px 11px 40px;font-size:15px;font-family:var(--font);color:var(--text-primary);outline:none;-webkit-appearance:none}',
    '.dwg-search-input:focus{border-color:var(--accent)}',
    '.dwg-search-input::placeholder{color:var(--text-tertiary)}',
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
    '#dwg-viewer-overlay{position:fixed;inset:0;background:#1a1a2e;z-index:200;display:none;flex-direction:column}',
    '#dwg-viewer-overlay.open{display:flex}',
    '.vwr-hdr{height:52px;background:#0f0f1a;display:flex;align-items:center;padding:0 8px;gap:8px;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,0.08)}',
    '.vwr-title{flex:1;min-width:0}',
    '.vwr-title .t1{font-size:13px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.vwr-title .t2{font-size:11px;color:rgba(255,255,255,0.5)}',
    '.vwr-btn{width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;background:rgba(255,255,255,0.08);border:none;cursor:pointer}',
    '.vwr-btn:active{opacity:0.7}',
    '.vwr-btn svg{width:20px;height:20px}',
    '#dwg-wrap{flex:1;overflow:hidden;position:relative;touch-action:none}',
    '#dwg-cvs{position:absolute;transform-origin:0 0;cursor:grab}',
    '#dwg-cvs.placing{cursor:crosshair}',
    '#dwg-pins{position:absolute;top:0;left:0;pointer-events:none;transform-origin:0 0}',
    '.pm{position:absolute;width:30px;height:30px;border-radius:50% 50% 50% 0;transform:translate(-50%,-100%) rotate(-45deg);display:flex;align-items:center;justify-content:center;pointer-events:all;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.4)}',
    '.pm span{transform:rotate(45deg);font-size:9px;font-weight:700;color:#fff}',
    '.pm-defect{background:#EF4444}',
    '.pm-itp{background:#22C55E}',
    '.pm-fire{background:#F97316}',
    '.vwr-tb{height:60px;background:#0f0f1a;display:flex;align-items:center;justify-content:space-around;flex-shrink:0;border-top:1px solid rgba(255,255,255,0.08);padding-bottom:env(safe-area-inset-bottom,0px)}',
    '.tbtn{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 10px;border-radius:8px;color:rgba(255,255,255,0.4);font-size:10px;font-weight:500;-webkit-tap-highlight-color:transparent;border:none;background:none;font-family:var(--font);cursor:pointer}',
    '.tbtn svg{width:22px;height:22px}',
    '.tbtn.ta{color:#fff;background:rgba(255,255,255,0.1)}',
    '.tbtn.td{color:#EF4444}',
    '.tbtn.ti{color:#22C55E}',
    '.tbtn.tf{color:#F97316}',
    '.vwr-empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:rgba(255,255,255,0.3);gap:12px}',
    '.vwr-empty svg{width:48px;height:48px}',
    '.vwr-empty p{font-size:14px}',
    '#pin-add-ov{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:400;display:none;align-items:flex-end}',
    '.pin-sht{background:var(--bg-card);border-radius:20px 20px 0 0;width:100%;padding:20px 20px calc(20px + env(safe-area-inset-bottom,0px));animation:sheetUp 0.25s ease}',
    '.pin-sht h3{font-size:17px;font-weight:700;color:var(--text-primary);margin-bottom:16px}',
    '#pin-det-ov{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:400;display:none;align-items:flex-end}',
    '.pin-det-sht{background:var(--bg-card);border-radius:20px 20px 0 0;width:100%;max-height:70vh;overflow-y:auto;padding:20px 20px calc(20px + env(safe-area-inset-bottom,0px));animation:sheetUp 0.25s ease}',
    '.pin-rb{font-size:13px;font-weight:700;font-family:var(--font-mono)}',
    '.pin-rb.defect{color:#EF4444}',
    '.pin-rb.itp{color:#22C55E}',
    '.pin-rb.fire{color:#F97316}',
    '.det-lbl{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-tertiary);margin-bottom:4px}',
    '.det-val{font-size:14px;color:var(--text-primary);margin-bottom:12px}'
  ].join('');
  document.head.appendChild(style);
}

// ── Inject viewer overlay once ─────────────────────────────
if (!document.getElementById('dwg-viewer-overlay')) {
  var ov = document.createElement('div');
  ov.id = 'dwg-viewer-overlay';
  ov.innerHTML =
    '<div class="vwr-hdr">'
    + '<button class="vwr-btn" id="vwr-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg></button>'
    + '<div class="vwr-title"><div class="t1" id="vwr-num">—</div><div class="t2" id="vwr-name">—</div></div>'
    + '<button class="vwr-btn" id="vwr-fit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg></button>'
    + '</div>'
    + '<div id="dwg-wrap">'
    +   '<canvas id="dwg-cvs"></canvas>'
    +   '<div id="dwg-pins"></div>'
    +   '<div class="vwr-empty" id="dwg-empty" style="display:none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><p>No PDF attached</p></div>'
    + '</div>'
    + '<div class="vwr-tb">'
    +   '<button class="tbtn ta" id="tb-pan" onclick="dwgTool(\'pan\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 11V6a2 2 0 0 0-4 0v0a2 2 0 0 0-4 0v0a2 2 0 0 0-4 0v10a2 2 0 0 0 2 2h6.5a2 2 0 0 1 2 2 2 2 0 0 0 2-2v-6.5"/></svg>Pan</button>'
    +   '<button class="tbtn" id="tb-defect" onclick="dwgTool(\'defect\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Defect</button>'
    +   '<button class="tbtn" id="tb-itp" onclick="dwgTool(\'itp\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>ITP</button>'
    +   '<button class="tbtn" id="tb-fire" onclick="dwgTool(\'fire\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2c0 6-8 8-8 14a8 8 0 0 0 16 0c0-6-8-8-8-14z"/></svg>Fire</button>'
    +   '<button class="tbtn" onclick="dwgZoom(1.3)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>Zoom+</button>'
    +   '<button class="tbtn" onclick="dwgZoom(0.77)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>Zoom-</button>'
    + '</div>';
  document.body.appendChild(ov);

  var pa = document.createElement('div');
  pa.id = 'pin-add-ov';
  pa.innerHTML =
    '<div class="pin-sht">'
    + '<h3 id="pin-sht-title">Add Pin</h3>'
    + '<div class="form-group"><label class="form-label">Description</label><textarea id="pin-desc" class="form-input" rows="3" placeholder="Describe the issue..."></textarea></div>'
    + '<div class="form-group"><label class="form-label">Location / Reference</label><input id="pin-loc" class="form-input" type="text" placeholder="e.g. Level 3, Grid C4"></div>'
    + '<div class="form-group"><label class="form-label">Status</label><select id="pin-st" class="form-input"><option>Open</option><option>In Progress</option><option>Closed</option></select></div>'
    + '<div style="display:flex;gap:10px;margin-top:16px"><button class="btn btn-secondary" style="flex:1" id="pin-cancel">Cancel</button><button class="btn btn-primary" style="flex:1" id="pin-save">Save Pin</button></div>'
    + '</div>';
  document.body.appendChild(pa);

  var pd = document.createElement('div');
  pd.id = 'pin-det-ov';
  pd.innerHTML = '<div class="pin-det-sht" id="pin-det-body"></div>';
  document.body.appendChild(pd);

  // Wire events — deferred so all window.* functions are defined first
  // (event wiring moved to _wireEvents() called at end of IIFE)

  // Canvas touch/mouse
  var wrap = document.getElementById('dwg-wrap');
  wrap.addEventListener('mousedown', function(e){ if(_t!=='pan') return; _dr=true; _lx=e.clientX; _ly=e.clientY; });
  window.addEventListener('mousemove', function(e){ if(!_dr) return; _tx+=e.clientX-_lx; _ty+=e.clientY-_ly; _lx=e.clientX; _ly=e.clientY; _at(); });
  window.addEventListener('mouseup', function(){ _dr=false; });
  wrap.addEventListener('click', function(e){
    if(_t==='pan') return;
    var r=wrap.getBoundingClientRect(), c=document.getElementById('dwg-cvs');
    var cw=c.offsetWidth||c.width, ch=c.offsetHeight||c.height;
    _pc={x:(e.clientX-r.left-_tx)/(_sc*cw), y:(e.clientY-r.top-_ty)/(_sc*ch)};
    _openPinModal(_t);
  });
  wrap.addEventListener('touchstart', function(e){
    if(e.touches.length===1){ _lx=e.touches[0].clientX; _ly=e.touches[0].clientY; if(_t==='pan') _dr=true; }
    else if(e.touches.length===2){ _dr=false; var dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY; _pd=Math.sqrt(dx*dx+dy*dy); }
  },{passive:true});
  wrap.addEventListener('touchmove', function(e){
    e.preventDefault();
    if(e.touches.length===1&&_dr){ _tx+=e.touches[0].clientX-_lx; _ty+=e.touches[0].clientY-_ly; _lx=e.touches[0].clientX; _ly=e.touches[0].clientY; _at(); }
    else if(e.touches.length===2){
      var dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY;
      var d=Math.sqrt(dx*dx+dy*dy),f=d/_pd;
      var cx=(e.touches[0].clientX+e.touches[1].clientX)/2,cy=(e.touches[0].clientY+e.touches[1].clientY)/2;
      var r=wrap.getBoundingClientRect(),ox=cx-r.left,oy=cy-r.top;
      _tx=ox-f*(ox-_tx); _ty=oy-f*(oy-_ty); _sc*=f; _pd=d; _at();
    }
  },{passive:false});
  wrap.addEventListener('touchend', function(e){
    if(e.changedTouches.length===1&&_t!=='pan'){
      var t=e.changedTouches[0];
      if(Math.abs(t.clientX-_lx)<8&&Math.abs(t.clientY-_ly)<8){
        var r=wrap.getBoundingClientRect(),c=document.getElementById('dwg-cvs');
        var cw=c.offsetWidth||c.width,ch=c.offsetHeight||c.height;
        _pc={x:(t.clientX-r.left-_tx)/(_sc*cw),y:(t.clientY-r.top-_ty)/(_sc*ch)};
        _openPinModal(_t);
      }
    }
    _dr=false;
  });
}

// ── State ──────────────────────────────────────────────────
var _drawings=[], _cur=null, _t='pan', _pc=null;
var _sc=1, _tx=0, _ty=0, _dr=false, _lx=0, _ly=0, _pd=0;
var _pdfLoaded=false, _pdfPage=null;

// ── Helpers ────────────────────────────────────────────────
function _at(){
  var t='translate('+_tx+'px,'+_ty+'px) scale('+_sc+')';
  var c=document.getElementById('dwg-cvs'), p=document.getElementById('dwg-pins');
  if(c) c.style.transform=t;
  if(p) p.style.transform=t;
}

function _rp(){
  var layer=document.getElementById('dwg-pins'), c=document.getElementById('dwg-cvs');
  if(!layer||!c||!_cur) return;
  // Use CSS (logical) size for pin positioning, not physical canvas size
  var cw=c.offsetWidth||c.width, ch=c.offsetHeight||c.height;
  layer.style.width=cw+'px'; layer.style.height=ch+'px';
  layer.innerHTML='';
  var cw2=c.offsetWidth||c.width, ch2=c.offsetHeight||c.height;
  (_cur.pins||[]).forEach(function(pin){
    var el=document.createElement('div');
    el.className='pm pm-'+pin.type;
    el.style.left=(pin.x*cw2)+'px'; el.style.top=(pin.y*ch2)+'px';
    el.innerHTML='<span>'+(pin.ref||'')+'</span>';
    el.onclick=function(e){e.stopPropagation();_showPinDet(pin);};
    layer.appendChild(el);
  });
}

function _nr(type){
  var p={defect:'DEF',itp:'ITP',fire:'FIR'}[type]||'PIN';
  var mx=0;
  _drawings.forEach(function(d){(d.pins||[]).forEach(function(pin){
    if(pin.type===type){var n=parseInt((pin.ref||'').replace(p+'-',''))||0;if(n>mx)mx=n;}
  });});
  return p+'-'+String(mx+1).padStart(3,'0');
}

function _openPinModal(tool){
  var titles={defect:'Add Defect',itp:'Add ITP Pin',fire:'Add Fire Pin'};
  document.getElementById('pin-sht-title').textContent=titles[tool]||'Add Pin';
  document.getElementById('pin-desc').value='';
  document.getElementById('pin-loc').value='';
  document.getElementById('pin-st').value='Open';
  document.getElementById('pin-add-ov').style.display='flex';
}

function _showPinDet(pin){
  var tl={defect:'Defect',itp:'ITP',fire:'Fire'}[pin.type]||pin.type;
  var sc=pin.status==='Closed'?'done':pin.status==='In Progress'?'progress':'open';
  document.getElementById('pin-det-body').innerHTML=
    '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px">'
    +'<div><div class="pin-rb '+pin.type+'">'+pin.ref+'</div><div style="font-size:13px;color:var(--text-secondary);margin-top:2px">'+tl+'</div></div>'
    +'<button onclick="document.getElementById(\'pin-det-ov\').style.display=\'none\'" style="width:32px;height:32px;border-radius:50%;background:var(--bg-elevated);border:none;cursor:pointer;font-size:20px;color:var(--text-secondary)">×</button>'
    +'</div>'
    +'<div class="det-lbl">Description</div><div class="det-val">'+(pin.desc||'—')+'</div>'
    +(pin.location?'<div class="det-lbl">Location</div><div class="det-val">'+pin.location+'</div>':'')
    +'<div class="det-lbl">Status</div><div class="det-val"><span class="status status-'+sc+'">'+pin.status+'</span></div>'
    +'<div class="det-lbl">Created</div><div class="det-val">'+(pin.created||'—')+'</div>'
    +'<div style="margin-top:16px"><button class="btn btn-danger" style="width:100%" onclick="dwgDelPin(\''+pin.id+'\')">Delete Pin</button></div>';
  document.getElementById('pin-det-ov').style.display='flex';
}

// ── Load / Save ────────────────────────────────────────────
async function _loadDrawings(){
  var proj=window.dbGetCurrentProject(); if(!proj) return [];
  try{
    await window.dbReady;
    var co=localStorage.getItem('hvacnexus_company_id');
    var pn=proj.code||proj.num||proj.id;
    var res=await window._supabase.from('drawings').select('data').eq('company_id',co).eq('project_num',pn).maybeSingle();
    if(res.data&&Array.isArray(res.data.data)) return res.data.data;
    if(res.data&&res.data.data) return res.data.data;
  }catch(e){console.warn('[Drawings]',e);}
  return [];
}

async function _saveDrawings(){
  var proj=window.dbGetCurrentProject(); if(!proj) return;
  try{
    var co=localStorage.getItem('hvacnexus_company_id');
    var pn=proj.code||proj.num||proj.id;
    await window.dbReady;
    await window._supabase.from('drawings').upsert({project_num:pn,company_id:co,data:_drawings},{onConflict:'project_num'});
  }catch(e){console.warn('[Drawings save]',e);}
}

// ── Render List ────────────────────────────────────────────
window.renderDrawingsPage = async function(container){
  container.innerHTML='<div class="page"><div class="spinner"></div></div>';
  _drawings=await _loadDrawings();

  var groups={};
  _drawings.forEach(function(d){
    if(d.obsolete) return;
    var g=d.discipline||'Uncategorised';
    if(!groups[g]) groups[g]=[];
    groups[g].push(d);
  });
  var keys=Object.keys(groups);

  var html='<div class="page">';
  html+='<div class="dwg-search-bar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input class="dwg-search-input" id="dwg-sq" placeholder="Search drawings…" oninput="dwgSearch()" type="search"></div>';
  html+='<div class="filter-row" id="dwg-fp"><button class="pill-tab active" onclick="dwgFilt(\'\')" data-disc="">All</button>';
  keys.forEach(function(k){html+='<button class="pill-tab" onclick="dwgFilt(\''+k+'\')" data-disc="'+k+'">'+k+'</button>';});
  html+='</div><div id="dwg-lst">';

  if(keys.length===0){
    html+='<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><p>No drawings found.<br>Add drawings in the desktop app.</p></div>';
  } else {
    keys.forEach(function(disc,i){
      var id='dg'+disc.replace(/\W+/g,'');
      var dwgs=groups[disc];
      var exp=i===0;
      html+='<div class="disc-group" data-disc="'+disc+'">'
        +'<div class="disc-hdr'+(exp?' open':'')+'" onclick="dwgToggle(\''+id+'\')" id="'+id+'h">'
        +'<div class="disc-title"><span>'+disc+'</span><span class="disc-count">'+dwgs.length+'</span></div>'
        +'<svg class="disc-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>'
        +'</div><div class="disc-body'+(exp?' open':'')+'" id="'+id+'b">';
      dwgs.forEach(function(d){
        var sc={IFR:'st-ifr',IFA:'st-ifa',IFC:'st-ifc','As-Builts':'st-ab',AB:'st-ab'}[d.status]||'st-ifr';
        var pins=(d.pins||[]).length;
        html+='<div class="dwg-row" onclick="dwgOpen(\''+d.id+'\')">'
          +'<div class="dwg-num">'+(d.num||'—')+'</div>'
          +'<div class="dwg-info"><div class="dwg-name">'+(d.name||d.title||'Untitled')+'</div>'
          +'<div class="dwg-meta"><span>Rev '+(d.rev||'—')+'</span>'+(pins>0?'<span>📍 '+pins+'</span>':'')+'</div></div>'
          +'<span class="dwg-st '+sc+'">'+(d.status||'—')+'</span></div>';
      });
      html+='</div></div>';
    });
  }
  html+='</div></div>';
  container.innerHTML=html;
};

// ── Global helpers ─────────────────────────────────────────
window.dwgToggle=function(id){var h=document.getElementById(id+'h'),b=document.getElementById(id+'b');if(h)h.classList.toggle('open');if(b)b.classList.toggle('open');};
window.dwgFilt=function(disc){document.querySelectorAll('#dwg-fp .pill-tab').forEach(function(b){b.classList.toggle('active',b.dataset.disc===disc);});document.querySelectorAll('.disc-group').forEach(function(g){g.style.display=(!disc||g.dataset.disc===disc)?'':'none';});};
window.dwgSearch=function(){var q=(document.getElementById('dwg-sq').value||'').toLowerCase();document.querySelectorAll('.dwg-row').forEach(function(r){r.style.display=r.textContent.toLowerCase().indexOf(q)!==-1?'':'none';});};

// ── Viewer ─────────────────────────────────────────────────
window.dwgOpen=function(id){
  var d=_drawings.find(function(x){return x.id===id;});
  if(!d) return;
  _cur=d; _sc=1; _tx=0; _ty=0;
  document.getElementById('vwr-num').textContent=d.num||'—';
  document.getElementById('vwr-name').textContent=d.name||d.title||'Untitled';
  document.getElementById('dwg-viewer-overlay').classList.add('open');
  dwgTool('pan');
  if(d.pdfUrl){
    document.getElementById('dwg-empty').style.display='none';
    document.getElementById('dwg-cvs').style.display='block';
    _loadPdf(d.pdfUrl);
  } else {
    document.getElementById('dwg-cvs').style.display='none';
    document.getElementById('dwg-empty').style.display='flex';
    document.getElementById('dwg-pins').innerHTML='';
  }
};

function dwgCloseViewer(){
  document.getElementById('dwg-viewer-overlay').classList.remove('open');
  _cur=null; _pdfPage=null;
  var c=document.getElementById('dwg-cvs');
  if(c){c.getContext('2d').clearRect(0,0,c.width,c.height);}
}

window.dwgTool=function(tool){
  _t=tool;
  ['pan','defect','itp','fire'].forEach(function(t){
    var b=document.getElementById('tb-'+t);
    if(b){b.className='tbtn'; if(t===tool){b.classList.add('ta'); if(tool!=='pan') b.classList.add(tool.charAt(0)+'');}}
  });
  var c=document.getElementById('dwg-cvs');
  if(c) c.classList.toggle('placing',tool!=='pan');
};

window.dwgZoom=function(f){
  var w=document.getElementById('dwg-wrap'),cx=w.clientWidth/2,cy=w.clientHeight/2;
  _tx=cx-f*(cx-_tx); _ty=cy-f*(cy-_ty); _sc*=f; _at();
};

function dwgFit(){
  if(!_pdfPage) return;
  var w=document.getElementById('dwg-wrap'),c=document.getElementById('dwg-cvs');
  _sc=1; _tx=(w.clientWidth-c.width)/2; _ty=(w.clientHeight-c.height)/2; _at();
}

function _loadPdf(url){
  if(!_pdfLoaded){
    var s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload=function(){
      pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      _pdfLoaded=true; _renderPdf(url);
    };
    document.head.appendChild(s);
  } else { _renderPdf(url); }
}

function _renderPdf(url){
  var loadingTask = pdfjsLib.getDocument({
    url: url,
    withCredentials: false,
    cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
    cMapPacked: true
  });
  loadingTask.promise.then(function(doc){
    return doc.getPage(1);
  }).then(function(page){
    _pdfPage=page;
    var w=document.getElementById('dwg-wrap');
    var vp0=page.getViewport({scale:1});
    var RENDER_SCALE = 3;
    var vp=page.getViewport({scale:RENDER_SCALE});
    var c=document.getElementById('dwg-cvs');
    c.width=vp.width; c.height=vp.height;
    var fitW=w.clientWidth*0.95;
    var fitH=w.clientHeight*0.95;
    var fitScale=Math.min(fitW/vp.width, fitH/vp.height);
    var cssW=vp.width*fitScale;
    var cssH=vp.height*fitScale;
    c.style.width=cssW+'px';
    c.style.height=cssH+'px';
    _sc=1;
    _tx=(w.clientWidth-cssW)/2;
    _ty=(w.clientHeight-cssH)/2;
    _at();
    page.render({canvasContext:c.getContext('2d'),viewport:vp});
    _rp();
  }).catch(function(err){
    console.error('[PDF] error:', err);
    var empty = document.getElementById('dwg-empty');
    var c = document.getElementById('dwg-cvs');
    if(empty) {
      empty.style.display='flex';
      empty.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:48px;height:48px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><p style="font-size:13px;text-align:center;padding:0 20px">Could not load PDF.<br><span style="font-size:11px;opacity:0.6">'+(err&&err.message?err.message:'Unknown error')+'</span></p>';
    }
    if(c) c.style.display='none';
  });
}

window.dwgSavePin=function(){
  if(!_cur||!_pc) return;
  var desc=document.getElementById('pin-desc').value.trim();
  if(!desc){alert('Please enter a description.');return;}
  var pin={id:'pin-'+Date.now(),type:_t,ref:_nr(_t),x:_pc.x,y:_pc.y,desc:desc,location:document.getElementById('pin-loc').value.trim(),status:document.getElementById('pin-st').value,created:new Date().toISOString().split('T')[0]};
  if(!_cur.pins) _cur.pins=[];
  _cur.pins.push(pin);
  _saveDrawings();
  document.getElementById('pin-add-ov').style.display='none';
  _pc=null; dwgTool('pan'); _rp();
};

window.dwgDelPin=function(id){
  if(!_cur) return;
  _cur.pins=(_cur.pins||[]).filter(function(p){return p.id!==id;});
  _saveDrawings();
  document.getElementById('pin-det-ov').style.display='none';
  _rp();
};

// Wire button events after all functions defined
document.getElementById('vwr-back').onclick = function(){ 
  document.getElementById('dwg-viewer-overlay').classList.remove('open');
  _cur=null; _pdfPage=null;
  var c=document.getElementById('dwg-cvs');
  if(c){c.getContext('2d').clearRect(0,0,c.width,c.height);}
};
document.getElementById('vwr-fit').onclick = function(){
  if(!_pdfPage) return;
  var w=document.getElementById('dwg-wrap'),c=document.getElementById('dwg-cvs');
  var cw=c.offsetWidth||c.width, ch=c.offsetHeight||c.height;
  _sc=1; _tx=(w.clientWidth-cw)/2; _ty=(w.clientHeight-ch)/2; _at();
};
document.getElementById('pin-save').onclick = function(){ window.dwgSavePin(); };
document.getElementById('pin-cancel').onclick = function(){ document.getElementById('pin-add-ov').style.display='none'; _pc=null; };
document.getElementById('pin-add-ov').onclick = function(e){ if(e.target===this){ this.style.display='none'; _pc=null; } };
document.getElementById('pin-det-ov').onclick = function(e){ if(e.target===this) this.style.display='none'; };

})();
