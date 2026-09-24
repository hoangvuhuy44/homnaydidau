/* Shared selection rules, also exercised by the regression tests. */
const CafeLogic={
 normalize:value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase(),
 eligible:(cafes,districts)=>cafes.filter(c=>!districts.size||districts.has(c.district)),
 choose(items,previous){const alternatives=items.filter(item=>item!==previous);const pool=alternatives.length?alternatives:items;return pool[Math.floor(Math.random()*pool.length)]},
 search(cafes,query){const needle=this.normalize(query.trim());return cafes.filter(c=>this.normalize(c.name+' '+c.address+' '+c.district).includes(needle))},
 maps:cafe=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(cafe.name+' '+cafe.address)
};
if(typeof module!=='undefined')module.exports=CafeLogic;
