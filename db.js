/* ============================================================
   HVAC NEXUS MOBILE — db.js
   Supabase connection — same backend as desktop app
   ============================================================ */

(function() {
  'use strict';

  var SUPABASE_URL = 'https://qbsjrccrgkbevncvxbio.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFic2pyY2NyZ2tiZXZuY3Z4YmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMjU5MjIsImV4cCI6MjA5MDYwMTkyMn0.Y8CYH3QXjEVsYIyXEiUM_imjNpDokRE1h9iNmRh_JoA';

  // ── dbReady promise ────────────────────────────────────────
  // Resolves once Supabase client is initialised with JWT.
  // All modules must await dbReady before any DB call.
  window.dbReady = new Promise(function(resolve, reject) {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = function() {
      try {
        var client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false
          }
        });
        window._supabase = client;

        // Restore session if exists
        client.auth.getSession().then(function(res) {
          if (res.data && res.data.session) {
            window._session = res.data.session;
          }
          resolve(client);
        }).catch(function(err) {
          console.warn('[db] getSession error:', err);
          resolve(client); // resolve anyway — let modules handle auth state
        });

        // Listen for auth changes
        client.auth.onAuthStateChange(function(event, session) {
          window._session = session;
          if (event === 'SIGNED_OUT') {
            window.location.href = 'login.html';
          }
        });

      } catch(e) {
        reject(e);
      }
    };
    script.onerror = function() {
      reject(new Error('Failed to load Supabase JS'));
    };
    document.head.appendChild(script);
  });

  // ── Helper: get company_id from session ───────────────────
  window.dbGetCompanyId = function() {
    try {
      var meta = window._session && window._session.user && window._session.user.user_metadata;
      return meta && meta.company_id ? meta.company_id : null;
    } catch(e) { return null; }
  };

  // ── Helper: get current project from localStorage ─────────
  window.dbGetCurrentProject = function() {
    try {
      return JSON.parse(localStorage.getItem('hvacnexus_current_project') || 'null');
    } catch(e) { return null; }
  };

  // ── Helper: get current user from localStorage ────────────
  window.dbGetCurrentUser = function() {
    try {
      return JSON.parse(localStorage.getItem('hvacnexus_current_user') || 'null');
    } catch(e) { return null; }
  };

  // ── Helper: offline-aware upsert ──────────────────────────
  // Saves to Supabase if online, queues if offline.
  window.dbSafeUpsert = async function(table, data) {
    if (!navigator.onLine) {
      if (window.queueSync) {
        window.queueSync({ table: table, action: 'upsert', data: data });
      }
      return { data: data, error: null, queued: true };
    }
    try {
      await window.dbReady;
      var res = await window._supabase.from(table).upsert(data);
      return res;
    } catch(e) {
      return { data: null, error: e };
    }
  };

  // ── Helper: offline-aware delete ──────────────────────────
  window.dbSafeDelete = async function(table, id) {
    if (!navigator.onLine) {
      if (window.queueSync) {
        window.queueSync({ table: table, action: 'delete', id: id });
      }
      return { error: null, queued: true };
    }
    try {
      await window.dbReady;
      var res = await window._supabase.from(table).delete().eq('id', id);
      return res;
    } catch(e) {
      return { error: e };
    }
  };

})();
