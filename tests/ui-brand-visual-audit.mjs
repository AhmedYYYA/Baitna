/* BAITNA V3.4 — computed typography/contrast audit, RTL and LTR.
 * Presentation-only test. Does not alter the app or stored data. */
import {chromium} from "playwright";
import {createServer} from "node:http";
import {readFile,stat,mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const ROOT=path.resolve("."), OUT=path.join(ROOT,"reports","ui-brand-v34");
await mkdir(OUT,{recursive:true});
const mime={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"application/javascript",".svg":"image/svg+xml"};
const server=createServer(async(req,res)=>{
 try{
  const u=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  let file=path.resolve(ROOT,"."+ (u.endsWith("/")?u+"index.html":u));
  if(!file.startsWith(ROOT+path.sep)){res.writeHead(403).end();return}
  const st=await stat(file).catch(()=>null);
  if(st?.isDirectory())file=path.join(file,"index.html");
  const data=await readFile(file);res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream"}).end(data);
 }catch(_){res.writeHead(404).end("not found")}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const base="http://127.0.0.1:"+server.address().port+"/";
const browser=await chromium.launch({headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
const pages=[
 {route:"",key:"landing",checks:[
  ["#how .loop h3","#FFFCF7",3],["#how .loop p","#FFFCF7",4.5],
  ["#parties .parties dd","#FFFCF7",4.5],["#lifecycle-v2 .v2-stage p","#493425",4.5],
  ["#lifecycle-v2 .v2-modules a span","#423023",4.5],["#pilot .kpi li","#FFFCF7",4.5]]},
 {route:"demo/lifecycle.html",key:"workspace",checks:[
  [".breadcrumb strong","#FFFCF7",4.5],[".main-top h1","#F6F2EA",3],
  [".card h2","#FFFCF7",3],[".stat small","#FFFCF7",4.5],
  [".selector-stack label","#FFFCF7",4.5]]},
 {route:"demo/orb.html",key:"orb",checks:[
  [".top .brand small","#2B1E15",4.5],[".top nav a","#2B1E15",4.5],
  [".form-section h2","#FFFCF7",3],[".field label","#FFFCF7",4.5]]},
 {route:"demo/compliance.html",key:"compliance",checks:[
  ["header strong","#FFFCF7",3],[".card h2","#FFFCF7",3],
  [".field label","#FFFCF7",4.5],["#privacy","#FFFCF7",4.5]]},
 {route:"demo/index.html",key:"classic",checks:[
  [".presenter p","#FFFCF7",4.5],[".screen .card p","#FFFCF7",4.5]]},
 {route:"demo/authority.html",key:"authority",checks:[
  [".head h1","#F6F2EA",3],[".head p","#F6F2EA",4.5],
  [".tablebox td","#FFFCF7",4.5]]}
];
function rgb(s){const m=s.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);return m?[+m[1],+m[2],+m[3]]:null}
function hex(s){return [(1),(3),(5)].map(i=>parseInt(s.slice(i,i+2),16))}
function luminance(rgbv){const v=rgbv.map(x=>{x=x/255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4});return .2126*v[0]+.7152*v[1]+.0722*v[2]}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
const records=[],failures=[];
try{
 for(const obj of pages){
  for(const width of [390,768,1440]){
   for(const locale of ["ar","en"]){
    const context=await browser.newContext({viewport:{width,height:width===390?844:900},reducedMotion:"reduce",locale:locale==="ar"?"ar-AE":"en-GB"});
    const tab=await context.newPage(),errors=[];
    tab.on("pageerror",e=>errors.push(String(e).slice(0,220)));
    const response=await tab.goto(base+obj.route,{waitUntil:"domcontentloaded",timeout:25000});
    await tab.waitForTimeout(290);
    if(locale==="en"){
     const toggle=obj.key==="landing"?"#langBtn":obj.key==="workspace"?"#langToggle":obj.key==="orb"?"#langBtn":obj.key==="compliance"?"#lang":null;
     if(toggle && await tab.locator(toggle).count())await tab.locator(toggle).click();
     await tab.waitForTimeout(95);
    }
    const results=await tab.evaluate(checks=>{
     function visible(el){if(!el)return false;const c=getComputedStyle(el),r=el.getBoundingClientRect();return c.display!=="none"&&c.visibility!=="hidden"&&r.width>0&&r.height>0}
     let items=[];
     for(const [selector] of checks){
      const el=document.querySelector(selector);
      if(!visible(el))continue;
      const c=getComputedStyle(el);
      items.push({selector,font:parseFloat(c.fontSize),weight:c.fontWeight,color:c.color,bg:c.backgroundColor,lines:c.lineHeight});
     }
     const interactive=[...document.querySelectorAll("button,a,input,select,textarea")].filter(visible);
     const smallButtons=interactive.filter(x=>parseFloat(getComputedStyle(x).fontSize)<12.5).slice(0,8).map(x=>({tag:x.tagName,txt:(x.textContent||x.ariaLabel||"").trim().slice(0,28),font:getComputedStyle(x).fontSize}));
     const heading=[...document.querySelectorAll("h1,h2")].filter(visible).map(el=>({tag:el.tagName,font:parseFloat(getComputedStyle(el).fontSize)}));
     const headingsTooSmall=heading.filter(x=>x.font<(x.tag==="H1"?24:18));
     const sections=[...document.querySelectorAll("section.block,#lifecycle-v2")].filter(visible).length;
     return {samples:items,docWidth:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth,language:document.documentElement.lang,direction:document.documentElement.dir,sections,visibleNetwork:visible(document.getElementById("network")),visibleHow:visible(document.getElementById("how")),interactive:interactive.length,smallButtons,headingsTooSmall};
    },obj.checks);
    const checks=obj.checks.map(([selector,bg,min])=>{
     const x=results.samples.find(t=>t.selector===selector);
     if(!x)return {selector,status:"missing"};
     const foreground=rgb(x.color);
     const score=foreground?contrast(foreground,hex(bg)):0;
     return {selector,font:x.font,score:+score.toFixed(2),min,pass:score>=min};
    });
    const bad=checks.filter(x=>x.status==="missing" ? !(obj.key==="classic" && width===390 && x.selector===".presenter p") : !x.pass);
    const record={surface:obj.key,width,locale,doc:results.docWidth,viewport:results.viewport,sections:results.sections,interactive:results.interactive,lowFont:results.smallButtons,contrastFailures:bad,lang:results.language,graphHidden:!results.visibleNetwork,howVisible:results.visibleHow,errors};
    records.push(record);
    const must= obj.key==="landing"?(!results.visibleNetwork&&results.visibleHow):true;
    const shouldLocale=locale==="en"&&!["classic","authority"].includes(obj.key)?results.language==="en":true;
    if(response?.status()!==200||results.docWidth>results.viewport+2||!must||!shouldLocale||errors.length||bad.length||results.headingsTooSmall.length){
     failures.push({...record,headingIssues:results.headingsTooSmall});
    }
    if(width!==768){
     const location=(obj.route||"home").replaceAll("/","_").replaceAll(".html","");
     await tab.screenshot({path:path.join(OUT,location+"-"+locale+"-"+width+".png"),fullPage:false});
    }
    console.log(JSON.stringify({surface:obj.key,width,locale,contrastIssues:bad.length,offscreen:results.docWidth>results.viewport+2,hiddenGraph:!results.visibleNetwork,smallText:results.smallButtons.length,issues:errors.length}));
    await context.close();
   }
  }
 }
 await writeFile(path.join(OUT,"computed-visual-audit.json"),JSON.stringify({records,failures},null,2));
}catch(err){failures.push({unexpected:String(err.stack||err)});}
finally{await browser.close();await new Promise(done=>server.close(done))}
if(failures.length){console.error("BAITNA visual QA failed: "+JSON.stringify(failures).slice(0,14000));process.exitCode=1;}
