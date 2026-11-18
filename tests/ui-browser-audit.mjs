/* Agent 6 & 8 — comparative Chromium lab audit. No site or data modifications. */
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,mkdtemp,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const BASE='59fcb23ebdff8170e8910b7ee5c55519a37506d0';
const ROOT=path.resolve('.'),DEST=path.join(ROOT,'reports','ui-v2');
await mkdir(DEST,{recursive:true});
const backup=await mkdtemp(path.join(tmpdir(),'baitna-baseline-'));
execFileSync('bash',['-lc','git archive '+BASE+' | tar -x -C "'+backup+'"'],{cwd:ROOT});
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml'};
function serve(root){return new Promise((resolve,reject)=>{
 const server=createServer(async(req,res)=>{
  try{
   const url=new URL(req.url||'/',"http://localhost"),pathname=decodeURIComponent(url.pathname);
   let file=path.resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
   if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
   const info=await stat(file).catch(()=>null);if(info?.isDirectory())file=path.join(file,'index.html');
   const data=await readFile(file);
   res.writeHead(200,{'Content-Type':MIME[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(data);
  }catch(e){res.writeHead(404).end('not found')}
 });
 server.on('error',reject);
 server.listen(0,'127.0.0.1',()=>resolve({server,url:'http://127.0.0.1:'+server.address().port+'/'}));
});}
const beforeServer=await serve(backup),afterServer=await serve(ROOT);
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const routes=['','demo/lifecycle.html','demo/orb.html','demo/compliance.html','demo/index.html','demo/authority.html'];
const result={baseline:BASE,environment:'Chromium CI lab, 390x844 mobile viewport',routes:{},caveats:[
 'Lab LCP/CLS are not field Web Vitals; INP is not measured.',
 'Axe automated audits do not prove full WCAG 2.2 AA.',
 'iPad Safari, screen reader and bank/government authorizations remain untested.']};
let issues=0;
async function scan(host,route,candidate){
 const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:'reduce',locale:'ar-AE',colorScheme:'light'});
 const page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e).slice(0,250)));
 await page.addInitScript(()=>{
  window.__btPerf={lcp:null,cls:0,shifts:[]};
  try{new PerformanceObserver(ls=>ls.getEntries().forEach(e=>{window.__btPerf.lcp=e.startTime})).observe({type:'largest-contentful-paint',buffered:true})}catch(_){}
  try{new PerformanceObserver(ls=>ls.getEntries().forEach(e=>{if(!e.hadRecentInput){window.__btPerf.cls+=e.value;window.__btPerf.shifts.push({value:e.value,sources:(e.sources||[]).slice(0,4).map(s=>({node:s.node?.tagName||'',id:s.node?.id||'',cls:String(s.node?.className||'').slice(0,55)}))});}})).observe({type:'layout-shift',buffered:true})}catch(_){}
 });
 const resp=await page.goto(host.url+route,{waitUntil:'domcontentloaded',timeout:25000});
 try{await page.waitForLoadState('load',{timeout:12000})}catch(_){}
 await page.waitForTimeout(400);
 const metrics=await page.evaluate(()=>{
  const nav=performance.getEntriesByType('navigation')[0],paint=performance.getEntriesByType('paint').find(e=>e.name==='first-contentful-paint');
  return{fcpMs:paint?.startTime??null,lcpMs:window.__btPerf?.lcp??null,cls:window.__btPerf?.cls??null,
    domInteractiveMs:nav?.domInteractive??null,scrollWidth:document.documentElement.scrollWidth,viewportWidth:document.documentElement.clientWidth,shifts:window.__btPerf?.shifts?.sort((a,b)=>b.value-a.value).slice(0,10),overflow:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.left< -3||r.right>innerWidth+3}).slice(0,18).map(e=>({tag:e.tagName,id:e.id,cls:String(e.className||'').slice(0,60),width:Math.round(e.getBoundingClientRect().width),left:Math.round(e.getBoundingClientRect().left),right:Math.round(e.getBoundingClientRect().right)}))};
 });
 let violations=[];
 try{const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
   violations=a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length,help:v.help,targets:v.nodes.slice(0,12).map(n=>n.target)}));}
 catch(e){violations=[{id:'axe-audit-error',help:String(e)}]}
 if(candidate&&['','demo/orb.html','demo/authority.html'].includes(route)){
  await page.screenshot({path:path.join(DEST,(route||'index').replaceAll('/','-').replace('.html','')+'-mobile.png'),fullPage:true});
 }
 if(candidate&&route===''){
  await page.setViewportSize({width:1440,height:900});
  await page.screenshot({path:path.join(DEST,'index-desktop.png'),fullPage:true});
  const vp=page.locator('#graphViewport');if(await vp.count()){await vp.focus();await page.keyboard.press('ArrowRight');}
 }
 const toggle=route===''?'#langBtn':route==='demo/lifecycle.html'?'#langToggle':route==='demo/orb.html'?'#langBtn':route==='demo/compliance.html'?'#lang':null;
 let locale=null;
 if(toggle&&await page.locator(toggle).count()){await page.locator(toggle).click();locale=await page.evaluate(()=>({lang:document.documentElement.lang,dir:document.documentElement.dir}));}
 await ctx.close();
 return{status:resp?.status(),metrics,violations,errors,locale};
}
try{
 for(const route of routes){
  const before=await scan(beforeServer,route,false),after=await scan(afterServer,route,true);
  result.routes[route||'/']={before,after};
  if(after.status!==200||after.errors.length||after.violations.length||after.metrics.scrollWidth>after.metrics.viewportWidth+2||after.locale?.lang==='ar')issues++;
  process.stdout.write(JSON.stringify({route:route||'/',before:{lcp:before.metrics.lcpMs,cls:before.metrics.cls,axe:before.violations.length},
   after:{lcp:after.metrics.lcpMs,cls:after.metrics.cls,axe:after.violations.length},overflows:after.metrics.scrollWidth>after.metrics.viewportWidth+2,overflow:after.metrics.overflow.slice(0,7),violations:after.violations.map(x=>({id:x.id,targets:x.targets})),shifts:after.metrics.shifts.slice(0,5)})+'\n');
 }
 result.summary={routes:routes.length,failedAutomatedRouteChecks:issues,governancePassRequired:true,fieldCWVUnverified:true};
 await writeFile(path.join(DEST,'browser-audit.json'),JSON.stringify(result,null,2));
 if(issues)process.exitCode=1;
}catch(e){
 result.error=String(e.stack||e);
 await writeFile(path.join(DEST,'browser-audit.json'),JSON.stringify(result,null,2));
 process.stderr.write(result.error+'\n');process.exitCode=1;
}finally{await browser.close();beforeServer.server.close();afterServer.server.close();}
