const fs = require('fs');
const filePath = "c:\\Users\\LENOVO\\Desktop\\web\\index.html";
let content = fs.readFileSync(filePath, 'utf8');

// Remove various icon divs
content = content.replace(/\s*<div class="ap-icon"[\s\S]*?<\/div>/g, '');
content = content.replace(/\s*<div class="svc-icon"[\s\S]*?<\/div>/g, '');
content = content.replace(/\s*<div class="wc-icon"[\s\S]*?<\/div>/g, '');
content = content.replace(/\s*<div class="catalog-promo-icon"[\s\S]*?<\/div>/g, '');
content = content.replace(/\s*<div class="ac-icon"[\s\S]*?<\/div>/g, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Icons removed using Node.js");
