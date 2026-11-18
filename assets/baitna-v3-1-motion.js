/* BAITNA v3.1 — presentation-only motion. No workflow state, data or network access. */
(function(){
 "use strict";
 function start(){
  var body=document.body;
  if(!body||body.dataset.baitnaSurface!=="landing")return;
  var reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var smallPointer=window.matchMedia&&window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if(reduced||!window.requestAnimationFrame)return;
  body.classList.add("v31-motion");

  // A reading-progress indicator, intentionally distinct from project progress.
  var scheduled=false;
  function updateReading(){
    scheduled=false;
    var total=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    var ratio=Math.max(0,Math.min(100,window.scrollY/total*100));
    document.documentElement.style.setProperty("--v31-rail",ratio.toFixed(2)+"%");
  }
  function requestReading(){
    if(scheduled)return;
    scheduled=true;
    window.requestAnimationFrame(updateReading);
  }
  window.addEventListener("scroll",requestReading,{passive:true});
  window.addEventListener("resize",requestReading,{passive:true});
  requestReading();

  // Progressive reveal: content remains visible if JavaScript fails.
  var selectors=[
   "#lifecycle-v2 .v2-stage",
   "#how .loop li",
   "#parties .parties > div",
   "#pilot .phase"
  ].join(",");
  var features=[].slice.call(document.querySelectorAll(selectors));
  if("IntersectionObserver" in window){
   var reveal=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
     if(!entry.isIntersecting)return;
     entry.target.classList.remove("v31-before");
     entry.target.classList.add("v31-visible");
     reveal.unobserve(entry.target);
    });
   },{rootMargin:"0px 0px -9% 0px",threshold:0.08});
   features.forEach(function(element){
    element.classList.add("v31-reveal");
    if(element.getBoundingClientRect().top>window.innerHeight*.94){
     element.classList.add("v31-before");
     reveal.observe(element);
    }
   });
   // One purely visual active panel; no lifecycle status or approval semantics.
   var stages=[].slice.call(document.querySelectorAll("#lifecycle-v2 .v2-stage"));
   if(stages.length){
    var focus=new IntersectionObserver(function(entries){
     entries.forEach(function(entry){
      if(!entry.isIntersecting)return;
      stages.forEach(function(stage){stage.classList.remove("v31-current")});
      entry.target.classList.add("v31-current");
     });
    },{rootMargin:"-26% 0px -42% 0px",threshold:0.01});
    stages.forEach(function(stage){focus.observe(stage)});
   }
  }

  // Lightweight, frame-coalesced 3D blueprint tilt for fine pointers only.
  if(!smallPointer){
   var sheet=document.querySelector(".hero .sheet");
   if(sheet){
    var frame=0,lastX=0,lastY=0;
    function paint(){
     frame=0;
     var box=sheet.getBoundingClientRect();
     if(!box.width||!box.height)return;
     var x=Math.min(1,Math.max(0,(lastX-box.left)/box.width));
     var y=Math.min(1,Math.max(0,(lastY-box.top)/box.height));
     sheet.style.setProperty("--v31-rot-x",((.5-y)*5).toFixed(2)+"deg");
     sheet.style.setProperty("--v31-rot-y",((x-.5)*7).toFixed(2)+"deg");
     sheet.style.setProperty("--v31-glow-x",(x*100).toFixed(1)+"%");
     sheet.style.setProperty("--v31-glow-y",(y*100).toFixed(1)+"%");
    }
    function pointerMove(e){
     if(e.pointerType&&e.pointerType!=="mouse")return;
     lastX=e.clientX;lastY=e.clientY;
     sheet.classList.add("v31-tilting");
     if(!frame)frame=window.requestAnimationFrame(paint);
    }
    sheet.addEventListener("pointermove",pointerMove,{passive:true});
    sheet.addEventListener("pointerleave",function(){
     if(frame){window.cancelAnimationFrame(frame);frame=0}
     sheet.classList.remove("v31-tilting");
     sheet.style.removeProperty("--v31-rot-x");
     sheet.style.removeProperty("--v31-rot-y");
     sheet.style.removeProperty("--v31-glow-x");
     sheet.style.removeProperty("--v31-glow-y");
    },{passive:true});
   }
  }
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
 else start();
})();