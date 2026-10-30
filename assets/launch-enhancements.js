/* BAITNA | Launch enhancements.
   Progressive UX only; authoritative application and regulatory demo logic unchanged. */
(function () {
  'use strict';
  var doc = document, body = doc.body;
  if (!body) return;

  var reduction = window.matchMedia('(prefers-reduced-motion: reduce)');
  var inactiveByChoice = false;
  try { inactiveByChoice = localStorage.getItem('baitna-animation-disabled') === 'yes'; } catch (e) {}
  var toggle = doc.createElement('button');
  toggle.type = 'button';
  toggle.className = 'bm-motion-switch';
  toggle.setAttribute('aria-pressed','false');

  function text(ar,en) { return doc.documentElement.lang === 'en' ? en : ar; }
  function motionEnabled(){ return !reduction.matches && !inactiveByChoice; }
  function syncMotion(){
    var motion = motionEnabled();
    body.classList.toggle('bm-no-motion',!motion);
    toggle.disabled = reduction.matches;
    toggle.textContent = reduction.matches
      ? text('الحركة محدودة حسب إعدادات الجهاز','Motion reduced by device settings')
      : motion ? text('إيقاف الحركة','Pause motion')
               : text('تشغيل الحركة','Enable motion');
    toggle.setAttribute('aria-label', text('تبديل المؤثرات الحركية','Toggle animated effects'));
    toggle.setAttribute('aria-pressed',String(!motion));
    /* Stop SVG animation in the lifecycle graph without modifying graph navigation. */
    doc.querySelectorAll('#graphViewport svg').forEach(function(svg){
      try { if (motion && svg.unpauseAnimations) svg.unpauseAnimations();
            else if (!motion && svg.pauseAnimations) svg.pauseAnimations(); } catch (e) {}
    });
  }
  toggle.addEventListener('click',function(){
    inactiveByChoice=!inactiveByChoice;
    try { localStorage.setItem('baitna-animation-disabled',inactiveByChoice?'yes':'no'); } catch (e) {}
    syncMotion();
  });
  if (reduction.addEventListener) reduction.addEventListener('change',syncMotion);
  new MutationObserver(syncMotion).observe(doc.documentElement,{attributes:true,attributeFilter:['lang']});
  body.appendChild(toggle);
  syncMotion();

  /* Enhance existing owner/contractor demo presenter; never touch demo state. */
  if (body.dataset.uiDesign === 'demo'){
    var presenter = doc.querySelector('.presenter');
    var sequence = presenter && presenter.querySelector('ol');
    if (sequence && !presenter.querySelector('.bm-demo-orbit')){
      var orbit = doc.createElement('div');
      orbit.className = 'bm-demo-orbit bm-appear';
      orbit.setAttribute('aria-label','Example construction progress: 42 percent');
      orbit.innerHTML = '<div class="bm-orbit-ring" aria-hidden="true"><b>42%</b></div><div class="bm-orbit-copy"><strong>تقدم المشروع التوضيحي</strong>الإنجاز المعتمد · بيانات افتراضية للعرض</div>';
      presenter.insertBefore(orbit,sequence);
    }
  }

  /* Regulator portal: risk portfolio summary from existing DOM.
     Chart does not change score calculations, risk weights or decision authority. */
  if (body.dataset.uiDesign === 'authority'){
    var rows = doc.getElementById('rows'), kpis = doc.getElementById('kpis');
    var layout = doc.querySelector('.layout');
    if (!rows || !kpis || !layout) return;
    var counts = {h:0,m:0,l:0};
    rows.querySelectorAll('tr').forEach(function(row){
      var risk = row.querySelector('.risk');
      if(!risk)return;
      if(risk.classList.contains('h'))counts.h++;
      else if(risk.classList.contains('m'))counts.m++;
      else if(risk.classList.contains('l'))counts.l++;
    });
    var total=counts.h+counts.m+counts.l;
    var board=doc.createElement('section');
    board.className='bm-risk-board bm-appear';
    board.setAttribute('aria-labelledby','bm-risk-title');
    board.innerHTML='<div><span class="bm-kicker">BAITNA / PORTFOLIO INTELLIGENCE</span><h2 id="bm-risk-title">تحليل مخاطر محفظة المشاريع</h2><p>توزيع المخاطر محسوب من بيانات المشاريع التوضيحية الموجودة في الجدول. اضغط على مستوى لعرض المشاريع ذات الصلة.</p><p class="bm-risk-remark">مؤشرات توضيحية · لا تُعد قراراً رقابياً فعلياً</p></div><div class="bm-risk-visual"><svg viewBox="0 0 160 160" role="img" aria-label="توزيع مخاطر المشاريع"><g transform="rotate(-90 80 80)"><circle cx="80" cy="80" r="57" fill="none" stroke="#34584d" stroke-width="17"/><g id="bm-risk-segments"></g></g><text class="bm-risk-total" id="bm-risk-total" x="80" y="79">0</text><text class="bm-risk-unit" x="80" y="100">مشروع</text></svg><div class="bm-risk-legend" id="bm-risk-legend" role="group" aria-label="تصفية المشاريع حسب المخاطر"></div></div>';
    layout.parentNode.insertBefore(board,layout);
    doc.getElementById('bm-risk-total').textContent=String(total);
    var legend=doc.getElementById('bm-risk-legend');
    var group=doc.getElementById('bm-risk-segments');
    var circumference=2*Math.PI*57,position=0;
    var groups=[
      {key:'h',label:'مرتفعة',value:counts.h,color:'#e8a099'},
      {key:'m',label:'متوسطة',value:counts.m,color:'#e4bf82'},
      {key:'l',label:'منخفضة',value:counts.l,color:'#83cfb2'}
    ];
    function filter(key){
      var chip=doc.querySelector('#chips .chip[data-f="'+key+'"]');
      if(chip)chip.click();
      updateLegend();
    }
    function updateLegend(){
      var chosen=doc.querySelector('#chips .chip[aria-pressed="true"]');
      var active=chosen && chosen.getAttribute('data-f');
      legend.querySelectorAll('button').forEach(function(btn){
        btn.setAttribute('aria-pressed',String(btn.dataset.risk===active));
      });
    }
    groups.forEach(function(g){
      var portion=total?g.value/total*circumference:0;
      if(portion>0){
        var circle=doc.createElementNS('http://www.w3.org/2000/svg','circle');
        circle.setAttribute('cx','80'); circle.setAttribute('cy','80');
        circle.setAttribute('r','57'); circle.setAttribute('fill','none');
        circle.setAttribute('stroke',g.color); circle.setAttribute('stroke-width','17');
        circle.setAttribute('stroke-dasharray',Math.max(0,portion-3)+' '+circumference);
        circle.setAttribute('stroke-dashoffset',String(-position));
        circle.setAttribute('class','bm-risk-segment');
        circle.setAttribute('aria-label',g.label+' '+g.value);
        circle.addEventListener('click',function(){filter(g.key);});
        group.appendChild(circle);
      }
      position+=portion;
      var btn=doc.createElement('button');
      btn.type='button';btn.dataset.risk=g.key;
      btn.innerHTML='<span class="bm-risk-dot" style="background:'+g.color+'"></span><span>'+g.label+' · '+g.value+'</span>';
      btn.addEventListener('click',function(){filter(g.key);});
      legend.appendChild(btn);
    });
    var chips=doc.getElementById('chips');
    if(chips)chips.addEventListener('click',function(){window.requestAnimationFrame(updateLegend);});
    updateLegend();
  }
})();