const $=s=>document.querySelector(s);
const els=s=>[...document.querySelectorAll(s)];
const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let currentUser='owner-a',allHomes=[],myProjects=[],projectId='',activeTab='overview',details=null;
const today=new Date().toISOString().slice(0,10);
const state={draftRevisionId:null};
function alertMsg(msg,error=false){const el=$('#alerts');el.textContent=msg;el.className=error?'error':'';clearTimeout(alertMsg.t);alertMsg.t=setTimeout(()=>{el.textContent='';el.className=''},6200)}
async function api(path,method='GET',body=null){let headers={'X-Demo-User':currentUser};if(body!==null)headers['Content-Type']='application/json';if(method==='POST'&&path==='/api/homes')headers['Idempotency-Key']=crypto.randomUUID()+'-home';const r=await fetch('/api'+path,{method,headers,body:body===null?undefined:JSON.stringify(body)});const data=await r.json();if(!r.ok)throw Error(`${data.code||r.status} — ${data.message||'تعذّر تنفيذ العملية'}`);return data}
const opts=(list,valueKey,labelFn,placeholder='اختر')=>'<option value="">'+safe(placeholder)+'</option>'+list.map(x=>`<option value="${safe(x[valueKey])}">${safe(labelFn(x))}</option>`).join('');
function val(sel){return $(sel)?.value||''}
function setTab(tab){activeTab=tab;els('.tab').forEach(e=>e.classList.toggle('hidden',e.id!==`tab-${tab}`));els('.navlink').forEach(e=>e.classList.toggle('active',e.dataset.tab===tab));if(tab==='audit')renderAudit().catch(e=>alertMsg(e.message,true))}
async function loadAll(){allHomes=await api('/homes');myProjects=await api('/projects/mine');let previously=projectId;if(!myProjects.some(p=>p.id===previously))projectId=myProjects[0]?.id||'';
  $('#projectSelect').innerHTML=opts(myProjects,'id',p=>`${p.name} · ${p.home_label}`,'لا يوجد مشروع متاح');$('#projectSelect').value=projectId;
  $('#homeInput').innerHTML=opts(allHomes,'id',h=>h.label+' / '+h.home_ref,'اختر المسكن');
  $('#homeCards').innerHTML=allHomes.length?allHomes.map(h=>`<div class="homecard"><small class="eyebrow">DIGITAL HOME RECORD</small><h3>${safe(h.label)}</h3><code>${safe(h.home_ref)}</code><p>الصلاحية: ${safe(h.role)} · مرحلة ${safe(h.phase)}</p></div>`).join(''):'<div class="empty">لا يوجد مسكن باسم هذا المستخدم. يمكن إنشاء مسكن جديد.</div>';
  if(projectId){details=await api(`/projects/${projectId}/overview`);render();}else{details=null;renderEmpty()}}
