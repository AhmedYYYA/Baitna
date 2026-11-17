import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createLocalServer} from '../server.js';
import {analyzeSchedule,ScheduleError} from '../schedule.js';
async function preview(t,{seedExample=true}={}) {
 const tmp=mkdtempSync(path.join(os.tmpdir(),'baitna-test-'));const dbPath=path.join(tmp,'dev.sqlite');
 const {server,store}=createLocalServer({dbPath,seedExample});
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 t.after(async()=>{await new Promise(resolve=>server.close(resolve));store.close();rmSync(tmp,{recursive:true,force:true})});
 const base=`http://127.0.0.1:${server.address().port}`;
 const req=async(method,endpoint,data=null,actor='owner-a',headers={})=>{
   const res=await fetch(base+endpoint,{method,headers:{'X-Demo-User':actor,...(data===null?{}:{'Content-Type':'application/json'}),...headers},body:data===null?undefined:JSON.stringify(data)});
   let obj;try{obj=await res.json()}catch{obj=await res.text()};return{status:res.status,data:obj};
 };return{store,base,req,dbPath};
}
test('local website, health and synthetic identities work without npm dependencies',async t=>{
 const {req,base}=await preview(t);assert.equal((await req('GET','/api/health')).data.mode,'LOCAL_DEMO');
 const u=await req('GET','/api/demo/users');assert.equal(u.data.length,5);
 const page=await fetch(base+'/app');assert.equal(page.status,200);assert.match(await page.text(),/الهوية|Home|المسكن/);
});
test('Home ID generated server-side, unique, immutable; create-home is idempotent',async t=>{
 const {req,store}=await preview(t,{seedExample:false});const key='test-unique-key-2026-11-17';
 const a=await req('POST','/api/homes',{label:'مسكن 1'},'owner-a',{'Idempotency-Key':key});assert.equal(a.status,201);assert.match(a.data.home_ref,/^BT-H-[A-F0-9]{32}$/);
 const replay=await req('POST','/api/homes',{label:'مسكن 1'},'owner-a',{'Idempotency-Key':key});assert.equal(replay.data.id,a.data.id);
 const conflict=await req('POST','/api/homes',{label:'مسكن جديد'},'owner-a',{'Idempotency-Key':key});assert.equal(conflict.status,409);
 const b=await req('POST','/api/homes',{label:'مسكن 2'},'owner-a',{'Idempotency-Key':'test-different-key-2026'});assert.notEqual(a.data.home_ref,b.data.home_ref);
 assert.throws(()=>store.run('UPDATE homes SET home_ref=? WHERE id=?',b.data.home_ref,a.data.id),/Permanent Home ID is immutable/);
});
test('owner, contractor and unrelated owner are isolated at the API layer',async t=>{
 const {req}=await preview(t);const homes=await req('GET','/api/homes');const homeId=homes.data[0].id;
 assert.equal((await req('GET',`/api/homes/${homeId}`,null,'owner-b')).status,404);
 assert.equal((await req('GET',`/api/homes/${homeId}`,null,'contractor-a')).status,404);
 assert.equal((await req('POST',`/api/homes/${homeId}/projects`,{name:'steal',projectKind:'maintenance'},'owner-b')).status,404);
 const ps=await req('GET','/api/projects/mine',null,'contractor-a');assert.equal(ps.status,200);assert.equal(ps.data.length,1);
 const p=ps.data[0];assert.equal((await req('GET',`/api/projects/${p.id}/overview`,null,'contractor-a')).status,200);
 assert.equal((await req('POST',`/api/projects/${p.id}/contracts`,{counterparty:'test'},'contractor-a')).status,403);
 assert.equal((await req('GET',`/api/homes/${homeId}/audit`,null,'contractor-a')).status,404);
});
test('new build and later maintenance retain exact same home reference',async t=>{
 const {req}=await preview(t);const h=(await req('GET','/api/homes')).data[0];const before=(await req('GET',`/api/homes/${h.id}/projects`)).data.length;
 const p=await req('POST',`/api/homes/${h.id}/projects`,{name:'صيانة بعد التسليم',projectKind:'maintenance'});assert.equal(p.status,201);assert.equal(p.data.home_id,h.id);
 const latest=(await req('GET',`/api/homes/${h.id}`)).data;assert.equal(latest.home_ref,h.home_ref);assert.equal((await req('GET',`/api/homes/${h.id}/projects`)).data.length,before+1);
});
test('Contract/SOW independently versioned; cross-project SOW cannot reference contract',async t=>{
 const {req,store}=await preview(t);const home=(await req('GET','/api/homes')).data[0],projects=(await req('GET',`/api/homes/${home.id}/projects`)).data;
 const other=(await req('POST',`/api/homes/${home.id}/projects`,{name:'مشروع تجديد آخر',projectKind:'renovation'})).data;
 const primary=(await req('GET',`/api/projects/${projects[0].id}/overview`)).data;const c=primary.contracts[0];
 assert.equal((await req('POST',`/api/projects/${other.id}/sows`,{contractId:c.id,title:'invalid'})).status,422);
 const newC=await req('POST',`/api/projects/${other.id}/contracts`,{counterparty:'مقاول ثان',terms:{price:'1000'}});assert.equal(newC.status,201);
 const newS=await req('POST',`/api/projects/${other.id}/sows`,{contractId:newC.data.id,title:'عزل',specification:{a:1}});assert.equal(newS.status,201);
 const v2=await req('POST',`/api/contracts/${c.id}/revisions`,{terms:{additional:'new'}});assert.equal(v2.status,201);
 const approval=await req('POST',`/api/contracts/${c.id}/revisions/${v2.data.id}/approve`,{});assert.equal(approval.status,200);
 assert.throws(()=>store.run('UPDATE contract_revisions SET terms=? WHERE id=?','{}',v2.data.id),/immutable/i);
 const s2=await req('POST',`/api/sows/${newS.data.id}/revisions`,{specification:{rev:2}});assert.equal(s2.status,201);
 assert.equal((await req('POST',`/api/sows/${newS.data.id}/revisions/${s2.data.id}/approve`,{})).status,200);
 assert.throws(()=>store.run('UPDATE sow_revisions SET specification=? WHERE id=?','{}',s2.data.id),/immutable/i);
});
test('BOQ and WBS are bound to project, never borrowed from other project',async t=>{
 const {req}=await preview(t);const p=(await req('GET','/api/projects/mine')).data[0];const d=(await req('GET',`/api/projects/${p.id}/overview`)).data;
 const other=(await req('POST',`/api/homes/${d.home.id}/projects`,{name:'مشروع مختلف',projectKind:'renovation'})).data;
 assert.equal((await req('POST',`/api/projects/${other.id}/boq`,{wbsId:d.wbs[0].id,lineRef:'X',description:'X',quantity:'1',unit:'u',unitPriceAed:'1'})).status,422);
 assert.equal((await req('POST',`/api/projects/${other.id}/wbs`,{sowId:d.sows[0].id,code:'X',title:'X'})).status,422);
 const valid=await req('POST',`/api/projects/${p.id}/boq`,{wbsId:d.wbs[0].id,lineRef:'B002',description:'بند مستقل',quantity:'1.5',unit:'م²',unitPriceAed:'24.12'});assert.equal(valid.status,201);
});
test('IMS has one master per project, immutable approved baseline and new draft',async t=>{
 const {req,store}=await preview(t);const p=(await req('GET','/api/projects/mine')).data[0],d=(await req('GET',`/api/projects/${p.id}/overview`)).data;
 const old=d.ims.baseline_revision_id;assert.ok(old);const again=await req('PUT',`/api/projects/${p.id}/ims`,{baseDate:'2030-01-01'});assert.equal(again.data.id,d.ims.id);assert.equal(again.data.base_date,d.ims.base_date);
 assert.equal((await req('POST',`/api/ims-revisions/${old}/activities`,{wbsId:d.wbs[0].id,code:'X',title:'X',durationDays:1,plannedStart:'2026-11-01'})).status,409);
 const v2=(await req('POST',`/api/ims/${d.ims.id}/revisions`,{description:'تعديل مستقبلي'})).data;
 const a1=(await req('POST',`/api/ims-revisions/${v2.id}/activities`,{wbsId:d.wbs[0].id,code:'Z1',title:'Z1',durationDays:10,plannedStart:'2026-11-01'})).data;
 const a2=(await req('POST',`/api/ims-revisions/${v2.id}/activities`,{wbsId:d.wbs[1].id,code:'Z2',title:'Z2',durationDays:10,plannedStart:'2026-11-01'})).data;
 assert.equal((await req('POST',`/api/ims-revisions/${v2.id}/dependencies`,{predecessorId:a1.id,successorId:a2.id,linkType:'FS',lagDays:1})).status,201);
 assert.equal((await req('POST',`/api/ims-revisions/${v2.id}/dependencies`,{predecessorId:a2.id,successorId:a1.id,linkType:'FS',lagDays:0})).status,422);
 const analysis=(await req('GET',`/api/ims-revisions/${v2.id}/analysis`)).data;assert.ok(analysis.totalDurationDays>=21);assert.ok(analysis.activities.length>=8,'new revision clones the approved baseline while preserving its historical copy');
 let pre=(await req('GET',`/api/projects/${p.id}/overview`)).data;assert.equal(pre.ims.baseline_revision_id,old);
 assert.equal((await req('POST',`/api/ims/${d.ims.id}/baseline-approvals`,{revisionId:v2.id})).status,200);
 let after=(await req('GET',`/api/projects/${p.id}/overview`)).data;assert.equal(after.ims.baseline_revision_id,v2.id);
 assert.equal((await req('POST',`/api/ims-revisions/${v2.id}/activities`,{wbsId:d.wbs[0].id,code:'Z3',title:'Z3',durationDays:2,plannedStart:'2026-11-01'})).status,409);
 assert.throws(()=>store.run('UPDATE ims_revisions SET description=? WHERE id=?','changed',v2.id),/immutable/i);
 assert.equal(store.get('SELECT state FROM ims_revisions WHERE id=?',old).state,'approved');
});
test('CPM supports FS, SS, FF, SF and detects cycles',()=>{
 const activities=[{id:'A',code:'A',title:'A',wbs_id:'X',duration_days:10,planned_start:'2026-11-01'},{id:'B',code:'B',title:'B',wbs_id:'X',duration_days:5,planned_start:'2026-11-01'},{id:'C',code:'C',title:'C',wbs_id:'X',duration_days:4,planned_start:'2026-11-01'}];
 for(const linkType of ['FS','SS','FF','SF']){
 const v=analyzeSchedule({baseDate:'2026-11-01',activities,dependencies:[{predecessor_id:'A',successor_id:'B',link_type:linkType,lag_days:0}]});assert.ok(v.activities.length===3);}
 assert.throws(()=>analyzeSchedule({baseDate:'2026-11-01',activities,dependencies:[{predecessor_id:'A',successor_id:'B',link_type:'FS',lag_days:0},{predecessor_id:'B',successor_id:'A',link_type:'SS',lag_days:0}]}),ScheduleError);
});
test('audit events cannot be rewritten or deleted',async t=>{
 const {store}=await preview(t);const e=store.get('SELECT id FROM audit_events LIMIT 1');assert.ok(e);
 assert.throws(()=>store.run('DELETE FROM audit_events WHERE id=?',e.id),/append-only/);
 assert.throws(()=>store.run('UPDATE audit_events SET action=? WHERE id=?','falsified',e.id),/append-only/);
});
test('missing demo identity rejected, no external CORS, static files not accessible through traversal',async t=>{
 const {req,base}=await preview(t);
 const raw=await fetch(base+'/api/homes');assert.equal(raw.status,401);
 assert.equal((await req('GET','/api/homes',null,'unknown')).status,401);
 assert.equal((await req('POST','/api/homes',{label:'test'},'owner-a',{'Origin':'https://evil.example','Idempotency-Key':'test-cross-origin-2026'})).status,403);
 const badPage=await fetch(base+'/app/../schema.sql');assert.equal(badPage.status,404);
});