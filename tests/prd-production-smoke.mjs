const base=process.env.QA_ORIGIN||'http://127.0.0.1:3100';
const {default:assert}=await import('node:assert/strict');
for(const path of ['/privacy','/en']){const r=await fetch(base+path);assert.equal(r.status,200);console.log(path+' OK');}
const preview=await fetch(base+'/design-preview');assert.equal(preview.status,404);assert.ok(!(await preview.text()).includes('Taufik Raihandani'));console.log('Development preview blocked in production.');
const xml=await fetch(base+'/sitemap.xml').then(r=>r.text());assert.ok(!xml.includes('/admin'));assert.ok(!xml.includes('/preview'));assert.ok(xml.includes('/privacy'));console.log('Dynamic sitemap verified.');
const robots=await fetch(base+'/robots.txt').then(r=>r.text());assert.ok(robots.includes('Disallow: /admin'));assert.ok(robots.includes('Disallow: /design-preview'));console.log('Robots exclusions verified.');
const missingPdf=await fetch(base+'/api/portfolio/not-published/pdf');assert.equal(missingPdf.status,404);assert.ok(missingPdf.headers.get('cache-control').includes('no-store'));console.log('Unpublished PDF denied.');
const malformed=await fetch(base+'/api/contact',{method:'POST',headers:{origin:base,'Content-Type':'application/json'},body:'null'});assert.equal(malformed.status,400);console.log('Malformed contact JSON denied.');
