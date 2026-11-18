/* V3.1 browser-only quality gate: actual Chromium render, not static assumptions. */
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import path from 'node:path';
import {readFile,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=path.resolve('.');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json'};
const srv=createServer(async(req,res)=>{
 try{
  let url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let target=path.resolve(root,'.'+(url.endsWith('/')?url+'index.html':url));
  if(!target.startsWith(root+path.sep))return res.writeHead(403).end();
  const f=await stat(target).catch(()=>null);if(f?.isDirectory())target=path.join(target,'index.html');
  const content=await readFile(target);res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'}).end(content);
 }catch(err){res.writeHead(404).end('not found')}
});
await new Promise((ok,fail)=>{srv.once('error',fail);srv.listen(0,'127.0.0.1',ok)});
const url='http://127.0.0.1:'+srv.address().port+'/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const routes=['','demo/lifecycle.html','demo/orb.html','demo/compliance.html','demo/index.html','demo/authority.html'];
let failures=[];
try{
 for(const route of routes){
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',locale:'ar-AE',colorScheme:'light'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  const resp=await page.goto(url+route,{waitUntil:'networkidle',timeout:22000});
  await page.waitForTimeout(100);
  const metrics=await page.evaluate(()=>({
   viewport:innerWidth,
   docWidth:document.documentElement.scrollWidth,
   hasV31Sheet:!!document.querySelector('link[href*="baitna-v3-1.css"]'),
   optedOut:!document.body.classList.contains('v31-motion'),
   heading:document.querySelector('h1')?.textContent?.trim()?.slice(0,60)||'',
   notice:getComputedStyle(document.querySelector('.notice')||document.body).color
  }));
  const png=route===''?await page.screenshot({fullPage:true}):null;
  const imageWidth=png?png.readUInt32BE(16):null;
  const pass=resp?.status()===200&&!errors.length&&metrics.hasV31Sheet&&metrics.docWidth<=392&&metrics.optedOut&&(imageWidth===null||imageWidth<=392);
  console.log(JSON.stringify({route:route||'/',pass,metrics,imageWidth,errors}));
  if(!pass)failures.push({route,metrics,imageWidth,errors});
  await context.close();
 }
 const desktop=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference',hasTouch:false});
 const page=await desktop.newPage();
 await page.goto(url,{waitUntil:'networkidle',timeout:22000});
 const sheet=page.locator('.hero .sheet');
 await sheet.hover();
 const box=await sheet.boundingBox();
 if(box){await page.mouse.move(box.x+box.width*.8,box.y+box.height*.25);await page.waitForTimeout(120)}
 const motion=await page.evaluate(()=>({
  classSet:document.body.classList.contains('v31-motion'),
  tilt:document.querySelector('.hero .sheet')?.style.getPropertyValue('--v31-rot-y')||'',
  scroll:document.documentElement.style.getPropertyValue('--v31-rail')||''
 }));
 const ok=motion.classSet&&!!motion.tilt;
 console.log(JSON.stringify({desktopMotion:motion,pass:ok}));
 if(!ok)failures.push({desktopMotion:motion});
 await desktop.close();
}catch(e){failures.push({unexpected:String(e.stack||e)});console.error(e)}
finally{await browser.close();await new Promise(done=>srv.close(done))}
if(failures.length){console.error('V3.1 Browser QA failed:',JSON.stringify(failures));process.exitCode=1}
