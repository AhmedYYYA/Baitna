/* BAITNA V3.6: bilingual punctuation and bare-logo visual audit.
 * Uses computed DOM direction and text-glyph geometry, not string assertions alone.
 * Tests six public/demo routes in phone and desktop viewports.
 */
import {chromium} from "playwright";
import {createServer} from "node:http";
import {readFile,stat,mkdir,writeFile} from "node:fs/promises";
import assert from "node:assert/strict";
import path from "node:path";

const root=path.resolve("."),out=path.join(root,"reports","ui-bidi-v36");
await mkdir(out,{recursive:true});
const favicon=await readFile(path.join(root,"assets/favicon.svg"),"utf8");
assert.match(favicon,/viewBox="0 0 128 128"/);
assert.ok(!/<(?:rect|circle|ellipse)\b/i.test(favicon),"Logo has an unwanted surrounding geometry");
assert.equal((favicon.match(/<path\b/g)||[]).length,2,"Only the two approved architectural planes are allowed");
const types={".html":"text/html; charset=utf-8",".js":"application/javascript",".css":"text/css; charset=utf-8",".svg":"image/svg+xml"};
const srv=createServer(async(req,res)=>{
 try{
  const u=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  let file=path.resolve(root,"."+(u.endsWith("/")?u+"index.html":u));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
  if((await stat(file).catch(()=>null))?.isDirectory())file=path.join(file,"index.html");
  const data=await readFile(file);
  res.writeHead(200,{"Content-Type":types[path.extname(file)]||"application/octet-stream"}).end(data);
 }catch{res.writeHead(404).end("Not Found")}
});
await new Promise(resolve=>srv.listen(0,"127.0.0.1",resolve));
const address="http://127.0.0.1:"+srv.address().port+"/";
const browser=await chromium.launch({headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
const pages=[
 ["","landing","#langBtn"],
 ["demo/lifecycle.html","workspace","#langToggle"],
 ["demo/orb.html","orb","#langBtn"],
 ["demo/compliance.html","compliance","#lang"],
 ["demo/index.html","classic",null],
 ["demo/authority.html","authority",null]
];
const records=[],failures=[];
try{
 for(const [route,surface,toggle] of pages){
  for(const width of [390,768,1440]){
   for(const locale of (toggle?["ar","en"]:["ar"])){
    const ctx=await browser.newContext({viewport:{width,height:width===390?844:900},reducedMotion:"reduce",locale:locale==="ar"?"ar-AE":"en-GB"});
    const page=await ctx.newPage(),errors=[];
    page.on("pageerror",e=>errors.push(e.message));
    const response=await page.goto(address+route,{waitUntil:"domcontentloaded",timeout:20000});
    await page.waitForTimeout(150);
    if(locale==="en"){
     const button=page.locator(toggle);
     if(await button.count()===0)throw new Error("Missing English language control: "+surface);
     await button.click();
     await page.waitForTimeout(75);
    }
    const scan=await page.evaluate(({surface,locale})=>{
     const doc=document.documentElement;
     function glyphs(el){
      if(!el||!el.firstChild||el.firstChild.nodeType!==Node.TEXT_NODE)return null;
      const t=el.firstChild.textContent,last=t.lastIndexOf(".");
      if(last<1)return null;
      const range=document.createRange(),prior=document.createRange();
      range.setStart(el.firstChild,last);range.setEnd(el.firstChild,last+1);
      prior.setStart(el.firstChild,last-1);prior.setEnd(el.firstChild,last);
      const dot=range.getBoundingClientRect(),letter=prior.getBoundingClientRect();
      return {dotX:dot.x,lastX:letter.x,dotWidth:dot.width,lastWidth:letter.width,isAfterInLTR:dot.x>=letter.x-1};
     }
     function snap(selector){
      const x=document.querySelector(selector);if(!x)return null;
      const c=getComputedStyle(x),r=x.getBoundingClientRect();
      return {text:(x.textContent||"").trim(),lang:x.lang,dir:x.dir,computedDir:c.direction,unicodeBidi:c.unicodeBidi,display:c.display,visible:r.width>0&&r.height>0,glyphs:glyphs(x),background:c.backgroundColor,borderRadius:c.borderRadius};
     }
     const selectors=[
       ".baitna-hero-word",".baitna-hero-latin",
       ".baitna-hero-motto",".baitna-hero-motto-translation",
       ".baitna-header-caption",".baitna-footer-motto",
       ".top .logo img",".bar .brand img",
       ".brand .mark"
     ];
     const nodes=Object.fromEntries(selectors.map(sel=>[sel,snap(sel)]));
     const docIsCorrect=doc.lang===locale&&doc.dir===(locale==="en"?"ltr":"rtl");
     const textSelectors="p,h1,h2,h3,label,button,small,a,span";
     const suspicious=[];
     for(const el of document.querySelectorAll(textSelectors)){
      if(el.childElementCount)continue;
      const c=getComputedStyle(el),r=el.getBoundingClientRect();
      if(c.display==="none"||c.visibility==="hidden"||r.width===0||r.height===0)continue;
      const val=(el.textContent||"").trim();
      if(!val||val.length>350)continue;
      if(/^[.!?](?!\d)\s*[A-Za-z]{3}/.test(val))suspicious.push({type:"leading-English-punctuation",text:val.slice(0,65)});
      if(/[\u0600-\u06FF].*[?]\s*$/.test(val))suspicious.push({type:"Arabic-question-mark",text:val.slice(0,65)});
      if(/[\u0600-\u06FF]\s+[،؛؟.!]/.test(val))suspicious.push({type:"Arabic-space-before-punctuation",text:val.slice(0,65)});
      if(/^[A-Za-z][A-Za-z\s',;:()–—-]{12,}[.!?]$/.test(val)&&c.direction!=="ltr")
       suspicious.push({type:"English-sentence-in-RTL",text:val.slice(0,65)});
     }
     return {docIsCorrect,htmlLang:doc.lang,htmlDir:doc.dir,nodes,suspicious};
    },{surface,locale});
    const problems=[];
    if(response?.status()!==200)problems.push("HTTP "+response?.status());
    if(errors.length)problems.push("page errors: "+errors.join("; "));
    if(!scan.docIsCorrect)problems.push("Document lang/dir mismatch");
    if(surface==="landing"){
      const words=scan.nodes;
      const main=words[".baitna-hero-motto"],sub=words[".baitna-hero-motto-translation"];
      const expectedMain=locale==="ar"?"ويبقى للبيت أثر.":"A Home That Endures.";
      const expectedSub=locale==="ar"?"A HOME THAT ENDURES.":"ويبقى للبيت أثر.";
      if(main?.text!==expectedMain||sub?.text!==expectedSub)problems.push("Brand slogan text differs");
      if(main?.dir!==(locale==="ar"?"rtl":"ltr")||sub?.dir!==(locale==="ar"?"ltr":"rtl"))problems.push("Slogan directions differ");
      if(main?.computedDir!==(locale==="ar"?"rtl":"ltr")||sub?.computedDir!==(locale==="ar"?"ltr":"rtl"))problems.push("Computed slogan directions differ");
      const english=locale==="ar"?sub:main;
      if(!english?.glyphs?.isAfterInLTR)problems.push("The English period does not appear AFTER 'Endures'");
      const ar=locale==="ar"?main:sub;
      if(ar?.dir!=="rtl")problems.push("Arabic punctuation is not RTL");
      const logo=words[".top .logo img"];
      if(logo?.borderRadius!=="0px"||logo?.background!=="rgba(0, 0, 0, 0)")problems.push("Header logo has a frame or background");
    }
    if(["workspace","orb","classic"].includes(surface)){
      const icon=scan.nodes[".brand .mark"];
      if(icon?.visible&&icon?.borderRadius!=="0px")problems.push("Internal application mark has a rounded frame");
    }
    if(surface==="authority"){
      const logo=scan.nodes[".bar .brand img"];
      if(logo?.borderRadius!=="0px")problems.push("Authority logo has a frame");
    }
    if(scan.suspicious.length)problems.push("Punctuation inconsistencies: "+JSON.stringify(scan.suspicious.slice(0,8)));
    const rec={surface,width,locale,pass:problems.length===0,problems,englishGlyph:surface==="landing"?(locale==="ar"?scan.nodes[".baitna-hero-motto-translation"]:scan.nodes[".baitna-hero-motto"]).glyphs:null,detected:scan.suspicious};
    records.push(rec);
    if(!rec.pass)failures.push(rec);
    console.log(JSON.stringify({surface,width,locale,pass:rec.pass,problems:problems.slice(0,4)}));
    if(surface==="landing"&&width===390)await page.screenshot({path:path.join(out,"home-"+locale+"-390.png"),fullPage:false});
    await ctx.close();
   }
  }
 }
 await writeFile(path.join(out,"bidi-and-language-report.json"),JSON.stringify({records,failures},null,2));
}catch(e){failures.push({unexpected:String(e.stack||e)})}
finally{await browser.close();await new Promise(resolve=>srv.close(resolve))}
if(failures.length){console.error("BAITNA bilingual audit failed: "+JSON.stringify(failures).slice(0,14000));process.exitCode=1;}