function renderEmpty(){ $('#heroHomeRef').textContent='لا يوجد مسكن';$('#projectDetail').textContent='';$('#stats').innerHTML='<div class="stat"><span>المشاريع المتاحة</span><strong>0</strong></div>';$('#pillars').innerHTML='<div class="empty">ابدأ بتسجيل مسكن وإنشاء مشروع.</div>';$('#critical').innerHTML='';$('#contractRecords').innerHTML='<div class="empty">لا يوجد مشروع محدد.</div>';$('#scheduleStatus').textContent='لا توجد جدولة مرتبطة بمشروع.';$('#revisionList').innerHTML='';$('#gantt').innerHTML='';$('#auditRecords').innerHTML=''}
const badge=s=>`<span class="pill ${s==='draft'?'draft':''}">${s==='approved'?'معتمد':'مسودة'}</span>`;
const no=label=>`<div class="empty">${safe(label)}</div>`;
function render(){const d=details;$('#heroHomeRef').textContent=d.home.home_ref;$('#projectDetail').textContent=`${d.project.project_ref} · ${d.project.project_kind}`;
  $('#stats').innerHTML=[['عقود المشروع',d.contracts.length,'Contract'],['بيانات الأعمال',d.sows.length,'SOW'],['حزم الأعمال',d.wbs.length,'WBS'],['أنشطة IMS',d.activities.length,'IMS']].map(x=>`<div class="stat"><span>${x[0]}</span><strong>${x[1]}</strong><em>${x[2]}</em></div>`).join('');
  $('#pillars').innerHTML=[['Contract',d.contracts.length+' عقد'],['SOW',d.sows.length+' بيان أعمال'],['IMS',d.ims?(d.ims.baseline_revision_id?'خط أساس معتمد':'مسودة غير معتمدة'):'غير منشأ']].map(x=>`<div class="pillar"><strong>${x[0]}</strong><span>${safe(x[1])}</span></div>`).join('');
  $('#critical').innerHTML=d.analysis?`<p class="hint">تاريخ الإنجاز الحسابي: <strong>${safe(d.analysis.completionDate)}</strong> · المدة: <strong>${d.analysis.totalDurationDays}</strong> يوماً.</p><div class="critical-tags">${d.analysis.criticalPathCodes.map(x=>`<span>${safe(x)}</span>`).join('')}</div>`:no('لم يُنشأ IMS بعد.');
  $('#contractInput').innerHTML=opts(d.contracts,'id',x=>x.contract_ref+' — '+x.counterparty,'اختر العقد');$('#sowInput').innerHTML=opts(d.sows,'id',x=>x.sow_ref+' — '+x.title,'دون SOW');
  for(const s of ['#boqWbsInput','#activityWbs'])$(s).innerHTML=opts(d.wbs,'id',x=>x.wbs_code+' — '+x.title,'اختر WBS');
  const list=[...d.contracts.map(c=>({type:'Contract',id:c.id,title:c.counterparty,ref:c.contract_ref,rev:c.revision_id,state:c.last_state})),...d.sows.map(s=>({type:'SOW',id:s.id,title:s.title,ref:s.sow_ref,rev:s.revision_id,state:s.last_state}))];
  $('#contractRecords').innerHTML=list.length?list.map(r=>`<div class="record"><div class="detail"><strong>${safe(r.ref)} — ${safe(r.title)}</strong><br><small>${r.type}</small></div>${badge(r.state)}${r.state!=='approved'?`<button class="btn small" data-approve="${r.type}" data-id="${safe(r.id)}" data-rev="${safe(r.rev)}">اعتماد</button>`:''}</div>`).join(''):no('لا توجد عقود أو بيانات أعمال حتى الآن.');
  const selectedDraft=d.revisions.find(x=>x.state==='draft');state.draftRevisionId=selectedDraft?.id||null;
  $('#scheduleStatus').innerHTML=d.ims?`<b>الجدول الموحد:</b> ${safe(d.ims.id)} · <b>بداية:</b> ${safe(d.ims.base_date)} · <b>خط الأساس:</b> ${d.ims.baseline_revision_id?'معتمد':'غير معتمد'}`:'لا يوجد IMS لهذا المشروع بعد. استخدم إنشاء / إظهار IMS أولاً.';
  $('#revisionList').innerHTML=d.revisions.map(x=>`<div class="record"><span>إصدار ${x.revision_no}</span>${badge(x.state)}${d.ims?.baseline_revision_id===x.id?'<small>الأساس الحالي</small>':''}</div>`).join('');
  $('#approveBaseline').disabled=!d.ims||!state.draftRevisionId;
  $('#depPre').innerHTML=opts(d.activities,'id',x=>x.code+' — '+x.title,'النشاط السابق');$('#depNext').innerHTML=opts(d.activities,'id',x=>x.code+' — '+x.title,'النشاط التالي');
  $('#scheduleSummary').textContent=d.analysis?`الإنجاز ${d.analysis.completionDate} · المدة ${d.analysis.totalDurationDays} يوم`:'';
  renderGantt(d);
}
function renderGantt(d){if(!d.analysis){$('#gantt').innerHTML=no('أنشئ أولاً نسخة من جدول IMS وأضف أنشطة');return;}const max=Math.max(d.analysis.totalDurationDays,1), start=Date.parse(d.ims.base_date+'T00:00:00Z');let html='<div class="gantt-row gantt-header"><span>النشاط</span><span>المدة ضمن الجدول</span><span>Float</span></div>';
  for(const a of d.analysis.activities){const from=(Date.parse(a.earliestStart+'T00:00:00Z')-start)/86400000,width=Math.max(0.9,a.durationDays/max*100),margin=Math.max(0,from/max*100);html+=`<div class="gantt-row"><span class="gantt-name">${safe(a.code)} · ${safe(a.title)}</span><div class="gantt-bar"><div class="gantt-fill ${a.critical?'critical':''}" style="width:${width}%;margin-right:${margin}%" title="${safe(a.earliestStart)}"></div></div><span class="gantt-float">${a.totalFloatDays}</span></div>`}
  $('#gantt').innerHTML=html;
}
async function renderAudit(){if(!details){$('#auditRecords').innerHTML=no('لا يوجد مسكن محدد');return;}try{const events=await api(`/homes/${details.home.id}/audit`);$('#auditRecords').innerHTML=events.length?events.map(x=>`<div class="event"><strong>${safe(x.action)}</strong><small>${safe(x.created_at)}</small></div>`).join(''):no('لا توجد أحداث');}catch(e){$('#auditRecords').innerHTML=no('سجل التدقيق متاح لمدير المسكن فقط')}}
async function mutate(action,form){if(!projectId&&!['create-home','create-project'].includes(action))throw Error('يجب إنشاء مشروع أولاً');const d=details,fd=new FormData(form),f=k=>String(fd.get(k)||'').trim();let result;
  if(action==='create-home')result=await api('/homes','POST',{label:f('label')});
  if(action==='create-project')result=await api(`/homes/${f('homeId')}/projects`,'POST',{name:f('name'),projectKind:f('projectKind')});
  if(action==='create-contract')result=await api(`/projects/${projectId}/contracts`,'POST',{counterparty:f('counterparty'),terms:{summary:f('description')}});
  if(action==='create-sow')result=await api(`/projects/${projectId}/sows`,'POST',{contractId:f('contractId'),title:f('title'),specification:{summary:f('specification')},acceptanceCriteria:[]});
  if(action==='create-wbs')result=await api(`/projects/${projectId}/wbs`,'POST',{code:f('code'),title:f('title'),sowId:f('sowId')||null});
  if(action==='create-boq')result=await api(`/projects/${projectId}/boq`,'POST',{wbsId:f('wbsId'),lineRef:f('lineRef'),description:f('description'),quantity:f('quantity'),unit:f('unit'),unitPriceAed:f('unitPriceAed')});
  if(action==='create-ims')result=await api(`/projects/${projectId}/ims`,'PUT',{baseDate:f('baseDate')});
  if(action==='create-revision'){if(!d.ims)throw Error('أنشئ IMS أولاً');result=await api(`/ims/${d.ims.id}/revisions`,'POST',{description:f('description')});}
  if(action==='create-activity'){if(!state.draftRevisionId)throw Error('أنشئ إصدار مسودة قبل إضافة الأنشطة');result=await api(`/ims-revisions/${state.draftRevisionId}/activities`,'POST',{code:f('code'),title:f('title'),durationDays:Number(f('durationDays')),plannedStart:f('plannedStart'),wbsId:f('wbsId')});}
  if(action==='create-dependency'){if(!state.draftRevisionId)throw Error('أنشئ إصدار مسودة قبل الربط');result=await api(`/ims-revisions/${state.draftRevisionId}/dependencies`,'POST',{predecessorId:f('predecessorId'),successorId:f('successorId'),linkType:f('linkType'),lagDays:Number(f('lagDays')||0)});}
  if(!result)throw Error('إجراء غير مدعوم');if(action==='create-home'||action==='create-project'){setTab('registry');if(action==='create-project')projectId=result.id;}
  form.reset();await loadAll();alertMsg('تم حفظ العملية في قاعدة البيانات المحلية');
}
async function init(){try{const users=await api('/demo/users');$('#account').innerHTML=users.map(u=>`<option value="${safe(u.id)}">${safe(u.name)}</option>`).join('');$('#account').value=currentUser;els('.navlink').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));$('#account').addEventListener('change',async e=>{currentUser=e.target.value;projectId='';try{await loadAll()}catch(x){alertMsg(x.message,true)}});$('#projectSelect').addEventListener('change',async e=>{projectId=e.target.value;try{await loadAll()}catch(x){alertMsg(x.message,true)}});
    els('form[data-action]').forEach(form=>form.addEventListener('submit',async e=>{e.preventDefault();try{await mutate(form.dataset.action,form)}catch(x){alertMsg(x.message,true)}}));
    $('#contractRecords').addEventListener('click',async e=>{const b=e.target.closest('[data-approve]');if(!b)return;try{const kind=b.dataset.approve==='Contract'?'contracts':'sows';await api(`/${kind}/${b.dataset.id}/revisions/${b.dataset.rev}/approve`,'POST',{});await loadAll();alertMsg('تم اعتماد الإصدار في البيئة التجريبية')}catch(x){alertMsg(x.message,true)}});
    $('#approveBaseline').addEventListener('click',async()=>{if(!details?.ims||!state.draftRevisionId)return;try{await api(`/ims/${details.ims.id}/baseline-approvals`,'POST',{revisionId:state.draftRevisionId});await loadAll();alertMsg('تم اعتماد خط الأساس دون تغيير الإصدارات السابقة')}catch(x){alertMsg(x.message,true)}});
    els('input[type=date]').forEach(x=>x.value=today);await loadAll();}catch(e){alertMsg(e.message,true)}}
init();