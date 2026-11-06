// Local-only responsive browser harness. No fixtures, database writes or deployment route.
import http from 'node:http';
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1:3101');
 if(url.pathname==='/__qa'){
  const width=Number(url.searchParams.get('width'))||390;
  if(![360,390,768,1024,1440].includes(width)){res.writeHead(400).end();return;}
  const path=url.searchParams.get('path')||'/';
  if(!/^\/[\w/-]*$/.test(path)){res.writeHead(400).end();return;}
  res.setHeader('Content-Type','text/html');res.end(`<!doctype html><html><head><title>Responsive QA ${width}px</title><style>body{margin:0;background:#e2e8f0}iframe{display:block;width:${width}px;height:100vh;border:0}</style></head><body><iframe title="Portofolio ${width}px" src="${path}"></iframe></body></html>`);return;
 }
 if(req.method!=='GET'){res.writeHead(405).end();return;}
 try{const upstream=await fetch('http://127.0.0.1:3100'+req.url,{redirect:'manual'});res.writeHead(upstream.status,Object.fromEntries([...upstream.headers].filter(([k])=>!['content-encoding','content-length','transfer-encoding'].includes(k))));res.end(Buffer.from(await upstream.arrayBuffer()));}catch{res.writeHead(502).end('Production server unavailable');}
});server.listen(3101,'127.0.0.1',()=>console.log('Responsive QA http://127.0.0.1:3101/__qa?width=390'));
