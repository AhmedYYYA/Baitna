/* BAITNA V3.1 smoke suite — Node tests run against actual Git history. */
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const {execFileSync}=require("node:child_process");
const root=path.resolve(__dirname,".."),base="504da529b64531c4016c247c583749cd4653a4b7";
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const {restoreShareHead}=require("./approved-share-metadata.cjs");
const fromBase=p=>execFileSync("git",["show",base+":"+p],{cwd:root,encoding:"utf8",maxBuffer:16*1024*1024});
const pages=["index.html","demo/lifecycle.html","demo/orb.html","demo/compliance.html","demo/index.html","demo/authority.html"];

/* Explicitly approved exception: remove only this exact illustrated demo block.
   All remaining original sections, roles, links and logic stay frozen. */
function approvedHomeMockupRemoval(p,source){
 if(p!=="index.html")return source;
 const match=source.match(/\n    <figure class="sheet">[\s\S]*?\n    <\/figure>\n/);
 assert.ok(match,'baseline sample illustration missing');
 assert.equal((source.match(/<figure class="sheet">/g)||[]).length,1);
 return source.replace(match[0],"\n");
}

test("six V3 documents unchanged except additive visual assets in V3 head marker",()=>{
 for(const p of pages){
  const current=read(p),old=fromBase(p),prefix=p==="index.html"?"assets/":"../assets/";
  const inject='<link rel="stylesheet" href="'+prefix+'baitna-v3-1.css?v='+(p==="index.html"?'32':'31')+'">\n'+(p==="index.html"?'<script src="assets/baitna-v3-1-motion.js?v=31" defer></script>\n':'');
  assert.equal(restoreShareHead(p,current.replace(inject,""),old),approvedHomeMockupRemoval(p,old),p+": changed beyond approved presentation metadata");
  assert.ok(current.includes(inject),p+": V3.1 assets missing");
 }
});
test("all five original business JS files are byte-for-byte frozen",()=>{
 for(const p of ["assets/experience.js","assets/launch-enhancements.js","assets/lifecycle.js","assets/orb.js","assets/orb-catalog.js"])assert.equal(read(p),fromBase(p),p);
});
test("motion only touches CSS and has no application or network API side effects",()=>{
 const js=read("assets/baitna-v3-1-motion.js");
 assert.doesNotThrow(()=>new Function(js));
 for(const keyword of ["fetch(","XMLHttpRequest","localStorage","sessionStorage","indexedDB","location.href","location.assign","history.pushState","document.cookie"])assert.ok(!js.includes(keyword),keyword);
 assert.ok(js.includes("prefers-reduced-motion: reduce"));
 assert.ok(js.includes("requestAnimationFrame")&&js.includes("IntersectionObserver"));
 assert.ok(!js.includes("innerHTML")&&!js.includes("textContent"));
});
test("motion respects RTL, mobile touch, focus and scroll performance",()=>{
 const css=read("assets/baitna-v3-1.css");
 assert.match(css,/inset-inline-start/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/pointer:coarse/);
 assert.match(css,/:focus-visible/);
 assert.match(css,/max-width:760px/);
 assert.ok(!css.includes("@font-face"));
});
test("regulator, financing, consultant, owner notices and workflows unchanged",()=>{
 const landing=read("index.html");
 for(const id of ['id="network"','id="how"','id="parties"','id="pilot"'])assert.ok(landing.includes(id));
 assert.ok(read("demo/authority.html").includes('id="visitForm"'),"original regulator demo form must remain present");
 assert.ok(read("demo/lifecycle.html").includes('id="projectSelect"'));
 assert.ok(read("demo/orb.html").includes('id="langBtn"'));
});

test("irrelevant sample home illustration and fictional progress data removed",()=>{
 const landing=read("index.html");
 for(const x of ['<figure class="sheet">','<svg class="elev"','class="legend-m"','class="tblock"'])assert.ok(!landing.includes(x));
 assert.ok(landing.includes('id="lifecycle-v2"')&&landing.includes('id="network"'));
 assert.ok(landing.includes('href="demo/lifecycle.html"'));
 const css=read("assets/baitna-v3-1.css");
 assert.ok(css.includes("grid-template-columns:minmax(0,1fr)!important"));
 assert.ok(css.includes("min-block-size:0!important"));
});
