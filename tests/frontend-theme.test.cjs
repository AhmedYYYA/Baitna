/**
 * BAITNA frontend design regression checks (Node.js built-in test runner).
 * Run: node --test tests/frontend-theme.test.cjs
 * Does not replace visual/browser testing. No third-party packages.
 */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const css=read('assets/baitna-design-system.css');

const surfaces=[
 ['index.html','landing','assets/baitna-design-system.css'],
 ['demo/lifecycle.html','workspace','../assets/baitna-design-system.css'],
 ['demo/orb.html','orb','../assets/baitna-design-system.css'],
 ['demo/compliance.html','compliance','../assets/baitna-design-system.css'],
 ['demo/index.html','classic','../assets/baitna-design-system.css'],
 ['demo/authority.html','authority','../assets/baitna-design-system.css']
];

test('all six pages load the unified stylesheet and retain document landmarks',()=>{
 for(const [file,surface,href] of surfaces){
  const html=read(file);
  assert.ok(html.includes('data-baitna-surface="'+surface+'"'),file+': surface marker');
  assert.ok(html.includes('href="'+href+'?v=1"'),file+': stylesheet missing');
  assert.ok(html.includes('</head>')&&html.includes('</html>'),file+': document closed');
 }
});
test('both Arabic and English font stacks prioritize Dubai',()=>{
 assert.match(css,/--bt-font:"Dubai","Dubai Regular","Dubai Medium"/);
 assert.match(css,/html,body,body button,body input,body select/);
 assert.match(css,/font-family:var\(--bt-font\)\s*!important/);
});
test('font binaries are not redistributed in this public repository',()=>{
 const files=fs.readdirSync(path.join(root,'assets'));
 assert.ok(!files.some(f=>/dubai.*\.(woff2?|otf|ttf)$/i.test(f)),'unlicensed Dubai font asset');
 assert.ok(!css.replace(/\/\*[\s\S]*?\*\//g,'').includes('@font-face'),'Dubai font embedding requires separate rights clearance');
});
test('front-end serves responsive and reduced-motion preferences',()=>{
 assert.match(css,/@media\(max-width:960px\)/);
 assert.match(css,/@media\(max-width:760px\)/);
 assert.match(css,/@media\(max-width:520px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/:focus-visible/);
});
test('the existing interactive pages retain their scripts, IDs and language toggles',()=>{
 const page=read('demo/lifecycle.html');
 assert.ok(page.includes('id="langToggle"'));
 assert.ok(page.includes('id="homeSelect"')&&page.includes('id="projectSelect"'));
 assert.ok(page.includes('lifecycle.js'));
 const orb=read('demo/orb.html');
 assert.ok(orb.includes('id="langBtn"')&&orb.includes('orb.js'));
 assert.ok(orb.includes('id="section"')&&orb.includes('id="documents"'));
 const cmp=read('demo/compliance.html');
 assert.ok(cmp.includes('id="emirate"')&&cmp.includes('id="kind"')&&cmp.includes('id="lang"'));
});
test('landing page links the live ORB and official source navigator',()=>{
 const html=read('index.html');
 assert.ok(html.includes('href="demo/orb.html"'));
 assert.ok(html.includes('href="demo/compliance.html"'));
 assert.ok(html.includes('href="demo/lifecycle.html"'));
});
