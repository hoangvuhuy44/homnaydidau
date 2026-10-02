
const db = window.supabase.createClient(
  "https://trzalycuzbvczeuytvfz.supabase.co",
  "sb_publishable_gfUe_uc0Po71-EzmXxyVDg_c-xV6tZc"
);

async function loadAllRows(table, columns = "*", order = "id") {
  const items = [];
  const pageSize = 500;
  for (let start = 0; ; start += pageSize) {
    const { data, error } = await db.from(table)
      .select(columns).order(order).range(start, start + pageSize - 1);
    if (error) throw error;
    items.push(...data);
    if (data.length < pageSize) return items;
  }
}

window.loadCoffeeData = async function () {
  const [cafeResult, menuItems, featureResult, claimResult] = await Promise.all([
    db.from("cafes").select("*"),
    loadAllRows("menu_items"),
    db.from("cafe_features").select("code,category,label_vi,label_en,sort_order").order("sort_order"),
    loadAllRows("cafe_feature_claims", "cafe_id,feature_code,is_present").then(
      data => ({ data, error: null }),
      error => ({ data: [], error })
    )
  ]);

  if (cafeResult.error) throw cafeResult.error;
  // A temporary feature API failure should not stop the original roulette.
  const featureError = featureResult.error || claimResult.error;
  if (featureError) console.warn("Café feature filters unavailable:", featureError);
  const claims = featureError ? [] : claimResult.data;
  const features = featureError ? [] : featureResult.data;
  const tagsByCafe = new Map();
  for (const claim of claims) {
    if (!claim.is_present) continue;
    if (!tagsByCafe.has(claim.cafe_id)) tagsByCafe.set(claim.cafe_id, []);
    tagsByCafe.get(claim.cafe_id).push(claim.feature_code);
  }

  const cafes = cafeResult.data.map(c => ({
    id: c.id,
    name: c.name,
    address: c.address,
    district: c.district,
    source: c.source_url,
    addressCheckedAt: c.address_checked_at,
    features: tagsByCafe.get(c.id) || []
  }));

  const menus = cafes.map(cafe => ({
    cafeId: cafe.id,
    items: menuItems
      .filter(item => item.cafe_id === cafe.id)
      .map(item => ({
        id: item.id,
        name: {
          vi: item.name_vi,
          en: item.name_en || item.name_vi
        },
        type: item.type,
        priceVnd: item.price_vnd,
        status: item.status,
        source: item.source,
        highlight: item.highlight,
        highlightSource: item.highlight_source,
        priceNote: item.price_note,
        availableUntil: item.available_until
      }))
  }));

  return [
    {
      cafes,
      features: features.filter(feature => claims.some(claim => claim.is_present && claim.feature_code === feature.code)),
      featureError: !!featureError,
      districts: [...new Set(cafes.map(c => c.district))]
    },
    {
      schemaVersion: 1,
      reviewAfterDays: 180,
      cafes: menus
    }
  ];
};
