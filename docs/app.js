const drinks=[{name:'Cà phê sữa đá',description:'Đậm vị cà phê, ngọt dịu sữa đặc, thêm đá cho một ngày Hà Nội.',type:'coffee'},{name:'Bạc xỉu',description:'Nhiều sữa hơn, nhẹ vị cà phê. Hợp khi bạn muốn chút ngọt ngào.',type:'coffee'},{name:'Americano đá',description:'Một lựa chọn đơn giản, không sữa, không quá cầu kỳ.',type:'coffee'},{name:'Latte',description:'Cà phê espresso cùng sữa, êm và dễ uống.',type:'coffee'},{name:'Cappuccino',description:'Espresso, sữa nóng và lớp bọt sữa mịn.',type:'coffee'},{name:'Cà phê đen đá',description:'Gọn gàng, đậm đà. Thêm đường theo khẩu vị của bạn.',type:'coffee'},{name:'Matcha latte',description:'Vị trà xanh cùng sữa. Một chút đổi vị cho buổi đi cà phê.',type:'other'},{name:'Trà đào',description:'Một món trà trái cây tươi mát, dễ nhâm nhi.',type:'other'},{name:'Chocolate',description:'Vị cacao và sữa cho một buổi nghỉ ngọt ngào.',type:'other'},{name:'Trà chanh',description:'Chua nhẹ, thanh mát. Hỏi quán mức đường bạn thích.',type:'other'}];
const englishDrinks=[['Vietnamese iced milk coffee','Bold coffee with sweet condensed milk, served over ice.'],['Bạc xỉu · milk coffee','More milk, a little coffee. A gentle, sweet choice.'],['Iced Americano','Espresso and water over ice. Simple and refreshing.'],['Latte','Espresso with milk, smooth and easy to sip.'],['Cappuccino','Espresso, steamed milk and a soft layer of foam.'],['Vietnamese iced black coffee','Strong and straightforward. Add sugar to your taste.'],['Matcha latte','Green tea with milk for a change of pace.'],['Peach tea','A fruity, refreshing tea to sip slowly.'],['Chocolate','Cocoa and milk for a sweet little break.'],['Lemon tea','Light and tangy. Ask for your preferred sweetness.']];
let cafes=[],districts=[],selectedDistricts=new Set(),currentCafe=null,currentDrink=null,busy=false,loaded=false,failed=false,menuFailed=false,menuDatabase={cafes:[],reviewAfterDays:180},featureOptions=[],selectedFeatures=new Set(),featureLoadError=false;
const el=id=>document.getElementById(id),choose=CafeLogic.choose;
const eligible=()=>CafeLogic.eligible(cafes,selectedDistricts).filter(c=>[...selectedFeatures].every(code=>c.features?.includes(code)));
const menuFor=cafe=>menuDatabase.cafes.find(m=>m.cafeId===cafe?.id);
function chooseDrink(){
 const menu=menuFor(currentCafe),type=el('drinkType').value;
 const item=MenuLogic.choose(menu,type,currentDrink,el('preferHighlights').checked,menuDatabase.reviewAfterDays);
 if(item)return item;
 // A known menu with no matching items must not receive an invented substitute.
 if(menu)return null;
 return choose(drinks.filter(d=>type==='all'||d.type===type),currentDrink);
}
function priceText(item){return item.priceVnd===null?t('priceUnknown'):new Intl.NumberFormat(language==='vi'?'vi-VN':'en-US',{style:'currency',currency:'VND',maximumFractionDigits:0}).format(item.priceVnd);}
function renderDrink(){
 el('drinkEvidence').replaceChildren();
 if(!currentDrink){el('drinkName').textContent=t('noMatchingDrink');el('drinkDescription').textContent=t('noMatchingHelp');el('drinkDisclaimer').textContent=t('menuCaution');return;}
 if(currentDrink.id){
  el('drinkName').textContent=currentDrink.name[language]||currentDrink.name.vi;
  const highlight=MenuLogic.highlight(currentDrink,menuDatabase.reviewAfterDays);
  el('drinkDescription').textContent=priceText(currentDrink)+(highlight!=='none'?' · '+t(highlight):'');
  const source=MenuLogic.safeUrl(currentDrink.source.url)?document.createElement('a'):document.createElement('span');if(source.tagName==='A'){source.href=currentDrink.source.url;source.target='_blank';source.rel='noopener';}source.textContent=t('menuSource');
  el('drinkEvidence').append(document.createTextNode(t('checkedOn')+' '+currentDrink.source.checkedAt+' · '),source);
  el('drinkDisclaimer').textContent=t('menuCaution')+' '+(currentDrink.priceNote?.[language]||'');
 }else{const en=englishDrinks[drinks.indexOf(currentDrink)];el('drinkName').textContent=language==='en'?en[0]:currentDrink.name;el('drinkDescription').textContent=language==='en'?en[1]:currentDrink.description;el('drinkEvidence').textContent=t(menuFailed?'menuLoadError':'genericIdea');el('drinkDisclaimer').textContent=t('disclaimer');}
}
function pickDrink(){if(!currentCafe||busy)return;currentDrink=chooseDrink();renderDrink();}
function renderMenu(){
 const menu=menuFor(currentCafe),items=MenuLogic.eligible(menu,'all',menuDatabase.reviewAfterDays);
 el('menuSummary').textContent=items.length?t('viewMenu')+' ('+items.length+')':t('menuMissing');
 el('menuNote').textContent=menuFailed?t('menuLoadError'):items.length?t('partialMenu'):menu?.items.length?t('menuStale'):t('menuMissingHelp');
 el('menuItems').replaceChildren();
 for(const item of items){const li=document.createElement('li'),name=document.createElement('span'),price=document.createElement('span');name.textContent=item.name[language]||item.name.vi;price.textContent=priceText(item);const line=document.createElement('div');line.className='menu-item-line';line.append(name,price);const note=document.createElement('p');note.className='small';const highlight=MenuLogic.highlight(item,menuDatabase.reviewAfterDays);note.textContent=(highlight==='none'?'':t(highlight)+' · ')+t('checkedOn')+' '+item.source.checkedAt+' · ';const source=MenuLogic.safeUrl(item.source.url)?document.createElement('a'):document.createElement('span');if(source.tagName==='A'){source.href=item.source.url;source.target='_blank';source.rel='noopener';}source.textContent=t('menuSource');note.append(source);li.append(line,note);el('menuItems').append(li);}
 el('menuCorrection').textContent=t('menuCorrection');el('menuCorrection').href='mailto:hoang.vuhuy44@gmail.com?subject='+encodeURIComponent('Menu correction: '+(currentCafe?.name||''))+'&body='+encodeURIComponent((currentCafe?.name||'')+'\n'+(currentCafe?.address||'')+'\n\n'+t('correctionPrompt'));
}

