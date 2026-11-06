import assert from 'node:assert/strict';
const base=process.env.QA_ORIGIN||'http://127.0.0.1:3100';
for(const path of ['/','/projects','/contact','/login','/sitemap.xml','/robots.txt']){
 const start=performance.now(),r=await fetch(base+path),html=await r.text();assert.equal(r.status,200,path);assert.ok(html.length>0);console.log(JSON.stringify({path,status:r.status,ms:Math.round(performance.now()-start),bytes:Buffer.byteLength(html),cache:r.headers.get('cache-control')}));
}
for(const path of ['/about','/articles','/playground','/experiences','/educations','/skills','/certificates','/achievements']) {
 const r=await fetch(base+path); assert.ok([200,404].includes(r.status),path); console.log(JSON.stringify({path,status:r.status}));
}
for(const path of ['/admin','/admin/projects/new','/preview/projects/11111111-1111-4111-8111-111111111111','/portfolio-builder']){
 const r=await fetch(base+path,{redirect:'manual'}),html=await r.text();assert.ok((r.status>=300&&r.status<400&&r.headers.get('location')?.includes('/login'))||html.includes('NEXT_REDIRECT;replace;/login'),path);assert.ok(r.headers.get('cache-control')?.includes('no-store'));console.log(JSON.stringify({path,auth:'redirect-to-login',cache:r.headers.get('cache-control')}));
}
const invalid=await fetch(base+'/api/contact',{method:'POST',headers:{origin:base,'Content-Type':'application/json'},body:JSON.stringify({name:'a',email:'invalid',message:'x',submissionId:'invalid'})});assert.equal(invalid.status,422);console.log('Invalid contact rejected before database write.');
const csrf=await fetch(base+'/api/contact',{method:'POST',headers:{origin:'https://example.invalid','Content-Type':'application/json'},body:'{}'});assert.equal(csrf.status,403);
const missing=await fetch(base+'/api/media/11111111-1111-4111-8111-111111111111');assert.equal(missing.status,404);assert.ok(missing.headers.get('cache-control')?.includes('no-store'));console.log('CSRF and unavailable media rejected.');
