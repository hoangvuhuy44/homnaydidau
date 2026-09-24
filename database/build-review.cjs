const fs=require('fs'),path=require('path');
const db=JSON.parse(fs.readFileSync(path.join(__dirname,'menu-database.json'),'utf8'));
const cafes=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/cafes.json'),'utf8')).cafes.map(({id,name,address})=>({id,name,address}));
let html=fs.readFileSync(path.join(__dirname,'review-template.html'),'utf8');
html=html.replace('/*DATABASE*/',JSON.stringify(db).replace(/</g,'\\u003c')).replace('/*CAFES*/',JSON.stringify(cafes).replace(/</g,'\\u003c'));
fs.writeFileSync(path.join(__dirname,'menu-editor.html'),html);
console.log('Local menu review editor refreshed. Drafts remain outside the public website.');
