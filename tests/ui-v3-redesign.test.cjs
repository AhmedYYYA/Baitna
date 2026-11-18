/**
 * BAITNA V3 Radical Redesign — independent visual-scope regression gate.
 * node --test tests/ui-v3-redesign.test.cjs
 * No runtime dependencies; compares every pre-existing byte to approved main.
 */
"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const {execFileSync}=require("node:child_process");
const ROOT=path.resolve(__dirname,"..");
const BASE="cac4e09adead3fbd0fd9416536c8b82886fb16b1";
const original=p=>execFileSync("git",["show",BASE+":"+p],{cwd:ROOT,encoding:"utf8",maxBuffer:16*1024*1024});
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const pages=["index.html","demo/lifecycle.html","demo/orb.html","demo/compliance.html","demo/index.html","demo/authority.html"];
const frozenScripts=["assets/experience.js","assets/launch-enhancements.js","assets/lifecycle.js","assets/orb.js","assets/orb-catalog.js"];
const stylesheet=read("assets/baitna-v3.css"),navigation=read("assets/baitna-v3-nav.js");

/* Explicitly approved exception: remove only this exact illustrated demo block.
   All remaining original sections, roles, links and logic stay frozen. */
function approvedHomeMockupRemoval(p,source){
 if(p!=="index.html")return source;
 const match=source.match(/\n    <figure class="sheet">[\s\S]*?\n    <\/figure>\n/);
 assert.ok(match,'baseline sample illustration missing');
 assert.equal((source.match(/<figure class="sheet">/g)||[]).length,1);
 return source.replace(match[0],"\n");
}

test("Six complete original documents are identical after removing only V3 visual head inserts",()=>{
 for(const page of pages){
  const content=read(page);
  const marker=/<!-- BAITNA-V3:START -->\n[\s\S]*?<!-- BAITNA-V3:END -->\n/g;
  const found=[...content.matchAll(marker)];
  assert.equal(found.length,1,page+" must have one design head block");
  assert.ok(content.indexOf(found[0][0])<content.indexOf("</head>"),page+" design assets must be in head");
  assert.equal(content.replace(marker,""),approvedHomeMockupRemoval(page,original(page)),page+" changed beyond approved sample illustration removal");
  const head=found[0][0],prefix=page==="index.html"?"assets/":"../assets/";
  assert.ok(head.includes(prefix+"baitna-v3.css?v=3"),page+" missing theme");
  assert.ok(head.includes(prefix+"baitna-v3-nav.js?v=3"),page+" missing navigation");
 }
});
test("Original governance, statuses, data and business scripts remain byte exact",()=>{
 for(const script of frozenScripts)assert.equal(read(script),original(script),script);
 const frozenPages=["index.html","demo/index.html","demo/authority.html"];
 for(const page of frozenPages){
  const b=original(page);
  assert.ok(b.includes("noindex,nofollow")||b.includes("id=\"top\"")||b.includes("id=\"screen-home\"")||b.includes("بوابة الجهة الرقابية"));
 }
});
test("Six-step cycle, six roles and three pilot phases unchanged",()=>{
 const s=read("index.html");
 const steps=["s1_t","s2_t","s3_t","s4_t","s5_t","s6_t"].map(k=>s.indexOf('data-i18n="'+k+'"'));
 assert.ok(steps.every(x=>x>=0)&&steps.every((x,i)=>i===0||x>steps[i-1]));
 for(const role of ["p1_t","p2_t","p3_t","p4_t","p5_t","p6_t"])assert.ok(s.includes('data-i18n="'+role+'"'));
 for(const phase of ["ph0_d","ph1_d","ph2_d","kpi1","kpi2","kpi3","kpi4","kpi5"])assert.ok(s.includes('data-i18n="'+phase+'"'));
});
test("Radical redesign covers all six surfaces and mobile breakpoints",()=>{
 const keys=["landing","workspace","orb","compliance","classic","authority"];
 for(const key of keys)assert.ok(stylesheet.includes("body[data-baitna-surface="+key+"]"),"missing "+key+" styling");
 for(const breakpoint of [1260,1050,760,470])assert.ok(stylesheet.includes("@media(max-width:"+breakpoint+"px)"));
 assert.ok(stylesheet.includes("prefers-reduced-motion:reduce"));
 assert.ok(stylesheet.includes(":focus-visible")||stylesheet.includes("aria-current"));
 assert.ok(stylesheet.includes("Dubai"));
 assert.ok(!stylesheet.includes("@font-face"),"Unlicensed webfont embedding introduced");
});
test("New navigation links only to existing page routes, no storage/network/business access",()=>{
 for(const p of ["demo/lifecycle.html","demo/orb.html","demo/compliance.html","demo/authority.html","demo/"])
  assert.ok(navigation.includes('url:"'+p+'"'));
 assert.ok(!/\b(?:localStorage|sessionStorage|XMLHttpRequest|fetch|indexedDB|sendBeacon)\b/.test(navigation));
 assert.ok(!/innerHTML\s*=|\.textContent\s*=\s*[^;]*\bstate\b/.test(navigation));
 assert.ok(navigation.includes('aria-expanded'));
 assert.ok(navigation.includes('Escape'));
});
test("Original URL parameters, statuses and disclaimer texts survive without rewrite",()=>{
 for(const page of pages){
  const next=read(page).replace(/<!-- BAITNA-V3:START -->\n[\s\S]*?<!-- BAITNA-V3:END -->\n/g,"");
  assert.equal(next,approvedHomeMockupRemoval(page,original(page)));
 }
 assert.ok(read("demo/lifecycle.html").includes('id="homeSelect"'));
 assert.ok(read("demo/orb.html").includes('id="langBtn"'));
 assert.ok(read("demo/compliance.html").includes('id="emirate"'));
});
