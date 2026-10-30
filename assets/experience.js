/* Baitna Experience 2.0 — dependency-free interaction layer */
(function () {
  'use strict';
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 640px)');
  const isEnglish = () => root.lang === 'en';
  const txt = (ar, en) => isEnglish() ? en : ar;

  // Additional bilingual content stays in sync with the original language switch.
  function localize() {
    document.querySelectorAll('[data-ui-ar][data-ui-en]').forEach(el => {
      el.textContent = el.getAttribute(isEnglish() ? 'data-ui-en' : 'data-ui-ar');
    });
    if (typeof updateDetail === 'function') updateDetail(activeIndex);
    const nodeLabels = document.querySelectorAll('.graph-node');
    nodeLabels.forEach((node, i) => node.setAttribute('aria-label', txt('المرحلة ' + (i + 1) + ': ' + phases[i].arTitle, 'Step ' + (i + 1) + ': ' + phases[i].enTitle)));
  }

  // Navigation: mobile menu and sticky active section.
  const top = document.querySelector('.top');
  const tools = top && top.querySelector('.tools');
  const nav = document.querySelector('.top .nav');
  if (top && tools && nav) {
    const menuButton = document.createElement('button');
    menuButton.type = 'button';
    menuButton.className = 'menu-trigger';
    menuButton.setAttribute('aria-label', 'Open navigation');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-controls', 'mobileNavigation');
    menuButton.innerHTML = '<span aria-hidden="true">☰</span>';
    tools.insertBefore(menuButton, tools.firstChild);
    const menu = document.createElement('nav');
    menu.className = 'mobile-navigation';
    menu.id = 'mobileNavigation';
    menu.setAttribute('aria-label', 'Mobile navigation');
    menu.innerHTML = nav.innerHTML + '<a href="demo/" data-ui-ar="افتح العرض التفاعلي ↗" data-ui-en="Open interactive demo ↗">افتح العرض التفاعلي ↗</a>';
    top.append(menu);
    function closeMenu() {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.innerHTML = '<span aria-hidden="true">☰</span>';
    }
    menuButton.addEventListener('click', () => {
      const open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.innerHTML = open ? '<span aria-hidden="true">×</span>' : '<span aria-hidden="true">☰</span>';
    });
    menu.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    document.addEventListener('pointerdown', e => { if (!top.contains(e.target)) closeMenu(); }, {passive:true});
    const onScroll = () => top.classList.toggle('is-scrolled', window.scrollY > 12);
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
    if ('IntersectionObserver' in window) {
      const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
      const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
      const activeObserver = new IntersectionObserver(entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        const id = visible[0].target.id;
        navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
      }, {rootMargin:'-20% 0px -48% 0px',threshold:[0,.15,.3,.6]});
      sections.forEach(el => activeObserver.observe(el));
    }
  }

  // Progressive entrance animation. Do not hide content when reduced motion is preferred.
  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion');
    const reveals = document.querySelectorAll('section.block h2,section.block .intro,.loop li,.parties div,.scene,.phase,.align li,.graph-shell');
    reveals.forEach(el => el.classList.add('reveal'));
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
      });
    }, {threshold:.09,rootMargin:'0px 0px -28px 0px'});
    reveals.forEach(el => io.observe(el));
  }

  // Zoomable construction elevation and desktop-only tilt.
  const sheet = document.querySelector('.hero .sheet');
  const building = document.querySelector('.hero .elev');
  if (sheet && building) {
    const controls = document.createElement('div');
    controls.className = 'building-tools';
    controls.setAttribute('aria-label','Building illustration zoom');
    controls.innerHTML = '<button type="button" data-building="-1" aria-label="Zoom out building">−</button><button type="button" data-building="1" aria-label="Zoom in building">+</button><button type="button" data-building="0" aria-label="Reset building zoom">↺</button>';
    sheet.append(controls);
    const hud = document.createElement('div');
    hud.className = 'building-hud';
    hud.setAttribute('data-ui-ar','نموذج توضيحي · تقدم البناء');
    hud.setAttribute('data-ui-en','ILLUSTRATIVE · BUILD PROGRESS');
    hud.textContent = 'نموذج توضيحي · تقدم البناء';
    sheet.append(hud);
    let level = 1;
    controls.addEventListener('click', e => {
      const btn = e.target.closest('button[data-building]');
      if (!btn) return;
      const dir = Number(btn.dataset.building);
      level = dir === 0 ? 1 : Math.max(1,Math.min(1.65,level + dir * .13));
      sheet.style.setProperty('--building-zoom',level.toFixed(2));
    });
    if (!reduceMotion.matches && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      sheet.addEventListener('pointermove', e => {
        const rect = sheet.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - .5;
        const y = (e.clientY - rect.top) / rect.height - .5;
        sheet.style.setProperty('--rx',(-y * 4).toFixed(2) + 'deg');
        sheet.style.setProperty('--ry',(x * 5).toFixed(2) + 'deg');
      });
      sheet.addEventListener('pointerleave', () => {
        sheet.style.setProperty('--rx','0deg');
        sheet.style.setProperty('--ry','0deg');
      });
    }
  }

  // 6-stage SVG graph: all data is illustrative, and approvals remain human.
  const phases = [
    {arTitle:'البند',enTitle:'Contract item',ar:'يُستخرج البند من العقد وجدول الكميات، ويرتبط بالمخطط الهندسي ورقم إصداره.',en:'A contract item is linked to the bill of quantities, drawing and revision.'},
    {arTitle:'الدليل',enTitle:'Evidence',ar:'تُرفق الصور المؤرخة وتقارير الفحوص والاختبارات بالبند المعني، مع سجل قابل للتتبع.',en:'Timestamped site photographs, inspections and test results become traceable evidence.'},
    {arTitle:'القرار',enTitle:'Approval',ar:'يراجع صاحب الصلاحية الإثباتات ويصدر قراره الفني أو المالي، مع حفظ الملاحظات.',en:'The authorized person reviews the evidence and records a technical or financial decision.'},
    {arTitle:'الدفعة',enTitle:'Payment',ar:'يُجهز طلب الدفع مع حزمة الإثبات، ويُعرض على المالك والبنك وفق الصلاحيات.',en:'A payment request includes the evidence pack for review by the owner and lender.'},
    {arTitle:'الفاتورة',enTitle:'Invoice',ar:'تُحفظ الفواتير والمستندات المرتبطة بها بصورة منظمة للرجوع إليها لاحقًا.',en:'Invoices and supporting documents are organized for future reference.'},
    {arTitle:'الضمان',enTitle:'Warranty',ar:'تنتقل بيانات الضمان والصيانة إلى سجل المسكن، ليبقى الأثر بعد التسليم.',en:'Warranty and maintenance records stay with the home after handover.'}
  ];
  let activeIndex = 0;
  const graph = document.getElementById('graphViewport');
  const world = document.getElementById('graphWorld');
  const nodes = [...document.querySelectorAll('[data-graph-node]')];
  const positions = [[170,138],[500,112],[820,138],[820,375],[500,410],[170,375]];
  const detailNumber = document.getElementById('graphDetailNumber');
  const detailHeading = document.getElementById('graphDetailHeading');
  const detailText = document.getElementById('graphDetailText');
  const zoomLabel = document.getElementById('zoomLevel');
  function updateDetail(index) {
    if (!detailHeading) return;
    const p = phases[index];
    detailNumber.textContent = String(index + 1).padStart(2,'0');
    detailHeading.textContent = txt(p.arTitle,p.enTitle);
    detailText.textContent = txt(p.ar,p.en);
  }
  if (graph && world && nodes.length) {
    let transform = {x:0,y:0,s:1};
    let raf = 0;
    let dragging = null;
    let dragMoved = false;
    const pointers = new Map();
    let pinch = null;
    const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
    const draw = () => {
      world.setAttribute('transform','translate(' + transform.x.toFixed(2) + ' ' + transform.y.toFixed(2) + ') scale(' + transform.s.toFixed(3) + ')');
      zoomLabel.textContent = Math.round(transform.s * 100) + '%';
    };
    function moveTo(x,y,s,animate) {
      cancelAnimationFrame(raf);
      const from = {...transform}, to = {x,y,s};
      if (!animate || reduceMotion.matches) {transform = to;draw();return;}
      const start = performance.now(), duration = 680;
      const step = now => {
        const p = clamp((now-start)/duration,0,1);
        const ease = 1 - Math.pow(1-p,4);
        transform.x = from.x + (to.x-from.x)*ease;
        transform.y = from.y + (to.y-from.y)*ease;
        transform.s = from.s + (to.s-from.s)*ease;
        draw();
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    function zoom(factor) {
      const s = clamp(transform.s * factor,.7,2);
      const ratio = s/transform.s;
      moveTo(500-(500-transform.x)*ratio,260-(260-transform.y)*ratio,s,true);
    }
    function select(index) {
      activeIndex = index;
      nodes.forEach((n,i) => n.classList.toggle('is-selected',i===index));
      updateDetail(index);
      const [px,py] = positions[index];
      const s = mobile.matches ? 1.2 : 1.3;
      moveTo(500-px*s,260-py*s,s,true);
    }
    nodes.forEach((n,i) => {
      n.addEventListener('click',() => {if (!dragMoved) select(i);});
      n.addEventListener('keydown',e => {
        if (e.key === 'Enter' || e.key === ' ') {e.preventDefault();select(i);}
      });
    });
    document.getElementById('graphPlus').addEventListener('click',()=>zoom(1.18));
    document.getElementById('graphMinus').addEventListener('click',()=>zoom(1/1.18));
    document.getElementById('graphReset').addEventListener('click',()=>moveTo(0,0,1,true));
    // Pointer gestures use SVG viewbox units so they are independent of CSS pixel sizes.
    const unit = () => {
      const r = graph.querySelector('svg').getBoundingClientRect();
      return 1 / Math.min(r.width/1000,r.height/520);
    };
    graph.addEventListener('pointerdown',e => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
      graph.setPointerCapture(e.pointerId);
      cancelAnimationFrame(raf);
      dragMoved = false;
      if (pointers.size === 1) dragging = {x:e.clientX,y:e.clientY,startX:transform.x,startY:transform.y};
      if (pointers.size === 2) {
        const p=[...pointers.values()];
        pinch={distance:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),scale:transform.s};
      }
    });
    graph.addEventListener('pointermove',e => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if (pointers.size === 2 && pinch) {
        const p=[...pointers.values()];
        const d = Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);
        const s = clamp(pinch.scale*d/Math.max(1,pinch.distance),.7,2);
        const ratio=s/transform.s;
        transform.x=500-(500-transform.x)*ratio;
        transform.y=260-(260-transform.y)*ratio;
        transform.s=s; dragMoved=true;draw();return;
      }
      if (!dragging || pointers.size !== 1) return;
      const dx=e.clientX-dragging.x,dy=e.clientY-dragging.y;
      if (Math.abs(dx)+Math.abs(dy)>5) dragMoved=true;
      transform.x=dragging.startX+dx*unit();
      transform.y=dragging.startY+dy*unit();
      graph.classList.toggle('is-dragging',dragMoved);
      draw();
    });
    const release = e => {
      pointers.delete(e.pointerId);
      graph.classList.remove('is-dragging');
      dragging=null;pinch=null;
      // Avoid suppressing a fresh click after the completed drag.
      setTimeout(() => {dragMoved=false;},0);
    };
    graph.addEventListener('pointerup',release);
    graph.addEventListener('pointercancel',release);
    graph.addEventListener('lostpointercapture',e => {pointers.delete(e.pointerId);});
    graph.addEventListener('wheel',e => {
      if (!e.ctrlKey && !e.metaKey) return; // normal wheel should scroll the page
      e.preventDefault();
      const s=clamp(transform.s*(e.deltaY<0?1.09:.92),.7,2);
      const ratio=s/transform.s;
      transform.x=500-(500-transform.x)*ratio;
      transform.y=260-(260-transform.y)*ratio;
      transform.s=s;draw();
    },{passive:false});
    graph.addEventListener('keydown',e => {
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','0'].includes(e.key)) {
        e.preventDefault();
        if (e.key === '+') zoom(1.18);
        else if (e.key === '-') zoom(1/1.18);
        else if (e.key === '0') moveTo(0,0,1,true);
        else {
          transform.x += e.key==='ArrowLeft'?40:e.key==='ArrowRight'?-40:0;
          transform.y += e.key==='ArrowUp'?40:e.key==='ArrowDown'?-40:0;draw();
        }
      }
    });
    draw();
  }

  // One small ambient canvas; frames halt outside the hero and honor reduced motion.
  const hero = document.querySelector('.hero');
  if (hero && !reduceMotion.matches) {
    const canvas = document.createElement('canvas');
    canvas.id = 'ambientCanvas';
    canvas.setAttribute('aria-hidden','true');
    hero.prepend(canvas);
    const ctx=canvas.getContext('2d',{alpha:true});
    if (ctx) {
      let w=0,h=0,dpr=1,inView=true,frame=0,last=0;
      let particles=[];
      const resize=()=>{
        const rect=hero.getBoundingClientRect();
        w=rect.width;h=rect.height;
        dpr=Math.min(window.devicePixelRatio||1,1.5);
        canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
        ctx.setTransform(dpr,0,0,dpr,0,0);
        const count=w<650?14:33;
        particles=Array.from({length:count},(_,i)=>({
          x:(i*.6180339887%1)*w,y:(i*.4142135623%1)*h,
          vx:(i%5-2)*.065,vy:((i*3)%7-3)*.035,
          r:i%4===0?1.5:.85
        }));
      };
      resize();
      window.addEventListener('resize',resize,{passive:true});
      if ('IntersectionObserver' in window) new IntersectionObserver(entries=>{
        inView=entries[0].isIntersecting;
        if (inView && !frame) frame=requestAnimationFrame(render);
      },{threshold:0}).observe(hero);
      function render(t) {
        frame=0;
        if (!inView || document.hidden) return;
        if (t-last<30) {frame=requestAnimationFrame(render);return;}
        last=t;
        ctx.clearRect(0,0,w,h);
        particles.forEach((p,i)=>{
          p.x+=p.vx;p.y+=p.vy;
          if (p.x<0)p.x=w;if(p.x>w)p.x=0;
          if (p.y<0)p.y=h;if(p.y>h)p.y=0;
          ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
          ctx.fillStyle='rgba(173,244,214,.43)';ctx.fill();
          for(let j=i+1;j<particles.length;j++){
            const q=particles[j],dx=q.x-p.x,dy=q.y-p.y,d2=dx*dx+dy*dy;
            if(d2<115*115){
              ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
              ctx.strokeStyle='rgba(151,225,187,' + ((1-Math.sqrt(d2)/115)*.13).toFixed(3) + ')';
              ctx.lineWidth=.65;ctx.stroke();
            }
          }
        });
        frame=requestAnimationFrame(render);
      }
      document.addEventListener('visibilitychange',()=>{
        if(!document.hidden&&!frame)frame=requestAnimationFrame(render);
      });
      frame=requestAnimationFrame(render);
    }
  }

  new MutationObserver(mutations=>{
    if(mutations.some(m=>m.attributeName==='lang')) localize();
  }).observe(root,{attributes:true,attributeFilter:['lang']});
  localize();
})();
