/**
 * GTA VI trial petition: Google Apps Script backend.
 *
 * Stores signatures in the Google Sheet this script is attached to.
 *   GET  ?action=stats  -> { count, pledges, recent: [{name, country, ts}] }
 *   POST (JSON body)    -> { ok, count } or { ok: false, error }
 *
 * Setup: see README.md, section "Connect the signature backend".
 */

const SHEET_NAME = 'Signatures';
const HEADERS = ['Timestamp', 'Name', 'Email', 'Country', 'Pledge to buy', 'Platform', 'Comment', 'Wants updates'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(v, max) {
  // Strip leading characters that make Sheets treat input as a formula.
  return String(v == null ? '' : v).trim().slice(0, max).replace(/^[=+\-@]+/, '');
}

function shortName_(n) {
  const parts = String(n).trim().split(/\s+/);
  return parts[0] + (parts[1] ? ' ' + parts[1].charAt(0).toUpperCase() + '.' : '');
}

function stats_() {
  const sh = sheet_();
  const rows = Math.max(0, sh.getLastRow() - 1);
  let recent = [];
  let pledges = 0;
  if (rows > 0) {
    const data = sh.getRange(2, 1, rows, 5).getValues();
    pledges = data.filter(function (r) { return r[4] === true || r[4] === 'TRUE'; }).length;
    recent = data.slice(-5).reverse().map(function (r) {
      return { name: shortName_(r[1]), country: r[3], ts: new Date(r[0]).toISOString() };
    });
  }
  return { count: rows, pledges: pledges, recent: recent };
}

function doGet() {
  return json_(stats_());
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    if (body.website) return json_({ ok: true, count: stats_().count }); // honeypot

    const name = clean_(body.name, 60);
    const email = clean_(body.email, 120).toLowerCase();
    if (name.length < 2) return json_({ ok: false, error: 'Add your name so the signature counts.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json_({ ok: false, error: 'Check your email address.' });

    const sh = sheet_();
    if (sh.getLastRow() > 1) {
      const dup = sh.getRange(2, 3, sh.getLastRow() - 1, 1)
        .createTextFinder(email).matchEntireCell(true).findNext();
      if (dup) return json_({ ok: false, error: "You've already signed with this email." });
    }

    sh.appendRow([
      new Date(),
      name,
      email,
      clean_(body.country, 40),
      body.pledge === true,
      clean_(body.platform, 40),
      clean_(body.comment, 280),
      body.updates === true
    ]);
    return json_({ ok: true, count: sh.getLastRow() - 1 });
  } catch (err) {
    return json_({ ok: false, error: 'Server is busy. Try again in a moment.' });
  } finally {
    lock.releaseLock();
  }
}