function renderCafe(){el('ticket').hidden=!currentCafe;el('cafeFeatures').replaceChildren();if(!currentCafe){el('cafe').textContent='';el('cafeAddress').textContent='';el('maps').removeAttribute('href');el('maps').hidden=true;return;}el('cafe').textContent=currentCafe.name;el('cafeAddress').textContent=currentCafe.address+' · '+t('area')+': '+currentCafe.district;el('number').textContent='HÀ NỘI / '+currentCafe.id.slice(-3);el('maps').href=CafeLogic.maps(currentCafe);el('maps').hidden=busy;appendFeatureChips(el('cafeFeatures'),currentCafe);renderDrink();renderMenu();}
function setTheme(theme){document.documentElement.dataset.theme=theme;el('themeToggle').textContent=t(theme==='dark'?'light':'dark');el('themeToggle').setAttribute('aria-pressed',String(theme==='dark'));el('themeToggle').setAttribute('aria-label',t(theme==='dark'?'lightLabel':'darkLabel'));try{localStorage.setItem('coffee-theme',theme)}catch{}}
let initialTheme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';try{const saved=localStorage.getItem('coffee-theme');if(['light','dark'].includes(saved))initialTheme=saved}catch{}setTheme(initialTheme);el('themeToggle').addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
function syncControls(){const pool=eligible();el('shuffle').disabled=busy||!pool.length;el('reroll').disabled=busy||!currentCafe;el('drinkType').disabled=busy||!pool.length;el('drinkOptions').disabled=el('drinkType').disabled;el('drinkSummary').setAttribute('aria-disabled',String(el('drinkType').disabled));el('drinkSummary').textContent=t({all:'allDrinks',coffee:'coffee',other:'other'}[el('drinkType').value]);el('districtOptions').disabled=busy||!loaded;el('clearDistricts').disabled=busy||!loaded;el('language').disabled=busy;el('preferHighlights').disabled=busy;el('maps').hidden=busy||!currentCafe;el('eligibleCount').textContent=loaded?pool.length+' '+t('count')+(pool.length===1?' · '+t('one'):''):'';el('districtSummary').textContent=selectedDistricts.size?[...selectedDistricts].join(', '):t('allDistricts');el('spinStatus').textContent=busy?t('spinning'):failed?t('loadError'):!loaded?t('loading'):!pool.length?t('empty'):currentCafe?t('selected')+currentCafe.name:t('ready');el('featureSummary').textContent=selectedFeatures.size?[...selectedFeatures].map(featureLabel).join(', '):t(!loaded?'loading':featureLoadError?'featureLoadError':availableFeatures().length?'allFeatures':'featureEmpty');el('clearFeatures').disabled=busy||!selectedFeatures.size;el('featureOptions').querySelectorAll('input').forEach(input=>input.disabled=busy);el('featureError').hidden=!featureLoadError;el('emptyState').hidden=!loaded||!!pool.length;el('reelWindow').hidden=!pool.length;}
function renderDistricts(){el('districtOptions').replaceChildren();districts.forEach(district=>{const label=document.createElement('label'),input=document.createElement('input'),span=document.createElement('span');input.type='checkbox';input.value=district;input.checked=selectedDistricts.has(district);input.addEventListener('change',()=>{if(busy)return;if(input.checked)selectedDistricts.add(district);else selectedDistricts.delete(district);applyDistrictFilter();});span.textContent=district+' ('+cafes.filter(c=>c.district===district).length+')';label.append(input,span);el('districtOptions').append(label);});}
let catalogExpanded=false;
function renderCatalog(){const matches=CafeLogic.search(eligible(),el('catalogSearch').value);el('catalogGrid').replaceChildren();const query=el('catalogSearch').value.trim();const visible=query||catalogExpanded?matches:matches.slice(0,3);el('catalogCount').textContent=loaded?visible.length+' / '+matches.length+' '+t('shown'):'';el('catalogMore').hidden=!!query||matches.length<=3;el('catalogMore').textContent=t(catalogExpanded?'showLess':'showMore');el('catalogMore').setAttribute('aria-expanded',String(catalogExpanded));el('catalogEmpty').hidden=!loaded||!!matches.length;el('catalogEmpty').textContent=eligible().length?t('noSearch'):selectedFeatures.size?t('noFeatureMatch'):t('empty');visible.forEach(cafe=>{const card=document.createElement('article');card.className='catalog-card';const tag=document.createElement('p');tag.className='eyebrow';tag.textContent=cafe.district;const title=document.createElement('h3');title.textContent=cafe.name;const address=document.createElement('p');address.className='catalog-address';address.textContent=cafe.address;const actions=document.createElement('div');actions.className='catalog-actions';const button=document.createElement('button');button.className='secondary';button.textContent=t(cafe===currentCafe?'chosen':'choose');button.setAttribute('aria-label',t('choose')+': '+cafe.name);button.setAttribute('aria-pressed',String(cafe===currentCafe));button.disabled=busy;button.addEventListener('click',()=>selectCafe(cafe));const maps=document.createElement('a');maps.href=CafeLogic.maps(cafe);maps.target='_blank';maps.rel='noopener';maps.textContent=t('maps');maps.setAttribute('aria-label',t('maps')+': '+cafe.name);actions.append(button,maps);const menuStatus=document.createElement('p');menuStatus.className='menu-status';const checked=MenuLogic.eligible(menuFor(cafe),'all',menuDatabase.reviewAfterDays).length;menuStatus.textContent=checked?checked+' '+t('checkedItems'):t('menuMissing');const chips=document.createElement('div');chips.className='feature-chips';appendFeatureChips(chips,cafe);card.append(tag,title,address,chips,menuStatus,actions);el('catalogGrid').append(card);});}
const mapAllSrc='https://www.google.com/maps/d/u/0/embed?mid=1HD7O0I7fkZkIFJigLAGjGEvOkkUncAE&ehbc=2E312F&noprof=1&refresh=20260925-1024';
function focusMap(cafe){
 const map=el('collectionMap');
 map.src='https://www.google.com/maps?q='+encodeURIComponent(cafe.name+' '+cafe.address)+'&output=embed&z=17';
 map.title=(language==='en'?'Map of ':'Bản đồ quán ')+cafe.name;
 el('mapCafeName').textContent=cafe.name;
 el('mapCafeAddress').textContent=cafe.address;
 el('mapSelection').hidden=false;
}
el('mapReset').addEventListener('click',()=>{
 el('collectionMap').src=mapAllSrc;
 el('collectionMap').title=language==='en'?'Map of Hanoi cafés':'Bản đồ các quán cà phê Hà Nội';
 el('mapSelection').hidden=true;
});
function selectCafe(cafe){if(busy||!eligible().includes(cafe))return;currentCafe=cafe;pickDrink();renderCafe();focusMap(cafe);restReel();syncControls();renderCatalog();el('ticket').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});el('cafe').focus({preventScroll:true});}
function featureLabel(code){const feature=featureOptions.find(item=>item.code===code);return feature?.[language==='en'?'label_en':'label_vi']||code;}
function appendFeatureChips(target,cafe){for(const code of cafe.features||[]){const chip=document.createElement('span');chip.className='feature-chip';chip.textContent=featureLabel(code);target.append(chip);}}
function availableFeatures(){return featureOptions.filter(f=>cafes.some(c=>c.features?.includes(f.code)));}
function renderFeatures(){
 const container=el('featureOptions');container.replaceChildren();
 const available=availableFeatures();
 el('featureFilter').hidden=false;
 if(!available.length){
  const message=document.createElement('p');message.className='small';
  message.textContent=t(featureLoadError?'featureLoadError':'featureEmpty');
  container.append(message);
 }
 // Accept the database category codes and the original frontend codes.
 const categories=[['Purpose',['good_for','purpose']],['Amenity',['practical','amenity']],['Atmosphere',['space','atmosphere']],['Coffee',['coffee_vibe','coffee']]];
 for(const [title,codes] of categories){
  const group=available.filter(f=>codes.includes(f.category));if(!group.length)continue;
  const fieldset=document.createElement('fieldset'),legend=document.createElement('legend');
  legend.textContent=t('featureGroup'+title);fieldset.append(legend);
  for(const feature of group){
   const label=document.createElement('label'),input=document.createElement('input'),span=document.createElement('span');
   input.type='checkbox';input.value=feature.code;input.checked=selectedFeatures.has(feature.code);input.disabled=busy;
   input.addEventListener('change',()=>{if(input.checked)selectedFeatures.add(feature.code);else selectedFeatures.delete(feature.code);applyDistrictFilter();});
   span.textContent=featureLabel(feature.code);label.append(input,span);fieldset.append(label);
  }
  container.append(fieldset);
 }
}
function applyDistrictFilter(){if(busy)return;const pool=eligible();if(!pool.includes(currentCafe)){currentCafe=choose(pool)||null;currentDrink=null;if(currentCafe)pickDrink();}renderCafe();syncControls();restReel();renderCatalog();}
function clearDistricts(){if(busy)return;selectedDistricts.clear();renderDistricts();applyDistrictFilter();}
el('clearFeatures').addEventListener('click',()=>{selectedFeatures.clear();renderFeatures();applyDistrictFilter();});el('clearDistricts').addEventListener('click',clearDistricts);el('resetDistricts').addEventListener('click',clearDistricts);el('catalogSearch').addEventListener('input',renderCatalog);el('catalogMore').addEventListener('click',()=>{catalogExpanded=!catalogExpanded;renderCatalog();});
for(const name of ['district','feature','drink']){el(name+'Dropdown').addEventListener('keydown',event=>{if(event.key==='Escape'){el(name+'Dropdown').open=false;el(name+'Summary').focus();}});}
document.addEventListener('click',event=>{for(const name of ['district','feature','drink']){if(!el(name+'Dropdown').contains(event.target))el(name+'Dropdown').open=false;}});
let reelAnimation=null;
function makeReel(winner,index){const track=el('reelTrack'),pool=eligible();track.replaceChildren();for(let i=0;i<index+4;i++){const card=document.createElement('div');card.className='reel-card';const tag=document.createElement('span');tag.textContent='HÀ NỘI / '+String(i+1).padStart(2,'0');const name=document.createElement('strong');name.textContent=(i===index?winner:choose(pool)).name;card.append(tag,name);track.append(card);}return track;}
function reelOffset(index){const card=el('reelTrack').children[0];const width=card?.getBoundingClientRect?.().width||220;const gap=parseFloat(getComputedStyle(el('reelTrack')).gap)||12;return el('reelWindow').clientWidth/2-index*(width+gap)-width/2;}
function restReel(){if(busy)return;if(reelAnimation)reelAnimation.cancel();el('reelTrack').replaceChildren();if(!currentCafe)return;const track=makeReel(currentCafe,2);track.style.transform=`translateX(${reelOffset(2)}px)`;track.children[2].classList.add('winner');}
async function spinReel(winner){const index=30,track=makeReel(winner,index);if(reelAnimation)reelAnimation.cancel();const start=reelOffset(2),end=reelOffset(index);track.style.transform=`translateX(${end}px)`;if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&track.animate){reelAnimation=track.animate([{transform:`translateX(${start}px)`},{transform:`translateX(${end}px)`}],{duration:3800,easing:'cubic-bezier(.12,.72,.12,1)',fill:'none'});await reelAnimation.finished.catch(()=>{});}track.style.transform=`translateX(${reelOffset(index)}px)`;track.children[index].classList.add('winner');}
window.addEventListener('resize',restReel);
async function shuffle(){const pool=eligible();if(busy||!pool.length)return;busy=true;el('districtDropdown').open=false;el('featureDropdown').open=false;el('drinkDropdown').open=false;syncControls();renderCatalog();document.body.classList.add('rolling');try{const winner=choose(pool,currentCafe);await spinReel(winner);currentCafe=winner;currentDrink=chooseDrink();renderCafe();focusMap(winner);el('ticket').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});return {cafe:currentCafe.name,address:currentCafe.address,district:currentCafe.district,drink:currentDrink?(currentDrink.id?currentDrink.name[language]:(language==='en'?englishDrinks[drinks.indexOf(currentDrink)][0]:currentDrink.name)):null,menuVerified:!!currentDrink?.id,source:currentDrink?.source?.url||null};}finally{busy=false;syncControls();renderCatalog();document.body.classList.remove('rolling');}}
el('shuffle').addEventListener('click',shuffle);el('reroll').addEventListener('click',pickDrink);el('drinkType').addEventListener('change',()=>{pickDrink();renderMenu();syncControls();});el('preferHighlights').addEventListener('change',pickDrink);el('retry').addEventListener('click',()=>location.reload());
function refreshLanguage(){document.title=t('title');document.querySelector('meta[name="description"]').content=t('description');el('coffeePhoto').alt=t('photo');setTheme(document.documentElement.dataset.theme);if(loaded){renderFeatures();renderCafe();}else el('cafe').textContent=t(failed?'loadError':'loading');syncControls();renderCatalog();}
document.addEventListener('languagechange',refreshLanguage);refreshLanguage();
window.loadCoffeeData().then(([data,menus])=>{menuDatabase=menus;cafes=data.cafes.filter(c=>c.name!=='Sky City Tower');districts=data.districts;featureOptions=data.features||[];featureLoadError=!!data.featureError;if(!cafes.length||cafes.some(c=>!districts.includes(c.district)))throw Error('Invalid café data');loaded=true;renderDistricts();renderFeatures();applyDistrictFilter();if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'pick_cafe_and_drink',description:'Choose a Hanoi café within the visible district filter and suggest a drink. Uses recently checked branch menu items where available; any generic fallback is explicitly unverified.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute:async input=>{if(!input||typeof input!=='object'||Object.keys(input).length)throw Error('Expected an empty object');if(busy)throw Error('A selection is in progress');if(!eligible().length)throw Error('No cafés match the selected districts');return shuffle();}})).catch(()=>{});}catch{}}}).catch(()=>{failed=true;loaded=false;cafes=[];currentCafe=null;el('error').hidden=false;el('ticket').hidden=true;el('catalog').hidden=true;syncControls();});


el('drinkSummary').addEventListener('click',event=>{if(el('drinkType').disabled)event.preventDefault();});
el('drinkOptions').addEventListener('change',event=>{if(el('drinkType').disabled||!['all','coffee','other'].includes(event.target.value))return;el('drinkType').value=event.target.value;el('drinkType').dispatchEvent(new Event('change'));el('drinkDropdown').open=false;el('drinkSummary').focus();});
