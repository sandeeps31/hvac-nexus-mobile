# HVAC Nexus Mobile

Native-style PWA for HVAC project management — field use on phone and tablet.

## Testing URL
[app.hvacnex.com.au](https://app.hvacnex.com.au)

## Stack
- Vanilla HTML / CSS / JS
- Supabase backend (shared with desktop app)
- PWA with offline support + sync queue
- Capacitor wrapper for iOS App Store + Google Play (future)

## Modules
| Module | Group | Mode |
|---|---|---|
| Drawings | Technical | Edit |
| Equipment Schedules | Technical | View |
| Tech Submissions | Technical | View |
| Specifications | Technical | View |
| ITPs | Quality | Edit |
| Defects | Quality | Edit |
| Passive Fire | Quality | View |
| NCR | Quality | View |
| Pre-Cx Checklist | Commissioning | Edit |
| Commissioning Tracker | Commissioning | Edit |
| Procurement Schedule | Procurement | View |
| Purchase Orders | Procurement | View |

## Dev Notes
- `db.js` — Supabase client, shared credentials with desktop
- `sw.js` — Service worker, offline caching, background sync
- `app.js` — Routing, navigation, sync queue
- `app.css` — Mobile-first styles, phone + tablet responsive
- All offline writes go through `dbSafeUpsert()` / `dbSafeDelete()` which queue automatically
