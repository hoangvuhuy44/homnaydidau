const el=id=>document.getElementById(id);
const english=document.documentElement.lang==='en';
el('language').value=english?'en':'vi';
try{localStorage.setItem('coffee-language',english?'en':'vi')}catch{}
el('language').addEventListener('change',event=>{const language=event.target.value;try{localStorage.setItem('coffee-language',language)}catch{}const file=location.pathname.split('/').pop().replace('-en.html','.html');location.href=file.replace('.html',language==='en'?'-en.html':'.html');});
function setTheme(theme){document.documentElement.dataset.theme=theme;el('themeToggle').textContent=theme==='dark'?(english?'☀ Light':'☀ Sáng'):(english?'☾ Dark':'☾ Tối');el('themeToggle').setAttribute('aria-pressed',String(theme==='dark'));el('themeToggle').setAttribute('aria-label',theme==='dark'?(english?'Switch to light theme':'Bật giao diện sáng'):(english?'Switch to dark theme':'Bật giao diện tối'));try{localStorage.setItem('coffee-theme',theme)}catch{}}
let initialTheme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';try{const saved=localStorage.getItem('coffee-theme');if(['light','dark'].includes(saved))initialTheme=saved}catch{}setTheme(initialTheme);el('themeToggle').addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
