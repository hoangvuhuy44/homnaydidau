
const db = window.supabase.createClient(
  "https://trzalycuzbvczeuytvfz.supabase.co",
  "sb_publishable_gfUe_uc0Po71-EzmXxyVDg_c-xV6tZc"
);

window.loadCoffeeData = async function () {
  const [cafeResult, menuResult] = await Promise.all([
    db.from("cafes").select("*"),
    db.from("menu_items").select("*")
  ]);

  if (cafeResult.error) throw cafeResult.error;
  if (menuResult.error) throw menuResult.error;

  const cafes = cafeResult.data.map(c => ({
    id: c.id,
    name: c.name,
    address: c.address,
    district: c.district,
    source: c.source_url,
    addressCheckedAt: c.address_checked_at
  }));

  const menus = cafes.map(cafe => ({
    cafeId: cafe.id,
    items: menuResult.data
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
      districts: [...new Set(cafes.map(c => c.district))]
    },
    {
      schemaVersion: 1,
      reviewAfterDays: 180,
      cafes: menus
    }
  ];
};
