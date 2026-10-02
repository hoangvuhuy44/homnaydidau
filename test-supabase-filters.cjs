const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const CafeLogic = require('./docs/cafe-logic');
const loader = fs.readFileSync('docs/supabase-data.js', 'utf8');
const app = fs.readFileSync('docs/app.js', 'utf8');

async function load({ live = false, failClaims = false } = {}) {
  const rows = {
    cafes: [{ id: 'cafe-028', name: 'Aimētoi', district: 'Long Biên' }],
    menu_items: [],
    cafe_features: [{ code: 'work', category: 'good_for' }],
    cafe_feature_claims: Array.from({ length: 501 }, (_, id) => ({ id, cafe_id: 'cafe-028', feature_code: 'work', is_present: id === 500 }))
  };
  let credentials;
  const db = { from(table) {
    let columns = '*', order, start = 0, end = 999;
    return {
      select(value) { columns = value; return this; },
      order(value) { order = value; return this; },
      range(a, b) { start = a; end = b; return this; },
      async then(resolve, reject) {
        try {
          if (failClaims && table === 'cafe_feature_claims') return resolve({ data: null, error: new Error('Feature API unavailable') });
          if (!live) return resolve({ data: rows[table].slice(start, end + 1), error: null });
          const params = new URLSearchParams({ select: columns, offset: start, limit: end - start + 1 });
          if (order) params.set('order', order + '.asc');
          const response = await fetch(credentials.url + '/rest/v1/' + table + '?' + params, { headers: { apikey: credentials.key } });
          const data = await response.json();
          resolve(response.ok ? { data, error: null } : { data: null, error: data });
        } catch (error) { reject(error); }
      }
    };
  } };
  const context = vm.createContext({ console: { warn() {} }, window: { supabase: { createClient(url, key) { credentials = { url, key }; return db; } } } });
  vm.runInContext(loader, context);
  return context.window.loadCoffeeData();
}

function eligible(data, districts = [], features = []) {
  const context = vm.createContext({ CafeLogic, cafes: data.cafes, selectedDistricts: new Set(districts), selectedFeatures: new Set(features) });
  vm.runInContext(app.match(/^const eligible=.*$/m)[0], context);
  return vm.runInContext('eligible()', context);
}

(async () => {
  const [data] = await load();
  assert.equal(data.features.length, 1);
  assert.equal(eligible(data, ['Long Biên'], ['work']).length, 1, 'Claim beyond first page must be loaded');
  assert.equal(eligible(data, ['Hoàn Kiếm'], ['work']).length, 0);
  assert.equal(eligible(data, [], ['work', 'wifi']).length, 0, 'All selected features must match');
  const [failed] = await load({ failClaims: true });
  assert(failed.featureError);
  assert.equal(eligible(failed).length, 1, 'Feature failure must preserve district selection');
  if (process.argv.includes('--live')) {
    const [live] = await load({ live: true });
    assert(!live.featureError);
    assert.equal(live.cafes.length, 50);
    assert.equal(live.features.length, 11);
    const matches = eligible(live, ['Long Biên'], ['work', 'wifi']);
    assert.equal(matches.length, 1);
    assert.equal(matches[0].id, 'cafe-028');
    assert.equal(eligible(live, ['Hoàn Kiếm'], ['work', 'wifi']).length, 0);
    console.log('PASS live: public API returns 50 cafés and 11 features; work + wifi + Long Biên selects Aimētoi.');
  }
  console.log('PASS: claim pagination, combined district/features, all-tag matching and feature API failure.');
})().catch(error => { console.error(error); process.exitCode = 1; });
