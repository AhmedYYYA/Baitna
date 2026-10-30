/* BAITNA / Motion Engine 2.0. Additive enhancement only; existing application controllers stay authoritative. */
(function () {
  'use strict';
  var body = document.body;
  if (!body) return;
  var path = location.pathname.toLowerCase();
  var isAuthority = /\/demo\/authority\.html$/.test(path);
  var isDemo = !isAuthority && /\/demo\/?(?:index\.html)?$/.test(path);
  var mode = isAuthority ? 'authority' : isDemo ? 'demo' : 'landing';
  body.classList.add('bm-' + mode);
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var storedOff = false;
  try { storedOff = localStorage.getItem('baitna-motion-off') === '1'; } catch (e) {}
  var enabled = !storedOff && !motionQuery.matches;
  function language() { return document.documentElement.lang === 'en' ? 'en' : 'ar'; }
  function t(ar,en) { return language() === 'en' ? en : ar; }

  var motionToggle = document.createElement('button');
  motionToggle.type = 'button';
  motionToggle.className = 'bm-motion-toggle';
  function setMotion(on) {
    enabled = Boolean(on) && !motionQuery.matches;
    body.classList.toggle('bm-no-motion',!enabled);
    motionToggle.textContent = enabled ? t('إيقاف الحركة','Pause motion') : t('تفعيل الحركة','Enable motion');
    motionToggle.setAttribute('aria-pressed',String(!enabled));
    motionToggle.setAttribute('aria-label',t('تبديل تأثيرات الحركة','Toggle motion effects'));
    try { localStorage.setItem('baitna-motion-off',enabled?'0':'1'); } catch(e) {}
  }
  if (!isDemo) {
    body.appendChild(motionToggle);
    motionToggle.addEventListener('click',function(){setMotion(!enabled);});
  }
  setMotion(enabled);
  if (motionQuery.addEventListener) motionQuery.addEventListener('change',function(e){setMotion(!e.matches && !storedOff);});

  if ('IntersectionObserver' in window && enabled) {
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        entry.target.classList.add('bm-visible');
        observer.unobserve(entry.target);
      });
    },{threshold:.08,rootMargin:'0px 0px -25px 0px'});
    var revealSelector = isAuthority ? '.kpi,.panel,.bm-risk-board' : isDemo ? '.presenter > *' : 'section.block h2,section.block .intro,.loop li,.parties > div,.scene,.ai > *, .plan > *, .bm-flow';
    document.querySelectorAll(revealSelector).forEach(function(el,index){
      el.classList.add('bm-reveal');
      el.style.transitionDelay = Math.min(index % 6,4)*65+'ms';
      observer.observe(el);
    });
  }

  function attachGlow(elements){
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    elements.forEach(function(el){
      el.addEventListener('pointermove',function(evt){
        if(!enabled)return;
        var b=el.getBoundingClientRect();
        el.style.setProperty('--px',(evt.clientX-b.left)+'px');
        el.style.setProperty('--py',(evt.clientY-b.top)+'px');
      },{passive:true});
    });
  }

  /* Architectural building elevation: refined depth but never hijack scrolling. */
  if (mode === 'landing') {
    var h1 = document.querySelector('.hero h1');
    if (h1) {
      var eyebrow=document.createElement('span');
      eyebrow.className='bm-hero-kicker';
      h1.parentNode.insertBefore(eyebrow,h1);
      function syncEyebrow(){eyebrow.textContent=t('من العقد إلى المفتاح','FROM CONTRACT TO KEY');}
      syncEyebrow();
    }
    attachGlow([].slice.call(document.querySelectorAll('.parties > div,.loop li')));

    /* Real interactive SVG relationship map; preserves same 6-stage workflow. */
    var target=document.getElementById('how');
    if(target) {
      var section=document.createElement('section');
      section.className='bm-flow';
      section.id='workflow-map';
      section.setAttribute('aria-labelledby','bm-flow-heading');
      section.innerHTML='<div class="wrap"><div class="bm-flow-intro"><span class="bm-kicker" id="bm-flow-eyebrow"></span><h2 id="bm-flow-heading"></h2><p id="bm-flow-desc"></p></div><div class="bm-flow-shell"><div class="bm-flow-tools"><button type="button" id="bm-zoom-in" aria-label="Zoom in" title="Zoom in">+</button><button type="button" id="bm-zoom-out" aria-label="Zoom out" title="Zoom out">−</button><button type="button" id="bm-zoom-reset" aria-label="Reset zoom" title="Reset zoom" style="font-size:17px">⟲</button></div><svg role="group" aria-label="Interactive construction project workflow" viewBox="0 0 960 440" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="bm-glow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5cb9a0"/><stop offset="1" stop-color="#ddbd86"/></linearGradient><filter id="bm-shadow"><feGaussianBlur stdDeviation="16"/></filter></defs><g class="bm-flow-viewport" id="bm-flow-viewport"></g></svg><div class="bm-flow-caption" id="bm-flow-caption" aria-live="polite"></div></div><div class="bm-flow-legend" id="bm-flow-legend"></div></div>';
      target.parentNode.insertBefore(section,target);
      var stages=[
        {ar:'البند',en:'Contract item',dAr:'يُربط كل بند بالمخطط والمواصفات ونطاق العمل.',dEn:'A contract item links drawings, specifications and scope.'},
        {ar:'الدليل',en:'Site evidence',dAr:'صور الموقع والتقارير الفنية تثبت حالة التنفيذ.',dEn:'Site photos and engineering records document the work.'},
        {ar:'القرار',en:'Approval',dAr:'قرار فني معتمد من الاستشاري المخوّل.',dEn:'The authorized consultant records the technical decision.'},
        {ar:'الدفعة',en:'Payment',dAr:'المطالبة المالية مرتبطة بالإنجاز الموثّق.',dEn:'A payment request is linked to verified progress.'},
        {ar:'الفاتورة',en:'Invoice',dAr:'الفواتير والمستندات مرتبة وقابلة للتتبع.',dEn:'Invoices and records remain organized and traceable.'},
        {ar:'الضمان',en:'Warranty',dAr:'تنتقل شهادات الضمان مع ملف المسكن بعد التسليم.',dEn:'Warranty records remain with the home after handover.'}
      ];
      var coords=[[155,122],[480,122],[805,122],[805,314],[480,314],[155,314]];
      var edges='<path class="bm-edge" d="M255 122 H380 M580 122 H705 M805 162 V274 M705 314 H580 M380 314 H255"/><path class="bm-edge-activity" d="M255 122 H380 M580 122 H705 M805 162 V274 M705 314 H580 M380 314 H255"/>';
      var vp=section.querySelector('#bm-flow-viewport');
      var nodes=stages.map(function(s,i){
        var xy=coords[i];
        return '<g class="bm-node" data-step="'+i+'" tabindex="0" role="button" aria-pressed="'+(i===0?'true':'false')+'" transform="translate('+xy[0]+' '+xy[1]+')"><rect x="-100" y="-41" width="200" height="82" rx="16"/><circle cx="-76" cy="-20" r="4"/><text class="bm-node-main" y="3"></text><text class="bm-node-sub" y="25">'+('0'+(i+1)).slice(-2)+' / 06</text></g>';
      }).join('');
      vp.innerHTML=edges+nodes;
      var current=0,scale=1,tx=0,ty=0;
      function renderMap(){
        section.querySelector('#bm-flow-eyebrow').textContent=t('المسار الذكي','THE CONNECTED WORKFLOW');
        section.querySelector('#bm-flow-heading').textContent=t('رحلة واحدة. ست محطات مترابطة.','One journey. Six connected milestones.');
        section.querySelector('#bm-flow-desc').textContent=t('استكشف العلاقة بين البنود والأدلة والاعتمادات والمدفوعات، ثم قرّب المشهد وافتح كل محطة.','Explore the links between contract items, evidence, approvals and payments. Zoom in and select any milestone.');
        section.querySelector('#bm-flow-legend').innerHTML='<span>'+t('اضغط على أي محطة','Select any stage')+'</span><span>'+t('استخدم + و − للتقريب والإبعاد','Use + and − to zoom')+'</span>';
        vp.querySelectorAll('.bm-node').forEach(function(node,i){
          node.querySelector('.bm-node-main').textContent=language()==='en'?stages[i].en:stages[i].ar;
          node.setAttribute('aria-label',(i+1)+'. '+(language()==='en'?stages[i].en:stages[i].ar));
          node.setAttribute('aria-pressed',String(i===current));
        });
        var s=stages[current];
        section.querySelector('#bm-flow-caption').textContent=(current+1)+' / 06  —  '+(language()==='en'?s.dEn:s.dAr);
        vp.style.transform='translate('+tx+'px,'+ty+'px) scale('+scale+')';
      }
      function choose(idx){current=idx;renderMap();}
      vp.querySelectorAll('.bm-node').forEach(function(n){
        var id=Number(n.getAttribute('data-step'));
        n.addEventListener('click',function(){choose(id);});
        n.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(id);}});
      });
      function zoom(d){
        scale=Math.min(1.8,Math.max(.75,Math.round((scale+d)*100)/100));
        if(scale===1){tx=0;ty=0;}
        renderMap();
      }
      section.querySelector('#bm-zoom-in').addEventListener('click',function(){zoom(.2);});
      section.querySelector('#bm-zoom-out').addEventListener('click',function(){zoom(-.2);});
      section.querySelector('#bm-zoom-reset').addEventListener('click',function(){scale=1;tx=0;ty=0;renderMap();});
      /* Do not intercept normal wheel scrolling. Ctrl + wheel zoom is opt-in. */
      section.querySelector('svg').addEventListener('wheel',function(e){if(!e.ctrlKey)return;e.preventDefault();zoom(e.deltaY>0?-.1:.1);},{passive:false});
      var drag=null,svg=section.querySelector('svg');
      svg.addEventListener('pointerdown',function(e){
        if(e.target.closest('.bm-node') || e.pointerType==='touch')return;
        drag={x:e.clientX,y:e.clientY,bx:tx,by:ty};
        svg.setPointerCapture(e.pointerId);
      });
      svg.addEventListener('pointermove',function(e){
        if(!drag)return;
        tx=Math.max(-150,Math.min(150,drag.bx+(e.clientX-drag.x)*960/(svg.clientWidth||960)));
        ty=Math.max(-80,Math.min(80,drag.by+(e.clientY-drag.y)*440/(svg.clientHeight||440)));
        renderMap();
      });
      svg.addEventListener('pointerup',function(){drag=null;});
      svg.addEventListener('pointercancel',function(){drag=null;});
      renderMap();
    }
    var updateLanguage=new MutationObserver(function(){if(h1)syncEyebrow();if(target)renderMap();if(!isDemo) setMotion(enabled);});
    updateLanguage.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  }

  /* Demo: highlight progress; existing state/render/router remain untouched. */
  if(mode==='demo'){
    var presenter=document.querySelector('.presenter');
    if(presenter){
      var orbital=document.createElement('div');
      orbital.className='bm-demo-orbit';
      orbital.innerHTML='<div class="bm-orbit-ring" aria-label="42% example progress"><b>42%</b></div><div class="copy"><strong>رحلة بناء موثّقة</strong>42% تقدم توضيحي · من العقد إلى التسليم</div>';
      var presenterList=presenter.querySelector('ol');
      if(presenterList)presenter.insertBefore(orbital,presenterList);
    }
    /* Animations only; do not modify any demo screen data. */
    var bars=document.querySelectorAll('.screen .bar span,.screen .pkg .mini span');
    bars.forEach(function(bar){bar.classList.add('bm-meter');});
  }

  /* Authority: interactive risk donut derived from the visible demo data. */
  if(mode==='authority'){
    var rows=document.getElementById('rows'),kpis=document.getElementById('kpis');
    if(rows&&kpis){
      var board=document.createElement('section');
      board.className='bm-risk-board';
      board.setAttribute('aria-label','Risk distribution');
      board.innerHTML='<div><span class="bm-kicker">PORTFOLIO INTELLIGENCE</span><h2>توزيع المخاطر في المحفظة</h2><p>مؤشر تفاعلي يعتمد على بيانات المساكن التوضيحية داخل هذه البوابة.</p><p class="bm-risk-meta">اختر مستوى المخاطر لتصفية الجدول.</p></div><div class="bm-risk-chart"><svg viewBox="0 0 160 160" role="img" aria-label="Risk distribution chart"><g transform="rotate(-90 80 80)"><circle cx="80" cy="80" r="58" fill="none" stroke="#32574e" stroke-width="15"/><g id="bm-risk-arcs"></g></g><text x="80" y="79" text-anchor="middle" class="bm-risk-total" id="bm-risk-total">0</text><text x="80" y="99" text-anchor="middle" class="bm-risk-small">ملف</text></svg><div class="bm-risk-legend" id="bm-risk-legend"></div></div>';
      var layout=document.querySelector('.layout');
      if(layout) layout.parentNode.insertBefore(board,layout);
      var snapshot=null;
      function initialCounts(){
        var counted={h:0,m:0,l:0};
        rows.querySelectorAll('tr').forEach(function(tr){
          var badge=tr.querySelector('.risk.h,.risk.m,.risk.l');
          if(badge){if(badge.classList.contains('h'))counted.h++;else if(badge.classList.contains('m'))counted.m++;else counted.l++;}
        });
        return counted;
      }
      function riskRender(count){
        var total=count.h+count.m+count.l;
        board.querySelector('#bm-risk-total').textContent=total;
        var data=[{key:'h',v:count.h,name:'مرتفعة',color:'#e5a098'},{key:'m',v:count.m,name:'متوسطة',color:'#e5c28c'},{key:'l',v:count.l,name:'منخفضة',color:'#81cbb5'}];
        var len=2*Math.PI*58,offset=0,arcs=board.querySelector('#bm-risk-arcs');
        arcs.innerHTML='';
        data.forEach(function(d){
          var seg=document.createElementNS('http://www.w3.org/2000/svg','circle');
          var length=total?d.v/total*len:0;
          seg.setAttribute('cx','80');seg.setAttribute('cy','80');seg.setAttribute('r','58');seg.setAttribute('fill','none');seg.setAttribute('stroke',d.color);seg.setAttribute('stroke-width','15');
          seg.setAttribute('stroke-dasharray',Math.max(0,length-3)+' '+len);
          seg.setAttribute('stroke-dashoffset',String(-offset));
          seg.setAttribute('class','bm-risk-segment');
          seg.setAttribute('aria-label',d.name+': '+d.v);
          seg.addEventListener('click',function(){var chip=document.querySelector('.chip[data-f="'+d.key+'"]');if(chip)chip.click();});
          arcs.appendChild(seg);offset+=length;
        });
        board.querySelector('#bm-risk-legend').innerHTML='';
        data.forEach(function(d){
          var b=document.createElement('button');b.type='button';b.innerHTML='<span class="bm-risk-dot" style="background:'+d.color+'"></span><span>'+d.name+' · '+d.v+'</span>';
          b.addEventListener('click',function(){var chip=document.querySelector('.chip[data-f="'+d.key+'"]');if(chip)chip.click();});
          board.querySelector('#bm-risk-legend').appendChild(b);
        });
      }
      /* Original table is populated synchronously before this enhancer; cache the unfiltered full portfolio. */
      snapshot=initialCounts(); riskRender(snapshot);
      attachGlow([].slice.call(document.querySelectorAll('.kpi')));
    }
  }
})();