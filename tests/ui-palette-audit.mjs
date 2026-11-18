/* BAITNA V3.5 — real computed-color consistency audit across six surfaces.
   Inspects foreground, background, border, outline and gradient colors
   on visible elements, in mobile/desktop and Arabic/English. */
import {chromium} from "playwright";
import {createServer} from "node:http";
import {stat,readFile,mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const ROOT=path.resolve("."),REPORT=path.join(ROOT,"reports","ui-brand-palette");
await mkdir(REPORT,{recursive:true});
const mime={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"application/javascript",".svg":"image/svg+xml"};
const server=createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  let f=path.resolve(ROOT,"."+(pathname.endsWith("/")?pathname+"index.html":pathname));
  if(!f.startsWith(ROOT+path.sep)){res.writeHead(403).end();return}
  if((await stat(f).catch(()=>null))?.isDirectory())f=path.join(f,"index.html");
  const bytes=await readFile(f);
  res.writeHead(200,{"Content-Type":mime[path.extname(f)]||"application/octet-stream"}).end(bytes);
 }catch{res.writeHead(404).end("not found")}
});
await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
const base="http://127.0.0.1:"+server.address().port+"/";
const browser=await chromium.launch({headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
const pages=[
 ["","landing","#langBtn"],["demo/lifecycle.html","workspace","#langToggle"],
 ["demo/orb.html","orb","#langBtn"],["demo/compliance.html","compliance","#lang"],
 ["demo/index.html","classic",null],["demo/authority.html","authority",null]
];
const output=[],failures=[];
try{
 for(const [route,surface,toggle] of pages){
  for(const width of [390,1440]){
   for(const language of ["ar","en"]){
    const ctx=await browser.newContext({viewport:{width,height:844},reducedMotion:"reduce"});
    const page=await ctx.newPage(),errors=[];
    page.on("pageerror",e=>errors.push(e.message));
    const resp=await page.goto(base+route,{waitUntil:"networkidle",timeout:24000});
    if(language==="en"&&toggle&&await page.locator(toggle).count())await page.locator(toggle).click();
    const results=await page.evaluate(()=>{
     function colorValues(s){
      if(!s||s==="none"||s==="transparent")return[];
      return [...s.matchAll(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)/gi)]
       .map(x=>[+x[1],+x[2],+x[3],x[4]===undefined?1:+x[4]]);
     }
     function isBlue(v){
      const [rr,gg,bb,a]=v;if(a<.18)return false;
      const r=rr/255,g=gg/255,b=bb/255,max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min;
      if(delta<.045)return false;
      let h=0;if(max===r)h=((g-b)/delta)%6;else if(max===g)h=(b-r)/delta+2;else h=(r-g)/delta+4;
      h=((h*60)%360+360)%360;
      const l=(max+min)/2, sat=delta/(1-Math.abs(2*l-1));
      return h>=185&&h<=265&&sat>=.22;
     }
     const fields=["color","backgroundColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","outlineColor","textDecorationColor","backgroundImage"];
     const hits=[];let count=0;
     const all=[...document.querySelectorAll("body *")];
     for(const el of all){
      const rect=el.getBoundingClientRect(),cs=getComputedStyle(el);
      if(!rect.width||!rect.height||cs.display==="none"||cs.visibility!=="visible"||parseFloat(cs.opacity)===0)continue;
      for(const which of [null,"::before","::after"]){
       const style=which?getComputedStyle(el,which):cs;
       if(which&&(style.content==="none"||style.content==="normal"||style.display==="none"))continue;
       for(const field of fields){
        if(field.startsWith("border") && (parseFloat(style[field.replace("Color","Width")])<.5 || style[field.replace("Color","Style")]==="none"))continue;
        if(field==="outlineColor" && (style.outlineStyle==="none"||parseFloat(style.outlineWidth)<.5))continue;
        if(field==="textDecorationColor" && style.textDecorationLine==="none")continue;
        for(const v of colorValues(style[field])){
         if(!isBlue(v))continue;
         count++;
         if(hits.length<60)hits.push({tag:el.tagName,id:el.id,cls:String(el.className?.baseVal||el.className||"").slice(0,62),property:field,element:which||"",color:v,txt:(el.textContent||"").trim().slice(0,32)});
        }
       }
      }
     }
     const btn=document.querySelector(".hero .ctas .btn.solid");
     return {count,hits,primary:btn?{background:getComputedStyle(btn).backgroundColor,color:getComputedStyle(btn).color}:null};
    });
    const fail=resp?.status()!==200||errors.length||results.count>0||(surface==="landing"&&results.primary?.background!=="rgb(129, 86, 47)");
    const record={surface,width,language,status:resp?.status(),errors,blueOccurrences:results.count,exampleColors:results.hits,primary:results.primary,pass:!fail};
    output.push(record);
    console.log(JSON.stringify({surface,width,language,blue:results.count,primary:results.primary,first:results.hits.slice(0,7),pass:!fail}));
    if(fail)failures.push(record);
    await ctx.close();
   }
  }
 }
 await writeFile(path.join(REPORT,"palette-audit.json"),JSON.stringify({output,failures},null,2));
}catch(err){failures.push({unexpected:String(err?.stack||err)});}
finally{await browser.close();await new Promise(ok=>server.close(ok))}
if(failures.length){console.error("BAITNA palette audit failed: "+JSON.stringify(failures).slice(0,9000));process.exitCode=1;}
