/**
 * Agent 9 Independent Governance Verification — exact baseline lock.
 * Run with Node 22+: node --test tests/ui-governance-lock.test.cjs
 * Source of truth: GitHub main commit frozen before the UI changes.
 * No third-party packages.
 */
'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const ROOT=path.resolve(__dirname,'..');
const BASE='59fcb23ebdff8170e8910b7ee5c55519a37506d0';
const htmlPaths=['index.html','demo/index.html','demo/authority.html','demo/lifecycle.html','demo/orb.html','demo/compliance.html'];
const businessJs=['assets/experience.js','assets/launch-enhancements.js','assets/lifecycle.js','assets/orb.js','assets/orb-catalog.js'];
const existingCss=['assets/baitna-design-system.css','assets/dashboard-polish.css','assets/experience.css','assets/launch-enhancements.css','assets/lifecycle-home.css','assets/lifecycle.css','assets/orb.css'];
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const original=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,encoding:'utf8',maxBuffer:16*1024*1024});
const START='<!-- BAITNA-UI-V2-HEAD:START -->\n';
const END='<!-- BAITNA-UI-V2-HEAD:END -->\n';
function headOnly(content){
 const first=content.indexOf(START),last=content.indexOf(END);
 assert.ok(first>=0&&last>first,'missing presentation-only head markers');
 assert.equal(content.indexOf(START,first+START.length),-1,'duplicate UI block');
 assert.equal(content.indexOf(END,last+END.length),-1,'duplicate UI block close');
 assert.ok(last<content.indexOf('</head>'),'injected content must be in head');
 return {legacy:content.slice(0,first)+content.slice(last+END.length),newHead:content.slice(first+START.length,last)};
}

test('Agent 1 → Agent 9: all six HTML pages preserve every pre-existing byte, markup, label, role, link and inline script',()=>{
 for(const p of htmlPaths){
  const {legacy}=headOnly(read(p));
  assert.equal(legacy,original(p),p+' was modified beyond the allowlisted head');
 }
});

test('original business logic, sample values, permissions and existing CSS remain byte-identical',()=>{
 for(const p of [...businessJs,...existingCss]){
  assert.equal(read(p),original(p),p+' differs from governance baseline');
 }
});

test('all routes, anchors, IDs, data attributes, demo status strings and original scripts are frozen',()=>{
 // Exact HTML & JS checks above are stronger than an attribute-by-attribute comparison.
 const home=original('index.html'),next=headOnly(read('index.html')).legacy;
 assert.equal(next,home);
 const steps=['s1_t','s2_t','s3_t','s4_t','s5_t','s6_t'];
 const positions=steps.map(k=>next.indexOf('data-i18n="'+k+'"'));
 assert.ok(positions.every(x=>x>0));
 assert.ok(positions.every((v,i)=>i===0||v>positions[i-1]),'six stages changed order');
 const roles=['p1_t','p2_t','p3_t','p4_t','p5_t','p6_t'];
 assert.ok(roles.every(k=>next.includes('data-i18n="'+k+'"')),'role removed');
 const pilots=['ph0_d','ph1_d','ph2_d','kpi1','kpi2','kpi3','kpi4','kpi5'];
 assert.ok(pilots.every(k=>next.includes('data-i18n="'+k+'"')),'pilot altered');
 assert.ok(next.includes('id="graphViewport"')&&next.includes('id="graphPlus"'),'interactive explorer removed');
 assert.ok(next.includes('قدرات ذكاء اصطناعي مخطط لها'),'AI planned label changed');
});

test('regulator view and both finance approval modes have unchanged source code',()=>{
 assert.equal(headOnly(read('demo/authority.html')).legacy,original('demo/authority.html'));
 assert.equal(read('assets/lifecycle.js'),original('assets/lifecycle.js'));
 assert.equal(headOnly(read('demo/index.html')).legacy,original('demo/index.html'));
});

test('all six pages add one scoped style link and stable, tracking-free canonical URLs',()=>{
 const urls=new Map([
  ['index.html','https://ahmedyyya.github.io/Baitna/'],
  ['demo/lifecycle.html','https://ahmedyyya.github.io/Baitna/demo/lifecycle.html'],
  ['demo/orb.html','https://ahmedyyya.github.io/Baitna/demo/orb.html'],
  ['demo/compliance.html','https://ahmedyyya.github.io/Baitna/demo/compliance.html'],
  ['demo/index.html','https://ahmedyyya.github.io/Baitna/demo/'],
  ['demo/authority.html','https://ahmedyyya.github.io/Baitna/demo/authority.html']
 ]);
 for(const p of htmlPaths){
  const block=headOnly(read(p)).newHead;
  assert.equal((block.match(/baitna-ui-v2\.css/g)||[]).length,1,p+': style link');
  assert.ok(block.includes('rel="canonical" href="'+urls.get(p)+'"'),p+': canonical');
  assert.ok(!urls.get(p).includes('?')&&!urls.get(p).includes('#'),p+': tracking params');
  assert.ok(block.includes('og:locale:alternate'),p+': English social locale');
  assert.ok(block.includes('baitna-metadata-v2.js?v=2'),p+': parity script');
  assert.ok(!block.includes('name="robots"'),p+': overriding robots policy');
  assert.ok(!block.includes('name="description" lang='),p+': duplicate description');
 }
 const compliance=read('demo/compliance.html');
 assert.ok(compliance.includes('noindex,nofollow'),'regulator/reference noindex changed');
});

test('Acronym enhancement does not execute workflows, store data, or navigate',()=>{
 const tip=read('assets/baitna-glossary-v2.js'),meta=read('assets/baitna-metadata-v2.js');
 for(const [p,s] of [['glossary',tip],['metadata',meta]]){
  assert.ok(!/\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage|sendBeacon|indexedDB)\b/.test(s),p+': external/data API');
  assert.ok(!/\b(?:location\.href|location\.assign|history\.pushState)\b/.test(s),p+': navigation');
  assert.ok(!/\.innerHTML\s*=|\.textContent\s*=/.test(s),p+': content mutation');
 }
 assert.ok(tip.includes('MutationObserver'), 'locale changes are not followed');
 assert.ok(tip.includes('setAttribute("title"'),'native title unavailable');
});

test('minimum visual safety: focus, logical properties, reduced motion and responsive breakpoints',()=>{
 const css=read('assets/baitna-ui-v2.css');
 assert.ok(css.includes(':focus-visible'),'visible keyboard focus not styled');
 assert.ok(css.includes('prefers-reduced-motion:reduce'),'motion preference ignored');
 assert.ok(css.includes('prefers-color-scheme:light'),'no alternate appearance');
 for(const px of [1100,760,440])assert.ok(css.includes('max-width:'+px+'px'),'missing breakpoint '+px);
 assert.ok(css.includes('inset-inline-start'),'hard-coded LTR tooltip positioning');
 assert.ok(css.includes('#how .loop'),'loop visual system missing');
 assert.ok(css.includes('#parties .parties'),'role cards missing');
 assert.ok(css.includes('#pilot .phase'),'pilot visuals missing');
});

test('no additional JS business feature, dependency manifest, or data endpoint introduced',()=>{
 assert.ok(!fs.existsSync(path.join(ROOT,'package.json')),'new runtime dependency manifest');
 const css=read('assets/baitna-ui-v2.css');
 assert.ok(!/url\(\s*https?:/i.test(css),'remote asset dependency added');
 assert.ok(!/display\s*:\s*none[^}]*#(?:how|parties|pilot)/i.test(css),'frozen content hidden');
});
