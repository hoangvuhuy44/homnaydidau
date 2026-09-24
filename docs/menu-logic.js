const MenuLogic={
 validDate(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;},
 safeUrl(value){try{return ['https:','http:'].includes(new URL(value).protocol);}catch{return false;}},
 fresh(source,days=180,now=new Date()){
  if(!source||!this.validDate(source.checkedAt))return false;
  const today=Date.parse(now.toISOString().slice(0,10)+'T00:00:00Z'),checked=Date.parse(source.checkedAt+'T00:00:00Z');
  if(checked>today||today-checked>days*86400000)return false;
  // Re-reading an old announcement does not make the announcement current.
  if(source.publishedAt){if(!this.validDate(source.publishedAt))return false;const published=Date.parse(source.publishedAt+'T00:00:00Z');if(published>today||today-published>days*86400000)return false;}
  return true;
 },
 trustedSource(source){
  if(!source||source.scope!=='branch'||!['official_menu','official_statement','owner_confirmation','menu_photo'].includes(source.kind))return false;
  if(source.kind==='menu_photo')return this.safeUrl(source.url)||(typeof source.evidenceId==='string'&&/^photo-\d{8}-[a-z0-9-]+$/.test(source.evidenceId));
  return this.safeUrl(source.url);
 },
 eligible(menu,type='all',days=180,now=new Date()){
  return (menu?.items||[]).filter(item=>item.status==='published'&&(type==='all'||item.type===type)&&this.trustedSource(item.source)&&this.fresh(item.source,days,now)&&(!item.availableUntil||(this.validDate(item.availableUntil)&&item.availableUntil>=now.toISOString().slice(0,10))));
 },
 highlight(item,days=180,now=new Date()){return ['signature','house_pick'].includes(item.highlight)&&this.trustedSource(item.highlightSource)&&this.fresh(item.highlightSource,days,now)?item.highlight:'none';},
 choose(menu,type,previous,preferHighlights,days=180,now=new Date()){
  let pool=this.eligible(menu,type,days,now);if(preferHighlights){const signatures=pool.filter(i=>this.highlight(i,days,now)==='signature');const picks=pool.filter(i=>this.highlight(i,days,now)==='house_pick');if(signatures.length)pool=signatures;else if(picks.length)pool=picks;}
  const alternatives=pool.filter(i=>i.id!==previous?.id);if(alternatives.length)pool=alternatives;return pool[Math.floor(Math.random()*pool.length)]||null;
 }
};
if(typeof module!=='undefined')module.exports=MenuLogic;
