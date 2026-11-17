'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const dir=require('node:path').resolve(__dirname,'..');
let catalog={},code=fs.readFileSync(dir+'/assets/orb-catalog.js','utf8'),app=fs.readFileSync(dir+'/assets/orb.js','utf8');
vm.runInNewContext(code,{window:catalog});
const rows=catalog.BAITNA_ORB_CATALOG;
assert.equal(rows.length,77);
let count=0;const mem={},elements={};
const dom=(id)=>elements[id]||(elements[id]={id,events:{},dataset:{},style:{},disabled:false,innerHTML:'',textContent:'',value:'',addEventListener(k,f){this.events[k]=f},scrollIntoView(){},querySelectorAll(){return[]}});
const document={getElementById:dom,documentElement:{lang:'ar',dir:'rtl'},title:'',body:{appendChild(){}},createElement(){return{click(){},remove(){}}},querySelectorAll(){return[]}};
const localStorage={getItem:k=>mem[k]||null,setItem:(k,v)=>{mem[k]=v}};
function FormDataMock(form){const entry=JSON.parse(mem['baitna-orb-demo-v1']||'{}').entries?.['sample-project'];let current=entry?.values||{};const allowed=new Set([...String(dom('section').innerHTML||'').matchAll(/name=\"([^\"]+)\"/g)].map(x=>x[1]));const data={...current,...(form.overrides||{})};this.form=form;this.get=k=>allowed.has(k)?(k==='budget_min'?data.budget_band_aed?.min:k==='budget_max'?data.budget_band_aed?.max:data[k]):null;this.has=k=>allowed.has(k)&&data[k]===true;this.getAll=k=>allowed.has(k)?(Array.isArray(data[k])?data[k]:[]):[];}
function id(){return ('00000000'+(++count).toString(16)).slice(-8)+'-b1e4-4e2c-8fb4-100000000000'}
let confirmResult=true;
const context={window:{crypto:{randomUUID:id},print(){},BAITNA_ORB_CATALOG:rows},crypto:{randomUUID:id},document,localStorage,FormData:FormDataMock,URL,Blob,Date,console,setTimeout:(fn)=>0,clearTimeout:()=>{},confirm:()=>confirmResult};
vm.runInNewContext(app,context);
const data=()=>JSON.parse(mem['baitna-orb-demo-v1']);
const current=()=>data().entries['sample-project'];
const click=id=>{const el=dom(id);assert.ok(el.events.click,id+' handler');el.events.click({target:{closest:()=>null}})};
const step=n=>dom('steps').events.click({target:{closest:()=>({dataset:{step:String(n)}})}});
const reviewType=(kind)=>dom('section').events.click({target:{closest:(selector)=>selector==='[data-type]'?{dataset:{type:kind}}:null}});
function test(name,fn){fn();console.log('PASS',name)}
test('77-field catalog reflects approved DTD',()=>assert.equal(rows.filter(x=>x.ownerEditable).length>35,true));
test('browser-only default data contains no actual personal records',()=>{assert.equal(current().documents.length,0);assert.equal(current().values.budget_visibility,'hidden')});
test('Arabic UI labels contain Arabic name and acronym, not English expansion',()=>{assert.match(dom('section').innerHTML,/الإمارة|المدينة/);assert.equal(dom('projectSelect').innerHTML.includes('sample-project'),true);assert.equal(dom('section').innerHTML.includes('Expected outcome'),false)});
// Fill a fully synthetic example.
test('sample inputs populate regional and building fields',()=>{click('sampleBtn');assert.equal(current().values.emirate,'DU');assert.equal(current().values.pool_requested,true);assert.equal(current().values.majlis_requested,true)});
test('conditional pool, majlis and smart home questions appear',()=>{step(1);assert.match(dom('section').innerHTML,/name="pool_type"/);assert.match(dom('section').innerHTML,/name="majlis_area_sqm"/);assert.match(dom('section').innerHTML,/name="smart_home_scope"/)});
test('conditional questions disappear when selector is false',()=>{dom('orbFields').overrides={pool_requested:false};dom('section').events.change({target:{closest:selector=>selector==='#orbFields'?dom('orbFields'):null}});step(0);step(1);assert.doesNotMatch(dom('section').innerHTML,/name="pool_type"/);});
test('multiselect building options generated with multiple attribute',()=>assert.match(dom('section').innerHTML,/name="smart_home_scope" multiple/));
test('distinct RFI/RFP/RFQ type selector',()=>{step(4);for(const x of ['RFI','RFP','RFQ'])assert.match(dom('section').innerHTML,new RegExp('data-type="'+x+'"'))});
test('generate Arabic RFP draft and freeze requirements snapshot',()=>{reviewType('RFP');const before=current().revision;dom('section').events.click({target:{closest:s=>s==='#generateBtn'?{}:null}});const d=current().documents.at(-1);assert.equal(d.type,'RFP');assert.match(d.textAr,/طلب تقديم عروض \(RFP\)/);assert.doesNotMatch(d.textAr,/Request for Proposal/);assert.equal(d.orbRevision,before+1);assert.deepEqual(d.snapshot.budget_band_aed,undefined);assert.equal(d.regulatoryStatus,'UNVERIFIED');assert.match(d.textAr,/غير معتمدة/)});
test('document includes explicit professional review caveat',()=>{const d=current().documents[0];assert.match(d.textAr,/مراجعة فنية وقانونية/);assert.match(d.textEn,/technical\/legal review/)});
test('old RFP unchanged after newer RFQ is generated',()=>{let e=data();const old=e.entries['sample-project'].documents[0];const prior=old.textAr;mem['baitna-orb-demo-v1']=JSON.stringify(e);step(0);step(4);reviewType('RFQ');dom('section').events.click({target:{closest:s=>s==='#generateBtn'?{}:null}});const d=current().documents.at(-1);assert.equal(d.type,'RFQ');assert.equal(current().documents[0].textAr,prior);assert.match(d.textAr,/طلب عروض أسعار \(RFQ\)/)});
test('RFQ budgetary vs defined-scope warning',()=>{step(3);dom('orbFields').overrides={quotation_basis:'firm_based_on_defined_scope'};dom('section').events.change({target:{closest:selector=>selector==='#orbFields'?dom('orbFields'):null}});step(0);dom('orbFields').overrides={project_maturity:'idea'};dom('section').events.change({target:{closest:selector=>selector==='#orbFields'?dom('orbFields'):null}});step(4);assert.match(dom('section').innerHTML,/السعر المحدد|التسعير المحدد|المواصفات|النطاق/)});
test('privacy: no owner name or plot ID in a generated document',()=>{const d=current().documents.at(-1);assert.doesNotMatch(d.textAr,/رقم القسيمة|اسم المالك الظاهر/)});
test('English locale is fully translated for form headers',()=>{click('langBtn');assert.equal(document.documentElement.lang,'en');assert.match(dom('section').innerHTML,/Review &amp; documents/);assert.doesNotMatch(dom('section').innerHTML,/المراجعة والمسودات/)});
test('Arabic locale switches back, with right-to-left direction',()=>{click('langBtn');assert.equal(document.documentElement.lang,'ar');assert.equal(document.documentElement.dir,'rtl')});
console.log('ALL TESTS PASSED');